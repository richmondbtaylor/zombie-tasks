import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: BUG. Deleting a column deletes every card in it, with no warning and no undo.
// The comments go too. Ask first, offer to move the cards to another column, and keep a
// "deleted" copy for a while (see the compliance section).
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const gone = db.cards.filter((c) => c.columnId === id).map((c) => c.id);
  db.cards = db.cards.filter((c) => c.columnId !== id);
  db.comments = db.comments.filter((c) => !gone.includes(c.cardId));
  for (const b of db.boards) b.columns = b.columns.filter((c) => c.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true, cardsDeleted: gone.length });
}
