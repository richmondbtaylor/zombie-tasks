import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// A board with its columns and cards.
// ZOMBIE: SECURITY. Works for a private board too. There is no "who is asking" check.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const board = db.boards.find((b) => b.id === id);
  if (!board) return NextResponse.json({ error: "No such board." }, { status: 404 });
  const cards = db.cards.filter((c) => c.boardId === id);
  return NextResponse.json({ board, cards, people: db.people });
}

// ZOMBIE: deleting a board deletes all its cards and comments. No "are you sure?", no undo, no owner check.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const ids = db.cards.filter((c) => c.boardId === id).map((c) => c.id);
  db.boards = db.boards.filter((b) => b.id !== id);
  db.cards = db.cards.filter((c) => c.boardId !== id);
  db.comments = db.comments.filter((c) => !ids.includes(c.cardId));
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
