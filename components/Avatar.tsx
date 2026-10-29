// A small colored circle with the person's initials.
export default function Avatar({ person }: { person?: { name: string; color: string } | null }) {
  if (!person) return <span className="muted small">Unassigned</span>;
  const initials = person.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return <span className="avatar" style={{ background: person.color }} title={person.name}>{initials}</span>;
}
