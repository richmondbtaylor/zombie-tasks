// ZOMBIE: "Export workspace" is not built. The workspace data (boards, cards, comments) belongs to the
// customer company. They must be able to take it out as JSON or CSV, and ask us to delete it.
// To do: build the export (only for the workspace owner), and a "delete my workspace" flow.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Not built yet: export your workspace." }, { status: 501 });
}
