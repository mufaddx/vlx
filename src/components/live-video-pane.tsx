"use client";

import { useEffect, useState } from "react";
import { LiveKitStage } from "./livekit-stage";

export function LiveVideoPane({ streamId, canPublishFallback }: { streamId: string; canPublishFallback: boolean }) {
  const [data, setData] = useState<{ url: string; token: string; canPublish: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/livekit/token?kind=live&id=${streamId}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "token");
        if (alive) setData({ url: j.url, token: j.token, canPublish: j.canPublish ?? canPublishFallback });
      })
      .catch(() => {
        if (alive) setErr("LiveKit video starts after keys are set. Chat and join requests still work.");
      });
    return () => {
      alive = false;
    };
  }, [streamId, canPublishFallback]);

  if (err) return <p className="text-sm text-mist-400">{err}</p>;
  if (!data) return <p className="text-sm text-mist-400">Connecting video…</p>;
  return <LiveKitStage url={data.url} token={data.token} publish={data.canPublish} />;
}
