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
 * ── Every claim here is already published somewhere on this site ────────────
 * ongeveer 8 minuten, sleutel meenemen bij shuttle,
 * overdekt beperkt beschikbaar, annuleringsdekking als betaalde optie,
 * 3 uur voor vertrek aanwezig zijn. Nothing is invented for SEO. Where the
 * document asked for something this business has not stated — how often the
 * shuttle runs, what happens on a 03:00 return — the copy says what is true
 * without inventing a number, and a TODO(client) names the missing fact.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer online.',
    body: 'U kiest uw aankomst- en retourmoment en rondt de reservering in een paar minuten af. U ontvangt direct een bevestiging.',
  },
  {
    title: 'Rijd naar de parkeerlocatie.',
    body: 'U rijdt naar onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp, bij het ibis hotel. Dat is niet de terminal.',
  },
  {
    title: 'Parkeer zelf, sleutel mee.',
    body: 'U zet uw auto zelf neer en neemt uw autosleutel gewoon mee op reis.',
  },
  {
    title: 'Shuttle naar Schiphol Plaza.',
    body: 'Onze shuttlebus zet u af bij de bushalte op Schiphol Plaza. De rit duurt ongeveer 8 minuten (alleen de rijtijd).',
  },
  {
    title: 'Terug naar uw eigen auto.',
    body: 'Na terugkomst loopt u naar dezelfde bushalte op Schiphol Plaza waar u bent afgezet. U hoeft niet te bellen: stap in wanneer de shuttlebus langskomt. De bus brengt u terug naar de parkeerlocatie, waar uw auto staat.',
  },
];

const QUICK_INFO = [
  {
    title: 'Waar parkeer ik?',
    body: `${siteConfig.shuttleParking.display}, bij het ibis hotel. U parkeert zelf en neemt uw autosleutel mee.`,
  },
  {
    title: 'Waar stap ik in?',
    body: 'Bij de shuttlehalte bij de parkeerlocatie. Vanaf daar rijdt de shuttle naar Schiphol.',
  },
  {
    title: 'Waar stap ik uit op Schiphol?',
    body: `Bij de ${siteConfig.shuttleParking.stopName}.`,
  },
  {
    title: 'Hoe kom ik terug?',
    body: 'Loop naar dezelfde bushalte op Schiphol Plaza en stap in wanneer de juiste shuttlebus langskomt. U hoeft niet te bellen.',
  },
  {
    title: 'Hoe lang duurt de rit?',
    body: `Ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten (alleen de geschatte rijtijd). Houd daarnaast rekening met tijd voor parkeren, lopen naar de halte, wachten en instappen.`,
  },
] as const;

/** Who it suits. The document asks for this section by name. */
const SUITS = [
  {
    title: 'Vakantiegangers die langer wegblijven',
    body: 'Hoe langer u weg bent, hoe zwaarder de parkeerkosten wegen. Shuttle parkeren is de voordeligste van onze twee services en het verschil loopt op per dag.',
  },
  {
    title: 'Gezinnen met bagage',
    body: 'U rijdt tot naast uw parkeerplek en laadt rustig uit. De shuttle zet u af bij de bushalte op Schiphol Plaza, dus u sjouwt niet verder dan nodig.',
  },
  {
    title: 'Reizigers die hun sleutel houden',
    body: 'Bij shuttle parkeren geeft u niets af. U parkeert zelf en uw autosleutel gaat mee in uw zak of tas.',
  },
  {
    title: 'Prijsbewuste reizigers die geen risico willen',
    body: 'Voordelig parkeren zonder in te leveren op het terrein: een vaste parkeerlocatie en een duidelijke procedure.',
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
      'De rit duurt ongeveer 8 minuten. Houd daarnaast rekening met tijd voor parkeren, lopen naar de halte, wachten en instappen. Bij terugkomst loopt u naar de bushalte op Schiphol Plaza en stapt u in wanneer de juiste shuttlebus langskomt.',
  },
  {
    question: 'Hoe gaat het met veel bagage?',
    answer:
      'U parkeert zelf, dus u laadt uw bagage uit naast uw eigen auto en niet op een stoep. De shuttlebus is een personenbusje met ruimte voor koffers.',
  },
  {
    question: 'Wat als ik midden in de nacht aankom of terugkom?',
    answer:
      'Geef uw werkelijke aankomst- en retourtijd op bij het reserveren. Bij terugkomst loopt u naar de bushalte op Schiphol Plaza en stapt u in wanneer de shuttlebus langskomt. Let op: voor een aankomst of terugkomst tussen 00:00 en 07:00 geldt een nachttoeslag van €15.',
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraging heeft?',
    answer:
      'U hoeft bij terugkomst niet te bellen, ook niet bij vertraging of een vervroegde landing. U loopt naar de bushalte op Schiphol Plaza en stapt in wanneer de juiste shuttlebus langskomt.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Hoe laat moet ik aanwezig zijn bij shuttle parkeren?',
    answer:
      'Wij adviseren om bij shuttle parkeren minimaal 3 uur voor vertrek op onze parkeerlocatie te zijn. Zo heeft u ruim tijd om te parkeren, met de shuttle naar Schiphol te rijden en rustig in te checken.',
  },
  {
    question: 'Waar moet ik precies zijn?',
    answer:
      'Bij onze shuttleparkeerlocatie aan de Schipholweg 181, 1171 PK Badhoevedorp (bij het ibis hotel). Dat is niet de terminal — bij shuttle parkeren rijdt u naar ons toe en brengen wij u naar Schiphol. Rijd dus niet eerst naar de vertrekhal.',
  },
  {
    question: 'Hoe lang duurt de rit naar Schiphol?',
    answer:
      'De rit met de shuttlebus van onze parkeerlocatie naar Schiphol duurt ongeveer 8 minuten. Dat is alleen de geschatte rijtijd. Houd daarnaast rekening met tijd voor parkeren, lopen naar de halte, wachten en instappen.',
  },
  {
    question: 'Moet ik mijn autosleutel afgeven?',
    answer:
      'Nee. Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutel mee op reis. Alleen bij valet parking draagt u uw auto en sleutel over.',
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
      'U kiest zelf. Wij hebben een afgesloten buitenterrein en een beperkt aantal overdekte plaatsen. Beide opties staan in het reserveringsscherm met hun eigen tarief, zodat u ze naast elkaar ziet voordat u kiest.',
  },
];

export default async function ShuttleParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Shuttle Parkeren"
        title="Shuttle parkeren bij Schiphol"
        lead={`U boekt Shuttle parkeren bij The Parking Company. U parkeert uw auto bij onze shuttleparkeerlocatie aan de ${siteConfig.shuttleParking.street} in ${siteConfig.shuttleParking.locality}. Vanaf hier brengt onze shuttlebus u in ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten naar luchthaven Schiphol. U neemt uw sleutel mee.`}
        photo="lotShuttle"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
        // Defaulted to shuttle: a visitor who clicked through to a page about
        // one service should not have to correct the form on it.
        aside={<BookingPicker notch="inverse" defaultService="shuttle" bounds={bounds} />}
      />

      <Section spacing="md" aria-labelledby="shuttle-info-heading" id="shuttle-info">
        <Container>
          <h2 id="shuttle-info-heading" className="text-display-md max-w-[30ch]">
            Shuttle in het kort
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_INFO.map((item) => (
              <div key={item.title} className="border-line border-t pt-4">
                <dt className="text-heading text-base font-semibold">{item.title}</dt>
                <dd className="text-muted mt-1.5 text-sm leading-relaxed">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <ServiceUsp service="shuttle" heading="Zelf parkeren, sleutels mee, transfer inbegrepen" />

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat is shuttle parkeren?"
        title="Uw auto in Badhoevedorp, u met de bus naar Schiphol"
        paragraphs={[
          'Shuttle parkeren betekent dat u niet op de luchthaven zelf parkeert, maar op een parkeerlocatie vlakbij. Parkeer uw auto bij onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp. Vanaf hier brengt onze shuttlebus u in ongeveer 8 minuten naar luchthaven Schiphol. Bij aankomst op Schiphol wordt u door onze shuttlebus afgezet bij de bushalte op Schiphol Plaza. Na uw reis loopt u naar dezelfde bushalte en stapt u in wanneer de shuttlebus langskomt. De bus brengt u terug naar uw auto.',
          'Het verschil met parkeren op de luchthaven zit in de grond eronder. Parkeerplaatsen direct bij een terminal zijn schaars en duur, en dat verschil betaalt u per dag. Een parkeerlocatie op ongeveer 8 minuten rijden kost minder, en die paar minuten worden voor u gereden.',
          'Het verschil met valet parking zit in wie er rijdt. Bij valet geeft u uw auto af bij de vertrekhal en parkeert onze chauffeur hem voor u. Bij shuttle parkeren doet u dat zelf en houdt u uw sleutel. Dat is voor veel reizigers precies de reden om hiervoor te kiezen.',
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
              In vijf eenvoudige stappen van reservering tot terugkomst. U parkeert zelf en reist met de shuttle van en naar Schiphol.
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
          'De rit met de shuttlebus van onze parkeerlocatie in Badhoevedorp naar Schiphol duurt ongeveer 8 minuten. Dit is uitsluitend de geschatte rijtijd. Houd daarnaast rekening met tijd voor parkeren, lopen naar de halte, wachten en instappen.',
          'Voor de terugreis hoeft u niet te bellen: u loopt naar de bushalte op Schiphol Plaza en stapt in wanneer de juiste shuttlebus langskomt.',
          'Wij adviseren om minimaal 3 uur voor vertrek op het terrein te zijn, zodat u daarna in alle rust kunt inchecken.',
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
        lead="Wachten, bagage, en aankomen of terugkomen op een onmogelijk tijdstip — de vier dingen waar shuttle parkeren op wordt beoordeeld."
        schema={false}
      />

      <ContentSection
        id="veiligheid"
        eyebrow="De parkeerlocatie"
        title="Zelf parkeren, uw sleutel blijft bij u"
        paragraphs={[
          'U parkeert op een vaste parkeerlocatie aan de Schipholweg 181 in Badhoevedorp, bij het ibis hotel.',
          'Daarbij komt iets wat alleen voor deze service geldt. U parkeert zelf en houdt uw sleutel, dus uw auto blijft staan waar u hem heeft neergezet. Uw sleutel blijft bij u.',
        ]}
        bullets={[
          'Overdekte plaatsen beschikbaar, in beperkt aantal',
          'U parkeert zelf en houdt uw autosleutel',
        ]}
        // The EV frame carries this section rather than another shot of the
        // terrain: the bullet list above is four states of a car park and one
        // genuinely different thing, and the different thing is the one worth
        // showing. It is also the only frame on this page taken INSIDE the
        // covered garage, which the third bullet claims and nothing else here
        // evidences.
        //
        // Not `reversed`, so it alternates against the reistijd section above
        // it. object-[45%_50%] \u2014 a 3:2 frame into a 4:3 slot again; this
        // placement can afford slightly more of the car on the right than the
        // homepage band, because the charge point is not competing with a
        // heading beside it.
        photo="lotShuttle"
        photoAlt="Shuttleparkeerlocatie bij Schiphol"
        objectPosition="object-[45%_50%]"
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
