"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { useMe } from "@/lib/useMe";
import type { Board, Card, CheckItem, Comment, Person } from "@/lib/db";

type Data = { card: Card; board: Board; comments: Comment[]; people: Person[] };

export default function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const me = useMe();
  const [data, setData] = useState<Data | null>(null);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [due, setDue] = useState("");
  const [labels, setLabels] = useState("");
  const [newItem, setNewItem] = useState("");
  const [comment, setComment] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/cards/${id}`);
    if (!res.ok) return setMsg((await res.json()).error);
    const d: Data = await res.json();
    setData(d);
    setTitle(d.card.title);
    setDescription(d.card.description);
    setAssigneeId(d.card.assigneeId ?? "");
    setDue(d.card.due ?? "");
    setLabels(d.card.labels.join(", "));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function patch(body: object) {
    await fetch(`/api/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await patch({
      title, description,
      assigneeId: assigneeId || null,
      due: due || null,
      labels: labels.split(",").map((l) => l.trim()).filter(Boolean),
    });
    setMsg("Saved.");
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/cards/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment, authorId: me }),
    });
    if (!res.ok) return setMsg((await res.json()).error);
    setComment("");
    load();
  }

  async function remove() {
    // ZOMBIE: no "are you sure?" and no undo. One click deletes the card and its comments.
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    router.push(`/boards/${data?.board.id ?? ""}`);
  }

  if (!data) return <p className={msg ? "error" : "muted"}>{msg || "Loading..."}</p>;
  const { card, board, comments, people } = data;
  const items: CheckItem[] = card.checklist;
  const doneCount = items.filter((i) => i.done).length;
  // ZOMBIE: BUG. An empty checklist divides 0 by 0 and shows "NaN%". Show nothing when there are no items.
  const percent = Math.round((doneCount / items.length) * 100);

  return (
    <>
      <p className="small"><Link href="/">Boards</Link> / <Link href={`/boards/${board.id}`}>{board.name}</Link></p>
      <h1>{card.title}</h1>
      <div className="two-col">
        <form className="card stack" onSubmit={save}>
          <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Description<textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <label>Assignee
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              <option value="">Nobody</option>
              {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label>Due date (YYYY-MM-DD)<input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></label>
          <label>Labels (separate with commas)<input value={labels} onChange={(e) => setLabels(e.target.value)} /></label>
          <div className="row">
            <button type="submit">Save card</button>
            <button type="button" className="ghost" onClick={remove}>Delete card</button>
            <Avatar person={people.find((p) => p.id === card.assigneeId)} />
          </div>
          {msg && <p className="note">{msg}</p>}
          <p className="muted small">There is no activity log yet, so nobody can see who changed this card.</p>
        </form>

        <div className="stack">
          <div className="card stack">
            <strong>Checklist <span className="pill">{percent}%</span></strong>
            <div className="progress"><div style={{ width: `${percent}%` }} /></div>
            {items.map((item) => (
              <label key={item.id} className="check-row">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => patch({ checklist: items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)) })}
                />
                <span className={item.done ? "done" : ""}>{item.text}</span>
              </label>
            ))}
            <form
              className="add-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newItem.trim()) return;
                patch({ checklist: [...items, { id: "i" + Date.now(), text: newItem, done: false }] });
                setNewItem("");
              }}
            >
              <input placeholder="Add an item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
              <button type="submit" className="small-btn">Add</button>
            </form>
          </div>

          <div className="card stack">
            <strong>Comments</strong>
            {comments.length === 0 && <p className="muted">No comments yet.</p>}
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <span className="small muted">{people.find((p) => p.id === c.authorId)?.name ?? "Someone"} · {new Date(c.at).toLocaleString()}</span>
                {/* Shown as plain text. React escapes it. See the XSS note in the comments API. */}
                <span>{c.text}</span>
              </div>
            ))}
            <form className="add-form" onSubmit={addComment}>
              <input placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit" className="small-btn">Post</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
