import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { ContentSection } from '@/components/sections/ContentSection';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = createMetadata('selfParking');

const PATH = '/zelf-parkeren-schiphol/';
const CRUMBS = [{ name: 'Zelf parkeren Schiphol', path: PATH }];

/**
 * /zelf-parkeren-schiphol/ — Pagina 5 of the SEO document.
 *
 * ── The document's own warning governs this page ────────────────────────────
 * "Deze pagina moet duidelijk anders aanvoelen dan de sleutel-pagina: hier ligt
 * de nadruk meer op het proces en de controle, minder op alleen de sleutelvraag."
 *
 * That is a real risk and it is worth being explicit about how it is avoided,
 * because the two pages share a service and half their facts:
 *
 *   /parkeren-schiphol-zonder-sleutel-inleveren/  answers ONE anxious question.
 *     It opens with the short answer in a panel, spends its middle on what
 *     handing over a key feels like, and covers valet's safe because the honest
 *     answer requires it.
 *
 *   THIS PAGE                                     describes a PROCESS.
 *     It opens on what you do, gives the day itself a six-step timeline, and
 *     spends its middle on knowing where the car is and what that is worth. The
 *     key appears once, as one property of self-parking among several, and links
 *     away rather than re-arguing.
 *
 * If a future edit makes this page open with the key question, the two have
 * collapsed into one and one of them should be redirected.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'U rijdt het terrein op.',
    body: 'De shuttleparkeerlocatie ligt aan de Schipholweg 181 in Badhoevedorp.',
  },
  {
    title: 'U parkeert zelf.',
    body: 'U parkeert uw auto buiten op het terrein.',
  },
  {
    title: 'Sleutel op zak.',
    body: 'U neemt uw autosleutel mee.',
  },
  {
    title: 'De shuttle brengt u weg.',
    body: 'De shuttlerit naar de bushalte op Schiphol Plaza duurt ongeveer 8 minuten (alleen de rijtijd); vanaf daar loopt u door naar de incheckbalie.',
  },
  {
    title: 'Terug bij uw eigen auto.',
    body: 'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Parkeer ik altijd zelf?',
    answer:
      'Bij shuttle parkeren wel — dat is precies wat deze service inhoudt. Kiest u voor valet parking, dan rijdt u tot de vertrekhal en parkeert onze chauffeur uw auto voor u.',
  },
  {
    question: 'Moet ik zelf een plek zoeken?',
    answer:
      'U parkeert uw auto zelf buiten op de shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp.',
  },
  {
    question: 'Wordt mijn auto later nog verplaatst?',
    answer:
      'Nee. U houdt uw autosleutel, dus uw auto blijft staan waar u hem heeft neergezet tot u terugkomt.',
  },
  {
    question: 'Waar vertrekt de shuttle?',
    answer:
      'Bij onze shuttleparkeerlocatie parkeert u zelf en stapt u in de shuttlebus. De rit naar de bushalte op Schiphol Plaza duurt ongeveer 8 minuten.',
  },
  {
    question: 'Hoe kom ik na mijn reis terug bij mijn auto?',
    answer:
      'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
  },
  {
    question: 'Hoe lang van tevoren moet ik op het terrein zijn?',
    answer:
      'De shuttlerit naar Schiphol duurt ongeveer 8 minuten. Houd daarnaast rekening met de tijd die u nodig heeft om te parkeren, op de shuttle te wachten en in te checken.',
  },
  {
    question: 'Kan ik mijn auto overdekt neerzetten?',
    answer:
      'Nee. Shuttle parkeren is alleen buiten beschikbaar. Overdekt parkeren is beschikbaar bij Valet parkeren.',
  },
  {
    question: 'Is zelf parkeren goedkoper?',
    answer:
      'Bekijk de actuele prijzen op de tarievenpagina of bereken uw prijs op basis van uw reisdata.',
  },
];

export default function SelfParkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Zelf parkeren"
        title="Zelf parkeren bij Schiphol"
        lead="U parkeert buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar de vaste halte op Schiphol Plaza."
        photo="lotShuttle"
        objectPosition="object-[center_50%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=shuttle" size="lg">
          Reserveer shuttle parkeren
        </Button>
      </PageHero>

      <ContentSection
        id="waarom"
        eyebrow="Waarom zelf"
        title="Veel reizigers zetten hun auto liever zelf neer"
        paragraphs={[
          'Bij Shuttle parkeert u uw auto zelf buiten aan de Schipholweg 181 in Badhoevedorp. Daarna brengt de doorlopende shuttle u naar de vaste halte op Schiphol Plaza.',
          'Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3. Valet is beschikbaar met buiten of overdekt parkeren.',
        ]}
        photo="lotShuttle"
        objectPosition="object-[center_38%]"
      />

      {/* ---------- The day itself ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="dag-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>De dag van vertrek</Eyebrow>
              <h2 id="dag-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Zo gaat zelf parkeren in de praktijk
              </h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Van aankomst op de parkeerlocatie tot uw terugkomst op Schiphol.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      <ContentSection
        id="controle"
        eyebrow="Controle"
        title="Parkeer zelf op de Shuttle-locatie"
        paragraphs={[
          'Bij Shuttle parkeert u zelf buiten op de locatie in Badhoevedorp. De shuttle brengt u naar Schiphol en haalt u bij terugkomst op bij de vaste halte op Schiphol Plaza.',
          'De terugrit met Shuttle vraagt geen telefoontje. Bij Valet belt u direct na de landing en nogmaals zodra u uw ruimbagage heeft ontvangen.',
        ]}
        bullets={[
          'Parkeerlocatie: Schipholweg 181, Badhoevedorp',
          'Shuttle naar Schiphol Plaza rijdt doorlopend',
          'Transfertijd ongeveer 8 minuten',
          'Alleen Shuttle is buiten beschikbaar',
        ]}
        reversed
      >
        <Button href="/parkeren-schiphol-zonder-sleutel-inleveren/" variant="link" className="mt-7">
          Over uw sleutel meenemen
        </Button>
      </ContentSection>

      <ContentSection
        id="voor-wie"
        eyebrow="Voor wie"
        title="Voor wie zelf parkeren de juiste keuze is"
        paragraphs={[
          'Shuttle parkeren is de optie waarbij u zelf parkeert en met de shuttle naar Schiphol reist. Kies Valet als u uw auto liever bij de vertrekhallen afgeeft; daarbij kunt u buiten of overdekt parkeren.',
        ]}
        tone="surface"
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/goedkoop-shuttle-parkeren-schiphol/" variant="outline">
            Wat het kost
          </Button>
          <Button href="/veilig-parkeren-schiphol/" variant="outline">
            Hoe veilig het terrein is
          </Button>
        </div>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Vragen over zelf parkeren"
        lead="Of u altijd zelf parkeert, of de auto verplaatst wordt, waar de shuttle vertrekt en hoe u terugkomt."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Zet uw auto zelf neer"
        lead="Reserveer Shuttle parkeren op de locatie aan de Schipholweg 181 in Badhoevedorp."
        photo="lotShuttle"
        bookingHref="/reservering/?service=shuttle"
        bookingLabel="Reserveer shuttle parkeren"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
