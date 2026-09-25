import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SEATS_PER_TABLE = 10;
const FIRST_GUEST_TABLE = 3; // Tables 01–02 are reserved for immediate family
const TOTAL_TABLES = 30;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatAllocation(tableNumber: number, seatStart: number, seatEnd: number) {
  const tEn = `Table ${pad2(tableNumber)}`;
  const tBn = `টেবিল ${toBanglaDigits(pad2(tableNumber))}`;

  const sEn =
    seatStart === seatEnd
      ? `Seat ${pad2(seatStart)}`
      : `Seats ${pad2(seatStart)}–${pad2(seatEnd)}`;
  const sBn =
    seatStart === seatEnd
      ? `আসন ${toBanglaDigits(pad2(seatStart))}`
      : `আসন ${toBanglaDigits(pad2(seatStart))}–${toBanglaDigits(pad2(seatEnd))}`;

  return {
    tableEn: tEn,
    tableBn: tBn,
    seatsEn: sEn,
    seatsBn: sBn,
    seatLabelEn: `${tEn} / ${sEn}`,
    seatLabelBn: `${tBn} / ${sBn}`,
  };
}

/**
 * Compute next available table & contiguous seat range for `guests` people
 * based on existing attending reservations in PostgreSQL.
 */
async function allocateSeats(guests: number): Promise<{
  tableNumber: number;
  seatStart: number;
  seatEnd: number;
  seatLabelEn: string;
  seatLabelBn: string;
}> {
  let existing: Array<{ tableNumber: number | null; seatStart: number | null; seatEnd: number | null; guests: number }> = [];
  try {
    existing = await db
      .select({
        tableNumber: reservations.tableNumber,
        seatStart: reservations.seatStart,
        seatEnd: reservations.seatEnd,
        guests: reservations.guests,
      })
      .from(reservations)
      .where(eq(reservations.attendance, "attending"))
      .orderBy(asc(reservations.id));
  } catch {
    existing = [];
  }

  // Track highest occupied seat per table
  const tableOccupancy = new Map<number, number>();
  for (const row of existing) {
    const t = row.tableNumber ?? FIRST_GUEST_TABLE;
    const prev = tableOccupancy.get(t) ?? 0;
    const used = row.seatEnd ?? prev + (row.guests || 1);
    tableOccupancy.set(t, Math.max(prev, used));
  }

  let chosenTable = FIRST_GUEST_TABLE;
  let seatStart = 1;
  let seatEnd = guests;

  for (let t = FIRST_GUEST_TABLE; t <= TOTAL_TABLES; t++) {
    const used = tableOccupancy.get(t) ?? 0;
    if (used + guests <= SEATS_PER_TABLE) {
      chosenTable = t;
      seatStart = used + 1;
      seatEnd = used + guests;
      break;
    }
  }

  const labels = formatAllocation(chosenTable, seatStart, seatEnd);
  return {
    tableNumber: chosenTable,
    seatStart,
    seatEnd,
    seatLabelEn: labels.seatLabelEn,
    seatLabelBn: labels.seatLabelBn,
  };
}

/** GET /api/reservation — summary of reservations, capacity, and recent seat allocations */
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt))
      .limit(25);

    const attendingRows = rows.filter((r) => r.attendance === "attending");
    const totalSeatsReserved = attendingRows.reduce((acc, r) => acc + (r.guests || 0), 0);

    // Also compute next preview allocation for 1, 2, 4 guests
    const nextForOne = await allocateSeats(1);

    return NextResponse.json({
      totalReservations: rows.length,
      attendingCount: attendingRows.length,
      totalSeatsReserved,
      totalCapacity: (TOTAL_TABLES - FIRST_GUEST_TABLE + 1) * SEATS_PER_TABLE,
      seatsPerTable: SEATS_PER_TABLE,
      nextAvailableTable: nextForOne.tableNumber,
      nextAvailableSeat: nextForOne.seatStart,
      recentAllocations: attendingRows.slice(0, 6).map((r) => ({
        id: r.id,
        name: r.name,
        guests: r.guests,
        tableNumber: r.tableNumber ?? FIRST_GUEST_TABLE,
        seatStart: r.seatStart ?? 1,
        seatEnd: r.seatEnd ?? r.guests,
        seatLabelEn: r.seatLabelEn ?? formatAllocation(r.tableNumber ?? FIRST_GUEST_TABLE, r.seatStart ?? 1, r.seatEnd ?? r.guests).seatLabelEn,
        seatLabelBn: r.seatLabelBn ?? formatAllocation(r.tableNumber ?? FIRST_GUEST_TABLE, r.seatStart ?? 1, r.seatEnd ?? r.guests).seatLabelBn,
      })),
    });
  } catch {
    const fallback = formatAllocation(FIRST_GUEST_TABLE, 1, 1);
    return NextResponse.json({
      totalReservations: 0,
      attendingCount: 0,
      totalSeatsReserved: 0,
      totalCapacity: (TOTAL_TABLES - FIRST_GUEST_TABLE + 1) * SEATS_PER_TABLE,
      seatsPerTable: SEATS_PER_TABLE,
      nextAvailableTable: FIRST_GUEST_TABLE,
      nextAvailableSeat: 1,
      recentAllocations: [],
      nextPreview: fallback,
      degraded: true,
    });
  }
}

/** POST /api/reservation — create a wedding reservation & allocate table + seats */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 140) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const rawGuests = Number(body.guests ?? 1);
  const guests = Number.isFinite(rawGuests) ? Math.min(Math.max(Math.round(rawGuests), 1), 10) : 1;
  const attendance = body.attendance === "declined" ? "declined" : "attending";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 500) || null : null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 422 });
  }
  if (phone.length < 6) {
    return NextResponse.json({ error: "Please provide a valid mobile number." }, { status: 422 });
  }

  let allocation: {
    tableNumber: number | null;
    seatStart: number | null;
    seatEnd: number | null;
    seatLabelEn: string | null;
    seatLabelBn: string | null;
  } = {
    tableNumber: null,
    seatStart: null,
    seatEnd: null,
    seatLabelEn: null,
    seatLabelBn: null,
  };

  if (attendance === "attending") {
    allocation = await allocateSeats(guests);
  }

  try {
    const inserted = await db
      .insert(reservations)
      .values({
        name,
        phone,
        guests,
        attendance,
        tableNumber: allocation.tableNumber,
        seatStart: allocation.seatStart,
        seatEnd: allocation.seatEnd,
        seatLabelEn: allocation.seatLabelEn,
        seatLabelBn: allocation.seatLabelBn,
        message,
      })
      .returning();

    const record = inserted[0];
    return NextResponse.json({
      ok: true,
      persisted: true,
      reservation: {
        id: record?.id ?? Date.now(),
        name,
        phone,
        guests,
        attendance,
        tableNumber: allocation.tableNumber,
        seatStart: allocation.seatStart,
        seatEnd: allocation.seatEnd,
        seatLabelEn: allocation.seatLabelEn,
        seatLabelBn: allocation.seatLabelBn,
        message,
      },
    });
  } catch (error) {
    console.error("reservation.persist.failed", error);
    return NextResponse.json({
      ok: true,
      persisted: false,
      reservation: {
        id: Date.now(),
        name,
        phone,
        guests,
        attendance,
        tableNumber: allocation.tableNumber,
        seatStart: allocation.seatStart,
        seatEnd: allocation.seatEnd,
        seatLabelEn: allocation.seatLabelEn,
        seatLabelBn: allocation.seatLabelBn,
        message,
      },
    });
  }
}
