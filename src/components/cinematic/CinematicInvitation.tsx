"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import Paper, { type PaperActions } from "./Paper";
import BlankCover from "./BlankCover";
import {
  Ambience,
  LanguageToggle,
  Music,
  ProgressSpine,
  ScrollHint,
  StageBackdrop,
} from "./Chrome";
import { PaperProvider } from "./engine";
import type { LiveSummary } from "./verses";
import ReservationSheet, {
  type Attendance,
  type ConfirmedReservation,
} from "@/components/invitation/ReservationSheet";
import GalleryLightbox from "@/components/invitation/GalleryLightbox";
import { haptic, isPlaying, playChime, toggleMusic, unlockAudio } from "@/lib/audio";
import wedding, { type Lang } from "@/config/weddingConfig";

const musicSource = (): string | undefined => wedding.musicUrl || undefined;

/**
 * TAP = OPEN · SCROLL = DISCOVER · RESERVATION = CONFIRM SEAT
 * Default language: বাংলা ('bn'), switchable anytime to ENG ('en').
 */
const RUNWAY_VH = 1140;

export default function CinematicInvitation() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const [lang, setLang] = useState<Lang>(wedding.defaultLang);
  const [phase, setPhase] = useState<"blank" | "opening" | "ready">("blank");
  const [reservationPreset, setReservationPreset] = useState<Attendance | null>(null);
  const [confirmedReservation, setConfirmedReservation] =
    useState<ConfirmedReservation | null>(null);
  const [summary, setSummary] = useState<LiveSummary | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const reduced = useReducedMotion();

  /* ── Keep <html lang="..."> in sync without reloading ── */
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  /* ── Fetch live reservation & seat allocation summary from PostgreSQL ── */
  const refreshSummary = useCallback(() => {
    fetch("/api/reservation", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.totalCapacity === "number") {
          setSummary(data as LiveSummary);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  /* ── Scroll position is the timeline ── */
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 165,
    damping: 27,
    mass: 0.34,
    restDelta: 0.0002,
  });
  const p = reduced ? scrollYProgress : smooth;

  /* ── Subtle physical paper tilt with scroll velocity ── */
  const velocity = useVelocity(p);
  const velSpring = useSpring(velocity, { stiffness: 250, damping: 42 });
  const tilt = useTransform(velSpring, [-2.4, 2.4], [2.4, -2.4]);

  /* ── STEP 2 · User taps the blank screen ── */
  const open = useCallback(() => {
    haptic([10, 45, 14]);
    unlockAudio(musicSource());
    playChime();
    setPhase("opening");
    window.setTimeout(() => setPhase("ready"), 1950);
  }, []);

  /* ── Lock scrolling until the physical opening finishes ── */
  useEffect(() => {
    const root = document.documentElement;
    if (phase !== "ready") {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [phase]);

  /* ── Start gentle ambient wedding score after user interaction ── */
  useEffect(() => {
    if (phase !== "ready" || isPlaying()) return;
    const id = window.setTimeout(() => void toggleMusic(musicSource()), 1050);
    return () => window.clearTimeout(id);
  }, [phase]);

  const replay = useCallback(() => {
    setReservationPreset(null);
    setGalleryIndex(null);
    window.scrollTo({ top: 0 });
    setPhase("blank");
  }, []);

  const handleConfirmed = useCallback(
    (res: ConfirmedReservation) => {
      setConfirmedReservation(res);
      refreshSummary();
    },
    [refreshSummary],
  );

  const actions: PaperActions = {
    onOpenGallery: setGalleryIndex,
    onReserve: setReservationPreset,
    onReplay: replay,
  };

  return (
    <main
      ref={runwayRef}
      className="relative bg-[#120205]"
      style={{ height: `${RUNWAY_VH}dvh` }}
    >
      {/* ── The Sticky Invitation Viewport ── */}
      <div ref={frameRef} className="sticky top-0 h-dvh w-full overflow-hidden">
        <StageBackdrop lang={lang} revealed={phase !== "blank"} />

        {/* Language Toggle: বাংলা | ENG */}
        <LanguageToggle
          lang={lang}
          onChange={setLang}
          onBlankScreen={phase === "blank"}
        />

        <PaperProvider p={p} lang={lang} frameRef={frameRef} paperRef={paperRef}>
          <Paper
            tilt={tilt}
            paperRef={paperRef}
            phase={phase}
            actions={actions}
            confirmedReservation={confirmedReservation}
            summary={summary}
          />
        </PaperProvider>

        <Ambience visible={phase === "ready"} />
        <ProgressSpine p={p} visible={phase === "ready"} />
        <ScrollHint p={p} lang={lang} visible={phase === "ready"} />
        <Music visible={phase === "ready"} />

        {/* Wedding Reservation Modal */}
        <ReservationSheet
          preset={phase === "ready" ? reservationPreset : null}
          lang={lang}
          nextTableHint={summary?.nextAvailableTable ?? 3}
          nextSeatHint={summary?.nextAvailableSeat ?? 1}
          onClose={() => setReservationPreset(null)}
          onConfirmed={handleConfirmed}
        />

        {/* Fullscreen Gallery Lightbox */}
        <AnimatePresence>
          {phase === "ready" && galleryIndex !== null && (
            <GalleryLightbox
              key="gallery"
              index={galleryIndex}
              lang={lang}
              onClose={() => setGalleryIndex(null)}
            />
          )}
        </AnimatePresence>

        {/* STEP 1 · Intentionally Blank Screen */}
        <AnimatePresence>
          {phase === "blank" && <BlankCover key="blank" lang={lang} onOpen={open} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
