import { requireUser } from "@/lib/auth";
import { searchUsers } from "@/lib/social";
import { PersonCard } from "@/components/person-card";

export const metadata = { title: "Search", robots: { index: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const { q = "" } = await searchParams;
  const results = q.trim().length >= 2 ? await searchUsers(user.id, q) : [];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Search</h1>
      <p className="mt-2 text-sm text-mist-500">Find people by VIDLIX username. Blocks and private profiles are respected.</p>
      <form className="mt-6 flex gap-2" action="/search">
        <label className="sr-only" htmlFor="q">
          Username
        </label>
        <input
          id="q"
          name="q"
          className="input"
          defaultValue={q}
          placeholder="Search @username"
          minLength={2}
        />
        <button className="btn-primary" type="submit">
          Search
        </button>
      </form>
      <div className="mt-8 space-y-3">
        {q.trim().length >= 2 && results.length === 0 ? (
          <p className="text-sm text-mist-500">No people match that username.</p>
        ) : null}
        {results.map((r) => (
          <PersonCard
            key={r.id}
            href={`/u/${r.username ?? r.id}`}
            name={r.name}
            username={r.username}
            locked={r.locked}
            photoUrl={r.photoUrl}
            bio={r.bio}
            privacyStatus={r.privacyStatus}
            followStatus={r.followStatus}
            targetId={r.id}
          />
        ))}
      </div>
    </div>
  );
}
