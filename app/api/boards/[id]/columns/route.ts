import { NextResponse } from "next/server";
import { readDb, writeDb, newId } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// Add a custom column to a board.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Give the column a name." }, { status: 400 });
  const db = await readDb();
  const board = db.boards.find((b) => b.id === id);
  if (!board) return NextResponse.json({ error: "No such board." }, { status: 404 });
  const column = { id: "c" + newId(), name };
  board.columns.push(column);
  await writeDb(db);
  return NextResponse.json(column, { status: 201 });
}
