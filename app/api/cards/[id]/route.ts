import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// A card with its comments, its board and the people.
// ZOMBIE: SECURITY. Anyone can open any card by id, even on a private board.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const card = db.cards.find((c) => c.id === id);
  if (!card) return NextResponse.json({ error: "No such card." }, { status: 404 });
  const board = db.boards.find((b) => b.id === card.boardId);
  const comments = db.comments.filter((c) => c.cardId === id);
  return NextResponse.json({ card, board, comments, people: db.people });
}

// ZOMBIE: BUG. No validation. The due date can be any text ("soon", "13/45/2026"), the title can be
// blank, the assignee can be a person who does not exist, and labels and the description have no
// length limit. Also nothing records who changed what: there is no activity log.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = await readDb();
  const card = db.cards.find((c) => c.id === id);
  if (!card) return NextResponse.json({ error: "No such card." }, { status: 404 });
  for (const key of ["title", "description", "assigneeId", "due", "labels", "checklist"] as const) {
    if (key in body) (card as Record<string, unknown>)[key] = body[key];
  }
  await writeDb(db);
  return NextResponse.json(card);
}

// ZOMBIE: deleting a card also deletes its comments. No "are you sure?", no undo, no log, no owner check.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  db.cards = db.cards.filter((c) => c.id !== id);
  db.comments = db.comments.filter((c) => c.cardId !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
