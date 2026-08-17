import Link from "next/link";
import { Avatar } from "./avatar";
import { FollowActions } from "./follow-actions";
import type { FollowStatus } from "@/lib/social";

export function PersonCard({
  href,
  name,
  username,
  locked,
  photoUrl,
  bio,
  privacyStatus,
  followStatus,
  targetId,
}: {
  href: string;
  name: string;
  username: string | null;
  locked?: boolean;
  photoUrl: string | null;
  bio?: string;
  privacyStatus?: string;
  followStatus: FollowStatus;
  targetId: string;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-mist-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <Link href={href} className="flex min-w-0 items-center gap-3">
        <Avatar src={photoUrl} name={name} />
        <div className="min-w-0">
          <p className="truncate font-heading font-semibold">{name}</p>
          <p className="truncate text-sm text-mist-500">
            {username ? `@${username}` : locked ? "Username locked" : ""}
            {privacyStatus ? ` · ${privacyStatus}` : ""}
          </p>
          {bio ? <p className="mt-1 line-clamp-2 text-sm text-mist-500">{bio}</p> : null}
        </div>
      </Link>
      <FollowActions targetId={targetId} status={followStatus} />
    </article>
  );
}
