"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { completeSetupAction } from "@/lib/actions/auth";

export function SetupForm({
  defaults,
}: {
  defaults: { firstName: string; lastName: string; username: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="mt-8 max-w-md space-y-4"
      action={(fd) => {
        setError(null);
        start(async () => {
          const res = await completeSetupAction(fd);
          if (res && "error" in res && res.error) setError(res.error);
        });
      }}
    >
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <input name="firstName" className="input" defaultValue={defaults.firstName} required />
      <input name="lastName" className="input" defaultValue={defaults.lastName} required />
      <input name="username" className="input" defaultValue={defaults.username} required />
      <input name="dateOfBirth" type="date" className="input" required />
      <select name="gender" className="input" defaultValue="prefer_not">
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="non_binary">Non-binary</option>
        <option value="prefer_not">Prefer not to say</option>
      </select>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="terms" required /> I agree to{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="privacy" required /> I agree to{" "}
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="guidelines" required /> I agree to{" "}
        <Link href="/community-guidelines" className="underline">
          Guidelines
        </Link>
      </label>
      <fieldset className="text-sm">
        <legend className="font-medium">Do you want to create a Dating Profile?</legend>
        <label className="mt-2 flex gap-2">
          <input type="radio" name="datingOptIn" value="yes" /> Yes
        </label>
        <label className="flex gap-2">
          <input type="radio" name="datingOptIn" value="no" /> No
        </label>
        <label className="flex gap-2">
          <input type="radio" name="datingOptIn" value="later" defaultChecked /> Maybe later
        </label>
      </fieldset>
      <button className="btn-primary" disabled={pending} type="submit">
        Continue to dashboard
      </button>
    </form>
  );
}
