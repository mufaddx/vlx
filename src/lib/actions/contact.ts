"use server";

import { z } from "zod";
import { rateLimit } from "@/lib/utils";
import { headers } from "next/headers";

export async function submitContactAction(formData: FormData) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) return { error: "Too many messages. Try again later." };

  const parsed = z
    .object({
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().toLowerCase().email(),
      topic: z.enum(["help", "safety", "billing", "other"]),
      message: z.string().trim().min(10).max(2000),
    })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      topic: formData.get("topic"),
      message: formData.get("message"),
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  console.info("[contact]", parsed.data.topic, parsed.data.email, parsed.data.message.slice(0, 80));
  return { ok: true as const };
}
