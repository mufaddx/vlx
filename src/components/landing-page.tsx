import Link from "next/link";
import {
  Shield,
  EyeOff,
  Ban,
  Camera,
  MicOff,
  SkipForward,
  UserPlus,
  MessageCircle,
  Flag,
  Lock,
  Sparkles,
  Check,
} from "lucide-react";
import type { FaqItem, SubscriptionPlan } from "@prisma/client";

function Section({
  id,
  eyebrow,
  title,
  copy,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  copy?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 mx-auto max-w-7xl px-6 py-20">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {copy ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-500 dark:text-mist-400">{copy}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function RandomStage() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950 shadow-glass">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 text-xs text-white/70">
        <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur">Anonymous match</span>
        <span className="rounded-full bg-teal/20 px-3 py-1 text-teal">Identity hidden</span>
      </div>
      <div className="grid h-[420px] grid-rows-2 sm:h-[520px]">
        <div className="relative bg-gradient-to-br from-violet/40 via-ink-800 to-ink-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,124,255,0.35),transparent_45%)]" />
          <p className="absolute left-4 top-14 text-[11px] uppercase tracking-widest text-white/50">
            Other person · 50%
          </p>
        </div>
        <div className="relative border-t border-white/10 bg-gradient-to-tr from-teal/30 via-ink-900 to-ink-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(94,234,212,0.28),transparent_40%)]" />
          <p className="absolute left-4 top-4 text-[11px] uppercase tracking-widest text-white/50">You · 50%</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3">
        {[MicOff, Camera, UserPlus, MessageCircle, SkipForward, Flag].map((Icon, i) => (
          <span
            key={i}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
          >
            <Icon className="h-4 w-4" />
          </span>
        ))}
      </div>
    </div>
  );
}

function LiveStage() {
  return (
    <div className="overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-glass dark:border-white/10 dark:bg-ink-800">
      <div className="grid gap-3 p-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-violet/40 to-ink-950">
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white">
            LIVE · 1.2k
          </span>
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/10 ring-1 ring-white/20" />
            ))}
          </div>
        </div>
        <div className="flex min-h-[280px] flex-col rounded-2xl border border-mist-200 p-3 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist-400">Live chat</p>
          <div className="mt-3 flex-1 space-y-2 text-sm">
            <p>
              <span className="text-teal">host</span> Welcome in — request to join if you want video.
            </p>
            <p className="text-mist-500">viewer · This energy is excellent.</p>
            <p className="text-mist-500">viewer · Join request sent.</p>
          </div>
          <div className="mt-3 rounded-xl bg-mist-100 px-3 py-2 text-sm text-mist-500 dark:bg-ink-700">
            Say something…
          </div>
        </div>
      </div>
    </div>
  );
}

function DatingStage() {
  return (
    <div className="mx-auto grid max-w-md gap-4">
      <div className="overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-glass dark:border-white/10 dark:bg-ink-800">
        <div className="h-72 bg-gradient-to-br from-violet/50 via-ink-700 to-teal/30" />
        <div className="p-5">
          <p className="font-heading text-xl font-semibold">Alex, 27</p>
          <p className="text-sm text-mist-500">Lisbon · Looking for real conversations</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Film", "Night walks", "Design"].map((t) => (
              <span key={t} className="rounded-full bg-mist-100 px-3 py-1 text-xs dark:bg-ink-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn-secondary">
          Pass
        </button>
        <button type="button" className="btn-primary">
          Like
        </button>
      </div>
    </div>
  );
}

function ChatStage() {
  return (
    <div className="overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-glass dark:border-white/10 dark:bg-ink-800">
      <div className="flex items-center justify-between border-b border-mist-200 px-4 py-3 dark:border-white/10">
        <div>
          <p className="font-semibold">Private chat</p>
          <p className="text-xs text-mist-400">Username visibility follows your plan</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-mist-100 dark:bg-ink-700">
          <Camera className="h-4 w-4" />
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-mist-100 px-4 py-2 text-sm dark:bg-ink-700">
          That call was unexpectedly kind.
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-ink-900 px-4 py-2 text-sm text-white dark:bg-teal dark:text-ink-950">
          Same. Sending a follow request.
        </div>
        <p className="text-center text-xs text-mist-400">Typing…</p>
      </div>
    </div>
  );
}

export function LandingPage({
  plans,
  faqs,
}: {
  plans: SubscriptionPlan[];
  faqs: FaqItem[];
}) {
  return (
    <div id="home">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-8 pt-12 lg:grid-cols-2 lg:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-deep dark:text-teal">
            Privacy-first social video
          </p>
          <h1 className="mt-4 font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
            Meet. Connect. Discover.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-500 dark:text-mist-400">
            Connect with people through private random video conversations, live streams, dating and
            meaningful social connections — all in one privacy-focused platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Start Random Video
            </Link>
            <a href="#live" className="btn-secondary">
              Explore Live
            </a>
            <a href="#dating" className="btn-ghost">
              Explore Dating
            </a>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              ["Random", "Anonymous 1:1"],
              ["Live", "Host + 10 video"],
              ["Social", "Follow privately"],
              ["Privacy", "No call recording"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-mist-200 p-3 dark:border-white/10">
                <dt className="text-mist-400">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <RandomStage />
      </section>

      <Section
        id="random"
        eyebrow="Random Video"
        title="Meet Someone New, Instantly."
        copy="Start a random video conversation with another available person. Matching is instant. Identity stays anonymous until you both choose otherwise."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Instant matchmaking",
              "50/50 video experience",
              "Next / Skip",
              "In-call chat",
              "Follow request",
              "Report",
              "Block",
              "Anonymous identity during random calls",
            ].map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-2xl border border-mist-200 bg-white p-4 dark:border-white/10 dark:bg-ink-800"
              >
                <Check className="mt-0.5 h-4 w-4 text-teal-deep dark:text-teal" />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <div>
            <p className="mb-3 text-sm font-medium text-mist-500">
              Top 50% other person · Bottom 50% you. No username. No user ID. No email. No phone. No
              external socials.
            </p>
            <RandomStage />
          </div>
        </div>
      </Section>

      <Section
        id="privacy"
        eyebrow="Privacy"
        title="Random Means Random."
        copy="During random video calls, people do not see your full username or a searchable identity. You meet the person, not their profile graph."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [EyeOff, "Anonymous Random Matching"],
            [Lock, "Username Protection"],
            [Ban, "Block & Report"],
            [Shield, "Privacy Controls"],
            [Camera, "No Random Call Recording"],
          ].map(([Icon, label]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-mist-200 bg-white p-5 dark:border-white/10 dark:bg-ink-800"
            >
              <Icon className="h-5 w-5 text-violet-deep dark:text-teal" />
              <p className="mt-3 text-sm font-medium">{label as string}</p>
            </div>
          ))}
        </div>
        <Link href="/signup" className="btn-primary mt-8">
          Start Random Video
        </Link>
      </Section>

      <Section
        id="live"
        eyebrow="Live"
        title="Watch. Join. Go Live."
        copy="Watch live streams, chat, send join requests, and become a participant. Hosts stay in control."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="font-semibold">Viewers can</p>
              <p className="mt-2 text-sm leading-relaxed text-mist-500 dark:text-mist-400">
                Watch, chat, follow, request to join, become a participant, interact with the host,
                leave, report, and block.
              </p>
            </div>
            <div>
              <p className="font-semibold">Hosts can</p>
              <p className="mt-2 text-sm leading-relaxed text-mist-500 dark:text-mist-400">
                Accept or reject join requests, remove, mute, or block participants, and end the live.
              </p>
            </div>
            <p className="rounded-2xl border border-mist-200 p-4 text-sm dark:border-white/10">
              Maximum 10 active video participants. A live can have viewers beyond those 10,
              depending on infrastructure limits.
            </p>
          </div>
          <LiveStage />
        </div>
      </Section>

      <Section
        id="dating"
        eyebrow="Dating · optional"
        title="Discover People You May Like."
        copy="Dating is optional. A normal account is not automatically added to Dating. During account creation we ask: Do you want to create a Dating Profile? Yes, No, or Maybe later."
      >
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <ul className="space-y-2 text-sm leading-relaxed text-mist-500 dark:text-mist-400">
            <li>Main photo plus additional photos — maximum 6.</li>
            <li>Bio, interests, dating preference, location where appropriate, and intention.</li>
            <li>Like, Pass, Match, then chat — an original VIDLIX flow, not a swipe clone.</li>
            <li>You can create a Dating Profile later from the dashboard.</li>
          </ul>
          <DatingStage />
        </div>
      </Section>

      <Section
        id="features"
        eyebrow="Private connections"
        title="Connect Privately."
        copy="Send a Follow Request. In a random call the username stays hidden. A request shows limited identity. After accept, a connection is created. Subscriptions can unlock full username, private chat, private video, and premium connection features."
      >
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            ["Random call", "Username hidden"],
            ["Follow request", "Limited identity"],
            ["Accepted", "Connection created"],
            ["Premium", "Fuller access"],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-mist-200 bg-white p-5 dark:border-white/10 dark:bg-ink-800">
              <p className="text-xs text-mist-400">0{i + 1}</p>
              <p className="mt-2 font-heading text-lg font-semibold">{t}</p>
              <p className="mt-1 text-sm text-mist-500">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="chat"
        eyebrow="Chat"
        title="Stay Connected Beyond the Call."
        copy="Continue through private chat with realtime messaging, emoji, unread counts, typing indicators, read status, video call, block, and report."
      >
        <div className="mx-auto max-w-xl">
          <ChatStage />
        </div>
      </Section>

      <Section
        id="pricing"
        eyebrow="Subscription"
        title="Choose Your VIDLIX Plan."
        copy="Plans are controlled from the Super Admin Panel — names, prices, sponsored connection slots, and entitlements are not frozen in the product."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl border p-5 ${
                p.highlight
                  ? "border-violet bg-ink-900 text-white shadow-lift dark:bg-ink-800"
                  : "border-mist-200 bg-white dark:border-white/10 dark:bg-ink-800"
              }`}
            >
              <p className="text-sm uppercase tracking-widest opacity-70">{p.name}</p>
              <p className="mt-3 font-heading text-3xl font-semibold">
                {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
              </p>
              <p className="mt-1 text-sm opacity-70">{p.durationDays} days</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>{p.maxSponsoredUsers} sponsored connection slots</li>
                <li>{p.chatAccess ? "Private chat" : "Limited chat"}</li>
                <li>{p.videoCallAccess ? "Private video" : "No private video"}</li>
                <li>{p.usernameVisibility ? "Username visibility" : "Username locked"}</li>
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-mist-500">
          Subscriptions can unlock Random Video premium features, Dating, private chat, private
          video, username visibility, connection features, and Live features — exactly as Admin
          configures.
        </p>
      </Section>

      <Section
        title="Sponsored Premium Connection"
        copy="A premium user can use available connection slots to activate Premium Connection access for another VIDLIX user. The original subscriber keeps their subscription. This is not a subscription transfer."
      >
        <ol className="grid gap-3 md:grid-cols-5">
          {["Premium user", "Add connection", "Enter VIDLIX username", "Send invite", "Recipient accepts"].map(
            (s, i) => (
              <li key={s} className="rounded-2xl bg-mist-100 px-4 py-5 text-sm font-medium dark:bg-ink-800">
                <span className="text-mist-400">Step {i + 1}</span>
                <p className="mt-2">{s}</p>
              </li>
            ),
          )}
        </ol>
        <p className="mt-6 text-sm text-mist-500">Then: Sponsored Connection Active.</p>
      </Section>

      <Section
        title="Free connection limits"
        copy="Free users may have limited access to premium connections. After the limit, VIDLIX shows: Your free connection limit has been reached. Purchase a subscription or accept sponsored premium access if offered. The limit is configurable from Admin — it is not permanently hard-coded."
      />

      <Section id="how" eyebrow="How it works" title="Four steps to VIDLIX.">
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            ["Create your account.", "Email or mobile, OTP, 18+ profile."],
            ["Choose what you want.", "Random Video, Live, or Dating."],
            ["Connect and interact.", "Match, watch, like, follow."],
            ["Continue privately.", "Chat, private video, subscriptions."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-mist-200 p-6 dark:border-white/10">
              <p className="text-xs uppercase tracking-widest text-mist-400">Step {i + 1}</p>
              <p className="mt-3 font-heading text-xl font-semibold">{t}</p>
              <p className="mt-2 text-sm text-mist-500">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="safety"
        eyebrow="Safety"
        title="Built to be interruptible."
        copy="Anonymous random calling, block, report, privacy controls, community guidelines, moderation, and account security."
      >
        <Link href="/safety" className="btn-primary">
          Visit Safety Center
        </Link>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions, answered.">
        <div className="divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 dark:divide-white/10 dark:border-white/10">
          {faqs.map((f) => (
            <details key={f.id} className="group bg-white px-5 py-4 dark:bg-ink-800">
              <summary className="cursor-pointer list-none font-medium">{f.question}</summary>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mist-500">{f.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-ink-900 px-8 py-16 text-white dark:bg-gradient-to-br dark:from-ink-800 dark:to-ink-950">
          <Sparkles className="h-6 w-6 text-teal" />
          <h2 className="mt-4 font-heading text-4xl font-semibold">Ready to Connect?</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn bg-teal text-ink-950 hover:bg-teal/90">
              Start Random Video
            </Link>
            <Link href="/signup" className="btn bg-white/10 text-white hover:bg-white/15">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
