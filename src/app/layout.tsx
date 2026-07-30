import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { env } from '@/lib/env';
import { siteConfig } from '@/config/site';
import { jsonLd, organizationSchema, websiteSchema } from '@/lib/schema';
import { Analytics } from '@/components/analytics/Analytics';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: siteConfig.name,
    // Per-route titles are carried over verbatim from the indexed site and
    // already contain the brand, so the template must not append it again.
    template: '%s',
  },
  description: siteConfig.tagline,
  applicationName: siteConfig.name,
  formatDetection: { telephone: true, address: false, email: true },
  verification: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  // Zoom is never blocked — pinch-zoom is the primary accommodation for low
  // vision, and maximum-scale=1 is a WCAG 1.4.4 failure.
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071e33',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required because the inline script below adds
    // a `js` class to this element before React hydrates, which React would
    // otherwise report as a server/client attribute mismatch. It applies ONLY to
    // this element's own attributes, never to its subtree, so real mismatches
    // inside the page are still reported.
    <html lang={siteConfig.lang} className={fontVariables} suppressHydrationWarning>
      <head>
        {/*
          Enables the hidden starting state for scroll reveals — and only when
          IntersectionObserver exists to undo it. With JS off or unsupported, the
          class is never added and every revealed element renders visible.

          Inline and render-blocking by design: it must run before first paint,
          or elements would flash at full opacity before being hidden. It is
          ~90 bytes.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('IntersectionObserver' in window)document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        {children}

        {/* Site-wide entities. Page-level schema (BreadcrumbList, FAQPage) is
            emitted by each route so it sits next to the content it describes. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema()) }}
        />

        <Analytics />
      </body>
    </html>
  );
}
