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
import { ClosingCta } from '@/components/sections/ClosingCta';
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
 * ongeveer 8 minuten, sleutel meenemen bij shuttle, 24/7 camerabewaking, afgesloten
 * terrein, overdekt beperkt beschikbaar, annuleringsdekking als betaalde optie,
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
    title: 'Bel bij terugkomst.',
    body: 'Na de landing belt u ons even. U keert terug naar dezelfde bushalte op Schiphol Plaza, waar onze shuttlebus u weer ophaalt.',
  },
  {
    title: 'Terug naar uw eigen auto.',
    body: 'De shuttlebus brengt u terug naar de parkeerlocatie in Badhoevedorp, waar uw auto staat waar u hem heeft neergezet.',
  },
];

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
    body: 'Voordelig parkeren zonder in te leveren op het terrein: afgesloten, 24 uur per dag onder camerabewaking en met een vaste procedure.',
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
      'De shuttle rijdt op uw reservering: wij weten wanneer u aankomt en stemmen daarop af. De rit duurt vervolgens ongeveer 8 minuten. Reken voor het geheel — parkeren, instappen en de rit — op ongeveer een kwartier, en houd daarnaast de normale tijd voor inchecken aan.',
  },
  {
    question: 'Hoe gaat het met veel bagage?',
    answer:
      'U parkeert zelf, dus u laadt uw bagage uit naast uw eigen auto en niet op een stoep. De shuttlebus is een personenbusje met ruimte voor koffers, en onze chauffeur helpt met in- en uitladen.',
  },
  {
    question: 'Wat als ik midden in de nacht aankom of terugkom?',
    answer:
      'Onze shuttleservice is 24 uur per dag beschikbaar, dus ook een vroege vlucht of een late landing is geen probleem. Geef uw werkelijke aankomst- en retourtijd op bij het reserveren, zodat wij daarop kunnen plannen. Bel ons direct na de landing, ook als het laat is. Let op: voor een aankomst of terugkomst tussen 00:00 en 07:00 geldt een nachttoeslag van €15.',
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraging heeft?',
    answer:
      'Wij volgen de actuele vluchtinformatie en passen de ophaaltijd indien nodig aan. Bij vertraging of een vervroegde landing zorgen wij dat u bij terugkomst gewoon wordt opgehaald. Bel ons wel even zodra u geland bent.',
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
      'De rit met de shuttlebus van onze parkeerlocatie naar Schiphol duurt ongeveer 8 minuten. Dat is alleen de rijtijd, niet de totale tijd inclusief parkeren, wachten en instappen.',
  },
  {
    question: 'Moet ik mijn autosleutel afgeven?',
    answer:
      'Nee. Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutel mee op reis. Alleen bij valet parking nemen wij uw auto over; dan worden uw sleutels bewaard in een brandwerende kluis op ons kantoor, dat onder camerabewaking staat.',
  },
  {
    question: 'Waar stap ik uit op Schiphol?',
    answer:
      'Onze shuttlebus zet u af bij de bushalte op Schiphol Plaza. Vanaf daar loopt u door naar de incheckbalies.',
  },
  {
    question: 'Hoe kom ik na mijn reis terug bij mijn auto?',
    answer:
      'Bel ons direct nadat u geland bent en door de bagagehal bent. U keert terug naar dezelfde bushalte op Schiphol Plaza waar u bent uitgestapt. Daar haalt onze shuttlebus u weer op en brengt u terug naar uw auto.',
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

      <ServiceUsp service="shuttle" heading="Zelf parkeren, sleutels mee, transfer inbegrepen" />

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat is shuttle parkeren?"
        title="Uw auto in Badhoevedorp, u met de bus naar Schiphol"
        paragraphs={[
          'Shuttle parkeren betekent dat u niet op de luchthaven zelf parkeert, maar op een parkeerlocatie vlakbij. Parkeer uw auto bij onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp. Vanaf hier brengt onze shuttlebus u in ongeveer 8 minuten naar luchthaven Schiphol. Bij aankomst op Schiphol wordt u door onze shuttlebus afgezet bij de bushalte op Schiphol Plaza. Na uw reis keert u terug naar dezelfde bushalte. Daar haalt onze shuttlebus u weer op en brengt u terug naar uw auto.',
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
              Zes stappen, waarvan u er twee zelf doet: parkeren en bellen als u terug bent.
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
          'De shuttle rijdt op uw reservering. U geeft bij het boeken op wanneer u aankomt, zodat wij weten wanneer u er bent en daarop kunnen plannen. Voor de terugreis belt u ons na de landing; dan weten wij dat u er werkelijk bent, en niet alleen dat uw vlucht dat zou zijn.',
          'Reken voor het hele proces op ongeveer een kwartier: parkeren, instappen, rijden en uitstappen. Wij adviseren om minimaal 3 uur voor vertrek op het terrein te zijn, zodat u daarna in alle rust kunt inchecken.',
        ]}
        photo="terminalDeparture"
        photoAlt="shuttle transfer naar Schiphol"
        objectPosition="object-[center_55%]"
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
        eyebrow="Het terrein"
        title="Voordelig parkeren, zonder concessies aan het terrein"
        paragraphs={[
          'Voordelig parkeren wordt vaak verward met onbewaakt parkeren. Dat is bij ons niet aan de orde: het terrein is afgesloten, staat 24 uur per dag onder camerabewaking en wordt gemonitord.',
          'Daarbij komt iets wat alleen voor deze service geldt. U parkeert zelf en houdt uw sleutel, dus uw auto blijft staan waar u hem heeft neergezet. Er is niemand die hem verplaatst en er ligt geen sleutel op kantoor.',
        ]}
        bullets={[
          'Afgesloten en gecontroleerd parkeerterrein',
          '24/7 camerabewaking en monitoring',
          'Overdekte plaatsen beschikbaar, in beperkt aantal',
          'Laadpunten aanwezig voor elektrische auto\u2019s',
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
        photo="evCharging"
        photoAlt="veilig shuttle parkeren Schiphol"
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

      <ClosingCta
        heading="Reserveer uw shuttle parkeerplaats"
        lead="Kies uw aankomst- en retourmoment en zie direct wat het kost. Binnen een paar minuten geregeld."
        photo="lotShuttle"
        bookingHref="/reservering/?service=shuttle"
        bookingLabel="Reserveer shuttle parkeren"
      />

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
