"use client";

import { useEffect, useRef } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

export function LiveKitStage({
  url,
  token,
  publish,
  className,
}: {
  url: string;
  token: string;
  publish: boolean;
  className?: string;
}) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const room = new Room();
    let cancelled = false;
    (async () => {
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (!remoteRef.current) return;
        const el = track.attach();
        el.autoplay = true;
        if (track.kind === Track.Kind.Video) el.className = "h-full w-full object-cover";
        remoteRef.current.appendChild(el);
      });
      await room.connect(url, token);
      if (cancelled) {
        await room.disconnect();
        return;
      }
      if (publish) {
        await room.localParticipant.enableCameraAndMicrophone();
        const cam = room.localParticipant.videoTrackPublications.values().next().value;
        const t = cam?.track;
        if (t && localRef.current) t.attach(localRef.current);
      }
    })().catch(() => undefined);
    return () => {
      cancelled = true;
      void room.disconnect();
    };
  }, [url, token, publish]);

  return (
    <div className={className ?? "relative min-h-[280px] overflow-hidden rounded-2xl bg-ink-950"}>
      <div ref={remoteRef} className="absolute inset-0 grid grid-cols-2 gap-1" />
      {publish ? (
        <video ref={localRef} muted autoPlay playsInline className="absolute bottom-2 right-2 h-24 w-20 rounded-lg object-cover" />
      ) : null}
    </div>
  );
}
