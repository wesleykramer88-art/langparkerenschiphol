import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal tool. Also carries robots: noindex in its own metadata — the
      // two are complementary, not redundant: this stops the crawl, that stops
      // the indexing if the URL is ever discovered through a link.
      disallow: ['/design-system/'],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_SITE_URL,
  };
}
