# Hostinger + MySQL + LiveKit

VIDLIX Next.js app Hostinger **Business / Cloud Web Apps** (Node.js) par chalti hai. Sasta PHP-only shared hosting kaafi nahi.

## MySQL

1. hPanel → Databases → MySQL database banao (`vidlix`).
2. User + password banao, database attach karo.
3. Env:

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/vidlix"
```

Hostinger app ke andar host aksar `localhost` hota hai. Password mein `@ #` ho to URL-encode karo.

4. Deploy ke baad:

```
npx prisma db push
npx tsx prisma/seed.ts
```

## Random video API: LiveKit Cloud

Hostinger par WebRTC SFU **mat** chalao. Media LiveKit ke servers par jayegi.

1. [https://cloud.livekit.io](https://cloud.livekit.io) account
2. Project → API Key + Secret + WebSocket URL (`wss://....livekit.cloud`)
3. Hostinger env:

```
VIDEO_PROVIDER=livekit
LIVEKIT_URL=wss://xxxx.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://xxxx.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
```

Match VIDLIX MySQL queue se hota hai. Call LiveKit room mein connect hoti hai. Recording off rakho (product rule).

**Agora** India mein backup option hai; VIDLIX spec LiveKit/SFU ke liye likhi gayi hai, isliye LiveKit default hai.
