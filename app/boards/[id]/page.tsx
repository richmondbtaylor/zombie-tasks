"use client";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { formatDue, isOverdue } from "@/lib/dates";
import type { Board, Card, Person } from "@/lib/db";

type Data = { board: Board; cards: Card[]; people: Person[] };

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [search, setSearch] = useState("");
  const [titles, setTitles] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch(`/api/boards/${id}`);
    if (!res.ok) return setError((await res.json()).error);
    setData(await res.json());
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function send(url: string, method: string, body?: object) {
    setError("");
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) setError((await res.json()).error ?? "Something went wrong.");
    load();
  }

  if (error && !data) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading...</p>;
  const { board, cards, people } = data;

  return (
    <>
      <div className="page-head">
        <div>
          <p className="small"><Link href="/">Boards</Link></p>
          <h1>{board.name} {board.isPrivate && <span className="pill">Private</span>}</h1>
          <p className="sub">{board.description}</p>
        </div>
        <div className="row">
          {/* ZOMBIE: search is not built. The box does nothing. */}
          <input style={{ width: 180 }} placeholder="Search cards" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="ghost" onClick={() => setError("Not built yet: card search.")}>Search</button>
        </div>
      </div>
      {/* ZOMBIE: drag and drop is not built. Cards move with the arrow buttons only. */}
      <p className="muted small">Move a card with the arrow buttons. Drag and drop is not built yet.</p>
      {error && <p className="error">{error}</p>}

      <div className="columns">
        {board.columns.map((col, ci) => {
          const colCards = cards.filter((c) => c.columnId === col.id).sort((a, b) => a.position - b.position);
          return (
            <div key={col.id} className="column">
              <div className="column-head">
                <strong>{col.name} <span className="muted small">{colCards.length}</span></strong>
                <button className="ghost small-btn" onClick={() => send(`/api/columns/${col.id}`, "DELETE")}>Delete column</button>
              </div>
              {colCards.map((c) => (
                <div key={c.id} className="task">
                  <Link href={`/cards/${c.id}`} className="task-title">{c.title}</Link>
                  {c.labels.length > 0 && <div>{c.labels.map((l) => <span key={l} className="label">{l}</span>)}</div>}
                  <div className="task-foot">
                    <Avatar person={people.find((p) => p.id === c.assigneeId)} />
                    <span className={"due" + (isOverdue(c.due, col.name === "Done") ? " overdue" : "")}>{formatDue(c.due)}</span>
                  </div>
                  <div className="mover">
                    <button disabled={ci === 0} onClick={() => send(`/api/cards/${c.id}/move`, "POST", { direction: "left" })} aria-label="Move left">←</button>
                    <button onClick={() => send(`/api/cards/${c.id}/move`, "POST", { direction: "up" })} aria-label="Move up">↑</button>
                    <button onClick={() => send(`/api/cards/${c.id}/move`, "POST", { direction: "down" })} aria-label="Move down">↓</button>
                    <button disabled={ci === board.columns.length - 1} onClick={() => send(`/api/cards/${c.id}/move`, "POST", { direction: "right" })} aria-label="Move right">→</button>
                  </div>
                </div>
              ))}
              <form
                className="add-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  send("/api/cards", "POST", { boardId: board.id, columnId: col.id, title: titles[col.id] ?? "" });
                  setTitles({ ...titles, [col.id]: "" });
                }}
              >
                <input placeholder="Add a card" value={titles[col.id] ?? ""} onChange={(e) => setTitles({ ...titles, [col.id]: e.target.value })} />
                <button type="submit" className="small-btn">Add</button>
              </form>
            </div>
          );
        })}
        <form
          className="column"
          onSubmit={(e) => {
            e.preventDefault();
            send(`/api/boards/${board.id}/columns`, "POST", { name: newColumn });
            setNewColumn("");
          }}
        >
          <strong>New column</strong>
          <input placeholder="Review, Blocked..." value={newColumn} onChange={(e) => setNewColumn(e.target.value)} />
          <button type="submit">Add column</button>
        </form>
      </div>
    </>
  );
}
