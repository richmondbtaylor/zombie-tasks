// ZOMBIE: due-date reminder emails say "Not built yet". Nothing is sent and nothing checks the due dates.
// To do: a daily job (Vercel Cron) finds cards due soon, emails the assignee through an email service
// (Resend, Postmark...), and respects an opt-out. Reminder mail must follow CAN-SPAM (see ZOMBIE.md).
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not built yet: due-date reminder emails." }, { status: 501 });
}
