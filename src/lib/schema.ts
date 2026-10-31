import { env } from '@/lib/env';
import { paymentMethods, siteConfig } from '@/config/site';
import type { ReviewSource } from '@/content/reviews';

/**
 * JSON-LD builders.
 *
 * What the live WordPress site emits today: WebPage, WebSite, BreadcrumbList and
 * a bare Organization with nothing but a logo. It emits no LocalBusiness, no
 * opening hours, no service area, and — despite having seven well-written FAQ
 * entries on the homepage and four more on /tarieven/ — no FAQPage. That is a
 * free rich-result the site is currently not claiming.
 *
 * What we deliberately do NOT emit: AggregateRating. The site displays "4,7/5"
 * but the figure has no verifiable public source, and the three on-page
 * testimonials are first-party, which does not qualify as a review source under
 * Google's policy. Unverifiable rating markup is a manual-action risk, so the
 * rating stays plain text until the client supplies a real source.
 */

const ORG_ID = `${env.NEXT_PUBLIC_SITE_URL}/#organization`;
const WEBSITE_ID = `${env.NEXT_PUBLIC_SITE_URL}/#website`;

/**
 * The business itself.
 *
 * Typed as ParkingFacility (a subtype of LocalBusiness) because that is what it
 * actually is, and it is the type Google maps to parking results.
 *
 * The PostalAddress is the shuttle PARKING LOCATION (Schipholweg 181), i.e. where
 * the facility physically is. It is not the registered business address, which
 * the site does not publish. No geo coordinates are emitted: none are confirmed
 * for this address.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ParkingFacility',
    '@id': ORG_ID,
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: `${env.NEXT_PUBLIC_SITE_URL}/`,
    telephone: siteConfig.phone.e164,
    email: siteConfig.email,
    image: `${env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`,
    logo: `${env.NEXT_PUBLIC_SITE_URL}/icon.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.shuttleParking.street,
      postalCode: siteConfig.shuttleParking.postalCode,
      addressLocality: siteConfig.shuttleParking.locality,
      addressRegion: siteConfig.shuttleParking.region,
      addressCountry: siteConfig.shuttleParking.country,
    },
    hasMap: siteConfig.shuttleParking.mapsUrl,
    areaServed: {
      '@type': 'Airport',
      name: 'Amsterdam Airport Schiphol',
      iataCode: 'AMS',
    },
    currenciesAccepted: 'EUR',
    // Read from the one list rather than retyped — this used to name three
    // methods while the footer named four different ones. See config/site.ts.
    paymentAccepted: paymentMethods.join(', '),
    // Legal identity, from the algemene voorwaarden. Dutch distance-selling law
    // requires the trader's identity and registration number to be discoverable.
    legalName: siteConfig.legal.entity,
    vatID: undefined,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'KvK',
      value: siteConfig.legal.kvk,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Parkeerdiensten Schiphol',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Valet Parkeren Schiphol',
            description:
              'Geef uw auto af tussen Vertrekhal 2 en 3 en kies tussen buiten of overdekt parkeren.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Shuttle Parkeren Schiphol',
            description:
              `U parkeert zelf bij de shuttleparkeerlocatie aan de ${siteConfig.shuttleParking.street} in ${siteConfig.shuttleParking.locality} en reist in ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten met de shuttlebus naar Schiphol.`,
          },
        },
      ],
    },
  };
}

/** The site as an entity, so search engines attach the name to the domain. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${env.NEXT_PUBLIC_SITE_URL}/`,
    name: siteConfig.name,
    description: siteConfig.tagline,
    inLanguage: siteConfig.locale,
    publisher: { '@id': ORG_ID },
  };
}

export type Crumb = { name: string; path: string };

/**
 * Breadcrumbs. `path` values keep their trailing slash so the URLs in the graph
 * match the canonical URLs exactly.
 */
export function breadcrumbSchema(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${env.NEXT_PUBLIC_SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * A single service, for /onze-services/.
 *
 * `provider` points at the organization node by @id rather than repeating it, so
 * the two service nodes and the business resolve to one entity in the graph
 * instead of three loosely-related ones.
 *
 * No `offers` block: it would need a price, and the price depends on duration
 * and options that only MyParking.pro can compute. An Offer with an invented or
 * "from" price that the booking flow then contradicts is worse than no Offer.
 */
export function serviceSchema({
  name,
  description,
  serviceType,
}: {
  name: string;
  description: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'Airport',
      name: 'Amsterdam Airport Schiphol',
      iataCode: 'AMS',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${env.NEXT_PUBLIC_SITE_URL}/reservering/`,
      servicePhone: siteConfig.phone.e164,
    },
  };
}

/**
 * /contact/. ContactPage is a small win — it tells Google the page is the
 * canonical place to reach this business, which is what it will surface for
 * "lang parkeren schiphol contact" and in the knowledge panel.
 */
export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${env.NEXT_PUBLIC_SITE_URL}/contact/`,
    name: 'Contact — Lang Parkeren Schiphol',
    mainEntity: { '@id': ORG_ID },
  };
}

/**
 * AggregateRating — emitted ONLY against a verified, public review source.
 *
 * Returns null when there is nothing to point at, and every call site renders
 * nothing rather than falling back to something plausible. That is deliberate:
 * this is the one piece of markup on the site that can attract a manual action,
 * and the safe default has to be silence.
 *
 * When it does emit, it carries `url` — the page a person (or Google) can open
 * to check the number. An AggregateRating without one is exactly the shape
 * Google treats as unverifiable.
 */
export function aggregateRatingSchema(source: ReviewSource) {
  if (!source.verified) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: { '@id': ORG_ID },
    ratingValue: source.score,
    bestRating: source.best,
    ratingCount: source.count,
    url: source.url,
  };
}

export type FaqItem = { question: string; answer: string };

/**
 * FAQPage. Rendered from the same typed content the accordion renders, so the
 * markup can never describe an answer the page does not actually show — which is
 * the usual way FAQ rich results get penalised.
 */
export function faqSchema(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Serialise for a <script type="application/ld+json">.
 *
 * `<` is escaped so a stray "</script>" inside any content string cannot break
 * out of the script element. React escapes text nodes but NOT the contents of
 * dangerouslySetInnerHTML, which is the only way to emit JSON-LD.
 */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
