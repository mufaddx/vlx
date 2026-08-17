import Link from "next/link";
import { Camera, MicOff, SkipForward, UserPlus, MessageCircle, Flag } from "lucide-react";
import type { FaqItem, SubscriptionPlan } from "@prisma/client";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";

function PhotoPair({
  id,
  kicker,
  title,
  copy,
  photo,
  alt,
  visual,
  photoLeft,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  copy?: string;
  photo?: string;
  alt?: string;
  visual?: React.ReactNode;
  photoLeft?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mx-auto max-w-7xl px-6 py-10 lg:py-12">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        <div
          className={`relative order-1 min-h-[200px] overflow-hidden rounded-2xl aspect-[16/10] max-h-[240px] sm:max-h-none sm:aspect-[4/3] lg:aspect-auto lg:max-h-none lg:min-h-[300px] ${
            photoLeft ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {visual ?? (
            <CoverPhoto src={photo!} alt={alt!} sizes="(max-width: 1024px) 100vw, 50vw" />
          )}
        </div>
        <div
          className={`order-2 flex h-full flex-col gap-3 rounded-2xl border border-mist-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-ink-950/50 lg:p-6 ${
            photoLeft ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">
            {kicker}
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {copy ? <p className="text-mist-500 dark:text-mist-400">{copy}</p> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

function RandomStage() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      <div className="grid h-[calc(100%-3.25rem)] grid-rows-2">
        <div className="relative">
          <CoverPhoto src={photos.randomPeer} alt="Other person on a random call" sizes="(max-width: 1024px) 100vw, 40vw" />
          <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">Them</p>
        </div>
        <div className="relative border-t border-white/10">
          <CoverPhoto src={photos.randomSelf} alt="You on a random call" sizes="(max-width: 1024px) 100vw, 40vw" />
          <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">You</p>
        </div>
      </div>
      <div className="absolute bottom-0 flex h-12 w-full justify-center gap-2 bg-black/50 px-3 py-2">
        {[MicOff, Camera, UserPlus, MessageCircle, SkipForward, Flag].map((Icon, i) => (
          <span key={i} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white">
            <Icon className="h-4 w-4" />
          </span>
        ))}
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
  const shortFaqs = faqs.slice(0, 6);
  return (
    <div id="home">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:pb-12 lg:pt-8">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <div className="relative order-1 aspect-[16/10] max-h-[240px] overflow-hidden rounded-2xl sm:max-h-[320px] lg:order-2 lg:max-h-none lg:aspect-auto lg:min-h-[340px]">
            <div className="absolute inset-0 lg:hidden">
              <CoverPhoto src={photos.heroMobile} alt="VIDLIX on a phone" sizes="100vw" priority />
            </div>
            <div className="absolute inset-0 hidden lg:block">
              <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" sizes="50vw" priority />
            </div>
          </div>

          <div className="order-2 flex gap-3 lg:hidden">
            <Link href="/signup" className="btn-primary flex-1 text-center">
              Sign Up
            </Link>
            <Link href="/login" className="btn-secondary flex-1 text-center">
              Login
            </Link>
          </div>

          <div className="order-3 flex h-full flex-col gap-3 rounded-2xl border border-mist-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-ink-950/50 lg:order-1 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">
              Privacy-first video
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Meet. Connect. Discover.
            </h1>
            <p className="text-mist-500 dark:text-mist-400">
              Anonymous random video, live rooms, optional dating, and private chat — on the web.
            </p>
            <div className="mt-auto hidden flex-wrap gap-3 pt-4 lg:flex">
              <Link href="/signup" className="btn-primary">
                Get started
              </Link>
              <a href="/#how" className="btn-secondary">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <PhotoPair
        id="random"
        kicker="Random Video"
        title="Meet someone new. Stay anonymous."
        copy="50/50 video. No username. No recording. Skip, chat, follow, report, or block — without exposing who you are."
        visual={<RandomStage />}
      />

      <PhotoPair
        id="live"
        kicker="Live"
        title="Watch. Join. Go live."
        copy="Up to 10 people on video. Hosts stay in control."
        photo={photos.liveHost}
        alt="VIDLIX Live"
        photoLeft
      >
        <ul className="space-y-2 text-mist-500">
          <li>Viewers watch, chat, and request to join.</li>
          <li>Hosts accept, mute, remove, or end the room.</li>
        </ul>
      </PhotoPair>

      <PhotoPair
        id="dating"
        kicker="Dating · optional"
        title="Only if you want it."
        copy="A normal account is never auto-added to Dating. Photos, bio, Like or Pass, then match and chat."
        photo={photos.dating}
        alt="Optional dating profile"
      />

      <PhotoPair
        id="features"
        kicker="Connections"
        title="Follow after the call."
        copy="Request with limited identity. Accept to connect. Plans can unlock usernames, chat, and private video."
        photo={photos.live1}
        alt="VIDLIX connections"
        photoLeft
      />

      <PhotoPair
        id="chat"
        kicker="Chat"
        title="Keep talking after you hang up."
        copy="Private chat when both of you want to keep the conversation going."
        photo={photos.chat}
        alt="Private chat"
      />

      <PhotoPair
        id="pricing"
        kicker="Plans"
        title="Pick a plan."
        copy="Prices and perks are set in Admin — not frozen in the app."
        photo={photos.pricing}
        alt="VIDLIX plans"
        photoLeft
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {plans.map((p) => (
            <div key={p.id} className={`rounded-xl border border-mist-200 p-3 dark:border-white/10 ${p.highlight ? "ring-1 ring-violet" : ""}`}>
              <p className="text-sm text-mist-500">{p.name}</p>
              <p className="mt-1 font-heading text-xl font-semibold">
                {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
              </p>
            </div>
          ))}
        </div>
      </PhotoPair>

      <section id="how" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-10 lg:py-12">
        <div className="rounded-2xl border border-mist-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-ink-950/50 lg:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">How it works</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Four steps.</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Email OTP, 18+ profile.", "Random, Live, or Dating.", "Match, watch, or follow.", "Chat when you both want."].map(
              (s, i) => (
                <li key={s} className="rounded-xl border border-mist-200/70 p-4 dark:border-white/10">
                  <p className="text-xs text-mist-400">0{i + 1}</p>
                  <p className="mt-2 font-medium">{s}</p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <PhotoPair
        id="safety"
        kicker="Safety"
        title="Block. Report. Leave."
        copy="Tools to stay in control of every conversation."
        photo={photos.safety}
        alt="Safety on VIDLIX"
      >
        <Link href="/safety" className="btn-primary w-fit">
          Safety Center
        </Link>
      </PhotoPair>

      <section id="faq" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-10 lg:py-12">
        <div className="rounded-2xl border border-mist-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-ink-950/50 lg:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">FAQ</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Quick answers.</h2>
          <div className="mt-6 divide-y divide-mist-200 border-y border-mist-200 dark:divide-white/10 dark:border-white/10">
            {shortFaqs.map((f) => (
              <details key={f.id} className="py-4">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-2 max-w-2xl text-sm text-mist-500">{f.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/help" className="mt-6 inline-block text-sm underline">
            More in Help Center
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[21/8] min-h-[180px] max-h-[280px] lg:max-h-none">
            <CoverPhoto src={photos.extra} alt="Ready to join VIDLIX" sizes="100vw" />
            <div className="absolute inset-0 bg-ink-950/55" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-white sm:px-8">
              <h2 className="font-heading text-3xl font-semibold">Ready?</h2>
              <Link href="/signup" className="btn-primary mt-4">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
