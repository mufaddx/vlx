import { requireUser } from "@/lib/auth";
import { getEntitlements } from "@/lib/social";
import { Avatar } from "@/components/avatar";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { robots: { index: false } };

export default async function Page() {
  const user = await requireUser();
  const [entitlements, incoming] = await Promise.all([
    getEntitlements(user.id),
    prisma.followRequest.count({ where: { toUserId: user.id, status: "pending" } }),
  ]);
  const datingLabel =
    user.datingOptIn === "yes" ? "Dating profile opted in" : "Dating not active";

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar src={user.profile?.photoUrl} name={user.firstName} size="lg" />
        <div>
          <h1 className="font-heading text-3xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 text-mist-500">@{user.username}</p>
          <p className="mt-3 max-w-xl text-sm text-mist-500">{user.profile?.bio || "No bio yet."}</p>
          <dl className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <dt className="text-mist-400">Followers</dt>
              <dd className="font-semibold">{user.profile?.followersCount ?? 0}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Following</dt>
              <dd className="font-semibold">{user.profile?.followingCount ?? 0}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Plan</dt>
              <dd className="font-semibold">{entitlements.planName}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Dating</dt>
              <dd className="font-semibold">{datingLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
      {incoming > 0 ? (
        <p className="mt-6 text-sm">
          You have {incoming} follow request{incoming === 1 ? "" : "s"}.{" "}
          <Link href="/connections?tab=requests" className="underline">
            Review
          </Link>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/profile/edit" className="btn-primary">
          Edit profile
        </Link>
        <Link href="/settings" className="btn-secondary">
          Privacy
        </Link>
        <Link href="/subscription" className="btn-ghost">
          Subscription
        </Link>
        <Link href="/settings" className="btn-ghost">
          Settings
        </Link>
      </div>
    </div>
  );
}
