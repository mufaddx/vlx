"use client";

import { useEffect, useState } from "react";
import { LiveKitStage } from "@/components/livekit-stage";
import Link from "next/link";

export function PrivateCall({ connectionId }: { connectionId: string }) {
  const [data, setData] = useState<{ url: string; token: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/livekit/token?kind=call&id=${connectionId}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "unavailable");
        setData({ url: j.url, token: j.token });
      })
      .catch((e: Error) => setErr(e.message));
  }, [connectionId]);

  if (err) {
    return (
      <div>
        <p className="text-sm text-mist-500">Private video needs a plan with video call access and LiveKit keys. ({err})</p>
        <Link href="/subscription" className="btn-primary mt-4">Subscription</Link>
      </div>
    );
  }
  if (!data) return <p>Connecting…</p>;
  return (
    <div className="-mx-4 min-h-[70dvh] lg:-mx-8">
      <LiveKitStage url={data.url} token={data.token} publish className="min-h-[70dvh] rounded-none" />
      <div className="p-4">
        <Link href={`/messages/${connectionId}`} className="btn-secondary">Back to chat</Link>
      </div>
    </div>
  );
}
