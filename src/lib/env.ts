import { z } from 'zod';

/**
 * Environment validation. Runs once, at import time, and throws with a readable
 * message if anything is missing or malformed — so a bad deploy fails at build
 * rather than rendering a site with `undefined` in its canonical URLs.
 *
 * Only NEXT_PUBLIC_* values live here. They are inlined into the client bundle
 * at build time, so nothing secret may be added to this schema.
 */
const envSchema = z.object({
  /** Absolute origin, no trailing slash. Drives metadataBase, canonicals,
   *  sitemap.xml and robots.txt. */
  NEXT_PUBLIC_SITE_URL: z
    .url({
      error: 'NEXT_PUBLIC_SITE_URL must be an absolute URL, e.g. https://langparkerenschiphol.nl',
    })
    .refine((v) => !v.endsWith('/'), {
      error: 'NEXT_PUBLIC_SITE_URL must not end in a trailing slash',
    }),

  /**
   * Origin of the MyParkingPro instance. Kept in env because it is also the only
   * host allowed by the frame-src CSP directive in next.config.ts.
   *
   * Validated here but READ in src/lib/parkingpro.ts, which is the single place
   * that composes booking URLs. This entry exists so a malformed value fails the
   * build rather than silently producing an origin the CSP then blocks.
   */
  NEXT_PUBLIC_PARKINGPRO_ORIGIN: z
    .url({ error: 'NEXT_PUBLIC_PARKINGPRO_ORIGIN must be an absolute URL' })
    .refine((v) => !v.endsWith('/'), {
      error: 'NEXT_PUBLIC_PARKINGPRO_ORIGIN must not end in a trailing slash',
    }),

  /** Google Search Console verification token. Optional — omitted in preview. */
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),

  /** GA4 measurement ID. Optional. When absent, no analytics script is emitted
   *  at all, which is the correct default for preview deployments. */
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, { error: 'NEXT_PUBLIC_GA_MEASUREMENT_ID must look like G-XXXXXXX' })
    .optional(),
});

/**
 * Read explicitly rather than passing `process.env`. Next.js only inlines
 * NEXT_PUBLIC_* values that appear as full static property accesses in source,
 * so destructuring or spreading `process.env` would yield undefined in the
 * browser bundle.
 */
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PARKINGPRO_ORIGIN: process.env.NEXT_PUBLIC_PARKINGPRO_ORIGIN,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');

  throw new Error(
    `Invalid environment configuration.\n\n${issues}\n\n` +
      `Copy .env.example to .env.local and fill in the values above.\n`,
  );
}

export const env = parsed.data;
