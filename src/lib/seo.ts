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
    title: 'Home - Lang Parkeren Schiphol | Veilig Valet & Shuttle Parkeren',
    description:
      'Lang parkeren bij Schiphol? Kies voor veilig valet of shuttle parkeren met 24/7 camerabewaking, snelle service en directe reservering. Boek vandaag nog online.',
    path: '/',
  },
  services: {
    title: 'Onze Services - Valet & Shuttle Parkeren Schiphol',
    description:
      'Ontdek onze parkeerdiensten bij Schiphol. Kies voor valet parkeren of shuttle parkeren en profiteer van veilige, snelle en betrouwbare service.',
    path: '/onze-services/',
  },
  rates: {
    title: 'Tarieven Lang Parkeren Schiphol | Voordelige Parkeertarieven',
    description:
      'Tarieven lang parkeren Schiphol inzien? Bekijk onze voordelige prijzen voor betrouwbaar valet- of shuttle parkeren en bereken direct jouw prijs online!',
    path: '/tarieven/',
  },
  partners: {
    title: 'Reisbureaus - Partner Worden van Lang Parkeren Schiphol',
    description:
      'Wilt u samenwerken met Lang Parkeren Schiphol? Ontdek onze mogelijkheden voor zakelijke partners, reisorganisaties, affiliates en strategische samenwerkingen.',
    path: '/samenwerken/',
  },
  contact: {
    title: 'Contact - Lang Parkeren Schiphol',
    // NEW. The live page has no meta description; the indexed snippet is
    // scraped body text. Written to the same length and voice as the others.
    description:
      'Neem contact op met Lang Parkeren Schiphol. Bel, mail of stuur het formulier in voor reserveringen, wijzigingen of vragen — doorgaans reageren wij binnen 1 uur.',
    path: '/contact/',
  },
  booking: {
    title: 'Reservering - Boek Veilig Valet of Shuttle Parkeren',
    description:
      'Reserveer eenvoudig uw parkeerplaats bij Schiphol. Kies voor valet of shuttle parkeren en profiteer van veilige parkeerlocaties, snelle service en scherpe tarieven.',
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
    // The slug IS the query. Dutch travellers type "waarom lang parkeren
    // schiphol" and variants of it, and no page on the live site answers that
    // question in one place.
    title: 'Waarom Lang Parkeren Schiphol | 15 Jaar Ervaring & Beveiligd Parkeren',
    description:
      'Al meer dan 15 jaar valet en shuttle parkeren op Schiphol. Lees hoe wij uw auto beveiligen, wat er stap voor stap gebeurt en wat we doen bij vertraging of vervroegde landing.',
    path: '/waarom-lang-parkeren-schiphol/',
  },
  reviews: {
    title: 'Ervaringen & Reviews - Lang Parkeren Schiphol',
    description:
      'Lees de ervaringen van reizigers die hun auto bij Lang Parkeren Schiphol parkeerden. Echte reacties over de overdracht, de shuttle en de staat van de auto bij terugkomst.',
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
    title: 'Shuttle Parkeren Schiphol | Zelf Parkeren, Sleutel Mee op Reis',
    description:
      'Shuttle parkeren bij Schiphol: u parkeert zelf op ons beveiligde terrein, neemt uw sleutel mee en bent binnen 5 tot 8 minuten bij de vertrekhal. Direct reserveren.',
    path: '/shuttle-parkeren-schiphol/',
  },
  valetParking: {
    // Deliberately "valet parking", not "valet parkeren": the Dutch market
    // searches the English term for this service, and the client's own live
    // page has always been headed Valet Parking.
    title: 'Valet Parking Schiphol | Auto Afgeven bij de Vertrekhal',
    description:
      'Valet parking op Schiphol: rijd tot de vertrekhal, geef uw auto af aan onze chauffeur en loop direct door. Iedere rit digitaal geregistreerd. Reserveer online.',
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
      'Liever uw autosleutel meenemen op reis? Bij shuttle parkeren parkeert u zelf en houdt u uw sleutel. Lees hoe dat werkt en waarom het samengaat met een bewaakt terrein.',
    path: '/parkeren-schiphol-zonder-sleutel-inleveren/',
  },
  safeParking: {
    title: 'Veilig Parkeren Schiphol | Bewaakt en Afgesloten Terrein',
    description:
      'Veilig parkeren bij Schiphol: afgesloten terrein, 24/7 camerabewaking en een vaste procedure bij afgifte en terugkomst. Lees wat er precies met uw auto gebeurt.',
    path: '/veilig-parkeren-schiphol/',
  },
  selfParking: {
    title: 'Zelf Parkeren Schiphol | U Zet Uw Auto Zelf Neer',
    description:
      'Zelf uw auto parkeren bij Schiphol op ons bewaakte terrein. U weet waar hij staat, houdt de sleutel en stapt in de shuttle naar de vertrekhal. Zo werkt het.',
    path: '/zelf-parkeren-schiphol/',
  },
  rideRegistration: {
    // Valet-only. The slug is the thing itself rather than a query — nobody
    // searches "digitale ritregistratie", and that is fine: this page exists to
    // be LINKED to at the moment a visitor hesitates about handing over a car,
    // not to be found cold.
    title: 'Digitale Ritregistratie | Lang Parkeren Schiphol',
    description:
      'Tijdens iedere valetrit registreren wij route, snelheid en duur digitaal. Lees wat er wordt vastgelegd, wie het kan inzien en waarom wij dit doen.',
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
