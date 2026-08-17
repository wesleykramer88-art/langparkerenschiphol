import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { ServiceChooser } from '@/components/sections/ServiceChooser';
import { WhyUs } from '@/components/sections/WhyUs';
import { Security } from '@/components/sections/Security';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Faq } from '@/components/sections/Faq';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { StickyBookingBar } from '@/components/booking/StickyBookingBar';
import { fetchPickerBounds } from '@/lib/parkingpro-config';
import { isPromoActive } from '@/config/site';

export const metadata = createMetadata('home');

/**
 * The homepage.
 *
 * Section order differs from the live site, deliberately: the service chooser
 * moves up from position five, and the testimonials move ahead of the closing
 * CTA. Decision first, reassurance second, objections handled last, and the ask
 * at the point of highest confidence. Every line of copy is carried over.
 *
 * Surfaces alternate so nine sections do not read as one stack of cards:
 *   navy → navy-900 → cream → white → navy → cream → white → cream → navy
 * The only navy adjacency is the hero and the trust strip, which are one block:
 * the hero's ticket card overhangs into the strip.
 */
export default async function HomePage() {
  // Opening hours and time-picker defaults, straight from the client's own
  // ParkingPro back office. Cached for an hour, so the page stays statically
  // rendered and revalidates rather than fetching per visitor — and falls back
  // to the values the picker always used if ParkingPro is unreachable.
  const bounds = await fetchPickerBounds();

  /**
   * Evaluated here rather than in the hero, because the hero is a client
   * component: a date comparison inside it would run once against the build
   * clock and again against the visitor's, and disagree on the offer's last
   * day. This page revalidates hourly, so the coupon takes itself down within
   * an hour of expiring — nobody has to remember to remove it on 1 September.
   */
  const showPromo = isPromoActive();

  return (
    <>
      <HeroSection bounds={bounds} showPromo={showPromo} />
      <TrustStrip />
      <ServiceChooser />
      <WhyUs />
      <Security />
      <HowItWorks />
      {/* Disabled, not deleted. To restore, add back
            import { Testimonials } from '@/components/sections/Testimonials';
          and uncomment. The import was removed because an unused one fails
          eslint, and the section order note above still assumes it. */}
      {/* <Testimonials /> */}
      <Faq />

      {/* The client's closing copy, August 2026. His heading is what the default
          already said, so only the lines under it are passed. The five
          reassurances are his, and replace the shared three — see ClosingCta. */}
      <ClosingCta
        heading="Begin uw reis ontspannen"
        subhead="Reserveer uw parkeerplaats bij Schiphol"
        lead={[
          'Kies voor het gemak van valet parkeren of parkeer uw auto zelf met onze shuttleservice. Wat u ook kiest: wij zorgen ervoor dat het parkeren vooraf goed geregeld is.',
          'Reserveer vandaag nog uw parkeerplaats bij Schiphol.',
        ]}
        reassurances={[
          'Annuleren tot 24 uur voor aankomst met annuleringsdekking',
          'Binnen 2 minuten online gereserveerd',
          '24/7 bewaakte parkeerlocatie',
          'Keuze uit valet en shuttle parkeren',
          'Directe reserveringsbevestiging',
        ]}
      />

      {/* Watches the hero's booking card; stands down at the footer. */}
      <StickyBookingBar watchId="hero-booking" hideAfterId="site-footer" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([])) }}
      />
    </>
  );
}
