import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';

/**
 * The board.
 *
 * Four claims under the hero, set the way a departure board sets a row: a large
 * figure in the mono face with tabular figures, a wide-tracked label beneath,
 * and a hairline between each column. That treatment is not decoration — it is
 * the reason these read as posted facts rather than as marketing.
 *
 * ── THIS BOARD WAS NAVY. IT IS NOW THE CANVAS ──────────────────────────────
 * Client, August 2026: "nergens donker". This band sat on navy-950 so that it
 * and the hero read as one continuous dark block with no seam between them.
 * That reasoning was sound and is now obsolete in one direction only — the
 * block is still continuous, it is simply no longer dark at this end.
 *
 * The hero's own bottom gradient was re-cut to land on the canvas instead of
 * closing to solid navy, so the two still meet without a line across the page.
 * If you change the tone here, change that gradient with it: a navy band under
 * a hero that fades to cream, or the reverse, draws exactly the horizontal rule
 * this arrangement exists to avoid. See `scrim-hero` in globals.css.
 *
 * The top padding is not decorative, it is the clearance the hero ticket's
 * overhang needs. The hero sets -mb-24 (6rem) / lg:-mb-32 (8rem); this band's
 * padding-top must stay larger than both or the ticket lands on the first
 * claim.
 *
 * Words are not set in mono: a word in the mono face reads as a code, not a
 * claim. Only the figures get it.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 *   navy-950 figures on canvas ... 15.01:1  AAA
 *   ink-500  labels  on canvas .... 4.87:1  AA  (14px, needs 4.5)
 */

type BoardItem = {
  /** A figure. Counts up once when the band enters the viewport. */
  number?: number;
  /**
   * A word before the figure, in the sans face — "Tot 24 uur".
   *
   * Added for the client's August 2026 copy, which qualifies the cancellation
   * window rather than stating it flat. It sits OUTSIDE the mono run on purpose:
   * "Tot" is a word, and the rule this board is built on is that only figures
   * get the mono face.
   */
  numberPrefix?: string;
  /** Glued to the figure, inside the mono run. */
  numberSuffix?: string;
  /** Follows the figure in the sans face — "uur", not a code. */
  unit?: string;
  /** Used instead of a figure where the claim has no number in it. */
  word?: string;
  label: string;
};

/**
 * All four are the client's final copy, August 2026. Three changed:
 *
 *   · "jaar actief op Schiphol" → the figure now carries "jaar" as its unit and
 *     the label states what the years are OF. His wording.
 *   · "Tot" was added to the cancellation window — see `numberPrefix`.
 *   · "AMS" became "24/7". The airport code was doing the work of a fact and is
 *     not one: it told a visitor already reading a page about Schiphol that this
 *     is at Schiphol. "24/7" says the service runs at the hour their flight
 *     actually leaves, which is the thing a 06:00 departure wants to know.
 *
 * Only "Duizenden" is untouched.
 */
const ITEMS: readonly BoardItem[] = [
  {
    number: siteConfig.yearsActive,
    numberSuffix: '+',
    unit: 'jaar',
    label: 'ervaring met parkeren bij Schiphol',
  },
  { word: 'Duizenden', label: 'tevreden reizigers per jaar' },
  // Not "gratis annuleren". The cancellation cover is a paid option, so the
  // free-cancellation framing sells a flexibility the visitor has to buy first
  // — and it contradicts "optionele annuleringsdekking" in the service chooser
  // two sections down.
  //
  // "Flexibel" has come off the front, because his board copy reads "Tot 24 uur
  // voor aankomst annuleren met annuleringsdekking". The word is not gone from
  // the site — his closing blocks on the shuttle, valet and waarom pages all
  // still open "Flexibel annuleren tot 24 uur …", and those keep it. The
  // qualifier that matters is "met annuleringsdekking", and that is in both.
  {
    numberPrefix: 'Tot',
    number: 24,
    unit: 'uur',
    label: 'voor aankomst annuleren met annuleringsdekking',
  },
  { word: '24/7', label: 'valet- en shuttleservice' },
];

export function TrustStrip() {
  return (
    <Section tone="canvas" spacing="none" className="pt-32 pb-14 lg:pt-44 lg:pb-20">
      <Container>
        {/* A list, because it is one: four parallel claims about the service. */}
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
          {ITEMS.map((item, index) => (
            <Reveal
              as="li"
              key={item.label}
              delay={index * 80}
              // The rule sits on the left of every column but the first, so the
              // group reads as one board rather than four boxed cells.
              className="lg:border-line lg:not-first:border-l lg:not-first:pl-12"
            >
              {/* text-3xl at the smallest width is not timidity: at 390px the
                  board is two columns, and "Duizenden" set at text-4xl runs into
                  the gutter. The figures step up from there. */}
              <p className="text-heading text-3xl leading-none font-semibold sm:text-4xl lg:text-5xl">
                {/* Stepped down like `unit`, and for the same reason: at the
                    figure's own size "Tot" is as loud as the 24 and the column
                    reads as two claims. */}
                {item.numberPrefix ? (
                  <span className="mr-2 text-xl font-medium sm:text-2xl lg:text-3xl">
                    {item.numberPrefix}
                  </span>
                ) : null}
                {item.number !== undefined ? (
                  <CountUp to={item.number} suffix={item.numberSuffix} />
                ) : (
                  item.word
                )}
                {item.unit ? (
                  <span className="ml-2 text-xl font-medium sm:text-2xl lg:text-3xl">
                    {item.unit}
                  </span>
                ) : null}
              </p>
              <p className="text-muted mt-4 max-w-[18ch] text-sm leading-snug">{item.label}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
