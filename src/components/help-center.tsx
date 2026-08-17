"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const ARTICLES: { cat: string; q: string; a: string }[] = [
  {
    cat: "Account",
    q: "How do I create an account?",
    a: "Open Sign Up, enter your email, then the one-time code we send. Complete your 18+ profile. VIDLIX does not use passwords or mobile OTP.",
  },
  {
    cat: "Account",
    q: "I did not get the email code.",
    a: "Check spam. Request a new code from Log in. Codes expire after 10 minutes. Mobile numbers are not used for login.",
  },
  {
    cat: "Account",
    q: "How do I delete my account?",
    a: "Log in → Settings → Delete Account. This is permanent.",
  },
  {
    cat: "Random Video",
    q: "Is Random Video recorded?",
    a: "No. Video and audio are not stored. Only session metadata (start, end, duration, reason) is kept.",
  },
  {
    cat: "Random Video",
    q: "Will they see my username?",
    a: "No. Random matches hide username, email, and phone. Follow requests show a limited identity until accepted.",
  },
  {
    cat: "Live",
    q: "How many people can be on Live video?",
    a: "Up to 10 active video participants. Others can watch. The host accepts join requests.",
  },
  {
    cat: "Dating",
    q: "Am I added to Dating automatically?",
    a: "No. Dating is optional. Create a Dating Profile only if you want to.",
  },
  {
    cat: "Chat",
    q: "Why is chat limited?",
    a: "Free plans have a message cap set in Admin. Upgrade or accept a sponsored connection if you are offered one.",
  },
  {
    cat: "Billing",
    q: "How do subscriptions work?",
    a: "Plans are defined in Admin. Paid checkout needs a PaymentProvider. Mock checkout never charges a card.",
  },
  {
    cat: "Safety",
    q: "How do I report or block someone?",
    a: "Use Report or Block in a call, live, chat, profile, or dating card. Blocked people cannot match or message you.",
  },
];

const CATS = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.cat)))];

export function HelpCenter() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (cat !== "All" && a.cat !== cat) return false;
      if (!needle) return true;
      return `${a.q} ${a.a}`.toLowerCase().includes(needle);
    });
  }, [q, cat]);

  return (
    <div>
      <input
        className="input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search help"
        aria-label="Search help"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            className={cat === c ? "btn-primary" : "btn-secondary"}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="mt-8 space-y-4">
        {rows.map((a) => (
          <li key={a.q} className="rounded-2xl border border-mist-200 p-5 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-mist-400">{a.cat}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold">{a.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist-500 dark:text-mist-400">{a.a}</p>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-mist-500">
          No article matched. Email{" "}
          <Link href="/contact" className="underline">
            hello@vidlix.in
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
