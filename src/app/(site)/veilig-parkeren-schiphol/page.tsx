import { Award, Lock, PlugZap, Video, Warehouse, type LucideIcon } from 'lucide-react';
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
import { siteConfig } from '@/config/site';

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
 * ── This page must not out-shout the homepage security band ─────────────────
 * The homepage already spends a full-bleed photograph and the site's only
 * glassmorphism on exactly this argument. Repeating that treatment here would
 * make the stronger of the two weaker, so this page is typographic and states
 * the SAME four measures — 24/7 videobewaking, afgesloten terreinen, overdekte
 * garage, vakbekwame chauffeurs — in the same words, then goes further than the
 * homepage can: what actually happens at handover and at return.
 *
 * Nothing here is a new claim. Every measure is already on /onze-services/ and
 * in the homepage FAQ.
 */

const MEASURES: readonly { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: Video,
    label: '24/7 camerabewaking',
    body: 'Het terrein staat 24 uur per dag onder camerabewaking en wordt gemonitord — ook ’s nachts en in het weekend.',
  },
  {
    icon: Lock,
    label: 'Afgesloten terrein',
    body: 'Onze parkeerterreinen zijn afgesloten en gecontroleerd. Er komt niemand op die er niet hoort te zijn.',
  },
  {
    icon: Warehouse,
    label: 'Overdekt parkeren',
    body: 'Wilt u uw auto liever binnen? Er is een beperkt aantal overdekte plaatsen, uit weer en wind.',
  },
  {
    icon: Award,
    label: 'Vakbekwame chauffeurs',
    body: 'Rijdt er iemand in uw auto, dan is dat een van onze eigen chauffeurs — en wordt die rit digitaal geregistreerd.',
  },
  {
    // See the note on the same item in components/sections/Security.tsx: the
    // claim is kept to what we actually know until the client sends specifics.
    icon: PlugZap,
    label: 'Elektrisch opladen',
    body: 'Rijdt u elektrisch? Er zijn laadpunten op onze eigen parkeerlocatie.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Staat er toezicht op het parkeerterrein?',
    answer:
      'Ja. Het terrein is afgesloten en staat 24 uur per dag onder camerabewaking en monitoring. Dat geldt het hele jaar door, ook buiten kantooruren.',
  },
  {
    question: 'Weet ik waar mijn auto staat?',
    answer:
      'Bij shuttle parkeren wel, want u zet hem zelf neer en u houdt de sleutel — hij staat bij terugkomst waar u hem heeft achtergelaten. Bij valet parking parkeert onze chauffeur hem op onze beveiligde locatie en staat hij bij uw terugkomst weer klaar op de Vertrekpassage, tussen Vertrekhal 2 en 3 — dezelfde plek als waar u hem heeft afgegeven.',
  },
  {
    question: 'Wie rijdt er in mijn auto bij valet parking?',
    answer:
      'Een van onze eigen chauffeurs, en alleen over de route tussen de vertrekhal en onze parkeerlocatie. Die ritten worden digitaal geregistreerd, inclusief de gereden snelheid.',
  },
  {
    question: 'Wordt de staat van mijn auto vastgelegd?',
    answer:
      'Bij valet parking wordt de staat van uw auto samen met u vastgelegd voordat wij hem overnemen, en dat is bij terugkomst het uitgangspunt. Bij shuttle parkeren komt niemand aan uw auto, dus is dat niet aan de orde.',
  },
  {
    question: 'Hoe worden mijn sleutels bewaard?',
    answer:
      'Bij shuttle parkeren neemt u uw sleutels zelf mee op reis. Bij valet parking worden ze opgeborgen in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking.',
  },
  {
    question: 'Rijdt de shuttle ook ’s nachts?',
    answer:
      'Onze shuttleservice is 24 uur per dag beschikbaar, dus ook bij een vroeg vertrek of een late landing. Geef bij het reserveren uw werkelijke tijden op, en bel ons direct na de landing.',
  },
  {
    question: 'Wat gebeurt er bij vertraging?',
    answer:
      'Wij volgen de actuele vluchtinformatie en passen de ophaaltijd indien nodig aan. Bij een vertraging of een vervroegde landing zorgen wij dat u wordt opgehaald en dat uw auto beschikbaar is.',
  },
  {
    question: 'Kan ik mijn elektrische auto opladen?',
    answer:
      'Op onze parkeerlocatie zijn laadpunten aanwezig. Geef bij het reserveren even door dat u elektrisch rijdt, dan houden wij daar rekening mee.',
  },
  {
    question: 'Hoe lang bestaat dit bedrijf al?',
    answer: `Wij verzorgen al meer dan ${siteConfig.yearsActive} jaar valet en shuttle parkeren op Schiphol, voor duizenden reizigers per jaar.`,
  },
];

export default function SafeParkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Veilig parkeren"
        title="Veilig parkeren bij Schiphol"
        lead="Een afgesloten terrein, 24 uur per dag camerabewaking en een vaste procedure bij afgifte en terugkomst. U weet vooraf wat er met uw auto gebeurt."
        photo="lotShuttle"
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
          'Dat is een redelijke vraag, en het antwoord hoort concreet te zijn in plaats van geruststellend. Daarom staat op deze pagina wat er feitelijk is geregeld — het terrein, het toezicht, wie er in uw auto mag rijden en wat er gebeurt op de dag dat u terugkomt.',
        ]}
      />

      {/* ---------- The five measures ----------
          The same five the homepage security band names, in the same words, but
          typographic instead of glass-on-photograph. See the note at the top.
          ⚠ The heading below counts them. It said "Vier" for one pass after the
          EV measure was added, which is the sort of thing nobody reads twice. */}
      <Section tone="surface" spacing="lg" aria-labelledby="maatregelen-heading">
        <Container>
          <Reveal className="max-w-[36ch]">
            <Eyebrow rule>Wat er geregeld is</Eyebrow>
            <h2 id="maatregelen-heading" className="text-display-md mt-5">
              Vijf dingen die op orde zijn
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

      {/* ---------- Elektrisch opladen ----------
          The EV claim appears twice on this page already — as a measure above
          and as an FAQ below — and until now had nothing behind it. This is the
          client's own charger, his own garage, and a member of his own crew
          plugging in.

          The copy stays as thin as it was: that laadpunten exist, on his own
          location, and that it helps to say so when booking. How many there
          are, what a charge costs and whether it must be requested are still
          unknown, and an EV driver asks all three. See the TODO at the measure
          in components/sections/Security.tsx.

          <ContentSection> renders 4:3, same ratio as the homepage band, so this
          needs the same kind of crop from a 3:2 frame — object-[42%] rather
          than the homepage's 38%, which is as far right as the charge point can
          go before its left edge starts to clip.

          `reversed` puts the photograph on the right. That is about the page's
          own rhythm, not about this section: the prose band above it carries no
          image and the zelf-parkeren band below it sets its photograph on the
          left, so an un-reversed frame here would stack two left-hand images
          with only a text block between them. */}
      <ContentSection
        id="opladen"
        eyebrow="Elektrisch rijden"
        title="Laadpunten op onze eigen parkeerlocatie"
        paragraphs={[
          'Rijdt u elektrisch, dan hoeft u onderweg naar Schiphol geen omweg te maken om nog even te laden. Op onze eigen parkeerlocatie zijn laadpunten aanwezig.',
          'Geef bij het reserveren even door dat u elektrisch rijdt. Dan houden wij daar rekening mee bij het toewijzen van uw plek, en staat u niet bij aankomst te zoeken.',
        ]}
        photo="evCharging"
        objectPosition="object-[42%_50%]"
        reversed
      />

      <ContentSection
        id="zelf-parkeren"
        eyebrow="Zelf parkeren"
        title="Zelf neerzetten geeft een eigen soort zekerheid"
        paragraphs={[
          'Naast alles wat wij regelen, is er iets dat u zelf regelt. Bij shuttle parkeren zet u de auto zelf neer, en dat verandert het gevoel meer dan een extra camera zou doen.',
          'U ziet met eigen ogen waar hij staat en op wat voor terrein. U bepaalt zelf hoe u hem achterlaat. En omdat u de sleutel meeneemt, blijft hij staan waar u hem heeft neergezet — er is niemand die hem verplaatst en er ligt geen sleutel op een kantoor.',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      >
        <Button href="/zelf-parkeren-schiphol/" variant="link" className="mt-7">
          Meer over zelf parkeren
        </Button>
      </ContentSection>

      <ContentSection
        id="sleutel"
        eyebrow="Uw sleutel"
        title="Meenemen, of veilig opgeborgen"
        paragraphs={[
          'Bij shuttle parkeren neemt u uw autosleutel mee op reis. Er blijft niets bij ons achter, en dat is voor veel reizigers precies waarom ze deze service kiezen.',
          'Kiest u voor valet parking, dan is de sleutel nodig — onze chauffeur moet de auto immers kunnen verplaatsen. Hij wordt dan opgeborgen in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking, en u krijgt hem bij terugkomst persoonlijk terug.',
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
          'Wij volgen de actuele vluchtinformatie, dus een vertraging of een vervroegde landing is bij ons bekend voordat u belt. Toch vragen wij u om direct na de landing even contact op te nemen — dan weten wij dat u er werkelijk bent, en niet alleen dat uw vlucht dat is.',
          'Bij shuttle parkeren haalt de shuttle u op en brengt u terug naar het terrein, waar uw auto staat waar u hem heeft achtergelaten. Bij valet parking staat uw auto weer klaar op de Vertrekpassage, tussen Vertrekhal 2 en 3, en krijgt u uw sleutels persoonlijk terug.',
        ]}
      />

      <FaqSection
        items={FAQS}
        heading="Vragen over veiligheid"
        lead="Over toezicht, het terrein, wie er in uw auto rijdt en hoe het gaat bij terugkomst."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Parkeer met een gerust gevoel"
        lead="Een afgesloten terrein onder camerabewaking, en een vaste procedure van afgifte tot terugkomst."
        photo="lotShuttle"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
