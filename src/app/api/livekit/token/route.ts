import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { providers } from "@/lib/providers";
import { livekitConfigured } from "@/lib/providers/livekit";
import { areConnected, getEntitlements, isBlockedEitherWay } from "@/lib/social";

export async function GET(req: NextRequest) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "auth" }, { status: 401 });
  if (!livekitConfigured() || !providers.video.participantToken) {
    return NextResponse.json({ error: "livekit_off" }, { status: 503 });
  }
  const kind = req.nextUrl.searchParams.get("kind");
  const id = req.nextUrl.searchParams.get("id");
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!kind || !id || !url) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  if (kind === "live") {
    const stream = await prisma.liveStream.findUnique({
      where: { id },
      include: { participants: { where: { userId: me.id, leftAt: null } } },
    });
    if (!stream || stream.status !== "live") return NextResponse.json({ error: "ended" }, { status: 404 });
    if (await isBlockedEitherWay(me.id, stream.hostId)) {
      return NextResponse.json({ error: "blocked" }, { status: 403 });
    }
    const part = stream.participants[0];
    const canPublish = stream.hostId === me.id || part?.role === "participant";
    const room = stream.roomName || `vidlix-live-${stream.id}`;
    const token = await providers.video.participantToken(room, me.id, canPublish && !part?.muted);
    return NextResponse.json({ url, token, room, canPublish });
  }

  if (kind === "call") {
    const connection = await prisma.connection.findUnique({ where: { id } });
    if (!connection || (connection.userAId !== me.id && connection.userBId !== me.id)) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const peer = connection.userAId === me.id ? connection.userBId : connection.userAId;
    if (await isBlockedEitherWay(me.id, peer)) return NextResponse.json({ error: "blocked" }, { status: 403 });
    const ent = await getEntitlements(me.id);
    if (!ent.videoCallAccess) return NextResponse.json({ error: "plan" }, { status: 403 });
    if (!(await areConnected(me.id, peer))) return NextResponse.json({ error: "not_connected" }, { status: 403 });
    const room = `vidlix-call-${id}`;
    const token = await providers.video.participantToken(room, me.id, true);
    return NextResponse.json({ url, token, room, canPublish: true });
  }

  return NextResponse.json({ error: "bad_kind" }, { status: 400 });
}
