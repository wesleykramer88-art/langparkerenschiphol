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

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self'",
  `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com${devConnectSrc}`,
  `frame-src ${PARKINGPRO_ORIGIN}`,
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
