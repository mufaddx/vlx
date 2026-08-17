import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";

export const metadata = { title: "Edit profile", robots: { index: false } };

export default async function Page() {
  const user = await requireUser();
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Edit profile</h1>
      <p className="mt-2 text-sm text-mist-500">Photo, name, username, and bio. Camera is not required here.</p>
      <ProfileForm
        firstName={user.firstName}
        lastName={user.lastName}
        username={user.username}
        bio={user.profile?.bio ?? ""}
      />
    </div>
  );
}
