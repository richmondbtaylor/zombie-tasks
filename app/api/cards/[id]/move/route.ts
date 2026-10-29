import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// Move a card with buttons: left and right change the column, up and down change the order.
// Body: { direction: "left" | "right" | "up" | "down" }
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { direction } = await req.json().catch(() => ({ direction: "" }));
  const db = await readDb();
  const card = db.cards.find((c) => c.id === id);
  if (!card) return NextResponse.json({ error: "No such card." }, { status: 404 });
  const board = db.boards.find((b) => b.id === card.boardId);
  if (!board) return NextResponse.json({ error: "No such board." }, { status: 404 });

  if (direction === "left" || direction === "right") {
    const i = board.columns.findIndex((c) => c.id === card.columnId);
    const next = board.columns[direction === "left" ? i - 1 : i + 1];
    if (!next) return NextResponse.json({ error: "Nowhere to go." }, { status: 400 });
    card.columnId = next.id;
    // ZOMBIE: BUG. The moved card gets position 0, which another card in that column already has.
    // Two cards at 0 means their order is a coin toss and "up" and "down" can do nothing.
    card.position = 0;
  } else if (direction === "up" || direction === "down") {
    const column = db.cards
      .filter((c) => c.columnId === card.columnId)
      .sort((a, b) => a.position - b.position);
    const i = column.findIndex((c) => c.id === card.id);
    const other = column[direction === "up" ? i - 1 : i + 1];
    if (!other) return NextResponse.json({ error: "Already at the end." }, { status: 400 });
    // ZOMBIE: BUG. This swaps position numbers. If the two numbers are equal (see above), nothing changes.
    // Renumber the whole column 0, 1, 2... after every move.
    const tmp = card.position;
    card.position = other.position;
    other.position = tmp;
  } else {
    return NextResponse.json({ error: "Direction must be left, right, up or down." }, { status: 400 });
  }
  await writeDb(db);
  return NextResponse.json(card);
}
