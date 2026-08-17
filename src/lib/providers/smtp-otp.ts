import nodemailer from "nodemailer";
import type { OtpProvider } from "./types";

function env(name: string) {
  return (process.env[name] ?? "").trim().replace(/^['"]|['"]$/g, "");
}

export function smtpConfigured() {
  return Boolean(env("SMTP_USER") && env("SMTP_PASS"));
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
    const pass = env("SMTP_PASS");
    if (!user || !pass) {
      throw new Error("SMTP is not configured");
    }
    const preferredHost = env("SMTP_HOST") || "smtp.hostinger.com";
    const hosts = [...new Set([preferredHost, "smtp.hostinger.com", "smtp.titan.email"])];
    const preferredPort = Number(env("SMTP_PORT") || "465") || 465;
    const ports = preferredPort === 587 ? [587, 465] : [465, 587];
    const action = input.purpose === "signup" ? "sign up" : "log in";
    const payload = {
      from: user,
      to: input.to,
      subject: `Your VIDLIX ${action} code`,
      text: `Your VIDLIX ${action} code is ${input.code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your VIDLIX ${action} code is <strong style="letter-spacing:0.2em">${input.code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`,
    };

    let lastErr: unknown;
    for (const host of hosts) {
      for (const port of ports) {
        try {
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
          return;
        } catch (err) {
          lastErr = err;
          console.error("smtp.send.try", { host, port, code: (err as { code?: string })?.code });
        }
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("SMTP send failed");
  }
}
