// ZOMBIE: "Invite teammate" is not built. It returns 501.
// To do: save the invite with a random token, email a link (a real sender address and an unsubscribe
// line, see CAN-SPAM in ZOMBIE.md), and let the person join the workspace after they sign in.
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: null }));
  return NextResponse.json(
    { error: `Invites are not built yet. Nobody was emailed at ${email ?? "that address"}.` },
    { status: 501 },
  );
}
