"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { providers } from "@/lib/providers";
import { clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX = 5 * 1024 * 1024;

export async function updateProfileAction(formData: FormData) {
  const me = await requireUser();
  const parsed = z
    .object({
      firstName: z.string().trim().min(1).max(40),
      lastName: z.string().trim().min(1).max(40),
      username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3)
        .max(24)
        .regex(/^[a-z0-9_]+$/),
      bio: z.string().trim().max(280),
    })
    .safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: formData.get("username"),
      bio: formData.get("bio") ?? "",
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your profile details." };

  const taken = await prisma.user.findFirst({
    where: { username: parsed.data.username, NOT: { id: me.id } },
  });
  if (taken) return { error: "That username is taken." };

  const photo = formData.get("photo");
  let photoPatch: { photoKey: string; photoUrl: string; photoMime: string; photoBytes: number } | undefined;
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED.has(photo.type)) return { error: "Use a JPG, PNG, or WebP photo." };
    if (photo.size > MAX) return { error: "Photo must be 5MB or smaller." };
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const key = `avatars/${me.id}/${nanoid()}.${ext}`;
    const stored = await providers.storage.put({
      key,
      bytes: Buffer.from(await photo.arrayBuffer()),
      mime: photo.type,
    });
    photoPatch = {
      photoKey: stored.key,
      photoUrl: stored.url,
      photoMime: photo.type,
      photoBytes: photo.size,
    };
    if (me.profile?.photoKey) await providers.storage.delete(me.profile.photoKey);
  }

  await prisma.user.update({
    where: { id: me.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      username: parsed.data.username,
      profile: {
        upsert: {
          create: { bio: parsed.data.bio, ...photoPatch },
          update: { bio: parsed.data.bio, ...photoPatch },
        },
      },
    },
  });
  revalidatePath("/profile");
  revalidatePath("/settings");
  return { ok: true as const };
}

export async function updatePrivacyAction(formData: FormData) {
  const me = await requireUser();
  const parsed = z
    .object({
      profileVisibility: z.enum(["public", "private"]),
      whoCanFollow: z.enum(["everyone", "connections", "nobody"]),
      whoCanMessage: z.enum(["everyone", "connections", "nobody"]),
      whoCanCall: z.enum(["everyone", "connections", "nobody"]),
      datingVisibility: z.enum(["visible", "hidden"]),
      showOnlineStatus: z.enum(["on", "off"]),
    })
    .safeParse({
      profileVisibility: formData.get("profileVisibility"),
      whoCanFollow: formData.get("whoCanFollow"),
      whoCanMessage: formData.get("whoCanMessage"),
      whoCanCall: formData.get("whoCanCall"),
      datingVisibility: formData.get("datingVisibility"),
      showOnlineStatus: formData.get("showOnlineStatus") === "on" ? "on" : "off",
    });
  if (!parsed.success) return { error: "Invalid privacy settings." };

  await prisma.userPrivacy.upsert({
    where: { userId: me.id },
    create: {
      userId: me.id,
      profileVisibility: parsed.data.profileVisibility,
      whoCanFollow: parsed.data.whoCanFollow,
      whoCanMessage: parsed.data.whoCanMessage,
      whoCanCall: parsed.data.whoCanCall,
      datingVisibility: parsed.data.datingVisibility,
      showOnlineStatus: parsed.data.showOnlineStatus === "on",
    },
    update: {
      profileVisibility: parsed.data.profileVisibility,
      whoCanFollow: parsed.data.whoCanFollow,
      whoCanMessage: parsed.data.whoCanMessage,
      whoCanCall: parsed.data.whoCanCall,
      datingVisibility: parsed.data.datingVisibility,
      showOnlineStatus: parsed.data.showOnlineStatus === "on",
    },
  });
  revalidatePath("/settings");
  revalidatePath("/profile");
  return { ok: true as const };
}

export async function deleteAccountAction() {
  const me = await requireUser();
  await prisma.user.delete({ where: { id: me.id } });
  await clearSession();
  redirect("/");
}
