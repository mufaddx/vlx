import { prisma } from "./db";
import { getEntitlements } from "./social";
import { getSetting } from "./utils";

export async function otherUserId(connection: { userAId: string; userBId: string }, me: string) {
  return connection.userAId === me ? connection.userBId : connection.userAId;
}

export async function chatPermission(viewerId: string, peerId: string, connectionId: string) {
  const [viewer, peer] = await Promise.all([getEntitlements(viewerId), getEntitlements(peerId)]);
  if (viewer.chatAccess && peer.chatAccess) {
    return { ok: true as const, unlimited: true, remaining: Infinity };
  }
  const premium = viewer.chatAccess ? viewer : peer.chatAccess ? peer : null;
  if (!premium) {
    return {
      ok: false as const,
      error: "Private chat needs a VIDLIX plan or a Sponsored Premium Connection.",
    };
  }
  const configured = Number(await getSetting("free_message_limit", String(premium.freeMessageLimit)));
  const limit = Number.isFinite(configured) && configured > 0 ? configured : premium.freeMessageLimit;
  const count = await prisma.message.count({ where: { connectionId } });
  if (count >= limit) {
    return {
      ok: false as const,
      limitReached: true as const,
      limit,
      error: viewer.chatAccess
        ? "Connection limit reached. Activate Premium for this user."
        : "Your free connection limit has ended.",
    };
  }
  return { ok: true as const, unlimited: false, remaining: limit - count, limit };
}
