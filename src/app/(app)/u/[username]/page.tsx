import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  areConnected,
  getFollowStatus,
  isBlockedEitherWay,
  visibleIdentity,
} from "@/lib/social";
import { Avatar } from "@/components/avatar";
import { FollowActions } from "@/components/follow-actions";
import { ReportForm } from "@/components/report-form";

export const metadata = { robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const me = await requireUser();
  const { username } = await params;
  const target = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: { profile: true, privacy: true },
  });
  if (!target || target.status !== "active") notFound();
  if (target.id === me.id) redirect("/profile");
  if (await isBlockedEitherWay(me.id, target.id)) notFound();

  const connected = await areConnected(me.id, target.id);
  const privateAccount = (target.privacy?.profileVisibility ?? "public") === "private" && !connected;
  const identity = await visibleIdentity({
    viewerId: me.id,
    target,
    connected,
    context: connected ? "connection" : "profile",
  });
  const followStatus = await getFollowStatus(me.id, target.id);

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar src={privateAccount ? null : target.profile?.photoUrl} name={identity.name} size="lg" />
        <div>
          <h1 className="font-heading text-3xl font-semibold">{identity.name}</h1>
          <p className="mt-1 text-mist-500">
            {identity.username ? `@${identity.username}` : "Username locked until premium connection access."}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-mist-400">
            {target.privacy?.profileVisibility ?? "public"} profile
          </p>
          {!privateAccount ? (
            <p className="mt-3 max-w-xl text-sm text-mist-500">{target.profile?.bio || "No bio yet."}</p>
          ) : (
            <p className="mt-3 text-sm text-mist-500">This profile is private. Send a follow request to connect.</p>
          )}
          {!privateAccount ? (
            <p className="mt-4 text-sm text-mist-400">
              {target.profile?.followersCount ?? 0} followers · {target.profile?.followingCount ?? 0} following
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-8">
        <FollowActions targetId={target.id} status={followStatus} />
        <div className="mt-4">
          <ReportForm targetId={target.id} />
        </div>
      </div>
    </div>
  );
}
