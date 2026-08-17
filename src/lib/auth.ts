import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { generateSessionToken, hashValue } from "./crypto";

const COOKIE = "vidlix_session";
const DAYS = 30;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set and at least 16 characters");
  }
  return new TextEncoder().encode(s);
}

export async function createUserSession(userId: string, meta?: { userAgent?: string; ip?: string }) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashValue(token),
      expiresAt,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ip,
    },
  });
  const jwt = await new SignJWT({ uid: userId, sid: hashValue(token) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DAYS}d`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const uid = String(payload.uid ?? "");
    const sid = String(payload.sid ?? "");
    if (!uid || !sid) return null;
    const session = await prisma.session.findUnique({
      where: { tokenHash: sid },
      include: {
        user: { include: { profile: true, preferences: true, privacy: true } },
      },
    });
    if (!session || session.expiresAt < new Date() || session.user.status !== "active") {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret());
      const sid = String(payload.sid ?? "");
      if (sid) await prisma.session.deleteMany({ where: { tokenHash: sid } });
    } catch {
      /* ignore */
    }
  }
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export function isProfileComplete(user: {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: Date;
  termsAcceptedAt: Date | null;
  privacyAcceptedAt: Date | null;
  guidelinesAcceptedAt: Date | null;
}) {
  return Boolean(
    user.firstName &&
      user.lastName &&
      user.username &&
      user.dateOfBirth &&
      user.termsAcceptedAt &&
      user.privacyAcceptedAt &&
      user.guidelinesAcceptedAt,
  );
}
