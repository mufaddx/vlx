"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/utils";
import { areConnected, isBlockedEitherWay } from "@/lib/social";
import { chatPermission, otherUserId } from "@/lib/chat";
import { notify } from "@/lib/notify";
import { connectionPair } from "@/lib/ids";

export async function sendMessageAction(formData: FormData) {
  const me = await requireUser();
  const connectionId = z.string().min(1).parse(String(formData.get("connectionId") ?? ""));
  const body = z.string().trim().min(1).max(2000).parse(String(formData.get("body") ?? ""));
  const limited = rateLimit(`msg:${me.id}`, 40, 60 * 1000);
  if (!limited.ok) return { error: "You are sending messages too quickly." };

  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection || (connection.userAId !== me.id && connection.userBId !== me.id)) {
    return { error: "Conversation not found." };
  }
  const peerId = await otherUserId(connection, me.id);
  if (await isBlockedEitherWay(me.id, peerId)) return { error: "You cannot message this user." };

  const gate = await chatPermission(me.id, peerId, connectionId);
  if (!gate.ok) {
    await notify(me.id, "connection", "Message limit", gate.error, `/messages/${connectionId}`);
    await notify(peerId, "connection", "Message limit", "Your free connection limit has ended.", `/messages/${connectionId}`);
    return { error: gate.error, limitReached: "limitReached" in gate };
  }

  await prisma.message.create({
    data: { connectionId, senderId: me.id, receiverId: peerId, body },
  });
  await prisma.typingState.deleteMany({ where: { connectionId, userId: me.id } });
  await notify(peerId, "message", "New message", body.slice(0, 80), `/messages/${connectionId}`);

  const after = await chatPermission(me.id, peerId, connectionId);
  if (!after.ok && "limitReached" in after) {
    await notify(me.id, "connection", "Limit reached", "Connection limit reached. Activate Premium for this user.", `/subscription`);
    await notify(peerId, "connection", "Limit reached", "Your free connection limit has ended.", `/subscription`);
  }

  revalidatePath(`/messages/${connectionId}`);
  revalidatePath("/messages");
  return { ok: true as const };
}

export async function markReadAction(connectionId: string) {
  const me = await requireUser();
  const unread = await prisma.message.findMany({
    where: { connectionId, receiverId: me.id, reads: { none: { userId: me.id } } },
    select: { id: true },
  });
  if (unread.length) {
    await prisma.messageRead.createMany({
      data: unread.map((m) => ({ messageId: m.id, userId: me.id })),
    });
  }
  return { ok: true as const };
}

export async function typingAction(connectionId: string) {
  const me = await requireUser();
  await prisma.typingState.upsert({
    where: { connectionId_userId: { connectionId, userId: me.id } },
    update: {},
    create: { connectionId, userId: me.id },
  });
  return { ok: true as const };
}

export async function openConnectionChat(userId: string) {
  const me = await requireUser();
  if (!(await areConnected(me.id, userId))) return { error: "Connect first to chat." };
  const pair = connectionPair(me.id, userId);
  const c = await prisma.connection.findUnique({ where: { userAId_userBId: pair } });
  if (!c) return { error: "No connection." };
  return { id: c.id };
}
