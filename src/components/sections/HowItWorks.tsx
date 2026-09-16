import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';

/**
 * One responsive process timeline. The same four steps are rendered on every
 * screen size, so visitors and search engines never receive two competing
 * versions of the booking journey.
 */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer uw parkeerplaats',
    body: 'Vul uw reisdata in en kies Shuttle of Valet. U ontvangt direct een bevestiging.',
  },
  {
    title: 'Parkeer zelf of geef uw auto af',
    body: 'Bij Shuttle parkeert u op ons terrein; bij Valet staat onze chauffeur klaar bij de vertrekhal.',
  },
  {
    title: 'Ga verder naar de vertrekhal',
    body: 'De shuttle brengt u in 5 tot 8 minuten naar Schiphol. Bij Valet loopt u direct door naar de check-in.',
  },
  {
    title: 'Uw auto staat klaar bij terugkomst',
    body: 'Na uw terugreis haalt de shuttle u op of staat uw auto volgens afspraak bij de vertrekhal klaar.',
  },
];

export function HowItWorks() {
  return (
    <Section
      id="zo-werkt-het"
      spacing="lg"
      aria-labelledby="stappen-heading"
      className="py-14 md:py-24 lg:py-40"
    >
      <Container>
        <Reveal className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow rule>Zo werkt het</Eyebrow>
            <h2 id="stappen-heading" className="text-display-md mt-4 md:text-display-lg md:mt-5">
              Geregeld in 4 duidelijke stappen
            </h2>
          </div>
          <p className="text-muted max-w-[38ch] text-sm leading-relaxed md:text-base lg:pb-2 lg:text-right">
            Van reservering tot terugkomst weet u precies waar u aan toe bent.
          </p>
        </Reveal>

        <Timeline steps={STEPS} />
      </Container>
    </Section>
  );
}
