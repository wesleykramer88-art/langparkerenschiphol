import { ArrowRight } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, serviceSchema, type FaqItem } from '@/lib/schema';
import { Button } from '@/components/ui/Button';
import { SERVICE_COPY } from '@/config/services';
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
 * 5–8 minuten, sleutel meenemen bij shuttle, 24/7 camerabewaking, afgesloten
 * terrein, overdekt beperkt beschikbaar, annuleringsdekking als betaalde optie,
 * 3 uur voor vertrek aanwezig zijn. Nothing is invented for SEO. Where the
 * document asked for something this business has not stated — how often the
 * shuttle runs, what happens on a 03:00 return — the copy says what is true
 * without inventing a number, and a TODO(client) names the missing fact.
 */

/**
 * The client's six steps, August 2026. His headings, minus the "Stap n:" prefix
 * that <Timeline> already emits — see the note on the homepage's STEPS.
 *
 * ⚠ Considerably longer than the six they replace. At six columns <Timeline>
 * switches to its dense treatment (text-sm, 34ch), so step 3 runs to about seven
 * lines and the band is materially taller than before. Nothing overflows and the
 * grid is unchanged; the columns are just uneven, step 3 being roughly twice
 * step 5.
 */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer online',
    body: 'Reserveer uw shuttle parkeerplaats eenvoudig online. Vul uw aankomst- en retourgegevens in en ontvang direct uw reserveringsbevestiging.',
  },
  {
    // The address runs inline rather than on its own lines as in his document:
    // `body` is one string, and a postcode on its own line inside a 150px
    // column at six across would wrap anyway.
    title: 'Rijd naar onze parkeerlocatie',
    body: 'Op de dag van vertrek rijdt u naar Tupolevlaan 39, 1119 PA Schiphol-Rijk. U rijdt dus niet eerst naar de vertrekhal van Schiphol.',
  },
  {
    title: 'Parkeer zelf en neem uw sleutel mee',
    body: 'Op onze parkeerlocatie parkeert u uw auto zelf op de aangewezen parkeerplaats. Daarna neemt u uw autosleutels gewoon mee op reis. Uw auto blijft tijdens uw reis op de parkeerlocatie staan waar u deze zelf heeft geparkeerd.',
  },
  {
    title: 'Met de shuttle naar Schiphol',
    body: 'Nadat u uw auto heeft geparkeerd, stapt u met uw bagage in onze shuttlebus. De rit naar de vertrekhal van Schiphol duurt ongeveer 5 tot 8 minuten.',
  },
  {
    title: 'Bel ons na uw landing',
    body: 'Bent u weer geland op Schiphol? Neem dan telefonisch contact met ons op. Wij laten u weten waar de shuttle u ophaalt en zorgen ervoor dat u weer naar onze parkeerlocatie wordt gebracht.',
  },
  {
    title: 'Terug naar uw auto',
    body: 'Onze shuttle brengt u terug naar de parkeerlocatie in Schiphol-Rijk. Uw auto staat daar waar u deze zelf heeft geparkeerd. U stapt in en kunt direct uw reis naar huis vervolgen.',
  },
];

/**
 * Who it suits. The client's four, August 2026 — same four audiences, his words.
 *
 * ⚠ The bodies are roughly 40% longer than the ones they replace and the third
 * title runs to 48 characters. In the four-column hairline grid below that means
 * the title wraps to three lines and the longest body to about nine, so the row
 * is noticeably deeper. It does not overflow — the columns are `1fr` and the body
 * is capped at 32ch — but the four columns are visibly unequal in length.
 */
const SUITS = [
  {
    title: 'Vakantiegangers',
    body: 'Gaat u meerdere dagen of weken op reis? Dan kan shuttle parkeren een voordelige keuze zijn. U parkeert vlak bij Schiphol en de transfer van en naar de luchthaven is inbegrepen.',
  },
  {
    title: 'Gezinnen met bagage',
    body: 'U rijdt met uw eigen auto rechtstreeks naar uw parkeerplaats en kunt daar rustig uw koffers en andere bagage uitladen. Vervolgens brengt onze shuttle u met uw bagage naar de vertrekhal.',
  },
  {
    title: 'Reizigers die hun autosleutels zelf willen houden',
    body: 'Bij onze shuttleservice hoeft u uw autosleutels niet af te geven. U parkeert uw auto zelf en neemt de sleutel mee op reis. Uw auto blijft tijdens uw afwezigheid op de plek staan waar u deze heeft geparkeerd.',
  },
  {
    title: 'Reizigers die voordelig willen parkeren',
    body: 'Shuttle parkeren is onze voordeligste parkeerservice. U profiteert van een bewaakte parkeerlocatie vlak bij Schiphol, terwijl de transfer van en naar de luchthaven bij uw reservering is inbegrepen.',
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
    answer: [
      'Bij uw reservering geeft u aan hoe laat u bij onze parkeerlocatie verwacht aan te komen. Zo kunnen wij onze shuttleplanning hierop afstemmen.',
      'De rit naar de vertrekhal duurt vervolgens ongeveer 5 tot 8 minuten.',
      'Houd voor het parkeren, instappen en de transfer naar Schiphol in totaal rekening met ongeveer 15 minuten.',
    ],
  },
  {
    question: 'Kan ik veel bagage meenemen?',
    answer: [
      'Ja. U kunt uw bagage direct naast uw eigen auto uitladen en vervolgens meenemen in onze shuttlebus.',
      // "personenbusje" is gone with our version. It was a specific claim about
      // the vehicle that nobody confirmed; his says what the space is for.
      'De shuttle beschikt over ruimte voor koffers en andere reisbagage. Onze chauffeur kan u indien nodig helpen bij het in- en uitladen.',
    ],
  },
  {
    question: "Kan ik ook 's nachts gebruikmaken van de shuttle?",
    answer: [
      'Ja. Onze shuttleservice is 24 uur per dag beschikbaar.',
      'Ook bij een vroege vlucht of late landing kunt u gebruikmaken van onze transfer. Vul tijdens uw reservering altijd uw juiste aankomst- en retourgegevens in, zodat wij onze planning daarop kunnen afstemmen.',
    ],
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraging heeft?',
    answer: [
      'Wij houden uw vluchtinformatie in de gaten en kunnen daardoor rekening houden met eventuele vertragingen of een eerdere landing.',
      'Neem na uw landing altijd telefonisch contact met ons op. Zo weten wij dat u daadwerkelijk bent aangekomen en kunnen we de shuttle voor uw terugreis inplannen.',
    ],
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Hoe laat moet ik aanwezig zijn bij shuttle parkeren?',
    answer: [
      'Wij adviseren om minimaal 3 uur voor het vertrek van uw vlucht bij onze parkeerlocatie aanwezig te zijn.',
      'Zo heeft u voldoende tijd om uw auto te parkeren, uw bagage uit te laden, met de shuttle naar Schiphol te reizen en rustig in te checken.',
    ],
  },
  {
    question: 'Waar moet ik precies zijn?',
    answer: [
      'Onze parkeerlocatie bevindt zich op Tupolevlaan 39, 1119 PA Schiphol-Rijk.',
      'Bij shuttle parkeren rijdt u rechtstreeks naar deze locatie. U hoeft dus niet eerst naar de vertrekhal van Schiphol te rijden.',
    ],
  },
  {
    question: 'Hoe lang duurt de shuttle naar Schiphol?',
    answer:
      'De rit van onze parkeerlocatie naar de vertrekhal van Schiphol duurt onder normale omstandigheden ongeveer 5 tot 8 minuten.',
  },
  {
    question: 'Moet ik mijn autosleutel afgeven?',
    answer: [
      'Nee.',
      'Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutels mee op reis.',
      'Dat is een belangrijk verschil met valet parkeren, waarbij onze chauffeur uw auto voor u parkeert.',
    ],
  },
  {
    question: 'Waar zet de shuttle mij af op Schiphol?',
    answer:
      'Onze shuttle brengt u naar de vertrekhal van Schiphol. Vanaf daar kunt u met uw bagage direct doorlopen naar de incheckbalies.',
  },
  {
    // ── The unconfirmed arrivals-hall claim is GONE from this page ───────────
    // It said "De shuttle haalt u op bij de aankomsthal", which nobody had
    // confirmed — the valet flow was corrected in August 2026 to depart from and
    // return to Vertrekhal 2–3, and whether the SHUTTLE collects at arrivals or
    // at that same point was never answered.
    //
    // His answer sidesteps it correctly rather than guessing: the pickup point is
    // told to the customer on the phone, which is what actually happens. So this
    // page no longer states a hall it cannot support.
    //
    // ⚠ THE CLAIM SURVIVES ON FOUR OTHER PAGES — /zelf-parkeren-schiphol/,
    // /goedkoop-shuttle-parkeren-schiphol/ and /parkeren-schiphol-zonder-sleutel-
    // inleveren/ (twice). Those are outside this copy pass and were deliberately
    // not touched. Search "aankomsthal" and fix them together.
    question: 'Hoe kom ik na mijn reis terug bij mijn auto?',
    answer: [
      'Neem na uw landing en het ophalen van uw bagage telefonisch contact met ons op.',
      'Wij vertellen u waar de shuttle u ophaalt. Vervolgens brengen wij u terug naar onze parkeerlocatie, waar uw auto op u wacht.',
    ],
  },
  {
    question: 'Kan ik mijn reservering wijzigen of annuleren?',
    answer: [
      'Heeft u tijdens uw reservering gekozen voor onze optionele annuleringsdekking? Dan kunt u uw reservering tot 24 uur voor uw geplande aankomst annuleren.',
      'De prijs van de annuleringsdekking ziet u tijdens het reserveren voordat u betaalt.',
      'Binnen 24 uur voor aankomst is annuleren niet meer mogelijk.',
      'Wilt u uw reservering wijzigen? Neem dan zo snel mogelijk contact op met onze klantenservice.',
    ],
  },
  {
    question: 'Staat mijn auto binnen of buiten?',
    answer: [
      'Dat bepaalt u zelf tijdens het reserveren.',
      'U kunt kiezen voor ons afgesloten buitenterrein of, indien beschikbaar, voor een overdekte parkeerplaats.',
      'De beschikbare opties en bijbehorende tarieven worden tijdens het reserveren weergegeven.',
    ],
  },
];

export default async function ShuttleParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Shuttle Parkeren"
        title="Shuttle parkeren bij Schiphol"
        subhead="Zelf parkeren, uw autosleutels mee op reis"
        lead="Parkeer uw auto zelf op onze bewaakte parkeerlocatie in Schiphol-Rijk en neem uw autosleutels gewoon mee op reis. Onze gratis shuttle brengt u vervolgens in ongeveer 5 tot 8 minuten naar de vertrekhal van Schiphol."
        photo="lotShuttle"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
        // Defaulted to shuttle: a visitor who clicked through to a page about
        // one service should not have to correct the form on it.
        aside={<BookingPicker notch="inverse" defaultService="shuttle" bounds={bounds} />}
      >
        {/* His document gives the hero two buttons. They sit beside the booking
            ticket, which reads as redundant for the primary one and is not for
            the secondary: this hero had no route to the rates page at all, and
            "wat kost het" is the question a visitor arrives with. */}
        <Button href="/reservering/?service=shuttle" size="lg">
          Reserveer shuttle parkeren
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/tarieven/" variant="outline" size="lg">
          Bekijk tarieven
        </Button>
      </PageHero>

      <ServiceUsp
        service="shuttle"
        heading="Zelf parkeren, sleutels mee, transfer inbegrepen"
        subhead="Voordelig en gemakkelijk parkeren bij Schiphol"
        paragraphs={[
          'Met shuttle parkeren rijdt u rechtstreeks naar onze parkeerlocatie in Schiphol-Rijk. U parkeert uw auto zelf, neemt uw autosleutels mee en stapt vervolgens in onze shuttlebus.',
          'Binnen ongeveer 5 tot 8 minuten brengen wij u naar de vertrekhal van Schiphol. Na uw reis halen we u weer op en brengen we u terug naar uw auto.',
        ]}
        // His six for this page, not the compact four the homepage cards show.
        bullets={SERVICE_COPY.shuttle.detailBullets}
      />

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat is shuttle parkeren?"
        title="U parkeert zelf, wij brengen u naar Schiphol"
        paragraphs={[
          'Shuttle parkeren is een eenvoudige en voordelige manier van parkeren bij Schiphol.',
          'In plaats van uw auto direct bij de luchthaven te parkeren, rijdt u naar onze parkeerlocatie aan de Tupolevlaan 39 in Schiphol-Rijk. Hier parkeert u uw auto zelf op de aangewezen parkeerplaats.',
          'Uw autosleutels neemt u gewoon mee op reis. Onze shuttlebus brengt u vervolgens in ongeveer 5 tot 8 minuten naar de vertrekhal van Schiphol.',
          'Na uw terugkomst werkt het precies andersom. U belt ons nadat u bent geland en wij halen u met de shuttle op bij Schiphol. Vervolgens brengen we u terug naar de parkeerlocatie, waar uw auto op u wacht.',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      >
        {/* His document closes this section with an H3 and three paragraphs.
            Passed as children rather than appended to `paragraphs`, because the
            heading is doing real work — it is the comparison a visitor on this
            page is actually making, and flattening it would bury three
            paragraphs of it under the four above. */}
        <div className="mt-10">
          <h3 className="text-heading text-lg font-semibold">
            Het verschil tussen shuttle en valet parkeren
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-body max-w-[62ch] leading-relaxed">
              Bij shuttle parkeren rijdt u zelf naar onze parkeerlocatie, parkeert u zelf uw auto en
              neemt u uw autosleutels mee op reis.
            </p>
            <p className="text-body max-w-[62ch] leading-relaxed">
              Bij valet parkeren rijdt u rechtstreeks naar de vertrekhal van Schiphol. Daar neemt
              onze chauffeur uw auto van u over en parkeren wij deze voor u.
            </p>
            <p className="text-body max-w-[62ch] leading-relaxed">
              Wilt u voordelig parkeren en vindt u het prettig om uw autosleutels zelf te houden?
              Dan is shuttle parkeren een uitstekende keuze.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* ---------- The process ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Zo werkt shuttle parkeren bij Schiphol</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Van reservering tot terugkomst in 6 eenvoudige stappen
              </h2>
            </div>
            {/* Ours, kept: his document gives no supporting line for this
                section, and this one adds a fact the six steps do not state
                outright — which two of them the customer performs. */}
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Zes stappen, waarvan u er twee zelf doet: parkeren en bellen als u terug bent.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      <ContentSection
        id="reistijd"
        eyebrow="Binnen 5 tot 8 minuten bij de vertrekhal"
        title="Een korte transfer van en naar Schiphol"
        paragraphs={[
          'Onze parkeerlocatie ligt op slechts enkele minuten rijden van Schiphol. De shuttletransfer naar de vertrekhal duurt onder normale omstandigheden ongeveer 5 tot 8 minuten.',
          'Bij uw reservering geeft u aan hoe laat u verwacht aan te komen. Zo kunnen wij rekening houden met uw aankomst en de shuttle daarop afstemmen.',
          'Voor de terugreis belt u ons nadat u bent geland en uw bagage heeft opgehaald. Wij vertellen u waar u kunt instappen en brengen u vervolgens terug naar uw auto.',
          'Houd voor het parkeren, instappen en de transfer naar Schiphol rekening met ongeveer 15 minuten.',
          'Wij adviseren daarom om minimaal 3 uur voor het vertrek van uw vlucht bij onze parkeerlocatie aanwezig te zijn. Zo heeft u voldoende tijd om uw auto te parkeren, naar Schiphol te reizen en rustig in te checken.',
        ]}
        photo="terminalDeparture"
        objectPosition="object-[center_55%]"
        reversed
        tone="canvas"
      />

      {/* ---------- Who it suits ---------- */}
      <Section tone="surface" spacing="md" aria-labelledby="geschikt-heading">
        <Container>
          <Reveal className="max-w-[38ch]">
            <Eyebrow rule>Voor wie is shuttle parkeren geschikt?</Eyebrow>
            <h2 id="geschikt-heading" className="text-display-md mt-5">
              Een voordelige keuze voor parkeren bij Schiphol
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
        eyebrow="Veelgestelde vragen vóór uw vertrek"
        heading="Alles over de shuttle, bagage en uw terugkomst"
        lead="Wilt u weten hoe lang u op de shuttle moet wachten, hoeveel bagage u kunt meenemen of wat er gebeurt bij een late landing? Hieronder beantwoorden we de belangrijkste vragen."
        schema={false}
      />

      <ContentSection
        id="veiligheid"
        eyebrow="Veilig shuttle parkeren bij Schiphol"
        title="Uw auto blijft staan waar u hem zelf parkeert"
        paragraphs={[
          'Voordelig parkeren hoeft niet te betekenen dat u moet inleveren op veiligheid.',
          'Onze parkeerlocatie is afgesloten en voorzien van 24/7 camerabewaking en monitoring.',
          'Een belangrijk voordeel van onze shuttleservice is dat u zelf uw auto parkeert en uw autosleutels meeneemt op reis.',
          'Wij hoeven uw auto tijdens uw reis dus niet te verplaatsen. Uw auto blijft op de parkeerplaats staan waar u deze zelf heeft achtergelaten.',
        ]}
        // His six, in his order. Note the covered-parking bullet is now third
        // from last rather than third \u2014 the comment below about "the third
        // bullet" refers to the covered claim wherever it sits in the list.
        bullets={[
          'Afgesloten en gecontroleerde parkeerlocatie',
          '24/7 camerabewaking en monitoring',
          'U parkeert uw auto zelf',
          'Autosleutels mee op reis',
          'Overdekte parkeerplaatsen beschikbaar',
          'Laadpunten voor elektrische auto\u2019s beschikbaar',
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
        objectPosition="object-[45%_50%]"
      >
        <Button href="/veilig-parkeren-schiphol/" variant="link" className="mt-7">
          Lees meer over veilig parkeren bij Schiphol
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over shuttle parkeren"
        lead="Alles wat u wilt weten voor uw reservering."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Reserveer uw shuttle parkeerplaats"
        subhead="Voordelig parkeren op enkele minuten van Schiphol"
        lead={[
          'Parkeer uw auto zelf op onze bewaakte parkeerlocatie, neem uw autosleutels mee op reis en laat ons de transfer naar Schiphol regelen.',
          'Binnen ongeveer 5 tot 8 minuten brengt onze shuttle u naar de vertrekhal. Na uw reis halen we u weer op en brengen we u terug naar uw auto.',
        ]}
        reassurances={[
          'Autosleutels mee op reis',
          'Gratis shuttle van en naar Schiphol',
          'Binnen 2 minuten online gereserveerd',
          '24/7 bewaakte parkeerlocatie',
          'Slechts 5 tot 8 minuten van Schiphol',
          'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
        ]}
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
                'U parkeert zelf op ons beveiligde terrein aan de Tupolevlaan in Schiphol-Rijk, houdt uw eigen autosleutel en reist met onze shuttlebus in 5 tot 8 minuten naar de vertrekhal van Schiphol.',
              serviceType: 'Airport shuttle parking',
            }),
          ),
        }}
      />
    </>
  );
}
