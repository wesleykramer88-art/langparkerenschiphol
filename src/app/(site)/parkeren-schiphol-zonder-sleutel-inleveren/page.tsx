import { KeyRound } from 'lucide-react';
import { siteConfig } from '@/config/site';
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
    question: 'Hoe werkt Valet parkeren?',
    answer:
      `U geeft uw auto af tussen Vertrekhal 2 en 3. Valet is beschikbaar buiten of overdekt. Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}.`,
  },
  {
    question: 'Wat als ik maar één sleutel heb?',
    answer:
      'Bij Shuttle parkeert u zelf en neemt u uw autosleutel mee. Vraag bij andere vragen over Valet contact op met de klantenservice.',
  },
  {
    question: 'Hoe kom ik bij mijn auto als ik terugkom?',
    answer:
      'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
  },
  {
    question: 'Staat mijn auto veilig als ik de sleutel meeneem?',
    answer:
      'Bij Shuttle parkeert u uw auto zelf buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle brengt u naar Schiphol Plaza.',
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
              uw sleutel. U parkeert zelf buiten aan de Schipholweg 181 in Badhoevedorp. Bij{' '}
              <strong className="text-heading font-semibold">Valet parkeren</strong> geeft u uw auto
              af tussen Vertrekhal 2 en 3 en kiest u tussen buiten of overdekt parkeren.
            </p>
          </Reveal>
        </Container>
      </Section>

      <ContentSection
        id="waarom"
        eyebrow="Waarom het uitmaakt"
        title="Uw sleutel houden is een kwestie van controle"
        paragraphs={[
          'Bij Shuttle parkeert u uw auto zelf buiten aan de Schipholweg 181 in Badhoevedorp en neemt u uw sleutel mee.',
          'Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
        ]}
        bullets={[
          'Parkeerlocatie: Schipholweg 181, Badhoevedorp',
          'Parkeer uw auto zelf buiten',
          'Neem uw autosleutel mee',
          'Geen telefoontje nodig bij terugkomst',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      />

      <ContentSection
        id="verschil"
        eyebrow="Het verschil"
        title="Zelf parkeren met sleutel, of valet met sleuteloverdracht"
        paragraphs={[
          'Wij bieden Shuttle parkeren buiten en Valet parkeren buiten of overdekt aan.',
          'Bij shuttle parkeren rijdt u naar onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp, parkeert u zelf en neemt u uw sleutel mee. De shuttlerit naar Schiphol duurt ongeveer 8 minuten.',
          `Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3. Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}; bij terugkomst belt u direct na de landing en nogmaals zodra u uw ruimbagage heeft ontvangen.`,
        ]}
        reversed
        tone="surface"
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/shuttle-parkeren-schiphol/" variant="outline">
            Shuttle: sleutel mee
          </Button>
          <Button href="/valet-parking-schiphol/" variant="outline">
            Meer over Valet parkeren
          </Button>
        </div>
      </ContentSection>

      <ContentSection
        id="praktisch"
        eyebrow="In de praktijk"
        title="Hoe het op de dag zelf gaat"
        paragraphs={[
          'U rijdt naar onze shuttleparkeerlocatie aan de Schipholweg 181 in Badhoevedorp. Let op dat dit niet de terminal is — bij shuttle parkeren komt u eerst naar ons, en brengen wij u daarna naar Schiphol.',
          'U parkeert uw auto zelf buiten, neemt uw sleutel mee en reist met de shuttle naar Schiphol Plaza. De transfertijd is ongeveer 8 minuten.',
          'Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen; de shuttle brengt u terug naar uw auto.',
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
