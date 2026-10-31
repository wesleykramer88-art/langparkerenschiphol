import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { ContentSection } from '@/components/sections/ContentSection';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = createMetadata('cheapShuttle');

const PATH = '/goedkoop-shuttle-parkeren-schiphol/';
const CRUMBS = [{ name: 'Shuttle parkeren Schiphol', path: PATH }];

/**
 * /goedkoop-shuttle-parkeren-schiphol/ — Pagina 1 of the client's SEO document.
 *
 * Intent: price. The document is explicit that this page must be commercial but
 * stay useful — "niet alleen goedkoop roepen, maar uitleggen waarom het
 * voordelig en praktisch is" — and that price and trust have to appear
 * together, because the competitors it benchmarks against do exactly that.
 *
 * ── NO PRICES ARE PRINTED ON THIS PAGE, ON PURPOSE ──────────────────────────
 * It would be the obvious thing to do on a page about cost, and it is the one
 * thing that would age badly without anybody noticing. Rates depend on duration
 * and on outdoor-versus-covered, they are computed live by ParkingPro, and
 * /tarieven/ already shows the real number for a real date range. A hardcoded
 * "vanaf € X" here would be contradicted by the booking flow the moment the
 * rate list changes, and the visitor finds that out at the payment step.
 *
 * So this page explains the SHAPE of the pricing — why a terrain a few minutes
 * away costs less than a terminal deck, why per-day cost falls on a long stay,
 * why booking early helps — and sends every price question to the calculator.
 *
 * ── The comparison section is honest about valet ────────────────────────────
 * The document asks for "goedkoop shuttle parkeren versus valet parkeren of
 * officieel Schiphol parkeren". We compare against our OWN valet service, where
 * we know the facts. We do not print a comparison against Schiphol's official
 * P-tariffs: those change, we do not control them, and a stale competitor price
 * on our page is both a credibility problem and, under Dutch rules on
 * comparative advertising, a real one.
 * TODO(client): if you want a like-for-like table against P1/P3, we need a
 * dated source and a commitment to re-check it, or it should stay off.
 */

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat kost Shuttle parkeren?',
    answer:
      'De prijs hangt af van uw reisdata. Vul uw aankomst- en retourmoment in om de actuele prijs voor uw reservering te bekijken.',
  },
  {
    question: 'Hoe werkt Shuttle parkeren?',
    answer:
      'U parkeert buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar Schiphol Plaza; de rit duurt ongeveer 8 minuten.',
  },
  {
    question: 'Welke parkeervarianten zijn beschikbaar?',
    answer:
      'Shuttle parkeren is buiten beschikbaar. Bij Valet kiest u tussen buiten of overdekt parkeren.',
  },
  {
    question: 'Hoe lang duurt de shuttle naar de terminal?',
    answer: 'De rit van onze parkeerlocatie in Badhoevedorp naar Schiphol duurt ongeveer 8 minuten (alleen de rijtijd).',
  },
  {
    question: 'Hoe kom ik bij terugkomst terug naar mijn auto?',
    answer:
      'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
  },
  {
    question: 'Kan ik mijn reservering annuleren?',
    answer:
      'Annuleren tot 24 uur voor aankomst kan met een annuleringsdekking. Dat is een optionele, betaalde toevoeging die u tijdens het reserveren aan uw boeking toevoegt; de prijs ziet u voordat u afrekent. Zonder die dekking is annuleren niet mogelijk.',
  },
  {
    question: 'Hoe lang duurt de shuttletransfer?',
    answer:
      'De transfertijd naar Schiphol is ongeveer 8 minuten. Houd daarnaast rekening met de tijd die u nodig heeft om te parkeren, op de shuttle te wachten en in te checken.',
  },
];

export default function CheapShuttlePage() {
  return (
    <>
      <PageHero
        eyebrow="Shuttle parkeren"
        title="Shuttle parkeren bij Schiphol"
        lead="Parkeer buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar de vaste halte op Schiphol Plaza."
        photo="lotShuttle"
        objectPosition="object-[center_40%]"
        crumbs={CRUMBS}
      >
        <Button href="/tarieven/" size="lg">
          Bereken uw prijs
        </Button>
        <Button href="/shuttle-parkeren-schiphol/" variant="outline" size="lg">
          Hoe shuttle parkeren werkt
        </Button>
      </PageHero>

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat het is"
        title="Wat goedkoop shuttle parkeren precies inhoudt"
        paragraphs={[
          'Bij Shuttle parkeert u buiten aan de Schipholweg 181 in Badhoevedorp. De doorlopende shuttle brengt u naar de vaste halte op Schiphol Plaza; de rit duurt ongeveer 8 minuten.',
          'Bij terugkomst loopt u naar de vaste halte. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
          'Valet is een aparte service: u geeft uw auto af tussen Vertrekhal 2 en 3 en kiest voor buiten of overdekt parkeren.',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      />

      <ContentSection
        id="prijsvoordeel"
        eyebrow="De parkeerdiensten"
        title="Shuttle en Valet: dit is het verschil"
        paragraphs={[
          'Met Shuttle parkeert u zelf buiten in Badhoevedorp en reist u met de shuttle naar Schiphol Plaza.',
          'Met Valet geeft u uw auto af tussen Vertrekhal 2 en 3. Valet is beschikbaar met buiten of overdekt parkeren.',
          'Bekijk de actuele prijs en beschikbaarheid op basis van uw reisdata voordat u reserveert.',
        ]}
        bullets={[
          'Shuttle parkeren: buiten',
          'Shuttlelocatie: Schipholweg 181, Badhoevedorp',
          'Valet parkeren: buiten of overdekt',
          'Valetlocatie: tussen Vertrekhal 2 en 3',
        ]}
        reversed
        tone="surface"
      >
        <Button href="/tarieven/" className="mt-7">
          Bereken de prijs voor uw data
        </Button>
      </ContentSection>

      <ContentSection
        id="hoe-werkt-het"
        eyebrow="Hoe het werkt"
        title="Van aankomst tot ophalen"
        paragraphs={[
          'U reserveert vooraf online en geeft door wanneer u aankomt en wanneer u terugkomt. Op de dag zelf rijdt u naar onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp — niet naar de terminal, dat is bij deze service een veelgemaakte vergissing.',
          'U parkeert uw auto zelf op de plek die u krijgt aangewezen en neemt uw autosleutel mee. Onze shuttlebus zet u af bij de bushalte op Schiphol Plaza; de rit duurt ongeveer 8 minuten (alleen de rijtijd). Daarna loopt u door naar de incheckbalie.',
          'Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
        ]}
      >
        <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-7">
          De volledige uitleg over shuttle parkeren
        </Button>
      </ContentSection>

      <ContentSection
        id="veilig"
        eyebrow="Shuttle parkeren"
        title="Parkeerlocatie en terugkomst"
        paragraphs={[
          'U parkeert buiten op de shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp.',
          'De shuttle rijdt doorlopend. Bij terugkomst loopt u naar de vaste halte op Schiphol Plaza; u hoeft niet te bellen.',
        ]}
        bullets={[
          'Buiten parkeren',
          'Doorlopende shuttle naar Schiphol Plaza',
          'Transfertijd ongeveer 8 minuten',
          'Geen telefoontje nodig bij terugkomst',
        ]}
        photo="crewHandover"
        objectPosition="object-[center_55%]"
        tone="surface"
      >
        <Button href="/veilig-parkeren-schiphol/" variant="link" className="mt-7">
          Praktische informatie over parkeren
        </Button>
      </ContentSection>

      {/* ---------- The comparison ----------
          Our two services, side by side, split by a rule. Deliberately not a
          table against Schiphol's own P-tariffs — see the note at the top. */}
      <Section spacing="lg" aria-labelledby="vergelijking-heading">
        <Container>
          <Reveal className="max-w-[36ch]">
            <Eyebrow rule>Vergelijken</Eyebrow>
            <h2 id="vergelijking-heading" className="text-display-md mt-5">
              Shuttle of Valet — welke service past bij u?
            </h2>
            <p className="text-muted mt-6 max-w-[52ch]">
              De locaties, het parkeerproduct en de terugkomstprocedure verschillen per service.
            </p>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <Reveal className="py-9 lg:pr-12">
              <p className="eyebrow text-muted">Zelf parkeren</p>
              <h3 className="text-display-sm text-heading mt-3">Shuttle parkeren</h3>
              <p className="text-body mt-5 max-w-[44ch] leading-relaxed">
                U parkeert buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar Schiphol Plaza; de rit duurt ongeveer 8 minuten.
              </p>
              <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-6">
                Over shuttle parkeren
              </Button>
            </Reveal>

            <Reveal delay={80} className="py-9 lg:pl-12">
              <p className="eyebrow text-muted">Auto afgeven bij Schiphol</p>
              <h3 className="text-display-sm text-heading mt-3">Valet parking</h3>
              <p className="text-body mt-5 max-w-[44ch] leading-relaxed">
                Geef uw auto af tussen Vertrekhal 2 en 3. Bij Valet kiest u tussen buiten en overdekt parkeren.
              </p>
              <Button href="/valet-parking-schiphol/" variant="link" className="mt-6">
                Over valet parking
              </Button>
            </Reveal>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over Shuttle parkeren"
        lead="Over de prijsberekening, shuttletransfer en beschikbare parkeerdiensten."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Bekijk wat het kost voor uw data"
        lead="De prijs wordt live berekend voor uw eigen aankomst- en retourmoment. Geen richtprijs, maar het werkelijke tarief."
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
