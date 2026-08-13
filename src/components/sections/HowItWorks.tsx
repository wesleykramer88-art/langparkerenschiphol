import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';

/**
 * The four steps.
 *
 * The drawn route itself now lives in <Timeline> — extracted when the digitale
 * ritregistratie page needed the same treatment for six steps. This component is
 * the homepage's copy and its section header, nothing else, and it is no longer
 * a client component: <Timeline> owns the scroll-linked animation and carries
 * the 'use client' boundary with it.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer direct.',
    body: 'In slechts 2 minuten kunt u uw parkeerplaats bij Lang Parkeren Schiphol veiligstellen.',
  },
  {
    title: 'Wij staan klaar.',
    body: 'Bij aankomst op Schiphol of in onze garage staan we voor u klaar.',
  },
  {
    title: 'Vertrek ontspannen.',
    body: 'Wij zorgen voor de rest terwijl u met een gerust hart incheckt.',
  },
  {
    title: 'Auto klaar bij terugkomst.',
    body: 'Wanneer u terugkomt, staat uw auto netjes voor u klaar.',
  },
];

export function HowItWorks() {
  return (
    <Section id="zo-werkt-het" spacing="lg" aria-labelledby="stappen-heading">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow rule>Zo werkt het</Eyebrow>
            <h2 id="stappen-heading" className="text-display-lg mt-5">
              Geregeld in 4 eenvoudige stappen
            </h2>
          </div>
          <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
            Van reservering tot terugkomst duurt de hele overdracht bij elkaar niet langer dan een
            paar minuten.
          </p>
        </Reveal>

        <Timeline steps={STEPS} />
      </Container>
    </Section>
  );
}
