import Link from "next/link";
import { Camera, MicOff, SkipForward, UserPlus, MessageCircle, Flag } from "lucide-react";
import type { FaqItem, SubscriptionPlan } from "@prisma/client";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";

function Section({
  id,
  kicker,
  title,
  copy,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  copy?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mx-auto max-w-7xl px-6 py-16 lg:py-20">
      {kicker ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">
          {kicker}
        </p>
      ) : null}
      <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {copy ? <p className="mt-3 max-w-xl text-mist-500 dark:text-mist-400">{copy}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Split({
  children,
  photo,
  alt,
}: {
  children: React.ReactNode;
  photo: string;
  alt: string;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="order-2 lg:order-1">{children}</div>
      <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2 lg:aspect-[5/4]">
        <CoverPhoto src={photo} alt={alt} sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </div>
  );
}

function RandomStage() {
  return (
    <div className="overflow-hidden rounded-2xl bg-ink-950">
      <div className="grid h-[380px] grid-rows-2 sm:h-[460px]">
        <div className="relative">
          <CoverPhoto src={photos.randomPeer} alt="Other person on a random call" sizes="(max-width: 1024px) 100vw, 40vw" />
          <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">Them</p>
        </div>
        <div className="relative border-t border-white/10">
          <CoverPhoto src={photos.randomSelf} alt="You on a random call" sizes="(max-width: 1024px) 100vw, 40vw" />
          <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">You</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 bg-black/50 px-3 py-3">
        {[MicOff, Camera, UserPlus, MessageCircle, SkipForward, Flag].map((Icon, i) => (
          <span key={i} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white">
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
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-10 pt-6 lg:grid-cols-2 lg:gap-14 lg:pt-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-deep dark:text-teal">
            Privacy-first video
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            Meet. Connect. Discover.
          </h1>
          <p className="mt-4 max-w-md text-lg text-mist-500 dark:text-mist-400">
            Anonymous random video, live rooms, optional dating, and private chat — on the web.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Get started
            </Link>
            <a href="/#how" className="btn-secondary">
              How it works
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10] lg:aspect-[5/4]">
          <div className="absolute inset-0 lg:hidden">
            <CoverPhoto src={photos.heroMobile} alt="VIDLIX on a phone" sizes="100vw" priority />
          </div>
          <div className="absolute inset-0 hidden lg:block">
            <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" sizes="50vw" priority />
          </div>
        </div>
      </section>

      <Section id="random" kicker="Random Video" title="Meet someone new. Stay anonymous." copy="50/50 video. No username. No recording.">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <p className="max-w-sm text-mist-500">Skip, chat, follow, report, or block — without exposing who you are.</p>
          <RandomStage />
        </div>
      </Section>

      <Section id="live" kicker="Live" title="Watch. Join. Go live." copy="Up to 10 people on video. Hosts stay in control.">
        <Split photo={photos.liveHost} alt="VIDLIX Live">
          <ul className="space-y-2 text-mist-500">
            <li>Viewers watch, chat, and request to join.</li>
            <li>Hosts accept, mute, remove, or end the room.</li>
          </ul>
        </Split>
      </Section>

      <Section id="dating" kicker="Dating · optional" title="Only if you want it." copy="A normal account is never auto-added to Dating.">
        <Split photo={photos.dating} alt="Optional dating profile">
          <p className="text-mist-500">Photos, bio, Like or Pass, then match and chat.</p>
        </Split>
      </Section>

      <Section id="features" kicker="Connections" title="Follow after the call." copy="Request with limited identity. Accept to connect.">
        <p className="text-mist-500">Plans can unlock usernames, chat, and private video.</p>
      </Section>

      <Section id="chat" kicker="Chat" title="Keep talking after you hang up.">
        <div className="relative aspect-[16/10] max-w-3xl overflow-hidden rounded-2xl">
          <CoverPhoto src={photos.chat} alt="Private chat" sizes="(max-width: 1024px) 100vw, 48rem" />
        </div>
      </Section>

      <Section id="pricing" kicker="Plans" title="Pick a plan." copy="Prices and perks are set in Admin — not frozen in the app.">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 dark:border-white/10 dark:bg-white/10 md:grid-cols-2 xl:grid-cols-5">
          {plans.map((p) => (
            <div key={p.id} className={`bg-white p-5 dark:bg-ink-950 ${p.highlight ? "xl:ring-1 xl:ring-violet" : ""}`}>
              <p className="text-sm text-mist-500">{p.name}</p>
              <p className="mt-2 font-heading text-2xl font-semibold">
                {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="how" kicker="How it works" title="Four steps.">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["Email OTP, 18+ profile.", "Random, Live, or Dating.", "Match, watch, or follow.", "Chat when you both want."].map(
            (s, i) => (
              <li key={s}>
                <p className="text-xs text-mist-400">0{i + 1}</p>
                <p className="mt-2 font-medium">{s}</p>
              </li>
            ),
          )}
        </ol>
      </Section>

      <Section id="safety" kicker="Safety" title="Block. Report. Leave.">
        <Split photo={photos.safety} alt="Safety on VIDLIX">
          <Link href="/safety" className="btn-primary">
            Safety Center
          </Link>
        </Split>
      </Section>

      <Section id="faq" kicker="FAQ" title="Quick answers.">
        <div className="divide-y divide-mist-200 border-y border-mist-200 dark:divide-white/10 dark:border-white/10">
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
      </Section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[21/8] min-h-[200px]">
            <CoverPhoto src={photos.extra} alt="Ready to join VIDLIX" sizes="100vw" />
            <div className="absolute inset-0 bg-ink-950/55" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-8 text-white">
              <h2 className="font-heading text-3xl font-semibold">Ready?</h2>
              <Link href="/signup" className="btn-primary mt-6">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
