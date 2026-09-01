import { ArrowRight, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTear } from '@/components/ui/Ticket';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';
import type { PhotoName } from '@/config/images';
import type { NotchColor } from '@/components/ui/Ticket';

/**
 * The close. Shared by every page, which is the point: wherever a visitor stops
 * reading, the ask is in the same place, in the same shape, saying the same
 * thing. Heading, lead and photograph are overridable for the pages whose
 * argument ends somewhere other than "book a parking space".
 *
 * Placed at the point of highest confidence: decision made, objections handled,
 * proof read.
 *
 * ── THIS BAND USED TO BE NAVY, AND IS NOT ANY MORE ──────────────────────────
 * Client brief, August 2026: the site should read lighter and calmer — the
 * Parkos / Eazzypark feel, which is airiness, not a different palette.
 *
 * The homepage carried four dark zones: the hero and its trust strip (one
 * continuous block), the security band, this one, and the footer. Of those,
 * this is the one that had to give. The security band answers "is my car safe
 * while I am in another country", it is the only place on the site where
 * glassmorphism is justified because there is genuinely a photograph behind the
 * panels, and it earns its full-bleed width. This band's job is to ask for the
 * booking — and a page that opens on navy and closes on navy reads as heavier
 * than the sum of its sections, whatever is in the middle.
 *
 * ── The photograph did NOT go with it ───────────────────────────────────────
 * The obvious way to lighten a photographic band is to delete the photograph.
 * The brief's first rule is that the client's real photographs must be seen, and
 * this component renders on every page — dropping the image here would remove a
 * photographic moment from the whole site to solve a problem that is about
 * VALUE, not about imagery.
 *
 * So the frame moves into a contained panel above the copy. It keeps the
 * photography, loses the full-bleed dark field, and drops the two scrims: with
 * no text over the image there is nothing left for them to protect. `scrim-band`
 * is still used by the security band and /samenwerken/; `scrim-center` is now
 * unused and is deliberately kept — see the note on it in globals.css.
 *
 * ── Contrast, re-measured for the light treatment ───────────────────────────
 * Computed sRGB, WCAG 2.1. Nothing here sits over a photograph any more, so
 * these are flat pairs and they hold regardless of the frame:
 *
 *   navy-950 heading   on paper-50 ... 16.90:1  AAA
 *   ink-500  lead      on paper-50 .... 5.48:1  AA   (--text-lead is 17–20px
 *                                                     regular = NORMAL text
 *                                                     under WCAG, needs 4.5)
 *   ink-500  reassur.  on paper-50 .... 5.48:1  AA   (14px, needs 4.5)
 *   navy-950 label     on valet-600 ... 5.02:1  AA   (primary button)
 *   paper-50 label     on navy-950 ... 16.90:1  AAA  (secondary button)
 *
 * The phone button changes onDark → secondary. `onDark` is a transparent
 * outline with a light label: on white it would be invisible type on invisible
 * border, which is the failure mode a variant named for a dark background has.
 */

const REASSURANCES = [
  'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
  'Binnen 2 minuten geregeld',
  '24/7 bewaakte parkeerlocatie',
] as const;

export function ClosingCta({
  heading = 'Begin uw reis ontspannen',
  lead = 'Kies zekerheid, snelheid en gemak. Reserveer vandaag nog uw parkeerplaats op Schiphol.',
  photo = 'terminalDeparture',
  photoAlt = '',
  /** The section the seam above sits on, so the perforation punches its colour. */
  notch = 'canvas',
  /**
   * Where the primary button goes, and what it says.
   *
   * The two service landing pages carry their service into the booking flow —
   * /reservering/?service=shuttle opens narrowed to that service's two products
   * instead of all four. A page that has spent itself arguing for ONE service
   * should not hand the visitor a form offering both again.
   */
  bookingHref = '/reservering/',
  bookingLabel = 'Reserveer nu',
  compactOnMobile = false,
  mobileHeading = heading,
  mobileLead = lead,
  mobileBookingHref = bookingHref,
  mobileBookingLabel = bookingLabel,
}: {
  heading?: string;
  lead?: string;
  photo?: PhotoName;
  /** Optional descriptive alt text for service-specific CTA imagery. */
  photoAlt?: string;
  notch?: NotchColor;
  bookingHref?: string;
  bookingLabel?: string;
  compactOnMobile?: boolean;
  mobileHeading?: string;
  mobileLead?: string;
  mobileBookingHref?: string;
  mobileBookingLabel?: string;
} = {}) {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="cta-heading" className="py-14 md:py-24 lg:py-40">
      {/* The perforation on the seam. `tone` is not passed: it defaults to
          'light', which is what this band now is — the dash reverts to
          --color-line-strong on its own. `notch` is still the colour of the
          section ABOVE, so it stays a per-call-site decision. */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch={notch} />
      </Container>

      <Container className="relative">
        <Reveal className="flex flex-col items-center text-center">
          {compactOnMobile ? (
            <div className="w-full md:hidden">
              <h2 className="text-display-md text-heading mx-auto max-w-[13ch]">
                {mobileHeading}
              </h2>
              <p className="text-muted mt-3 text-sm leading-relaxed">{mobileLead}</p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <Button href={mobileBookingHref} size="lg" className="w-full sm:w-auto">
                  {mobileBookingLabel}
                  <ArrowRight data-arrow className="size-4" aria-hidden />
                </Button>
                <a
                  href={siteConfig.phone.href}
                  className="text-brand inline-flex min-h-11 items-center text-sm font-medium underline decoration-navy-300 underline-offset-4"
                >
                  <Phone className="mr-2 size-4" aria-hidden />
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
              </div>
            </div>
          ) : null}

          <div className={compactOnMobile ? 'hidden w-full md:block' : 'w-full'}>
            {/* Contained rather than full-bleed. Decorative: the heading beneath
              says where this is, and the frame is here to carry the place
              rather than to be described.

              21:9 on desktop and 16:9 below it — a band this wide at phone
              width would be a letterbox slot two hundred pixels tall, which
              shows nothing. Capped at max-w-4xl so it stays a panel on the page
              instead of quietly becoming the full-bleed band it replaced. */}
            <div className="shadow-photo relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl sm:aspect-21/9">
              <Photo
                name={photo}
                alt={photoAlt}
                fill
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover object-[center_62%]"
              />
            </div>

            <h2 id="cta-heading" className="text-display-lg text-heading mt-12 max-w-[16ch]">
              {heading}
            </h2>
            <p className="text-lead text-muted mt-6 max-w-[46ch]">{lead}</p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href={bookingHref} size="lg">
                {bookingLabel}
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href={siteConfig.phone.href} variant="secondary" size="lg">
                <Phone className="size-4" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                <span className="numeric">{siteConfig.phone.display}</span>
              </Button>
            </div>

            <ul className="border-line text-muted mt-12 flex flex-col items-center gap-3 border-t pt-8 text-sm sm:flex-row sm:gap-8">
              {REASSURANCES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
