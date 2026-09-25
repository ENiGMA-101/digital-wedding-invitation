"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Armchair,
  CalendarPlus,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  Minus,
  Phone,
  RotateCcw,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import wedding, { type BangladeshiWeddingEvent } from "@/config/weddingConfig";
import {
  AlpanaCrest,
  BilingualText,
  Filigree,
  MihrabArch,
  Monogram,
} from "@/components/ui/Primitives";
import {
  formatNumberByLang,
  formatSeatsByLang,
  formatTableByLang,
  type Attendance,
  type ConfirmedReservation,
} from "@/components/invitation/ReservationSheet";
import { haptic } from "@/lib/audio";
import { buildIcsHref } from "@/lib/ics";
import { DrawnLine, RevealItem, RevealWord, usePaper } from "./engine";

export type LiveSummary = {
  totalReservations: number;
  attendingCount: number;
  totalSeatsReserved: number;
  totalCapacity: number;
  nextAvailableTable: number;
  nextAvailableSeat: number;
  recentAllocations: Array<{
    id: number;
    name: string;
    guests: number;
    tableNumber: number;
    seatStart: number;
    seatEnd: number;
    seatLabelEn: string;
    seatLabelBn: string;
  }>;
};

/* ───────────────────────────── Helpers ───────────────────────────── */

function Kicker({ children }: { children: React.ReactNode }) {
  const { lang } = usePaper();
  return (
    <BilingualText
      lang={lang}
      className="font-sans text-[9.5px] font-medium uppercase tracking-[0.34em] text-sage-700"
    >
      {children}
    </BilingualText>
  );
}

function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`} aria-hidden>
      <DrawnLine className="h-px w-14 bg-gradient-to-r from-transparent via-gold-600/55 to-sage-600/45" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold-600/75 bg-sage-600/20" />
      <DrawnLine className="h-px w-14 bg-gradient-to-l from-transparent via-gold-600/55 to-sage-600/45" />
    </div>
  );
}

/* ══════════════════════════════════ 16 VERSES ═════════════════════════ */

/** 1 · Opening Invitation (Bismillah + Alpana Crest + Sacred Invitation Header) */
export function VerseOpening() {
  const { lang } = usePaper();
  return (
    <div className="flex flex-col items-center text-center">
      <RevealItem variant="rise" entry={0.99} exit={0.9} distance={16}>
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-[23px] leading-relaxed tracking-wide text-wine-800"
        >
          {wedding.bismillah.arabic}
        </p>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-1 font-display text-[13.5px] italic text-ink-soft/85"
        >
          {wedding.bismillah[lang]}
        </BilingualText>
      </RevealItem>

      <RevealItem variant="bloom" entry={0.96} exit={0.82} className="mt-5">
        <AlpanaCrest size={74} />
      </RevealItem>

      <RevealItem variant="mask" className="mt-4">
        <Kicker>{wedding.ui.sacredInvitationKicker[lang]}</Kicker>
        <BilingualText
          lang={lang}
          as="h1"
          className="mt-1.5 font-display text-[28px] font-normal leading-tight tracking-[0.06em] text-wine-800"
        >
          {wedding.ui.theWeddingOf[lang]}
        </BilingualText>
      </RevealItem>
    </div>
  );
}

/** 2 · Quranic Introduction (Surah Ar-Rum 30:21 in Arabic + Bangla/English translation) */
export function VerseQuran() {
  const { lang } = usePaper();
  return (
    <div className="mt-[220px] flex flex-col items-center text-center">
      <RevealItem distance={16}>
        <MihrabArch />
      </RevealItem>

      <RevealItem
        blur
        distance={22}
        className="mt-3 rounded-[18px] border border-gold-600/25 bg-ivory-50/75 px-4 py-5 shadow-[0_14px_34px_-24px_rgba(38,6,12,0.35)]"
      >
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-[20px] leading-[2.05] text-wine-800"
        >
          {wedding.quranVerse.arabic}
        </p>

        <OrnamentDivider className="my-3.5" />

        <BilingualText
          lang={lang}
          as="p"
          className="font-display text-[15.5px] italic leading-[1.75] text-ink"
        >
          “{wedding.quranVerse[lang]}”
        </BilingualText>

        <BilingualText
          lang={lang}
          as="p"
          className="mt-2.5 font-sans text-[9.5px] uppercase tracking-[0.28em] text-sage-700"
        >
          {wedding.quranVerse.source[lang]}
        </BilingualText>
      </RevealItem>
    </div>
  );
}

/** 3 · "With the blessings of our families..." */
export function VerseFamilyBlessing() {
  const { lang } = usePaper();
  return (
    <div className="mt-[220px] flex flex-col items-center gap-2.5 text-center">
      <RevealItem distance={18}>
        <Filigree className="mx-auto h-12 w-12 text-gold-600/55" />
      </RevealItem>
      <RevealItem distance={20}>
        <BilingualText
          lang={lang}
          as="h2"
          className="font-display text-[22px] italic leading-snug text-wine-700"
        >
          {wedding.familyBlessingHeader[lang]}
        </BilingualText>
      </RevealItem>
      <RevealItem className="mt-1 max-w-[306px]" distance={16}>
        <BilingualText
          lang={lang}
          as="p"
          className="font-sans text-[12.5px] leading-[1.85] text-ink-soft"
        >
          {wedding.familyBlessingProse[lang]}
        </BilingualText>
      </RevealItem>
    </div>
  );
}

/** 4 · Bride and Groom Names (হালিমা বিনতে নুমান & মোঃ এরতুগরুল বিন সুলেমান) */
export function VerseCoupleNames() {
  const { lang } = usePaper();
  return (
    <div className="mt-[250px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <span className="inline-block rounded-full border border-gold-600/35 bg-ivory-50/80 px-3.5 py-1 font-sans text-[9.5px] uppercase tracking-[0.32em] text-sage-700">
          {wedding.ui.brideLabel[lang]}
        </span>
      </RevealItem>

      <div className="mt-3">
        <RevealWord
          text={wedding.brideName[lang]}
          className="font-display text-[36px] font-medium leading-[1.2] text-wine-800 sm:text-[40px]"
        />
      </div>

      <RevealItem className="mt-1.5" distance={10}>
        <BilingualText lang={lang} as="p" className="font-sans text-[11px] text-ink-soft/80">
          {wedding.brideLineage[lang]}
        </BilingualText>
      </RevealItem>

      <div className="my-9 flex items-center justify-center gap-3">
        <DrawnLine className="h-px w-12 bg-gold-600/45" />
        <RevealItem variant="bloom" entry={0.93} exit={0.65} blur>
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-600/40 bg-ivory-50 font-display text-[20px] italic text-gold-600 shadow-sm">
            {wedding.ui.andConnector[lang]}
          </span>
        </RevealItem>
        <DrawnLine className="h-px w-12 bg-gold-600/45" />
      </div>

      <RevealItem distance={14}>
        <span className="inline-block rounded-full border border-gold-600/35 bg-ivory-50/80 px-3.5 py-1 font-sans text-[9.5px] uppercase tracking-[0.32em] text-sage-700">
          {wedding.ui.groomLabel[lang]}
        </span>
      </RevealItem>

      <div className="mt-3">
        <RevealWord
          text={wedding.groomName[lang]}
          className="font-display text-[35px] font-medium leading-[1.2] text-wine-800 sm:text-[38px]"
        />
      </div>

      <RevealItem className="mt-1.5" distance={10}>
        <BilingualText lang={lang} as="p" className="font-sans text-[11px] text-ink-soft/80">
          {wedding.groomLineage[lang]}
        </BilingualText>
      </RevealItem>
    </div>
  );
}

/** 5 · Parents' Names (Bride's Father & Mother · Groom's Father & Mother) */
export function VerseParents() {
  const { lang } = usePaper();
  return (
    <div className="mt-[230px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.parentsSectionKicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem className="mt-1.5" distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[27px] text-wine-800">
          {wedding.ui.parentsSectionTitle[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="mt-3.5" />

      <div className="mt-5 grid w-full grid-cols-1 gap-3.5">
        {/* Bride's Parents */}
        <RevealItem
          distance={20}
          className="rounded-[16px] border border-gold-600/30 bg-ivory-50/85 p-4 text-center shadow-[0_12px_28px_-22px_rgba(38,6,12,0.45)]"
        >
          <BilingualText
            lang={lang}
            as="p"
            className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-sage-700"
          >
            {wedding.brideFamilyTitle[lang]}
          </BilingualText>
          <div className="mt-2.5 flex flex-col gap-1">
            <BilingualText lang={lang} as="p" className="font-display text-[20px] font-medium text-wine-800">
              {wedding.brideFather[lang]}
            </BilingualText>
            <span className="font-display text-[13px] italic text-gold-600">
              {wedding.ui.andConnector[lang]}
            </span>
            <BilingualText lang={lang} as="p" className="font-display text-[20px] font-medium text-wine-800">
              {wedding.brideMother[lang]}
            </BilingualText>
          </div>
        </RevealItem>

        {/* Groom's Parents */}
        <RevealItem
          distance={20}
          className="rounded-[16px] border border-gold-600/30 bg-ivory-50/85 p-4 text-center shadow-[0_12px_28px_-22px_rgba(38,6,12,0.45)]"
        >
          <BilingualText
            lang={lang}
            as="p"
            className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-sage-700"
          >
            {wedding.groomFamilyTitle[lang]}
          </BilingualText>
          <div className="mt-2.5 flex flex-col gap-1">
            <BilingualText lang={lang} as="p" className="font-display text-[20px] font-medium text-wine-800">
              {wedding.groomFather[lang]}
            </BilingualText>
            <span className="font-display text-[13px] italic text-gold-600">
              {wedding.ui.andConnector[lang]}
            </span>
            <BilingualText lang={lang} as="p" className="font-display text-[20px] font-medium text-wine-800">
              {wedding.groomMother[lang]}
            </BilingualText>
          </div>
        </RevealItem>
      </div>
    </div>
  );
}

/** 6 · Wedding Date */
export function VerseDate() {
  const { lang } = usePaper();
  return (
    <div className="mt-[240px] flex flex-col items-center gap-3 text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.dateSectionKicker[lang]}</Kicker>
      </RevealItem>
      <OrnamentDivider />

      <RevealItem
        exit={0.58}
        distance={22}
        className="mt-2 w-full max-w-[290px] rounded-[22px] border border-gold-600/35 bg-[linear-gradient(165deg,#fdfaf4_0%,#f4e8d2_100%)] px-5 py-5 shadow-[0_18px_38px_-26px_rgba(64,9,18,0.5)]"
      >
        <BilingualText
          lang={lang}
          as="p"
          className="font-sans text-[10px] uppercase tracking-[0.32em] text-sage-700"
        >
          {wedding.banglaCalendarDate[lang]}
        </BilingualText>

        <BilingualText
          lang={lang}
          as="p"
          className="mt-2 font-display text-[64px] font-light leading-none text-wine-800"
        >
          {wedding.dayNumber[lang]}
        </BilingualText>

        <BilingualText
          lang={lang}
          as="p"
          className="mt-1 font-display text-[22px] tracking-[0.12em] text-gold-600"
        >
          {wedding.monthYear[lang]}
        </BilingualText>

        <div className="my-3 h-px w-full bg-gold-600/25" />

        <BilingualText
          lang={lang}
          as="p"
          className="font-display text-[18px] font-medium text-ink"
        >
          {wedding.dateDisplay[lang]}
        </BilingualText>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-1 font-sans text-[11px] text-ink-soft/85"
        >
          {wedding.weddingTime[lang]}
        </BilingualText>
      </RevealItem>

      <OrnamentDivider />
    </div>
  );
}

/** 7 · Wedding Ceremony Details */
export function VerseCeremonyDetails() {
  const { lang } = usePaper();
  const details = wedding.ceremonyDetails;
  return (
    <div className="mt-[230px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{details.kicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem className="mt-1.5" distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[27px] text-wine-800">
          {details.title[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="mt-3.5" />

      <RevealItem className="mt-3.5 max-w-[304px]" distance={16}>
        <BilingualText
          lang={lang}
          as="p"
          className="font-sans text-[12px] leading-[1.85] text-ink-soft"
        >
          {details.description[lang]}
        </BilingualText>
      </RevealItem>

      <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
        {details.highlights.map((item, idx) => (
          <RevealItem
            key={idx}
            exit={0.66}
            distance={16}
            className="rounded-[14px] border border-gold-600/28 bg-ivory-50/80 px-3 py-3 text-center"
          >
            <Clock3 className="mx-auto h-3.5 w-3.5 text-sage-700" strokeWidth={1.5} />
            <BilingualText
              lang={lang}
              as="p"
              className="mt-1.5 font-sans text-[9.5px] uppercase tracking-[0.18em] text-ink-soft/75"
            >
              {item.label[lang]}
            </BilingualText>
            <BilingualText
              lang={lang}
              as="p"
              className="mt-0.5 font-display text-[16.5px] font-semibold text-wine-800"
            >
              {item.value[lang]}
            </BilingualText>
          </RevealItem>
        ))}
      </div>
    </div>
  );
}

/** Shared Bangladeshi Wedding Event Card (Steps 8, 9, 10, 11) */
export function VerseBangladeshiEvent({
  event,
  showSectionIntro = false,
}: {
  event: BangladeshiWeddingEvent;
  showSectionIntro?: boolean;
}) {
  const { lang } = usePaper();
  return (
    <div className="mt-[240px] flex flex-col items-center text-center">
      {showSectionIntro && (
        <div className="mb-10 flex flex-col items-center">
          <RevealItem distance={14}>
            <Kicker>{wedding.ui.eventsSectionKicker[lang]}</Kicker>
          </RevealItem>
          <RevealItem className="mt-1.5" distance={18}>
            <BilingualText lang={lang} as="h3" className="font-display text-[28px] text-wine-800">
              {wedding.ui.eventsSectionTitle[lang]}
            </BilingualText>
          </RevealItem>
          <OrnamentDivider className="mt-3.5" />
          <RevealItem className="mt-3 max-w-[300px]" distance={16}>
            <BilingualText lang={lang} as="p" className="font-sans text-[12px] leading-relaxed text-ink-soft">
              {wedding.ui.eventsSectionIntro[lang]}
            </BilingualText>
          </RevealItem>
        </div>
      )}

      <RevealItem
        exit={0.68}
        distance={28}
        className="w-full overflow-hidden rounded-[20px] border border-gold-600/35 bg-ivory-50/90 text-left shadow-[0_22px_44px_-28px_rgba(38,6,12,0.55)]"
      >
        {/* Event Photograph */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ivory-200">
          <Image
            src={event.image}
            alt={event.imageAlt[lang]}
            fill
            sizes="340px"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950/75 via-wine-950/15 to-transparent" />
          <span
            className="absolute left-3.5 top-3 rounded-full border border-gold-300/40 px-3 py-1 font-sans text-[9.5px] font-medium uppercase tracking-[0.22em] text-ivory-50 backdrop-blur-md"
            style={{ backgroundColor: `${event.accentHex}cc` }}
          >
            {event.number[lang]}
          </span>
          <div className="absolute bottom-3 left-4 right-4">
            <BilingualText
              lang={lang}
              as="h4"
              className="font-display text-[26px] font-medium leading-tight text-ivory-50"
            >
              {event.name[lang]}
            </BilingualText>
            <BilingualText
              lang={lang}
              as="p"
              className="mt-0.5 font-display text-[13.5px] italic text-gold-200"
            >
              {event.subtitle[lang]}
            </BilingualText>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2.5 font-sans text-[12px] text-ink">
            <Sun className="h-4 w-4 shrink-0 text-gold-600" strokeWidth={1.6} />
            <BilingualText lang={lang} className="font-medium text-wine-800">
              {event.day[lang]} · {event.date[lang]}
            </BilingualText>
          </div>

          <div className="flex items-center gap-2.5 font-sans text-[12px] text-ink-soft">
            <Clock3 className="h-4 w-4 shrink-0 text-sage-700" strokeWidth={1.6} />
            <BilingualText lang={lang}>{event.time[lang]}</BilingualText>
          </div>

          <div className="flex items-start gap-2.5 font-sans text-[12px] text-ink-soft">
            <MapPin className="mt-[2px] h-4 w-4 shrink-0 text-wine-700" strokeWidth={1.6} />
            <div>
              <BilingualText lang={lang} as="p" className="font-medium text-wine-800">
                {event.venue[lang]}
              </BilingualText>
              <BilingualText lang={lang} as="p" className="text-[11px] text-ink-soft/80">
                {event.address[lang]}
              </BilingualText>
            </div>
          </div>

          <div
            className="mt-1 rounded-xl border-l-2 bg-ivory-100/80 px-3 py-2 font-sans text-[11px] text-ink-soft"
            style={{ borderColor: event.accentHex }}
          >
            <BilingualText lang={lang}>{event.attireNote[lang]}</BilingualText>
          </div>

          <div className="mt-1 flex justify-end">
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic(6)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-600/40 bg-ivory-50 px-3.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-wine-800 transition-colors hover:border-wine-700"
            >
              <MapPin className="h-3 w-3 text-wine-700" strokeWidth={1.6} />
              <BilingualText lang={lang}>{wedding.ui.viewMapBtn[lang]}</BilingualText>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" strokeWidth={1.7} />
            </a>
          </div>
        </div>
      </RevealItem>
    </div>
  );
}

/** 12 · Venue Information */
export function VerseVenue() {
  const { lang } = usePaper();
  const calendarHref = buildIcsHref(lang);

  return (
    <div className="mt-[240px] flex flex-col items-center gap-2.5 text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.venueSectionKicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[28px] text-wine-800">
          {wedding.ui.venueSectionTitle[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="my-2" />

      <RevealItem
        distance={20}
        className="w-full rounded-[20px] border border-gold-600/35 bg-ivory-50/85 p-5 shadow-[0_18px_38px_-26px_rgba(38,6,12,0.5)]"
      >
        <BilingualText
          lang={lang}
          as="h4"
          className="font-display text-[28px] font-medium leading-tight text-wine-800"
        >
          {wedding.venue[lang]}
        </BilingualText>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-1 font-display text-[19px] italic text-sage-700"
        >
          {wedding.venueLine2[lang]}
        </BilingualText>

        <div className="mt-3 flex items-start justify-center gap-2 text-ink-soft">
          <MapPin className="mt-[3px] h-4 w-4 shrink-0 text-gold-600" strokeWidth={1.6} />
          <p className="font-sans text-[12px] leading-relaxed">
            {wedding.address[lang][0]}
            <span className="block">{wedding.address[lang][1]}</span>
          </p>
        </div>

        <BilingualText
          lang={lang}
          as="p"
          className="mt-3 rounded-xl bg-sage-100/70 px-3 py-2 font-sans text-[11px] text-sage-900"
        >
          {wedding.ui.venueHospitalityNote[lang]}
        </BilingualText>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={wedding.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic(8)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-wine-700 px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ivory-50 shadow-sm transition-transform active:scale-95"
          >
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} />
            <BilingualText lang={lang}>{wedding.ui.viewMapBtn[lang]}</BilingualText>
            <ExternalLink className="h-3 w-3 opacity-65" strokeWidth={1.7} />
          </a>

          <a
            href={calendarHref}
            download="halima-weds-ertugrul.ics"
            onClick={() => haptic(8)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-wine-700/30 bg-ivory-50 px-5 py-2.5 font-sans text-[10.5px] uppercase tracking-[0.2em] text-wine-800 transition-transform active:scale-95"
          >
            <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.6} />
            <BilingualText lang={lang}>{wedding.ui.addToCalendarBtn[lang]}</BilingualText>
          </a>
        </div>
      </RevealItem>
    </div>
  );
}

/** 13 · Wedding Gallery */
export function VerseGallery({ onOpenImage }: { onOpenImage: (index: number) => void }) {
  const { lang } = usePaper();
  return (
    <div className="mt-[240px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.gallerySectionKicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem className="mt-1.5" distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[28px] text-wine-800">
          {wedding.ui.gallerySectionTitle[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="mt-3.5" />
      <RevealItem className="mt-2.5 max-w-[280px]" distance={14}>
        <BilingualText lang={lang} as="p" className="font-sans text-[11.5px] leading-relaxed text-ink-soft/80">
          {wedding.ui.gallerySectionSub[lang]}
        </BilingualText>
      </RevealItem>

      <div className="mt-6 grid w-full grid-cols-2 gap-3.5">
        {wedding.gallery.map((img, i) => (
          <RevealItem
            key={img.src}
            exit={0.7}
            distance={30}
            className={i % 2 === 1 ? "mt-6" : ""}
          >
            <button
              type="button"
              onClick={() => {
                haptic(8);
                onOpenImage(i);
              }}
              className={`group relative block w-full overflow-hidden rounded-[15px] border border-gold-600/35 bg-ivory-200 text-left shadow-[0_18px_36px_-24px_rgba(38,6,12,0.55)] transition-transform duration-500 active:scale-[0.97] ${
                img.tall ? "aspect-[3/4.2]" : "aspect-[3/3.3]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt[lang]}
                fill
                sizes="170px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-wine-950/75 via-transparent to-transparent" />
              <span className="absolute left-2.5 top-2 rounded-full bg-wine-950/60 px-2 py-0.5 font-sans text-[8px] uppercase tracking-[0.16em] text-gold-200 backdrop-blur-sm">
                {img.tag[lang]}
              </span>
              <span className="absolute inset-x-2.5 bottom-2 truncate font-sans text-[9.5px] text-ivory-50">
                {img.caption[lang]}
              </span>
            </button>
          </RevealItem>
        ))}
      </div>
    </div>
  );
}

/** 14 · Wedding Reservation (No "RSVP" terminology) */
export function VerseReservation({
  onReserve,
}: {
  onReserve: (preset: Attendance) => void;
}) {
  const { lang } = usePaper();

  return (
    <div className="mt-[240px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.reservationSectionKicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem className="mt-1.5" distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[29px] text-wine-800">
          {wedding.ui.reservationSectionTitle[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="mt-3.5" />

      <RevealItem className="mt-3.5 max-w-[300px]" distance={16}>
        <BilingualText lang={lang} as="p" className="font-sans text-[12px] leading-relaxed text-ink-soft">
          {wedding.ui.reservationSectionNote[lang]}
        </BilingualText>
      </RevealItem>

      <div className="mt-6 flex w-full max-w-[310px] flex-col gap-2.5">
        <RevealItem exit={0.68} distance={18}>
          <button
            type="button"
            onClick={() => {
              haptic([8, 30, 8]);
              onReserve("attending");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-wine-700 px-5 py-3.5 font-sans text-[11.5px] font-medium tracking-[0.12em] text-ivory-50 shadow-[0_16px_36px_-20px_rgba(64,9,18,0.95)] transition-transform active:scale-[0.97]"
          >
            <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
            <BilingualText lang={lang}>{wedding.ui.willAttendBtn[lang]}</BilingualText>
          </button>
        </RevealItem>

        <RevealItem exit={0.68} distance={18}>
          <button
            type="button"
            onClick={() => {
              haptic([8, 30, 8]);
              onReserve("declined");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-wine-700/35 bg-ivory-50/70 px-5 py-3 font-sans text-[11px] tracking-[0.12em] text-wine-800 transition-transform active:scale-[0.97]"
          >
            <X className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <BilingualText lang={lang}>{wedding.ui.cannotAttendBtn[lang]}</BilingualText>
          </button>
        </RevealItem>
      </div>

      {/* Family contact numbers */}
      <RevealItem className="mt-5 w-full" exit={0.7} distance={12}>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-gold-600/25 bg-ivory-50/75 px-4 py-3">
          {wedding.contacts.map((c) => (
            <a
              key={c.tel}
              href={`tel:${c.tel}`}
              onClick={() => haptic(6)}
              className="inline-flex items-center justify-center gap-1.5 font-sans text-[11px] text-wine-800 transition-colors hover:text-sage-700"
            >
              <Phone className="h-3 w-3 shrink-0 text-sage-700" strokeWidth={1.6} />
              <span>
                {c.name[lang]} · {c.phoneDisplay[lang]}
              </span>
            </a>
          ))}
        </div>
      </RevealItem>
    </div>
  );
}

/** 15 · Guest Seat Allocation (LiveConfirmed Pass + Automatic Table/Seat Simulator + Recent Allocations) */
export function VerseSeatAllocation({
  confirmedReservation,
  summary,
  onOpenReservation,
}: {
  confirmedReservation: ConfirmedReservation | null;
  summary: LiveSummary | null;
  onOpenReservation: () => void;
}) {
  const { lang } = usePaper();
  const [sampleGuests, setSampleGuests] = useState<number>(2);

  const sampleTable = sampleGuests >= 4 ? 5 : 3;
  const sampleSeatStart = 1;
  const sampleSeatEnd = sampleGuests;

  return (
    <div className="mt-[240px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.seatSectionKicker[lang]}</Kicker>
      </RevealItem>
      <RevealItem className="mt-1.5" distance={18}>
        <BilingualText lang={lang} as="h3" className="font-display text-[28px] text-wine-800">
          {wedding.ui.seatSectionTitle[lang]}
        </BilingualText>
      </RevealItem>
      <OrnamentDivider className="mt-3.5" />

      <RevealItem className="mt-3 max-w-[304px]" distance={16}>
        <BilingualText lang={lang} as="p" className="font-sans text-[12px] leading-relaxed text-ink-soft">
          {wedding.ui.seatSectionDesc[lang]}
        </BilingualText>
      </RevealItem>

      {/* If user confirmed a seat in this session, display their official Seat Pass right on the paper */}
      {confirmedReservation && confirmedReservation.attendance === "attending" && (
        <RevealItem
          exit={0.68}
          distance={20}
          className="mt-5 w-full overflow-hidden rounded-[20px] border-2 border-gold-600/55 bg-[linear-gradient(160deg,#fdfaf4_0%,#f4e6cc_100%)] p-4 text-left shadow-[0_20px_40px_-24px_rgba(38,6,12,0.65)]"
        >
          <div className="flex items-center justify-between border-b border-gold-600/30 pb-2.5">
            <span className="flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-800">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" strokeWidth={1.7} />
              {wedding.ui.yourAssignedSeatHeader[lang]}
            </span>
            <Check className="h-4 w-4 text-sage-700" strokeWidth={2.2} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <span className="block font-sans text-[9px] uppercase tracking-[0.18em] text-ink-soft/65">
                {wedding.ui.guestNameLabel[lang]}
              </span>
              <span className="font-display text-[18px] font-semibold text-wine-800">
                {confirmedReservation.name}
              </span>
            </div>
            <div>
              <span className="block font-sans text-[9px] uppercase tracking-[0.18em] text-ink-soft/65">
                {wedding.ui.guestCountLabel[lang]}
              </span>
              <span className="font-display text-[18px] font-semibold text-wine-800">
                {formatNumberByLang(confirmedReservation.guests, lang)}{" "}
                {lang === "bn" ? "জন" : confirmedReservation.guests === 1 ? "Guest" : "Guests"}
              </span>
            </div>
            <div className="rounded-xl border border-gold-600/30 bg-ivory-50 p-2.5">
              <span className="block font-sans text-[8.5px] uppercase tracking-[0.18em] text-gold-600">
                {wedding.ui.tableNumberLabel[lang]}
              </span>
              <span className="font-display text-[20px] font-bold text-wine-800">
                {formatTableByLang(confirmedReservation.tableNumber, lang)}
              </span>
            </div>
            <div className="rounded-xl border border-sage-600/30 bg-sage-100/70 p-2.5">
              <span className="block font-sans text-[8.5px] uppercase tracking-[0.18em] text-sage-800">
                {wedding.ui.seatNumbersLabel[lang]}
              </span>
              <span className="font-display text-[20px] font-bold text-sage-900">
                {formatSeatsByLang(
                  confirmedReservation.seatStart,
                  confirmedReservation.seatEnd,
                  confirmedReservation.guests,
                  lang,
                )}
              </span>
            </div>
          </div>
        </RevealItem>
      )}

      {/* Interactive Automatic Seat Allocation Preview Card */}
      <RevealItem
        exit={0.7}
        distance={22}
        className="mt-5 w-full rounded-[20px] border border-gold-600/35 bg-ivory-50/90 p-4 text-left shadow-[0_16px_34px_-24px_rgba(38,6,12,0.45)]"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-sage-700">
            <Armchair className="h-3.5 w-3.5 text-gold-600" strokeWidth={1.6} />
            {wedding.ui.sampleAllocationTitle[lang]}
          </span>
          <span className="font-sans text-[9.5px] text-ink-soft/65">
            {summary
              ? lang === "bn"
                ? `মোট সংরক্ষিত আসন: ${formatNumberByLang(summary.totalSeatsReserved, "bn")}`
                : `Reserved seats: ${summary.totalSeatsReserved}`
              : ""}
          </span>
        </div>

        {/* Party size selector buttons: 1, 2, 4 guests */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 4].map((count) => {
            const active = sampleGuests === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  haptic(6);
                  setSampleGuests(count);
                }}
                className={`rounded-xl border px-2.5 py-2 text-center font-sans text-[11px] transition-all ${
                  active
                    ? "border-wine-700 bg-wine-700 text-ivory-50 shadow-sm"
                    : "border-gold-600/30 bg-ivory-100/70 text-ink-soft hover:border-wine-700/40"
                }`}
              >
                <Users className="mx-auto mb-0.5 h-3.5 w-3.5 opacity-80" strokeWidth={1.6} />
                {formatNumberByLang(count, lang)}{" "}
                {lang === "bn" ? "জন অতিথি" : count === 1 ? "Guest" : "Guests"}
              </button>
            );
          })}
        </div>

        {/* Resulting Table & Seat Assignment */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-sage-600/25 bg-sage-100/55 px-3.5 py-3">
          <div>
            <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-sage-800">
              {lang === "bn" ? "বরাদ্দকৃত টেবিল ও আসন" : "Assigned Table & Seats"}
            </span>
            <span className="mt-0.5 block font-display text-[20px] font-semibold text-wine-800">
              {formatTableByLang(sampleTable, lang)} /{" "}
              {formatSeatsByLang(sampleSeatStart, sampleSeatEnd, sampleGuests, lang)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              haptic(8);
              onOpenReservation();
            }}
            className="rounded-full border border-wine-700/35 bg-ivory-50 px-3.5 py-1.5 font-sans text-[10px] font-medium text-wine-800 transition-colors hover:bg-wine-700 hover:text-ivory-50"
          >
            {lang === "bn" ? "রিজার্ভ করুন" : "Reserve Now"}
          </button>
        </div>

        {/* Recent live allocations from PostgreSQL */}
        {summary && summary.recentAllocations.length > 0 && (
          <div className="mt-3.5 border-t border-gold-600/20 pt-3">
            <p className="font-sans text-[9.5px] uppercase tracking-[0.22em] text-ink-soft/70">
              {wedding.ui.recentGuestAllocationsTitle[lang]}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {summary.recentAllocations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-ivory-100/75 px-3 py-1.5 font-sans text-[11px]"
                >
                  <span className="truncate font-medium text-ink">
                    {item.name} ({formatNumberByLang(item.guests, lang)}{" "}
                    {lang === "bn" ? "জন" : item.guests === 1 ? "guest" : "guests"})
                  </span>
                  <span className="shrink-0 font-display text-[13px] font-semibold text-sage-800">
                    {lang === "bn" ? item.seatLabelBn : item.seatLabelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealItem>
    </div>
  );
}

/** 16 · Final Blessing / Message */
export function VerseFinale({
  onReplay,
  onOpenReservation,
}: {
  onReplay: () => void;
  onOpenReservation: () => void;
}) {
  const { lang } = usePaper();
  const calendar = buildIcsHref(lang);

  return (
    <div className="mt-[260px] flex flex-col items-center text-center">
      <RevealItem distance={14}>
        <Kicker>{wedding.ui.finalSectionKicker[lang]}</Kicker>
      </RevealItem>

      <RevealItem variant="bloom" blur distance={0} className="mt-4">
        <Monogram size={86} className="text-gold-600">
          {wedding.monogram[lang]}
        </Monogram>
      </RevealItem>

      {/* Prophetic Dua for the Newlyweds */}
      <RevealItem
        blur
        distance={18}
        className="mt-5 rounded-[16px] border border-gold-600/25 bg-ivory-50/75 px-4 py-3.5"
      >
        <p dir="rtl" lang="ar" className="font-arabic text-[18px] leading-loose text-wine-800">
          {wedding.blessingDua.arabic}
        </p>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-1.5 font-display text-[13.5px] italic leading-relaxed text-ink-soft"
        >
          “{wedding.blessingDua[lang]}”
        </BilingualText>
      </RevealItem>

      <RevealItem className="mt-6" blur distance={20}>
        <BilingualText
          lang={lang}
          as="h3"
          className="mx-auto max-w-[290px] font-display text-[24px] font-normal italic leading-[1.4] text-wine-800"
        >
          {wedding.finalMessage[lang]}
        </BilingualText>
        <BilingualText
          lang={lang}
          as="p"
          className="mx-auto mt-2 max-w-[290px] font-sans text-[11.5px] leading-relaxed text-ink-soft/80"
        >
          {wedding.finalSubtext[lang]}
        </BilingualText>
      </RevealItem>

      <div className="mt-7 flex flex-col items-center">
        <RevealWord
          entry={0.94}
          exit={0.7}
          text={wedding.brideName[lang]}
          className="font-display text-[30px] font-medium leading-[1.2] text-wine-800"
        />
        <RevealItem variant="bloom" entry={0.95} exit={0.74} className="my-2">
          <span className="font-display text-[22px] italic leading-none text-gold-600">
            {wedding.ui.andConnector[lang]}
          </span>
        </RevealItem>
        <RevealWord
          entry={0.95}
          exit={0.72}
          text={wedding.groomName[lang]}
          className="font-display text-[30px] font-medium leading-[1.2] text-wine-800"
        />
      </div>

      <OrnamentDivider className="mt-6" />

      <RevealItem className="mt-4" distance={14}>
        <BilingualText lang={lang} as="p" className="font-display text-[19px] font-medium text-ink">
          {wedding.dateDisplay[lang]}
        </BilingualText>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-1 font-sans text-[10.5px] uppercase tracking-[0.22em] text-ink-soft/75"
        >
          {wedding.venue[lang]} · {wedding.venueLine2[lang]}
        </BilingualText>
      </RevealItem>

      {/* Final Interactive Action Controls */}
      <div className="mt-7 flex w-full max-w-[304px] flex-col gap-2.5 pb-2">
        <RevealItem exit={0.74} distance={18}>
          <button
            type="button"
            onClick={() => {
              haptic(10);
              onOpenReservation();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] text-ivory-50 shadow-[0_16px_36px_-20px_rgba(64,9,18,0.95)] transition-transform active:scale-[0.97]"
          >
            <Armchair className="h-4 w-4" strokeWidth={1.7} />
            <BilingualText lang={lang}>{wedding.ui.openReservationModalBtn[lang]}</BilingualText>
          </button>
        </RevealItem>

        <div className="flex gap-2">
          <RevealItem exit={0.74} distance={18} className="flex-1">
            <a
              href={wedding.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic(10)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-wine-700/30 bg-ivory-50 px-3 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-wine-800 transition-transform active:scale-[0.97]"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
              <BilingualText lang={lang}>{wedding.ui.viewMapBtn[lang]}</BilingualText>
            </a>
          </RevealItem>
          <RevealItem exit={0.74} distance={18} className="flex-1">
            <a
              href={calendar}
              download="halima-weds-ertugrul.ics"
              onClick={() => haptic(10)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-wine-700/30 bg-ivory-50 px-3 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-wine-800 transition-transform active:scale-[0.97]"
            >
              <CalendarPlus className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
              <BilingualText lang={lang}>{wedding.ui.addToCalendarBtn[lang]}</BilingualText>
            </a>
          </RevealItem>
        </div>
      </div>

      <RevealItem className="mt-8" variant="rise" exit={0.8} distance={12}>
        <BilingualText lang={lang} as="p" className="font-display text-[16px] italic text-sage-700">
          {wedding.finalSignature[lang]}
        </BilingualText>
        <button
          type="button"
          onClick={() => {
            haptic(8);
            onReplay();
          }}
          className="mx-auto mt-3.5 flex items-center gap-1.5 rounded-full border border-gold-600/35 px-4 py-2 font-sans text-[9.5px] uppercase tracking-[0.22em] text-ink-soft/75 transition-colors hover:text-wine-700"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={1.6} />
          <BilingualText lang={lang}>{wedding.ui.closeInvitationBtn[lang]}</BilingualText>
        </button>
        <BilingualText
          lang={lang}
          as="p"
          className="mt-5 font-sans text-[9px] uppercase tracking-[0.24em] text-ink-soft/50"
        >
          {wedding.ui.endOfLetterNote[lang]}
        </BilingualText>
        <Minus className="mx-auto mt-2.5 h-4 w-4 text-gold-600/40" strokeWidth={1} />
      </RevealItem>
    </div>
  );
}
