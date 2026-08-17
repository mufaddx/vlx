"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { maskedDisplayName } from "@/lib/crypto";
import { rateLimit } from "@/lib/utils";
import { connectionPair } from "@/lib/ids";
import { canSendFollow, isBlockedEitherWay } from "@/lib/social";

async function notify(userId: string, type: string, title: string, body: string, href?: string) {
  await prisma.notification.create({ data: { userId, type, title, body, href } });
}

export async function sendFollowRequestAction(targetId: string) {
  const me = await requireUser();
  const limited = rateLimit(`follow:${me.id}`, 30, 60 * 1000);
  if (!limited.ok) return { error: "Too many follow actions. Slow down." };

  const allowed = await canSendFollow(me.id, targetId);
  if (!allowed.ok) return { error: allowed.error };

  const existingFollow = await prisma.follow.findUnique({
    where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: targetId } },
  });
  if (existingFollow) return { error: "You already follow this user." };

  const masked = maskedDisplayName(me.firstName, me.lastName);
  const row = await prisma.followRequest.upsert({
    where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: targetId } },
    update: { status: "pending", maskedName: masked },
    create: {
      fromUserId: me.id,
      toUserId: targetId,
      status: "pending",
      maskedName: masked,
    },
  });

  await notify(
    targetId,
    "follow_request",
    "Follow request",
    `${masked} wants to follow you.`,
    "/connections?tab=requests",
  );
  revalidatePath("/search");
  revalidatePath("/connections");
  revalidatePath("/notifications");
  revalidatePath(`/u/${(await prisma.user.findUnique({ where: { id: targetId } }))?.username ?? ""}`);
  return { ok: true as const, requestId: row.id };
}

export async function cancelFollowRequestAction(targetId: string) {
  const me = await requireUser();
  await prisma.followRequest.updateMany({
    where: { fromUserId: me.id, toUserId: targetId, status: "pending" },
    data: { status: "cancelled" },
  });
  revalidatePath("/search");
  revalidatePath("/connections");
  return { ok: true as const };
}

export async function acceptFollowRequestAction(requestId: string) {
  const me = await requireUser();
  const req = await prisma.followRequest.findUnique({ where: { id: requestId } });
  if (!req || req.toUserId !== me.id || req.status !== "pending") {
    return { error: "Request not found." };
  }
  if (await isBlockedEitherWay(me.id, req.fromUserId)) {
    return { error: "You cannot accept this request." };
  }

  const pair = connectionPair(req.fromUserId, req.toUserId);
  await prisma.$transaction(async (tx) => {
    await tx.followRequest.update({
      where: { id: req.id },
      data: { status: "accepted" },
    });
    await tx.follow.upsert({
      where: { fromUserId_toUserId: { fromUserId: req.fromUserId, toUserId: req.toUserId } },
      update: {},
      create: { fromUserId: req.fromUserId, toUserId: req.toUserId },
    });
    await tx.connection.upsert({
      where: { userAId_userBId: pair },
      update: {},
      create: pair,
    });
    await tx.profile.update({
      where: { userId: req.toUserId },
      data: { followersCount: { increment: 1 } },
    });
    await tx.profile.update({
      where: { userId: req.fromUserId },
      data: { followingCount: { increment: 1 } },
    });
  });

  await notify(
    req.fromUserId,
    "follow_accepted",
    "Follow accepted",
    "Your follow request was accepted. You are now connected.",
    "/connections",
  );
  revalidatePath("/connections");
  revalidatePath("/notifications");
  revalidatePath("/profile");
  return { ok: true as const };
}

export async function declineFollowRequestAction(requestId: string) {
  const me = await requireUser();
  await prisma.followRequest.updateMany({
    where: { id: requestId, toUserId: me.id, status: "pending" },
    data: { status: "declined" },
  });
  revalidatePath("/connections");
  return { ok: true as const };
}

export async function unfollowAction(targetId: string) {
  const me = await requireUser();
  const existing = await prisma.follow.findUnique({
    where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: targetId } },
  });
  if (!existing) return { ok: true as const };
  await prisma.$transaction(async (tx) => {
    await tx.follow.delete({ where: { id: existing.id } });
    await tx.profile.update({
      where: { userId: targetId },
      data: { followersCount: { decrement: 1 } },
    });
    await tx.profile.update({
      where: { userId: me.id },
      data: { followingCount: { decrement: 1 } },
    });
  });
  revalidatePath("/profile");
  revalidatePath("/connections");
  return { ok: true as const };
}

export async function blockUserAction(targetId: string) {
  const me = await requireUser();
  if (me.id === targetId) return { error: "You cannot block yourself." };
  await prisma.$transaction(async (tx) => {
    await tx.block.upsert({
      where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: targetId } },
      update: {},
      create: { fromUserId: me.id, toUserId: targetId },
    });
    await tx.follow.deleteMany({
      where: {
        OR: [
          { fromUserId: me.id, toUserId: targetId },
          { fromUserId: targetId, toUserId: me.id },
        ],
      },
    });
    await tx.followRequest.updateMany({
      where: {
        OR: [
          { fromUserId: me.id, toUserId: targetId },
          { fromUserId: targetId, toUserId: me.id },
        ],
        status: "pending",
      },
      data: { status: "cancelled" },
    });
    const pair = connectionPair(me.id, targetId);
    await tx.connection.deleteMany({ where: pair });
  });
  revalidatePath("/search");
  revalidatePath("/connections");
  return { ok: true as const };
}

export async function unblockUserAction(targetId: string) {
  const me = await requireUser();
  await prisma.block.deleteMany({ where: { fromUserId: me.id, toUserId: targetId } });
  revalidatePath("/connections");
  return { ok: true as const };
}

export async function reportUserAction(formData: FormData) {
  const me = await requireUser();
  const targetId = z.string().min(1).parse(String(formData.get("targetId") ?? ""));
  const reason = z
    .enum(["harassment", "spam", "fake_profile", "scam", "abuse", "sexual_content", "other"])
    .parse(String(formData.get("reason") ?? "other"));
  const details = z.string().max(1000).parse(String(formData.get("details") ?? ""));
  if (me.id === targetId) return { error: "You cannot report yourself." };
  await prisma.report.create({
    data: {
      fromUserId: me.id,
      toUserId: targetId,
      targetType: "user",
      targetId,
      reason,
      details,
      status: "open",
    },
  });
  return { ok: true as const };
}

export async function markNotificationsReadAction() {
  const me = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: me.id, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/notifications");
  return { ok: true as const };
}
