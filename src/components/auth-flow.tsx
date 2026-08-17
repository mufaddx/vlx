"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { completeSignupAction, sendOtpAction, verifyOtpAction } from "@/lib/actions/auth";
import { Logo } from "./logo";

export function AuthFlow({ mode }: { mode: "login" | "signup" }) {
  const [step, setStep] = useState<"id" | "otp" | "profile">("id");
  const [identifier, setIdentifier] = useState("");
  const [hint, setHint] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <h1 className="mt-8 font-heading text-3xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your VIDLIX"}
      </h1>
      <p className="mt-2 text-sm text-mist-500">
        {mode === "login"
          ? "Email or mobile, then a one-time code. No password. Account recovery is the same OTP login."
          : "You must be 18+. Camera is not requested during signup."}
      </p>

      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      {step === "id" ? (
        <form
          className="mt-6 space-y-4"
          action={(fd) => {
            setError(null);
            start(async () => {
              const res = await sendOtpAction(fd);
              if ("error" in res && res.error) setError(res.error);
              else {
                setHint(res.hint);
                setStep("otp");
              }
            });
          }}
        >
          <label className="block text-sm font-medium" htmlFor="identifier">
            Email or mobile number
          </label>
          <input
            id="identifier"
            name="identifier"
            className="input"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete={mode === "login" ? "username" : "email"}
          />
          <input type="hidden" name="purpose" value={mode} />
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : null}

      {step === "otp" ? (
        <form
          className="mt-6 space-y-4"
          action={(fd) => {
            setError(null);
            start(async () => {
              const res = await verifyOtpAction(fd);
              if (res && "error" in res && res.error) setError(res.error);
              else if (mode === "signup") setStep("profile");
            });
          }}
        >
          <input type="hidden" name="identifier" value={identifier} />
          <input type="hidden" name="purpose" value={mode} />
          <label className="block text-sm font-medium" htmlFor="code">
            One-time code
          </label>
          <input id="code" name="code" className="input tracking-[0.4em]" required inputMode="numeric" />
          {hint ? (
            <p className="text-xs text-mist-500">Development code: {hint}</p>
          ) : null}
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Checking…" : "Continue"}
          </button>
        </form>
      ) : null}

      {step === "profile" ? (
        <form
          className="mt-6 space-y-4"
          action={(fd) => {
            setError(null);
            start(async () => {
              const res = await completeSignupAction(fd);
              if (res && "error" in res && res.error) setError(res.error);
            });
          }}
        >
          <input type="hidden" name="identifier" value={identifier} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium" htmlFor="firstName">
                First name
              </label>
              <input id="firstName" name="firstName" className="input mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="lastName">
                Last name
              </label>
              <input id="lastName" name="lastName" className="input mt-1" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" className="input mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="dateOfBirth">
              Date of birth
            </label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" className="input mt-1" required />
            <p className="mt-1 text-xs text-mist-400">18+ only. No face scanning.</p>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="gender">
              Gender
            </label>
            <select id="gender" name="gender" className="input mt-1" required defaultValue="prefer_not">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="photo">
              Profile photo (optional for now)
            </label>
            <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 text-sm" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="terms" required className="mt-1" />
            <span>
              I agree to the{" "}
              <Link className="underline" href="/terms">
                Terms & Conditions
              </Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="privacy" required className="mt-1" />
            <span>
              I agree to the{" "}
              <Link className="underline" href="/privacy">
                Privacy Policy
              </Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="guidelines" required className="mt-1" />
            <span>
              I agree to the{" "}
              <Link className="underline" href="/community-guidelines">
                Community Guidelines
              </Link>
            </span>
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Do you want to create a Dating Profile?</legend>
            <div className="mt-2 grid gap-2">
              <label className="flex gap-2 text-sm">
                <input type="radio" name="datingOptIn" value="yes" /> Yes
              </label>
              <label className="flex gap-2 text-sm">
                <input type="radio" name="datingOptIn" value="no" /> No
              </label>
              <label className="flex gap-2 text-sm">
                <input type="radio" name="datingOptIn" value="later" defaultChecked /> Maybe later
              </label>
            </div>
          </fieldset>
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Creating…" : "Enter VIDLIX"}
          </button>
        </form>
      ) : null}

      <p className="mt-8 text-sm text-mist-500">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-medium text-ink-900 underline dark:text-white">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ink-900 underline dark:text-white">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
