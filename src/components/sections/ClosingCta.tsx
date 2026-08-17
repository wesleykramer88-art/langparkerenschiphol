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

/**
 * The default strip. Still three lines, and still the ones every page that does
 * not override them shows.
 *
 * ── Why this is now a prop ──────────────────────────────────────────────────
 * The client's August 2026 copy gives each page its OWN closing list, of five or
 * six items rather than three, and they are not the same five: the shuttle page
 * closes on the keys and the transfer, the ritregistratie page on what is
 * recorded, the partner page on commission and the fixed contact. A shared three
 * that contradicts the page above it is worse than a longer list.
 *
 * Pages that pass nothing are unchanged — which is eight of the thirteen call
 * sites, all outside the copy pass this prop was added for.
 */
const REASSURANCES = [
  'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
  'Binnen 2 minuten geregeld',
  '24/7 bewaakte parkeerlocatie',
] as const;

export function ClosingCta({
  heading = 'Begin uw reis ontspannen',
  /**
   * The line between the heading and the lead.
   *
   * Every one of the client's August 2026 closing blocks is written as an H1 and
   * an H2 — "Begin uw reis ontspannen" / "Reserveer uw parkeerplaats bij
   * Schiphol" — the same shape his page heroes use, and <PageHero> grew the same
   * prop for the same reason. Undefined by default, so the pages outside that
   * copy pass are untouched.
   */
  subhead,
  lead = 'Kies zekerheid, snelheid en gemak. Reserveer vandaag nog uw parkeerplaats op Schiphol.',
  photo = 'terminalDeparture',
  /**
   * This page's closing reassurances. Defaults to the shared three above.
   *
   * ⚠ Six is the practical ceiling. The strip wraps and centres, so a seventh
   * item does not break the layout — but at six the row is already two lines on
   * a laptop, and a closing block that needs three lines of small print has
   * stopped being reassurance and become a specification.
   */
  reassurances = REASSURANCES,
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
}: {
  heading?: string;
  subhead?: string;
  /** One paragraph, or several where the client's copy runs to more than one. */
  lead?: string | readonly string[];
  photo?: PhotoName;
  notch?: NotchColor;
  reassurances?: readonly string[];
  bookingHref?: string;
  bookingLabel?: string;
} = {}) {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="cta-heading">
      {/* The perforation on the seam. `tone` is not passed: it defaults to
          'light', which is what this band now is — the dash reverts to
          --color-line-strong on its own. `notch` is still the colour of the
          section ABOVE, so it stays a per-call-site decision. */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch={notch} />
      </Container>

      <Container className="relative">
        <Reveal className="flex flex-col items-center text-center">
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
              alt=""
              fill
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="absolute inset-0 h-full w-full"
              imageClassName="object-cover object-[center_62%]"
            />
          </div>

          <h2 id="cta-heading" className="text-display-lg text-heading mt-12 max-w-[16ch]">
            {heading}
          </h2>

          {subhead ? (
            <p className="text-display-sm text-heading mt-5 max-w-[24ch]">{subhead}</p>
          ) : null}

          {/* Centred, so the paragraphs are separated by a gap rather than by an
              indent — there is no left edge here for an indent to work against. */}
          <div className="mt-6 flex max-w-[46ch] flex-col gap-4">
            {(typeof lead === 'string' ? [lead] : lead).map((paragraph) => (
              <p key={paragraph} className="text-lead text-muted">
                {paragraph}
              </p>
            ))}
          </div>

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

          {/* Wraps, rather than running as one row.
              With the default three items this is pixel-identical to what it was
              — three short lines fit one row at gap-8, so `flex-wrap` never
              engages and `max-w-4xl` is wider than the content. It engages only
              for the pages that now pass five or six, where the old `sm:flex-row`
              would have pushed the last item off the measure.
              The cap matches the photo panel above, so a wrapped strip lines up
              with the frame instead of running the full container. */}
          <ul className="border-line text-muted mt-12 flex flex-col items-center gap-3 border-t pt-8 text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3 lg:max-w-4xl">
            {reassurances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
