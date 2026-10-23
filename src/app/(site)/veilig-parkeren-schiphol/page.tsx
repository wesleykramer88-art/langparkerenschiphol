import { Award, Lock, Warehouse, type LucideIcon } from 'lucide-react';
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
import { Reveal, Stagger } from '@/components/motion/Reveal';

export const metadata = createMetadata('safeParking');

const PATH = '/veilig-parkeren-schiphol/';
const CRUMBS = [{ name: 'Veilig parkeren Schiphol', path: PATH }];

/**
 * /veilig-parkeren-schiphol/ — Pagina 4 of the SEO document.
 *
 * Intent: safety, for the visitor who is not deciding on price. The document
 * asks for this to stay concrete and reassuring rather than technical, which is
 * the right instruction: a list of security jargon reads as a company talking
 * about itself, not as an answer to "will my car be fine".
 *
 * Shuttle and valet are described separately. No claims about camera
 * surveillance, fenced sites, charging or ride registration: none is verified.
 */

const MEASURES: readonly { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: Lock,
    label: 'Shuttle: u houdt de sleutel',
    body: 'U parkeert zelf op Schipholweg 181 in Badhoevedorp, bij het ibis hotel, en neemt uw sleutel mee op reis.',
  },
  {
    icon: Warehouse,
    label: 'Overdekt parkeren',
    body: 'Wilt u uw auto liever binnen? Er is een beperkt aantal overdekte plaatsen, uit weer en wind.',
  },
  {
    icon: Award,
    label: 'Valet: vaste overdracht',
    body: 'Bij valet parking draagt u uw auto over tussen Vertrekhal 2 en 3 en krijgt u hem op dezelfde plek terug.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Weet ik waar mijn auto staat?',
    answer:
      'Bij shuttle parkeren wel, want u zet hem zelf neer op Schipholweg 181 in Badhoevedorp en u houdt de sleutel. Bij valet parking parkeert de chauffeur hem op onze parkeerlocatie en staat hij bij uw terugkomst weer klaar op de Vertrekpassage, tussen Vertrekhal 2 en 3 — dezelfde plek als waar u hem heeft afgegeven.',
  },
  {
    question: 'Wie rijdt er in mijn auto bij valet parking?',
    answer:
      'De chauffeur van onze uitvoerende partner, en alleen tussen de vertrekhal en onze parkeerlocatie. Bij shuttle parkeren rijdt niemand anders in uw auto.',
  },
  {
    question: 'Wordt de staat van mijn auto vastgelegd?',
    answer:
      'Bij valet parking wordt de staat van uw auto samen met u vastgelegd voordat wij hem overnemen, en dat is bij terugkomst het uitgangspunt. Bij shuttle parkeren komt niemand aan uw auto, dus is dat niet aan de orde.',
  },
  {
    question: 'Hoe worden mijn sleutels bewaard?',
    answer:
      'Bij shuttle parkeren neemt u uw sleutels zelf mee op reis. Bij valet parking nemen wij de sleutel over en krijgt u hem bij terugkomst persoonlijk terug.',
  },
  {
    question: 'Hoe werkt de terugkomst bij shuttle parkeren?',
    answer:
      'U hoeft niet te bellen na de landing. U loopt naar dezelfde bushalte op Schiphol Plaza waar u bent uitgestapt en stapt in wanneer de juiste shuttlebus langskomt. De rit duurt ongeveer 8 minuten. Houd daarnaast rekening met tijd voor parkeren, lopen naar de halte, wachten en instappen. Wij adviseren minimaal 3 uur voor vertrek aanwezig te zijn.',
  },
  {
    question: 'Hoe werkt de terugkomst bij valet parking?',
    answer:
      'Bel ons direct na de landing. Uw auto staat dan klaar op de Vertrekpassage, tussen Vertrekhal 2 en 3.',
  },
  {
    question: 'Hoe lang bestaat dit bedrijf al?',
    answer: 'Wij verzorgen valet en shuttle parkeren bij Schiphol voor reizigers die hun auto betrouwbaar willen achterlaten.',
  },
];

export default function SafeParkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Veilig parkeren"
        title="Veilig parkeren bij Schiphol"
        lead="Een veilige reis begint bij een veilige parkeerplaats. Lees hoe shuttle en valet parking werken, wie uw sleutel heeft en wat er bij terugkomst gebeurt."
        photo="lotShuttle"
        photoAlt="Parkeren bij Schiphol"
        objectPosition="object-[center_30%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer uw plek
        </Button>
        <Button href="/waarom-lang-parkeren-schiphol/" variant="outline" size="lg">
          Waarom ons
        </Button>
      </PageHero>

      <ContentSection
        id="waarom-veiligheid"
        eyebrow="Waarom dit telt"
        title="Veiligheid weegt voor veel reizigers net zo zwaar als prijs"
        paragraphs={[
          'Wie voor het eerst zijn auto ergens anders dan op de luchthaven parkeert, vergelijkt eerst op prijs en twijfelt daarna over iets anders: staat hij daar straks nog, en in welke staat.',
          'Dat is een redelijke vraag, en het antwoord hoort concreet te zijn in plaats van geruststellend. Daarom staat op deze pagina wat er feitelijk is geregeld — het terrein, wie er in uw auto mag rijden en wat er gebeurt op de dag dat u terugkomt.',
        ]}
      />

      <Section tone="surface" spacing="lg" aria-labelledby="maatregelen-heading">
        <Container>
          <Reveal className="max-w-[36ch]">
            <Eyebrow rule>Wat er geregeld is</Eyebrow>
            <h2 id="maatregelen-heading" className="text-display-md mt-5">
              Drie dingen die u vooraf weet
            </h2>
          </Reveal>

          <Stagger as="ul" className="divide-line border-line mt-12 divide-y border-y">
            {MEASURES.map((measure) => (
              <li key={measure.label} className="grid gap-4 py-7 sm:grid-cols-[auto_1fr_2fr]">
                <measure.icon
                  className="text-accent size-6 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="text-heading text-base font-semibold sm:text-lg">{measure.label}</h3>
                <p className="text-muted max-w-[54ch] text-sm leading-relaxed sm:text-base">
                  {measure.body}
                </p>
              </li>
            ))}
          </Stagger>
        </Container>
      </Section>

      <ContentSection
        id="zelf-parkeren"
        eyebrow="Zelf parkeren"
        title="Zelf neerzetten geeft een eigen soort zekerheid"
        paragraphs={[
          'Naast alles wat wij regelen, is er iets dat u zelf regelt. Bij shuttle parkeren zet u de auto zelf neer, en u weet dus zelf waar hij staat.',
          'U bepaalt zelf hoe u hem achterlaat. En omdat u de sleutel meeneemt, blijft hij staan waar u hem heeft neergezet — er is niemand die hem verplaatst en er ligt geen sleutel op een kantoor.',
        ]}
        photo="crewShuttleTerminal"
        photoAlt="Auto parkeren bij Schiphol"
        objectPosition="object-[center_45%]"
      >
        <Button href="/zelf-parkeren-schiphol/" variant="link" className="mt-7">
          Meer over zelf parkeren
        </Button>
      </ContentSection>

      <ContentSection
        id="sleutel"
        eyebrow="Uw sleutel"
        title="Meenemen, of overdragen"
        paragraphs={[
          'Bij shuttle parkeren neemt u uw autosleutel mee op reis. Er blijft niets bij ons achter, en dat is voor veel reizigers precies waarom ze deze service kiezen.',
          'Kiest u voor valet parking, dan is de sleutel nodig — de chauffeur moet de auto immers kunnen verplaatsen. U krijgt de sleutel bij terugkomst persoonlijk terug.',
        ]}
        reversed
        tone="surface"
      >
        <Button href="/parkeren-schiphol-zonder-sleutel-inleveren/" variant="link" className="mt-7">
          Parkeren zonder sleutel inleveren
        </Button>
      </ContentSection>

      <ContentSection
        id="terugkomst"
        eyebrow="Bij terugkomst"
        title="Wat er gebeurt op de dag dat u terugkomt"
        paragraphs={[
          'Bij shuttle parkeren hoeft u na de landing niet te bellen. U loopt naar de bushalte op Schiphol Plaza waar u bent uitgestapt en stapt in wanneer de juiste shuttlebus langskomt. De rit naar de parkeerlocatie duurt ongeveer 8 minuten; houd daarnaast rekening met tijd voor lopen naar de halte, wachten en instappen. Uw auto staat waar u hem heeft achtergelaten.',
          'Bij valet parking belt u direct na de landing. Uw auto staat dan klaar op de Vertrekpassage, tussen Vertrekhal 2 en 3, en u krijgt uw sleutels persoonlijk terug.',
        ]}
      />

      <FaqSection
        items={FAQS}
        heading="Vragen over veiligheid"
        lead="Over het terrein, wie er in uw auto rijdt en hoe het gaat bij terugkomst."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Parkeer met een gerust gevoel"
        lead="Een vaste procedure van afgifte tot terugkomst, voor zowel shuttle als valet."
        photo="lotShuttle"
        photoAlt="Parkeren bij Schiphol"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
