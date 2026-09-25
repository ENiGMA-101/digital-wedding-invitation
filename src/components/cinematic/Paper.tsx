"use client";

import { motion, type MotionValue } from "framer-motion";
import wedding from "@/config/weddingConfig";
import { BilingualText, Filigree, Monogram } from "@/components/ui/Primitives";
import type { Attendance, ConfirmedReservation } from "@/components/invitation/ReservationSheet";
import { flapHeightOf, usePaper, usePaperY } from "./engine";
import {
  VerseOpening,
  VerseQuran,
  VerseFamilyBlessing,
  VerseCoupleNames,
  VerseParents,
  VerseDate,
  VerseCeremonyDetails,
  VerseBangladeshiEvent,
  VerseVenue,
  VerseGallery,
  VerseReservation,
  VerseSeatAllocation,
  VerseFinale,
  type LiveSummary,
} from "./verses";

export type PaperActions = {
  onOpenGallery: (index: number) => void;
  onReserve: (preset: Attendance) => void;
  onReplay: () => void;
};

export default function Paper({
  tilt,
  paperRef,
  phase,
  actions,
  confirmedReservation,
  summary,
}: {
  tilt: MotionValue<number>;
  paperRef: React.RefObject<HTMLDivElement | null>;
  phase: "blank" | "opening" | "ready";
  actions: PaperActions;
  confirmedReservation: ConfirmedReservation | null;
  summary: LiveSummary | null;
}) {
  const { size, lang } = usePaper();
  const frameH = size.frameH || 844;
  const flapH = flapHeightOf(frameH);
  const paperY = usePaperY();

  const open = phase !== "blank";

  const holudEvent = wedding.events.find((e) => e.id === "holud") ?? wedding.events[0];
  const mehendiEvent = wedding.events.find((e) => e.id === "mehendi") ?? wedding.events[1];
  const weddingEvent = wedding.events.find((e) => e.id === "wedding") ?? wedding.events[2];
  const receptionEvent = wedding.events.find((e) => e.id === "reception") ?? wedding.events[3];

  return (
    <div className="absolute inset-0" style={{ perspective: 1500 }}>
      {/* Outer 3D card rise & scale when user taps */}
      <motion.div
        className="absolute inset-x-0 top-0"
        initial={{ opacity: 0, scale: 0.68, y: frameH * 0.22, rotateX: -14 }}
        animate={
          open
            ? { opacity: 1, scale: 1, y: 0, rotateX: 0 }
            : { opacity: 0, scale: 0.68, y: frameH * 0.22, rotateX: -14 }
        }
        transition={{ type: "spring", stiffness: 92, damping: 17, mass: 0.9 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Scroll-translated long letterpress column */}
        <motion.div style={{ y: paperY, rotateX: tilt }} className="will-change-transform">
          <div className="relative mx-auto w-[calc(100%-20px)] max-w-[404px]">
            {/* ── Physical Bangladeshi Wedding Card ── */}
            <div className="relative rounded-[22px] border border-gold-600/35 bg-[linear-gradient(178deg,#fdfaf3_0%,#f8f0e1_46%,#f3e6cf_100%)] shadow-[0_2px_0_rgba(255,255,255,0.65)_inset,0_50px_90px_-36px_rgba(36,5,10,0.72),0_18px_36px_-24px_rgba(36,5,10,0.55)]">
              <div className="paper-grain pointer-events-none absolute inset-0 rounded-[22px] opacity-55" />

              {/* Traditional Bangladeshi Double Hairline & Muted Green Inner Frame */}
              <div className="pointer-events-none absolute inset-[9px] rounded-[15px] border border-gold-600/30" />
              <div className="pointer-events-none absolute inset-[13px] rounded-[12px] border border-sage-600/20" />

              {/* Engraved Corner Filigrees */}
              <Filigree className="pointer-events-none absolute left-2.5 top-2.5 h-14 w-14 text-gold-600/55" />
              <Filigree className="pointer-events-none absolute right-2.5 top-2.5 h-14 w-14 text-gold-600/55" flip />

              {/* ── 16 Scroll-Revealed Chapters ── */}
              <div
                ref={paperRef}
                className="relative flex flex-col px-6"
                style={{ paddingTop: flapH + 28, paddingBottom: frameH * 0.48 }}
              >
                {/* 1. Opening invitation */}
                <VerseOpening />

                {/* 2. Quranic introduction */}
                <VerseQuran />

                {/* 3. "With the blessings of our families..." */}
                <VerseFamilyBlessing />

                {/* 4. Bride and Groom names */}
                <VerseCoupleNames />

                {/* 5. Parents' names */}
                <VerseParents />

                {/* 6. Wedding date */}
                <VerseDate />

                {/* 7. Wedding ceremony details */}
                <VerseCeremonyDetails />

                {/* 8. Gaye Holud */}
                <VerseBangladeshiEvent event={holudEvent} showSectionIntro />

                {/* 9. Mehendi */}
                <VerseBangladeshiEvent event={mehendiEvent} />

                {/* 10. Wedding / Akd */}
                <VerseBangladeshiEvent event={weddingEvent} />

                {/* 11. Reception */}
                <VerseBangladeshiEvent event={receptionEvent} />

                {/* 12. Venue information */}
                <VerseVenue />

                {/* 13. Wedding gallery */}
                <VerseGallery onOpenImage={actions.onOpenGallery} />

                {/* 14. Reservation */}
                <VerseReservation onReserve={actions.onReserve} />

                {/* 15. Guest seat allocation */}
                <VerseSeatAllocation
                  confirmedReservation={confirmedReservation}
                  summary={summary}
                  onOpenReservation={() => actions.onReserve("attending")}
                />

                {/* 16. Final blessing / message */}
                <VerseFinale
                  onReplay={actions.onReplay}
                  onOpenReservation={() => actions.onReserve("attending")}
                />
              </div>

              {/* Top crease shadow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 rounded-t-[22px] bg-[linear-gradient(180deg,rgba(110,18,32,0.12),transparent)]" />

              {/* ══════════════ THE 3D ENVELOPE FLAP ══════════════ */}
              <div className="absolute inset-x-0 top-0 z-30" style={{ perspective: 1100 }}>
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: phase === "blank" ? 0 : -167 }}
                  transition={{
                    delay: phase === "opening" ? 0.55 : 0.2,
                    duration: 1.25,
                    ease: [0.72, 0, 0.2, 1],
                  }}
                  className="relative will-change-transform"
                  style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d", height: flapH }}
                >
                  {/* Front face (visible while closed) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-t-[22px] border-b border-gold-600/30 bg-[linear-gradient(150deg,#f8f0e0_0%,#f3e6cf_55%,#ecdcc0_100%)] shadow-[0_24px_36px_-18px_rgba(36,5,10,0.4)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="paper-grain absolute inset-0 opacity-50" />
                    <div className="absolute inset-[10px] rounded-t-[12px] border border-gold-600/30" />
                    <div className="absolute left-0 right-0 top-[46%] flex -translate-y-1/2 flex-col items-center gap-2.5">
                      <Monogram size={80} className="text-gold-600">
                        {wedding.monogram[lang]}
                      </Monogram>
                      <BilingualText
                        lang={lang}
                        as="p"
                        className="font-sans text-[9px] uppercase tracking-[0.34em] text-sage-800/80"
                      >
                        {wedding.ui.sacredInvitationKicker[lang]}
                      </BilingualText>
                      <div className="flex items-center gap-2">
                        <span className="h-px w-10 bg-gold-600/40" />
                        <BilingualText
                          lang={lang}
                          className="font-display text-[13px] italic tracking-[0.12em] text-wine-700"
                        >
                          {wedding.hashtag[lang]}
                        </BilingualText>
                        <span className="h-px w-10 bg-gold-600/40" />
                      </div>
                    </div>

                    {/* Burgundy & Gold Wax Seal */}
                    <div className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_30%,#8c1b2c,#520e1a_60%,#24050a)] shadow-[0_8px_18px_-6px_rgba(36,5,10,0.75)] ring-1 ring-gold-300/30">
                        <span className="font-display text-[11px] tracking-[0.1em] text-gold-200">
                          {wedding.monogram[lang]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inside face (revealed once the flap swings open) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-t-[22px] bg-[linear-gradient(0deg,#fbf5e8_0%,#f6ecd9_70%,#f1e3c9_100%)] shadow-[0_-18px_30px_-24px_rgba(36,5,10,0.4)_inset]"
                    style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
                  >
                    <div className="paper-grain absolute inset-0 opacity-45" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.16]">
                      <Monogram size={68} className="text-wine-700">
                        {wedding.monogram[lang]}
                      </Monogram>
                    </div>
                    <div className="absolute inset-x-8 top-[52%] h-px bg-gold-600/25" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
