"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { providers } from "@/lib/providers";
import { connectionPair } from "@/lib/ids";
import { isBlockedEitherWay } from "@/lib/social";
import { notify } from "@/lib/notify";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveDatingProfileAction(formData: FormData) {
  const me = await requireUser();
  const bio = z.string().trim().max(500).parse(String(formData.get("bio") ?? ""));
  const intention = z.string().trim().max(80).parse(String(formData.get("intention") ?? ""));
  const locationLabel = z.string().trim().max(80).parse(String(formData.get("locationLabel") ?? ""));
  const interestedIn = z.enum(["everyone", "women", "men"]).parse(String(formData.get("interestedIn") ?? "everyone"));
  const interests = z.string().trim().max(300).parse(String(formData.get("interests") ?? ""));
  const minAge = Number(formData.get("minAge") ?? 18);
  const maxAge = Number(formData.get("maxAge") ?? 99);

  const profile = await prisma.datingProfile.upsert({
    where: { userId: me.id },
    create: { userId: me.id, bio, intention, locationLabel, active: true },
    update: { bio, intention, locationLabel, active: true },
  });
  await prisma.datingPreference.upsert({
    where: { datingProfileId: profile.id },
    create: {
      datingProfileId: profile.id,
      interestedIn,
      minAge: Math.max(18, minAge),
      maxAge: Math.min(99, maxAge),
      interestsJson: JSON.stringify(interests.split(",").map((s) => s.trim()).filter(Boolean)),
    },
    update: {
      interestedIn,
      minAge: Math.max(18, minAge),
      maxAge: Math.min(99, maxAge),
      interestsJson: JSON.stringify(interests.split(",").map((s) => s.trim()).filter(Boolean)),
    },
  });
  await prisma.user.update({ where: { id: me.id }, data: { datingOptIn: "yes" } });

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const existing = await prisma.datingPhoto.count({ where: { datingProfileId: profile.id } });
  if (existing + files.length > 6) return { error: "Maximum 6 photos." };
  for (const [i, file] of files.entries()) {
    if (!ALLOWED.has(file.type)) return { error: "Photos must be JPG, PNG, or WebP." };
    if (file.size > 5 * 1024 * 1024) return { error: "Each photo must be 5MB or smaller." };
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const stored = await providers.storage.put({
      key: `dating/${me.id}/${nanoid()}.${ext}`,
      bytes: Buffer.from(await file.arrayBuffer()),
      mime: file.type,
    });
    await prisma.datingPhoto.create({
      data: {
        datingProfileId: profile.id,
        objectKey: stored.key,
        url: stored.url,
        mime: file.type,
        bytes: file.size,
        sortOrder: existing + i,
        isMain: existing + i === 0,
      },
    });
  }
  revalidatePath("/dating");
  return { ok: true as const };
}

export async function datingSwipeAction(targetId: string, action: "like" | "pass") {
  const me = await requireUser();
  if (me.id === targetId) return { error: "Invalid." };
  if (await isBlockedEitherWay(me.id, targetId)) return { error: "Unavailable." };
  await prisma.datingSwipe.upsert({
    where: { fromUserId_toUserId: { fromUserId: me.id, toUserId: targetId } },
    update: { action },
    create: { fromUserId: me.id, toUserId: targetId, action },
  });
  if (action === "like") {
    const back = await prisma.datingSwipe.findUnique({
      where: { fromUserId_toUserId: { fromUserId: targetId, toUserId: me.id } },
    });
    if (back?.action === "like") {
      const pair = connectionPair(me.id, targetId);
      await prisma.datingMatch.upsert({
        where: { userAId_userBId: pair },
        update: {},
        create: pair,
      });
      await prisma.connection.upsert({
        where: { userAId_userBId: pair },
        update: {},
        create: pair,
      });
      await notify(me.id, "dating_match", "It's a match", "You both liked each other.", "/dating?tab=matches");
      await notify(targetId, "dating_match", "It's a match", "You both liked each other.", "/dating?tab=matches");
    }
  }
  revalidatePath("/dating");
  return { ok: true as const };
}
