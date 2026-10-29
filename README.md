# Zombie Tasks

> A half-built copy of **Trello / Asana / Monday.com**. It runs, it kind of works, and it is not ready for real users.
> Your job tonight: bring it back to life.

**Replaces:** Trello, Asana and Monday.com paid plans (Trello from $5/month per user, billed yearly)

**Live demo:** https://zombie-tasks.vercel.app (a shared demo: data resets whenever the server restarts)
<!-- Price verified 2026-10-29 at https://trello.com/pricing : Standard is $5 per user per month billed annually ($6 billed monthly). Premium is $10 annual ($12.50 monthly). Asana and Monday.com were not checked, so no number is claimed for them. -->

## Run it (2 minutes)

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3110.

## What works

- A "Pretend to be" dropdown in the top bar picks who you are (there are no real accounts).
- Boards page: 3 boards (one is private) and a form to make a new one.
- Board page: columns (To do, Doing, Done, plus custom ones like Blocked or Review) with cards in them. Add a card, add a column, delete a column.
- Move a card with buttons: left and right change the column, up and down change the order. There is no drag and drop.
- Card page: title, description, assignee, due date, labels, a checklist with a progress bar, and comments.
- My tasks: every card assigned to the person you are pretending to be, with its due date.
- Team page: 5 fake teammates.
- Pricing page (Stripe is not connected).
- Seed data: 3 boards, 18 cards and 5 teammates in `data/seed.json`. Everyone is made up.

Try it: pretend to be Dana Whitfield, open My tasks, and look at the order of the due dates. Then open "Build pricing page" on the Website relaunch board and tick a checklist item.

## What's broken

See [ZOMBIE.md](ZOMBIE.md). That's the to-do list for the night. Start with the card order, the due dates and the private board that is not private.

## How we build tonight

- **Mel** ([openmel.dev](https://openmel.dev)) does the building. Open this folder in Mel and give it tasks from ZOMBIE.md.
- **Prompt Anything** ([promptanything.io](https://www.promptanything.io)) writes the prompts. Use it inside Mel for features, agents, customer success flows, code fixes and reading this repo.
- **MEL.md** in this folder tells Mel's agents what this project is and how to work on it.

## Submit

Fork this repo, push your work, and send your link through the submission form before the deadline.
Many people can pick the same app. The one that actually works wins.

## License

MIT. Use it, ship it, share it.
