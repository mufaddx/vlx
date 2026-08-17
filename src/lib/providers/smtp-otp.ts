import type { OtpProvider } from "./types";

export function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export class SmtpOtpProvider implements OtpProvider {
  async send(input: {
    to: string;
    channel: "email" | "sms";
    code: string;
    purpose: string;
  }): Promise<void> {
    if (input.channel !== "email") return;
    if (!smtpConfigured()) {
      throw new Error("SMTP is not configured");
    }
    const mailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT ?? 465);
    const transporter = mailer.default.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const from = process.env.SMTP_FROM ?? `VIDLIX <${process.env.SMTP_USER}>`;
    const action = input.purpose === "signup" ? "sign up" : "log in";
    await transporter.sendMail({
      from,
      to: input.to,
      subject: `Your VIDLIX ${action} code`,
      text: `Your VIDLIX ${action} code is ${input.code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your VIDLIX ${action} code is <strong style="letter-spacing:0.2em">${input.code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`,
    });
  }
}
