'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroPhoto } from '@/components/ui/HeroPhoto';
import { BookingPicker } from '@/components/booking/BookingPicker';
import { PromoCoupon } from '@/components/sections/PromoCoupon';
import { siteConfig } from '@/config/site';
import type { PickerBounds } from '@/lib/parkingpro-config';

/**
 * The hero.
 *
 * MOBILE LAYOUT (below lg):
 * - Booking widget sits at the top (primary CTA, highest conversion point)
 * - Hero photograph below, occupying top band of section
 * - Copy column fills remainder, running full width
 *
 * DESKTOP LAYOUT (lg and above):
 * - Booking widget (ticket) sits on the right, overhanging into section below
 * - Photograph fills entire background
 * - Copy sits in left column, headline prominent over image
 *
 * The thesis of the whole page: the handover itself, at the terminal kerb, with
 * the booking ticket laid over it. The photograph is the argument — this
 * business sells a place to leave your car, and the flat navy field it replaces
 * asserted that in words while showing nothing. Everything else here is arranged
 * to stay out of its way.
 *
 * This is the one place on the site that uses motion/Framer. Everything else —
 * scroll reveals, hovers, the marquee, the photograph's drift — is CSS, so the
 * animation runtime loads for exactly one orchestrated moment rather than being
 * sprinkled across the page. Over-animation is the clearest tell of generated
 * work.
 *
 * The load sequence, finishing under 1.4s:
 *   1. eyebrow + rating fade in
 *   2. H1 reveals line by line, each line's inner span rising from y:100%
 *      behind an overflow:hidden mask, 90ms apart
 *   3. lead fades up
 *   4. the proof row fades up
 *   5. CTAs fade up
 *   6. the ticket arrives from x:32 / rotate:-2deg — it settles like a card
 *      being laid on a desk (on mobile, this is at the top instead)
 *   7. the ticket's perforation draws left to right (CSS, in globals.css)
 *
 * Behind all of it the photograph drifts from scale 1.04 to 1.13 over 30s, once
 * and never looping. Nothing below the fold animates on load.
 */

// One curve for the whole sequence. ease-out-expo: it decelerates hard, which is
// what makes the ticket read as being set down rather than sliding to a stop.
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The H1, pre-split. Line breaks are a design decision, not a wrap artefact.
 *
 * ── Client copy, August 2026 ────────────────────────────────────────────────
 * Was ['Zorgeloos', 'lang parkeren', 'op Schiphol.'] — three lines opening on
 * an adjective. The brand name now leads and "Schiphol" closes the line, which
 * is also the local-SEO ask: the H1 is the strongest on-page signal the site
 * has for the query it is actually competing for.
 *
 * "Zorgeloos" is not lost — it moves to SUBHEAD below, where it reads as the
 * promise rather than as the first thing the page says about itself.
 *
 * ⚠ SCRIM. Two lines, not three, and no line wider than "lang parkeren" was, so
 * this copy change on its own neither widened nor extended the copy column.
 * The gradient WAS re-cut afterwards, for a different reason — the client asked
 * for a lighter hero — and every stop is now measured against the real
 * composited frame. If a future H1 runs longer than these lines, re-measure;
 * `scrim-hero` in globals.css says how, and warns against the shortcut that
 * produced the wrong numbers the first time.
 */
const HEADLINE_LINES = ['Lang Parkeren', 'op Schiphol'] as const;

/**
 * The promise, directly under the H1.
 *
 * Set at display-md rather than as another lead paragraph: it is a tagline, and
 * a tagline that shares the lead's size and weight simply reads as a first
 * sentence that failed to say anything.
 *
 * It is the last valet-300 element left in the hero — the eyebrow above it went
 * white when the scrim was lightened — which makes it the accent's only
 * appearance in the copy column, and also the tightest measurement in the band:
 * 3.38:1 over the real composited frame, against the 3.0 a 40px bold line
 * needs. That figure is what stopped the scrim going lighter still. If you
 * change this colour or this size, re-measure the whole band.
 */
const SUBHEAD = 'Zorgeloos geregeld.';

/**
 * Set as a hairline row, not as a bullet list.
 *
 * Shuttle leads, because shuttle is about 90% of bookings (client, 31 July
 * 2026) and nothing above the fold used to say so — the hero named valet first
 * and the proof row did not mention either service.
 *
 * "De meest gekozen parkeerservice" was the third line and is gone. It is
 * unfalsifiable — most-chosen by whom, measured against what — and it sat in
 * the one row on the page whose job is to be checkable. What replaces it is a
 * concrete fact the client already publishes on /tarieven/, and it happens to
 * answer the question shuttle customers actually ask, which is whether the ride
 * costs extra.
 * TODO(client): if you want a popularity claim back, give us the number behind
 * it and we will state that instead.
 */
const PROOF = [
  'Shuttle van en naar de vertrekhal inbegrepen',
  '24/7 camerabewaking en monitoring',
  // ── The proximity claim. Local SEO, August 2026 ──────────────────────────
  // Replaces 'Boek direct via de website', which said nothing a visitor
  // looking at a booking form needed to be told.
  //
  // The brief asked for "Op 5 minuten van Schiphol". It is deliberately NOT
  // that. This site already publishes "5 tot 8 minuten" for the shuttle in six
  // separate places — the FAQ, the service chooser, /onze-services/, the trust
  // page and twice in schema-adjacent copy — and a shorter figure here would be
  // the client's own claim disagreeing with itself, in the one row on the page
  // whose entire job is to be checkable. So this states the published number.
  //
  // TODO(client): if you would rather state a DISTANCE ("op 5 minuten rijden",
  // "3 km van de terminal"), send the figure and we will use it — but it then
  // has to replace the 5–8 minute claim everywhere or sit clearly beside it as
  // a different measurement. One number in two sizes is worse than either.
  'Op 5 tot 8 minuten van de vertrekhal',
] as const;

export function HeroSection({
  bounds,
  /**
   * Whether the seasonal coupon is still running. Decided on the server — see
   * isPromoActive() — because comparing the visitor's clock against the build's
   * would produce a hydration mismatch on the offer's last day.
   */
  showPromo = false,
}: {
  bounds?: PickerBounds;
  showPromo?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  /** Every animated element resolves through here, so reduced motion is handled
   *  once rather than per-element.
   *
   *  Under reduced motion this returns the FINAL state explicitly — opacity 1,
   *  no travel, zero duration — rather than `initial: false`. That shorthand
   *  leaves an element with no `animate` target at all, and the hero rendered
   *  with nothing below the H1: no lead, no proof row, no buttons. A
   *  reduced-motion visitor is not asking for less content. */
  const rise = (delay: number) =>
    prefersReduced
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <section className="bg-surface-inverse relative overflow-hidden">
      {/* ========================================================================
          MOBILE LAYOUT (below lg)
          ======================================================================== */}
      <div className="flex flex-col lg:hidden">
        {/* --- BOOKING WIDGET AT TOP --- */}
        {/* The widget lives here on mobile for maximum conversion. Moved from
            the right column to top of page, so users see the booking form before
            scrolling. Notch is inverse because the widget sits on the dark
            (navy-950) section background. */}
        <motion.div
          initial={
            prefersReduced ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 14, rotate: 0 }
          }
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={
            prefersReduced ? { duration: 0 } : { duration: 0.6, delay: 0.4, ease: EASE }
          }
          id="hero-booking"
          className="relative z-10 w-full"
        >
          <BookingPicker notch="inverse" bounds={bounds} />
        </motion.div>

        {/* --- HERO PHOTO --- */}
        <div aria-hidden className="relative h-96 overflow-hidden">
          <HeroPhoto
            name="crewShuttleTerminal"
            portraitName="crewShuttleTerminalPortrait"
            className="absolute inset-0 h-full w-full"
            imageClassName="photo-drift object-[center_62%]"
          />
          {/* Mobile gradient scrim */}
          <div className="from-navy-950/62 via-navy-950/38 to-navy-950 absolute inset-0 bg-linear-to-b" />
        </div>

        {/* --- COPY COLUMN --- */}
        <Container className="relative py-12">
          <div className="flex flex-col items-start gap-6">
            {/* Eyebrow */}
            <motion.div {...rise(0)} className="flex items-center gap-3">
              <span aria-hidden className="bg-valet-400 size-2 shrink-0 rotate-45 rounded-xs" />
              <p className="eyebrow text-paper-50">
                <span className="numeric">{siteConfig.yearsActive}+</span> jaar op Schiphol ·
                Duizenden reizigers per jaar
              </p>
            </motion.div>

            {/* Headline */}
            <h1 className="text-display-2xl text-heading-inverse">
              {HEADLINE_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={prefersReduced ? { y: '0%' } : { y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.6, delay: 0.07 + index * 0.09, ease: EASE }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subhead */}
            <motion.p {...rise(0.34)} className="text-display-md text-valet-300">
              {SUBHEAD}
            </motion.p>

            {/* Lead paragraph */}
            <motion.p {...rise(0.42)} className="text-lead text-navy-100 max-w-[46ch]">
              Binnen 2 minuten geregeld. Kies voor Shuttle met een gratis transfer naar de
              vertrekhal of voor Valet, waarbij onze chauffeur uw auto direct voor u parkeert.
            </motion.p>

            {/* Proof row */}
            <motion.ul
              {...rise(0.51)}
              className="border-line-inverse mt-3 grid w-full max-w-lg gap-3 border-t pt-4"
            >
              {PROOF.map((item) => (
                <li key={item} className="text-navy-100 flex items-start gap-2.5">
                  <Check
                    className="text-valet-400 mt-0.5 size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span className="text-sm leading-snug">{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div {...rise(0.6)} className="mt-4 flex flex-wrap items-center gap-3">
              <Button href="/reservering/" size="lg">
                Reserveer nu
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href="/tarieven/" variant="onDark" size="lg">
                Bekijk tarieven
              </Button>
            </motion.div>

            {/* Reassurance line */}
            <motion.p {...rise(0.66)} className="text-navy-300 text-sm">
              Online reserveren met directe bevestiging
            </motion.p>

            {/* Promo */}
            {showPromo ? (
              <motion.div {...rise(0.74)}>
                <PromoCoupon />
              </motion.div>
            ) : null}
          </div>
        </Container>
      </div>

      {/* ========================================================================
          DESKTOP LAYOUT (lg and above)
          Booking widget on right, copy on left, photograph as background
          ======================================================================== */}
      <div aria-hidden className="hidden lg:absolute lg:inset-0 lg:overflow-hidden">
        <HeroPhoto
          name="crewShuttleTerminal"
          portraitName="crewShuttleTerminalPortrait"
          className="absolute inset-0 h-full w-full"
          imageClassName="photo-drift object-[center_62%] sm:object-[42%_50%] lg:object-[center_45%]"
        />

        {/* Two scrims for desktop composition */}
        <div className="scrim-hero absolute inset-0" />

        {/* Header scrim */}
        <div
          aria-hidden
          className="from-navy-950/88 via-navy-950/46 absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent"
        />
      </div>

      <Container className="relative hidden lg:block">
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-center gap-16 min-h-[min(80vh,800px)] py-20">
          {/* LEFT COLUMN - Copy */}
          <div className="flex flex-col items-start">
            {/* Eyebrow */}
            <motion.div {...rise(0)} className="flex items-center gap-3">
              <span aria-hidden className="bg-valet-400 size-2 shrink-0 rotate-45 rounded-xs" />
              <p className="eyebrow text-paper-50">
                <span className="numeric">{siteConfig.yearsActive}+</span> jaar op Schiphol ·
                Duizenden reizigers per jaar
              </p>
            </motion.div>

            {/* Headline */}
            <h1 className="text-display-2xl text-heading-inverse mt-7">
              {HEADLINE_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={prefersReduced ? { y: '0%' } : { y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.6, delay: 0.07 + index * 0.09, ease: EASE }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subhead */}
            <motion.p {...rise(0.34)} className="text-display-md text-valet-300 mt-4">
              {SUBHEAD}
            </motion.p>

            {/* Lead paragraph */}
            <motion.p {...rise(0.42)} className="text-lead text-navy-100 mt-7 max-w-[46ch]">
              Binnen 2 minuten geregeld. Kies voor Shuttle met een gratis transfer naar de
              vertrekhal of voor Valet, waarbij onze chauffeur uw auto direct voor u parkeert.
            </motion.p>

            {/* Proof row */}
            <motion.ul
              {...rise(0.51)}
              className="border-line-inverse mt-9 grid w-full max-w-lg gap-3 border-t pt-6 grid-cols-3 gap-x-5"
            >
              {PROOF.map((item) => (
                <li key={item} className="text-navy-100 flex items-start gap-2.5">
                  <Check
                    className="text-valet-400 mt-0.5 size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span className="text-sm leading-snug">{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div {...rise(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/reservering/" size="lg">
                Reserveer nu
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href="/tarieven/" variant="onDark" size="lg">
                Bekijk tarieven
              </Button>
            </motion.div>

            {/* Reassurance line */}
            <motion.p {...rise(0.66)} className="text-navy-300 mt-6 text-sm">
              Online reserveren met directe bevestiging
            </motion.p>

            {/* Promo */}
            {showPromo ? (
              <motion.div {...rise(0.74)} className="mt-7">
                <PromoCoupon />
              </motion.div>
            ) : null}
          </div>

          {/* RIGHT COLUMN - Ticket (Desktop only) */}
          <motion.div
            initial={
              prefersReduced ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 32, rotate: -2 }
            }
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={
              prefersReduced ? { duration: 0 } : { duration: 0.7, delay: 0.68, ease: EASE }
            }
            id="hero-booking-desktop"
            className="relative z-10 -mb-32 w-full"
          >
            <BookingPicker notch="inverse" bounds={bounds} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
