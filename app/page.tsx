"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";

type BoardRow = {
  id: string; name: string; description: string; ownerId: string;
  isPrivate: boolean; cardCount: number;
};

export default function BoardsPage() {
  const me = useMe();
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setBoards(await (await fetch("/api/boards")).json());
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, isPrivate, ownerId: me }),
    });
    if (!res.ok) return setError((await res.json()).error);
    setName("");
    setIsPrivate(false);
    load();
  }

  // ZOMBIE: this only hides private boards in the browser. The API still sends them to everyone.
  const visible = boards.filter((b) => !b.isPrivate || b.ownerId === me);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Boards</h1>
          <p className="sub">Pick a board to see its columns and cards.</p>
        </div>
      </div>
      <div className="board-grid">
        {visible.map((b) => (
          <Link key={b.id} href={`/boards/${b.id}`} className="card board-tile">
            <strong>{b.name}</strong>
            <span className="muted">{b.description}</span>
            <span className="row">
              <span className="pill">{b.cardCount} cards</span>
              {b.isPrivate && <span className="pill">Private</span>}
            </span>
          </Link>
        ))}
      </div>
      <h2>New board</h2>
      <form className="card stack" onSubmit={create} style={{ maxWidth: 420 }}>
        <label>Board name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Q1 planning" /></label>
        <label className="check-row">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          Private (only I can see it)
        </label>
        <button type="submit">Create board</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}
