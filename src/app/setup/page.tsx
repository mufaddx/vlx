import { getSessionUser, isProfileComplete } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SetupForm } from "@/components/setup-form";
import { Logo } from "@/components/logo";

export const metadata = { title: "Account setup", robots: { index: false } };

export default async function SetupPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (isProfileComplete(user)) redirect("/home");
  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <Logo />
      <h1 className="mt-8 font-heading text-3xl font-semibold">Finish your account</h1>
      <p className="mt-2 text-sm text-mist-500">18+ eligibility is enforced from your date of birth.</p>
      <SetupForm
        defaults={{ firstName: user.firstName, lastName: user.lastName, username: user.username }}
      />
    </main>
  );
}
