# VIDLIX Architecture — Phase 1

Web-only Next.js App Router application.

## Routing

| Path | Audience | Behavior |
| --- | --- | --- |
| `/` | Public | Landing. Logged-in visitors redirect to `/home`. |
| `/login` `/signup` | Public | OTP auth. Logged-in visitors redirect to `/home`. |
| `/setup` | Session | Finish 18+ profile + legal acceptance. |
| `/home` and app routes | Session | Dashboard. Unauthenticated visitors redirect to `/login`. |
| Legal slugs | Public | CMS-backed. |
| `/admin` | Reserved | Phase 9. |

## Stack

- Next.js 15 App Router + TypeScript + Tailwind
- Prisma + SQLite locally (swap `DATABASE_URL` to PostgreSQL in production)
- Jose-signed httpOnly session cookie + `sessions` table
- Mock `OtpProvider`, `PaymentProvider`, `VideoProvider`, `StorageProvider`, `PayoutProvider`, `NotificationProvider`
- No API keys in source. `.env` only.

## Auth

1. Identifier (email or E.164-ish mobile)
2. OTP (rate limited; mock provider logs the code; `OTP_DEV_CODE` in development)
3. Signup: first/last, username, DOB (18+), gender, terms/privacy/guidelines, dating opt-in
4. Session cookie → dashboard

Camera/mic are not requested during signup.

## Data

Full relational schema lives in `prisma/schema.prisma` including video session metadata (no media), live, dating, subscriptions, gifts, KYC, admin RBAC, CMS, settings.

`free_message_limit` and `max_live_participants` are system settings, not constants.

## Later phases

2 Profile/Search/Follow/Connections (this phase) · 3 Chat · 4 Random+Redis · 5 Dating · 6 Subscriptions · 7 LiveKit · 8 Gifts · 9 Admin · 10 Hardening
