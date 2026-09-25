"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import wedding, { type Lang } from "@/config/weddingConfig";
import { BilingualText } from "@/components/ui/Primitives";
import Petals from "@/components/ui/Petals";
import MusicToggle from "@/components/ui/MusicToggle";
import { haptic } from "@/lib/audio";

/**
 * Floating `বাংলা | ENG` Language Switcher.
 * Works at any point without reloading or losing scroll position.
 */
export function LanguageToggle({
  lang,
  onChange,
  onBlankScreen = false,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
  onBlankScreen?: boolean;
}) {
  return (
    <div
      className="fixed left-4 top-[calc(env(safe-area-inset-top)+14px)] z-[82] flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        role="group"
        aria-label="Language selector"
        className={`inline-flex items-center rounded-full border p-0.5 backdrop-blur-md transition-colors duration-500 ${
          onBlankScreen
            ? "border-wine-800/20 bg-ivory-50/80 text-wine-800 shadow-sm"
            : "border-gold-500/35 bg-wine-950/75 text-gold-200 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.9)]"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (lang !== "bn") {
              haptic(8);
              onChange("bn");
            }
          }}
          aria-pressed={lang === "bn"}
          className={`relative rounded-full px-3 py-1 font-sans text-[11px] font-medium tracking-wide transition-colors ${
            lang === "bn"
              ? onBlankScreen
                ? "bg-wine-800 text-ivory-50"
                : "bg-gold-500 text-wine-950"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          বাংলা
        </button>
        <span
          className={`px-0.5 text-[10px] ${
            onBlankScreen ? "text-wine-800/30" : "text-gold-300/35"
          }`}
          aria-hidden
        >
          |
        </span>
        <button
          type="button"
          onClick={() => {
            if (lang !== "en") {
              haptic(8);
              onChange("en");
            }
          }}
          aria-pressed={lang === "en"}
          className={`relative rounded-full px-3 py-1 font-sans text-[10.5px] font-medium tracking-[0.14em] transition-colors ${
            lang === "en"
              ? onBlankScreen
                ? "bg-wine-800 text-ivory-50"
                : "bg-gold-500 text-wine-950"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          ENG
        </button>
      </div>
    </div>
  );
}

/** Desktop side plaques + deep burgundy & muted green stage around the portrait invitation */
export function StageBackdrop({
  lang,
  revealed,
}: {
  lang: Lang;
  revealed: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#390811_0%,#1f0409_48%,#120205_100%)]" />
      {/* Subtle Jamdani & Islamic geometric lattice */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(194,160,95,0.3) 0 1px, transparent 1px 88px), repeating-linear-gradient(0deg, rgba(61,105,87,0.22) 0 1px, transparent 1px 88px)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,160,95,0.13),transparent_62%)] blur-2xl" />
      <div className="paper-grain absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_35%,rgba(9,2,4,0.85)_100%)]" />

      {revealed && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute left-10 top-1/2 hidden max-w-[260px] -translate-y-1/2 flex-col gap-3.5 lg:flex"
          >
            <span className="h-px w-16 bg-gold-500/50" />
            <BilingualText
              lang={lang}
              as="p"
              className="font-sans text-[9.5px] uppercase tracking-[0.34em] text-gold-300/80"
            >
              {wedding.ui.sacredInvitationKicker[lang]}
            </BilingualText>
            <div className="font-display text-[30px] font-light leading-[1.15] text-ivory-100">
              <BilingualText lang={lang} as="p">
                {wedding.brideName[lang]}
              </BilingualText>
              <span className="my-1 block font-display text-[20px] italic text-gold-300">
                {wedding.ui.andConnector[lang]}
              </span>
              <BilingualText lang={lang} as="p">
                {wedding.groomName[lang]}
              </BilingualText>
            </div>
            <BilingualText
              lang={lang}
              as="p"
              className="font-display text-[16px] tracking-[0.12em] text-ivory-200/80"
            >
              {wedding.dateDisplay[lang]}
            </BilingualText>
            <BilingualText
              lang={lang}
              as="p"
              className="font-sans text-[10px] tracking-[0.2em] text-gold-400/75"
            >
              {wedding.hashtag[lang]}
            </BilingualText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute right-10 top-1/2 hidden max-w-[240px] -translate-y-1/2 flex-col items-end gap-3 text-right xl:flex"
          >
            <BilingualText
              lang={lang}
              as="p"
              className="font-sans text-[9.5px] uppercase tracking-[0.34em] text-gold-300/80"
            >
              {wedding.venue[lang]}
            </BilingualText>
            <BilingualText
              lang={lang}
              as="p"
              className="font-display text-[20px] italic leading-snug text-ivory-100/90"
            >
              {wedding.ui.scrollToUnfold[lang]}
            </BilingualText>
            <span className="mt-1 h-px w-16 bg-gold-500/40" />
            <BilingualText
              lang={lang}
              as="p"
              className="font-sans text-[10px] tracking-[0.2em] text-ivory-200/45"
            >
              {wedding.venueLine2[lang]} · {wedding.address[lang][0]}
            </BilingualText>
          </motion.div>
        </>
      )}
    </div>
  );
}

/** Hairline progress track along the frame's right edge */
export function ProgressSpine({ p, visible }: { p: MotionValue<number>; visible: boolean }) {
  const dotTop = useTransform(p, (v) => `${(Math.min(1, Math.max(0, v)) * 100).toFixed(2)}%`);
  return (
    <motion.div
      className="pointer-events-none absolute right-[7px] top-1/2 z-40 h-[38vh] w-px -translate-y-1/2 bg-ivory-200/15"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      aria-hidden
    >
      <motion.span
        className="block h-full w-px origin-top bg-gradient-to-b from-gold-300 via-gold-500 to-sage-500"
        style={{ scaleY: p }}
      />
      <motion.span
        className="absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold-300/80 bg-wine-900"
        style={{ top: dotTop }}
      />
    </motion.div>
  );
}

/** Bottom scroll hint shown until the guest scrolls */
export function ScrollHint({
  p,
  lang,
  visible,
}: {
  p: MotionValue<number>;
  lang: Lang;
  visible: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.015 && !hidden) setHidden(true);
    else if (v <= 0.002 && hidden) setHidden(false);
  });

  const show = visible && !hidden;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="hint"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+18px)] left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full border border-gold-500/30 bg-wine-950/75 px-4 py-2 backdrop-blur-md"
        >
          <BilingualText
            lang={lang}
            className="font-sans text-[10px] tracking-[0.18em] text-ivory-100/90"
          >
            {wedding.ui.scrollToUnfold[lang]}
          </BilingualText>
          <motion.span
            animate={{ y: [0, 4, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.5} />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Ambience({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.4 }}
      style={{ pointerEvents: "none" }}
    >
      <Petals intensity={0.85} />
    </motion.div>
  );
}

export function Music({ visible }: { visible: boolean }) {
  return <MusicToggle revealed={visible} />;
}
