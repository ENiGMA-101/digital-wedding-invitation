"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import type { Lang } from "@/config/weddingConfig";

/* ════════════════════════════════════════════════════════════════
   The Scroll-Driven Paper Engine
   ----------------------------------------------------------------
   · A long physical "paper" card sits inside a sticky viewport stage.
   · Global scroll progress (0 → 1) moves the paper upward.
   · Every verse on the paper measures its own position relative to
     the paper root and derives the exact scroll anchors at which it
     enters and settles into view.
   ════════════════════════════════════════════════════════════════ */

export type PaperMetrics = {
  ready: boolean;
  frameH: number;
  paperH: number;
  startY: number;
  endY: number;
  travel: number;
};

const INITIAL: PaperMetrics = {
  ready: false,
  frameH: 0,
  paperH: 0,
  startY: 0,
  endY: 0,
  travel: 1,
};

function topWithin(el: HTMLElement | null, root: HTMLElement | null): number {
  let top = 0;
  let node: HTMLElement | null = el;
  let guard = 0;
  while (node && node !== root && guard++ < 50) {
    top += node.offsetTop;
    node = (node.offsetParent as HTMLElement | null) ?? null;
  }
  return top;
}

type PaperCtx = {
  p: MotionValue<number>;
  lang: Lang;
  metrics: MutableRefObject<PaperMetrics>;
  root: RefObject<HTMLElement | null>;
  size: { frameH: number; paperH: number; ready: boolean };
};

const Ctx = createContext<PaperCtx | null>(null);

export function usePaper() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("paper context is missing");
  return ctx;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const flapHeightOf = (frameH: number) => Math.min(Math.max(frameH * 0.31, 232), 308);

export function anchorsFor(
  elTop: number,
  metrics: PaperMetrics,
  entryFrac = 0.93,
  exitFrac = 0.62,
): readonly [number, number] {
  if (!metrics.ready) return [2, 2.001];
  const entry = (entryFrac * metrics.frameH - metrics.startY - elTop) / metrics.travel;
  const exit = (exitFrac * metrics.frameH - metrics.startY - elTop) / metrics.travel;
  return entry <= exit ? [entry, exit] : [exit, entry];
}

export function PaperProvider({
  p,
  lang,
  frameRef,
  paperRef,
  children,
}: {
  p: MotionValue<number>;
  lang: Lang;
  frameRef: RefObject<HTMLElement | null>;
  paperRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const metrics = useRef<PaperMetrics>(INITIAL);
  const [size, setSize] = useState({ frameH: 0, paperH: 0, ready: false });

  useEffect(() => {
    const frame = frameRef.current;
    const paper = paperRef.current;
    if (!frame || !paper) return;

    const read = () => {
      const frameH = frame.clientHeight;
      const paperH = paper.scrollHeight;
      const startY = frameH * 0.135;
      const endY = -(paperH - frameH * 0.56);
      const ready = frameH > 120 && paperH > 600;
      metrics.current = { ready, frameH, paperH, startY, endY, travel: endY - startY };
      setSize((s) =>
        Math.abs(s.frameH - frameH) > 0.5 ||
        Math.abs(s.paperH - paperH) > 1 ||
        s.ready !== ready
          ? { frameH, paperH, ready }
          : s,
      );
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(frame);
    ro.observe(paper);
    window.addEventListener("resize", read);

    let alive = true;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(() => alive && read());
    }

    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", read);
    };
  }, [frameRef, paperRef, lang]);

  const value = useMemo(
    () => ({ p, lang, metrics, root: paperRef, size }),
    [p, lang, paperRef, size],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ────────────────────────── Scroll-Driven RevealItem ────────────────────────── */

type Variant = "mask" | "rise" | "bloom" | "cliptop";

export function RevealItem({
  children,
  className = "",
  style,
  variant = "mask",
  entry = 0.93,
  exit = 0.62,
  blur = false,
  distance = 24,
  bleedX = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: Variant;
  entry?: number;
  exit?: number;
  blur?: boolean;
  distance?: number;
  bleedX?: number;
}) {
  const { p, metrics, root, size, lang } = usePaper();
  const el = useRef<HTMLDivElement | null>(null);
  const top = useRef(0);

  useLayoutEffect(() => {
    top.current = topWithin(el.current, root.current);
  }, [root, size, lang]);

  const k = useTransform(p, (v: number) => {
    const [s, e] = anchorsFor(top.current, metrics.current, entry, exit);
    const denom = Math.max(e - s, 1e-6);
    return clamp01((v - s) / denom);
  });

  const clipPath = useTransform(k, (t) =>
    variant === "cliptop"
      ? `inset(0 0 0 ${(1 - t) * 100}%)`
      : `inset(-6px ${-bleedX}px ${(1 - t) * 102}% ${-bleedX}px)`,
  );
  const y = useTransform(k, (t) => (variant === "mask" || variant === "rise" ? (1 - t) * distance : 0));
  const scale = useTransform(k, (t) => (variant === "bloom" ? 0.58 + 0.42 * t : 1));
  const opacity = useTransform(k, (t) => Math.pow(t, 0.65));
  const filterAll = useTransform(k, (t) => `blur(${((1 - t) * 7).toFixed(2)}px)`);
  const filter = blur ? filterAll : undefined;

  const withClip = variant === "mask" || variant === "cliptop";

  return (
    <motion.div
      ref={el}
      className={className}
      style={{
        ...style,
        willChange: "transform, opacity, clip-path, filter",
        clipPath: withClip ? clipPath : undefined,
        y,
        scale,
        opacity,
        filter,
        transformOrigin: variant === "bloom" ? "50% 55%" : "50% 0%",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── Word / Token Uncovering (Safe for Bangla & English) ─────────────── */

function Token({
  token,
  index,
  total,
  span,
  className = "",
}: {
  token: string;
  index: number;
  total: number;
  span: RefObject<readonly [number, number]>;
  className?: string;
}) {
  const { p } = usePaper();
  const y = useTransform(p, (v) => {
    const [s, e] = span.current;
    const window_ = e - s;
    const start = s + (index / Math.max(total, 1)) * window_ * 0.48;
    const end = start + window_ * 0.52;
    const k = clamp01((v - start) / Math.max(end - start, 1e-6));
    return `${((1 - k) * 108).toFixed(2)}%`;
  });
  const opacity = useTransform(p, (v) => {
    const [s, e] = span.current;
    const window_ = e - s;
    const start = s + (index / Math.max(total, 1)) * window_ * 0.48;
    const k = clamp01((v - start) / Math.max(window_ * 0.52, 1e-6));
    return Math.min(1, k * 1.65);
  });

  return (
    <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-baseline">
      <motion.span
        className={`inline-block will-change-transform ${className}`}
        style={{ y, opacity }}
      >
        {token}
      </motion.span>
    </span>
  );
}

export function RevealWord({
  text,
  className = "",
  entry = 0.93,
  exit = 0.62,
  classNameLetter = "",
}: {
  text: string;
  className?: string;
  entry?: number;
  exit?: number;
  classNameLetter?: string;
}) {
  const { p, metrics, root, size, lang } = usePaper();
  const el = useRef<HTMLSpanElement | null>(null);
  const span = useRef<readonly [number, number]>([2, 2.001]);

  useLayoutEffect(() => {
    const elTop = topWithin(el.current, root.current);
    span.current = anchorsFor(elTop, metrics.current, entry, exit);
  }, [metrics, root, entry, exit, size, lang]);

  // Split by words so Bengali matras/conjuncts never break and multi-word names wrap gracefully
  const words = text.trim().split(/\s+/);

  return (
    <span ref={el} className={`inline-block ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${lang}-${text}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.26em] gap-y-1"
          aria-label={text}
        >
          {words.map((word, i) => (
            <Token
              key={`${word}-${i}`}
              token={word}
              index={i}
              total={words.length}
              span={span}
              className={classNameLetter}
            />
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** A decorative line that draws itself in as its position is reached */
export function DrawnLine({
  className = "",
  entry = 0.91,
  exit = 0.64,
  style,
}: {
  className?: string;
  entry?: number;
  exit?: number;
  style?: React.CSSProperties;
}) {
  const { p, metrics, size, root, lang } = usePaper();
  const el = useRef<HTMLSpanElement | null>(null);
  const scaleX = useTransform(p, (v) => {
    const [s, e] = anchorsFor(topWithin(el.current, root.current), metrics.current, entry, exit);
    return clamp01((v - s) / Math.max(e - s, 1e-6));
  });
  useLayoutEffect(() => undefined, [size, lang]);

  return (
    <motion.span
      ref={el}
      className={`block origin-center will-change-transform ${className}`}
      style={{ scaleX, ...style }}
    />
  );
}

/* ─────────────── Paper translation driven by scroll ─────────────── */

export function usePaperY() {
  const { p, metrics, size } = usePaper();
  const fallbackH = size.frameH || 844;
  return useTransform(p, (v) => {
    const m = metrics.current;
    if (!m.ready || m.travel >= -1) return fallbackH * 0.135;
    return m.startY + clamp01(v) * m.travel;
  });
}
