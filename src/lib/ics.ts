import wedding, { type Lang } from "@/config/weddingConfig";

/** Build a downloadable .ics calendar file for the wedding day in the active language. */
export function buildIcsHref(lang: Lang = "bn"): string {
  const start = new Date(wedding.weddingDate);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const summary =
    lang === "bn"
      ? `${wedding.brideName.bn} ও ${wedding.groomName.bn}-এর শুভ বিবাহ`
      : `${wedding.brideName.en} & ${wedding.groomName.en} — Wedding & Akd`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Halima & Ertugrul//Bangladeshi Wedding Invitation//BN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@halima-weds-ertugrul`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${wedding.venue[lang]}\\, ${wedding.venueLine2[lang]}\\, ${wedding.address[lang][0]}`,
    `DESCRIPTION:${wedding.weddingTime[lang]}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
