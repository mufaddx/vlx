import type { OtpProvider } from "./types";

export class MockOtpProvider implements OtpProvider {
  async send(input: {
    to: string;
    channel: "email" | "sms";
    code: string;
    purpose: string;
  }): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      console.info(`[otp:mock] would send ${input.channel} OTP to ${input.to} for ${input.purpose}`);
      return;
    }
    console.info(
      `[otp:mock] ${input.channel} → ${input.to} purpose=${input.purpose} code=${input.code}`,
    );
  }
}
