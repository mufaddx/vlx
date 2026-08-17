import type { FaqItem } from "@prisma/client";
import { CoverPhoto } from "@/components/cover-photo";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/marketing-photos";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl lg:px-6">{children}</div>;
}

function Card({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div
        className={`mx-3 overflow-hidden rounded-2xl border border-mist-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-ink-950 lg:mx-0 lg:p-10 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-mist-200 p-4 dark:border-white/10 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

function Mark() {
  return (
    <span
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal to-violet"
      aria-hidden
    >
      <span className="h-3 w-3 rounded-full bg-ink-950" />
      <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white" />
    </span>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-deep dark:text-teal">
      {children}
    </p>
  );
}

export function LandingPage({ faqs }: { faqs: FaqItem[] }) {
  const shortFaqs = faqs.slice(0, 6);

  return (
    <div id="home" className="space-y-3 pb-28 pt-0 lg:space-y-8 lg:pb-24 lg:pt-8">
      <Shell>
        <Card className="pt-4 lg:pt-10">
          <div className="grid lg:grid-cols-2 lg:items-center lg:gap-12">
            <Reveal>
              <div className="flex items-center gap-3">
                <Mark />
                <Kicker>Privacy-first video</Kicker>
              </div>
              <h1 className="mt-4 whitespace-nowrap font-heading text-[clamp(1.05rem,5.2vw,1.75rem)] font-semibold leading-none tracking-tight sm:text-3xl lg:text-5xl">
                Meet. Connect. Discover.
              </h1>
              <div className="-mx-4 mt-3 lg:hidden">
                  <CoverPhoto src={photos.heroMobile} alt="VIDLIX on a phone" priority />
              </div>
              <div className="mt-5 hidden h-px w-16 bg-ink-900/15 dark:bg-white/15 lg:block" />
              <Box className="mt-4">
                <p className="text-[15px] leading-relaxed text-mist-600 dark:text-mist-300 sm:text-base">
                  Anonymous random video, live rooms, optional dating, and private chat — on the web.
                  Sign in with email OTP. No password. You must be 18+.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-mist-500">
                  Random matches never see your username, email, or phone. VIDLIX does not record those
                  calls. Dating stays off until you turn it on.
                </p>
              </Box>
              <div className="mt-7 hidden flex-wrap gap-3 lg:flex">
                <a href="/signup" className="btn-primary">
                  Get started
                </a>
                <a href="/#how" className="btn-secondary">
                  How it works
                </a>
              </div>
            </Reveal>
                <div className="relative hidden overflow-hidden rounded-xl bg-mist-100 dark:bg-ink-900 lg:block">
                  <CoverPhoto src={photos.heroDesktop} alt="VIDLIX video conversation" priority />
                </div>
          </div>
        </Card>
      </Shell>

      <Shell>
        <Card id="random">
          <Reveal>
            <Kicker>Random Video</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Meet someone new. Stay anonymous.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                Random Video is a live 50/50 camera match with a stranger. It is built so a conversation
                can happen without turning into a profile hunt. During the call the other person does not
                see your username, email, or phone.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  t: "No identity on the call",
                  d: "You appear as a face and a voice, not as an account. If you want to stay known later, you send a follow request after you hang up.",
                },
                {
                  t: "You stay in control",
                  d: "Mute, hide camera, skip to the next person, open a short in-call chat, report, or block. Skipping is how you keep the room comfortable.",
                },
                {
                  t: "No recording",
                  d: "VIDLIX does not store random-call video or audio. Recording or restreaming someone else’s random call is against the rules.",
                },
                {
                  t: "Not a dating queue",
                  d: "Matching is random. It is not Dating unless you later opt into Dating. Treat every call as a first meeting.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="live">
          <Reveal>
            <Kicker>Live</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Watch. Join. Go live.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                Live is a room with a host, not a random 1:1. You can sit as a viewer, read chat, and
                request to come on camera. Hosts decide who is on video. Rooms stay small on purpose.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Viewers first",
                  d: "Open a room, watch the host, and use chat. You are not automatically put on camera.",
                },
                {
                  t: "Up to 10 on video",
                  d: "The cap keeps rooms watchable. The host can mute, remove someone from video, or end the room.",
                },
                {
                  t: "Host control",
                  d: "Create a room, share it, accept or decline join requests. You are responsible for who appears on camera.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="dating">
          <Reveal>
            <Kicker>Dating · optional</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Only if you want it.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                Dating on VIDLIX is a separate layer. Creating an account does not put you in the dating
                pool. You choose photos, a bio, and whether you are looking — and you can turn it off.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "18+ by date of birth",
                  d: "Age is checked from the date of birth you give at signup. There is no face scan. If Dating is not for you, leave it off.",
                },
                {
                  t: "Like or Pass, then match",
                  d: "Browse profiles: photos, bio, Like or Pass. A match is two-sided. Dating is not a back door into someone’s random-call identity.",
                },
                {
                  t: "Match to conversation",
                  d: "When you both like, you can move to chat. Plans may change limits. Those entitlements live in Admin.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="features">
          <Reveal>
            <Kicker>Requests & connections</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Follow after the call — on your terms.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                A good random call should not force a public friendship. A follow request is how you ask
                to stay in touch. The other person accepts, ignores, or blocks. Nothing is automatic.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Send a request",
                  d: "After Random Video you can send a follow request. They see a limited view of who you are until they accept.",
                },
                {
                  t: "If they accept",
                  d: "Username visibility, chat, and — depending on plan — private video can open. Free and paid plans define those gates in Admin.",
                },
                {
                  t: "If they decline",
                  d: "The anonymous call stays anonymous. You can still block or report. A follow is not a permanent contract.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="chat">
          <Reveal>
            <Kicker>Chat</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Keep talking after you hang up.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                Chat is for people who already chose each other — a match, an accepted follow, or a
                conversation you both want to continue. It is not a broadcast wall and not a way to hunt
                strangers who skipped you.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Both people must want the thread",
                  d: "If someone does not accept a connection, they should not be reachable in chat just because you shared a random call.",
                },
                {
                  t: "What you can send",
                  d: "Text first. Plans can add richer chat, more free messages, or starting a private video from the thread. Limits exist so spam does not take over inboxes.",
                },
                {
                  t: "Safety in the inbox",
                  d: "Report a conversation, block the other person, and leave. Treat links and money requests with the same caution you would anywhere on the web.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="how">
          <Reveal>
            <Kicker>How it works</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Four clear steps.</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  n: "01",
                  t: "Email OTP and an 18+ profile",
                  d: "Enter your email, receive a one-time code, then set a name, username, date of birth, and agree to Terms, Privacy, and Guidelines. Camera is not requested during signup.",
                },
                {
                  n: "02",
                  t: "Choose Random, Live, or Dating",
                  d: "Jump into an anonymous 50/50 call, watch or host a live room, or opt into Dating. Nothing except the account itself is required to try Random Video.",
                },
                {
                  n: "03",
                  t: "Match, watch, or send a request",
                  d: "Skip until the call feels right, request to join a live host, or Like a dating profile. Follow requests after Random stay limited until the other person accepts.",
                },
                {
                  n: "04",
                  t: "Chat when you both want",
                  d: "Private chat and further video are for people who already chose each other. Block, report, or leave at any time. Plans can expand limits; they do not remove safety tools.",
                },
              ].map((s) => (
                <li key={s.n}>
                  <Box>
                    <p className="text-xs tracking-[0.18em] text-mist-400">{s.n}</p>
                    <p className="mt-2 font-heading text-lg font-semibold">{s.t}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{s.d}</p>
                  </Box>
                </li>
              ))}
            </ol>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="safety">
          <Reveal>
            <Kicker>Safety</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Block. Report. Leave.
            </h2>
            <Box className="mt-4">
              <p className="max-w-3xl text-[15px] leading-relaxed text-mist-600 dark:text-mist-300">
                Every live surface — Random, Live, Dating, Chat — is built so you can end the interaction
                immediately and tell us what went wrong.
              </p>
            </Box>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "In the moment",
                  d: "Leave the call, skip, mute, hide your camera, or end the live room. You do not owe anyone extra time.",
                },
                {
                  t: "After the moment",
                  d: "Block so they cannot reach you the same way. Report with context. We may warn, suspend, or ban accounts that break the rules.",
                },
                {
                  t: "What we will not do",
                  d: "We will not promise every stranger is kind. We will not record random calls as a product feature. We will not put you in Dating without opt-in.",
                },
              ].map((x) => (
                <Box key={x.t}>
                  <h3 className="font-heading text-base font-semibold">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist-500">{x.d}</p>
                </Box>
              ))}
            </div>
            <a href="/safety" className="btn-primary mt-6">
              Safety Center
            </a>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card id="faq">
          <Reveal>
            <Kicker>FAQ</Kicker>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Straight answers.</h2>
            <div className="mt-4 grid gap-4">
              {shortFaqs.map((f) => (
                <Box key={f.id}>
                  <details>
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mist-500">{f.answer}</p>
                  </details>
                </Box>
              ))}
            </div>
            <a href="/help" className="mt-6 inline-block text-sm underline underline-offset-4">
              More in Help Center
            </a>
          </Reveal>
        </Card>
      </Shell>

      <Shell>
        <Card>
          <Reveal>
            <div className="flex items-center gap-3">
              <Mark />
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Ready when you are.</h2>
            </div>
            <Box className="mt-4">
              <p className="max-w-xl text-[15px] leading-relaxed text-mist-500">
                Create an account with email, confirm you are 18+, and start with Random Video or a live
                room. Dating stays off until you turn it on.
              </p>
            </Box>
            <a href="/signup" className="btn-primary mt-6">
              Create account
            </a>
          </Reveal>
        </Card>
      </Shell>

      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-7xl gap-2 rounded-full border border-mist-200 bg-white/95 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-ink-950/95">
          <a href="/login" className="btn-secondary flex-1 text-center">
            Sign in
          </a>
          <a href="/signup" className="btn-primary flex-1 text-center">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
