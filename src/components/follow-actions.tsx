"use client";

import { useTransition } from "react";
import {
  acceptFollowRequestAction,
  blockUserAction,
  cancelFollowRequestAction,
  declineFollowRequestAction,
  sendFollowRequestAction,
  unblockUserAction,
  unfollowAction,
} from "@/lib/actions/social";
import type { FollowStatus } from "@/lib/social";

export function FollowActions({
  targetId,
  status,
}: {
  targetId: string;
  status: FollowStatus;
}) {
  const [pending, start] = useTransition();
  if (status === "self" || status === "blocked") return null;

  const run = (fn: () => Promise<{ error?: string } | { ok: true }>) => {
    start(async () => {
      await fn();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "none" ? (
        <button
          type="button"
          disabled={pending}
          className="btn-primary"
          onClick={() => run(() => sendFollowRequestAction(targetId))}
        >
          {pending ? "Sending…" : "Follow request"}
        </button>
      ) : null}
      {status === "requested" ? (
        <button
          type="button"
          disabled={pending}
          className="btn-secondary"
          onClick={() => run(() => cancelFollowRequestAction(targetId))}
        >
          {pending ? "Cancelling…" : "Request sent · Cancel"}
        </button>
      ) : null}
      {status === "following" ? (
        <button
          type="button"
          disabled={pending}
          className="btn-secondary"
          onClick={() => run(() => unfollowAction(targetId))}
        >
          Following
        </button>
      ) : null}
      {status === "incoming" ? (
        <p className="text-sm text-mist-500">They sent you a request — open Connections to accept.</p>
      ) : null}
      <button
        type="button"
        disabled={pending}
        className="btn-ghost text-rose-600"
        onClick={() => run(() => blockUserAction(targetId))}
      >
        Block
      </button>
    </div>
  );
}

export function RequestButtons({ requestId }: { requestId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="btn-primary"
        disabled={pending}
        onClick={() => start(async () => { await acceptFollowRequestAction(requestId); })}
      >
        Accept
      </button>
      <button
        type="button"
        className="btn-secondary"
        disabled={pending}
        onClick={() => start(async () => { await declineFollowRequestAction(requestId); })}
      >
        Decline
      </button>
    </div>
  );
}

export function UnblockButton({ targetId }: { targetId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn-secondary"
      disabled={pending}
      onClick={() => start(async () => { await unblockUserAction(targetId); })}
    >
      Unblock
    </button>
  );
}
