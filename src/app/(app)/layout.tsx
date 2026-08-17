import { getSessionUser, isProfileComplete } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!isProfileComplete(user)) redirect("/setup");
  return <AppShell firstName={user.firstName}>{children}</AppShell>;
}
