import { NextResponse } from "next/server";
import { count, sql } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/rsvp — lightweight tally shown inside the invitation */
export async function GET() {
  try {
    const rows = await db
      .select({
        replies: count(),
        attending: count(sql`case when ${reservations.attendance} = 'attending' then 1 end`),
        seats: sql<number>`coalesce(sum(case when ${reservations.attendance} = 'attending' then ${reservations.guests} else 0 end), 0)`,
      })
      .from(reservations);

    const row = rows[0];
    return NextResponse.json({
      replies: row?.replies ?? 0,
      attending: row?.attending ?? 0,
      seats: Number(row?.seats ?? 0),
    });
  } catch {
    return NextResponse.json({ replies: 0, attending: 0, seats: 0, degraded: true });
  }
}

/** POST /api/rsvp — store a guest reply */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const rawGuests = Number(body.guests ?? 1);
  const guests = Number.isFinite(rawGuests) ? Math.min(Math.max(Math.round(rawGuests), 1), 12) : 1;
  const attendance = body.attendance === "declined" ? "declined" : "attending";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) || null : null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 422 });
  }

  try {
    await db.insert(reservations).values({ name, guests, attendance, message }).execute();
    return NextResponse.json({ ok: true, persisted: true, name, guests, attendance });
  } catch (error) {
    // Never break the guest experience if the database is unavailable.
    console.error("rsvp.persist.failed", error);
    return NextResponse.json({ ok: true, persisted: false, name, guests, attendance });
  }
}
