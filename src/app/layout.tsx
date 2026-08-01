import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { env } from '@/lib/env';
import { siteConfig } from '@/config/site';
import { jsonLd, organizationSchema, websiteSchema } from '@/lib/schema';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { Analytics } from '@/components/analytics/Analytics';
import { buildConsentBootstrap } from '@/lib/analytics';
import { CONSENT_STORAGE_KEY } from '@/lib/consent';
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

        {/*
          Consent Mode v2 default state.

          MUST stay here, in <head>, ahead of everything — including the GTM
          loader in <Analytics />, which is rendered at the bottom of <body>.
          Consent Mode's contract is that the default is on the dataLayer before
          any tag reads it; a default that arrives afterwards is not a default,
          it is a late correction, and whatever fired in between fired
          unconsented. Parser order is the only guarantee strong enough for
          that, which is why this is a raw inline <script> and not <Script>.

          It defaults every ad and analytics signal to DENIED, then reads the
          visitor's stored answer and grants if they have already accepted — so
          a returning visitor is never briefly downgraded and re-upgraded, which
          GA4 would otherwise count as two sessions from two users.

          Emitted only when a container is configured. With no GTM id the whole
          measurement stack is absent and this would define a dataLayer nothing
          ever reads.
        */}
        {env.NEXT_PUBLIC_GTM_ID ? (
          <script
            dangerouslySetInnerHTML={{ __html: buildConsentBootstrap(CONSENT_STORAGE_KEY) }}
          />
        ) : null}
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

        {/* GTM under Consent Mode v2 — renders the banner and the container.
            The default consent state is set by the bootstrap in <head> above. */}
        <Analytics />

        {/*
          Vercel Web Analytics. Deliberately NOT behind the consent gate above.

          It sets no cookie and writes nothing to the visitor's device: a
          visitor is identified by a hash of the incoming request, computed
          server-side and discarded after 24 hours. ePrivacy art. 5(3) — the
          rule the banner exists to satisfy — is triggered by storing or
          reading information on terminal equipment, and this stores nothing,
          so the consent requirement is not engaged.

          That is the entire reason it is worth adding alongside GA4: it
          measures the ~half of visitors who decline the banner, which is
          exactly the half GA4 can never see.

          Self-hosted from our own origin (/<unique-path>/script.js), so the
          CSP in next.config.ts needs no new entries — 'self' already covers
          both the script and its intake requests.
        */}
        <VercelAnalytics />
      </body>
    </html>
  );
}
