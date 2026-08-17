"use client";

import { useState, useTransition } from "react";
import { submitContactAction } from "@/lib/actions/contact";

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  if (ok) {
    return (
      <p className="mt-8 rounded-2xl border border-mist-200 p-5 text-sm dark:border-white/10">
        Message received. For urgent safety issues, also email safety@vidlix.in.
      </p>
    );
  }

  return (
    <form
      className="mt-8 max-w-lg space-y-4"
      action={(fd) => {
        setError(null);
        start(async () => {
          const res = await submitContactAction(fd);
          if ("error" in res && res.error) setError(res.error);
          else setOk(true);
        });
      }}
    >
      {error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      ) : null}
      <label className="block text-sm font-medium">
        Name
        <input name="name" className="input mt-1" required />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" className="input mt-1" required autoComplete="email" />
      </label>
      <label className="block text-sm font-medium">
        Topic
        <select name="topic" className="input mt-1" defaultValue="help">
          <option value="help">Help</option>
          <option value="safety">Safety</option>
          <option value="billing">Billing</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" className="input mt-1 min-h-32 py-3" required minLength={10} />
      </label>
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
