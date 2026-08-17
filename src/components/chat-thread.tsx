"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessageAction, typingAction } from "@/lib/actions/chat";
import { inviteSponsoredAction } from "@/lib/actions/billing";

type Msg = { id: string; senderId: string; body: string; createdAt: string };

export function ChatThread({
  connectionId,
  meId,
  peerName,
  username,
  locked,
  peerUsername,
  canVideo,
  limitWarning,
}: {
  connectionId: string;
  meId: string;
  peerName: string;
  username: string | null;
  locked: boolean;
  peerUsername: string;
  canVideo: boolean;
  limitWarning: string | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(limitWarning);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const res = await fetch(`/api/messages/${connectionId}`, { cache: "no-store" });
      if (!res.ok || !alive) return;
      const data = await res.json();
      setMessages(data.messages);
      setTyping(data.typing);
      bottom.current?.scrollIntoView({ behavior: "smooth" });
    };
    void tick();
    const t = setInterval(() => void tick(), 1500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [connectionId]);

  return (
    <div className="flex min-h-[70dvh] flex-col rounded-3xl border border-mist-200 dark:border-white/10">
      <header className="flex items-center justify-between border-b border-mist-200 px-4 py-3 dark:border-white/10">
        <div>
          <p className="font-heading font-semibold">{peerName}</p>
          <p className="text-xs text-mist-400">{username ? `@${username}` : "Username locked"}</p>
        </div>
        {canVideo ? (
          <a href={`/call/${connectionId}`} className="btn-secondary text-xs">
            Video Call
          </a>
        ) : (
          <span className="text-xs text-mist-400">Video locked</span>
        )}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.senderId === meId
                ? "ml-auto bg-ink-900 text-white dark:bg-teal dark:text-ink-950"
                : "bg-mist-100 dark:bg-ink-700"
            }`}
          >
            {m.body}
          </div>
        ))}
        {typing ? <p className="text-xs text-mist-400">Typing…</p> : null}
        <div ref={bottom} />
      </div>
      {error ? <p className="px-4 text-sm text-rose-600">{error}</p> : null}
      {error?.includes("Activate Premium") ? (
        <form
          className="px-4 pb-2"
          action={() => {
            start(async () => {
              const fd = new FormData();
              fd.set("username", peerUsername);
              const res = await inviteSponsoredAction(fd);
              if (res && "error" in res && res.error) setError(res.error);
              else setError("Sponsored invite sent.");
            });
          }}
        >
          <button className="btn-primary" type="submit" disabled={pending}>
            Activate sponsored access
          </button>
        </form>
      ) : null}
      <form
        className="flex gap-2 border-t border-mist-200 p-3 dark:border-white/10"
        action={(fd) => {
          start(async () => {
            const res = await sendMessageAction(fd);
            if (res && "error" in res && res.error) setError(res.error);
          });
        }}
      >
        <input type="hidden" name="connectionId" value={connectionId} />
        <input
          name="body"
          className="input"
          placeholder={locked ? "Chat may require a plan" : "Message"}
          onChange={() => void typingAction(connectionId)}
        />
        <button className="btn-primary" disabled={pending} type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
