import type { CSSProperties } from "react";

type Petal = {
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: string;
  spin: string;
  opacity: number;
  hue: string;
};

const PETALS: Petal[] = [
  { left: "8%", size: 11, duration: 17, delay: 0, drift: "42px", spin: "320deg", opacity: 0.5, hue: "#8c1b2c" },
  { left: "23%", size: 7, duration: 23, delay: 4, drift: "-30px", spin: "-260deg", opacity: 0.35, hue: "#c2a05f" },
  { left: "38%", size: 13, duration: 20, delay: 9, drift: "56px", spin: "400deg", opacity: 0.28, hue: "#a52a3c" },
  { left: "55%", size: 6, duration: 26, delay: 2, drift: "-44px", spin: "300deg", opacity: 0.45, hue: "#e4cfa3" },
  { left: "68%", size: 10, duration: 19, delay: 12, drift: "34px", spin: "-340deg", opacity: 0.38, hue: "#8c1b2c" },
  { left: "82%", size: 8, duration: 24, delay: 6, drift: "-52px", spin: "280deg", opacity: 0.3, hue: "#c2a05f" },
  { left: "93%", size: 12, duration: 21, delay: 15, drift: "-28px", spin: "360deg", opacity: 0.24, hue: "#a52a3c" },
];

const DUST = [
  { left: "14%", top: "22%", size: 3, delay: 0 },
  { left: "72%", top: "14%", size: 2, delay: 1.4 },
  { left: "44%", top: "62%", size: 2.5, delay: 2.6 },
  { left: "88%", top: "48%", size: 2, delay: 0.8 },
  { left: "26%", top: "78%", size: 3, delay: 3.4 },
  { left: "60%", top: "88%", size: 2, delay: 2.1 },
];

/**
 * Cheap GPU-friendly ambience: falling petals + drifting gold dust.
 * Pure CSS animation so it never competes with the section transitions.
 */
export default function Petals({ intensity = 1 }: { intensity?: number }) {
  const petals = PETALS.slice(0, Math.max(3, Math.round(PETALS.length * intensity)));

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              opacity: p.opacity,
              animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
              "--drift": p.drift,
              "--spin": p.spin,
              willChange: "transform, opacity",
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 26" className="h-full w-full" style={{ color: p.hue }}>
            <path
              d="M10 0c6 5 9 10 9 15a9 9 0 1 1-18 0C1 10 4 5 10 0Z"
              fill="currentColor"
              opacity="0.85"
            />
            <path d="M10 3v18" stroke="#fdfaf4" strokeOpacity="0.25" strokeWidth="0.6" />
          </svg>
        </span>
      ))}

      {DUST.map((d, i) => (
        <span
          key={`d-${i}`}
          className="absolute rounded-full bg-gold-300"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            opacity: 0.45,
            filter: "blur(0.4px)",
            animation: `floatSlow ${11 + i * 1.7}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
