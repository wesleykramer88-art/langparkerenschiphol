import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { siteConfig } from '@/config/site';

/**
 * Metadata plumbing.
 *
 * Titles and descriptions below are carried over VERBATIM from the live
 * WordPress site wherever they exist. They are already indexed and the client
 * considers them SEO-solid, so rewriting them would discard ranking signal for
 * no gain. The one exception is /contact/, which shipped with no meta
 * description at all — Elementor auto-generated an og:description by scraping
 * the page body, which is why the indexed snippet reads as a run-on sentence.
 * That one is newly written.
 */

type PageSeo = {
  /** Full <title>. Not templated — these exact strings are indexed. */
  title: string;
  description: string;
  /** Path including trailing slash, matching the indexed URL exactly. */
  path: string;
};

export const pageSeo = {
  home: {
    title: 'Lang parkeren Schiphol | Shuttle & Valet',
    description:
      'Lang parkeren bij Schiphol met valet of shuttle. Reserveer eenvoudig uw parkeerplaats bij een onafhankelijke aanbieder.',
    path: '/',
  },
  services: {
    title: 'Shuttle of valet parkeren bij Schiphol? Vergelijk',
    description:
      'Twijfelt u tussen shuttle en valet? Vergelijk aankomst, sleutel, transfer naar de vertrekhal en prijsberekening en kies wat bij uw reis past.',
    path: '/onze-services/',
  },
  rates: {
    title: 'Kosten lang parkeren Schiphol | Shuttle & Valet',
    description:
      'Bereken de kosten voor lang parkeren bij Schiphol met shuttle of valet. Zie hoe de prijs ontstaat, welke opties gelden en reken uw reisduur door.',
    path: '/tarieven/',
  },
  partners: {
    title: 'Parkeerpartner Schiphol | Samenwerken | Lang Parkeren Schiphol',
    description:
      'Parkeerpartner Schiphol worden? Bied uw klanten valet en shuttle parkeren aan, ontvang commissie en werk met ons samen.',
    path: '/samenwerken/',
  },
  contact: {
    title: 'Contact & parkeerlocaties | Lang Parkeren Schiphol',
    description:
      'Vragen over uw reservering of de aankomst? Bekijk telefoonnummer, e-mailadres, het adres van het shuttleterrein en de overdrachtslocatie voor valet.',
    path: '/contact/',
  },
  booking: {
    title: 'Parkeerplaats Schiphol Reserveren | Lang Parkeren Schiphol',
    description:
      'Parkeerplaats Schiphol reserveren? Kies valet of shuttle, vul uw reisgegevens in en reserveer eenvoudig en veilig online.',
    path: '/reservering/',
  },

  // ── New pages. No indexed title to preserve, so these are written to earn
  // the click rather than to match what is already there.
  login: {
    // The live /login/ page exists and is indexed under "Login - Lang Parkeren
    // Schiphol", which describes a form rather than a reason to use it. The URL
    // is kept (it has whatever equity it has); the title is not, because
    // "Klantenportaal" is what people search and "10% korting" is why they click.
    title: 'Klantenportaal - Lang Parkeren Schiphol | 10% Klantenkorting',
    description:
      'Log in op uw klantenportaal van Lang Parkeren Schiphol. Beheer uw reserveringen, bekijk facturen en profiteer van 10% korting op iedere boeking. Ook zakelijke accounts.',
    path: '/login/',
  },
  why: {
    title: 'Veilig Parkeren Schiphol | Vertrouwd | Lang Parkeren Schiphol',
    description:
      'Veilig parkeren Schiphol zonder zorgen. Ontdek hoe wij uw auto beveiligen en waarom reizigers kiezen voor Lang Parkeren Schiphol.',
    path: '/waarom-lang-parkeren-schiphol/',
  },
  reviews: {
    title: 'Lang Parkeren Schiphol Ervaringen | Echte Klantreacties',
    description:
      'Lang parkeren schiphol ervaringen van reizigers. Ontdek wat klanten zeggen over onze service, veiligheid en het parkeren.',
    path: '/reviews/',
  },
  // ── The service + SEO cluster, August 2026 ─────────────────────────────────
  // Seven new pages, none of them competing with the homepage and none with
  // each other. The homepage owns the brand query ("lang parkeren schiphol")
  // and stays generic across both services; each page below owns exactly one
  // intent, and no two titles lead with the same noun phrase.
  //
  // Descriptions are written to the same length as the indexed ones above
  // (150–160 chars) so the snippet is not truncated mid-clause, and each one
  // states a concrete fact the page actually contains rather than restating the
  // title in a sentence.
  shuttleParking: {
    // The commercial page for the product that is roughly 90% of bookings, and
    // the hub of the cluster. "shuttle parkeren schiphol" is the head term.
    title: 'Shuttle parkeren Schiphol | Sleutel mee op reis',
    description:
      'Shuttle parkeren bij Schiphol met transfer naar de terminal. Parkeer zelf, neem uw sleutel mee en reserveer eenvoudig online.',
    path: '/shuttle-parkeren-schiphol/',
  },
  valetParking: {
    // Deliberately "valet parking", not "valet parkeren": the Dutch market
    // searches the English term for this service, and the client's own live
    // page has always been headed Valet Parking.
    title: 'Valet parking Schiphol | Afgeven bij de vertrekhal',
    description:
      'Valet parking bij Schiphol: u geeft uw auto af tussen Vertrekhal 2 en 3 en krijgt hem op dezelfde plek terug. Lees hoe overdracht en sleutelbeheer werken.',
    path: '/valet-parking-schiphol/',
  },
  cheapShuttle: {
    title: 'Goedkoop Parkeren Schiphol | Voordelig Shuttle Parkeren',
    description:
      'Goedkoop lang parkeren bij Schiphol met shuttleservice. Ontdek waarom shuttle parkeren voordeliger uitpakt per dag, en waarom voordelig niet onveilig hoeft te zijn.',
    path: '/goedkoop-shuttle-parkeren-schiphol/',
  },
  keepKeys: {
    title: 'Parkeren Schiphol Zonder Sleutel Inleveren | Sleutel Mee op Reis',
    description:
      'Liever uw autosleutel meenemen op reis? Bij shuttle parkeren parkeert u zelf en houdt u uw sleutel. Lees hoe dat werkt en wat dat betekent voor uw parkeerplek.',
    path: '/parkeren-schiphol-zonder-sleutel-inleveren/',
  },
  safeParking: {
    title: 'Veilig parkeren Schiphol | Beveiligingsmaatregelen',
    description:
      'Welke maatregelen beschermen uw auto tijdens uw reis? Lees over cameratoezicht, toegang tot het terrein en ritregistratie bij valet.',
    path: '/veilig-parkeren-schiphol/',
  },
  selfParking: {
    title: 'Zelf Parkeren Schiphol | U Zet Uw Auto Zelf Neer',
    description:
      'Zelf uw auto parkeren bij Schiphol op het shuttleterrein. U weet waar hij staat, houdt de sleutel en stapt in de shuttle naar de vertrekhal. Zo werkt het.',
    path: '/zelf-parkeren-schiphol/',
  },
  rideRegistration: {
    // Valet-only. The slug is the thing itself rather than a query — nobody
    // searches "digitale ritregistratie", and that is fine: this page exists to
    // be LINKED to at the moment a visitor hesitates about handing over a car,
    // not to be found cold.
    title: 'Ritregistratie Systeem | Veilig | Lang Parkeren Schiphol',
    description:
      'Bij Valet parkeren worden route, snelheid en duur van de rit digitaal vastgelegd. Lees hoe de ritregistratie werkt.',
    path: '/digitale-ritregistratie/',
  },

  terms: {
    // The terms used to live on valetparkingschiphol.nl. The slug matches the
    // one they were published under there, so the old URL can be redirected to
    // this one without inventing a new path.
    title: 'Algemene voorwaarden - Lang Parkeren Schiphol',
    description:
      'De algemene voorwaarden van The Parking Company voor valet en shuttle parkeren bij Schiphol: reserveren, annuleren, schade melden, aansprakelijkheid en betaling.',
    path: '/algemene-voorwaarden/',
  },
} as const satisfies Record<string, PageSeo>;

export type PageSeoKey = keyof typeof pageSeo;

/**
 * Build a complete Metadata object for a route: canonical, OpenGraph and
 * Twitter, all derived from one entry so they can never drift apart.
 */
export function createMetadata(key: PageSeoKey): Metadata {
  const page = pageSeo[key];
  const url = `${env.NEXT_PUBLIC_SITE_URL}${page.path}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      url,
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — valet en shuttle parkeren op Amsterdam Airport Schiphol`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/opengraph-image.png'],
    },
  };
}
