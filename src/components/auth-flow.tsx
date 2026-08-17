"use client";

import { useState } from "react";
import Link from "next/link";
import { completeSignupAction, sendOtpAction, verifyOtpAction } from "@/lib/actions/auth";

type JsonResult = { error?: string; hint?: string; next?: string; ok?: boolean; verified?: boolean };

async function sendCode(fd: FormData): Promise<JsonResult> {
  try {
    const res = await sendOtpAction(fd);
    if (res) return res;
  } catch {
    /* Hostinger may block some action POSTs — fall through to API */
  }
  const res = await fetch("/api/auth/send-otp", { method: "POST", body: fd, credentials: "same-origin" });
  const data = (await res.json().catch(() => null)) as JsonResult | null;
  if (!data) return { error: "Could not reach the server. Try again." };
  return data;
}

async function verifyCode(fd: FormData): Promise<JsonResult> {
  try {
    const res = await verifyOtpAction(fd);
    if (res) return res;
  } catch (err) {
    const digest =
      typeof err === "object" && err && "digest" in err ? String((err as { digest?: unknown }).digest) : "";
    if (digest.includes("NEXT_REDIRECT")) throw err;
  }
  const res = await fetch("/api/auth/verify-otp", { method: "POST", body: fd, credentials: "same-origin" });
  const data = (await res.json().catch(() => null)) as JsonResult | null;
  if (!data) return { error: "Could not verify the code. Try again." };
  return data;
}

export function AuthFlow({ mode }: { mode: "login" | "signup" }) {
  const [step, setStep] = useState<"id" | "otp" | "profile">("id");
  const [identifier, setIdentifier] = useState("");
  const [hint, setHint] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="font-heading text-3xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your VIDLIX"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-mist-500">
        {mode === "login"
          ? "Email, then a one-time code. No password. No mobile OTP."
          : "You must be 18+. Camera is not requested during signup. We only send OTP to email."}
      </p>

      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      {step === "id" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);
            try {
                const res = await sendCode(new FormData(e.currentTarget));
              if (res.error) {
                setError(res.error);
                return;
              }
              setHint(res.hint);
              setStep("otp");
            } catch {
              setError("Could not send the code. If this keeps happening, SMTP is not reaching the mailbox.");
            } finally {
              setPending(false);
            }
          }}
        >
          <label className="block text-sm font-medium" htmlFor="identifier">
            Email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="email"
            className="input"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="email"
            inputMode="email"
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
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);
            try {
                const res = await verifyCode(new FormData(e.currentTarget));
              if (res.error) {
                setError(res.error);
                return;
              }
              if (res.next) {
                window.location.assign(res.next);
                return;
              }
              if (mode === "signup") setStep("profile");
            } catch {
              setError("Could not verify the code. Try again.");
            } finally {
              setPending(false);
            }
          }}
        >
          <input type="hidden" name="identifier" value={identifier} />
          <input type="hidden" name="purpose" value={mode} />
          <label className="block text-sm font-medium" htmlFor="code">
            One-time code
          </label>
          <input id="code" name="code" className="input tracking-[0.4em]" required inputMode="numeric" />
          {hint ? <p className="text-xs text-mist-500">Development code: {hint}</p> : null}
          <button className="btn-primary w-full" disabled={pending} type="submit">
            {pending ? "Checking…" : "Continue"}
          </button>
        </form>
      ) : null}

      {step === "profile" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);
            try {
              const res = await completeSignupAction(new FormData(e.currentTarget));
              if (res && "error" in res && res.error) {
                setError(res.error);
                return;
              }
            } catch {
              setError("Could not create the account. Try again.");
            } finally {
              setPending(false);
            }
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
            <a href="/signup" className="font-medium text-ink-900 underline dark:text-white">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" className="font-medium text-ink-900 underline dark:text-white">
              Log in
            </a>
          </>
        )}
      </p>
    </div>
  );
}
