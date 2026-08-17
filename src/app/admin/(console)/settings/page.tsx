import { prisma } from "@/lib/db";
import { adminSaveSettingAction } from "@/lib/actions/admin";

export default async function Page() {
  const settings = await prisma.systemSetting.findMany();
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">System settings</h1>
      <ul className="mt-6 space-y-3">
        {settings.map((s) => (
          <li key={s.key}>
            <form action={async (fd) => { "use server"; await adminSaveSettingAction(s.key, String(fd.get("value") ?? "")); }} className="flex max-w-xl items-center gap-2">
              <span className="w-48 text-sm">{s.key}</span>
              <input name="value" className="input" defaultValue={s.value} />
              <button className="btn-secondary" type="submit">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
