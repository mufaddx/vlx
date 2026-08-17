"use client";

import { deleteAccountAction } from "@/lib/actions/profile";

export function DeleteAccountButton() {
  return (
    <form
      action={deleteAccountAction}
      onSubmit={(e) => {
        if (!confirm("Delete your VIDLIX account permanently?")) e.preventDefault();
      }}
    >
      <button className="text-rose-600" type="submit">
        Delete Account
      </button>
    </form>
  );
}
