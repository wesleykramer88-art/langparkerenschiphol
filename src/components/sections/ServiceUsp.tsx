import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { SERVICE_COPY } from '@/config/services';
import type { ServiceSlug } from '@/lib/booking';

/**
 * "Uw voordeel" — one service's benefit line and its four USPs, as a section.
 *
 * The same words the ticket stub shows when that service is selected, here
 * stated once and held. On the picker the line is a first impression that a
 * visitor replaces the moment they enter dates; on a landing page about ONE
 * service it is the argument, so it gets the eyebrow and the width.
 *
 * Every string comes from src/config/services.ts. Nothing here is retyped, so
 * this block, the picker's stub and the homepage chooser cannot disagree about
 * what the client's own USPs say.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 * On the white band: navy-950 heading 16.90:1, ink-700 bullet text 9.58:1,
 * ink-500 supporting line 5.48:1. The icons are valet-600 on paper-50 at
 * 3.37:1 — below the 4.5 for text and above the 3.0 that non-text graphics
 * need, which is the correct floor for them: each icon restates the sentence
 * beside it and is aria-hidden, so nothing is carried by the icon alone.
 */
export function ServiceUsp({
  service,
  eyebrow = 'Uw voordeel',
  heading,
  subhead,
  paragraphs,
  bullets,
}: {
  service: ServiceSlug;
  eyebrow?: string;
  heading: string;
  /**
   * The H2 under the heading. The client's August 2026 service documents write
   * this block as a heading, a second line and two paragraphs of prose before
   * the list — so the section now has somewhere to put all three.
   */
  subhead?: string;
  /** Prose between the subhead and the benefit line. */
  paragraphs?: readonly string[];
  /**
   * The list on the right. Defaults to the compact four in config/services.ts;
   * the two service landing pages pass `detailBullets`, which is the longer list
   * the client wrote for them (six for shuttle, five for valet).
   */
  bullets?: readonly { icon: LucideIcon; text: string }[];
}) {
  const copy = SERVICE_COPY[service];
  const Usp = copy.usp.icon;
  const items = bullets ?? copy.bullets;

  return (
    <Section tone="surface" spacing="md" aria-labelledby="voordeel-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal>
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <h2 id="voordeel-heading" className="text-display-md mt-5 max-w-[16ch]">
              {heading}
            </h2>

            {subhead ? (
              <p className="text-heading mt-4 max-w-[30ch] text-lg font-medium">{subhead}</p>
            ) : null}

            {paragraphs?.length ? (
              <div className="mt-6 flex flex-col gap-4">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-body max-w-[52ch] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {/* The benefit line itself, set apart from the bullets under it.
                This is the client's own one-liner for the service — the line
                his ticket stub shows — so it is quoted rather than paraphrased,
                separator and all. */}
            <p className="border-line text-heading mt-8 flex items-start gap-3 border-t pt-6 text-base font-medium sm:text-lg">
              <Usp className="text-accent mt-1 size-5 shrink-0" aria-hidden />
              <span className="text-balance">{copy.usp.text}</span>
            </p>
          </Reveal>

          {/* <div>, not <li>: <Stagger as="ul"> emits the <li> itself, so an <li>
              here nested one inside another — invalid markup, and a hydration
              mismatch on both service pages. Pre-existing; found while verifying
              the August 2026 copy pass. */}
          <Stagger as="ul" className="divide-line border-line divide-y border-y">
            {items.map((bullet) => (
              <div key={bullet.text} className="flex items-start gap-5 py-5">
                <bullet.icon
                  className="text-accent mt-0.5 size-5 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-base sm:text-lg">{bullet.text}</span>
              </div>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
