"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSetting } from "@/lib/utils";
import { providers } from "@/lib/providers";

export async function sendGiftAction(giftId: string, receiverId: string) {
  const me = await requireUser();
  const enabled = await getSetting("monetization_enabled", "false");
  if (enabled !== "true") return { error: "Gifts are not enabled yet." };
  const gift = await prisma.gift.findUnique({ where: { id: giftId } });
  if (!gift || !gift.active) return { error: "Gift unavailable." };
  if (me.coinBalance < gift.coinValue) return { error: "Not enough coins." };
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: me.id }, data: { coinBalance: { decrement: gift.coinValue } } });
    await tx.giftTransaction.create({
      data: { giftId: gift.id, senderId: me.id, receiverId },
    });
    const earning = await tx.creatorEarning.upsert({
      where: { userId: receiverId },
      create: { userId: receiverId, balanceCents: gift.coinValue },
      update: { balanceCents: { increment: gift.coinValue } },
    });
    await tx.earningTransaction.create({
      data: { earningId: earning.id, amountCents: gift.coinValue, type: "gift" },
    });
  });
  revalidatePath("/earnings");
  return { ok: true as const };
}

export async function submitKycAction(notes: string) {
  const me = await requireUser();
  await prisma.kycProfile.upsert({
    where: { userId: me.id },
    create: { userId: me.id, status: "pending", notes },
    update: { status: "pending", notes },
  });
  revalidatePath("/earnings");
  return { ok: true as const };
}

export async function requestWithdrawalAction(amountCents: number) {
  const me = await requireUser();
  const earning = await prisma.creatorEarning.findUnique({ where: { userId: me.id } });
  if (!earning || earning.balanceCents < amountCents) return { error: "Insufficient earnings." };
  const kyc = await prisma.kycProfile.findUnique({ where: { userId: me.id } });
  if (kyc?.status !== "approved") return { error: "KYC must be approved before withdrawals." };
  const w = await prisma.withdrawalRequest.create({
    data: { userId: me.id, amountCents, status: "pending" },
  });
  await providers.payout.payout({ withdrawalId: w.id, amountCents });
  revalidatePath("/earnings");
  return { ok: true as const };
}
