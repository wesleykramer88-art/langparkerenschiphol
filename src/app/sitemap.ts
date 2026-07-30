import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { navigation } from '@/config/site';

/**
 * Generated from the route config rather than hand-written, so a new page cannot
 * be added to the nav and forgotten in the sitemap.
 *
 * URLs keep their trailing slash to match the indexed canonicals exactly. A
 * sitemap listing /tarieven while the canonical is /tarieven/ tells Google the
 * two disagree, which is the sort of small inconsistency that quietly costs
 * crawl budget.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return navigation
    .filter((route) => route.inSitemap)
    .map((route) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}${route.href}`,
      lastModified,
      changeFrequency: route.href === '/' ? 'weekly' : 'monthly',
      priority: route.priority,
    }));
}
