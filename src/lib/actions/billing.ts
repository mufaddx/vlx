"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements } from "@/lib/social";
import { notify } from "@/lib/notify";
import { providers } from "@/lib/providers";

export async function startCheckoutAction(planId: string) {
  const me = await requireUser();
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.status !== "active") return { error: "Plan unavailable." };
  if (plan.priceCents === 0) {
    await prisma.subscription.updateMany({ where: { userId: me.id, status: "active" }, data: { status: "cancelled" } });
    await prisma.subscription.create({ data: { userId: me.id, planId: plan.id, status: "active" } });
    revalidatePath("/subscription");
    return { ok: true as const };
  }
  try {
    const checkout = await providers.payment.createCheckout({
      userId: me.id,
      planId: plan.id,
      amountCents: plan.priceCents,
      currency: plan.currency,
    });
    await prisma.payment.create({
      data: {
        userId: me.id,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: "pending",
        provider: "configured",
        providerRef: checkout.providerRef,
      },
    });
    return { url: checkout.checkoutUrl };
  } catch {
    await prisma.payment.create({
      data: {
        userId: me.id,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: "pending",
        provider: "mock",
      },
    });
    return {
      error:
        "Payment provider is not connected. No charge was made. An admin can attach this plan after a real payment.",
    };
  }
}

export async function inviteSponsoredAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const me = await requireUser();
  const ent = await getEntitlements(me.id);
  if (ent.maxSponsoredUsers < 1) return { error: "Your plan has no sponsored connection slots." };
  const used = await prisma.sponsoredConnection.count({
    where: { sponsorId: me.id, status: { in: ["pending", "active"] } },
  });
  if (used >= ent.maxSponsoredUsers) return { error: "No sponsored slots left on your plan." };
  const recipient = await prisma.user.findUnique({ where: { username: username.trim().toLowerCase() } });
  if (!recipient || recipient.id === me.id) return { error: "VIDLIX username not found." };
  await prisma.sponsoredConnection.upsert({
    where: { sponsorId_recipientId: { sponsorId: me.id, recipientId: recipient.id } },
    update: { status: "pending" },
    create: { sponsorId: me.id, recipientId: recipient.id, status: "pending" },
  });
  await notify(
    recipient.id,
    "sponsored_connection",
    "Sponsored Premium Connection",
    `${me.username} offered you sponsored premium connection access.`,
    "/subscription",
  );
  revalidatePath("/subscription");
  return { ok: true as const };
}

export async function respondSponsoredAction(id: string, accept: boolean) {
  const me = await requireUser();
  const row = await prisma.sponsoredConnection.findUnique({ where: { id } });
  if (!row || row.recipientId !== me.id) return { error: "Invite not found." };
  await prisma.sponsoredConnection.update({
    where: { id },
    data: { status: accept ? "active" : "declined", acceptedAt: accept ? new Date() : null },
  });
  if (accept) {
    await notify(row.sponsorId, "sponsored_connection", "Sponsored connection active", "They accepted. You keep your own subscription.", "/subscription");
  }
  revalidatePath("/subscription");
  return { ok: true as const };
}
