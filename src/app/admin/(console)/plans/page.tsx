import { prisma } from "@/lib/db";
import { adminSavePlanAction } from "@/lib/actions/admin";
import { asFormAction } from "@/lib/form-action";

export default async function Page() {
  const plans = await prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Plans</h1>
      <p className="mt-2 text-sm text-mist-500">Nothing important is hard-coded. Edit entitlements here.</p>
      <div className="mt-6 grid gap-6">
        {plans.map((p) => (
          <form key={p.id} action={asFormAction(adminSavePlanAction)} className="grid gap-2 rounded-2xl border border-mist-200 p-4 dark:border-white/10 md:grid-cols-4">
            <input type="hidden" name="id" value={p.id} />
            <input name="name" className="input" defaultValue={p.name} />
            <input name="slug" className="input" defaultValue={p.slug} />
            <input name="priceCents" className="input" defaultValue={p.priceCents} />
            <input name="durationDays" className="input" defaultValue={p.durationDays} />
            <input name="maxSponsoredUsers" className="input" defaultValue={p.maxSponsoredUsers} />
            <input name="freeMessageLimit" className="input" defaultValue={p.freeMessageLimit} />
            <input name="trialDays" className="input" defaultValue={p.trialDays} />
            <input name="discountPercent" className="input" defaultValue={p.discountPercent} />
            <label className="text-sm"><input type="checkbox" name="chatAccess" defaultChecked={p.chatAccess} /> Chat</label>
            <label className="text-sm"><input type="checkbox" name="videoCallAccess" defaultChecked={p.videoCallAccess} /> Video</label>
            <label className="text-sm"><input type="checkbox" name="randomVideoAccess" defaultChecked={p.randomVideoAccess} /> Random</label>
            <label className="text-sm"><input type="checkbox" name="datingAccess" defaultChecked={p.datingAccess} /> Dating</label>
            <label className="text-sm"><input type="checkbox" name="liveAccess" defaultChecked={p.liveAccess} /> Live</label>
            <label className="text-sm"><input type="checkbox" name="usernameVisibility" defaultChecked={p.usernameVisibility} /> Usernames</label>
            <label className="text-sm"><input type="checkbox" name="highlight" defaultChecked={p.highlight} /> Highlight</label>
            <select name="status" className="input" defaultValue={p.status}>
              <option value="active">active</option>
              <option value="hidden">hidden</option>
            </select>
            <button className="btn-primary" type="submit">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
