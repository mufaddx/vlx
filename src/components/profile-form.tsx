"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/lib/actions/profile";

export function ProfileForm({
  firstName,
  lastName,
  username,
  bio,
}: {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
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
          const res = await updateProfileAction(fd);
          if (res && "error" in res && res.error) setError(res.error);
          else setOk(true);
        });
      }}
    >
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {ok ? <p className="rounded-xl bg-teal/15 px-3 py-2 text-sm">Profile saved.</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          First name
          <input name="firstName" className="input mt-1" defaultValue={firstName} required />
        </label>
        <label className="text-sm">
          Last name
          <input name="lastName" className="input mt-1" defaultValue={lastName} required />
        </label>
      </div>
      <label className="block text-sm">
        Username
        <input name="username" className="input mt-1" defaultValue={username} required />
      </label>
      <label className="block text-sm">
        Bio
        <textarea name="bio" className="input mt-1 min-h-24 py-3" defaultValue={bio} maxLength={280} />
      </label>
      <label className="block text-sm">
        Profile photo
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 text-sm" />
      </label>
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
