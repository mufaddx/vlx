import type { FaqItem, SubscriptionPlan } from "@prisma/client";
import { CoverPhoto } from "@/components/cover-photo";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/marketing-photos";

function Mark({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-10 w-10";
  const inner = size === "lg" ? "h-5 w-5" : "h-3 w-3";
  const dot = size === "lg" ? "h-3 w-3" : "h-2 w-2";
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal to-violet ${box}`}
      aria-hidden
    >
      <span className={`rounded-full bg-ink-950 ${inner}`} />
      <span className={`absolute right-0.5 top-0.5 rounded-full bg-white ${dot}`} />
    </span>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-deep dark:text-teal">
      {children}
    </p>
  );
}

function Block({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-mist-200/70 dark:border-white/10">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-24">
        <Reveal>
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        </Reveal>
        <Reveal delayMs={80} className="space-y-4 text-[15px] leading-relaxed text-mist-600 dark:text-mist-300 sm:text-base">
          {children}
        </Reveal>
      </div>
    </section>
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
      <section className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2">
        <div className="relative lg:order-2 lg:min-h-[calc(100svh-4rem)]">
          <div className="relative lg:hidden">
            <CoverPhoto src={photos.heroMobile} alt="VIDLIX video call" fit="natural" sizes="100vw" priority />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent p-4">
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
          <div className="relative hidden h-full min-h-[calc(100svh-4rem)] lg:block">
            <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" fit="cover" sizes="50vw" priority />
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:order-1 lg:px-16 lg:py-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <Mark />
              <Kicker>Privacy-first video</Kicker>
            </div>
            <h1 className="mt-6 font-heading text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Meet.
              <br />
              Connect.
              <br />
              Discover.
            </h1>
            <div className="mt-6 h-px w-24 bg-ink-900/20 dark:bg-white/20" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-mist-600 dark:text-mist-300">
              Anonymous random video, live rooms, optional dating, and private chat — on the web. Email
              OTP only. 18+.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist-500">
              Random matches never see your username, email, or phone. Calls are not recorded. Dating
              stays off until you turn it on.
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

      <Block id="random" kicker="Random Video" title="Meet someone new. Stay anonymous.">
        <p>
          A live 50/50 camera match. The other person does not see your username, email, or phone.
          Mute, skip, report, or block. Follow only if you both want to stay in touch after.
        </p>
        <p>VIDLIX does not store random-call video or audio. This is not Dating unless you opt in later.</p>
      </Block>

      <Block id="live" kicker="Live" title="Watch. Join. Go live.">
        <p>
          Sit as a viewer, use room chat, and request to come on camera. Hosts accept or decline. Up to
          10 people on video. Hosts can mute, remove, or end the room.
        </p>
      </Block>

      <Block id="dating" kicker="Dating · optional" title="Only if you want it.">
        <p>
          Creating an account does not put you in the dating pool. Age is date of birth, not a face
          scan. Like or Pass, match two-sided, then chat. Turn it off anytime.
        </p>
      </Block>

      <Block id="features" kicker="Connections" title="Follow after the call.">
        <p>
          Request with limited identity. They accept, ignore, or block. An accepted connection can open
          username, chat, and — depending on plan — private video. Block and report still work.
        </p>
      </Block>

      <Block id="chat" kicker="Chat" title="Keep talking after you hang up.">
        <p>
          Private threads are for people who already chose each other. Chat is not a wall and not a way
          to hunt someone who skipped you.
        </p>
      </Block>

      <section id="how" className="scroll-mt-24 border-t border-mist-200/70 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <Kicker>How it works</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Four steps.</h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Email OTP and an 18+ profile. Camera is not requested at signup.",
                "Choose Random, Live, or Dating. Dating stays off until you opt in.",
                "Skip, watch, Like, or send a follow. Nothing is automatic.",
                "Chat when you both want. Block, report, or leave at any time.",
              ].map((d, i) => (
                <li key={d}>
                  <p className="font-heading text-sm tracking-[0.2em] text-mist-400">0{i + 1}</p>
                  <p className="mt-3 text-[15px] leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-t border-mist-200/70 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <Kicker>Plans</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Pick how you use VIDLIX.</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mist-500">
              Free is enough to try. Paid plans can open more chat, private video, dating tools, or live
              features. Prices live in Admin.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {plans.map((p) => (
                <div key={p.id}>
                  <p className="text-sm text-mist-500">{p.name}</p>
                  <p className="mt-1 font-heading text-2xl font-semibold">
                    {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Block id="safety" kicker="Safety" title="Block. Report. Leave.">
        <p>
          End any interaction immediately. We do not record random calls as a product feature. We do
          not put you in Dating without a clear opt-in.
        </p>
        <p>
          <a href="/safety" className="font-medium underline underline-offset-4">
            Safety Center
          </a>
        </p>
      </Block>

      <section id="faq" className="scroll-mt-24 border-t border-mist-200/70 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <Kicker>FAQ</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Straight answers.</h2>
            <div className="mt-10 divide-y divide-mist-200 border-y border-mist-200 dark:divide-white/10 dark:border-white/10">
              {shortFaqs.map((f) => (
                <details key={f.id} className="py-4">
                  <summary className="cursor-pointer font-medium">{f.question}</summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist-500">{f.answer}</p>
                </details>
              ))}
            </div>
            <a href="/help" className="mt-6 inline-block text-sm underline underline-offset-4">
              More in Help Center
            </a>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-mist-200/70 px-6 py-20 dark:border-white/10 sm:px-8">
        <Reveal className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <Mark size="lg" />
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">Ready when you are.</h2>
          </div>
          <div className="mt-6 h-px w-24 bg-ink-900/20 dark:bg-white/20" />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist-500">
            Create an account with email. Confirm you are 18+. Start with Random or Live. Dating stays
            off until you turn it on.
          </p>
          <a href="/signup" className="btn-primary mt-8">
            Create account
          </a>
        </Reveal>
      </section>
    </div>
  );
}
