'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroPhoto } from '@/components/ui/HeroPhoto';
import { BookingPicker } from '@/components/booking/BookingPicker';
import { siteConfig } from '@/config/site';
import type { PickerBounds } from '@/lib/parkingpro-config';

/**
 * The hero.
 *
 * The thesis of the whole page: a covered deck receding into the dark, with the
 * booking ticket laid over it. The photograph is the argument — this business
 * sells a place to leave your car, and the flat navy field it replaces asserted
 * that in words while showing nothing. Everything else here is arranged to stay
 * out of its way.
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
 *      being laid on a desk
 *   7. the ticket's perforation draws left to right (CSS, in globals.css)
 *
 * Behind all of it the photograph drifts from scale 1.04 to 1.13 over 30s, once
 * and never looping. Nothing below the fold animates on load.
 */

// One curve for the whole sequence. ease-out-expo: it decelerates hard, which is
// what makes the ticket read as being set down rather than sliding to a stop.
const EASE = [0.16, 1, 0.3, 1] as const;

/** The H1, pre-split. Line breaks are a design decision, not a wrap artefact. */
const HEADLINE_LINES = ['Zorgeloos', 'lang parkeren', 'op Schiphol.'] as const;

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
  'Boek direct via de website',
] as const;

export function HeroSection({ bounds }: { bounds?: PickerBounds }) {
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
    // -mt-20 pt-20 is what makes the header's transparency mean anything: the
    // bar is h-20 and sits in normal flow, so without this the hero starts BELOW
    // it and a transparent bar shows the cream canvas — light nav text on cream,
    // i.e. an invisible header. Pulling the section up by exactly the bar's
    // height and padding it back by the same amount slides the photograph under
    // the bar without moving a single pixel of hero content.
    <section className="bg-surface-inverse relative -mt-20 overflow-hidden pt-20">
      {/* ---------- The image ----------
          The branded black Vito at the kerb under Schiphol's "Vertrek 3 /
          Departures 3" sign, supplied by the client on 2 August 2026 and set
          here at his request. It is AI-GENERATED, not photographed, and the
          specific things wrong with it are itemised on `vitoDepartures3` in
          config/images.ts. Read that before reusing it.

          What it does well is real: a garage says "car park operator"; a
          terminal frontage says "part of the airport", which is the feeling the
          client asked for in as many words — and the wayfinding sign says it
          without reproducing anyone's mark. Against the frame it replaces it
          also carries the livery at full flank height, a legible yellow plate,
          the crew jacket, and a wet red bus lane that places it at a kerb.

          It measured 4.64:1 for the lead under the existing scrim against the
          old frame's 4.57:1, so `scrim-hero` was left exactly as it was. If this
          image is replaced, re-measure — see the note on that utility.

          ⚠ The mangled flight board is in this crop at desktop widths; it could
          not be cropped out without also losing the crew member. It is out of
          the sm and phone crops. The manifest entry has the alternative.

          TODO(client): this is the slot the real kerbside photograph belongs in.
          A genuine frame of the orange shuttle bus at the terminal would say
          bright, Schiphol and shuttle at once, and would not need any of the
          caveats above.

          Decorative: the H1 beside it already says where this is, and a screen
          reader gains nothing from a description of the wallpaper.

          ── The phone hero took two fixes, not one ──────────────────────────
          The client reported the hero as looking bad on a phone. It was worse
          than that: the photograph was not visible at all, on the pages where
          most of his traffic is. Two separate causes, and fixing either alone
          left it broken.

          1. THE CROP. The original is 1.79 : 1. Below 640px this now switches to
             a purpose-made PORTRAIT crop of the same frame through a real
             <picture> element — see <HeroPhoto> for why next/image cannot art
             direct, and why two <Image>s with one hidden would cost every phone
             visitor a wasted download of the LCP element.

          2. THE BOX. A portrait crop alone still showed nothing but terminal
             glass, because at 360px this section is about 1,595px TALL —
             eyebrow, headline, lead, three proof rows, two buttons, the phone
             number and the booking ticket, stacked. That is a 0.23 : 1 box, and
             covering it with any photograph discards ~70% of the frame.

             So below lg the image occupies the top band only, and the gradient
             resolves it into the navy the rest of the section is already
             painted in. At 360 × 32rem the box is 0.70 : 1 against the crop's
             0.75 : 1 — about a tenth of the width lost, and the van, the livery
             and the Vertrek 2 sign all read.

          At lg the photograph goes back to filling the section, where the
          proportions were never the problem: the container is WIDER than
          1.79 : 1, so the full width shows and only height is cropped — 45%
          keeps the canopy and the sign and loses road. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-128 sm:h-152 lg:inset-0 lg:h-full">
        <HeroPhoto
          name="vitoDepartures3"
          portraitName="vitoDepartures3Portrait"
          className="absolute inset-0 h-full w-full"
          // sm sits at 42%, not the middle: between 640px and lg the box is
          // about 1.05:1 against the frame's 1.79:1, so only ~59% of the width
          // shows. Anchored left of centre that window holds the terminal sign
          // and the whole van and stops just short of the mangled flight board
          // at x≈1850 of 2400. Anything past ~46% starts to show it.
          imageClassName="photo-drift object-[center_62%] sm:object-[42%_50%] lg:object-[center_45%]"
        />

        {/* Two scrims, because the composition changes at lg.

            Desktop: the headline sits in the left third, so the scrim runs
            right — the photograph stays visible on the side the ticket is on.
            Its ramp was re-shaped after the client read the hero as too dark:
            unchanged through the copy column, and clearing to nothing over the
            van and the Departures sign instead of stopping at 10% navy. The
            arithmetic, and why the level could NOT simply be lowered, is on
            `scrim-hero` in globals.css.

            Mobile: the text runs the full width, so the scrim has to be flat.
            That is also why the desktop fix has no mobile equivalent — a
            top-to-bottom gradient under full-width copy has no quiet side to
            open, so every part of it is load-bearing for contrast. Brightening
            the phone hero means a different CROP, not a different scrim.
            It used to be 88% → 74% → 100% navy — legible, and also effectively
            opaque, which was the other half of why the photograph could not be
            seen. It is now 72% → 52% → 100%: heavy where the headline sits,
            open through the middle where the van is, and closing to solid navy
            at the foot so the band's bottom edge dissolves into the section
            rather than ending on a line. */}
        <div className="from-navy-950/72 via-navy-950/52 to-navy-950 absolute inset-0 bg-linear-to-b lg:hidden" />
        <div className="scrim-hero absolute inset-0 hidden lg:block" />
      </div>

      <Container className="relative">
        {/* The tracks are minmax(0, …) rather than bare `auto`/`fr` on purpose.
            A grid track's automatic minimum is min-content, and the ticket's stub
            row is a `justify-between` flex with a `truncate` (white-space: nowrap)
            left column and a shrink-0 right column — so its min-content is the
            full un-truncated width of BOTH. That exceeds the container on a
            phone, the track grows past it, and because this section is
            overflow-hidden the card silently renders wider than the screen. It
            changed width whenever the stub's right-hand meta changed with the
            service. minmax(0, …) floors the track so the card can never exceed
            its column and the stub truncates as it was designed to. */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 pt-12 pb-28 sm:pt-16 lg:min-h-[min(80vh,800px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-20 lg:pb-32">
          {/* ---------- Left column ---------- */}
          <div className="flex flex-col items-start">
            {/* This line used to read "★★★★★ 4,7/5 · Duizenden reizigers elk
                jaar". The 4,7 had no source anywhere — no Google profile, no
                Trustpilot, no count — and five stars beside it is a rating
                claim whether or not it is marked up as one. Both are gone; see
                config/site.ts.

                What is left is two things that are true and checkable, in the
                same position and at the same weight. The small rotated square
                is the same marker the process timeline uses for a stop on a
                route — an internal rhyme rather than a new decoration. */}
            <motion.div {...rise(0)} className="flex items-center gap-3">
              <span aria-hidden className="bg-valet-400 size-2 shrink-0 rotate-45 rounded-xs" />
              <p className="eyebrow text-valet-300">
                <span className="numeric">{siteConfig.yearsActive}+</span> jaar op Schiphol ·
                Duizenden reizigers per jaar
              </p>
            </motion.div>

            <h1 className="text-display-2xl text-heading-inverse mt-7">
              {HEADLINE_LINES.map((line, index) => (
                // overflow-hidden mask per line; the inner span rises out of it.
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

            {/* Shuttle first, and with a number attached.

                This used to read "Kies voor valet of shuttle parkeren — veilig,
                snel en professioneel", which named the 10% product first and
                then spent its remaining words on three adjectives that every
                competitor also claims. "In 5 tot 8 minuten naar de vertrekhal"
                is the same length and is checkable; it is also the client's own
                figure, already published on /onze-services/, the FAQ, the trust
                page and the service chooser, so this is not a new claim. */}
            <motion.p {...rise(0.42)} className="text-lead text-navy-100 mt-7 max-w-[46ch]">
              Binnen 2 minuten geregeld. Kies voor Shuttle met een gratis transfer naar de
              vertrekhal of voor Valet, waarbij onze chauffeur uw auto direct voor u parkeert.
            </motion.p>

            {/* The proof row. Deliberately not a bullet list with filled circle
                chips: three of those under every hero is the house style of
                every generated landing page. A hairline-ruled row reads as a
                service label on a terminal sign, which is the voice this site
                already speaks in the eyebrow and the ticket stub. */}
            <motion.ul
              {...rise(0.51)}
              className="border-line-inverse mt-9 grid w-full max-w-2xl gap-3 border-t pt-6 sm:grid-cols-3 sm:gap-x-6"
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

            <motion.div {...rise(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/reservering/" size="lg">
                Reserveer nu
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href="/tarieven/" variant="onDark" size="lg">
                Bekijk tarieven
              </Button>
            </motion.div>

            {/* The line directly under the CTAs. Client's copy, 31 July 2026.

                It used to be "Liever persoonlijk? 085-4013918" — an escape
                hatch. This is the opposite kind of line: it answers the last
                hesitation before the click ("do I find out now, or do I wait for
                someone to get back to me?") instead of offering a way around it.
                Micro-reassurance at the button is a better use of this slot than
                a second route out of the funnel.

                Kept at navy-300 and text-sm, i.e. quieter than the buttons above
                it. A reassurance that competes with the CTA stops being one.

                ── What this cost, and where it went ──────────────────────────
                The phone number was here deliberately: a visible, tappable
                number is the cheapest trust signal a parking site has, and this
                audience is deciding whether to hand over a car. It is NOT gone,
                but on a phone it is now one tap further away — the header's
                number is `hidden md:flex`, so below 768px it lives inside the
                hamburger and in the footer. Desktop is unaffected; the header
                carries it at all times there.
                TODO(client): if bookings by phone drop, this is the first change
                to look at. */}
            <motion.p {...rise(0.66)} className="text-navy-300 mt-6 text-sm">
              Online reserveren met directe bevestiging
            </motion.p>
          </div>

          {/* ---------- Right column: the ticket ----------
              Overhangs the section's bottom edge so it straddles the boundary
              with the board below. The notches are set to navy-950 because they
              sit in the upper, dark portion of the card. */}
          <motion.div
            initial={
              prefersReduced ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 32, rotate: -2 }
            }
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={
              prefersReduced ? { duration: 0 } : { duration: 0.7, delay: 0.68, ease: EASE }
            }
            // The id is what StickyBookingBar watches: the mobile bar appears
            // only once this card has left the viewport.
            id="hero-booking"
            className="relative z-10 -mb-24 w-full lg:-mb-32"
          >
            <BookingPicker notch="inverse" bounds={bounds} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
