import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements } from "@/lib/social";
import { inviteSponsoredAction, respondSponsoredAction, startCheckoutAction } from "@/lib/actions/billing";

export const metadata = { title: "Subscription", robots: { index: false } };

export default async function Page() {
  const me = await requireUser();
  const ent = await getEntitlements(me.id);
  const plans = await prisma.subscriptionPlan.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" } });
  const usedSlots = await prisma.sponsoredConnection.count({
    where: { sponsorId: me.id, status: { in: ["pending", "active"] } },
  });
  const incoming = await prisma.sponsoredConnection.findMany({
    where: { recipientId: me.id, status: "pending" },
    include: { sponsor: true },
  });
  const mine = await prisma.sponsoredConnection.findMany({
    where: { sponsorId: me.id },
    include: { recipient: true },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Subscription</h1>
      <p className="mt-2 text-sm text-mist-500">
        Current plan: <strong>{ent.planName}</strong>
        {ent.sponsored ? " · plus sponsored premium connection" : ""}. Slots {usedSlots}/{ent.maxSponsoredUsers}.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {plans.map((p) => (
          <form key={p.id} action={startCheckoutAction.bind(null, p.id)} className={`rounded-3xl border p-5 ${p.highlight ? "border-violet bg-ink-900 text-white" : "border-mist-200 dark:border-white/10"}`}>
            <p className="text-sm uppercase tracking-widest opacity-70">{p.name}</p>
            <p className="mt-2 font-heading text-3xl">{p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}`}</p>
            <ul className="mt-3 space-y-1 text-sm opacity-80">
              <li>{p.maxSponsoredUsers} sponsored slots</li>
              <li>{p.chatAccess ? "Chat" : "Limited chat"}</li>
              <li>{p.videoCallAccess ? "Private video" : "No private video"}</li>
              <li>{p.usernameVisibility ? "Usernames visible" : "Usernames locked"}</li>
              <li>Free message cap {p.freeMessageLimit}</li>
            </ul>
            <button className="btn-primary mt-4 w-full" type="submit">
              {p.priceCents === 0 ? "Use Free" : "Checkout"}
            </button>
          </form>
        ))}
      </div>
      <p className="mt-4 text-xs text-mist-400">Paid checkout requires a PaymentProvider. Mock checkout never marks a payment as paid.</p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Sponsored Premium Connection</h2>
      <p className="mt-2 text-sm text-mist-500">You keep your subscription. This is not a transfer.</p>
      <form action={inviteSponsoredAction} className="mt-4 flex max-w-md gap-2">
        <input name="username" className="input" placeholder="VIDLIX username" />
        <button className="btn-primary" type="submit">Send invite</button>
      </form>
      <ul className="mt-4 space-y-2 text-sm">
        {mine.map((s) => (
          <li key={s.id}>You → @{s.recipient.username} · {s.status}</li>
        ))}
      </ul>
      {incoming.length ? (
        <div className="mt-6">
          <p className="font-semibold">Invites for you</p>
          {incoming.map((s) => (
            <form key={s.id} className="mt-2 flex items-center gap-2" action={respondSponsoredAction.bind(null, s.id, true)}>
              <span>@{s.sponsor.username} offered sponsored access</span>
              <button className="btn-primary" type="submit">Accept</button>
              <button className="btn-secondary" formAction={respondSponsoredAction.bind(null, s.id, false)} type="submit">Decline</button>
            </form>
          ))}
        </div>
      ) : null}
    </div>
  );
}
