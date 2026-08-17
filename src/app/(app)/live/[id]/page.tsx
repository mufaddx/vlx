import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { joinLiveAsViewerAction } from "@/lib/actions/live";
import { getSetting } from "@/lib/utils";
import { HostPartRow, HostRequestRow, LiveReport, LiveRoomClient } from "@/components/live-room-controls";
import { LiveVideoPane } from "@/components/live-video-pane";

export const metadata = { robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const stream = await prisma.liveStream.findUnique({
    where: { id },
    include: {
      host: true,
      participants: { where: { leftAt: null }, include: { user: true } },
      joinRequests: { where: { status: "pending" }, include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 40, include: { user: true } },
    },
  });
  if (!stream) notFound();
  if (stream.status === "live") await joinLiveAsViewerAction(stream.id);
  const cap = Number(await getSetting("max_live_participants", "10")) || 10;
  const videoParts = stream.participants.filter((p) => p.role === "host" || p.role === "participant");
  const isHost = stream.hostId === me.id;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-500">LIVE · {stream.viewerCount} watching</p>
          <h1 className="font-heading text-3xl font-semibold">{stream.title}</h1>
          <p className="text-sm text-mist-500">Host {stream.host.firstName} · max {cap} video participants</p>
        </div>
        <LiveReport userId={stream.hostId} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <LiveVideoPane streamId={stream.id} canPublishFallback={isHost} />
        <div className="rounded-3xl border border-mist-200 p-4 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist-400">Live chat</p>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto text-sm">
            {stream.messages.slice().reverse().map((m) => (
              <p key={m.id}>
                <span className="text-teal">{m.user.firstName}</span> {m.body}
                <span className="ml-2 text-[10px] text-mist-400">{m.createdAt.toLocaleTimeString()}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      {isHost ? (
        <div className="mt-6">
          <p className="font-semibold">Join requests</p>
          <ul className="mt-2 space-y-2">
            {stream.joinRequests.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-2xl border border-mist-200 px-3 py-2 dark:border-white/10">
                <span>{r.user.firstName}</span>
                <HostRequestRow streamId={stream.id} requestId={r.id} />
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2">
            {videoParts.filter((p) => p.role !== "host").map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.user.firstName} · {p.role}{p.muted ? " · muted" : ""}</span>
                <HostPartRow streamId={stream.id} participantId={p.id} userId={p.userId} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <LiveRoomClient streamId={stream.id} isHost={isHost} />
      <p className="mt-4 text-xs text-mist-400">
        Remote multi-party video uses LiveKit when VIDEO_PROVIDER credentials are set. Participant cap, requests, mute, remove, block, and chat are enforced here. Lives are not recorded.
      </p>
    </div>
  );
}
