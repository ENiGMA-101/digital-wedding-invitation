import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const reservationAttendance = ["attending", "declined"] as const;
export type ReservationAttendance = (typeof reservationAttendance)[number];

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  guests: integer("guests").notNull().default(1),
  attendance: varchar("attendance", { length: 20 }).notNull().default("attending"),
  tableNumber: integer("table_number"),
  seatStart: integer("seat_start"),
  seatEnd: integer("seat_end"),
  seatLabelEn: varchar("seat_label_en", { length: 100 }),
  seatLabelBn: varchar("seat_label_bn", { length: 100 }),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
