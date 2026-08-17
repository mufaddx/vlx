import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PrivacyForm } from "@/components/privacy-form";
import { DeleteAccountButton } from "@/components/delete-account-button";

export const metadata = { robots: { index: false } };

const items = [
  ["Account", "/profile/edit"],
  ["Privacy", "#privacy"],
  ["Security", "/settings"],
  ["Notifications", "/notifications"],
  ["Dating", "/dating"],
  ["Subscription", "/subscription"],
  ["Help", "/help"],
];

export default async function Page() {
  const user = await requireUser();
  const privacy = user.privacy;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Settings</h1>
      <ul className="mt-6 divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 dark:divide-white/10 dark:border-white/10">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="block px-5 py-4 hover:bg-mist-100 dark:hover:bg-white/5">
              {label}
            </Link>
          </li>
        ))}
        <li className="px-5 py-4">
          <DeleteAccountButton />
        </li>
      </ul>

      <h2 id="privacy" className="mt-10 font-heading text-2xl font-semibold">
        Privacy
      </h2>
      <PrivacyForm
        profileVisibility={privacy?.profileVisibility ?? "public"}
        whoCanFollow={privacy?.whoCanFollow ?? "everyone"}
        whoCanMessage={privacy?.whoCanMessage ?? "connections"}
        whoCanCall={privacy?.whoCanCall ?? "connections"}
        datingVisibility={privacy?.datingVisibility ?? "hidden"}
        showOnlineStatus={privacy?.showOnlineStatus ?? true}
      />

      <form action={logoutAction} className="mt-8">
        <button className="btn-secondary" type="submit">
          Logout
        </button>
      </form>
    </div>
  );
}
