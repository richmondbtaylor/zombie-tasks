import { NextResponse } from "next/server";
import { readDb, writeDb, newId, type Comment } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: SECURITY. The author comes from the request body, so anyone can comment as anyone.
// The text is saved as typed: any HTML, any length. React shows it as plain text, so it is safe today.
// The moment someone adds markdown or dangerouslySetInnerHTML, this becomes an XSS hole.
// Clean it on the way in, cap the length, and rate limit. Nobody is told when they are @mentioned either.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? "");
  if (!text.trim()) return NextResponse.json({ error: "Write a comment first." }, { status: 400 });
  const db = await readDb();
  if (!db.cards.find((c) => c.id === id)) return NextResponse.json({ error: "No such card." }, { status: 404 });
  const comment: Comment = {
    id: "m" + newId(), cardId: id, authorId: String(body.authorId ?? ""), text, at: new Date().toISOString(),
  };
  db.comments.push(comment);
  await writeDb(db);
  return NextResponse.json(comment, { status: 201 });
}
