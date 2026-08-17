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
    const pass = env("SMTP_PASS").replace(/\s+/g, "");
    if (!user || !pass) {
      throw new Error("SMTP is not configured");
    }
    const host = env("SMTP_HOST") || "smtp.hostinger.com";
    const preferred = Number(env("SMTP_PORT") || "465") || 465;
    const from = env("SMTP_FROM") || `VIDLIX <${user}>`;
    const action = input.purpose === "signup" ? "sign up" : "log in";
    const payload = {
      from,
      to: input.to,
      subject: `Your VIDLIX ${action} code`,
      text: `Your VIDLIX ${action} code is ${input.code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your VIDLIX ${action} code is <strong style="letter-spacing:0.2em">${input.code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`,
    };

    const sendOn = async (port: number) => {
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

    try {
      await sendOn(preferred);
    } catch {
      if (preferred === 587) {
        await sendOn(465);
        return;
      }
      await sendOn(587);
    }
  }
}
