"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements, isBlockedEitherWay } from "@/lib/social";
import { rateLimit } from "@/lib/utils";
import { providers } from "@/lib/providers";
import { livekitConfigured } from "@/lib/providers/livekit";

async function otherOf(session: { userAId: string; userBId: string }, me: string) {
  return session.userAId === me ? session.userBId : session.userAId;
}

export async function startRandomSearchAction() {
  const me = await requireUser();
  const ent = await getEntitlements(me.id);
  if (!ent.randomVideoAccess) return { error: "Random Video is not on your plan." };
  const limited = rateLimit(`random:${me.id}`, 20, 60 * 1000);
  if (!limited.ok) return { error: "Slow down." };

  const active = await prisma.videoSession.findFirst({
    where: {
      status: { in: ["connecting", "connected"] },
      OR: [{ userAId: me.id }, { userBId: me.id }],
    },
  });
  if (active) return { sessionId: active.id, status: active.status };

  await prisma.matchQueue.deleteMany({ where: { userId: me.id } });

  const waiting = await prisma.matchQueue.findMany({ orderBy: { createdAt: "asc" }, take: 15 });
  for (const row of waiting) {
    if (row.userId === me.id) continue;
    if (await isBlockedEitherWay(me.id, row.userId)) continue;
    const busy = await prisma.videoSession.findFirst({
      where: {
        status: { in: ["searching", "connecting", "connected"] },
        OR: [{ userAId: row.userId }, { userBId: row.userId }],
      },
    });
    if (busy) continue;

    await prisma.matchQueue.deleteMany({ where: { userId: { in: [me.id, row.userId] } } });
    const session = await prisma.videoSession.create({
      data: {
        userAId: row.userId,
        userBId: me.id,
        status: "connecting",
        startedAt: new Date(),
      },
    });
    try {
      const room = await providers.video.createRandomRoom(session.id);
      await prisma.videoSession.update({
        where: { id: session.id },
        data: { roomName: room.roomName },
      });
    } catch {
      /* mock or missing LiveKit keys — P2P signaling still works */
    }
    return { sessionId: session.id, status: "connecting" as const };
  }

  await prisma.matchQueue.create({ data: { userId: me.id } });
  return { status: "searching" as const };
}

export async function randomStatusAction() {
  const me = await requireUser();
  const session = await prisma.videoSession.findFirst({
    where: {
      status: { in: ["connecting", "connected"] },
      OR: [{ userAId: me.id }, { userBId: me.id }],
    },
    orderBy: { createdAt: "desc" },
  });
  if (session) {
    const role = session.userAId === me.id ? "a" : "b";
    let livekitToken: string | undefined;
    const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;
    if (session.roomName && livekitConfigured() && providers.video.participantToken) {
      livekitToken = await providers.video.participantToken(
        session.roomName,
        `${role}-${me.id}`,
        true,
      );
    }
    return {
      status: session.status,
      sessionId: session.id,
      role,
      offerSdp: session.offerSdp,
      answerSdp: session.answerSdp,
      iceJsonA: session.iceJsonA,
      iceJsonB: session.iceJsonB,
      peerId: await otherOf(session, me.id),
      roomName: session.roomName,
      livekitUrl: url,
      livekitToken,
    };
  }
  const queued = await prisma.matchQueue.findUnique({ where: { userId: me.id } });
  return { status: queued ? "searching" : "idle" };
}

export async function signalRandomAction(input: {
  sessionId: string;
  offerSdp?: string;
  answerSdp?: string;
  ice?: string;
}) {
  const me = await requireUser();
  const session = await prisma.videoSession.findUnique({ where: { id: input.sessionId } });
  if (!session || (session.userAId !== me.id && session.userBId !== me.id)) {
    return { error: "Session not found." };
  }
  const asA = session.userAId === me.id;
  const iceField = asA ? "iceJsonA" : "iceJsonB";
  const current = JSON.parse(asA ? session.iceJsonA : session.iceJsonB) as unknown[];
  if (input.ice) current.push(JSON.parse(input.ice));
  await prisma.videoSession.update({
    where: { id: session.id },
    data: {
      offerSdp: input.offerSdp ?? session.offerSdp,
      answerSdp: input.answerSdp ?? session.answerSdp,
      [iceField]: JSON.stringify(current),
      status: input.answerSdp || session.answerSdp ? "connected" : session.status,
    },
  });
  return { ok: true as const };
}

export async function endRandomAction(reason: "next" | "end" | "report") {
  const me = await requireUser();
  const session = await prisma.videoSession.findFirst({
    where: {
      status: { in: ["connecting", "connected", "searching"] },
      OR: [{ userAId: me.id }, { userBId: me.id }],
    },
    orderBy: { createdAt: "desc" },
  });
  await prisma.matchQueue.deleteMany({ where: { userId: me.id } });
  if (session) {
    const ended = new Date();
    const durationSec = session.startedAt
      ? Math.max(0, Math.round((ended.getTime() - session.startedAt.getTime()) / 1000))
      : 0;
    await prisma.videoSession.update({
      where: { id: session.id },
      data: { status: "ended", endedAt: ended, durationSec, endReason: reason },
    });
  }
  if (reason === "next") return startRandomSearchAction();
  return { status: "idle" as const };
}
