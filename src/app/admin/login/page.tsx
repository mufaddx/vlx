import { adminLoginAction } from "@/lib/actions/admin";

export const metadata = { title: "Admin login", robots: { index: false } };

export default function Page() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form action={adminLoginAction} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-3xl font-semibold">VIDLIX Admin</h1>
        <input name="email" type="email" className="input" placeholder="Admin email" required />
        <input name="password" type="password" className="input" placeholder="Password" required />
        <button className="btn-primary w-full" type="submit">Log in</button>
      </form>
    </main>
  );
}
