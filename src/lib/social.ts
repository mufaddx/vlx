import { prisma } from "./db";
import { maskedDisplayName } from "./crypto";
import { connectionPair } from "./ids";

export { connectionPair };

export async function isBlockedEitherWay(a: string, b: string) {
  const row = await prisma.block.findFirst({
    where: {
      OR: [
        { fromUserId: a, toUserId: b },
        { fromUserId: b, toUserId: a },
      ],
    },
  });
  return Boolean(row);
}

export async function areConnected(a: string, b: string) {
  const pair = connectionPair(a, b);
  const row = await prisma.connection.findUnique({
    where: { userAId_userBId: pair },
  });
  return Boolean(row);
}

export async function getEntitlements(userId: string) {
  const [sub, sponsored] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sponsoredConnection.findFirst({
      where: { recipientId: userId, status: "active" },
    }),
  ]);
  const plan = sub?.plan;
  return {
    planName: plan?.name ?? "Free",
    planSlug: plan?.slug ?? "free",
    usernameVisibility: Boolean(plan?.usernameVisibility || sponsored),
    chatAccess: Boolean(plan?.chatAccess || sponsored),
    videoCallAccess: Boolean(plan?.videoCallAccess || sponsored),
    randomVideoAccess: plan?.randomVideoAccess !== false,
    datingAccess: Boolean(plan?.datingAccess || sponsored),
    liveAccess: plan?.liveAccess !== false,
    maxSponsoredUsers: plan?.maxSponsoredUsers ?? 0,
    freeMessageLimit: plan?.freeMessageLimit ?? 10,
    sponsored: Boolean(sponsored),
  };
}

export function publicName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export async function visibleIdentity(input: {
  viewerId: string;
  target: { id: string; firstName: string; lastName: string; username: string };
  connected: boolean;
  context: "search" | "profile" | "connection" | "request";
}) {
  if (input.context === "request") {
    return {
      name: maskedDisplayName(input.target.firstName, input.target.lastName),
      username: null as string | null,
      locked: true,
    };
  }
  if (input.context === "search") {
    return {
      name: publicName(input.target),
      username: input.target.username,
      locked: false,
    };
  }
  if (!input.connected) {
    return {
      name: publicName(input.target),
      username: input.target.username,
      locked: false,
    };
  }
  const entitlements = await getEntitlements(input.viewerId);
  if (entitlements.usernameVisibility) {
    return {
      name: publicName(input.target),
      username: input.target.username,
      locked: false,
    };
  }
  return {
    name: maskedDisplayName(input.target.firstName, input.target.lastName),
    username: null,
    locked: true,
  };
}

export type FollowStatus = "self" | "following" | "requested" | "incoming" | "none" | "blocked";

export async function getFollowStatus(viewerId: string, targetId: string): Promise<FollowStatus> {
  if (viewerId === targetId) return "self";
  if (await isBlockedEitherWay(viewerId, targetId)) return "blocked";
  const [following, outgoing, incoming] = await Promise.all([
    prisma.follow.findUnique({
      where: { fromUserId_toUserId: { fromUserId: viewerId, toUserId: targetId } },
    }),
    prisma.followRequest.findUnique({
      where: { fromUserId_toUserId: { fromUserId: viewerId, toUserId: targetId } },
    }),
    prisma.followRequest.findUnique({
      where: { fromUserId_toUserId: { fromUserId: targetId, toUserId: viewerId } },
    }),
  ]);
  if (following) return "following";
  if (outgoing?.status === "pending") return "requested";
  if (incoming?.status === "pending") return "incoming";
  return "none";
}

export async function canSendFollow(viewerId: string, targetId: string) {
  if (viewerId === targetId) return { ok: false as const, error: "You cannot follow yourself." };
  if (await isBlockedEitherWay(viewerId, targetId)) {
    return { ok: false as const, error: "You cannot follow this user." };
  }
  const privacy = await prisma.userPrivacy.findUnique({ where: { userId: targetId } });
  const who = privacy?.whoCanFollow ?? "everyone";
  if (who === "nobody") return { ok: false as const, error: "This user is not accepting follow requests." };
  if (who === "connections") {
    const connected = await areConnected(viewerId, targetId);
    if (!connected) return { ok: false as const, error: "Only connections can follow this user." };
  }
  return { ok: true as const };
}

export async function searchUsers(viewerId: string, rawQuery: string) {
  const q = rawQuery.trim().replace(/^@/, "").toLowerCase();
  if (q.length < 2) return [];

  const blocks = await prisma.block.findMany({
    where: { OR: [{ fromUserId: viewerId }, { toUserId: viewerId }] },
  });
  const blocked = new Set(
    blocks.map((b) => (b.fromUserId === viewerId ? b.toUserId : b.fromUserId)),
  );

  const users = await prisma.user.findMany({
    where: {
      status: "active",
      NOT: { id: viewerId },
      username: { contains: q },
    },
    take: 24,
    include: { profile: true, privacy: true },
    orderBy: { username: "asc" },
  });

  const visible = users.filter((u) => {
    if (blocked.has(u.id)) return false;
    const vis = u.privacy?.profileVisibility ?? "public";
    if (vis === "private" && u.username !== q) return false;
    return true;
  });

  return Promise.all(
    visible.map(async (u) => {
      const [status, connected] = await Promise.all([
        getFollowStatus(viewerId, u.id),
        areConnected(viewerId, u.id),
      ]);
      const identity = await visibleIdentity({
        viewerId,
        target: u,
        connected,
        context: connected ? "connection" : "search",
      });
      return {
        id: u.id,
        photoUrl: u.profile?.photoUrl ?? null,
        bio: u.privacy?.profileVisibility === "private" && !connected ? "" : u.profile?.bio ?? "",
        privacyStatus: u.privacy?.profileVisibility ?? "public",
        followStatus: status,
        connected,
        ...identity,
      };
    }),
  );
}
