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
 *      being laid on a desk
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
 *
 * ── Client's final copy, August 2026 ────────────────────────────────────────
 * "op Schiphol" → "bij Schiphol", and sentence case: his document heads the page
 * "Lang parkeren bij Schiphol". The lowercase p is his, and it is deliberate on
 * our side too — set as a sentence this is a description of the service, where
 * "Lang Parkeren" in caps reads as the company signing its own name.
 *
 * ⚠ NO SCRIM RE-MEASURE NEEDED, and this is the arithmetic rather than an
 * assumption: the binding constraint is the WIDEST line, which is still
 * "Lang parkeren" (13 characters). "bij Schiphol" is 12 against the old "op
 * Schiphol"'s 11 — one character wider, and still short of the first line. The
 * copy column therefore ends exactly where it did, over the same part of the
 * ramp. Two lines, as before.
 */
const HEADLINE_LINES = ['Lang parkeren', 'bij Schiphol'] as const;

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
  // ── Client's final wording, August 2026 ──────────────────────────────────
  // Was 'Op 5 tot 8 minuten van de vertrekhal'. His line names the thing that
  // is five minutes away — the parkeerlocatie — which is the half a reader has
  // to infer from ours, and it keeps the published 5-to-8 figure the note below
  // was written to defend. So the TODO under it still stands, unanswered.
  //
  // ⚠ It is 17 characters longer, which makes this column wrap to three lines at
  // lg where it wrapped to two. The row does NOT get wider — the grid is capped
  // at max-w-lg and the text wraps inside its own column — so the scrim
  // arithmetic below is untouched. The hero simply grows a line taller on
  // desktop. Below sm the row was already stacked.
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
  'Parkeerlocatie op slechts 5 tot 8 minuten van Schiphol',
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
    // -mt-20 pt-20 is what makes the header's transparency mean anything: the
    // bar is h-20 and sits in normal flow, so without this the hero starts BELOW
    // it and a transparent bar shows the cream canvas — light nav text on cream,
    // i.e. an invisible header. Pulling the section up by exactly the bar's
    // height and padding it back by the same amount slides the photograph under
    // the bar without moving a single pixel of hero content.
    <section className="bg-surface-inverse relative -mt-20 overflow-hidden pt-20">
      {/* ---------- The image ----------
          The real kerbside photograph this slot has been asking for since the
          site shipped: a crew member in the orange jacket walking a customer to
          the open Vito at the terminal kerb, supplied by the client on
          3 August 2026. See `crewShuttleTerminal` in config/images.ts.

          It ends a run of two AI-generated heroes. Both of those were reaching
          for exactly this — livery, van, airport, kerb — and both had to be
          shipped with a list of things not to look at too closely. That list is
          now empty: no mangled flight board, no invented carriers, no illegible
          plate legend. There is nothing here to crop AROUND, which is why the
          object-position values below are about composition and not about
          hiding a defect.

          It also carries the one thing neither generated frame could: a
          customer, turned back over her shoulder, smiling. The page sells
          handing a stranger your car keys.

          Contrast went UP, not down, despite the frame being far brighter — the
          scrim's 93% navy at the left carries it. Measured at 1440 × 800 in the
          copy column: lead 6.65:1 against the old frame's 5.53:1, H1 8.20:1,
          micro-line 6.97:1. So `scrim-hero` was left exactly as it was. If this
          image is replaced, re-measure — see the note on that utility.

          ⚠ The supplied file is 1678px wide, so the landscape srcset caps at
          1200w and the desktop hero is upscaled above that. The manifest entry
          explains why, and asks the client for the original camera file.

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
             0.75 : 1 — about a tenth of the width lost, which the portrait crop
             is framed to absorb: the wordmark across the jacket clears both
             edges, and the wayfinding sign and the van's open door survive.

          At lg the photograph goes back to filling the section, where the
          proportions were never the problem: this frame is 1.79 : 1 and a
          1440 × 800 section is 1.80 : 1, so it lands almost exactly — 45% is
          doing nearly nothing, and stays only so a taller viewport still trims
          sky rather than kerb. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-128 sm:h-152 lg:inset-0 lg:h-full">
        <HeroPhoto
          name="crewShuttleTerminal"
          portraitName="crewShuttleTerminalPortrait"
          className="absolute inset-0 h-full w-full"
          // sm stays at 42%, and for a new reason. Between 640px and lg the box
          // is about 1.05:1 against the frame's 1.79:1, so only ~59% of the
          // width shows. Centred, that window cuts the customer's face in half
          // at the left edge; at 42% she is whole and the van's open door and
          // rear light still close the right side. Past ~50% she is gone.
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
        {/* Mobile. Lightened with the desktop ramp — 72/52 became 62/38 — but
            it still CLOSES on navy-950, and that is not an oversight. Below lg
            the photograph occupies the top band only and the rest of the
            section is the flat navy behind it, so this gradient has to land on
            that colour or it draws a line across the middle of the hero.
            ⚠ That flat lower half is the one genuinely dark area left on the
            homepage. Making it light means changing the mobile hero's LAYOUT,
            not this gradient — see the note at the top of this component. */}
        <div className="from-navy-950/62 via-navy-950/38 to-navy-950 absolute inset-0 bg-linear-to-b lg:hidden" />
        <div className="scrim-hero absolute inset-0 hidden lg:block" />

        {/* ---------- The header's own scrim ----------
            The site header is transparent on '/' and only on '/' (see
            HeaderShell), so the nav, the wordmark and the phone number are
            light type sitting directly on this photograph.

            Lightening the hero broke them. The old ramp opened at 58% navy at
            the top of the frame and carried the bar for free; at 41% it does
            not. Measured over the real composited hero, the nav ran from
            4.37:1 down to 2.11:1 against a 4.5 floor — worst at the right-hand
            end, where the gradient is thinnest and "Contact" and "Inloggen"
            sit over bright terminal glazing.

            The fix is local. Re-darkening the hero to carry the bar would undo
            the entire point of the re-cut, so this is a 128px band behind the
            header only: opaque enough at the very top for 15px type, gone by
            the time it reaches the eyebrow. It reads as chrome, not as part of
            the picture.

            ⚠ Tied to the header's height. The bar is h-20 (80px) and shrinks to
            4.5rem on scroll; at lg this is h-32 (128px) so the fade completes
            below it. If the header gets taller, this grows with it.

            ── Why it is TALLER below lg ──────────────────────────────────────
            On a phone the eyebrow wraps to three lines and runs to about
            y=190, i.e. straight past a 128px band and into the brightest part
            of the frame. Measured per line, its last two ran 3.62:1 and
            3.48:1 against a 4.5 floor.
            The alternative was re-darkening the whole mobile gradient, which
            costs the entire photograph to protect one 12px line. At h-48
            (192px) the strip covers the header AND the eyebrow, every line
            clears 4.5, and the mobile ramp stays at the lighter 62/38. */}
        <div
          aria-hidden
          className="from-navy-950/88 via-navy-950/46 absolute inset-x-0 top-0 h-48 bg-linear-to-b to-transparent lg:h-32"
        />
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
              {/* ── This line WAS valet-300, and that was the single thing
                  stopping the scrim from being lightened at all ────────────
                  Measured over the real composited hero at 1440×800, the
                  valet-300 eyebrow was the binding constraint on the whole
                  band: 4.98:1 against a 4.5 floor, i.e. 0.48 of margin, while
                  the lead had 9.31:1 against the same floor. Every candidate
                  ramp that meaningfully opened the photograph pushed this one
                  line under AA before anything else came close.
                  The orange has NOT left the row — the diamond beside it is
                  still valet-400. What changed is the 12px type, which is the
                  size at which a mid-ramp accent on a photograph was always
                  going to be the first thing to fail. */}
              <p className="eyebrow text-paper-50">
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

            {/* The promise. Rides in on the beat immediately after the last
                headline line lands — 0.07 + 2 × 0.09 = 0.25s for the second
                line, so 0.34 reads as the same gesture finishing rather than as
                a fourth element arriving. */}
            <motion.p {...rise(0.34)} className="text-display-md text-valet-300 mt-4">
              {SUBHEAD}
            </motion.p>

            {/* Shuttle first, and with a number attached.

                This used to read "Kies voor valet of shuttle parkeren — veilig,
                snel en professioneel", which named the 10% product first and
                then spent its remaining words on three adjectives that every
                competitor also claims. "In 5 tot 8 minuten naar de vertrekhal"
                is the same length and is checkable; it is also the client's own
                figure, already published on /onze-services/, the FAQ, the trust
                page and the service chooser, so this is not a new claim.

                ── Client's final copy, August 2026 ──────────────────────────
                Same argument, his sentences: shuttle still leads, the two-minute
                claim moves to the front where it is the first thing said, and
                "uw parkeerplaats bij Schiphol" gives the opening sentence an
                object. About 15 characters longer, so it wraps one line further
                at the documented 46ch cap — which is a height change, not a
                width one, and the cap is what the scrim was measured against.

                His document sets "shuttle parkeren" and "valet parkeren" in
                bold. Rendered plain here: bold inside a 20px lead over a
                photograph reads as two different type colours rather than as
                emphasis, and the site does not use inline bold in body copy
                anywhere else. Same decision on every page in this pass. */}
            <motion.p {...rise(0.42)} className="text-lead text-navy-100 mt-7 max-w-[46ch]">
              Reserveer binnen 2 minuten uw parkeerplaats bij Schiphol. Kies voor shuttle parkeren
              met gratis transfer naar de vertrekhal of voor valet parkeren, waarbij onze chauffeur
              uw auto voor u parkeert.
            </motion.p>

            {/* The proof row. Deliberately not a bullet list with filled circle
                chips: three of those under every hero is the house style of
                every generated landing page. A hairline-ruled row reads as a
                service label on a terminal sign, which is the voice this site
                already speaks in the eyebrow and the ticket stub. */}
            <motion.ul
              {...rise(0.51)}
              // max-w-lg, not max-w-2xl. The row used to run 672px wide, which
              // at 1440 put its last item at 57% across the frame — out where
              // the scrim has thinned to let the van and the Departures sign
              // through. That one row was holding the entire right half of the
              // gradient up: it needed 4.5:1 at 14px in a part of the picture
              // the whole re-cut exists to open. At 512px it ends around 46%,
              // inside the flat part of the ramp, and the tail is free.
              // If you widen this again, re-measure the scrim. See globals.css.
              className="border-line-inverse mt-9 grid w-full max-w-lg gap-3 border-t pt-6 sm:grid-cols-3 sm:gap-x-5"
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

            {/* Last in the load sequence, deliberately.
                The offer is a reason to book now, not the reason to book here —
                it has to arrive after the headline, the proof row and the CTAs
                have made their case, or the page opens by discounting itself. */}
            {showPromo ? (
              <motion.div {...rise(0.74)} className="mt-7">
                <PromoCoupon />
              </motion.div>
            ) : null}
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
