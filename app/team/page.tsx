"use client";
import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import type { Person } from "@/lib/db";

export default function TeamPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { fetch("/api/people").then((r) => r.json()).then(setPeople); }, []);

  // Each button calls an API route that is not built yet and shows the answer.
  async function call(url: string, method: string, body?: object) {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    setMsg(data.error ?? "Done.");
  }

  return (
    <>
      <h1>Team</h1>
      <p className="sub">The people in this workspace.</p>
      <div className="list">
        {people.map((p) => (
          <div key={p.id} className="card row">
            <Avatar person={p} />
            <strong>{p.name}</strong>
            <span className="muted">{p.role} · {p.email}</span>
          </div>
        ))}
      </div>

      <h2>Invite a teammate</h2>
      <form className="card stack" style={{ maxWidth: 420 }} onSubmit={(e) => { e.preventDefault(); call("/api/invite", "POST", { email }); }}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="new.person@example.com" /></label>
        <button type="submit">Send invite</button>
      </form>

      <h2>Workspace settings</h2>
      <div className="card row" style={{ maxWidth: 640 }}>
        <button className="ghost" onClick={() => call("/api/reminders", "POST")}>Email me before cards are due</button>
        <button className="ghost" onClick={() => call("/api/export", "GET")}>Export workspace</button>
      </div>
      {msg && <p className="note">{msg}</p>}
    </>
  );
}
