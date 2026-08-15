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
}: {
  service: ServiceSlug;
  eyebrow?: string;
  heading: string;
}) {
  const copy = SERVICE_COPY[service];
  const Usp = copy.usp.icon;

  return (
    <Section tone="surface" spacing="md" aria-labelledby="voordeel-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal>
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <h2 id="voordeel-heading" className="text-display-md mt-5 max-w-[16ch]">
              {heading}
            </h2>

            {/* The benefit line itself, set apart from the bullets under it.
                This is the client's own one-liner for the service — the line
                his ticket stub shows — so it is quoted rather than paraphrased,
                separator and all. */}
            <p className="border-line text-heading mt-8 flex items-start gap-3 border-t pt-6 text-base font-medium sm:text-lg">
              <Usp className="text-accent mt-1 size-5 shrink-0" aria-hidden />
              <span className="text-balance">{copy.usp.text}</span>
            </p>
          </Reveal>

          <Stagger as="ul" className="divide-line border-line divide-y border-y">
            {copy.bullets.map((bullet) => (
              <li key={bullet.text} className="flex items-start gap-5 py-5">
                <bullet.icon
                  className="text-accent mt-0.5 size-5 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-base sm:text-lg">{bullet.text}</span>
              </li>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
