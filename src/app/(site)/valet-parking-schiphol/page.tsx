import { ArrowRight, Gauge } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, serviceSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { BookingPicker } from '@/components/booking/BookingPicker';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceUsp } from '@/components/sections/ServiceUsp';
import { ContentSection } from '@/components/sections/ContentSection';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { FaqSection } from '@/components/sections/Faq';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';
import { fetchPickerBounds } from '@/lib/parkingpro-config';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('valetParking');

const PATH = '/valet-parking-schiphol/';
const CRUMBS = [{ name: 'Valet parking Schiphol', path: PATH }];

/**
 * /valet-parking-schiphol/
 *
 * The commercial page for the service where the customer hands over their car
 * keys to a stranger. Everything on it is arranged around that one fact.
 *
 * ── Why this page leads with the handover and not with the comfort ──────────
 * Valet sells convenience, and convenience is the easy thing to write about.
 * The reason a visitor does not book it is never that they doubt it is
 * convenient — it is that they are being asked to give away their car. So the
 * page states the mechanics of the handover early and in detail, and links to
 * /digitale-ritregistratie/ where the question gets its full answer.
 *
 * That link is the page's most important one. Ride registration is valet-only;
 * it exists precisely because this is the service where trust has to be earned
 * rather than assumed.
 *
 * ── The address on this page is NOT the business address ────────────────────
 * Valet customers drive to the terminal, not to Tupolevlaan. A valet customer
 * who follows the footer address misses their flight. See the note on
 * `valetHandover` in config/site.ts — the two addresses are both correct and
 * are for different things.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer vooraf.',
    body: 'U reserveert online en geeft uw vluchtgegevens door. Valet reserveert u minimaal een uur van tevoren.',
  },
  {
    title: 'Rijd naar de vertrekhal.',
    body: 'U rijdt rechtstreeks naar de Vertrekpassage op Schiphol, tussen Vertrekhal 2 en 3.',
  },
  {
    title: 'Onze chauffeur wacht u op.',
    body: 'Hij ontvangt uw gegevens digitaal en weet welke auto en welke vlucht bij u horen.',
  },
  {
    title: 'Samen langs de auto.',
    body: 'De staat van uw auto wordt vastgelegd voordat wij hem overnemen. U tekent voor de overdracht.',
  },
  {
    title: 'Wij parkeren, u loopt door.',
    body: 'Uw auto gaat naar onze beveiligde locatie. De rit ernaartoe wordt digitaal geregistreerd.',
  },
  {
    title: 'Terug tussen Vertrekhal 2 en 3.',
    body: 'Bel na de landing. Uw auto staat op dezelfde plek als bij vertrek, en de terugrit is opnieuw geregistreerd.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Waar moet ik zijn voor valet parking?',
    answer: `Bij de ${siteConfig.valetHandover.display}. U rijdt dus rechtstreeks naar de luchthaven en niet naar ons parkeerterrein — dat laatste geldt alleen voor shuttle parkeren. Onze chauffeur staat op de afgesproken tijd voor u klaar.`,
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn?',
    answer:
      'Wij adviseren om bij valet parkeren minimaal 2,5 uur voor vertrek aanwezig te zijn. De overdracht zelf duurt maar een paar minuten, maar u wilt daarna rustig kunnen inchecken.',
  },
  {
    question: 'Wat gebeurt er met mijn autosleutel?',
    answer:
      'Uw sleutels worden opgeborgen in een brandwerende kluis op ons kantoor, dat onder camerabewaking staat. Bij terugkomst krijgt u ze weer persoonlijk overhandigd.',
  },
  {
    question: 'Wordt de staat van mijn auto vastgelegd?',
    answer:
      'Ja. Voordat wij uw auto overnemen, wordt de staat ervan samen met u vastgelegd. Zo is voor beide partijen duidelijk hoe de auto is afgegeven, en dat is bij terugkomst het uitgangspunt.',
  },
  {
    question: 'Waar krijg ik mijn auto terug?',
    answer: `${siteConfig.valetHandover.returnNote} Afgifte en teruggave gebeuren allebei bij de vertrekhal — u hoeft dus na de landing niet naar een aankomsthal of naar een parkeerterrein. Bel ons zodra u geland bent, dan staat de auto klaar wanneer u buiten komt.`,
  },
  {
    question: 'Wie rijdt er in mijn auto?',
    answer:
      'Een van onze eigen chauffeurs. Zij rijden alleen de route tussen de vertrekhal en onze parkeerlocatie, en die ritten worden digitaal geregistreerd — inclusief de gereden snelheid.',
  },
  {
    question: 'Hoeveel kilometer wordt er op mijn auto gereden?',
    answer:
      'Alleen de afstand tussen de vertrekhal en onze parkeerlocatie, heen en terug. De kilometerstand wordt bij afgifte en bij terugkomst genoteerd, dus dat is voor u te controleren.',
  },
  {
    question: 'Kan ik bij aankomst betalen?',
    answer:
      'Bij valet parking kunt u bij aankomst afrekenen. Dat is een verschil met shuttle parkeren, waar u vooraf betaalt.',
  },
  {
    question: 'Wat als mijn vlucht vertraagd is?',
    answer:
      'Wij volgen de actuele vluchtinformatie en passen de ophaaltijd aan. Bij vertraging of een vervroegde landing staat uw auto op het aangepaste moment klaar. Bel ons wel direct na de landing.',
  },
];

export default async function ValetParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Valet Parking"
        title="Valet parking op Schiphol"
        lead="U rijdt tot de vertrekhal, geeft uw auto af aan onze chauffeur en loopt direct door naar uw vlucht. Wij parkeren hem op onze beveiligde locatie."
        photo="crewHandover"
        objectPosition="object-[center_40%]"
        crumbs={CRUMBS}
        aside={<BookingPicker notch="inverse" defaultService="valet" bounds={bounds} />}
      />

      <ServiceUsp service="valet" heading="Uitstappen bij de hal, de rest doen wij" />

      <ContentSection
        id="hoe-het-werkt"
        eyebrow="De overdracht"
        title="Wat er precies gebeurt bij de vertrekhal"
        paragraphs={[
          `U rijdt naar de ${siteConfig.valetHandover.display}. Onze chauffeur staat daar op u te wachten en heeft uw gegevens al digitaal ontvangen: welke auto, welke vlucht, hoe laat u terugkomt.`,
          'Samen loopt u langs de auto en wordt de staat ervan vastgelegd. Daarna neemt hij de sleutel over en tekent u voor de overdracht. Vanaf dat moment loopt u door naar de incheckbalie, en gaat uw auto naar onze beveiligde parkeerlocatie.',
          'De rit ernaartoe is geen blinde vlek. Route, snelheid en duur worden digitaal geregistreerd, zodat achteraf inzichtelijk is wat er met uw auto is gebeurd — ook de terugrit, wanneer hij weer naar de Vertrekpassage wordt gebracht.',
        ]}
        photo="crewTerminal"
        objectPosition="object-[center_30%]"
      >
        <Button href="/digitale-ritregistratie/" variant="link" className="mt-7">
          Lees hoe wij iedere rit registreren
        </Button>
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
              De overdracht bij de hal duurt een paar minuten. De rest gebeurt buiten uw zicht, en
              wordt daarom vastgelegd.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      {/* ---------- Ride registration, as a trust signal ----------
          The one thing on this page that a competitor cannot copy by writing
          better copy: it is a system the client actually runs, with screenshots
          of it on the page it links to.

          Accent wash rather than navy. The rebalance took the site lighter, and
          this is the section that most wants to stand apart from the prose
          around it — the wash does that without putting a fifth dark band on a
          page that already opens on one. Contrast on valet-100: navy-950
          heading 14.90:1, ink-700 body 8.44:1. Both AAA. */}
      <Section tone="accent" spacing="md" aria-labelledby="ritregistratie-heading">
        <Container>
          <Reveal className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <Gauge className="text-accent-hover size-7" strokeWidth={1.75} aria-hidden />
              <h2 id="ritregistratie-heading" className="text-display-sm mt-5 max-w-[24ch]">
                Iedere valetrit wordt digitaal geregistreerd
              </h2>
              <p className="text-body mt-4 max-w-[58ch] leading-relaxed">
                Tijdens iedere valetrit wordt de route, snelheid en duur digitaal geregistreerd. Zo
                zorgen wij voor volledige transparantie en extra zekerheid voor onze klanten.
              </p>
            </div>
            <Button href="/digitale-ritregistratie/" variant="outline" size="lg">
              Bekijk hoe dat werkt
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </Section>

      <ContentSection
        id="verschil"
        eyebrow="Valet of shuttle"
        title="Wanneer valet parking de moeite waard is"
        paragraphs={[
          'Valet parking is de duurdere van onze twee services, en dat verschil koopt precies één ding: u hoeft niet naar een parkeerterrein. U rijdt tot de hal, stapt uit en loopt naar binnen.',
          'Dat weegt het zwaarst als tijd of gemak op dat moment het meest waard is — een vroege zakenvlucht, kleine kinderen en veel bagage, of slecht ter been zijn. Reist u met meer tijd en let u op de kosten, dan is shuttle parkeren de logische keuze: u parkeert dan zelf en houdt uw sleutel.',
        ]}
        bullets={[
          'Uitstappen bij de vertrekhal, geen terrein en geen shuttle',
          'Uw auto wordt door onze eigen chauffeur geparkeerd',
          'Sleutels in een brandwerende kluis onder camerabewaking',
          'Iedere rit digitaal geregistreerd, heen en terug',
          'Bij valet kunt u bij aankomst afrekenen',
        ]}
        tone="canvas"
      >
        <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-7">
          Vergelijk met shuttle parkeren
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over valet parking"
        lead="Over de overdracht, uw sleutels, wie er in uw auto rijdt en wat er wordt vastgelegd."
      />

      <ClosingCta
        heading="Geef uw auto af bij de hal"
        lead="Reserveer valet parking en rijd op de dag zelf rechtstreeks naar de vertrekhal van Schiphol."
        photo="crewShuttleTerminal"
        bookingHref="/reservering/?service=valet"
        bookingLabel="Reserveer valet parking"
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
              name: 'Valet Parking Schiphol',
              description:
                'U rijdt naar de vertrekhal van Schiphol, waar onze chauffeur uw auto overneemt en op onze beveiligde locatie parkeert. Iedere rit wordt digitaal geregistreerd.',
              serviceType: 'Valet parking',
            }),
          ),
        }}
      />
    </>
  );
}
