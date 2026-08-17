import { prisma } from "@/lib/db";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function Page() {
  const [
    users,
    active,
    randomCalls,
    lives,
    dating,
    subs,
    reports,
    kyc,
    withdrawals,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.videoSession.count(),
    prisma.liveStream.count({ where: { status: "live" } }),
    prisma.datingProfile.count({ where: { active: true } }),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.report.count({ where: { status: "open" } }),
    prisma.kycProfile.count({ where: { status: "pending" } }),
    prisma.withdrawalRequest.count({ where: { status: "pending" } }),
  ]);
  const liveViewers = await prisma.liveStream.aggregate({ _sum: { viewerCount: true }, where: { status: "live" } });
  const revenue = await prisma.payment.aggregate({ _sum: { amountCents: true }, where: { status: "paid" } });

  const cards = [
    ["Total users", users],
    ["Active users", active],
    ["Random calls", randomCalls],
    ["Live streams", lives],
    ["Live viewers", liveViewers._sum.viewerCount ?? 0],
    ["Dating profiles", dating],
    ["Subscriptions", subs],
    ["Revenue (paid)", `$${((revenue._sum.amountCents ?? 0) / 100).toFixed(2)}`],
    ["Open reports", reports],
    ["KYC pending", kyc],
    ["Withdrawals", withdrawals],
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-mist-500">Live database totals. Paid revenue stays $0 until a real PaymentProvider settles.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([k, v]) => (
          <div key={String(k)} className="rounded-2xl border border-mist-200 p-4 dark:border-white/10">
            <p className="text-xs uppercase tracking-widest text-mist-400">{k}</p>
            <p className="mt-2 font-heading text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
