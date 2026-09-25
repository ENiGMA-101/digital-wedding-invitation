# হালিমা বিনতে নুমান ও মোঃ এরতুগরুল বিন সুলেমান — Interactive Bangladeshi Muslim Wedding Invitation

A luxury, cinematic, **mobile-first** Bangladeshi Muslim wedding invitation built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and PostgreSQL + Drizzle ORM.

**Core Philosophy:**
- **TAP = OPEN** (Blank ivory screen → 3D physical card & wax-sealed flap opening)
- **SCROLL = DISCOVER** (Scroll position controls the physical unfolding of 16 invitation chapters)
- **RESERVATION = CONFIRM SEAT** (Automatic banquet table & contiguous seat assignment persisted in PostgreSQL)
- **বাংলা = DEFAULT LANGUAGE** (`বাংলা | ENG` live switcher transitions all text smoothly without reloading or losing scroll position)

---

## ✨ Bride, Groom & Families

- **কনে (Bride):** হালিমা বিনতে নুমান (*Halima Binte Numan*)
  - **পিতা (Father):** শাহজাদা নুমান (*Shahzada Numan*)
  - **মাতা (Mother):** মরিয়ম খাতুন (*Mariam Khatun*)
- **বর (Groom):** মোঃ এরতুগরুল বিন সুলেমান (*Md. Ertugrul Bin Suleman*)
  - **পিতা (Father):** মরহুম সুলেমান শাহ (*Late Suleman Shah*)
  - **মাতা (Mother):** হায়মে খাতুন (*Hayme Khatun*)

---

## 📜 16 Scroll-Revealed Chapters

1. **Opening Invitation** — Bismillah in Arabic + translation, Bangladeshi Alpana & Islamic geometric crest
2. **Quranic Introduction** — Verified Surah Ar-Rum (30:21) in Arabic with Bangla & English translations
3. **Family Blessings** — *"আমাদের উভয় পরিবারের দোয়া ও আশীর্বাদে"* / *"With the blessings of our families"*
4. **Bride & Groom Names** — Uncovered word-by-word via scroll-linked mask reveals
5. **Parents' Names** — Dedicated family lineage cards for both the Bride's and Groom's parents
6. **Wedding Date** — ১২ ফেব্রুয়ারি ২০২৭ (২৯ মাঘ ১৪৩৩ বঙ্গাব্দ · ৫ রজব ১৪৪৮ হিজরি)
7. **Wedding Ceremony Details** — Sacred Friday schedule (Guest reception, Akd, Groom's procession, Banquet)
8. **গায়ে হলুদ (Gaye Holud)** — Event card with Bangladeshi Gaye Holud photography, date, time, venue & attire note
9. **মেহেদী সন্ধ্যা (Mehendi Evening)** — Event card with Mehendi photography, date, time, venue & attire note
10. **বিয়ে ও আকদ (Wedding & Akd)** — Event card with Bangladeshi wedding attire photography, date, time & venue
11. **বিবাহোত্তর সংবর্ধনা (Wedding Reception)** — Event card with reception banquet photography, date, time & venue
12. **Venue Information** — Rosewood Ballroom, Le Méridien Dhaka with Google Maps & `.ics` Calendar download
13. **Wedding Gallery** — Staggered Bangladeshi wedding photography grid with fullscreen swipeable lightbox
14. **Wedding Reservation** — Interactive reservation trigger & family contact numbers
15. **Guest Seat Allocation** — Live confirmed seat pass, automatic party-size seat calculator (`1 guest → Table 03 / Seat 01`, `2 guests → Table 03 / Seats 01–02`, `4 guests → Table 05 / Seats 01–04`), and recent PostgreSQL allocations
16. **Final Blessing & Message** — Prophetic marriage Dua (`بارك الله لكما...`), closing blessing, action buttons, and fold/replay control

---

## 🪑 Automatic Seat Allocation (`POST /api/reservation` · `GET /api/reservation`)

Stored in PostgreSQL (`reservations` table in `src/db/schema.ts`):
- Guests submit **Name**, **Mobile Number**, **Number of Guests**, **Attendance Confirmation**, and **Optional Message**.
- Attending parties are automatically assigned contiguous seats at the next banquet table with available capacity (Tables 01–02 reserved for family; guest allocation begins at `Table 03 / Seat 01`).
- Returns both Bangla (`টেবিল ০৩ / আসন ০১–০২`) and English (`Table 03 / Seats 01–02`) labels.

---

## 🛠 Configuration

All wedding content and Bangla/English translations live in a single file:
- `src/config/weddingConfig.ts` (re-exported by `src/config/wedding.ts`)
