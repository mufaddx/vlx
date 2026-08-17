"use server";

import { prisma } from "@/lib/db";
import { ageFromDob } from "@/lib/crypto";
import { clearSession, getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { performCompleteSignup, performSendOtp, performVerifyOtp, setupSchema } from "@/lib/otp-service";

export async function sendOtpAction(formData: FormData) {
  return performSendOtp(formData);
}

export async function verifyOtpAction(formData: FormData) {
  const res = await performVerifyOtp(formData);
  if ("next" in res && res.next) redirect(res.next);
  return res;
}

export async function completeSignupAction(formData: FormData) {
  const res = await performCompleteSignup(formData);
  if ("next" in res && res.next) redirect(res.next);
  return res;
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
