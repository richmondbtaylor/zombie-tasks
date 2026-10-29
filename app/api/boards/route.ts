import { NextResponse } from "next/server";
import { readDb, writeDb, newId, type Board } from "@/lib/db";

// ZOMBIE: SECURITY. There are no owner or member checks. This returns EVERY board, including the
// private ones ("Hiring plan"). The page only hides them in the browser. Return only the boards
// the signed-in user owns or was invited to. Do the same on GET /api/boards/[id].
export async function GET() {
  const db = await readDb();
  const boards = db.boards.map((b) => ({
    ...b,
    cardCount: db.cards.filter((c) => c.boardId === b.id).length,
  }));
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Give the board a name." }, { status: 400 });
  const db = await readDb();
  const id = newId();
  const board: Board = {
    id: "b" + id,
    name,
    description: String(body.description ?? ""),
    // ZOMBIE: SECURITY. The owner id comes from the request. Anyone can create a board "owned by" someone else.
    ownerId: String(body.ownerId ?? db.people[0].id),
    isPrivate: Boolean(body.isPrivate),
    columns: ["To do", "Doing", "Done"].map((n, i) => ({ id: `c${id}-${i}`, name: n })),
  };
  db.boards.push(board);
  await writeDb(db);
  return NextResponse.json(board, { status: 201 });
}
