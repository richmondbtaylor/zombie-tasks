// ZOMBIE: this "database" is a JSON file on disk. It works on your laptop and
// dies on any real host (Vercel's disk is read-only and wiped on every deploy).
// Replace it with a real database (Supabase, Neon, Postgres...) before you ship.
import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/seed.json";

export type Person = { id: string; name: string; role: string; email: string; color: string };
export type Column = { id: string; name: string };
export type Board = {
  id: string; name: string; description: string;
  ownerId: string; isPrivate: boolean; columns: Column[];
};
export type CheckItem = { id: string; text: string; done: boolean };
export type Card = {
  id: string; boardId: string; columnId: string; position: number;
  title: string; description: string;
  assigneeId: string | null;
  due: string | null; // a date as text. The seed has mixed formats on purpose.
  labels: string[]; checklist: CheckItem[];
};
export type Comment = { id: string; cardId: string; authorId: string; text: string; at: string };
export type Db = { people: Person[]; boards: Board[]; cards: Card[]; comments: Comment[] };

// ZOMBIE: the live site (Vercel) can't write to the app folder, so it writes to /tmp instead.
// /tmp is wiped whenever the server restarts, and each server copy keeps its own. Use a real database.
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8")) as Db;
  } catch {
    const fresh = structuredClone(seed) as Db;
    await writeDb(fresh);
    return fresh;
  }
}

export async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function newId(): string {
  // ZOMBIE: guessable ids, and two cards made in the same millisecond get the same id.
  // Anyone can walk the list by trying id+1.
  return String(Date.now());
}
