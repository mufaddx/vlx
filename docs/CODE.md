# VIDLIX codebase

Web-only Next.js app. Hostinger + MySQL + LiveKit Cloud.

## App routes

Public: `/` landing, `/login` `/signup`, legal slugs, `/admin/login`

User (session): `/home` `/random` `/live` `/dating` `/search` `/messages` `/call/[id]` `/connections` `/notifications` `/subscription` `/profile` `/settings` `/earnings`

Admin: `/admin/*`

## Env

See `.env.example`. LiveKit keys are in local `.env` (gitignored).

## After clone

MySQL database, then:

```
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
