import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// Cards assigned to one person, soonest due date first.
// GET /api/my-tasks?me=p1
export async function GET(req: Request) {
  const me = new URL(req.url).searchParams.get("me");
  const db = await readDb();
  // ZOMBIE: SECURITY. "me" is a query string. Change it to see anyone's tasks, private boards included.
  const mine = db.cards.filter((c) => c.assigneeId === me);
  // ZOMBIE: BUG. Due dates are sorted as TEXT. "11/5/2026" lands before "2026-10-30" because "1" < "2",
  // and "2026-11-10" lands before "2026-11-9". Parse them into real dates first, then sort.
  // Cards with no due date should go last.
  mine.sort((a, b) => (a.due ?? "~").localeCompare(b.due ?? "~"));
  const tasks = mine.map((c) => {
    const board = db.boards.find((b) => b.id === c.boardId);
    const column = board?.columns.find((col) => col.id === c.columnId);
    return { ...c, boardName: board?.name ?? "", columnName: column?.name ?? "" };
  });
  return NextResponse.json(tasks);
}
