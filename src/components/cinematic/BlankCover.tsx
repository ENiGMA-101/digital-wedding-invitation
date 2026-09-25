"use client";

import { motion } from "framer-motion";
import wedding, { type Lang } from "@/config/weddingConfig";
import { BilingualText } from "@/components/ui/Primitives";

/**
 * STEP 1 — Intentionally blank / minimal elegant screen.
 * Warm ivory paper tone, subtle grain, and only the gentle "Tap to Open" instruction.
 */
export default function BlankCover({
  lang,
  onOpen,
}: {
  lang: Lang;
  onOpen: () => void;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={wedding.ui.tapToOpen[lang]}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="absolute inset-0 z-[75] grid cursor-pointer place-items-center bg-[#f6efe2] outline-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.7, ease: "easeOut" },
      }}
      exit={{
        backgroundColor: "rgba(246,239,226,0)",
        pointerEvents: "none" as const,
        transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.25 },
      }}
    >
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_46%,rgba(110,18,32,0.04),transparent_70%)]" />

      <motion.div
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.45 }}
        className="flex select-none flex-col items-center gap-2.5 px-6 text-center"
      >
        <motion.div
          animate={{ opacity: [0.32, 0.96, 0.32] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BilingualText
            lang={lang}
            as="p"
            className="font-display text-[21px] font-light italic tracking-[0.22em] text-wine-800/85"
          >
            {wedding.ui.tapToOpen[lang]}
          </BilingualText>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
