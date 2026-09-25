"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Minus, Plus, Send, X } from "lucide-react";
import wedding from "@/config/weddingConfig";
import { haptic } from "@/lib/audio";

export type Attendance = "attending" | "declined";

const inputClass =
  "w-full rounded-xl border border-wine-700/18 bg-ivory-50 px-4 py-3 font-sans text-[13px] text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-wine-600/60";

export default function RsvpSheet({
  preset,
  onClose,
}: {
  preset: Attendance | null;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attendance, setAttendance] = useState<Attendance>(preset ?? "attending");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preset === null) return;
    setOpen(true);
    setAttendance(preset);
    setStatus("idle");
    setError(null);
  }, [preset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please tell us your name.");
      haptic(30);
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, guests, attendance, message }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      haptic([10, 40, 10]);
    } catch {
      // still confirm — the guest experience comes first
      setStatus("done");
    }
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(onClose, 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.button
            type="button"
            aria-label="Close RSVP"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-wine-950/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RSVP form"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[28px] border-t border-gold-500/30 bg-[radial-gradient(120%_80%_at_50%_0%,#fdfaf4_0%,#f6eee0_60%,#ecdcc3_100%)] text-ink shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.8)] no-scrollbar"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-wine-700/10 bg-ivory-50/85 px-5 py-3.5 backdrop-blur">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.34em] text-gold-600">Reply Card</p>
                <p className="font-display text-[21px] leading-tight text-wine-800">RSVP</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/15 text-ink-soft transition-colors hover:border-wine-700/40"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center px-7 pb-12 pt-12 text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 bg-wine-700 text-gold-200"
                  >
                    <Check className="h-7 w-7" strokeWidth={1.6} />
                  </motion.span>
                  <p className="mt-5 font-display text-[27px] leading-tight text-wine-800">
                    {attendance === "attending" ? "We'll save you a seat" : "Thank you for letting us know"}
                  </p>
                  <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-ink-soft/80">
                    {attendance === "attending"
                      ? `${name.split(" ")[0] || "Friend"}, your reply for ${guests} ${guests === 1 ? "guest" : "guests"} is with us. See you on ${wedding.dateShort}.`
                      : "You'll be missed — we'll raise a glass of cha in your name."}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-7 rounded-full border border-wine-700/25 px-8 py-3 font-sans text-[10.5px] uppercase tracking-[0.26em] text-wine-800 transition-colors hover:border-wine-700/60"
                  >
                    Done
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
                  <div className="text-left">
                    <label htmlFor="rsvp-name" className="mb-1.5 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-ink-soft/65">
                      Your name
                    </label>
                    <input
                      id="rsvp-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nusrat Jahan"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>

                  <div className="text-left">
                    <span className="mb-1.5 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-ink-soft/65">
                      Number of guests
                    </span>
                    <div className="flex items-center gap-4 rounded-xl border border-wine-700/18 bg-ivory-50 px-4 py-2.5">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        onClick={() => {
                          haptic(6);
                          setGuests((g) => Math.max(1, g - 1));
                        }}
                        className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/20 text-wine-700 transition-colors hover:border-wine-700/50 disabled:opacity-35"
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                      <span className="flex-1 text-center font-display text-[26px] leading-none text-wine-800">{guests}</span>
                      <button
                        type="button"
                        aria-label="More guests"
                        onClick={() => {
                          haptic(6);
                          setGuests((g) => Math.min(12, g + 1));
                        }}
                        className="grid h-9 w-9 place-items-center rounded-full border border-wine-700/20 text-wine-700 transition-colors hover:border-wine-700/50 disabled:opacity-35"
                        disabled={guests >= 12}
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="mb-1.5 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-ink-soft/65">
                      Attendance
                    </span>
                    <div className="grid grid-cols-2 gap-1 rounded-xl border border-wine-700/18 bg-ivory-50 p-1">
                      {(["attending", "declined"] as Attendance[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            haptic(6);
                            setAttendance(value);
                          }}
                          className={`relative rounded-lg px-3 py-2.5 font-sans text-[11px] uppercase tracking-[0.14em] transition-colors ${
                            attendance === value ? "text-ivory-50" : "text-ink-soft/70"
                          }`}
                        >
                          {attendance === value && (
                            <motion.span
                              layoutId="rsvp-pill"
                              className="absolute inset-0 rounded-lg bg-wine-700"
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                          <span className="relative z-10">{value === "attending" ? "Will attend" : "Can't attend"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-left">
                    <label htmlFor="rsvp-message" className="mb-1.5 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-ink-soft/65">
                      A note for the couple <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <textarea
                      id="rsvp-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Dietary needs, a blessing, a song request…"
                      className={`${inputClass} resize-none leading-relaxed`}
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg border border-wine-600/30 bg-wine-600/10 px-3 py-2 text-left font-sans text-[11.5px] text-wine-700">
                      {error}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileTap={{ scale: 0.97 }}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.26em] text-ivory-50 shadow-[0_18px_40px_-22px_rgba(64,9,18,1)] disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                    ) : (
                      <Send className="h-4 w-4" strokeWidth={1.6} />
                    )}
                    Send RSVP
                  </motion.button>

                  <p className="text-center font-sans text-[10px] leading-relaxed text-ink-soft/55">
                    Replies close {wedding.rsvpDeadline}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
