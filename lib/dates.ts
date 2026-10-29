// Helpers to show a due date. Used by the board, the card page and My tasks.

// ZOMBIE: BUG (time zones). "2026-11-05" is read as midnight UTC. In Miami that is the evening
// of Nov 4, so the date shows one day early. Parse the year, month and day as a LOCAL date instead.
function parse(due: string): Date {
  return new Date(due);
}

export function formatDue(due: string | null): string {
  if (!due) return "No due date";
  const d = parse(due);
  if (isNaN(d.getTime())) return due;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ZOMBIE: BUG (time zones). A card due TODAY counts as overdue all day, because "today" at
// midnight UTC is already in the past. Compare whole local days, and decide when "overdue" starts.
export function isOverdue(due: string | null, done = false): boolean {
  if (!due || done) return false;
  const d = parse(due);
  return !isNaN(d.getTime()) && d.getTime() < Date.now();
}
