import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveDatingProfileAction, datingSwipeAction } from "@/lib/actions/dating";
import { isBlockedEitherWay } from "@/lib/social";
import { ageFromDob } from "@/lib/crypto";
import { asFormAction } from "@/lib/form-action";

export const metadata = { title: "Dating", robots: { index: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const me = await requireUser();
  const { tab = "discover" } = await searchParams;
  const myDating = await prisma.datingProfile.findUnique({
    where: { userId: me.id },
    include: { photos: { orderBy: { sortOrder: "asc" } }, preferences: true },
  });

  if (!myDating?.active) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold">Dating is optional</h1>
        <p className="mt-2 max-w-xl text-mist-500">
          A normal account is not added to Dating automatically. Create a profile when you want.
        </p>
        <form action={asFormAction(saveDatingProfileAction)} className="mt-8 max-w-lg space-y-3">
          <input name="bio" className="input" placeholder="Bio" />
          <input name="intention" className="input" placeholder="Dating intention" />
          <input name="locationLabel" className="input" placeholder="Location" />
          <input name="interests" className="input" placeholder="Interests, comma separated" />
          <select name="interestedIn" className="input" defaultValue="everyone">
            <option value="everyone">Everyone</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input name="minAge" type="number" min={18} defaultValue={18} className="input" />
            <input name="maxAge" type="number" min={18} defaultValue={40} className="input" />
          </div>
          <label className="block text-sm">
            Photos (max 6, first is main)
            <input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-1 text-sm" />
          </label>
          <button className="btn-primary" type="submit">
            Create Dating Profile
          </button>
        </form>
      </div>
    );
  }

  const swiped = await prisma.datingSwipe.findMany({ where: { fromUserId: me.id } });
  const swipedIds = new Set(swiped.map((s) => s.toUserId));
  const candidates = await prisma.datingProfile.findMany({
    where: { active: true, NOT: { userId: me.id } },
    include: { user: true, photos: true, preferences: true },
    take: 30,
  });
  const discover = [];
  for (const p of candidates) {
    if (swipedIds.has(p.userId)) continue;
    if (await isBlockedEitherWay(me.id, p.userId)) continue;
    const age = ageFromDob(p.user.dateOfBirth);
    const pref = myDating.preferences;
    if (pref && (age < pref.minAge || age > pref.maxAge)) continue;
    discover.push({ p, age });
  }
  const card = discover[0];

  const likes = await prisma.datingSwipe.findMany({
    where: { toUserId: me.id, action: "like" },
  });
  const likeUsers = await prisma.user.findMany({
    where: { id: { in: likes.map((l) => l.fromUserId) } },
    include: { datingProfile: { include: { photos: true } } },
  });
  const matches = await prisma.datingMatch.findMany({
    where: { OR: [{ userAId: me.id }, { userBId: me.id }] },
  });
  const matchUsers = await prisma.user.findMany({
    where: {
      id: { in: matches.map((m) => (m.userAId === me.id ? m.userBId : m.userAId)) },
    },
    include: { datingProfile: { include: { photos: true } } },
  });

  const tabs = [
    ["discover", "Discover"],
    ["likes", "Likes"],
    ["matches", "Matches"],
    ["profile", "My Dating Profile"],
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Dating</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <Link
            key={id}
            href={`/dating?tab=${id}`}
            className={`rounded-full px-4 py-2 text-sm ${tab === id ? "bg-ink-900 text-white dark:bg-teal dark:text-ink-950" : "bg-mist-100 dark:bg-ink-800"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {tab === "discover" ? (
        <div className="mx-auto mt-8 max-w-md">
          {!card ? (
            <p className="text-sm text-mist-500">No more people right now.</p>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-mist-200 dark:border-white/10">
              <div
                className="h-80 bg-gradient-to-br from-violet/50 to-teal/30 bg-cover bg-center"
                style={{ backgroundImage: card.p.photos[0] ? `url(${card.p.photos[0].url})` : undefined }}
              />
              <div className="p-5">
                <p className="font-heading text-2xl font-semibold">
                  {card.p.user.firstName}, {card.age}
                </p>
                <p className="text-sm text-mist-500">{card.p.locationLabel}</p>
                <p className="mt-3 text-sm">{card.p.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(JSON.parse(card.p.preferences?.interestsJson || "[]") as string[]).map((t) => (
                    <span key={t} className="rounded-full bg-mist-100 px-3 py-1 text-xs dark:bg-ink-700">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <form action={asFormAction(datingSwipeAction.bind(null, card.p.userId, "pass"))}>
                    <button className="btn-secondary w-full" type="submit">Pass</button>
                  </form>
                  <form action={asFormAction(datingSwipeAction.bind(null, card.p.userId, "like"))}>
                    <button className="btn-primary w-full" type="submit">Like</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {tab === "likes" ? (
        <ul className="mt-6 space-y-2">
          {likeUsers.map((u) => (
            <li key={u.id} className="rounded-2xl border border-mist-200 px-4 py-3 dark:border-white/10">
              {u.firstName} liked you
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "matches" ? (
        <ul className="mt-6 space-y-2">
          {matchUsers.map((u) => (
            <li key={u.id}>
              <Link href={`/messages`} className="block rounded-2xl border border-mist-200 px-4 py-3 dark:border-white/10">
                Match with {u.firstName} · Chat
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "profile" ? (
        <form action={asFormAction(saveDatingProfileAction)} className="mt-6 max-w-lg space-y-3">
          <textarea name="bio" className="input min-h-24 py-3" defaultValue={myDating.bio} />
          <input name="intention" className="input" defaultValue={myDating.intention} />
          <input name="locationLabel" className="input" defaultValue={myDating.locationLabel} />
          <input
            name="interests"
            className="input"
            defaultValue={(JSON.parse(myDating.preferences?.interestsJson || "[]") as string[]).join(", ")}
          />
          <button className="btn-primary" type="submit">Save dating profile</button>
        </form>
      ) : null}
    </div>
  );
}
