/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BANGLADESHI MUSLIM WEDDING CONFIGURATION · SINGLE SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────────
 *  Edit ONLY this file to personalise names, parents, dates, venues,
 *  events, gallery images, Quranic verses and Bangla / English copy.
 */

export type Lang = "bn" | "en";

export type Bilingual<T = string> = {
  bn: T;
  en: T;
};

export type BangladeshiWeddingEvent = {
  id: "holud" | "mehendi" | "wedding" | "reception";
  number: Bilingual;
  name: Bilingual;
  subtitle: Bilingual;
  date: Bilingual;
  day: Bilingual;
  time: Bilingual;
  venue: Bilingual;
  address: Bilingual;
  attireNote: Bilingual;
  image: string;
  imageAlt: Bilingual;
  mapsUrl: string;
  accentHex: string;
};

export type GalleryItem = {
  src: string;
  alt: Bilingual;
  caption: Bilingual;
  tag: Bilingual;
  tall?: boolean;
};

const maps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const wedding = {
  defaultLang: "bn" as Lang,

  /* ── Monogram & Emblem ─────────────────────────────────── */
  monogram: {
    bn: "হা · এ",
    en: "H · E",
  },
  hashtag: {
    bn: "#হালিমা_এরতুগরুল_শুভবিবাহ",
    en: "#HalimaWedsErtugrul",
  },

  /* ── Bride & Groom ─────────────────────────────────────── */
  brideName: {
    bn: "হালিমা বিনতে নুমান",
    en: "Halima Binte Numan",
  },
  brideShortName: {
    bn: "হালিমা",
    en: "Halima",
  },
  groomName: {
    bn: "মোঃ এরতুগরুল বিন সুলেমান",
    en: "Md. Ertugrul Bin Suleman",
  },
  groomShortName: {
    bn: "এরতুগরুল",
    en: "Ertugrul",
  },

  /* ── Parents / Family Information ──────────────────────── */
  brideFather: {
    bn: "শাহজাদা নুমান",
    en: "Shahzada Numan",
  },
  brideMother: {
    bn: "মরিয়ম খাতুন",
    en: "Mariam Khatun",
  },
  brideFamilyTitle: {
    bn: "কনের পিতা ও মাতা",
    en: "Parents of the Bride",
  },
  brideLineage: {
    bn: "শাহজাদা নুমান ও মরিয়ম খাতুনের আদরের কন্যা",
    en: "Beloved daughter of Shahzada Numan & Mariam Khatun",
  },

  groomFather: {
    bn: "মরহুম সুলেমান শাহ",
    en: "Late Suleman Shah",
  },
  groomMother: {
    bn: "হায়মে খাতুন",
    en: "Hayme Khatun",
  },
  groomFamilyTitle: {
    bn: "বরের পিতা ও মাতা",
    en: "Parents of the Groom",
  },
  groomLineage: {
    bn: "মরহুম সুলেমান শাহ ও হায়মে খাতুনের সুযোগ্য পুত্র",
    en: "Worthy son of Late Suleman Shah & Hayme Khatun",
  },

  /* ── Quranic Verses (Verified) ─────────────────────────── */
  bismillah: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    bn: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে",
    en: "In the Name of Allah, the Most Gracious, the Most Merciful",
  },
  quranVerse: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    bn: "আর তাঁর নিদর্শনাবলীর মধ্যে রয়েছে যে, তিনি তোমাদের জন্য তোমাদেরই মধ্য হতে সঙ্গী সৃষ্টি করেছেন, যাতে তোমরা তাদের কাছে প্রশান্তি লাভ করতে পার এবং তিনি তোমাদের মধ্যে পারস্পরিক ভালোবাসা ও দয়া সৃষ্টি করেছেন। নিশ্চয়ই এতে চিন্তাশীল সম্প্রদায়ের জন্য নিদর্শনাবলী রয়েছে।",
    en: "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
    source: {
      bn: "আল-কুরআন · সূরা আর-রূম ৩০:২১",
      en: "Al-Qur'an · Surah Ar-Rum 30:21",
    },
  },
  blessingDua: {
    arabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    bn: "আল্লাহ তোমাদের উভয়ের জন্য বরকত দান করুন, তোমাদের ওপর রহমত বর্ষণ করুন এবং তোমাদের দুজনকে কল্যাণের সাথে একত্রিত করুন।",
    en: "May Allah bless you both, shower His blessings upon you, and unite you both in goodness.",
  },

  /* ── Primary Wedding Date & Venue ──────────────────────── */
  weddingDate: "2027-02-12T16:30:00+06:00",
  dateDisplay: {
    bn: "শুক্রবার · ১২ ফেব্রুয়ারি ২০২৭",
    en: "Friday · 12 February 2027",
  },
  banglaCalendarDate: {
    bn: "২৯ মাঘ ১৪৩৩ বঙ্গাব্দ · ৫ রজব ১৪৪৮ হিজরি",
    en: "29 Magh 1433 Bangabda · 5 Rajab 1448 Hijri",
  },
  dateShort: {
    bn: "১২ · ০২ · ২০২৭",
    en: "12 · 02 · 2027",
  },
  dayNumber: {
    bn: "১২",
    en: "12",
  },
  monthYear: {
    bn: "ফেব্রুয়ারি ২০২৭",
    en: "February 2027",
  },
  weddingTime: {
    bn: "পবিত্র আকদ বিকাল ৪:৩০ · প্রীতিভোজ রাত ৮:০০",
    en: "Sacred Akd 4:30 PM · Grand Dinner 8:00 PM",
  },

  venue: {
    bn: "রোজউড বলরুম",
    en: "Rosewood Ballroom",
  },
  venueLine2: {
    bn: "লা মেরিডিয়ান ঢাকা",
    en: "Le Méridien Dhaka",
  },
  address: {
    bn: ["৭৯/এ এয়ারপোর্ট রোড, নিকুঞ্জ-২", "ঢাকা ১২২৯, বাংলাদেশ"],
    en: ["79/A Airport Road, Nikunja-2", "Dhaka 1229, Bangladesh"],
  },
  googleMapsUrl: maps("Le Méridien Dhaka, 79/A Airport Road, Dhaka"),

  /* ── Invitation Prose & Ceremony Details ───────────────── */
  familyBlessingHeader: {
    bn: "আমাদের উভয় পরিবারের দোয়া ও আশীর্বাদে",
    en: "With the blessings of our families",
  },
  familyBlessingProse: {
    bn: "মহান আল্লাহ্‌ রাব্বুল আলামীনের অশেষ রহমতে এবং আমাদের শ্রদ্ধেয় পিতা-মাতা ও পরিবারের মুরুব্বিদের দোয়ায় আমরা জীবনের নতুন অধ্যায়ে পদার্পণ করতে যাচ্ছি। এই শুভক্ষণে আপনার ও আপনার পরিবারের সাদর উপস্থিতি আমাদের আনন্দকে পূর্ণতা দান করবে।",
    en: "By the infinite grace of Almighty Allah and the prayers of our beloved parents and elders, we embark upon the sacred covenant of marriage. Your gracious presence and heartfelt prayers will deeply honour both our families.",
  },
  ceremonyDetails: {
    kicker: {
      bn: "পবিত্র বিবাহ ও আকদ অনুষ্ঠান",
      en: "Sacred Marriage & Akd Ceremony",
    },
    title: {
      bn: "মাঙ্গলিক আয়োজন ও সময়সূচি",
      en: "Ceremony Schedule & Gatherings",
    },
    description: {
      bn: "ইসলামী শরীয়াহ মোতাবেক জুম্মার বরকতময় বিকেলে পবিত্র আকদ সম্পন্ন হবে এবং পরবর্তীতে দুই পরিবারের আত্মীয়-স্বজন ও শুভানুধ্যায়ীদের সম্মানে প্রীতিভোজের আয়োজন করা হয়েছে।",
      en: "The sacred Akd will be solemnized on a blessed Friday afternoon in accordance with Islamic tradition, followed by a celebratory banquet with family and cherished guests.",
    },
    highlights: [
      {
        label: { bn: "অতিথি অভ্যর্থনা", en: "Guest Reception" },
        value: { bn: "বিকাল ৪:০০ ঘটিকা", en: "4:00 PM" },
      },
      {
        label: { bn: "পবিত্র আকদ ও দোয়া", en: "Sacred Akd & Dua" },
        value: { bn: "বিকাল ৪:৩০ ঘটিকা", en: "4:30 PM" },
      },
      {
        label: { bn: "বরযাত্রী আগমন", en: "Groom's Procession" },
        value: { bn: "সন্ধ্যা ৬:৩০ ঘটিকা", en: "6:30 PM" },
      },
      {
        label: { bn: "শাহী প্রীতিভোজ", en: "Banquet Dinner" },
        value: { bn: "রাত ৮:০০ ঘটিকা", en: "8:00 PM" },
      },
    ],
  },

  /* ── 4 Bangladeshi Wedding Events ──────────────────────── */
  events: [
    {
      id: "holud",
      number: { bn: "পর্ব ০১", en: "Chapter 01" },
      name: { bn: "গায়ে হলুদ", en: "Gaye Holud" },
      subtitle: {
        bn: "কাঁচা হলুদ, গাঁদা ফুলের সাজ ও ঐতিহ্যবাহী উৎসব",
        en: "Turmeric blessings, marigold garlands & traditional festivities",
      },
      date: { bn: "০৯ ফেব্রুয়ারি ২০২৭", en: "09 February 2027" },
      day: { bn: "মঙ্গলবার", en: "Tuesday" },
      time: { bn: "সন্ধ্যা ৬:৩০ ঘটিকা – রাত ১০:৩০ ঘটিকা", en: "6:30 PM – 10:30 PM" },
      venue: { bn: "গুলশান লেকভিউ লন", en: "Gulshan Lakeview Lawn" },
      address: {
        bn: "বাড়ি ২৪, রোড ১১৩, গুলশান-২, ঢাকা ১২১২",
        en: "House 24, Road 113, Gulshan-2, Dhaka 1212",
      },
      attireNote: {
        bn: "পোশাকের রঙ: বাসন্তী হলুদ, কমলা ও সবুজ জামদানি/পাঞ্জাবি",
        en: "Attire: Mustard yellow, marigold & muted green Jamdani or Panjabi",
      },
      image: "/images/event-holud.jpg",
      imageAlt: {
        bn: "গায়ে হলুদের ঐতিহ্যবাহী মঞ্চে কনে ও বর",
        en: "Bangladeshi Gaye Holud ceremony with marigold garlands and traditional attire",
      },
      mapsUrl: maps("Gulshan 2 Road 113, Dhaka"),
      accentHex: "#c98a1b",
    },
    {
      id: "mehendi",
      number: { bn: "পর্ব ০২", en: "Chapter 02" },
      name: { bn: "মেহেদী সন্ধ্যা", en: "Mehendi Evening" },
      subtitle: {
        bn: "রাঙা মেহেদীর আলপনা, সুরের মূর্ছনা ও পারিবারিক আনন্দ",
        en: "Intricate henna artistry, acoustic melodies & family warmth",
      },
      date: { bn: "১০ ফেব্রুয়ারি ২০২৭", en: "10 February 2027" },
      day: { bn: "বুধবার", en: "Wednesday" },
      time: { bn: "সন্ধ্যা ৭:০০ ঘটিকা – রাত ১১:০০ ঘটিকা", en: "7:00 PM – 11:00 PM" },
      venue: { bn: "নুমান মঞ্জিল আঙিনা", en: "The Numan Residence Courtyard" },
      address: {
        bn: "বাড়ি ১৮, রোড ৭/এ, ধানমন্ডি, ঢাকা ১২০৯",
        en: "House 18, Road 7/A, Dhanmondi, Dhaka 1209",
      },
      attireNote: {
        bn: "পোশাকের রঙ: মেহেদী সবুজ, পান্না ও সোনালী কারুকাজ",
        en: "Attire: Henna green, emerald tones & soft gold accents",
      },
      image: "/images/gallery-6.jpg",
      imageAlt: {
        bn: "মেহেদী রাঙা হাতে ফুলের তোড়া",
        en: "Bangladeshi bride with intricate henna mehendi patterns holding roses",
      },
      mapsUrl: maps("Dhanmondi Road 7A, Dhaka"),
      accentHex: "#2d5a44",
    },
    {
      id: "wedding",
      number: { bn: "পর্ব ০৩", en: "Chapter 03" },
      name: { bn: "বিয়ে ও আকদ", en: "Wedding & Akd" },
      subtitle: {
        bn: "পবিত্র আকদ, কবুল ও নতুন জীবনের অঙ্গীকার",
        en: "The sacred Akd, vows of companionship & grand wedding",
      },
      date: { bn: "১২ ফেব্রুয়ারি ২০২৭", en: "12 February 2027" },
      day: { bn: "শুক্রবার", en: "Friday" },
      time: { bn: "আকদ বিকাল ৪:৩০ · প্রীতিভোজ রাত ৮:০০", en: "Akd 4:30 PM · Dinner 8:00 PM" },
      venue: { bn: "রোজউড বলরুম, লা মেরিডিয়ান ঢাকা", en: "Rosewood Ballroom, Le Méridien Dhaka" },
      address: {
        bn: "৭৯/এ এয়ারপোর্ট রোড, নিকুঞ্জ-২, ঢাকা ১২২৯",
        en: "79/A Airport Road, Nikunja-2, Dhaka 1229",
      },
      attireNote: {
        bn: "পোশাকের রঙ: ঐতিহ্যবাহী বেনারসি লাল/মেরুন, আইভরি ও শেরওয়ানি",
        en: "Attire: Traditional crimson/burgundy Benarasi, ivory & Sherwani",
      },
      image: "/images/gallery-1.jpg",
      imageAlt: {
        bn: "ঐতিহ্যবাহী বিয়ের পোশাকে কনে ও বর",
        en: "Bangladeshi bride in deep burgundy attire and groom in ivory sherwani",
      },
      mapsUrl: maps("Le Méridien Dhaka, Airport Road, Dhaka"),
      accentHex: "#7d1728",
    },
    {
      id: "reception",
      number: { bn: "পর্ব ০৪", en: "Chapter 04" },
      name: { bn: "বিবাহোত্তর সংবর্ধনা", en: "Wedding Reception" },
      subtitle: {
        bn: "নবদম্পতির সম্মানে দোয়া, সংবর্ধনা ও নৈশভোজ",
        en: "Formal reception in honour of the newlyweds & gala dinner",
      },
      date: { bn: "১৪ ফেব্রুয়ারি ২০২৭", en: "14 February 2027" },
      day: { bn: "রবিবার", en: "Sunday" },
      time: { bn: "সন্ধ্যা ৭:৩০ ঘটিকা – রাত ১১:৩০ ঘটিকা", en: "7:30 PM – 11:30 PM" },
      venue: {
        bn: "গ্র্যান্ড বলরুম, র‍্যাডিসন ব্লু ঢাকা ওয়াটার গার্ডেন",
        en: "Grand Ballroom, Radisson Blu Dhaka Water Garden",
      },
      address: {
        bn: "এয়ারপোর্ট রোড, ঢাকা সেনানিবাস, ঢাকা ১২০৬",
        en: "Airport Road, Dhaka Cantonment, Dhaka 1206",
      },
      attireNote: {
        bn: "পোশাকের রঙ: আইভরি, শ্যাম্পেইন গোল্ড ও মার্জিত ফরমাল",
        en: "Attire: Warm ivory, champagne gold & formal traditional wear",
      },
      image: "/images/gallery-4.jpg",
      imageAlt: {
        bn: "বিবাহোত্তর সংবর্ধনার রাজকীয় ডাইনিং ও ফুলের সাজ",
        en: "Candlelit Bangladeshi wedding reception banquet table with burgundy roses",
      },
      mapsUrl: maps("Radisson Blu Dhaka Water Garden"),
      accentHex: "#8c6a32",
    },
  ] satisfies BangladeshiWeddingEvent[],

  /* ── Wedding Gallery ───────────────────────────────────── */
  gallery: [
    {
      src: "/images/gallery-1.jpg",
      alt: {
        bn: "বিয়ের ঐতিহ্যবাহী পোশাকে হালিমা ও এরতুগরুল",
        en: "Halima and Ertugrul in traditional Bangladeshi wedding attire",
      },
      caption: {
        bn: "শুভ দৃষ্টি ও পবিত্র অঙ্গীকার",
        en: "Sacred vows at golden hour",
      },
      tag: { bn: "বিয়ে ও আকদ", en: "Wedding & Akd" },
      tall: true,
    },
    {
      src: "/images/event-holud.jpg",
      alt: {
        bn: "গায়ে হলুদের মঞ্চে গাঁদা ফুল ও আনন্দের মুহূর্ত",
        en: "Gaye Holud stage adorned with marigold garlands",
      },
      caption: {
        bn: "হলুদ সন্ধ্যার আনন্দ",
        en: "Marigold & turmeric blessings",
      },
      tag: { bn: "গায়ে হলুদ", en: "Gaye Holud" },
    },
    {
      src: "/images/gallery-2.jpg",
      alt: {
        bn: "মেহেদী রাঙা হাত ও বিয়ের আংটি",
        en: "Henna-adorned hands and gold wedding rings",
      },
      caption: {
        bn: "মেহেদীর আলপনা ও ভালোবাসার বন্ধন",
        en: "Henna artistry & eternal bond",
      },
      tag: { bn: "মেহেদী", en: "Mehendi" },
    },
    {
      src: "/images/gallery-3.jpg",
      alt: {
        bn: "ফুলের পাপড়ি ঝরা সন্ধ্যায় হাস্যোজ্জ্বল মুহূর্ত",
        en: "Couple smiling under a shower of flower petals",
      },
      caption: {
        bn: "ফুলের পাপড়ি ও মধুর হাসি",
        en: "Shower of rose & marigold petals",
      },
      tag: { bn: "উৎসব", en: "Celebration" },
    },
    {
      src: "/images/gallery-4.jpg",
      alt: {
        bn: "সংবর্ধনা অনুষ্ঠানের মোমবাতি ও গোলাপের সাজ",
        en: "Candlelit reception table setting with deep red roses",
      },
      caption: {
        bn: "অতিথি বরণের রাজকীয় আয়োজন",
        en: "Setting the reception banquet",
      },
      tag: { bn: "সংবর্ধনা", en: "Reception" },
    },
    {
      src: "/images/gallery-6.jpg",
      alt: {
        bn: "মেহেদী সন্ধ্যায় গোলাপ হাতে কনে",
        en: "Bride holding burgundy roses during her Mehendi ceremony",
      },
      caption: {
        bn: "মেহেদী সন্ধ্যার স্নিগ্ধতা",
        en: "Serenity of Mehendi evening",
      },
      tag: { bn: "মেহেদী সন্ধ্যা", en: "Mehendi Evening" },
      tall: true,
    },
  ] satisfies GalleryItem[],

  /* ── Reservation & Contacts ────────────────────────────── */
  reservationDeadline: {
    bn: "০৫ ফেব্রুয়ারি ২০২৭",
    en: "05 February 2027",
  },
  contacts: [
    {
      name: { bn: "শাহজাদা নুমান (কনের পিতা)", en: "Shahzada Numan (Bride's Father)" },
      phoneDisplay: { bn: "+৮৮০ ১৭১১-২৩৪৫৬৭", en: "+880 1711-234567" },
      tel: "+8801711234567",
    },
    {
      name: { bn: "হায়মে খাতুন পরিবার (বরের পক্ষ)", en: "Hayme Khatun Family (Groom's Side)" },
      phoneDisplay: { bn: "+৮৮০ ১৮১৯-৮৭৬৫৪৩", en: "+880 1819-876543" },
      tel: "+8801819876543",
    },
  ],

  /* ── Final Blessing ────────────────────────────────────── */
  finalMessage: {
    bn: "আপনাদের দোয়া ও উপস্থিতি আমাদের একান্ত কাম্য।",
    en: "Your prayers and gracious presence will be our greatest blessing.",
  },
  finalSubtext: {
    bn: "নবদম্পতির সুন্দর, বরকতময় ও শান্তিময় দাম্পত্য জীবনের জন্য আপনাদের দোয়া প্রার্থনা করছি।",
    en: "We humbly request your prayers for a blessed, tranquil and righteous life together.",
  },
  finalSignature: {
    bn: "বিনীত নিবেদক · উভয় পরিবারবর্গ",
    en: "Warmest regards · Both Families",
  },

  /* ── Media ─────────────────────────────────────────────── */
  coverImage: "/images/cover.jpg",
  musicUrl: "",

  /* ── UI Dictionary (Bangla & English) ──────────────────── */
  ui: {
    tapToOpen: {
      bn: "আমন্ত্রণপত্র খুলতে স্পর্শ করুন",
      en: "Tap to Open Invitation",
    },
    tapSubhint: {
      bn: "একটি বিশেষ আমন্ত্রণ আপনার অপেক্ষায়",
      en: "A personal wedding invitation awaits your touch",
    },
    scrollToUnfold: {
      bn: "ধীরে ধীরে নিচে স্ক্রল করে আমন্ত্রণপত্রটি উন্মোচন করুন",
      en: "Scroll gently to unfold the invitation",
    },
    sacredInvitationKicker: {
      bn: "শুভ বিবাহের আমন্ত্রণপত্র",
      en: "Sacred Wedding Invitation",
    },
    theWeddingOf: {
      bn: "শুভ পরিণয়",
      en: "The Wedding Of",
    },
    brideLabel: {
      bn: "কনে",
      en: "The Bride",
    },
    groomLabel: {
      bn: "বর",
      en: "The Groom",
    },
    andConnector: {
      bn: "এবং",
      en: "&",
    },
    parentsSectionKicker: {
      bn: "পরিবার পরিচিতি ও দোয়া",
      en: "Honoured Families",
    },
    parentsSectionTitle: {
      bn: "শ্রদ্ধেয় পিতা-মাতা",
      en: "Our Beloved Parents",
    },
    sonOf: {
      bn: "পুত্র",
      en: "Son of",
    },
    daughterOf: {
      bn: "কন্যা",
      en: "Daughter of",
    },
    fatherLabel: {
      bn: "পিতা",
      en: "Father",
    },
    motherLabel: {
      bn: "মাতা",
      en: "Mother",
    },
    dateSectionKicker: {
      bn: "শুভ দিনক্ষণ",
      en: "The Auspicious Date",
    },
    eventsSectionKicker: {
      bn: "মাঙ্গলিক অনুষ্ঠানমালা",
      en: "Wedding Celebrations",
    },
    eventsSectionTitle: {
      bn: "চার পর্বের আনন্দ আয়োজন",
      en: "Four Chapters of Joy",
    },
    eventsSectionIntro: {
      bn: "গায়ে হলুদ, মেহেদী সন্ধ্যা, পবিত্র আকদ ও বিবাহোত্তর সংবর্ধনা—প্রতিটি পর্বে আপনার উপস্থিতি আমাদের একান্ত কাম্য।",
      en: "From the vibrant turmeric blessings of Gaye Holud to the sacred Akd and grand Reception — we look forward to welcoming you at every celebration.",
    },
    viewMapBtn: {
      bn: "মানচিত্রে স্থান দেখুন",
      en: "View Location on Map",
    },
    venueSectionKicker: {
      bn: "অনুষ্ঠানস্থল ও ঠিকানা",
      en: "Primary Venue & Directions",
    },
    venueSectionTitle: {
      bn: "বিবাহ ও আকদ প্রাঙ্গণ",
      en: "The Wedding Venue",
    },
    venueHospitalityNote: {
      bn: "গাড়ি পার্কিংয়ের সুব্যবস্থা রয়েছে · নির্ধারিত সময়ে উপস্থিত হয়ে আমাদের বাধিত করবেন",
      en: "Complimentary valet parking available · Doors open at 4:00 PM",
    },
    addToCalendarBtn: {
      bn: "ক্যালেন্ডারে যুক্ত করুন",
      en: "Add to Calendar",
    },
    gallerySectionKicker: {
      bn: "স্মৃতির পাতা",
      en: "Cherished Frames",
    },
    gallerySectionTitle: {
      bn: "আনন্দঘন মুহূর্তসমূহ",
      en: "Wedding Gallery",
    },
    gallerySectionSub: {
      bn: "যেকোনো ছবিতে স্পর্শ করে বড় পর্দায় দেখুন",
      en: "Tap any photograph to view in full screen",
    },
    reservationSectionKicker: {
      bn: "অতিথি আসন সংরক্ষণ",
      en: "Wedding Reservation",
    },
    reservationSectionTitle: {
      bn: "আপনার উপস্থিতি নিশ্চিত করুন",
      en: "Confirm Your Reservation",
    },
    reservationSectionNote: {
      bn: "আপনাদের সাদর অভ্যর্থনা ও আসন সুবিন্যস্ত করার সুবিধার্থে অনুগ্রহ করে ০৫ ফেব্রুয়ারি ২০২৭-এর মধ্যে আপনার আসন সংরক্ষণ নিশ্চিত করুন।",
      en: "To help us prepare your welcome and assign your banquet table, kindly complete your reservation by 05 February 2027.",
    },
    willAttendBtn: {
      bn: "ইনশাআল্লাহ উপস্থিত থাকব · আসন সংরক্ষণ করুন",
      en: "Will Attend · Reserve Seat",
    },
    cannotAttendBtn: {
      bn: "উপস্থিত হতে পারছি না · দোয়া পাঠান",
      en: "Unable to Attend · Send Prayers",
    },
    openReservationModalBtn: {
      bn: "ওয়েডিং রিজার্ভেশন ফরম খুলুন",
      en: "Open Wedding Reservation",
    },
    seatSectionKicker: {
      bn: "স্বয়ংক্রিয় আসন বিন্যাস",
      en: "Guest Seat Allocation",
    },
    seatSectionTitle: {
      bn: "আসন ও টেবিল বরাদ্দ",
      en: "Banquet Table & Seat Assignment",
    },
    seatSectionDesc: {
      bn: "রিজার্ভেশন সম্পন্ন করার সাথে সাথে অতিথি সংখ্যা অনুযায়ী স্বয়ংক্রিয়ভাবে আপনার টেবিল ও আসন নম্বর বরাদ্দ করা হয়।",
      en: "Upon completing your reservation, seats are automatically allocated together at our banquet tables based on your party size.",
    },
    yourAssignedSeatHeader: {
      bn: "আপনার নিশ্চিতকৃত আসন কার্ড",
      en: "Your Confirmed Seat Pass",
    },
    sampleAllocationTitle: {
      bn: "স্বয়ংক্রিয় আসন বরাদ্দের উদাহরণ",
      en: "How Automatic Seat Allocation Works",
    },
    recentGuestAllocationsTitle: {
      bn: "সাম্প্রতিক নিশ্চিতকৃত অতিথিবৃন্দ",
      en: "Recently Assigned Guest Tables",
    },
    guestNameLabel: {
      bn: "অতিথির নাম",
      en: "Guest Name",
    },
    mobileNumberLabel: {
      bn: "মোবাইল নম্বর",
      en: "Mobile Number",
    },
    guestCountLabel: {
      bn: "অতিথি সংখ্যা",
      en: "Number of Guests",
    },
    attendanceLabel: {
      bn: "উপস্থিতি নিশ্চিতকরণ",
      en: "Attendance Confirmation",
    },
    tableNumberLabel: {
      bn: "টেবিল নম্বর",
      en: "Table Number",
    },
    seatNumbersLabel: {
      bn: "আসন নম্বর",
      en: "Seat Number(s)",
    },
    messageLabel: {
      bn: "নবদম্পতির জন্য দোয়া বা বার্তা (ঐচ্ছিক)",
      en: "Blessing or Note for the Couple (Optional)",
    },
    guestNamePlaceholder: {
      bn: "আপনার পূর্ণ নাম লিখুন",
      en: "Enter your full name",
    },
    mobilePlaceholder: {
      bn: "০১৭XXXXXXXX",
      en: "+880 17XX-XXXXXX",
    },
    messagePlaceholder: {
      bn: "নবদম্পতির জন্য আপনার দোয়া বা বিশেষ কোনো তথ্য...",
      en: "Share your prayers, blessings or dietary notes...",
    },
    attendingOption: {
      bn: "ইনশাআল্লাহ উপস্থিত থাকব",
      en: "Will Attend",
    },
    declinedOption: {
      bn: "উপস্থিত হতে পারছি না",
      en: "Unable to Attend",
    },
    submitReservationBtn: {
      bn: "আসন সংরক্ষণ নিশ্চিত করুন",
      en: "Confirm Wedding Reservation",
    },
    reservationConfirmedTitle: {
      bn: "আপনার আসন সংরক্ষণ নিশ্চিত হয়েছে।",
      en: "Your reservation has been confirmed.",
    },
    reservationDeclinedTitle: {
      bn: "আপনার বার্তা ও দোয়ার জন্য আন্তরিক ধন্যবাদ।",
      en: "Thank you for your warm prayers and message.",
    },
    closeBtn: {
      bn: "বন্ধ করুন",
      en: "Close",
    },
    finalSectionKicker: {
      bn: "দোয়া ও শুভকামনা",
      en: "Final Blessing & Farewell",
    },
    closeInvitationBtn: {
      bn: "আমন্ত্রণপত্রটি পুনরায় ভাঁজ করুন",
      en: "Fold & Replay Invitation",
    },
    endOfLetterNote: {
      bn: "আমন্ত্রণপত্রের সমাপ্তি · উপরে স্ক্রল করে পুনরায় দেখুন",
      en: "End of the invitation · Scroll up to revisit",
    },
    swipeGalleryNote: {
      bn: "পরবর্তী ছবি দেখতে বামে বা ডানে সোয়াইপ করুন",
      en: "Swipe or use arrows to browse photographs",
    },
  },
} as const;

export type WeddingConfig = typeof wedding;
export default wedding;
