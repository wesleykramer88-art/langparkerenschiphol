import type { NextConfig } from 'next';
import { DEVICE_SIZES, IMAGE_SIZES } from './src/config/image-sizes';
import { PARKINGPRO_ORIGIN } from './src/lib/parkingpro';

/**
 * The MyParkingPro origin is the ONLY host allowed to be framed.
 *
 * Imported from src/lib/parkingpro.ts rather than re-read from the environment
 * here. It was written out twice — once there, once in this file — with a
 * comment warning that the two must not drift. A comment is not a mechanism:
 * if they ever disagreed, every booking iframe on the site would be blocked by
 * the CSP, and the symptom is a blank white box with nothing in any log.
 *
 * That module has no imports of its own, so pulling it in here is free, and
 * Next loads .env files before evaluating this config, so the value it resolves
 * is the same one the application will use.
 */

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` on script-src is required by Next's inline bootstrap and
 * hydration payload. Removing it means moving to a nonce-based policy in
 * middleware, which forces every page onto dynamic rendering — a real LCP cost
 * on a site whose pages are otherwise fully static. This site handles no
 * credentials and no payment data (both live inside the MyParking.pro origin),
 * so the static-render win is the right trade. Revisit if we ever take payment
 * details on our own domain.
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Dev-only CSP relaxation.
 *
 * Turbopack drives hot reload over a websocket, and `connect-src 'self'` does
 * NOT cover the ws: scheme — the browser blocked the connection and logged a CSP
 * violation on every dev page load. These entries are appended in development
 * only; the production policy stays exactly as strict as it was.
 */
const devConnectSrc = isDev ? ' ws://localhost:* http://localhost:* ws://127.0.0.1:*' : '';

/**
 * Vercel Analytics, in development only.
 *
 * In production `@vercel/analytics` is served from /_vercel/insights/script.js
 * on our own origin, which `'self'` already covers. In development it loads the
 * debug build from va.vercel-scripts.com instead, so without this the dev
 * console reports a CSP violation on every page load for something that is not
 * actually broken in production — noise that buries real violations, which is
 * exactly how the blocked Ads collector above went unnoticed.
 */
const devScriptSrc = isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : '';

/**
 * Hosts the Google tagging stack needs, split by what each one is for.
 *
 * The previous policy allowed only GA4's two hosts, which was correct when the
 * site loaded gtag.js for analytics and nothing else. It now runs a Tag Manager
 * container with a Google Ads destination, and CONVERSION TRACKING USES A
 * DIFFERENT SET OF HOSTS ENTIRELY. Left as it was, GA4 would have kept working
 * — masking the problem — while every Ads conversion ping was blocked by the
 * browser. The only symptom is zero conversions in an account that looks
 * correctly configured, which is close to undiagnosable from the Ads UI.
 *
 * Written out per-host rather than as `https://*.google.com`, so that widening
 * this is a deliberate edit and it stays obvious what each entry buys.
 */
/**
 * Google's country domains, for the conversion and remarketing pings.
 *
 * These are not interchangeable with google.com. Google 302s the ping to the
 * ccTLD of the VISITOR's country, and CSP is checked again after the redirect —
 * so a missing entry drops that country's traffic only. It reads in the Ads UI
 * as a regional performance dip rather than as a tagging fault, which is close
 * to undiagnosable from inside the account.
 *
 * Observed on 2026-08-07: testing production from Pakistan, the 1p-user-list
 * ping redirected to www.google.com.pk and was refused. Dutch and Belgian
 * visitors were never affected — .nl and .be were already here, and they are
 * effectively all of this business's customers. The rest of the list is the
 * European markets Schiphol actually flies, added because the cost of an entry
 * is nothing and the cost of a missing one is silent.
 *
 * CSP has no wildcard for TLDs, so this has to be enumerated. `.com.pk` is
 * deliberately included: it is where this site is developed from, and a
 * developer whose own test pings fail cannot tell a real fault from a local one.
 */
const GOOGLE_CCTLDS = [
  'https://www.google.com',
  'https://www.google.nl',
  'https://www.google.be',
  'https://www.google.de',
  'https://www.google.fr',
  'https://www.google.co.uk',
  'https://www.google.es',
  'https://www.google.it',
  'https://www.google.pl',
  'https://www.google.at',
  'https://www.google.ch',
  'https://www.google.dk',
  'https://www.google.se',
  'https://www.google.no',
  'https://www.google.ie',
  'https://www.google.pt',
  'https://www.google.com.pk',
] as const;

const GOOGLE_TAGGING = {
  /** gtm.js, and the Ads conversion library it loads. */
  script: ['https://www.googletagmanager.com', 'https://www.googleadservices.com'],

  /**
   * Conversion and remarketing pixels. Google Ads fires its conversion ping as
   * an IMAGE against the country domain the visitor resolves — .nl and .be
   * carry almost all of this site's traffic, with .com as the fallback. A
   * missing ccTLD here silently drops the conversions from that country only,
   * which reads as a regional performance dip rather than a tagging fault.
   */
  image: [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    /**
     * The Ads conversion/remarketing collector. Observed being refused in the
     * browser console on 2026-08-06 — `/ccm/collect` was blocked both as an
     * image and on fetch, with `tid=AW-934465672` in the query string. That is
     * this account's conversion ping, dropped by our own policy.
     */
    'https://pagead2.googlesyndication.com',
    ...GOOGLE_CCTLDS,
  ],

  /** GA4 measurement protocol, plus the Ads conversion beacon on fetch/XHR. */
  connect: [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://region1.google-analytics.com',
    'https://analytics.google.com',
    'https://stats.g.doubleclick.net',
    'https://googleads.g.doubleclick.net',
    'https://www.googleadservices.com',
    // See the note in `image` — same collector, blocked on fetch as well.
    'https://pagead2.googlesyndication.com',
    /**
     * A Merchant Center destination (MC-K92E09J4XT) is configured on the
     * client's Google tag and beacons here. We did not add it and may not want
     * it, but while it is on the tag its requests are ours to allow or to
     * refuse — and a console full of blocked beacons hides the ones that matter.
     * TODO(client): if Merchant Center is not in use, remove that destination in
     * GTM and this entry with it.
     */
    'https://www.merchant-center-analytics.goog',
    // The other half of the Tag Assistant debug channel — see `frame` below.
    // The frame is how it connects; this is how the two exchange state.
    'https://tagassistant.google.com',
    ...GOOGLE_CCTLDS,
  ],

  /**
   * The conversion linker's cross-domain iframe. This is what preserves the
   * gclid across the hop to the payment provider and back; without it, paid
   * bookings are attributed to direct traffic.
   *
   * tagassistant.google.com is GTM's debug channel. When a page is opened with
   * `?gtm_debug=`, the container embeds a frame there and talks to it; blocked,
   * the page loads perfectly and Tag Assistant reports "Could not connect",
   * which is what happened on 2026-08-07 while verifying the conversion tag.
   *
   * This does NOT let Google embed this site — `frame-ancestors 'none'` still
   * refuses that, and stays. This is the opposite direction: our page reaching
   * out to a Google origin we already trust with the container script itself.
   * Kept permanently rather than behind a dev flag, because the tag being
   * verified only fires on production data.
   */
  frame: ['https://td.doubleclick.net', 'https://tagassistant.google.com'],
} as const;

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GOOGLE_TAGGING.script.join(' ')}${devScriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${GOOGLE_TAGGING.image.join(' ')}`,
  "font-src 'self'",
  `connect-src 'self' ${GOOGLE_TAGGING.connect.join(' ')}${devConnectSrc}`,
  `frame-src ${PARKINGPRO_ORIGIN} ${GOOGLE_TAGGING.frame.join(' ')}`,
  /**
   * Kept at 'none', which means GTM's own Preview mode will NOT be able to
   * embed this site — Tag Assistant loads the page in an iframe on
   * tagassistant.google.com and this policy refuses it.
   *
   * That is the intended trade. The alternative is allowing a Google origin to
   * frame the live site permanently to make debugging convenient, and debugging
   * has a first-class answer that costs nothing: the Tag Assistant Companion
   * Chrome extension drives Preview in a normal tab, with no framing at all.
   * Use that.
   */
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Would rewrite http://localhost to https:// during local development.
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const nextConfig: NextConfig = {
  /**
   * NON-NEGOTIABLE. Every URL on the live site is indexed with a trailing slash
   * and carries backlinks. With this off, /tarieven/ would 301 to /tarieven,
   * bleeding link equity across the whole migration.
   */
  trailingSlash: true,

  reactStrictMode: true,

  // Do not advertise the framework version.
  poweredByHeader: false,

  images: {
    // AVIF first, WebP fallback. Meaningful on a site whose hero is photographic.
    formats: ['image/avif', 'image/webp'],
    // Stated explicitly rather than left to the defaults, because <HeroPhoto>
    // builds a srcset by hand for its art-directed <picture> and the optimiser
    // 400s on any width outside these lists. One array, two consumers — see
    // src/config/image-sizes.ts for what happens when they disagree.
    deviceSizes: [...DEVICE_SIZES],
    imageSizes: [...IMAGE_SIZES],
  },

  experimental: {
    // Tree-shake icon imports so one lucide icon does not pull in the set.
    optimizePackageImports: ['lucide-react', 'motion'],
  },

  /**
   * The shadow page set.
   *
   * A second, older copy of the whole site is still live and still `index,
   * follow`: /old-home/, /old-onze-services/, /old-tarieven/, /old-samenwerken/,
   * /contact-us/ and — worst of the six — /reserveren/, whose <title> is
   * literally "Old RESERVEREN".
   *
   * /reserveren/ and /reservering/ are two indexable booking pages competing for
   * the same queries on the same domain. Google has to pick one and split the
   * signals between them; every backlink and every bit of relevance that lands
   * on the wrong one is wasted. That is the single most expensive thing on this
   * domain and it costs nothing to fix.
   *
   * All permanent (308). A 301/308 passes ranking signal to the target and tells
   * Google to drop the old URL from the index; a temporary redirect asks it to
   * keep both, which is the problem we are solving.
   *
   * ── The sources MUST carry the trailing slash ──────────────────────────────
   * `trailingSlash: true` makes Next normalise the URL BEFORE the redirect table
   * is consulted: /old-home is 308'd to /old-home/ first, and only then matched.
   * A source written as '/old-home' therefore never matches anything and every
   * one of these URLs quietly 404s — which is worse than leaving them live,
   * because a 404 discards the link equity a 308 would have passed on.
   *
   * The slash-less forms still work; they cost one extra hop through the
   * normalising redirect. The indexed URLs all carry the slash anyway.
   *
   * Do not "simplify" these into one wildcard rule — the sources do not share a
   * prefix and the targets are not derivable from them.
   */
  async redirects() {
    return [
      { source: '/old-home/', destination: '/', permanent: true },
      { source: '/old-onze-services/', destination: '/onze-services/', permanent: true },
      { source: '/old-tarieven/', destination: '/tarieven/', permanent: true },
      { source: '/old-samenwerken/', destination: '/samenwerken/', permanent: true },
      { source: '/contact-us/', destination: '/contact/', permanent: true },
      { source: '/reserveren/', destination: '/reservering/', permanent: true },

      /**
       * The rest of the WordPress site, recovered from the Wayback Machine on
       * 2026-08-04 and verified 404 against production.
       *
       * These were missed at cutover because the handover listed six URLs and
       * nobody held the old sitemap. Every one of them is a page that ranked,
       * that has inbound links, and that a Google Ads final URL may still point
       * at — and an ad whose destination 404s is disapproved as "Destination
       * not working" and stops serving. Which is one of the few faults that
       * takes a campaign's clicks to exactly zero, as this account's did.
       *
       * Targets are the nearest surviving equivalent, not the homepage.
       * Bouncing everything to / tells Google the old page is gone rather than
       * moved, and it throws away the ranking signal the 308 exists to carry.
       */
      { source: '/home/', destination: '/', permanent: true },
      { source: '/prijzen/', destination: '/tarieven/', permanent: true },
      { source: '/service/', destination: '/onze-services/', permanent: true },
      // Directions and the address live on the contact page.
      { source: '/route/', destination: '/contact/', permanent: true },
      // No FAQ page survived; the "why us" page carries that content now.
      {
        source: '/veelgestelde-vragen/',
        destination: '/waarom-lang-parkeren-schiphol/',
        permanent: true,
      },
      // Changing a booking happens in the ParkingPro portal behind /login/.
      // NOT /mijn-reservering/ — that directory exists but holds no page.
      { source: '/wijzig-uw-reservering/', destination: '/login/', permanent: true },
      { source: '/cart/', destination: '/reservering/', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // No Cache-Control rule for /_next/static/* — Next already serves those
      // with `immutable, max-age=31536000`, and overriding it here breaks
      // hot-reload in dev (Next warns about exactly this at build time).
    ];
  },
};

export default nextConfig;
