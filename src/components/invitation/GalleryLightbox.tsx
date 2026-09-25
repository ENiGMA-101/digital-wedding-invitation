"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import wedding, { type Lang } from "@/config/weddingConfig";
import { haptic } from "@/lib/audio";

const images = wedding.gallery;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;
function formatNum(n: number, lang: Lang) {
  const s = String(n).padStart(2, "0");
  return lang === "bn" ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d) : s;
}

export default function GalleryLightbox({
  index,
  lang,
  onClose,
}: {
  index: number;
  lang: Lang;
  onClose: () => void;
}) {
  const [[page, direction], setPage] = useState<[number, number]>([index, 0]);
  const image = images[page];

  const move = useCallback((dir: number) => {
    haptic(6);
    setPage(([current]) => [(current + dir + images.length) % images.length, dir]);
  }, []);

  const jump = useCallback((next: number) => {
    haptic(6);
    setPage(([current]) => (current === next ? [current, 0] : [next, next > current ? 1 : -1]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, onClose]);

  if (!image) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label={wedding.ui.gallerySectionTitle[lang]}
    >
      <div className="absolute inset-0 bg-wine-950/96 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] items-center justify-between px-5 pb-2 pt-[calc(env(safe-area-inset-top)+16px)]">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold-300/90">
          {formatNum(page + 1, lang)} / {formatNum(images.length, lang)} · {image.tag[lang]}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={wedding.ui.closeBtn[lang]}
          className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/35 text-ivory-100 transition-colors hover:border-gold-300/70"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 items-center overflow-hidden px-4">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -400) move(1);
              else if (info.offset.x > 70 || info.velocity.x > 400) move(-1);
            }}
            initial={{ opacity: 0, x: direction >= 0 ? 150 : -150, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction >= 0 ? -150 : 150, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-[20px] border border-gold-500/30 shadow-[0_40px_80px_-40px_rgba(0,0,0,1)]"
          >
            <Image src={image.src} alt={image.alt[lang]} fill sizes="340px" className="object-cover" draggable={false} />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => move(-1)}
          className="absolute left-2 z-20 grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 bg-wine-950/70 text-gold-200 backdrop-blur-sm transition-transform active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => move(1)}
          className="absolute right-2 z-20 grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 bg-wine-950/70 text-gold-200 backdrop-blur-sm transition-transform active:scale-90"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
        </button>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center gap-3 px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-4 text-center">
        <p className="font-display text-[19px] text-ivory-100">{image.caption[lang]}</p>
        <div className="flex items-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`${i + 1}`}
              onClick={() => jump(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "w-6 bg-gold-300" : "w-1.5 bg-ivory-200/30"
              }`}
            />
          ))}
        </div>
        <p className="font-sans text-[9.5px] uppercase tracking-[0.24em] text-ivory-200/50">
          {wedding.ui.swipeGalleryNote[lang]}
        </p>
      </div>
    </motion.div>
  );
}
