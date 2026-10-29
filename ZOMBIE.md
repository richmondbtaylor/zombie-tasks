# 🧟 ZOMBIE.md: what's broken

This app is a zombie on purpose. Pick items off this list. Every box you tick gets it closer to a product we can all use and stop paying for Trello, Asana and Monday.com.

Search the code for `ZOMBIE:` to find every planted problem.

## 1. Make it work

- [ ] Drag and drop is not built (`app/boards/[id]/page.tsx`). Cards move with arrow buttons only. Add drag and drop, and keep the buttons for people who use a keyboard.
- [ ] Card order breaks after a move. A moved card gets position 0, and a new card gets "number of cards" as its position, so two cards end up with the same position (`app/api/cards/[id]/move/route.ts`, `app/api/cards/route.ts`). Then up and down do nothing. Renumber the column 0, 1, 2... after every change.
- [ ] "My tasks" sorts due dates as text (`app/api/my-tasks/route.ts`). `11/5/2026` lands before `2026-10-30`. Parse real dates, sort them, and keep cards with no date last. Also make the seed and the API use one date format.
- [ ] Due dates show one day early, and a card due today shows "overdue" all day (`lib/dates.ts`). Dates are read as midnight UTC. Parse them as local dates and decide when "overdue" starts.
- [ ] Due-date reminder emails say "Not built yet" (`app/api/reminders/route.ts`). Build the daily job and the email.
- [ ] "Invite teammate" returns 501 (`app/api/invite/route.ts`). Build invites that join a person to the workspace.
- [ ] The checklist shows "NaN%" when it has no items (`app/cards/[id]/page.tsx`). Show nothing instead.
- [ ] The search box on a board does nothing (`app/boards/[id]/page.tsx`). Build card search.
- [ ] Card edits are not checked (`app/api/cards/[id]/route.ts`). A due date can be "soon", a title can be blank, and an assignee can be a person who does not exist. Validate on the server.
- [ ] Deleting a column deletes every card in it, with no warning and no undo (`app/api/columns/[id]/route.ts`). Ask first, offer to move the cards, and let people undo.
- [ ] There is no activity log. Nobody can see who moved, edited or deleted a card (`app/api/cards/[id]/route.ts`). Add one.
- [ ] Card ids are made from the clock, so two cards made in the same millisecond share an id (`lib/db.ts`). Use random ids.

## 2. Make it secure

- [ ] There is no login. The "Pretend to be" dropdown lets anyone act as anyone (`components/PretendPicker.tsx`, `lib/useMe.ts`). Add accounts (Supabase Auth, Clerk, Auth.js...).
- [ ] Anyone can see every board. "Hiring plan" is marked private, but `GET /api/boards`, `GET /api/boards/[id]` and `GET /api/cards/[id]` return it to anyone (`app/api/boards/route.ts`). The page only hides it in the browser. Add a workspace, board members and an owner check on every route.
- [ ] `GET /api/my-tasks?me=p1` returns anyone's tasks if you change `me` (`app/api/my-tasks/route.ts`). Use the signed-in user, not a query string.
- [ ] Comments trust the author in the request body (`app/api/cards/[id]/comments/route.ts`). Anyone can comment as anyone. Also the text has no length limit and may hold any HTML. React shows it as plain text today, so it is safe. It becomes an XSS hole as soon as someone adds markdown or `dangerouslySetInnerHTML`. Clean it on the way in.
- [ ] Anyone can create a board "owned by" someone else, and anyone can delete any board, card or column (`app/api/boards/route.ts`, `app/api/boards/[id]/route.ts`, `app/api/cards/[id]/route.ts`). Check who is asking.
- [ ] Every API route trusts whatever it's sent. Validate input on the server (lengths, dates, ids).
- [ ] Data lives in `data/db.json` on disk. Move it to a real database.

## 3. Make it compliant

A project board holds your customer's work. Plan for these rules:

- [ ] **The data belongs to the customer company.** The company that pays is the owner of its boards, cards and comments. You only store and process them for it. Say so in your terms, and never use their data for anything else.
- [ ] **Export:** a customer must be able to take all its data out (JSON or CSV). The Export button says "Not built yet" (`app/api/export/route.ts`).
- [ ] **Delete on request (GDPR and CCPA/CPRA):** when a person or a company asks, you must delete their personal data (names, emails, comments) in a set time. Build a delete flow, and tell people how long backups keep a copy. Note that "delete a column" today is not this: it has no log and no undo.
- [ ] **Data processing agreement (DPA):** business customers, especially in the EU and UK, will ask you to sign a DPA. It says you are the processor, what you do with their data, which sub-processors you use (hosting, email, Stripe) and how you report a breach. Have one ready.
- [ ] **SOC 2 questions:** buyers will send a security questionnaire and ask if you have SOC 2 (an outside check that you protect data). Plan for real logins, roles, an activity log, backups, and a written security policy. The missing activity log and the open boards are the first things they will find.
- [ ] **CAN-SPAM (US email law):** due-date reminders and invites are email. Use a real sender and address, true subject lines, and an easy way to opt out of non-essential mail. Check the current rule before you send.
- [ ] **Privacy notice:** there is no privacy policy or terms page. Names, work emails and comments are personal data.
- [ ] **Private means private:** if you promise private boards, a leak (see section 2) can be a breach you must report. Check the breach-notice rules for the places your customers are.
- [ ] **Retention:** decide how long deleted cards and old comments are kept, and write it down.

## 4. Connect Stripe

- [ ] `app/api/checkout/route.ts` returns a 501. Create a Stripe Checkout Session (test mode is fine). Plans are per person, so use a per-seat price and a quantity.
- [ ] Add a webhook route that marks the workspace as paid.
- [ ] Lock the paid features behind the plan (private boards, reminders, export, activity log).

## 5. Ship it

- [ ] Deploy it (Vercel, Netlify, Railway...). The JSON file database will not survive this, so do section 2 first.
- [ ] Put the live link in your README.

## What "done" looks like

Someone who has never seen it can sign up, pay, use the main feature end to end, and come back tomorrow to find their data still there.
