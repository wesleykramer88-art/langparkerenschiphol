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
 * Set on navy-950, the same field the hero's scrim resolves to at its foot, so
 * the two are one continuous dark block with no seam between them. The earlier
 * navy-900 step drew a visible horizontal line straight across the page exactly
 * where the hero's ticket overhangs it. The board is separated by its hairlines
 * and its spacing, which is enough — it does not also need its own colour.
 *
 * The top padding is not decorative, it is the clearance that overhang needs.
 * The hero sets -mb-24 (6rem) / lg:-mb-32 (8rem); this band's padding-top must
 * stay larger than both or the ticket lands on top of the first claim.
 *
 * Words are not set in mono: a word in the mono face reads as a code, not a
 * claim. Only the figures get it.
 */

type BoardItem = {
  /** A figure. Counts up once when the band enters the viewport. */
  number?: number;
  /** Glued to the figure, inside the mono run. */
  numberSuffix?: string;
  /** Follows the figure in the sans face — "uur", not a code. */
  unit?: string;
  /** Used instead of a figure where the claim has no number in it. */
  word?: string;
  label: string;
};

const ITEMS: readonly BoardItem[] = [
  { number: siteConfig.yearsActive, numberSuffix: '+', label: 'jaar actief op Schiphol' },
  { word: 'Duizenden', label: 'tevreden reizigers per jaar' },
  // Not "gratis annuleren". The cancellation cover is a paid option, so the
  // free-cancellation framing sells a flexibility the visitor has to buy first
  // — and it contradicts "optionele annuleringsdekking" in the service chooser
  // two sections down. "Flexibel … met annuleringsdekking" is the one phrasing
  // used everywhere the claim appears.
  { number: 24, unit: 'uur', label: 'voor aankomst flexibel annuleren met annuleringsdekking' },
  { word: 'AMS', label: 'valet- en shuttleservice' },
];

export function TrustStrip() {
  return (
    <Section tone="inverse" spacing="none" className="pt-32 pb-14 lg:pt-44 lg:pb-20">
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
              className="lg:border-line-inverse lg:not-first:border-l lg:not-first:pl-12"
            >
              {/* text-3xl at the smallest width is not timidity: at 390px the
                  board is two columns, and "Duizenden" set at text-4xl runs into
                  the gutter. The figures step up from there. */}
              <p className="text-heading-inverse text-3xl leading-none font-semibold sm:text-4xl lg:text-5xl">
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
              <p className="text-navy-300 mt-4 max-w-[18ch] text-sm leading-snug">{item.label}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
