"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements, isBlockedEitherWay } from "@/lib/social";
import { getSetting, rateLimit } from "@/lib/utils";
import { providers } from "@/lib/providers";
import { notify } from "@/lib/notify";

async function maxVideo() {
  return Number(await getSetting("max_live_participants", "10")) || 10;
}

export async function goLiveAction(formData: FormData) {
  const me = await requireUser();
  const ent = await getEntitlements(me.id);
  if (!ent.liveAccess) return { error: "Live is not on your plan." };
  const title = z.string().trim().min(2).max(80).parse(String(formData.get("title") ?? "VIDLIX Live"));
  const category = z.string().trim().max(40).parse(String(formData.get("category") ?? "general"));
  await prisma.liveStream.updateMany({
    where: { hostId: me.id, status: "live" },
    data: { status: "ended", endedAt: new Date() },
  });
  const stream = await prisma.liveStream.create({
    data: { hostId: me.id, title, category, status: "live" },
  });
  await prisma.liveParticipant.create({
    data: { streamId: stream.id, userId: me.id, role: "host" },
  });
  try {
    const room = await providers.video.createLiveRoom(stream.id, me.id);
    await prisma.liveStream.update({ where: { id: stream.id }, data: { roomName: room.roomName } });
  } catch {
    await prisma.liveStream.update({
      where: { id: stream.id },
      data: { roomName: `vidlix-live-${stream.id}` },
    });
  }
  revalidatePath("/live");
  redirect(`/live/${stream.id}`);
}

export async function joinLiveAsViewerAction(streamId: string) {
  const me = await requireUser();
  const stream = await prisma.liveStream.findUnique({ where: { id: streamId } });
  if (!stream || stream.status !== "live") return { error: "Live has ended." };
  if (await isBlockedEitherWay(me.id, stream.hostId)) return { error: "Unavailable." };
  const before = await prisma.liveParticipant.findUnique({
    where: { streamId_userId: { streamId, userId: me.id } },
  });
  await prisma.liveParticipant.upsert({
    where: { streamId_userId: { streamId, userId: me.id } },
    update: { leftAt: null },
    create: { streamId, userId: me.id, role: stream.hostId === me.id ? "host" : "viewer" },
  });
  if (!before || before.leftAt) {
    await prisma.liveStream.update({
      where: { id: streamId },
      data: { viewerCount: { increment: 1 } },
    });
  }
  revalidatePath(`/live/${streamId}`);
  return { ok: true as const };
}

export async function requestJoinLiveAction(streamId: string) {
  const me = await requireUser();
  await prisma.liveJoinRequest.upsert({
    where: { streamId_userId: { streamId, userId: me.id } },
    update: { status: "pending" },
    create: { streamId, userId: me.id, status: "pending" },
  });
  const stream = await prisma.liveStream.findUnique({ where: { id: streamId } });
  if (stream) await notify(stream.hostId, "live", "Join request", "Someone wants to join your live video.", `/live/${streamId}`);
  revalidatePath(`/live/${streamId}`);
  return { ok: true as const };
}

export async function hostLiveAction(input: {
  streamId: string;
  requestId?: string;
  participantId?: string;
  action: "accept" | "reject" | "remove" | "mute" | "block" | "end";
}) {
  const me = await requireUser();
  const stream = await prisma.liveStream.findUnique({ where: { id: input.streamId } });
  if (!stream || stream.hostId !== me.id) return { error: "Only the host can do that." };
  const cap = await maxVideo();

  if (input.action === "end") {
    await prisma.liveStream.update({
      where: { id: stream.id },
      data: { status: "ended", endedAt: new Date() },
    });
    redirect("/live");
  }
  if (input.action === "accept" && input.requestId) {
    const videoCount = await prisma.liveParticipant.count({
      where: { streamId: stream.id, leftAt: null, role: { in: ["host", "participant"] } },
    });
    if (videoCount >= cap) return { error: `Maximum ${cap} active video participants.` };
    const req = await prisma.liveJoinRequest.findUnique({ where: { id: input.requestId } });
    if (!req) return { error: "Request missing." };
    await prisma.liveJoinRequest.update({ where: { id: req.id }, data: { status: "accepted" } });
    const part = await prisma.liveParticipant.findFirst({ where: { streamId: stream.id, userId: req.userId } });
    if (part) await prisma.liveParticipant.update({ where: { id: part.id }, data: { role: "participant", leftAt: null } });
    else await prisma.liveParticipant.create({ data: { streamId: stream.id, userId: req.userId, role: "participant" } });
  }
  if (input.action === "reject" && input.requestId) {
    await prisma.liveJoinRequest.update({ where: { id: input.requestId }, data: { status: "rejected" } });
  }
  if (input.participantId && (input.action === "remove" || input.action === "mute" || input.action === "block")) {
    const part = await prisma.liveParticipant.findUnique({ where: { id: input.participantId } });
    if (part && part.role !== "host") {
      if (input.action === "mute") {
        await prisma.liveParticipant.update({ where: { id: part.id }, data: { muted: true } });
      } else {
        await prisma.liveParticipant.update({ where: { id: part.id }, data: { leftAt: new Date(), role: "viewer" } });
      }
      if (input.action === "block") {
        await prisma.block.upsert({
          where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: part.userId } },
          update: {},
          create: { fromUserId: me.id, toUserId: part.userId },
        });
      }
    }
  }
  revalidatePath(`/live/${input.streamId}`);
  return { ok: true as const };
}

export async function sendLiveChatAction(formData: FormData) {
  const me = await requireUser();
  const streamId = z.string().min(1).parse(String(formData.get("streamId") ?? ""));
  const body = z.string().trim().min(1).max(300).parse(String(formData.get("body") ?? ""));
  const limited = rateLimit(`livechat:${me.id}`, 30, 60 * 1000);
  if (!limited.ok) return { error: "Slow down." };
  const stream = await prisma.liveStream.findUnique({ where: { id: streamId } });
  if (!stream || stream.status !== "live") return { error: "Live ended." };
  if (await isBlockedEitherWay(me.id, stream.hostId)) return { error: "You cannot chat here." };
  await prisma.liveMessage.create({ data: { streamId, userId: me.id, body } });
  revalidatePath(`/live/${streamId}`);
  return { ok: true as const };
}

export async function leaveLiveAction(streamId: string) {
  const me = await requireUser();
  await prisma.liveParticipant.updateMany({
    where: { streamId, userId: me.id, role: { not: "host" } },
    data: { leftAt: new Date() },
  });
  revalidatePath("/live");
  return { ok: true as const };
}
