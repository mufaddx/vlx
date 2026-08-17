"use client";

import { useTransition } from "react";
import {
  hostLiveAction,
  leaveLiveAction,
  requestJoinLiveAction,
  sendLiveChatAction,
} from "@/lib/actions/live";
import { blockUserAction } from "@/lib/actions/social";
import { ReportForm } from "./report-form";

export function LiveRoomClient({
  streamId,
  isHost,
}: {
  streamId: string;
  isHost: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {!isHost ? (
        <>
          <button className="btn-primary" disabled={pending} type="button" onClick={() => start(async () => { await requestJoinLiveAction(streamId); })}>
            Request to join
          </button>
          <form action={leaveLiveAction.bind(null, streamId)}>
            <button className="btn-secondary" type="submit">Leave</button>
          </form>
        </>
      ) : (
        <button className="btn-secondary" type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, action: "end" }); })}>
          End live
        </button>
      )}
      <form action={sendLiveChatAction} className="flex min-w-[240px] flex-1 gap-2">
        <input type="hidden" name="streamId" value={streamId} />
        <input name="body" className="input" placeholder="Live chat" />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}

export function HostRequestRow({ streamId, requestId }: { streamId: string; requestId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <button className="btn-primary" disabled={pending} type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, requestId, action: "accept" }); })}>Accept</button>
      <button className="btn-secondary" disabled={pending} type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, requestId, action: "reject" }); })}>Reject</button>
    </div>
  );
}

export function HostPartRow({ streamId, participantId, userId }: { streamId: string; participantId: string; userId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-ghost" disabled={pending} type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, participantId, action: "mute" }); })}>Mute</button>
      <button className="btn-ghost" disabled={pending} type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, participantId, action: "remove" }); })}>Remove</button>
      <button className="btn-ghost text-rose-600" disabled={pending} type="button" onClick={() => start(async () => { await hostLiveAction({ streamId, participantId, action: "block" }); await blockUserAction(userId); })}>Block</button>
    </div>
  );
}

export function LiveReport({ userId }: { userId: string }) {
  return <ReportForm targetId={userId} />;
}
