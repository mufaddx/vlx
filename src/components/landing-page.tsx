import Link from "next/link";
import { Camera, MicOff, SkipForward, UserPlus, MessageCircle, Flag } from "lucide-react";
import type { FaqItem, SubscriptionPlan } from "@prisma/client";
import { CoverPhoto } from "@/components/cover-photo";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/marketing-photos";

function PhotoFrame({
  children,
  hero,
  className = "",
}: {
  children: React.ReactNode;
  hero?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-mist-100 dark:bg-ink-900 ${
        hero
          ? "h-[calc(100svh-4rem)] min-h-[28rem] lg:h-auto lg:min-h-[36rem] lg:aspect-[4/5] lg:max-h-[42rem] lg:rounded-2xl"
          : "aspect-[9/16] lg:aspect-[4/5] lg:max-h-[42rem] lg:rounded-2xl"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function PhotoPair({
  id,
  kicker,
  title,
  lead,
  points,
  photo,
  alt,
  visual,
  photoLeft,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  lead: string;
  points: { heading: string; body: string }[];
  photo?: string;
  alt?: string;
  visual?: React.ReactNode;
  photoLeft?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-6 lg:py-16">
        <div className={`${photoLeft ? "lg:order-1" : "lg:order-2"}`}>
          <PhotoFrame>
            {visual ?? (
              <CoverPhoto src={photo!} alt={alt!} fit="contain" sizes="(max-width: 1024px) 100vw, 50vw" />
            )}
          </PhotoFrame>
        </div>
        <Reveal className={`px-6 py-8 lg:px-0 lg:py-0 ${photoLeft ? "lg:order-2" : "lg:order-1"}`} delayMs={80}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">
            {kicker}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-mist-600 dark:text-mist-300 sm:text-lg">{lead}</p>
          <div className="mt-6 space-y-5">
            {points.map((p) => (
              <div key={p.heading}>
                <h3 className="font-heading text-base font-semibold">{p.heading}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">{p.body}</p>
              </div>
            ))}
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}

function RandomStage() {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink-950">
      <div className="relative min-h-0 flex-1">
        <CoverPhoto src={photos.randomPeer} alt="Other person on a random call" fit="contain" sizes="(max-width: 1024px) 100vw, 40vw" />
        <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">Them</p>
      </div>
      <div className="relative min-h-0 flex-1 border-t border-white/10">
        <CoverPhoto src={photos.randomSelf} alt="You on a random call" fit="contain" sizes="(max-width: 1024px) 100vw, 40vw" />
        <p className="absolute left-3 top-3 text-[11px] uppercase tracking-widest text-white/80">You</p>
      </div>
      <div className="flex h-14 shrink-0 justify-center gap-2 bg-black/55 px-3 py-2">
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
      <section>
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-6 lg:pt-10">
          <div className="relative lg:order-2">
            <PhotoFrame hero>
              <div className="absolute inset-0 lg:hidden">
                <CoverPhoto src={photos.heroMobile} alt="VIDLIX on a phone" fit="contain" sizes="100vw" priority />
              </div>
              <div className="absolute inset-0 hidden lg:block">
                <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" fit="contain" sizes="50vw" priority />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 via-ink-950/25 to-transparent p-4 lg:hidden">
                <div className="flex gap-3">
                  <Link href="/signup" className="btn-primary flex-1 text-center">
                    Sign up
                  </Link>
                  <Link href="/login" className="btn-secondary flex-1 text-center">
                    Sign in
                  </Link>
                </div>
              </div>
            </PhotoFrame>
          </div>

          <Reveal className="px-6 py-10 lg:order-1 lg:px-0 lg:py-4" delayMs={60}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">
              Privacy-first video
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Meet. Connect. Discover.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-mist-600 dark:text-mist-300 sm:text-lg">
              VIDLIX is a web-only place to meet people on camera without turning every conversation into a public
              profile. Start with anonymous random video, sit in a live room, turn on optional dating if you want it,
              and keep talking in private chat when both of you agree.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
              There is no native app to install. Sign in with email OTP — no password and no mobile OTP. You must be
              18+. Random matches never see your username, email, or phone. Calls are not recorded by VIDLIX.
            </p>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
              <li>
                <span className="font-medium text-ink-900 dark:text-white">Random Video</span> — 50/50 camera, skip
                anyone, report or block, stay unnamed.
              </li>
              <li>
                <span className="font-medium text-ink-900 dark:text-white">Live</span> — watch a host, chat as a
                viewer, request to join. Up to 10 people on video.
              </li>
              <li>
                <span className="font-medium text-ink-900 dark:text-white">Dating</span> — optional. A normal account
                is never auto-added to the dating pool.
              </li>
              <li>
                <span className="font-medium text-ink-900 dark:text-white">Chat</span> — continue after a call only
                when both people want the thread.
              </li>
            </ul>
            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
              <Link href="/signup" className="btn-primary">
                Get started
              </Link>
              <a href="/#how" className="btn-secondary">
                How it works
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PhotoPair
        id="random"
        kicker="Random Video"
        title="Meet someone new. Stay anonymous."
        lead="Random Video is a live 50/50 camera match with a stranger. It is built so a conversation can happen without turning into a profile hunt. The other person does not see your username, email, or phone during the call."
        points={[
          {
            heading: "No identity on the call",
            body: "You appear as a face and a voice, not as an account. That is the point. If you want to stay known later, you send a follow request after the call — they still only see limited identity until they accept.",
          },
          {
            heading: "You stay in control",
            body: "Mute, hide camera, skip to the next person, open a short in-call chat, or leave. Report and block are always available. Skipping is not a punishment; it is how you keep the room comfortable.",
          },
          {
            heading: "VIDLIX does not record the call",
            body: "We do not store random-call video or audio. Operational metadata such as session timing can exist for safety and product operations. Recording or restreaming someone else’s random call is against the rules.",
          },
          {
            heading: "Who you might meet",
            body: "Matching is random. It is not a dating queue unless you later opt into Dating. Treat every call as a first meeting: be 18+, be decent, and leave if it is not a fit.",
          },
        ]}
        visual={<RandomStage />}
      />

      <PhotoPair
        id="live"
        kicker="Live"
        title="Watch. Join. Go live."
        lead="Live is a room with a host, not a random 1:1. You can sit as a viewer, read chat, and request to come on camera. Hosts decide who is on video. The room stays small on purpose."
        points={[
          {
            heading: "Viewers first",
            body: "Open a live room, watch the host, and use room chat. You are not automatically put on camera. Request to join when you want to speak; the host accepts or declines.",
          },
          {
            heading: "Up to 10 people on video",
            body: "VIDLIX caps live video participants so rooms stay watchable. The host can mute, remove someone from video, or end the room. That control is the product, not an afterthought.",
          },
          {
            heading: "Going live yourself",
            body: "Create a room, share it, and host. You stay responsible for who appears on camera and for the tone of the room. If a guest breaks guidelines, remove them and report.",
          },
        ]}
        photo={photos.liveHost}
        alt="VIDLIX Live host and room"
        photoLeft
      />

      <PhotoPair
        id="dating"
        kicker="Dating · optional"
        title="Only if you want it."
        lead="Dating on VIDLIX is a separate, opt-in layer. Creating an account does not put you in the dating pool. You choose photos, a bio, and whether you are looking — and you can turn it off."
        points={[
          {
            heading: "18+ only, date of birth — not a face scan",
            body: "Age is checked from the date of birth you give at signup. Dating is for adults. If Dating is not for you, leave it off and keep using Random, Live, and Chat.",
          },
          {
            heading: "Like or Pass, then match",
            body: "Browse profiles the way dating products work: photos, bio, Like or Pass. A match is two-sided. Until then, Dating is not a back door into someone’s random-call identity.",
          },
          {
            heading: "From match to conversation",
            body: "When you both like, you can move to chat. Plans may change how many people you can reach or which dating tools are open — those entitlements live in Admin, not as hidden tricks in the app.",
          },
        ]}
        photo={photos.dating}
        alt="Optional VIDLIX dating profile"
      />

      <PhotoPair
        id="features"
        kicker="Connections"
        title="Follow after the call — on your terms."
        lead="A good random call should not force a public friendship. Connections let you request to stay in touch with limited identity. The other person accepts, ignores, or blocks. Nothing is automatic."
        points={[
          {
            heading: "Request, don’t assume",
            body: "After Random Video you can send a follow request. They see a limited view of who you are until they accept. If they decline, the anonymous call stays anonymous.",
          },
          {
            heading: "What unlocks after accept",
            body: "An accepted connection can open username visibility, chat, and — depending on plan — private video. Free and paid plans define those gates in Admin so the product can change without rewriting the whole app.",
          },
          {
            heading: "You can still walk away",
            body: "Block and report work after a connection too. A follow is not a permanent contract. Hide, restrict, or delete from Settings if you want a quieter account.",
          },
        ]}
        photo={photos.live1}
        alt="People connecting on VIDLIX"
        photoLeft
      />

      <PhotoPair
        id="chat"
        kicker="Chat"
        title="Keep talking after you hang up."
        lead="Chat is for people who already chose each other — a match, an accepted follow, or a conversation you both want to continue. It is not a broadcast wall and it is not a way to hunt strangers who skipped you."
        points={[
          {
            heading: "Both people have to want the thread",
            body: "Messages belong to a private thread. If someone does not accept a connection, they should not be reachable in chat just because you shared a random call. That is how Random stays random.",
          },
          {
            heading: "What you can send",
            body: "Text first. Plans can add richer chat, more free messages, or the ability to start a private video from the thread. Limits exist so spam does not take over inboxes.",
          },
          {
            heading: "Safety inside the inbox",
            body: "Report a conversation, block the other person, and leave. We do not use chat as a public feed. Treat links and money requests with the same caution you would anywhere else on the web.",
          },
        ]}
        photo={photos.chat}
        alt="Private VIDLIX chat"
      />

      <PhotoPair
        id="pricing"
        kicker="Plans"
        title="Pick a plan that matches how you use VIDLIX."
        lead="Free is enough to try the product. Paid plans can open more chat, private video, dating tools, live features, or sponsored connections. Prices and perks are not frozen in marketing copy — Super Admin can change them."
        points={[
          {
            heading: "What you are paying for",
            body: "Access and limits: who you can message, whether usernames show, private video, dating extras, live tools. You are not buying someone else’s attention as a guaranteed outcome.",
          },
          {
            heading: "Sponsored connections",
            body: "Some plans can activate premium connection access for another person without giving away your whole subscription. That is a connection entitlement, not a gift of every perk you have.",
          },
          {
            heading: "Checkout",
            body: "Real charges only happen when a payment provider is connected. Until then, checkout is not live money. Refunds and subscription rules are on the legal pages in the footer.",
          },
        ]}
        photo={photos.pricing}
        alt="VIDLIX plan comparison"
        photoLeft
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border border-mist-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-ink-950/40 ${p.highlight ? "ring-1 ring-violet" : ""}`}
            >
              <p className="text-sm text-mist-500">{p.name}</p>
              <p className="mt-1 font-heading text-xl font-semibold">
                {p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}
              </p>
            </div>
          ))}
        </div>
      </PhotoPair>

      <section id="how" className="scroll-mt-16 mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Four clear steps.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
            VIDLIX is not a download. You open the site, prove you are 18+, and choose how you want to meet people.
            Each step is optional after the first: you can live only in Random, only in Live, or turn Dating on later.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Email OTP and an 18+ profile",
                d: "Enter your email, receive a one-time code, then set a first name, username, date of birth, and agree to Terms, Privacy, and Guidelines. Camera is not requested during signup.",
              },
              {
                n: "02",
                t: "Choose Random, Live, or Dating",
                d: "Jump into an anonymous 50/50 call, watch or host a live room, or opt into Dating. Nothing except the account itself is required to try Random Video.",
              },
              {
                n: "03",
                t: "Match, watch, or follow",
                d: "Skip until the call feels right, request to join a live host, or Like a dating profile. Follow requests after Random stay limited until the other person accepts.",
              },
              {
                n: "04",
                t: "Chat when you both want",
                d: "Private chat and further video are for people who already chose each other. Block, report, or leave at any time. Plans can expand limits; they do not remove safety tools.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-mist-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-ink-950/40">
                <p className="text-xs tracking-[0.18em] text-mist-400">{s.n}</p>
                <p className="mt-2 font-heading text-lg font-semibold">{s.t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">{s.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <PhotoPair
        id="safety"
        kicker="Safety"
        title="Block. Report. Leave."
        lead="Safety is not a footer link we added last. Every live surface — Random, Live, Dating, Chat — is built so you can end the interaction immediately and tell us what went wrong."
        points={[
          {
            heading: "In the moment",
            body: "Leave the call, skip, mute, hide your camera, or end the live room. You do not owe anyone extra time. If someone asks for money, personal documents, or to move the conversation somewhere you do not trust, leave.",
          },
          {
            heading: "After the moment",
            body: "Block so they cannot reach you the same way again. Report with context so moderators can review. We may warn, suspend, or ban accounts that break Terms or Community Guidelines.",
          },
          {
            heading: "What we will not do",
            body: "We will not promise that every stranger is kind. We will not record random calls “for safety” as a product feature. We will not put you in Dating without a clear opt-in.",
          },
        ]}
        photo={photos.safety}
        alt="Safety tools on VIDLIX"
      >
        <Link href="/safety" className="btn-primary w-fit">
          Safety Center
        </Link>
      </PhotoPair>

      <section id="faq" className="scroll-mt-16 mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">FAQ</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Straight answers.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist-500 dark:text-mist-400">
            Short versions of the questions people ask before they create an account. Longer policy language lives in
            Terms, Privacy, and Help.
          </p>
          <div className="mt-8 divide-y divide-mist-200 border-y border-mist-200 dark:divide-white/10 dark:border-white/10">
            {shortFaqs.map((f) => (
              <details key={f.id} className="group py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-mist-400 transition-transform duration-200 group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mist-500">{f.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/help" className="mt-6 inline-block text-sm underline underline-offset-4">
            More in Help Center
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-mist-100 dark:bg-ink-900">
            <div className="relative aspect-[9/16] lg:aspect-[21/9] lg:min-h-[220px]">
              <CoverPhoto src={photos.extra} alt="Ready to join VIDLIX" fit="contain" sizes="100vw" />
              <div className="absolute inset-0 bg-ink-950/55" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white sm:justify-center sm:p-10">
                <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Ready when you are.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                  Create an account with email, confirm you are 18+, and start with Random Video or a live room. Dating
                  stays off until you turn it on.
                </p>
                <Link href="/signup" className="btn-primary mt-6">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
