"use client";

import { useState, useTransition } from "react";
import { updatePrivacyAction } from "@/lib/actions/profile";

export function PrivacyForm({
  profileVisibility,
  whoCanFollow,
  whoCanMessage,
  whoCanCall,
  datingVisibility,
  showOnlineStatus,
}: {
  profileVisibility: string;
  whoCanFollow: string;
  whoCanMessage: string;
  whoCanCall: string;
  datingVisibility: string;
  showOnlineStatus: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  return (
    <form
      className="mt-6 max-w-lg space-y-4"
      action={(fd) => {
        setError(null);
        setOk(false);
        start(async () => {
          const res = await updatePrivacyAction(fd);
          if (res && "error" in res && res.error) setError(res.error);
          else setOk(true);
        });
      }}
    >
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {ok ? <p className="rounded-xl bg-teal/15 px-3 py-2 text-sm">Privacy saved. Random Video stays anonymous.</p> : null}
      <label className="block text-sm">
        Profile
        <select name="profileVisibility" className="input mt-1" defaultValue={profileVisibility}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
      <label className="block text-sm">
        Who can follow
        <select name="whoCanFollow" className="input mt-1" defaultValue={whoCanFollow}>
          <option value="everyone">Everyone</option>
          <option value="connections">Connections only</option>
          <option value="nobody">Nobody</option>
        </select>
      </label>
      <label className="block text-sm">
        Who can message
        <select name="whoCanMessage" className="input mt-1" defaultValue={whoCanMessage}>
          <option value="everyone">Everyone</option>
          <option value="connections">Connections only</option>
          <option value="nobody">Nobody</option>
        </select>
      </label>
      <label className="block text-sm">
        Who can call
        <select name="whoCanCall" className="input mt-1" defaultValue={whoCanCall}>
          <option value="everyone">Everyone</option>
          <option value="connections">Connections only</option>
          <option value="nobody">Nobody</option>
        </select>
      </label>
      <label className="block text-sm">
        Dating visibility
        <select name="datingVisibility" className="input mt-1" defaultValue={datingVisibility}>
          <option value="hidden">Hidden</option>
          <option value="visible">Visible in Dating</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="showOnlineStatus" defaultChecked={showOnlineStatus} />
        Show online status
      </label>
      <p className="text-xs text-mist-400">Random Video never shows your username, even if your profile is public.</p>
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Saving…" : "Save privacy"}
      </button>
    </form>
  );
}
