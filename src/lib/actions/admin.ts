"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  adminHas,
  audit,
  clearAdminSession,
  createAdminSession,
  getAdmin,
  hashValue,
} from "@/lib/admin-auth";

export async function adminLoginAction(formData: FormData) {
  const email = z.string().email().parse(String(formData.get("email") ?? ""));
  const password = z.string().min(6).parse(String(formData.get("password") ?? ""));
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin || !admin.active || admin.passwordHash !== hashValue(password)) {
    return { error: "Invalid admin credentials." };
  }
  await createAdminSession(admin.id);
  await audit(admin.id, "admin.login");
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function requireAdminKey(key: string) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (!adminHas(admin, key) && !adminHas(admin, "*")) {
    return { admin, denied: true as const };
  }
  return { admin, denied: false as const };
}

export async function adminSuspendUserAction(userId: string, status: "active" | "suspended" | "banned") {
  const gate = await requireAdminKey("users.write");
  if (gate.denied) return { error: "Not allowed." };
  await prisma.user.update({ where: { id: userId }, data: { status } });
  await audit(gate.admin.id, `user.${status}`, "user", userId);
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function adminSavePlanAction(formData: FormData) {
  const gate = await requireAdminKey("subscriptions");
  if (gate.denied) return { error: "Not allowed." };
  const id = String(formData.get("id") ?? "");
  const data = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "").toLowerCase(),
    priceCents: Number(formData.get("priceCents") ?? 0),
    durationDays: Number(formData.get("durationDays") ?? 30),
    maxSponsoredUsers: Number(formData.get("maxSponsoredUsers") ?? 0),
    freeMessageLimit: Number(formData.get("freeMessageLimit") ?? 10),
    chatAccess: formData.get("chatAccess") === "on",
    videoCallAccess: formData.get("videoCallAccess") === "on",
    randomVideoAccess: formData.get("randomVideoAccess") === "on",
    datingAccess: formData.get("datingAccess") === "on",
    liveAccess: formData.get("liveAccess") === "on",
    usernameVisibility: formData.get("usernameVisibility") === "on",
    trialDays: Number(formData.get("trialDays") ?? 0),
    discountPercent: Number(formData.get("discountPercent") ?? 0),
    status: String(formData.get("status") ?? "active"),
    highlight: formData.get("highlight") === "on",
  };
  if (id) await prisma.subscriptionPlan.update({ where: { id }, data });
  else await prisma.subscriptionPlan.create({ data: { ...data, sortOrder: 99 } });
  await audit(gate.admin.id, "plan.save", "plan", id || data.slug);
  revalidatePath("/admin/plans");
  revalidatePath("/");
  return { ok: true as const };
}

export async function adminSaveCmsAction(formData: FormData) {
  const gate = await requireAdminKey("cms");
  if (gate.denied) return { error: "Not allowed." };
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  await prisma.cmsPage.upsert({
    where: { slug },
    update: { title, body, seoTitle: `${title} · VIDLIX`, seoDescription: body.slice(0, 155) },
    create: { slug, title, body, excerpt: body.slice(0, 140) },
  });
  await audit(gate.admin.id, "cms.save", "cms", slug);
  revalidatePath("/admin/cms");
  revalidatePath(`/${slug}`);
  return { ok: true as const };
}

export async function adminSaveFaqAction(formData: FormData) {
  const gate = await requireAdminKey("cms");
  if (gate.denied) return { error: "Not allowed." };
  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "");
  const answer = String(formData.get("answer") ?? "");
  if (id) await prisma.faqItem.update({ where: { id }, data: { question, answer } });
  else await prisma.faqItem.create({ data: { question, answer, sortOrder: 99, published: true } });
  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { ok: true as const };
}

export async function adminSaveSettingAction(key: string, value: string) {
  const gate = await requireAdminKey("settings");
  if (gate.denied) return { error: "Not allowed." };
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await audit(gate.admin.id, "settings.save", "setting", key, { value });
  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function adminModerationAction(reportId: string, action: "warn" | "suspend" | "ban" | "dismiss") {
  const gate = await requireAdminKey("moderation");
  if (gate.denied) return { error: "Not allowed." };
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) return { error: "Report missing." };
  const status = action === "dismiss" ? "dismissed" : "actioned";
  await prisma.report.update({ where: { id: reportId }, data: { status } });
  if (report.toUserId && action !== "dismiss") {
    const next = action === "ban" ? "banned" : action === "suspend" ? "suspended" : "active";
    if (next !== "active") await prisma.user.update({ where: { id: report.toUserId }, data: { status: next } });
  }
  await audit(gate.admin.id, `moderation.${action}`, "report", reportId);
  revalidatePath("/admin/reports");
  return { ok: true as const };
}

export async function adminGrantPlanAction(userId: string, planId: string) {
  const gate = await requireAdminKey("subscriptions");
  if (gate.denied) return { error: "Not allowed." };
  await prisma.subscription.updateMany({ where: { userId, status: "active" }, data: { status: "cancelled" } });
  await prisma.subscription.create({ data: { userId, planId, status: "active" } });
  await audit(gate.admin.id, "subscription.grant", "user", userId, { planId });
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function adminKycAction(userId: string, status: "approved" | "rejected") {
  const gate = await requireAdminKey("moderation");
  if (gate.denied) return { error: "Not allowed." };
  await prisma.kycProfile.update({ where: { userId }, data: { status } });
  await audit(gate.admin.id, `kyc.${status}`, "user", userId);
  revalidatePath("/admin/kyc");
  return { ok: true as const };
}

export async function adminWithdrawalAction(id: string, status: "approved" | "rejected") {
  const gate = await requireAdminKey("settings");
  if (gate.denied) return { error: "Not allowed." };
  await prisma.withdrawalRequest.update({ where: { id }, data: { status } });
  await audit(gate.admin.id, `withdrawal.${status}`, "withdrawal", id);
  revalidatePath("/admin/withdrawals");
  return { ok: true as const };
}
