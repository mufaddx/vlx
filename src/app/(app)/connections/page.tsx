import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements, visibleIdentity } from "@/lib/social";
import { Avatar } from "@/components/avatar";
import { FollowActions, RequestButtons, UnblockButton } from "@/components/follow-actions";
import Link from "next/link";

export const metadata = { title: "Connections", robots: { index: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const me = await requireUser();
  const { tab = "connections" } = await searchParams;
  const entitlements = await getEntitlements(me.id);

  const [connections, incoming, outgoing, blocks] = await Promise.all([
    prisma.connection.findMany({
      where: { OR: [{ userAId: me.id }, { userBId: me.id }] },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.followRequest.findMany({
      where: { toUserId: me.id, status: "pending" },
      include: { fromUser: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.followRequest.findMany({
      where: { fromUserId: me.id, status: "pending" },
      include: { toUser: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.block.findMany({
      where: { fromUserId: me.id },
      include: { toUser: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const tabs = [
    ["connections", "Connections"],
    ["requests", `Requests${incoming.length ? ` (${incoming.length})` : ""}`],
    ["sent", "Sent"],
    ["blocked", "Blocked"],
  ] as const;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Connections</h1>
      <p className="mt-2 text-sm text-mist-500">
        Accepted follow requests create a connection. Full username stays locked unless your plan
        unlocks it. Current plan: {entitlements.planName}
        {entitlements.usernameVisibility ? " · usernames visible" : " · usernames locked"}.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <Link
            key={id}
            href={`/connections?tab=${id}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === id
                ? "bg-ink-900 text-white dark:bg-teal dark:text-ink-950"
                : "bg-mist-100 dark:bg-ink-800"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {tab === "connections" ? (
        <ul className="mt-6 space-y-3">
          {connections.length === 0 ? (
            <p className="text-sm text-mist-500">No connections yet. Search a username and send a follow request.</p>
          ) : null}
          {await Promise.all(
            connections.map(async (c) => {
              const other = c.userAId === me.id ? c.userB : c.userA;
              const identity = await visibleIdentity({
                viewerId: me.id,
                target: other,
                connected: true,
                context: "connection",
              });
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-3xl border border-mist-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link href={`/u/${other.username}`} className="flex items-center gap-3">
                    <Avatar src={other.profile?.photoUrl} name={identity.name} />
                    <div>
                      <p className="font-heading font-semibold">{identity.name}</p>
                      <p className="text-sm text-mist-500">
                        {identity.username ? `@${identity.username}` : "Username locked"}
                      </p>
                    </div>
                  </Link>
                  <FollowActions targetId={other.id} status="following" />
                </li>
              );
            }),
          )}
        </ul>
      ) : null}

      {tab === "requests" ? (
        <ul className="mt-6 space-y-3">
          {incoming.length === 0 ? <p className="text-sm text-mist-500">No pending requests.</p> : null}
          {incoming.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded-3xl border border-mist-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar src={null} name={r.maskedName} />
                <div>
                  <p className="font-heading font-semibold">{r.maskedName}</p>
                  <p className="text-sm text-mist-500">Follow request · limited identity</p>
                </div>
              </div>
              <RequestButtons requestId={r.id} />
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "sent" ? (
        <ul className="mt-6 space-y-3">
          {outgoing.length === 0 ? <p className="text-sm text-mist-500">No sent requests.</p> : null}
          {outgoing.map((r) => (
            <li key={r.id}>
              <div className="rounded-3xl border border-mist-200 p-4 dark:border-white/10">
                <p className="font-medium">Request sent to @{r.toUser.username}</p>
                <p className="mt-1 text-sm text-mist-500">They see you as {r.maskedName} until they accept.</p>
                <div className="mt-3">
                  <FollowActions targetId={r.toUserId} status="requested" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "blocked" ? (
        <ul className="mt-6 space-y-3">
          {blocks.length === 0 ? <p className="text-sm text-mist-500">You have not blocked anyone.</p> : null}
          {blocks.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-3xl border border-mist-200 p-4 dark:border-white/10"
            >
              <p className="font-medium">@{b.toUser.username}</p>
              <UnblockButton targetId={b.toUserId} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
