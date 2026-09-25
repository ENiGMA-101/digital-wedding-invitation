import type { Metadata } from "next";
import CinematicInvitation from "@/components/cinematic/CinematicInvitation";
import wedding from "@/config/weddingConfig";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${wedding.brideName.bn} ও ${wedding.groomName.bn} — ${wedding.brideName.en} & ${wedding.groomName.en}`,
  startDate: wedding.weddingDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  description: `${wedding.familyBlessingProse.bn} ${wedding.familyBlessingProse.en}`,
  location: {
    "@type": "Place",
    name: `${wedding.venue.en}, ${wedding.venueLine2.en}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: wedding.address.en[0],
      addressCountry: "BD",
      addressLocality: "Dhaka",
    },
  },
  organizer: {
    "@type": "Person",
    name: `${wedding.brideName.en} & ${wedding.groomName.en}`,
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript>
        <main
          style={{
            fontFamily: "Georgia, serif",
            padding: "24vh 24px",
            textAlign: "center",
            color: "#520e1a",
            background: "#f6efe2",
          }}
        >
          <h1>
            {wedding.brideName.bn} ও {wedding.groomName.bn}
          </h1>
          <p>
            {wedding.dateDisplay.bn} · {wedding.venue.bn}, {wedding.venueLine2.bn}
          </p>
          <p>{wedding.address.bn.join(", ")}</p>
        </main>
      </noscript>
      <CinematicInvitation />
    </>
  );
}
