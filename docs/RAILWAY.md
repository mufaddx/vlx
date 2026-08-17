# VIDLIX on Railway

Railway pe **website + MySQL**. Video **LiveKit Cloud** pe hi rehti hai — Railway par SFU mat chalao.

## Layout

```
Railway project
 ├─ MySQL plugin     → DATABASE_URL
 └─ VIDLIX (GitHub)  → Next.js
LiveKit Cloud        → wss://vidlix-….livekit.cloud
```

## Steps

1. [railway.app](https://railway.app) → New Project → **GitHub repo** (VIDLIX).
2. Same project mein **Add plugin → MySQL**.
3. VIDLIX service → **Variables**:

`DATABASE_URL` = MySQL service se reference (Variables → Add → variable from MySQL `DATABASE_URL` / `MYSQL_URL`).

Agar alag vars hon to:

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Aur yeh set karo:

```
AUTH_SECRET=<32+ random characters>
NEXT_PUBLIC_APP_URL=https://<your-railway-domain>
NEXT_PUBLIC_SHOW_DEV_OTP=false
VIDEO_PROVIDER=livekit
LIVEKIT_URL=wss://vidlix-dpn3hqk4.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://vidlix-dpn3hqk4.livekit.cloud
LIVEKIT_API_KEY=<from LiveKit>
LIVEKIT_API_SECRET=<from LiveKit>
OTP_PROVIDER=mock
PAYMENT_PROVIDER=mock
STORAGE_PROVIDER=local
```

4. Deploy. Pehli baar `prisma db push` tables bana dega.
5. Seed (ek baar): Railway → VIDLIX service → **one-off command**:

```
npx tsx prisma/seed.ts
```

(`tsx` + `prisma` install ke liye seed local se bhi chal sakta hai, `DATABASE_URL` Railway MySQL public URL se.)

6. Settings → Generate domain. Woh URL `NEXT_PUBLIC_APP_URL` mein daalo, redeploy.

## LiveKit

Random / Live media Railway ke through nahi jaati. Sirf tokens VIDLIX server banata hai.

## Cost

Hobby start ke liye theek. Usage badhe to Railway + LiveKit dono bill alag.

Password / API secret GitHub ya chat mein mat daalna.
