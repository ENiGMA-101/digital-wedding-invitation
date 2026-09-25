"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Armchair, Check, Loader2, Minus, Plus, Send, Sparkles, X } from "lucide-react";
import wedding, { type Lang } from "@/config/weddingConfig";
import { haptic } from "@/lib/audio";

export type Attendance = "attending" | "declined";

export type ConfirmedReservation = {
  id: number;
  name: string;
  phone: string;
  guests: number;
  attendance: Attendance;
  tableNumber: number | null;
  seatStart: number | null;
  seatEnd: number | null;
  seatLabelEn: string | null;
  seatLabelBn: string | null;
  message: string | null;
};

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export function formatNumberByLang(input: number | string, lang: Lang, pad = 0): string {
  const raw = pad > 0 ? String(input).padStart(pad, "0") : String(input);
  return lang === "bn" ? raw.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d) : raw;
}

export function formatTableByLang(tableNumber: number | null | undefined, lang: Lang): string {
  const t = tableNumber ?? 3;
  return lang === "bn"
    ? `টেবিল ${formatNumberByLang(t, "bn", 2)}`
    : `Table ${formatNumberByLang(t, "en", 2)}`;
}

export function formatSeatsByLang(
  seatStart: number | null | undefined,
  seatEnd: number | null | undefined,
  guests: number,
  lang: Lang,
): string {
  const start = seatStart ?? 1;
  const end = seatEnd ?? start + guests - 1;
  if (start === end) {
    return lang === "bn"
      ? `আসন ${formatNumberByLang(start, "bn", 2)}`
      : `Seat ${formatNumberByLang(start, "en", 2)}`;
  }
  return lang === "bn"
    ? `আসন ${formatNumberByLang(start, "bn", 2)}–${formatNumberByLang(end, "bn", 2)}`
    : `Seats ${formatNumberByLang(start, "en", 2)}–${formatNumberByLang(end, "en", 2)}`;
}

const inputClass =
  "w-full rounded-xl border border-wine-700/20 bg-ivory-50 px-4 py-3 font-sans text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-wine-600/65";

export default function ReservationSheet({
  preset,
  lang,
  nextTableHint = 3,
  nextSeatHint = 1,
  onClose,
  onConfirmed,
}: {
  preset: Attendance | null;
  lang: Lang;
  nextTableHint?: number;
  nextSeatHint?: number;
  onClose: () => void;
  onConfirmed: (res: ConfirmedReservation) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [attendance, setAttendance] = useState<Attendance>(preset ?? "attending");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<ConfirmedReservation | null>(null);

  useEffect(() => {
    if (preset === null) return;
    setOpen(true);
    setAttendance(preset);
    setStatus("idle");
    setError(null);
  }, [preset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        window.setTimeout(onClose, 300);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Calculate preview table/seats based on next available hint
  const previewTable = nextSeatHint + guests - 1 <= 10 ? nextTableHint : nextTableHint + 1;
  const previewStart = nextSeatHint + guests - 1 <= 10 ? nextSeatHint : 1;
  const previewEnd = previewStart + guests - 1;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(
        lang === "bn"
          ? "অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।"
          : "Please enter your full name.",
      );
      haptic(30);
      return;
    }
    if (phone.trim().length < 6) {
      setError(
        lang === "bn"
          ? "অনুগ্রহ করে আপনার সঠিক মোবাইল নম্বর লিখুন।"
          : "Please enter a valid mobile number.",
      );
      haptic(30);
      return;
    }

    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, guests, attendance, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      const record: ConfirmedReservation = data.reservation;
      setConfirmedData(record);
      onConfirmed(record);
      setStatus("done");
      haptic([10, 40, 12]);
    } catch {
      const fallback: ConfirmedReservation = {
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        guests,
        attendance,
        tableNumber: attendance === "attending" ? previewTable : null,
        seatStart: attendance === "attending" ? previewStart : null,
        seatEnd: attendance === "attending" ? previewEnd : null,
        seatLabelEn:
          attendance === "attending"
            ? `${formatTableByLang(previewTable, "en")} / ${formatSeatsByLang(previewStart, previewEnd, guests, "en")}`
            : null,
        seatLabelBn:
          attendance === "attending"
            ? `${formatTableByLang(previewTable, "bn")} / ${formatSeatsByLang(previewStart, previewEnd, guests, "bn")}`
            : null,
        message: message.trim() || null,
      };
      setConfirmedData(fallback);
      onConfirmed(fallback);
      setStatus("done");
    }
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(onClose, 320);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label={wedding.ui.closeBtn[lang]}
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-wine-950/75 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={wedding.ui.reservationSectionKicker[lang]}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[90dvh] w-full max-w-[436px] overflow-y-auto rounded-t-[28px] border-t border-gold-500/40 bg-[radial-gradient(120%_80%_at_50%_0%,#fdfaf4_0%,#f6eee0_60%,#ecdcc3_100%)] text-ink shadow-[0_-30px_60px_-28px_rgba(0,0,0,0.85)] no-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-wine-700/12 bg-ivory-50/90 px-5 py-3.5 backdrop-blur-md">
              <div>
                <p className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-sage-700">
                  {wedding.ui.reservationSectionKicker[lang]}
                </p>
                <p className="font-display text-[21px] leading-tight text-wine-800">
                  {wedding.ui.reservationSectionTitle[lang]}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={wedding.ui.closeBtn[lang]}
                className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/18 text-ink-soft transition-colors hover:border-wine-700/45"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === "done" && confirmedData ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center px-6 pb-10 pt-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15 }}
                    className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/45 bg-wine-700 text-gold-200 shadow-lg"
                  >
                    <Check className="h-7 w-7" strokeWidth={1.8} />
                  </motion.span>

                  <h4 className="mt-4 font-display text-[25px] leading-snug text-wine-800">
                    {confirmedData.attendance === "attending"
                      ? wedding.ui.reservationConfirmedTitle[lang]
                      : wedding.ui.reservationDeclinedTitle[lang]}
                  </h4>

                  {confirmedData.attendance === "attending" && (
                    <div className="mt-5 w-full overflow-hidden rounded-[20px] border border-gold-600/40 bg-[linear-gradient(165deg,#fdfaf4_0%,#f5ead6_100%)] p-5 text-left shadow-[0_18px_38px_-24px_rgba(64,9,18,0.55)]">
                      <div className="flex items-center justify-between border-b border-gold-600/25 pb-3">
                        <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-sage-700">
                          <Sparkles className="h-3.5 w-3.5 text-gold-600" strokeWidth={1.6} />
                          {wedding.ui.yourAssignedSeatHeader[lang]}
                        </span>
                        <span className="rounded-full bg-sage-700/12 px-2.5 py-0.5 font-sans text-[10px] font-medium text-sage-800">
                          {formatTableByLang(confirmedData.tableNumber, lang)} ·{" "}
                          {formatSeatsByLang(
                            confirmedData.seatStart,
                            confirmedData.seatEnd,
                            confirmedData.guests,
                            lang,
                          )}
                        </span>
                      </div>

                      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
                        <div>
                          <span className="block font-sans text-[9.5px] uppercase tracking-[0.2em] text-ink-soft/65">
                            {wedding.ui.guestNameLabel[lang]}
                          </span>
                          <span className="mt-0.5 block font-display text-[19px] font-medium text-wine-800">
                            {confirmedData.name}
                          </span>
                        </div>
                        <div>
                          <span className="block font-sans text-[9.5px] uppercase tracking-[0.2em] text-ink-soft/65">
                            {wedding.ui.guestCountLabel[lang]}
                          </span>
                          <span className="mt-0.5 block font-display text-[19px] font-medium text-wine-800">
                            {formatNumberByLang(confirmedData.guests, lang)}{" "}
                            {lang === "bn" ? "জন" : confirmedData.guests === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div className="rounded-xl border border-gold-600/30 bg-ivory-50/90 p-3">
                          <span className="block font-sans text-[9px] uppercase tracking-[0.22em] text-gold-600">
                            {wedding.ui.tableNumberLabel[lang]}
                          </span>
                          <span className="mt-1 block font-display text-[22px] font-semibold text-wine-800">
                            {formatTableByLang(confirmedData.tableNumber, lang)}
                          </span>
                        </div>
                        <div className="rounded-xl border border-sage-600/30 bg-sage-100/60 p-3">
                          <span className="block font-sans text-[9px] uppercase tracking-[0.22em] text-sage-700">
                            {wedding.ui.seatNumbersLabel[lang]}
                          </span>
                          <span className="mt-1 block font-display text-[22px] font-semibold text-sage-900">
                            {formatSeatsByLang(
                              confirmedData.seatStart,
                              confirmedData.seatEnd,
                              confirmedData.guests,
                              lang,
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3.5 text-center font-sans text-[10.5px] text-ink-soft/75">
                        {wedding.dateDisplay[lang]} · {wedding.venue[lang]}, {wedding.venueLine2[lang]}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 rounded-full bg-wine-700 px-8 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-ivory-50 shadow-md transition-transform active:scale-95"
                  >
                    {wedding.ui.closeBtn[lang]}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 px-5 pb-[calc(env(safe-area-inset-bottom)+26px)] pt-5"
                >
                  {/* Guest Name */}
                  <div className="text-left">
                    <label
                      htmlFor="res-name"
                      className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-soft/75"
                    >
                      {wedding.ui.guestNameLabel[lang]} *
                    </label>
                    <input
                      id="res-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={wedding.ui.guestNamePlaceholder[lang]}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="text-left">
                    <label
                      htmlFor="res-phone"
                      className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-soft/75"
                    >
                      {wedding.ui.mobileNumberLabel[lang]} *
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={wedding.ui.mobilePlaceholder[lang]}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>

                  {/* Number of Guests */}
                  <div className="text-left">
                    <span className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-soft/75">
                      {wedding.ui.guestCountLabel[lang]}
                    </span>
                    <div className="flex items-center gap-4 rounded-xl border border-wine-700/20 bg-ivory-50 px-4 py-2.5">
                      <button
                        type="button"
                        aria-label="Decrease guests"
                        onClick={() => {
                          haptic(6);
                          setGuests((g) => Math.max(1, g - 1));
                        }}
                        className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/25 text-wine-700 transition-colors hover:border-wine-700/50 disabled:opacity-35"
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                      <div className="flex-1 text-center">
                        <span className="font-display text-[26px] leading-none text-wine-800">
                          {formatNumberByLang(guests, lang)}
                        </span>
                        <span className="ml-1.5 font-sans text-[11px] text-ink-soft/75">
                          {lang === "bn" ? "জন অতিথি" : guests === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Increase guests"
                        onClick={() => {
                          haptic(6);
                          setGuests((g) => Math.min(10, g + 1));
                        }}
                        className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/25 text-wine-700 transition-colors hover:border-wine-700/50 disabled:opacity-35"
                        disabled={guests >= 10}
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>

                  {/* Live automatic seat preview when attending */}
                  {attendance === "attending" && (
                    <div className="flex items-center justify-between rounded-xl border border-sage-600/30 bg-sage-100/65 px-3.5 py-2.5 text-left">
                      <span className="flex items-center gap-2 font-sans text-[11px] text-sage-900">
                        <Armchair className="h-4 w-4 shrink-0 text-sage-700" strokeWidth={1.6} />
                        {lang === "bn" ? "স্বয়ংক্রিয় আসন বরাদ্দ:" : "Auto-assigned seating:"}
                      </span>
                      <span className="font-display text-[15px] font-semibold text-wine-800">
                        {formatTableByLang(previewTable, lang)} /{" "}
                        {formatSeatsByLang(previewStart, previewEnd, guests, lang)}
                      </span>
                    </div>
                  )}

                  {/* Attendance Confirmation */}
                  <div className="text-left">
                    <span className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-soft/75">
                      {wedding.ui.attendanceLabel[lang]}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-wine-700/20 bg-ivory-50 p-1">
                      {(["attending", "declined"] as Attendance[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            haptic(6);
                            setAttendance(value);
                          }}
                          className={`relative rounded-lg px-3 py-2.5 font-sans text-[11px] transition-colors ${
                            attendance === value ? "text-ivory-50" : "text-ink-soft/75"
                          }`}
                        >
                          {attendance === value && (
                            <motion.span
                              layoutId="reservation-attendance-pill"
                              className="absolute inset-0 rounded-lg bg-wine-700"
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                          <span className="relative z-10">
                            {value === "attending"
                              ? wedding.ui.attendingOption[lang]
                              : wedding.ui.declinedOption[lang]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div className="text-left">
                    <label
                      htmlFor="res-message"
                      className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.24em] text-ink-soft/75"
                    >
                      {wedding.ui.messageLabel[lang]}
                    </label>
                    <textarea
                      id="res-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      maxLength={500}
                      placeholder={wedding.ui.messagePlaceholder[lang]}
                      className={`${inputClass} resize-none leading-relaxed`}
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg border border-wine-600/30 bg-wine-600/10 px-3 py-2 text-left font-sans text-[12px] text-wine-700">
                      {error}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileTap={{ scale: 0.97 }}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ivory-50 shadow-[0_18px_40px_-22px_rgba(64,9,18,1)] disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                    ) : (
                      <Send className="h-4 w-4" strokeWidth={1.6} />
                    )}
                    {wedding.ui.submitReservationBtn[lang]}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
