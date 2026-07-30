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
