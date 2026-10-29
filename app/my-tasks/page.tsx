"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDue, isOverdue } from "@/lib/dates";
import { useMe } from "@/lib/useMe";
import type { Card } from "@/lib/db";

type Task = Card & { boardName: string; columnName: string };

export default function MyTasksPage() {
  const me = useMe();
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    if (!me) return;
    fetch(`/api/my-tasks?me=${me}`).then((r) => r.json()).then(setTasks);
  }, [me]);

  return (
    <>
      <h1>My tasks</h1>
      <p className="sub">Cards assigned to the person you are pretending to be. Soonest due date first.</p>
      {tasks === null ? <p className="muted">Loading...</p> : tasks.length === 0 ? (
        <div className="card empty"><strong>Nothing assigned to you.</strong><span className="muted">Open a card and pick yourself as the assignee.</span></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Card</th><th>Board</th><th>Column</th><th>Due</th></tr></thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td><Link href={`/cards/${t.id}`}>{t.title}</Link></td>
                  <td>{t.boardName}</td>
                  <td>{t.columnName}</td>
                  <td className={"due" + (isOverdue(t.due, t.columnName === "Done") ? " overdue" : "")}>
                    {formatDue(t.due)}{isOverdue(t.due, t.columnName === "Done") ? " (overdue)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
