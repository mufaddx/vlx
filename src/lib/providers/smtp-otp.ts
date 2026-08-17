import nodemailer from "nodemailer";
import type { OtpProvider } from "./types";

function env(name: string) {
  return (process.env[name] ?? "").trim().replace(/^['"]|['"]$/g, "");
}

export function smtpConfigured() {
  return Boolean(env("SMTP_USER") && env("SMTP_PASS"));
}

function isAuthError(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code?: unknown }).code) : "";
  const msg = err instanceof Error ? err.message : String(err);
  return code === "EAUTH" || /invalid login|authentication failed|535/i.test(msg);
}

export class SmtpOtpProvider implements OtpProvider {
  async send(input: {
    to: string;
    channel: "email" | "sms";
    code: string;
    purpose: string;
  }): Promise<void> {
    if (input.channel !== "email") return;
    const user = env("SMTP_USER");
    const rawPass = env("SMTP_PASS");
    if (!user || !rawPass) {
      throw new Error("SMTP is not configured");
    }
    const host = env("SMTP_HOST") || "smtp.hostinger.com";
    const preferred = Number(env("SMTP_PORT") || "465") || 465;
    const from = env("SMTP_FROM") || user;
    const action = input.purpose === "signup" ? "sign up" : "log in";
    const payload = {
      from,
      to: input.to,
      subject: `Your VIDLIX ${action} code`,
      text: `Your VIDLIX ${action} code is ${input.code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your VIDLIX ${action} code is <strong style="letter-spacing:0.2em">${input.code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`,
    };

    const sendOn = async (port: number, pass: string) => {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 12_000,
        greetingTimeout: 12_000,
        socketTimeout: 20_000,
      });
      await transporter.sendMail(payload);
    };

    const compactPass = rawPass.replace(/[\s-]/g, "");
    const passwords = compactPass !== rawPass ? [rawPass, compactPass] : [rawPass];
    const ports = preferred === 587 ? [587, 465] : [465, 587];

    let lastErr: unknown;
    for (const pass of passwords) {
      for (const port of ports) {
        try {
          await sendOn(port, pass);
          return;
        } catch (err) {
          lastErr = err;
          if (isAuthError(err)) break;
        }
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("SMTP send failed");
  }
}
