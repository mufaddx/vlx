import type { FaqItem, SubscriptionPlan } from "@prisma/client";
import { Camera, Flag, MessageCircle, MicOff, SkipForward, UserPlus } from "lucide-react";
import { CoverPhoto } from "@/components/cover-photo";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/marketing-photos";

function Split({
  id,
  photoLeft,
  photo,
  alt,
  visual,
  children,
}: {
  id?: string;
  photoLeft?: boolean;
  photo?: string;
  alt?: string;
  visual?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 lg:grid lg:h-[calc(100svh-4rem)] lg:min-h-[36rem] lg:grid-cols-2 lg:overflow-hidden"
    >
      <div className={`relative ${photoLeft ? "lg:order-1" : "lg:order-2"} lg:h-full`}>
        {visual ? (
          visual
        ) : (
          <>
            <div className="lg:hidden">
              <CoverPhoto src={photo!} alt={alt!} fit="natural" sizes="100vw" />
            </div>
            <div className="relative hidden h-full min-h-[36rem] lg:block">
              <CoverPhoto src={photo!} alt={alt!} fit="cover" sizes="50vw" />
            </div>
          </>
        )}
      </div>
      <div
        className={`flex flex-col justify-center px-5 py-8 sm:px-8 lg:overflow-y-auto lg:px-16 lg:py-12 ${
          photoLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

function RandomStage() {
  return (
    <>
      <div className="lg:hidden">
        <div className="relative">
          <CoverPhoto src={photos.randomPeer} alt="Other person on a random call" fit="natural" sizes="100vw" />
          <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.2em] text-white/80">Them</p>
        </div>
        <div className="relative">
          <CoverPhoto src={photos.randomSelf} alt="You on a random call" fit="natural" sizes="100vw" />
          <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.2em] text-white/80">You</p>
        </div>
      </div>
      <div className="absolute inset-0 hidden flex-col lg:flex">
        <div className="relative min-h-0 flex-1">
          <CoverPhoto src={photos.randomPeer} alt="Other person on a random call" fit="cover" sizes="50vw" />
          <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.2em] text-white/80">Them</p>
        </div>
        <div className="relative min-h-0 flex-1 border-t border-white/10">
          <CoverPhoto src={photos.randomSelf} alt="You on a random call" fit="cover" sizes="50vw" />
          <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.2em] text-white/80">You</p>
        </div>
        <div className="flex h-14 shrink-0 items-center justify-center gap-2 bg-black/60">
          {[MicOff, Camera, UserPlus, MessageCircle, SkipForward, Flag].map((Icon, i) => (
            <span key={i} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white">
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-deep dark:text-teal">
      {children}
    </p>
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
    <div id="home" className="lg:snap-y lg:snap-proximity">
      <section className="scroll-mt-16 lg:grid lg:h-[calc(100svh-4rem)] lg:min-h-[36rem] lg:grid-cols-2 lg:overflow-hidden lg:snap-start">
        <div className="relative lg:order-2 lg:h-full">
          <div className="relative lg:hidden">
            <CoverPhoto src={photos.heroMobile} alt="VIDLIX on a phone" fit="natural" sizes="100vw" priority />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent p-4">
              <div className="flex gap-3">
                <a href="/signup" className="btn-primary flex-1 text-center">
                  Sign up
                </a>
                <a href="/login" className="btn-secondary flex-1 text-center">
                  Sign in
                </a>
              </div>
            </div>
          </div>
          <div className="relative hidden h-full lg:block">
            <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" fit="cover" sizes="50vw" priority />
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:order-1 lg:overflow-y-auto lg:px-16">
          <Reveal>
            <Kicker>Privacy-first video</Kicker>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
              Meet. Connect.
              <br />
              Discover.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mist-600 dark:text-mist-300 sm:text-lg">
              Anonymous random video, live rooms, optional dating, and private chat — on the web. No
              app store. Email OTP only. You must be 18+.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist-500">
              Random matches never see your username, email, or phone. VIDLIX does not record those
              calls. Dating stays off until you turn it on.
            </p>
            <div className="mt-8 hidden gap-3 lg:flex">
              <a href="/signup" className="btn-primary">
                Get started
              </a>
              <a href="/#how" className="btn-secondary">
                How it works
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Split id="random" visual={<RandomStage />}>
        <Kicker>Random Video</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Meet someone new. Stay anonymous.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
          A live 50/50 camera match. The other person does not see who you are on the account. Mute,
          skip, report, or block. Follow only if you both want to stay in touch after.
        </p>
        <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
          <li>No username, email, or phone on the call.</li>
          <li>VIDLIX does not store random-call video or audio.</li>
          <li>This is not a dating queue unless you later opt into Dating.</li>
        </ul>
      </Split>

      <section className="border-y border-mist-200/80 px-5 py-16 dark:border-white/10 sm:px-8 lg:snap-start lg:px-16 lg:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <Kicker>The idea</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
            Conversation first. Profile second.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist-600 dark:text-mist-300">
            Most products show your name before you have spoken. VIDLIX inverts that. Random Video is
            a face and a voice. Live is a room with a host. Dating is a separate opt-in. Chat opens
            when two people have already chosen each other.
          </p>
        </Reveal>
      </section>

      <Split id="live" photoLeft photo={photos.liveHost} alt="VIDLIX Live">
        <Kicker>Live</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Watch. Join. Go live.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
          Sit as a viewer, use room chat, request to come on camera. Hosts accept or decline. Up to
          10 people on video so the room stays watchable. Hosts can mute, remove, or end.
        </p>
      </Split>

      <Split id="dating" photo={photos.dating} alt="Optional dating on VIDLIX">
        <Kicker>Dating · optional</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Only if you want it.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
          Creating an account does not put you in the dating pool. Age is date of birth, not a face
          scan. Like or Pass, match two-sided, then chat. Turn it off anytime.
        </p>
      </Split>

      <section id="features" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:snap-start lg:px-16 lg:py-24">
        <Reveal className="mx-auto max-w-5xl">
          <Kicker>Connections</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">Follow after the call.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist-500">
            A good random call should not force a public friendship. Request with limited identity.
            They accept, ignore, or block.
          </p>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              {
                t: "Request",
                d: "After Random you can ask to stay in touch. Until they accept, you stay mostly unnamed.",
              },
              {
                t: "Unlock",
                d: "Accepted connections can open username, chat, and — depending on plan — private video.",
              },
              {
                t: "Leave",
                d: "Block and report still work. Hide or delete from Settings if you want a quieter account.",
              },
            ].map((x) => (
              <div key={x.t}>
                <h3 className="font-heading text-lg font-semibold">{x.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Split id="chat" photoLeft photo={photos.chat} alt="Private VIDLIX chat">
        <Kicker>Chat</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Keep talking after you hang up.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
          Threads are for people who already chose each other — a match, an accepted follow, or a
          conversation you both want. Not a wall. Not a way to hunt someone who skipped you.
        </p>
      </Split>

      <section id="how" className="scroll-mt-16 border-y border-mist-200/80 px-5 py-16 dark:border-white/10 sm:px-8 lg:snap-start lg:px-16 lg:py-24">
        <Reveal className="mx-auto max-w-5xl">
          <Kicker>How it works</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">Four steps.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Email OTP and an 18+ profile. Camera is not requested at signup.",
              "Choose Random, Live, or Dating. Dating stays off until you opt in.",
              "Skip, watch, Like, or send a follow. Nothing is automatic.",
              "Chat when you both want. Block, report, or leave at any time.",
            ].map((d, i) => (
              <li key={d}>
                <p className="text-xs tracking-[0.18em] text-mist-400">0{i + 1}</p>
                <p className="mt-3 text-[15px] leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section id="pricing" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:snap-start lg:px-16 lg:py-24">
        <Reveal className="mx-auto max-w-5xl">
          <Kicker>Plans</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">Pick how you use VIDLIX.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist-500">
            Free is enough to try. Paid plans can open more chat, private video, dating tools, or live
            features. Prices live in Admin — not frozen in this page.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-none border border-mist-200 bg-mist-200 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 xl:grid-cols-5">
            {plans.map((p) => (
              <div key={p.id} className={`bg-white p-5 dark:bg-ink-950 ${p.highlight ? "ring-1 ring-inset ring-violet" : ""}`}>
                <p className="text-sm text-mist-500">{p.name}</p>
                <p className="mt-2 font-heading text-2xl font-semibold">
                  {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Split id="safety" photo={photos.safety} alt="Safety on VIDLIX">
        <Kicker>Safety</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight xl:text-4xl">
          Block. Report. Leave.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
          End any interaction immediately. We do not record random calls as a product feature. We do
          not put you in Dating without a clear opt-in.
        </p>
        <a href="/safety" className="btn-primary mt-8 w-fit">
          Safety Center
        </a>
      </Split>

      <section id="faq" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:snap-start lg:px-16 lg:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <Kicker>FAQ</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">Straight answers.</h2>
          <div className="mt-8 divide-y divide-mist-200 border-y border-mist-200 dark:divide-white/10 dark:border-white/10">
            {shortFaqs.map((f) => (
              <details key={f.id} className="group py-4">
                <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
                  {f.question}
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-mist-500">{f.answer}</p>
              </details>
            ))}
          </div>
          <a href="/help" className="mt-6 inline-block text-sm underline underline-offset-4">
            More in Help Center
          </a>
        </Reveal>
      </section>

      <section className="relative lg:snap-start">
        <div className="relative lg:hidden">
          <CoverPhoto src={photos.extra} alt="Ready to join VIDLIX" fit="natural" sizes="100vw" />
          <div className="absolute inset-0 bg-ink-950/55" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
            <h2 className="font-heading text-3xl font-semibold text-white">Ready when you are.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Create an account with email. Confirm you are 18+. Start with Random or Live. Dating stays
              off until you turn it on.
            </p>
            <a href="/signup" className="btn-primary mt-6">
              Create account
            </a>
          </div>
        </div>
        <div className="relative hidden min-h-[28rem] lg:block lg:h-[calc(100svh-4rem)]">
          <CoverPhoto src={photos.extra} alt="Ready to join VIDLIX" fit="cover" sizes="100vw" />
          <div className="absolute inset-0 bg-ink-950/55" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-16">
            <h2 className="font-heading text-3xl font-semibold text-white xl:text-5xl">Ready when you are.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Create an account with email. Confirm you are 18+. Start with Random or Live. Dating stays
              off until you turn it on.
            </p>
            <a href="/signup" className="btn-primary mt-6">
              Create account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
