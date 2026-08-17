"use client";

import { useState, useTransition } from "react";
import { reportUserAction } from "@/lib/actions/social";

export function ReportForm({ targetId }: { targetId: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (done) return <p className="text-sm text-mist-500">Report submitted. Moderation will review it.</p>;
  if (!open) {
    return (
      <button type="button" className="btn-ghost" onClick={() => setOpen(true)}>
        Report
      </button>
    );
  }

  return (
    <form
      className="mt-3 space-y-3 rounded-2xl border border-mist-200 p-4 dark:border-white/10"
      action={(fd) => {
        start(async () => {
          const res = await reportUserAction(fd);
          if (res && "ok" in res) setDone(true);
        });
      }}
    >
      <input type="hidden" name="targetId" value={targetId} />
      <label className="block text-sm">
        Reason
        <select name="reason" className="input mt-1" defaultValue="other">
          <option value="harassment">Harassment</option>
          <option value="spam">Spam</option>
          <option value="fake_profile">Fake profile</option>
          <option value="scam">Scam</option>
          <option value="abuse">Abuse</option>
          <option value="sexual_content">Sexual content</option>
          <option value="other">Other</option>
        </select>
      </label>
      <textarea name="details" className="input min-h-20 py-3" placeholder="Optional details" />
      <button className="btn-primary" disabled={pending} type="submit">
        Submit report
      </button>
    </form>
  );
}
