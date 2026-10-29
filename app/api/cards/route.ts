import { NextResponse } from "next/server";
import { readDb, writeDb, newId, type Card } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Give the card a title." }, { status: 400 });
  const db = await readDb();
  const board = db.boards.find((b) => b.id === body.boardId);
  if (!board) return NextResponse.json({ error: "No such board." }, { status: 404 });
  const columnId = String(body.columnId ?? board.columns[0]?.id);
  // ZOMBIE: BUG. The new card's position is the NUMBER of cards in the column. After a delete or a
  // move, that number is already taken, so two cards share a position and their order is a coin toss.
  // Use max(position) + 1, or store the order as a list of ids on the column.
  const position = db.cards.filter((c) => c.columnId === columnId).length;
  const card: Card = {
    id: "k" + newId(), boardId: board.id, columnId, position,
    title, description: "", assigneeId: null, due: null, labels: [], checklist: [],
  };
  db.cards.push(card);
  await writeDb(db);
  return NextResponse.json(card, { status: 201 });
}
