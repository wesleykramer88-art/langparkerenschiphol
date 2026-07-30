import { ArrowRight, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { reviews } from '@/content/reviews';

/**
 * What customers say.
 *
 * Moved ahead of the closing CTA. On the live site it sits after it, which is
 * backwards: anyone already persuaded has left, and anyone not persuaded is
 * closed at and then shown proof with nothing left to click.
 *
 * Three quotes, rendered once. The live site loops them through a carousel to
 * fill space, which shows the same three people twice and reads as padding — it
 * undermines the proof rather than multiplying it.
 *
 * The layout is deliberately asymmetric: the heading anchors a sticky left
 * column and the quotes run down the right as hairline-separated entries rather
 * than as three identical bordered boxes. Three equal cards give three quotes
 * equal weight and no shape; a column with an argument at the top of it has both.
 *
 * ── WHAT CHANGED, AND WHY ───────────────────────────────────────────────────
 * The left column used to open with "4,7" set at text-6xl over five orange
 * stars. That figure had no source — not a Google profile, not a review
 * platform, not a count of what it averaged — and the star rows beside each
 * quote implied a per-review score that was never collected either.
 *
 * Both are gone, here and everywhere else on the site. A number a reader cannot
 * check is worth nothing to the reader and is a liability to the client: under
 * the EU Omnibus rules an unverified average review score is an unfair
 * commercial practice, and the fine is calculated on turnover.
 *
 * What replaces the score is the one thing a hesitant reader actually wants —
 * a way to read more of them — and a sentence saying plainly what these three
 * are. See src/content/testimonials.ts.
 */
export function Testimonials() {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="reviews-heading">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[4fr_7fr] lg:gap-20">
          {/* ---------- The argument ---------- */}
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow rule>Ervaringen van reizigers</Eyebrow>
            <h2 id="reviews-heading" className="text-display-lg mt-5 max-w-[12ch]">
              Wat onze klanten zeggen
            </h2>

            <div className="border-line mt-9 border-t pt-9">
              {/* The oversized quote glyph does the job the 4,7 used to do —
                  it anchors the column and gives the sticky block something to
                  be. Unlike the number, it does not assert anything. */}
              <Quote
                className="text-valet-200 size-10 -scale-x-100"
                strokeWidth={1.5}
                aria-hidden
              />

              <p className="text-muted mt-5 max-w-[30ch] leading-relaxed">
                Drie reacties van reizigers die hun auto bij ons achterlieten, over de overdracht,
                de shuttle en de staat van de auto bij terugkomst.
              </p>

              <Button href="/reviews/" variant="link" className="mt-6">
                Lees alle ervaringen
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
            </div>
          </Reveal>

          {/* ---------- The quotes ---------- */}
          <Stagger as="ul" className="divide-line border-line divide-y border-t">
            {reviews.map((item) => (
              <figure key={item.name} className="py-9 first:pt-9 lg:py-11">
                <blockquote className="text-heading max-w-[52ch] text-lg leading-relaxed sm:text-xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="text-muted mt-5 flex flex-wrap items-center gap-x-3 text-sm">
                  <span className="text-heading font-semibold">{item.name}</span>
                  <span aria-hidden className="bg-line-strong h-3 w-px" />
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
