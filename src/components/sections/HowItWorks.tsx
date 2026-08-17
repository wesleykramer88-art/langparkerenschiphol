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

/**
 * The client's four steps, August 2026.
 *
 * ⚠ His headings read "Stap 1: Reserveer uw parkeerplaats". The "Stap n:" is NOT
 * carried here, because <Timeline> already emits it — visually as the large ghost
 * numeral and, for anyone who cannot see that, as an sr-only prefix on the <h3>.
 * Including it in the title would announce "Stap 1: Stap 1: Reserveer …".
 *
 * ⚠ Steps 2 and 4 are roughly twice as long as the lines they replace, because
 * each now answers for BOTH services rather than generalising across them —
 * which is the improvement: "Bij aankomst op Schiphol of in onze garage staan we
 * voor u klaar" asked the reader to work out which of those applied to them. At
 * four columns and a 34ch measure they run to about six lines, so the band is
 * noticeably taller and the columns are visibly uneven. That is a height change
 * only; the grid is unchanged.
 */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer uw parkeerplaats',
    body: 'Reserveer binnen 2 minuten online. Kies voor valet of shuttle parkeren, vul uw reisgegevens in en ontvang direct uw bevestiging.',
  },
  {
    // Two paragraphs in his document, run together here: `body` is one string,
    // and the two questions read as a pair rather than needing a break.
    title: 'Wij staan voor u klaar',
    body: 'Kiest u voor valet parkeren? Dan ontmoet u onze chauffeur bij de vertrekhal van Schiphol. Kiest u voor shuttle parkeren? Dan rijdt u rechtstreeks naar onze parkeerlocatie in Schiphol-Rijk.',
  },
  {
    title: 'Vertrek met een gerust gevoel',
    body: 'Wij zorgen ervoor dat uw auto tijdens uw reis veilig wordt geparkeerd. U kunt ondertussen door naar de vertrekhal en aan uw reis beginnen.',
  },
  {
    title: 'Snel weer op weg na uw terugkomst',
    body: 'Bij valet parkeren wordt uw auto na uw terugkomst weer naar Schiphol gebracht. Bij shuttle parkeren halen wij u op en brengen we u terug naar de parkeerlocatie.',
  },
];

export function HowItWorks() {
  return (
    <Section id="zo-werkt-het" spacing="lg" aria-labelledby="stappen-heading">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            {/* His H1 for the section becomes the eyebrow; his H2 is the
                heading, and it is word-for-word what was already here. */}
            <Eyebrow rule>Zo werkt parkeren bij Schiphol</Eyebrow>
            <h2 id="stappen-heading" className="text-display-lg mt-5">
              Geregeld in 4 eenvoudige stappen
            </h2>
          </div>
          <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
            Van reservering tot vertrek: wij houden parkeren bij Schiphol graag zo eenvoudig
            mogelijk.
          </p>
        </Reveal>

        <Timeline steps={STEPS} />
      </Container>
    </Section>
  );
}
