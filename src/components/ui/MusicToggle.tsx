"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { haptic, subscribe, toggleMusic } from "@/lib/audio";
import wedding from "@/config/weddingConfig";

export default function MusicToggle({ revealed = true }: { revealed?: boolean }) {
  const [on, setOn] = useState(false);

  useEffect(() => subscribe(setOn), []);

  return (
    <AnimatePresence>
      {revealed && (
        <motion.button
          type="button"
          key="music"
          aria-label={on ? "Pause music" : "Play music"}
          aria-pressed={on}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            haptic(8);
            void toggleMusic(wedding.musicUrl || undefined);
          }}
          className="group absolute right-3 top-[calc(env(safe-area-inset-top)+14px)] z-40 grid h-11 w-11 place-items-center rounded-full border border-gold-500/35 bg-wine-950/70 text-gold-200 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md"
        >
          {on && (
            <motion.span
              className="absolute inset-0 rounded-full border border-gold-400/50"
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className={on ? "animate-spin-slow" : ""}>
            {on ? <Pause className="h-[17px] w-[17px]" strokeWidth={1.4} /> : <Music className="h-[17px] w-[17px]" strokeWidth={1.4} />}
          </span>
          <span className="pointer-events-none absolute -bottom-4 flex h-3 items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-[2px] rounded-full bg-gold-300"
                style={{
                  height: "100%",
                  transformOrigin: "bottom",
                  animation: on ? `eq 0.9s ease-in-out ${i * 0.15}s infinite` : "none",
                  opacity: on ? 0.9 : 0.25,
                  transform: on ? undefined : "scaleY(0.3)",
                }}
              />
            ))}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
