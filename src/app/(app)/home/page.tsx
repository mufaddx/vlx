import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Video, Radio, Heart, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { PersonCard } from "@/components/person-card";
import { getFollowStatus } from "@/lib/social";

export const metadata = { robots: { index: false, follow: false } };

export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const cards = [
    { href: "/random", title: "Start Random Video", icon: Video, copy: "Meet someone new. Identity stays hidden." },
    { href: "/live?go=1", title: "Go Live", icon: Sparkles, copy: "Host up to 10 video participants." },
    { href: "/live", title: "Explore Live", icon: Radio, copy: "Watch, chat, request to join." },
    { href: "/dating", title: "Explore Dating", icon: Heart, copy: "Optional. Only if you opted in." },
  ];

  const suggested = await prisma.user.findMany({
    where: {
      status: "active",
      NOT: { id: user.id },
      privacy: { profileVisibility: "public" },
    },
    take: 4,
    include: { profile: true, privacy: true },
    orderBy: { createdAt: "desc" },
  });
  const suggestedCards = (
    await Promise.all(
      suggested.map(async (u) => ({
        user: u,
        followStatus: await getFollowStatus(user.id, u.id),
      })),
    )
  ).filter((row) => row.followStatus !== "blocked");

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Welcome back, {user.firstName}</h1>
      <p className="mt-2 text-mist-500">Your VIDLIX home. Start from here — nothing reloads the marketing site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="glass cursor-pointer rounded-3xl p-6 transition-colors duration-200 hover:border-violet/40"
          >
            <c.icon className="h-5 w-5 text-violet-deep dark:text-teal" />
            <p className="mt-4 font-heading text-xl font-semibold">{c.title}</p>
            <p className="mt-1 text-sm text-mist-500">{c.copy}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-mist-200 p-5 dark:border-white/10">
          <h2 className="font-heading text-lg font-semibold">Suggested Connections</h2>
          <div className="mt-4 space-y-3">
            {suggestedCards.length === 0 ? (
              <p className="text-sm text-mist-500">No suggestions yet. Search a username to connect.</p>
            ) : (
              suggestedCards.map(({ user: u, followStatus }) => (
                <PersonCard
                  key={u.id}
                  href={`/u/${u.username}`}
                  name={`${u.firstName} ${u.lastName}`}
                  username={u.username}
                  photoUrl={u.profile?.photoUrl ?? null}
                  privacyStatus={u.privacy?.profileVisibility}
                  followStatus={followStatus}
                  targetId={u.id}
                />
              ))
            )}
          </div>
        </section>
        {[
          ["Active Live Streams", "Lives you can join will appear here."],
          ["Recent Messages", "Realtime chat arrives in Phase 3."],
          ["Dating Suggestions", "Visible only after a Dating Profile."],
        ].map(([t, d]) => (
          <section key={t} className="rounded-3xl border border-mist-200 p-5 dark:border-white/10">
            <h2 className="font-heading text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-sm text-mist-500">{d}</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm text-mist-400">Subscription status: Free plan until Admin payments are connected.</p>
    </div>
  );
}
