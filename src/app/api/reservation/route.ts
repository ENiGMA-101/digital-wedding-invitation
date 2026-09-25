import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SEATS_PER_TABLE = 10;
const FIRST_GUEST_TABLE = 3;
const TOTAL_TABLES = 30;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatAllocation(
  tableNumber: number,
  seatStart: number,
  seatEnd: number,
) {
  const tableEn = `Table ${pad2(tableNumber)}`;
  const tableBn = `টেবিল ${toBanglaDigits(pad2(tableNumber))}`;

  const seatsEn =
    seatStart === seatEnd
      ? `Seat ${pad2(seatStart)}`
      : `Seats ${pad2(seatStart)}–${pad2(seatEnd)}`;

  const seatsBn =
    seatStart === seatEnd
      ? `আসন ${toBanglaDigits(pad2(seatStart))}`
      : `আসন ${toBanglaDigits(pad2(seatStart))}–${toBanglaDigits(
          pad2(seatEnd),
        )}`;

  return {
    tableEn,
    tableBn,
    seatsEn,
    seatsBn,
    seatLabelEn: `${tableEn} / ${seatsEn}`,
    seatLabelBn: `${tableBn} / ${seatsBn}`,
  };
}

async function allocateSeats(guests: number) {
  const existing = await db
    .select({
      tableNumber: reservations.tableNumber,
      seatStart: reservations.seatStart,
      seatEnd: reservations.seatEnd,
      guests: reservations.guests,
    })
    .from(reservations)
    .where(eq(reservations.attendance, "attending"))
    .orderBy(asc(reservations.id));

  const tableOccupancy = new Map<number, number>();

  for (const row of existing) {
    if (!row.tableNumber) continue;

    const previous = tableOccupancy.get(row.tableNumber) ?? 0;
    const used =
      row.seatEnd ?? previous + Math.max(row.guests ?? 1, 1);

    tableOccupancy.set(row.tableNumber, Math.max(previous, used));
  }

  for (let table = FIRST_GUEST_TABLE; table <= TOTAL_TABLES; table++) {
    const used = tableOccupancy.get(table) ?? 0;

    if (used + guests <= SEATS_PER_TABLE) {
      const seatStart = used + 1;
      const seatEnd = used + guests;
      const labels = formatAllocation(table, seatStart, seatEnd);

      return {
        tableNumber: table,
        seatStart,
        seatEnd,
        seatLabelEn: labels.seatLabelEn,
        seatLabelBn: labels.seatLabelBn,
      };
    }
  }

  throw new Error("No seats available.");
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt))
      .limit(25);

    const attendingRows = rows.filter(
      (row) => row.attendance === "attending",
    );

    const totalSeatsReserved = attendingRows.reduce(
      (total, row) => total + (row.guests || 0),
      0,
    );

    let nextAvailableTable = FIRST_GUEST_TABLE;
    let nextAvailableSeat = 1;

    try {
      const next = await allocateSeats(1);
      nextAvailableTable = next.tableNumber;
      nextAvailableSeat = next.seatStart;
    } catch {
      // No seats available.
    }

    return NextResponse.json({
      ok: true,
      totalReservations: rows.length,
      attendingCount: attendingRows.length,
      totalSeatsReserved,
      totalCapacity:
        (TOTAL_TABLES - FIRST_GUEST_TABLE + 1) * SEATS_PER_TABLE,
      seatsPerTable: SEATS_PER_TABLE,
      nextAvailableTable,
      nextAvailableSeat,
      recentAllocations: attendingRows.slice(0, 6).map((row) => ({
        id: row.id,
        name: row.name,
        guests: row.guests,
        tableNumber: row.tableNumber,
        seatStart: row.seatStart,
        seatEnd: row.seatEnd,
        seatLabelEn: row.seatLabelEn,
        seatLabelBn: row.seatLabelBn,
      })),
    });
  } catch (error) {
    console.error("reservation.get.failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load reservations.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const body = (payload ?? {}) as Record<string, unknown>;

    const name =
      typeof body.name === "string"
        ? body.name.trim().slice(0, 140)
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim().slice(0, 40)
        : "";

    const rawGuests = Number(body.guests ?? 1);

    const guests = Number.isFinite(rawGuests)
      ? Math.min(Math.max(Math.round(rawGuests), 1), 10)
      : 1;

    const attendance =
      body.attendance === "declined"
        ? "declined"
        : "attending";

    const message =
      typeof body.message === "string"
        ? body.message.trim().slice(0, 500) || null
        : null;

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please provide your name." },
        { status: 422 },
      );
    }

    if (phone.length < 6) {
      return NextResponse.json(
        { error: "Please provide a valid mobile number." },
        { status: 422 },
      );
    }

    let allocation = {
      tableNumber: null as number | null,
      seatStart: null as number | null,
      seatEnd: null as number | null,
      seatLabelEn: null as string | null,
      seatLabelBn: null as string | null,
    };

    if (attendance === "attending") {
      allocation = await allocateSeats(guests);
    }

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

    if (!record) {
      throw new Error("Reservation was not created.");
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
      reservation: {
        id: record.id,
        name: record.name,
        phone: record.phone,
        guests: record.guests,
        attendance: record.attendance,
        tableNumber: record.tableNumber,
        seatStart: record.seatStart,
        seatEnd: record.seatEnd,
        seatLabelEn: record.seatLabelEn,
        seatLabelBn: record.seatLabelBn,
        message: record.message,
      },
    });
  } catch (error) {
    console.error("reservation.persist.failed", error);

    return NextResponse.json(
      {
        ok: false,
        persisted: false,
        error: "Reservation could not be saved. Please try again.",
      },
      { status: 500 },
    );
  }
}