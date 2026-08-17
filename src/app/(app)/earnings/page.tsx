import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSetting } from "@/lib/utils";
import { requestWithdrawalAction, submitKycAction } from "@/lib/actions/gifts";

export const metadata = { title: "Earnings", robots: { index: false } };

export default async function Page() {
  const me = await requireUser();
  const enabled = await getSetting("monetization_enabled", "false");
  const earning = await prisma.creatorEarning.findUnique({ where: { userId: me.id } });
  const kyc = await prisma.kycProfile.findUnique({ where: { userId: me.id } });
  const gifts = await prisma.gift.findMany({ where: { active: true } });

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Earnings</h1>
      {enabled !== "true" ? (
        <p className="mt-3 text-sm text-mist-500">Monetization is off until Admin enables it in System Settings.</p>
      ) : null}
      <p className="mt-4 text-sm">Coins: {me.coinBalance} · Creator balance: {earning?.balanceCents ?? 0} cents</p>
      <p className="mt-2 text-sm">KYC: {kyc?.status ?? "not started"}</p>
      <form action={async (fd) => { "use server"; await submitKycAction(String(fd.get("notes") ?? "")); }} className="mt-6 max-w-md space-y-2">
        <textarea name="notes" className="input min-h-20 py-3" placeholder="KYC notes / payout identity" />
        <button className="btn-primary" type="submit">Submit KYC</button>
      </form>
      <form action={async () => { "use server"; await requestWithdrawalAction(100); }} className="mt-4">
        <button className="btn-secondary" type="submit">Request $1 withdrawal (demo)</button>
      </form>
      <ul className="mt-8 text-sm text-mist-500">
        {gifts.map((g) => (
          <li key={g.id}>{g.name} · {g.coinValue} coins</li>
        ))}
      </ul>
    </div>
  );
}
