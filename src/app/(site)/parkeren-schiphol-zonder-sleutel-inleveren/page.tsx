import { KeyRound } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { ContentSection } from '@/components/sections/ContentSection';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = createMetadata('keepKeys');

const PATH = '/parkeren-schiphol-zonder-sleutel-inleveren/';
const CRUMBS = [{ name: 'Zonder sleutel inleveren', path: PATH }];

/**
 * /parkeren-schiphol-zonder-sleutel-inleveren/ — Pagina 3 of the SEO document.
 *
 * Intent: one very specific worry. Somebody typing this query has already
 * decided they want to park off-airport and has got stuck on the thought of
 * handing their key to a stranger. The document is right that this is a trust
 * page and right that it may be more commercial than a general information
 * page — the visitor is close to booking and is looking for permission.
 *
 * ── The honest version of this page includes valet ──────────────────────────
 * The temptation is to answer "no, you never hand over your keys" and stop.
 * That would be false for half of what this business sells: at valet parking
 * the key IS handed over, because a chauffeur has to move the car.
 *
 * So the page answers the question for shuttle (you keep it), states plainly
 * what happens at valet (fireproof safe, on a camera-monitored office), and
 * lets the reader choose. A visitor who books shuttle believing no key ever
 * changes hands anywhere, and then reads the valet page, has been handled — and
 * the trust this page was built to earn is exactly what gets spent.
 *
 * Every fact here is already published in the homepage FAQ; nothing about the
 * key handling is new on this page.
 */

const FAQS: readonly FaqItem[] = [
  {
    question: 'Mag ik mijn autosleutel echt meenemen op reis?',
    answer:
      'Ja. Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw sleutel gewoon mee. U hoeft niets af te geven en er blijft geen sleutel bij ons achter.',
  },
  {
    question: 'Wordt mijn auto verplaatst terwijl ik weg ben?',
    answer:
      'Nee. Bij shuttle parkeren houdt u de enige sleutel bij u, dus uw auto blijft staan op de plek waar u hem heeft neergezet.',
  },
  {
    question: 'Is zelf parkeren verplicht als ik mijn sleutel wil houden?',
    answer:
      'Ja, die twee horen bij elkaar. Uw sleutel meenemen kan omdat u zelf parkeert. Kiest u voor valet parking, dan neemt onze chauffeur uw auto over en is de sleutel dus nodig.',
  },
  {
    question: 'Wat gebeurt er met mijn sleutel als ik wél valet kies?',
    answer:
      'Dan worden uw sleutels bewaard in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking. Bij terugkomst krijgt u ze persoonlijk terug.',
  },
  {
    question: 'Wat als ik maar één sleutel heb?',
    answer:
      'Bij shuttle parkeren maakt dat niets uit: u houdt hem zelf. Bij valet parking geeft u de sleutel af die nodig is om de auto te verplaatsen; een reservesleutel hoeft u niet mee te nemen.',
  },
  {
    question: 'Hoe kom ik bij mijn auto als ik terugkom?',
    answer:
      'Bel ons zodra u geland bent en door de bagagehal bent. De shuttle haalt u op bij de aankomsthal en brengt u terug naar het terrein. U loopt naar uw auto en rijdt weg met uw eigen sleutel.',
  },
  {
    question: 'Staat mijn auto veilig als ik de sleutel meeneem?',
    answer:
      'Het terrein is afgesloten en staat 24 uur per dag onder camerabewaking, ongeacht welke service u kiest. Dat u de sleutel meeneemt, komt daar bovenop.',
  },
];

export default function KeepKeysPage() {
  return (
    <>
      <PageHero
        eyebrow="Sleutel mee op reis"
        title="Parkeren bij Schiphol zonder uw sleutel in te leveren"
        lead="Bij shuttle parkeren zet u uw auto zelf neer en gaat uw autosleutel gewoon mee in uw zak. Er blijft niets bij ons achter."
        photo="lotShuttle"
        objectPosition="object-[center_45%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=shuttle" size="lg">
          Reserveer shuttle parkeren
        </Button>
      </PageHero>

      {/* ---------- The short answer ----------
          The whole reason this page exists, in one panel, before any prose. A
          visitor with this specific worry should not have to read three
          paragraphs to find out whether the answer is yes or no.

          Accent wash, used once. Contrast on valet-100: navy-950 14.90:1 AAA,
          ink-700 8.44:1 AAA. */}
      <Section tone="accent" spacing="md" aria-labelledby="kort-heading">
        <Container>
          <Reveal className="flex max-w-[52ch] flex-col">
            <KeyRound className="text-accent-hover size-8" strokeWidth={1.75} aria-hidden />
            <h2 id="kort-heading" className="text-display-sm mt-6">
              Het korte antwoord
            </h2>
            <p className="text-body mt-4 leading-relaxed">
              Bij <strong className="text-heading font-semibold">shuttle parkeren</strong> houdt u
              uw sleutel. U parkeert zelf, u geeft niets af en uw auto blijft staan waar u hem
              neerzet. Bij <strong className="text-heading font-semibold">valet parking</strong>{' '}
              geeft u de sleutel wél af — onze chauffeur moet de auto immers kunnen verplaatsen — en
              wordt hij bewaard in een brandwerende kluis op ons kantoor, onder camerabewaking.
            </p>
          </Reveal>
        </Container>
      </Section>

      <ContentSection
        id="waarom"
        eyebrow="Waarom het uitmaakt"
        title="Uw sleutel houden is een kwestie van controle"
        paragraphs={[
          'Voor veel reizigers is het afgeven van een autosleutel het enige onprettige moment van het hele parkeerproces. Niet omdat ze verwachten dat er iets misgaat, maar omdat ze op dat moment niets meer in de hand hebben — en dat gevoel gaat mee het vliegtuig in.',
          'Zelf parkeren neemt dat weg. U rijdt het terrein op, kiest niets ingewikkelds, zet de auto neer en loopt weg met uw sleutel op zak. Wat u achterlaat is een geparkeerde auto, precies zoals u die zelf ergens anders ook zou achterlaten.',
          'Dat is ook praktisch merkbaar. Er is niemand die uw auto verplaatst, er ligt geen sleutel op een kantoor, en er is geen tweede overdracht nodig als u terugkomt: u loopt naar uw auto en rijdt weg.',
        ]}
        bullets={[
          'U geeft niets af en tekent niets over',
          'Uw auto blijft staan waar u hem heeft neergezet',
          'Geen sleuteloverdracht bij terugkomst',
          'Op een afgesloten terrein met 24/7 camerabewaking',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      />

      <ContentSection
        id="verschil"
        eyebrow="Het verschil"
        title="Zelf parkeren met sleutel, of valet met sleuteloverdracht"
        paragraphs={[
          'Wij bieden twee services aan en ze verschillen precies op dit punt. Het is de moeite waard om ze naast elkaar te zien, want de goedkoopste van de twee is toevallig ook de service waarbij u niets afgeeft.',
          'Bij shuttle parkeren rijdt u naar ons terrein, parkeert u zelf en gaat uw sleutel mee. De shuttlebus brengt u in 5 tot 8 minuten naar de vertrekhal.',
          'Bij valet parking rijdt u tot de vertrekhal en neemt onze chauffeur de auto van u over. Daarvoor is de sleutel nodig. Hij wordt daarna opgeborgen in een brandwerende kluis op ons kantoor, dat onder camerabewaking staat, en u krijgt hem bij terugkomst persoonlijk terug. Iedere valetrit wordt bovendien digitaal geregistreerd.',
        ]}
        reversed
        tone="surface"
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/shuttle-parkeren-schiphol/" variant="outline">
            Shuttle: sleutel mee
          </Button>
          <Button href="/digitale-ritregistratie/" variant="outline">
            Valet: iedere rit geregistreerd
          </Button>
        </div>
      </ContentSection>

      <ContentSection
        id="praktisch"
        eyebrow="In de praktijk"
        title="Hoe het op de dag zelf gaat"
        paragraphs={[
          'U rijdt naar ons terrein aan de Tupolevlaan 39 in Schiphol-Rijk. Let op dat dit niet de terminal is — bij shuttle parkeren komt u eerst naar ons, en brengen wij u daarna naar Schiphol.',
          'Op het terrein wordt u ontvangen en krijgt u een plek aangewezen. U parkeert zelf, laadt uw bagage uit naast uw eigen auto en stapt in de shuttlebus. Uw sleutel houdt u bij u.',
          'Na de landing belt u ons zodra u door de bagagehal bent. De shuttle haalt u op bij de aankomsthal en brengt u terug naar het terrein. Daar loopt u naar uw auto, opent u hem met uw eigen sleutel en rijdt u naar huis.',
        ]}
      >
        <Button href="/zelf-parkeren-schiphol/" variant="link" className="mt-7">
          Meer over zelf parkeren bij Schiphol
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Vragen over uw autosleutel"
        lead="Of u hem echt mag meenemen, of de auto wordt verplaatst, en wat er bij valet met de sleutel gebeurt."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Parkeer zelf en houd uw sleutel"
        lead="Reserveer shuttle parkeren en neem uw autosleutel gewoon mee op reis."
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
