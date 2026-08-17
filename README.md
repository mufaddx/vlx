# VIDLIX

Web-only privacy-focused platform: landing, auth, dashboard, random video, live, dating, chat, subscriptions, admin.

## Run

```bash
cd C:\Users\themu\vidlix
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

http://localhost:3000

| Account | How |
| --- | --- |
| User | `maya@vidlix.dev` or `arjun@vidlix.dev` + OTP `000000` |
| New user | Sign up (18+) |
| Admin | http://localhost:3000/admin/login · `admin@vidlix.dev` / `VidlixAdmin!2026` |

Logged-out `/` is always the landing page. Logged-in `/` goes to `/home`.

## Behaviour notes

- Random Video requests camera/mic only after Start. No recording — metadata only. Next does not reload the site.
- Live: join requests, host controls, 10 video cap from Admin settings. LiveKit wires in when `VIDEO_PROVIDER` credentials exist.
- Payments: mock provider **never** marks a paid success. Admin can Grant Pro. Free plan switch works.
- Sponsored Premium Connection is not a subscription transfer.
- Free message limit is Admin-configurable (`free_message_limit`).
