# MEL.md

This is a hackathon project: a half-built copy of Trello, Asana and Monday.com (project boards) that we are turning into a real SaaS product the whole group can use.

## The stack

- Next.js (App Router) + TypeScript + React. Plain CSS in `app/globals.css`, no Tailwind.
- Data: `lib/db.ts` reads and writes `data/db.json`. `data/seed.json` is the starting data (people, boards with columns, cards, comments). This is temporary.
- Routes: `app/api/people`, `boards`, `boards/[id]`, `boards/[id]/columns`, `columns/[id]`, `cards`, `cards/[id]`, `cards/[id]/move`, `cards/[id]/comments`, `my-tasks`, plus the planned 501s: `invite`, `reminders`, `export`, `checkout`.
- Pages: Boards (`app/page.tsx`), board (`app/boards/[id]`), card (`app/cards/[id]`), `my-tasks`, `team`, `pricing`.
- Due-date helpers are in `lib/dates.ts`. `components/Avatar.tsx` draws a teammate.
- "Who am I" is a dropdown (`components/PretendPicker.tsx`, `lib/useMe.ts`). There are no real accounts yet.
- Payments: `app/api/checkout/route.ts` is a stub. Stripe is not connected.
- Runs on port 3110.

## The job

Work through `ZOMBIE.md` in order: make it work, make it secure, make it compliant, connect Stripe, ship it.
Every planted problem in the code is marked with a `ZOMBIE:` comment.
This app holds a company's work, so the data belongs to the customer: private boards must be private, and export and delete must work.

## Rules for agents

- Keep it running. Run `npm run build` after each change and fix what breaks.
- Never commit secrets. Keys go in `.env.local` (it is git-ignored).
- Use Stripe test mode keys only.
- Keep all sample data fake. Never add real people's data.
- When you fix a `ZOMBIE:` item, delete its comment and tick its box in `ZOMBIE.md`.
- Small commits with plain messages.
