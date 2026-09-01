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

const MOBILE_STEPS = [
  {
    title: 'Reserveer uw parkeerplaats',
    body: 'Vul uw reisdata in en kies Shuttle of Valet op basis van wat het best bij uw vertrek past.',
  },
  {
    title: 'Parkeer zelf of geef uw auto af',
    body: 'Bij Shuttle parkeert u op ons terrein; bij Valet staat onze chauffeur klaar bij de vertrekhal.',
  },
  {
    title: 'Reis verder naar de vertrekhal',
    body: 'Shuttle brengt u verder naar Schiphol, terwijl u bij Valet direct doorloopt naar vertrek.',
  },
] as const;

export function HowItWorks() {
  return (
    <Section
      id="zo-werkt-het"
      spacing="lg"
      aria-labelledby="stappen-heading"
      className="py-14 md:py-24 lg:py-40"
    >
      <Container>
        <span id="stappen-heading" className="sr-only">
          Zo werkt het
        </span>
        <div className="md:hidden">
          <Reveal>
            <Eyebrow rule>Zo werkt het</Eyebrow>
            <h2 className="text-display-md mt-4">
              In 3 korte stappen geregeld
            </h2>
            <p className="text-muted mt-3 max-w-[34ch] text-sm leading-relaxed">
              De uitvoering verschilt per service, maar uw route naar Schiphol blijft kort en helder.
            </p>
          </Reveal>

          <ol className="border-line mt-6 space-y-4 border-t pt-6">
            {MOBILE_STEPS.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4">
                <span
                  aria-hidden
                  className="bg-accent ring-canvas mt-1 block size-3 rotate-45 rounded-xs ring-4"
                />
                <div>
                  <h3 className="text-heading text-base font-semibold">
                    <span className="sr-only">Stap {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-muted mt-1.5 text-sm leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden md:block">
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Zo werkt het</Eyebrow>
              <h2 className="text-display-lg mt-5">Geregeld in 4 eenvoudige stappen</h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Van reservering tot terugkomst duurt de hele overdracht bij elkaar niet langer dan een
              paar minuten.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </div>
      </Container>
    </Section>
  );
}
