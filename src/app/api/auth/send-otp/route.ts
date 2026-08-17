import { performSendOtp } from "@/lib/otp-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await performSendOtp(formData);
    return Response.json(result);
  } catch (err) {
    console.error("POST /api/auth/send-otp", err);
    return Response.json({ error: "Could not send the email code. Try again in a minute." });
  }
}
