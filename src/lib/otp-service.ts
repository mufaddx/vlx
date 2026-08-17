import { z } from "zod";
import { prisma } from "@/lib/db";
import { ageFromDob, generateOtp, hashValue, safeEqual } from "@/lib/crypto";
import { createUserSession } from "@/lib/auth";
import { rateLimit } from "@/lib/utils";
import { headers } from "next/headers";

const identifierSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

export function publicSendError(err: unknown) {
  const code =
    typeof err === "object" && err && "code" in err ? String((err as { code?: unknown }).code) : "";
  const msg = err instanceof Error ? err.message : "";
  if (code.startsWith("P100") || code === "P1017" || /can't reach database|connection/i.test(msg)) {
    return "Could not reach the database. Check DATABASE_URL on the server.";
  }
  if (code === "P2021" || code === "P2022" || /does not exist/i.test(msg)) {
    return "Database tables are missing. On the server run: npx prisma db push";
  }
  if (code === "EAUTH" || /invalid login|authentication failed|535/i.test(msg)) {
    return "Hostinger rejected the mailbox password. In Emails → Email accounts, reset the password for noreply@vidlix.in, paste that same password into SMTP_PASS (no quotes), save, then Rebuild the Node app.";
  }
  if (
    ["ESOCKET", "ECONNECTION", "ETIMEDOUT", "ECONNREFUSED", "EDNS", "EAI_AGAIN", "ETLS"].includes(code) ||
    /connect|timeout|socket/i.test(msg)
  ) {
    return "Could not reach smtp.hostinger.com. Try SMTP_PORT=587, or allow outbound mail on the Node host.";
  }
  if (/SMTP is not configured/i.test(msg)) {
    return "SMTP is not set. Add SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM on the server, then redeploy.";
  }
  return "Could not send the email code. Try again in a minute.";
}

export async function performSendOtp(formData: FormData) {
  try {
    const parsedId = identifierSchema.safeParse(String(formData.get("identifier") ?? ""));
    if (!parsedId.success) {
      return { error: parsedId.error.issues[0]?.message ?? "Enter a valid email address" };
    }
    const identifier = parsedId.data;
    const purposeParsed = z.enum(["login", "signup"]).safeParse(String(formData.get("purpose") ?? "login"));
    if (!purposeParsed.success) return { error: "Invalid request." };
    const purpose = purposeParsed.data;
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limited = rateLimit(`otp:${identifier}:${ip}`, 20, 10 * 60 * 1000);
    if (!limited.ok) {
      return { error: "Too many OTP requests. Try again later." };
    }

    const existing = await prisma.user.findFirst({
      where: { email: identifier },
    });
    if (purpose === "login" && !existing) {
      return { error: "No account found. Create one instead." };
    }
    if (purpose === "signup" && existing) {
      return { error: "An account already exists. Log in instead." };
    }

    const code = generateOtp();
    await prisma.otpVerification.create({
      data: {
        identifier,
        channel: "email",
        codeHash: hashValue(code),
        purpose,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        ipAddress: ip,
      },
    });
    const smtpUser = (process.env.SMTP_USER ?? "").trim();
    const smtpPass = (process.env.SMTP_PASS ?? "").trim();
    if (smtpUser && smtpPass) {
      try {
        const { SmtpOtpProvider } = await import("@/lib/providers/smtp-otp");
        await new SmtpOtpProvider().send({
          to: identifier,
          channel: "email",
          code,
          purpose,
        });
      } catch (mailErr) {
        console.error("performSendOtp.smtp", mailErr);
        return { error: publicSendError(mailErr) };
      }
    } else if (process.env.NODE_ENV === "production") {
      return { error: "SMTP is not set. Add SMTP_USER and SMTP_PASS on Hostinger, then redeploy." };
    } else {
      const { providers } = await import("@/lib/providers");
      await providers.otp.send({
        to: identifier,
        channel: "email",
        code,
        purpose,
      });
    }
    const show = process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true" && process.env.NODE_ENV !== "production";
    return { ok: true as const, hint: show ? code : undefined };
  } catch (err) {
    console.error("performSendOtp", err);
    return { error: publicSendError(err) };
  }
}

export async function performVerifyOtp(formData: FormData) {
  try {
    const parsedId = identifierSchema.safeParse(String(formData.get("identifier") ?? ""));
    if (!parsedId.success) {
      return { error: parsedId.error.issues[0]?.message ?? "Enter a valid email address" };
    }
    const identifier = parsedId.data;
    const purposeParsed = z.enum(["login", "signup"]).safeParse(String(formData.get("purpose") ?? "login"));
    if (!purposeParsed.success) return { error: "Invalid request." };
    const purpose = purposeParsed.data;
    const codeParsed = z.string().trim().min(4).max(8).safeParse(String(formData.get("code") ?? ""));
    if (!codeParsed.success) return { error: "Enter the code from your email." };
    const code = codeParsed.data;

    const otp = await prisma.otpVerification.findFirst({
      where: {
        identifier: identifier.toLowerCase(),
        purpose,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) return { error: "Code expired. Request a new one." };
    if (otp.attempts >= 5) return { error: "Too many attempts. Request a new code." };

    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });

    if (!safeEqual(otp.codeHash, hashValue(code))) {
      return { error: "Invalid code." };
    }

    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });

    if (purpose === "login") {
      const user = await prisma.user.findFirst({
        where: { email: identifier },
      });
      if (!user) return { error: "Account not found." };
      const hdrs = await headers();
      await createUserSession(user.id, {
        userAgent: hdrs.get("user-agent") ?? undefined,
        ip: hdrs.get("x-forwarded-for")?.split(",")[0]?.trim(),
      });
      return { ok: true as const, next: user.termsAcceptedAt ? "/home" : "/setup" };
    }

    return { ok: true as const, verified: true };
  } catch (err) {
    console.error("performVerifyOtp", err);
    return { error: "Could not verify the code. Try again." };
  }
}

export const setupSchema = z.object({
  identifier: identifierSchema,
  firstName: z.string().trim().min(1).max(40),
  lastName: z.string().trim().min(1).max(40),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_]+$/, "Username can only include letters, numbers, and underscore"),
  dateOfBirth: z.string(),
  gender: z.enum(["female", "male", "non_binary", "prefer_not"]),
  terms: z.literal("on"),
  privacy: z.literal("on"),
  guidelines: z.literal("on"),
  datingOptIn: z.enum(["yes", "no", "later"]),
});

export async function performCompleteSignup(formData: FormData) {
  const parsed = setupSchema.safeParse({
    identifier: formData.get("identifier"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    terms: formData.get("terms"),
    privacy: formData.get("privacy"),
    guidelines: formData.get("guidelines"),
    datingOptIn: formData.get("datingOptIn"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  const data = parsed.data;
  const dob = new Date(data.dateOfBirth);
  if (Number.isNaN(dob.getTime()) || ageFromDob(dob) < 18) {
    return { error: "You must be 18 or older to create a VIDLIX account." };
  }

  const verified = await prisma.otpVerification.findFirst({
    where: {
      identifier: data.identifier.toLowerCase(),
      purpose: "signup",
      consumedAt: { not: null },
      createdAt: { gt: new Date(Date.now() - 30 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!verified) return { error: "Verify your email before finishing signup." };

  const taken = await prisma.user.findUnique({ where: { username: data.username } });
  if (taken) return { error: "That username is taken." };

  const email = data.identifier;
  const now = new Date();
  const user = await prisma.user.create({
    data: {
      email,
      phone: null,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: dob,
      gender: data.gender,
      emailVerifiedAt: now,
      phoneVerifiedAt: null,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      guidelinesAcceptedAt: now,
      datingOptIn: data.datingOptIn,
      profile: { create: { bio: "" } },
      privacy: { create: {} },
      preferences: { create: {} },
    },
  });

  const free = await prisma.subscriptionPlan.findUnique({ where: { slug: "free" } });
  if (free) {
    await prisma.subscription.create({
      data: { userId: user.id, planId: free.id, status: "active" },
    });
  }

  const hdrs = await headers();
  await createUserSession(user.id, {
    userAgent: hdrs.get("user-agent") ?? undefined,
    ip: hdrs.get("x-forwarded-for")?.split(",")[0]?.trim(),
  });

  return { ok: true as const, next: data.datingOptIn === "yes" ? "/dating/setup" : "/home" };
}
