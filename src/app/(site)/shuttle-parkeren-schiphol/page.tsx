import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, serviceSchema, type FaqItem } from '@/lib/schema';
import { Button } from '@/components/ui/Button';
import { RouteButton } from '@/components/ui/RouteButton';
import { BookingPicker } from '@/components/booking/BookingPicker';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceUsp } from '@/components/sections/ServiceUsp';
import { ContentSection } from '@/components/sections/ContentSection';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { fetchPickerBounds } from '@/lib/parkingpro-config';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('shuttleParking');

const PATH = '/shuttle-parkeren-schiphol/';
const CRUMBS = [{ name: 'Shuttle parkeren Schiphol', path: PATH }];

/**
 * /shuttle-parkeren-schiphol/
 *
 * ── THIS PAGE IS TWO BRIEFS ────────────────────────────────────────────────
 * The build brief specified it as the Shuttle service page: booking widget
 * defaulted to shuttle, the client's hard-coded "Uw voordeel" line, his four
 * shuttle USPs. His SEO content document specified the SAME URL as Pagina 2 —
 * "de belangrijkste productpagina" and "de meest complete uitlegpagina binnen
 * het cluster", with a step-by-step, a travel-time section, a who-it-suits
 * section, a concerns section and an FAQ.
 *
 * They are one page. Building two would put two near-identical intents on two
 * URLs, which is precisely the cannibalisation the document warns against on
 * its final page. So the order below is the document's, and the service
 * furniture (the ticket in the hero, the USP block) sits inside it.
 *
 * This is the hub: it links down to the other four cluster pages, and they link
 * back up to it.
 *
 * The page describes the active outdoor Shuttle service and its confirmed
 * location, transfer time, continuous shuttle and return procedure.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer online.',
    body: 'U kiest uw aankomst- en retourmoment en rondt de reservering in een paar minuten af. U ontvangt direct een bevestiging.',
  },
  {
    title: 'Rijd naar de parkeerlocatie.',
    body: 'U rijdt naar de shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp.',
  },
  {
    title: 'Parkeer zelf, sleutel mee.',
    body: 'U zet uw auto zelf neer en neemt uw autosleutel gewoon mee op reis.',
  },
  {
    title: 'Shuttle naar Schiphol Plaza.',
    body: 'De shuttle rijdt doorlopend en zet u af bij de bushalte op Schiphol Plaza. De rit duurt ongeveer 8 minuten.',
  },
  {
    title: 'Terug naar uw eigen auto.',
    body: 'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar de parkeerlocatie.',
  },
];

/** Who it suits. The document asks for this section by name. */
const SUITS = [
  {
    title: 'Reizigers die zelf willen parkeren',
    body: 'Bij Shuttle parkeert u uw auto zelf buiten op de locatie in Badhoevedorp.',
  },
  {
    title: 'Reizigers die met de shuttle willen reizen',
    body: 'De shuttle rijdt doorlopend naar de vaste halte op Schiphol Plaza.',
  },
  {
    title: 'Reizigers die buiten willen parkeren',
    body: 'Shuttle parkeren is beschikbaar op het buitenterrein.',
  },
  {
    title: 'Reizigers die een korte transfer willen',
    body: 'De shuttlerit naar Schiphol Plaza duurt ongeveer 8 minuten.',
  },
] as const;

/**
 * The concerns section. The document asks for "mogelijke zorgen: wachten op
 * shuttle, bagage, nachtelijke aankomst of late terugkeer" — and this is the
 * part where an SEO page normally starts promising things.
 *
 * It does not. Each answer states the procedure that exists and stops there.
 * TODO(client): two of these would be much stronger with a number from you —
 * how vaak de shuttle rijdt in de daluren, en hoe de terugrit 's nachts loopt.
 * Zodra we die hebben, vervangen ze de algemene formulering hieronder.
 */
const CONCERNS: readonly FaqItem[] = [
  {
    question: 'Moet ik lang wachten op de shuttle?',
    answer:
      'De shuttle rijdt doorlopend. De rit naar Schiphol Plaza duurt ongeveer 8 minuten.',
  },
  {
    question: 'Hoe gaat het met veel bagage?',
    answer:
      'Bij Shuttle parkeert u zelf op de locatie in Badhoevedorp en reist u met de shuttle naar Schiphol Plaza.',
  },
  {
    question: 'Wat als ik midden in de nacht aankom of terugkom?',
    answer:
      'De shuttle rijdt doorlopend. Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza; u hoeft niet te bellen.',
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraging heeft?',
    answer:
      'Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Hoe laat moet ik aanwezig zijn bij shuttle parkeren?',
    answer:
      'De shuttlerit duurt ongeveer 8 minuten. Houd daarnaast rekening met de tijd die u nodig heeft om te parkeren, op de shuttle te wachten en in te checken.',
  },
  {
    question: 'Waar moet ik precies zijn?',
    answer:
      'Bij de shuttleparkeerlocatie aan de Schipholweg 181, 1171 PK Badhoevedorp.',
  },
  {
    question: 'Hoe lang duurt de rit naar Schiphol?',
    answer:
      'De rit met de shuttlebus van onze parkeerlocatie naar Schiphol duurt ongeveer 8 minuten. Dat is alleen de rijtijd, niet de totale tijd inclusief parkeren, wachten en instappen.',
  },
  {
    question: 'Moet ik mijn autosleutel afgeven?',
    answer:
      'Nee. Bij Shuttle parkeert u zelf en neemt u uw sleutel mee. Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3; daarbij kiest u tussen buiten of overdekt parkeren.',
  },
  {
    question: 'Waar stap ik uit op Schiphol?',
    answer:
      'Onze shuttlebus zet u af bij de bushalte op Schiphol Plaza. Vanaf daar loopt u door naar de incheckbalies.',
  },
  {
    question: 'Hoe kom ik na mijn reis terug bij mijn auto?',
    answer:
      'U loopt naar dezelfde bushalte op Schiphol Plaza waar u bent uitgestapt. U hoeft niet te bellen: stap in wanneer de shuttlebus langskomt. De bus brengt u terug naar uw auto.',
  },
  {
    question: 'Kan ik mijn reservering nog wijzigen of annuleren?',
    answer:
      'Met een annuleringsdekking annuleert u tot 24 uur voor aankomst. Die dekking is een optionele, betaalde toevoeging die u tijdens het reserveren aan uw boeking toevoegt; de prijs ziet u voordat u afrekent. Binnen 24 uur voor uw reis is annuleren niet meer mogelijk.',
  },
  {
    question: 'Staat mijn auto binnen of buiten?',
    answer:
      'Shuttle parkeren is alleen beschikbaar op het buitenterrein. Overdekt parkeren wordt op dit moment uitsluitend aangeboden bij Valet parkeren.',
  },
];

export default async function ShuttleParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Shuttle Parkeren"
        title="Shuttle parkeren bij Schiphol"
        lead={`Bij Shuttle parkeren parkeert u buiten aan de ${siteConfig.shuttleParking.street} in ${siteConfig.shuttleParking.locality}. De shuttle rijdt doorlopend naar Schiphol Plaza; de rit duurt ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten. U neemt uw sleutel mee.`}
        photo="lotShuttle"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
        // Defaulted to shuttle: a visitor who clicked through to a page about
        // one service should not have to correct the form on it.
        aside={<BookingPicker notch="inverse" defaultService="shuttle" bounds={bounds} />}
      />

      <ServiceUsp service="shuttle" heading="Zelf parkeren, sleutels mee, transfer inbegrepen" />

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat is shuttle parkeren?"
        title="Uw auto in Badhoevedorp, u met de bus naar Schiphol"
        paragraphs={[
          'Bij Shuttle parkeert u buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar de vaste halte op Schiphol Plaza; de rit duurt ongeveer 8 minuten. Bij terugkomst loopt u naar die halte. U hoeft niet te bellen.',
          'Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3. Valet is beschikbaar met buiten of overdekt parkeren.',
        ]}
        photo="crewShuttleTerminal"
        photoAlt="shuttle parkeren bij Schiphol"
        objectPosition="object-[center_45%]"
      >
        <div className="mt-6">
          <RouteButton />
        </div>
        <p className="text-muted mt-5 max-w-[52ch] text-sm leading-relaxed">
          De shuttletransfer van en naar Schiphol is inbegrepen voor maximaal 5 personen. Voor een
          aankomst of terugkomst tussen 00:00 en 07:00 of voor meer dan 5 personen kunnen toeslagen
          gelden.{' '}
          <a
            href="/tarieven/#voorwaarden-en-toeslagen"
            className="text-accent underline underline-offset-2 hover:text-accent-hover"
          >
            Bekijk de voorwaarden en toeslagen
          </a>
        </p>
      </ContentSection>

      {/* ---------- The process ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Zo werkt het</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Van reservering tot terugkomst
              </h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Parkeer buiten in Badhoevedorp en reis met de doorlopende shuttle naar Schiphol.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      <ContentSection
        id="reistijd"
        eyebrow="Reistijd en gemak"
        title="Ongeveer 8 minuten naar Schiphol"
        paragraphs={[
          'De rit met de shuttlebus van onze parkeerlocatie in Badhoevedorp naar Schiphol duurt ongeveer 8 minuten. Dit is de geschatte rijtijd, niet de totale tijd; parkeren, instappen en eventuele wachttijd komen daar nog bij.',
          'De shuttle rijdt doorlopend. Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza; u hoeft niet te bellen.',
        ]}
        photo="shuttleRoute"
        photoAlt="Routekaart van de parkeerplaats naar Schiphol"
        objectPosition="object-center"
        reversed
        tone="canvas"
      />

      {/* ---------- Who it suits ---------- */}
      <Section tone="surface" spacing="md" aria-labelledby="geschikt-heading">
        <Container>
          <Reveal className="max-w-[38ch]">
            <Eyebrow rule>Voor wie</Eyebrow>
            <h2 id="geschikt-heading" className="text-display-md mt-5">
              Wanneer shuttle parkeren de logische keuze is
            </h2>
          </Reveal>

          {/* Hairline columns, the same treatment as the trust board: a rule to
              the left of every column but the first, so the four read as one
              group rather than four boxes. Stacked with a rule between them
              below sm, where four columns would be four words wide. */}
          <div className="divide-line border-line mt-12 grid divide-y border-t sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {SUITS.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 80}
                className="border-line py-8 sm:pr-8 sm:not-first:border-l sm:not-first:pl-8 lg:pr-10"
              >
                <h3 className="text-heading text-base font-semibold">{item.title}</h3>
                <p className="text-muted mt-3 max-w-[32ch] text-sm leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Concerns ----------
          A second accordion on the page, so its FAQPage markup is suppressed:
          two FAQPage nodes on one URL is worse than one, and the FAQ below is
          the set that should be eligible. */}
      <FaqSection
        items={CONCERNS}
        eyebrow="Waar reizigers over twijfelen"
        heading="De vragen die u stelt vóór u boekt"
        lead="Over de transfertijd, de route en terugkomst bij de vaste halte."
        schema={false}
      />

      <ContentSection
        id="veiligheid"
        eyebrow="De locatie"
        title="Shuttle parkeren buiten in Badhoevedorp"
        paragraphs={[
          'U parkeert buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend naar de vaste halte op Schiphol Plaza; de rit duurt ongeveer 8 minuten.',
          'Bij terugkomst loopt u naar die halte. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
        ]}
        bullets={[
          'Parkeerlocatie: Schipholweg 181, Badhoevedorp',
          'Shuttle parkeren buiten',
          'Doorlopende shuttle naar Schiphol Plaza',
          'Ongeveer 8 minuten transfertijd',
          'Geen telefoontje nodig bij terugkomst',
        ]}
        photo="lotShuttle"
        photoAlt="Shuttle parkeerlocatie in Badhoevedorp"
        objectPosition="object-[center_35%]"
      >
        <Button href="/veilig-parkeren-schiphol/" variant="link" className="mt-7">
          Lees meer over veilig parkeren bij Schiphol
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over shuttle parkeren"
        lead="Over aankomsttijden, de rit naar de terminal, uw sleutel en de terugreis."
      />

      <ClusterLinks currentPath={PATH} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            serviceSchema({
              name: 'Shuttle Parkeren Schiphol',
              description:
                'U parkeert zelf bij onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp, houdt uw autosleutel bij u en reist met de shuttlebus naar de bushalte op Schiphol Plaza. De rit duurt ongeveer 8 minuten.',
              serviceType: 'Airport shuttle parking',
            }),
          ),
        }}
      />
    </>
  );
}
