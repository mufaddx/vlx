"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { providers } from "@/lib/providers";
import { ageFromDob, generateOtp, hashValue, safeEqual } from "@/lib/crypto";
import { createUserSession, clearSession, getSessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const identifierSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

export async function sendOtpAction(formData: FormData) {
  const parsedId = identifierSchema.safeParse(String(formData.get("identifier") ?? ""));
  if (!parsedId.success) {
    return { error: parsedId.error.issues[0]?.message ?? "Enter a valid email address" };
  }
  const identifier = parsedId.data;
  const purpose = z.enum(["login", "signup"]).parse(String(formData.get("purpose") ?? "login"));
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`otp:${identifier}:${ip}`, 5, 10 * 60 * 1000);
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
  await providers.otp.send({
    to: identifier,
    channel: "email",
    code,
    purpose,
  });
  const show = process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true" && process.env.NODE_ENV !== "production";
  return { ok: true as const, hint: show ? code : undefined };
}

export async function verifyOtpAction(formData: FormData) {
  const parsedId = identifierSchema.safeParse(String(formData.get("identifier") ?? ""));
  if (!parsedId.success) {
    return { error: parsedId.error.issues[0]?.message ?? "Enter a valid email address" };
  }
  const identifier = parsedId.data;
  const purpose = z.enum(["login", "signup"]).parse(String(formData.get("purpose") ?? "login"));
  const code = z.string().trim().min(4).max(8).parse(String(formData.get("code") ?? ""));

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
    if (!user.termsAcceptedAt) redirect("/setup");
    redirect("/home");
  }

  return { ok: true as const, verified: true };
}

const setupSchema = z.object({
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

export async function completeSignupAction(formData: FormData) {
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

  if (data.datingOptIn === "yes") redirect("/dating/setup");
  redirect("/home");
}

export async function completeSetupAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const parsed = setupSchema.omit({ identifier: true }).safeParse({
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
  if (ageFromDob(dob) < 18) {
    return { error: "You must be 18 or older to use VIDLIX." };
  }
  const taken = await prisma.user.findFirst({
    where: { username: data.username, NOT: { id: user.id } },
  });
  if (taken) return { error: "That username is taken." };
  const now = new Date();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      dateOfBirth: dob,
      gender: data.gender,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      guidelinesAcceptedAt: now,
      datingOptIn: data.datingOptIn,
    },
  });
  if (data.datingOptIn === "yes") redirect("/dating/setup");
  redirect("/home");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
