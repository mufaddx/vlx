import { getAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminShell name={admin.name}>{children}</AdminShell>;
}
