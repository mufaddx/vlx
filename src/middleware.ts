import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const APP_PREFIXES = [
  "/home",
  "/random",
  "/live",
  "/dating",
  "/search",
  "/messages",
  "/connections",
  "/notifications",
  "/subscription",
  "/profile",
  "/settings",
  "/setup",
  "/u",
  "/earnings",
  "/call",
];

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

async function hasSession(request: NextRequest) {
  const token = request.cookies.get("vidlix_session")?.value;
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await hasSession(request);
  const isApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (pathname === "/" && authed) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isApp && !authed) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && authed) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const isAdminLogin = pathname === "/admin/login";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const adminCookie = request.cookies.get("vidlix_admin")?.value;

  if (isAdmin && !isAdminLogin && !adminCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isAdminLogin && adminCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const res = NextResponse.next();
  if (isApp) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/home/:path*",
    "/random/:path*",
    "/live/:path*",
    "/dating/:path*",
    "/search/:path*",
    "/messages/:path*",
    "/connections/:path*",
    "/notifications/:path*",
    "/subscription/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/setup/:path*",
    "/u/:path*",
    "/earnings/:path*",
    "/call/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
