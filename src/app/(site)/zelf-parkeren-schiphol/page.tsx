import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { ContentSection } from '@/components/sections/ContentSection';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = createMetadata('selfParking');

const PATH = '/zelf-parkeren-schiphol/';
const CRUMBS = [{ name: 'Zelf parkeren Schiphol', path: PATH }];

/**
 * /zelf-parkeren-schiphol/ — Pagina 5 of the SEO document.
 *
 * ── The document's own warning governs this page ────────────────────────────
 * "Deze pagina moet duidelijk anders aanvoelen dan de sleutel-pagina: hier ligt
 * de nadruk meer op het proces en de controle, minder op alleen de sleutelvraag."
 *
 * That is a real risk and it is worth being explicit about how it is avoided,
 * because the two pages share a service and half their facts:
 *
 *   /parkeren-schiphol-zonder-sleutel-inleveren/  answers ONE anxious question.
 *     It opens with the short answer in a panel, spends its middle on what
 *     handing over a key feels like, and covers valet's safe because the honest
 *     answer requires it.
 *
 *   THIS PAGE                                     describes a PROCESS.
 *     It opens on what you do, gives the day itself a six-step timeline, and
 *     spends its middle on knowing where the car is and what that is worth. The
 *     key appears once, as one property of self-parking among several, and links
 *     away rather than re-arguing.
 *
 * If a future edit makes this page open with the key question, the two have
 * collapsed into one and one of them should be redirected.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'U rijdt het terrein op.',
    body: 'Tupolevlaan 39, Schiphol-Rijk. Niet de terminal — bij deze service komt u eerst naar ons toe.',
  },
  {
    title: 'U krijgt een plek aangewezen.',
    body: 'Geen rondjes rijden en geen zoeken naar een vrij vak op een vol dek.',
  },
  {
    title: 'U parkeert zelf.',
    body: 'U zet de auto neer zoals u dat zelf wilt, en laadt uw bagage uit naast uw eigen auto.',
  },
  {
    title: 'Sleutel op zak.',
    body: 'U neemt uw autosleutel mee. Er blijft niets bij ons achter.',
  },
  {
    title: 'De shuttle brengt u weg.',
    body: 'In 5 tot 8 minuten naar de vertrekhal van Schiphol, waar u doorloopt naar de incheckbalie.',
  },
  {
    title: 'Terug bij uw eigen auto.',
    body: 'Na de landing belt u ons. De shuttle brengt u terug naar het terrein en u rijdt weg.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Parkeer ik altijd zelf?',
    answer:
      'Bij shuttle parkeren wel — dat is precies wat deze service inhoudt. Kiest u voor valet parking, dan rijdt u tot de vertrekhal en parkeert onze chauffeur uw auto voor u.',
  },
  {
    question: 'Moet ik zelf een plek zoeken?',
    answer:
      'Nee. U wordt op het terrein ontvangen en krijgt een plek aangewezen. Zelf parkeren betekent dat u de auto zelf neerzet, niet dat u er een moet gaan zoeken.',
  },
  {
    question: 'Wordt mijn auto later nog verplaatst?',
    answer:
      'Nee. U houdt uw autosleutel, dus uw auto blijft staan waar u hem heeft neergezet tot u terugkomt.',
  },
  {
    question: 'Waar vertrekt de shuttle?',
    answer:
      'Vanaf ons eigen terrein. U parkeert, loopt naar het opstappunt en stapt in. De rit naar de vertrekhal duurt 5 tot 8 minuten.',
  },
  {
    question: 'Hoe kom ik na mijn reis terug bij mijn auto?',
    answer:
      'Bel ons zodra u geland bent en door de bagagehal bent. De shuttle haalt u op bij de aankomsthal en brengt u terug naar het terrein, waar uw auto staat.',
  },
  {
    question: 'Hoe lang van tevoren moet ik op het terrein zijn?',
    answer:
      'Wees minimaal 3 uur voor vertrek op het terrein. Dan heeft u ruim tijd om te parkeren, in de shuttle te stappen en rustig in te checken op Schiphol.',
  },
  {
    question: 'Kan ik mijn auto overdekt neerzetten?',
    answer:
      'Ja, er is een beperkt aantal overdekte plaatsen. U kiest tussen buiten en overdekt tijdens het reserveren, waar beide tarieven naast elkaar staan.',
  },
  {
    question: 'Is zelf parkeren goedkoper?',
    answer:
      'Ja. Shuttle parkeren, waarbij u zelf parkeert, is onze voordeligste service — u doet zelf het deel dat bij valet parking door een chauffeur wordt gedaan.',
  },
];

export default function SelfParkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Zelf parkeren"
        title="Zelf parkeren bij Schiphol"
        lead="U zet uw auto zelf neer op ons bewaakte terrein en ziet met eigen ogen waar hij staat. Daarna brengt de shuttle u naar de vertrekhal."
        photo="lotShuttle"
        objectPosition="object-[center_50%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=shuttle" size="lg">
          Reserveer shuttle parkeren
        </Button>
      </PageHero>

      <ContentSection
        id="waarom"
        eyebrow="Waarom zelf"
        title="Veel reizigers zetten hun auto liever zelf neer"
        paragraphs={[
          'Er zijn twee manieren om bij ons te parkeren, en het verschil zit in wie er achter het stuur zit. Bij valet parking rijdt u tot de vertrekhal en neemt onze chauffeur het over. Bij shuttle parkeren doet u het zelf.',
          'Voor een deel van onze klanten is dat laatste geen concessie maar de reden om te boeken. U rijdt het terrein op, ziet waar u staat, zet de auto neer zoals u dat zelf wilt en loopt weg met de sleutel op zak. Er is niets overgedragen en er is niets afgesproken dat u niet zelf heeft gezien.',
          'Het scheelt ook geld. Zelf parkeren is het deel van het werk dat bij valet door een chauffeur wordt gedaan, en dat verschil ziet u terug in het tarief.',
        ]}
        photo="lotShuttle"
        objectPosition="object-[center_38%]"
      />

      {/* ---------- The day itself ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="dag-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>De dag van vertrek</Eyebrow>
              <h2 id="dag-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Zo gaat zelf parkeren in de praktijk
              </h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Van het terrein op rijden tot wegrijden bij terugkomst — zes stappen, waarvan u er
              twee zelf doet.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      <ContentSection
        id="controle"
        eyebrow="Controle"
        title="U weet waar hij staat, en dat blijft zo"
        paragraphs={[
          'Het verschil tussen "mijn auto staat ergens veilig" en "mijn auto staat daar" is groter dan het klinkt. Wie zelf parkeert heeft het terrein gezien, weet hoe het eruitziet en weet op welke plek de auto staat.',
          'Die situatie verandert daarna niet meer. Omdat u de sleutel meeneemt, kan de auto niet verplaatst worden, en bij terugkomst loopt u naar dezelfde plek terug. Er is geen tweede overdracht, geen wachten tot iemand hem voorrijdt en geen moment waarop u iets moet aannemen dat u niet zelf kunt zien.',
        ]}
        bullets={[
          'U ziet zelf op wat voor terrein u parkeert',
          'U bepaalt zelf hoe u de auto achterlaat',
          'Geen verplaatsing tijdens uw reis',
          'Bij terugkomst direct naar uw eigen auto',
        ]}
        reversed
      >
        <Button href="/parkeren-schiphol-zonder-sleutel-inleveren/" variant="link" className="mt-7">
          Over uw sleutel meenemen
        </Button>
      </ContentSection>

      <ContentSection
        id="voor-wie"
        eyebrow="Voor wie"
        title="Voor wie zelf parkeren de juiste keuze is"
        paragraphs={[
          'Zelf parkeren past bij reizigers die op de kosten letten, want het is de voordeligste manier om bij ons lang te parkeren. Het past bij gezinnen, omdat u naast uw eigen auto uitlaadt in plaats van op een stoep bij de vertrekhal.',
          'En het past bij iedereen die liever geen valet gebruikt. Niet omdat daar iets mis mee is — wij bieden het zelf aan en iedere valetrit wordt digitaal geregistreerd — maar omdat de gedachte aan iemand anders achter het stuur van uw auto voor sommige mensen nu eenmaal blijft knagen. Dan is dit de service die die vraag helemaal niet stelt.',
        ]}
        tone="surface"
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/goedkoop-shuttle-parkeren-schiphol/" variant="outline">
            Wat het kost
          </Button>
          <Button href="/veilig-parkeren-schiphol/" variant="outline">
            Hoe veilig het terrein is
          </Button>
        </div>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Vragen over zelf parkeren"
        lead="Of u altijd zelf parkeert, of de auto verplaatst wordt, waar de shuttle vertrekt en hoe u terugkomt."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Zet uw auto zelf neer"
        lead="Reserveer shuttle parkeren, parkeer zelf op ons bewaakte terrein en houd uw eigen sleutel."
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
