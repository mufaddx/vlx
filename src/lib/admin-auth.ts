import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { hashValue, generateSessionToken } from "./crypto";

const COOKIE = "vidlix_admin";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET missing");
  return new TextEncoder().encode(`admin:${s}`);
}

export async function createAdminSession(adminId: string) {
  const jwt = await new SignJWT({ aid: adminId, nonce: generateSessionToken() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret());
  (await cookies()).set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const admin = await prisma.adminUser.findUnique({
      where: { id: String(payload.aid) },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
    if (!admin?.active) return null;
    return admin;
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  (await cookies()).set(COOKIE, "", { path: "/", maxAge: 0 });
}

export function adminHas(admin: NonNullable<Awaited<ReturnType<typeof getAdmin>>>, key: string) {
  return admin.role.permissions.some((p) => p.permission.key === key || p.permission.key === "*");
}

export async function audit(actorId: string, action: string, targetType?: string, targetId?: string, metadata?: object) {
  await prisma.auditLog.create({
    data: {
      actorType: "admin",
      actorId,
      action,
      targetType,
      targetId,
      metadata: JSON.stringify(metadata ?? {}),
    },
  });
}

export { hashValue };
