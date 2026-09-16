import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { ServiceChooser } from '@/components/sections/ServiceChooser';
import { Security } from '@/components/sections/Security';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Faq } from '@/components/sections/Faq';
import { Testimonials } from '@/components/sections/Testimonials';
import { StickyBookingBar } from '@/components/booking/StickyBookingBar';
import { fetchPickerBounds } from '@/lib/parkingpro-config';
import { isPromoActive } from '@/config/site';

export const metadata = createMetadata('home');

/**
 * The homepage.
 *
 * Section order differs from the live site, deliberately: the service chooser
 * moves up from position five. Decision first, reassurance second, and
 * objections handled last.
 *
 * The hero and trust strip form one visual block: the hero's ticket card
 * overhangs into the strip.
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
      <Security />
      <HowItWorks />
      <Testimonials />
      <Faq />

      {/* Watches the hero's booking card; stands down at the footer. */}
      <StickyBookingBar watchId="hero-booking" hideAfterId="site-footer" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([])) }}
      />
    </>
  );
}
