import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** tiny classname helper */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Smoothly crossfades text when `lang` switches between 'bn' and 'en'
 * while preserving scroll position and layout stability.
 */
export function BilingualText({
  lang,
  children,
  className = "",
  as: Tag = "span",
}: {
  lang: string;
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4";
}) {
  const MotionTag = motion[Tag];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionTag
        key={lang}
        initial={{ opacity: 0, y: 3, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -3, filter: "blur(2px)" }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </MotionTag>
    </AnimatePresence>
  );
}

/* ───────────────────── Bangladeshi Alpana & Islamic Ornaments ───────────────────── */

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center justify-center gap-2.5", className)} aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent via-gold-500/55 to-sage-600/50 sm:w-20" />
      <svg width="42" height="16" viewBox="0 0 42 16" fill="none" className="shrink-0 text-gold-500">
        <path d="M21 1.5 25 8 21 14.5 17 8 21 1.5Z" stroke="currentColor" strokeWidth="0.75" />
        <path d="M21 4.2 23.2 8 21 11.8 18.8 8 21 4.2Z" fill="currentColor" fillOpacity="0.28" />
        <circle cx="12" cy="8" r="1.4" fill="#3d6957" />
        <circle cx="30" cy="8" r="1.4" fill="#3d6957" />
        <path d="M9 8H1M41 8h-8" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent via-gold-500/55 to-sage-600/50 sm:w-20" />
    </div>
  );
}

export function Filigree({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={cn("text-gold-500/50", flip && "-scale-x-100", className)}
    >
      <path
        d="M2 2c26 4 44 16 54 36 5 10 6 21 4 32M2 2c22 12 34 30 38 54M56 38c14 2 24 10 30 22 4 8 5 16 4 24M56 38c10 12 14 26 13 40M92 60c12 2 20 10 24 22"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path d="M96 34c6-8 14-12 22-12-2 10-8 17-16 19-3 1-5-3-6-7Z" stroke="#3d6957" strokeWidth="0.75" />
      <path d="M20 78c-2 10 2 19 10 24 3-9 1-18-5-23-2-1-4-1-5-1Z" stroke="#3d6957" strokeWidth="0.75" />
      <circle cx="56" cy="38" r="1.7" fill="currentColor" />
      <circle cx="92" cy="60" r="1.4" fill="#3d6957" />
    </svg>
  );
}

/**
 * Bangladeshi Alpana & Shapla (Water Lily) Lotus Medallion with 8-pointed geometric center
 */
export function AlpanaCrest({ className = "", size = 76 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={cn("text-gold-600", className)}
    >
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" />
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="60" cy="60" r="38" stroke="#3d6957" strokeOpacity="0.55" strokeWidth="0.6" />
      {/* 8-pointed Rub el Hizb geometric star */}
      <rect
        x="38"
        y="38"
        width="44"
        height="44"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="currentColor"
        fillOpacity="0.05"
      />
      <rect
        x="38"
        y="38"
        width="44"
        height="44"
        transform="rotate(45 60 60)"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="#3d6957"
        fillOpacity="0.06"
      />
      {/* Bengali Alpana lotus petals */}
      <path
        d="M60 16c5 9 5 16 0 22-5-6-5-13 0-22ZM60 104c5-9 5-16 0-22-5 6-5 13 0 22ZM16 60c9 5 16 5 22 0-6-5-13-5-22 0ZM104 60c-9 5-16 5-22 0 6-5 13-5 22 0Z"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <circle cx="60" cy="60" r="6" stroke="currentColor" strokeWidth="0.8" fill="#6e1220" fillOpacity="0.2" />
      <circle cx="60" cy="60" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Bangladeshi Floral Mihrab Arch Border for Quranic Verses
 */
export function MihrabArch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 44" fill="none" aria-hidden className={cn("w-full max-w-[250px] text-gold-600/75", className)}>
      <path
        d="M4 42 C4 24, 52 22, 92 14 C112 10, 124 4, 130 2 C136 4, 148 10, 168 14 C208 22, 256 24, 256 42"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path
        d="M16 42 C16 28, 60 26, 96 18 C114 14, 125 9, 130 6 C135 9, 146 14, 164 18 C200 26, 244 28, 244 42"
        stroke="#3d6957"
        strokeOpacity="0.55"
        strokeWidth="0.65"
        strokeDasharray="2 2.5"
      />
      <circle cx="130" cy="2" r="2" fill="currentColor" />
      <circle cx="72" cy="22" r="1.5" fill="#3d6957" />
      <circle cx="188" cy="22" r="1.5" fill="#3d6957" />
    </svg>
  );
}

/** Monogram crest with Alpana & geometric ring */
export function Monogram({
  children,
  size = 96,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" fill="none" aria-hidden className="absolute inset-0 h-full w-full text-gold-500/75">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="60" cy="60" r="43" stroke="#3d6957" strokeOpacity="0.65" strokeWidth="0.55" strokeDasharray="1.5 3.5" />
        <circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="0.45" />
        <path
          d="M60 9c4 6 4 12 0 18-4-6-4-12 0-18ZM60 111c4-6 4-12 0-18-4 6-4 12 0 18ZM9 60c6 4 12 4 18 0-6-4-12-4-18 0ZM111 60c-6 4-12 4-18 0 6-4 12-4 18 0Z"
          fill="currentColor"
          opacity="0.78"
        />
      </svg>
      <span className="font-display tracking-[0.12em] text-current" style={{ fontSize: size * 0.22 }}>
        {children}
      </span>
    </div>
  );
}
