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
import { Reveal } from '@/components/motion/Reveal';

export const metadata = createMetadata('cheapShuttle');

const PATH = '/goedkoop-shuttle-parkeren-schiphol/';
const CRUMBS = [{ name: 'Goedkoop shuttle parkeren', path: PATH }];

/**
 * /goedkoop-shuttle-parkeren-schiphol/ — Pagina 1 of the client's SEO document.
 *
 * Intent: price. The document is explicit that this page must be commercial but
 * stay useful — "niet alleen goedkoop roepen, maar uitleggen waarom het
 * voordelig en praktisch is" — and that price and trust have to appear
 * together, because the competitors it benchmarks against do exactly that.
 *
 * ── NO PRICES ARE PRINTED ON THIS PAGE, ON PURPOSE ──────────────────────────
 * It would be the obvious thing to do on a page about cost, and it is the one
 * thing that would age badly without anybody noticing. Rates depend on duration
 * and on outdoor-versus-covered, they are computed live by ParkingPro, and
 * /tarieven/ already shows the real number for a real date range. A hardcoded
 * "vanaf € X" here would be contradicted by the booking flow the moment the
 * rate list changes, and the visitor finds that out at the payment step.
 *
 * So this page explains the SHAPE of the pricing — why a terrain a few minutes
 * away costs less than a terminal deck, why per-day cost falls on a long stay,
 * why booking early helps — and sends every price question to the calculator.
 *
 * ── The comparison section is honest about valet ────────────────────────────
 * The document asks for "goedkoop shuttle parkeren versus valet parkeren of
 * officieel Schiphol parkeren". We compare against our OWN valet service, where
 * we know the facts. We do not print a comparison against Schiphol's official
 * P-tariffs: those change, we do not control them, and a stale competitor price
 * on our page is both a credibility problem and, under Dutch rules on
 * comparative advertising, a real one.
 * TODO(client): if you want a like-for-like table against P1/P3, we need a
 * dated source and a commitment to re-check it, or it should stay off.
 */

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat kost shuttle parkeren bij Schiphol?',
    answer:
      'Dat hangt af van hoe lang u weg bent en of u binnen of buiten parkeert. De prijs wordt live berekend, dus u ziet altijd het werkelijke tarief voor uw eigen data voordat u iets vastlegt. Vul uw aankomst- en retourmoment in en het bedrag verschijnt direct.',
  },
  {
    question: 'Waarom is shuttle parkeren goedkoper dan valet?',
    answer:
      'Bij shuttle parkeren doet u zelf het deel dat bij valet door een chauffeur wordt gedaan: u rijdt naar het terrein en zet uw auto zelf neer. Dat scheelt arbeid, en dat verschil ziet u terug in het tarief.',
  },
  {
    question: 'Wordt het per dag goedkoper als ik langer wegblijf?',
    answer:
      'Bij een langere reis wegen de vaste kosten van een reservering over meer dagen uit, waardoor de prijs per dag gunstiger uitpakt dan bij een kort verblijf. Lang parkeren is precies waar deze service voor bedoeld is.',
  },
  {
    question: 'Is vroeg boeken voordeliger?',
    answer:
      'Wij adviseren om zo vroeg mogelijk te reserveren, voor de beste beschikbaarheid en tarieven. Lastminute reserveren kan vaak ook, mits er nog plaats is, maar houd er rekening mee dat voor reserveringen op korte termijn extra kosten in rekening kunnen worden gebracht.',
  },
  {
    question: 'Hoe lang duurt de shuttle naar de terminal?',
    answer: 'De rit van ons terrein naar de vertrekhal van Schiphol duurt 5 tot 8 minuten.',
  },
  {
    question: 'Moet ik mijn sleutel afgeven bij de goedkoopste optie?',
    answer:
      'Nee. Juist bij shuttle parkeren — onze voordeligste service — parkeert u zelf en neemt u uw autosleutel mee op reis.',
  },
  {
    question: 'Kan ik nog annuleren als ik goedkoop heb geboekt?',
    answer:
      'Annuleren tot 24 uur voor aankomst kan met een annuleringsdekking. Dat is een optionele, betaalde toevoeging die u tijdens het reserveren aan uw boeking toevoegt; de prijs ziet u voordat u afrekent. Zonder die dekking is annuleren niet mogelijk.',
  },
  {
    question: 'Hoe laat moet ik er zijn?',
    answer:
      'Wees bij shuttle parkeren minimaal 3 uur voor vertrek op ons terrein. Dan heeft u ruim tijd om te parkeren, in de shuttle te stappen en rustig in te checken.',
  },
];

export default function CheapShuttlePage() {
  return (
    <>
      <PageHero
        eyebrow="Goedkoop parkeren"
        title="Goedkoop lang parkeren bij Schiphol"
        lead="Voordelig parkeren hoeft niet te betekenen dat u inlevert op zekerheid. U parkeert zelf op ons bewaakte terrein, houdt uw sleutel en wordt naar de vertrekhal gereden."
        photo="lotShuttle"
        objectPosition="object-[center_40%]"
        crumbs={CRUMBS}
      >
        <Button href="/tarieven/" size="lg">
          Bereken uw prijs
        </Button>
        <Button href="/shuttle-parkeren-schiphol/" variant="onDark" size="lg">
          Hoe shuttle parkeren werkt
        </Button>
      </PageHero>

      <ContentSection
        id="wat-is-het"
        eyebrow="Wat het is"
        title="Wat goedkoop shuttle parkeren precies inhoudt"
        paragraphs={[
          'Goedkoop shuttle parkeren betekent dat u niet op de luchthaven zelf parkeert, maar op een eigen terrein een paar minuten daarvandaan. U rijdt daarheen, zet uw auto neer en wordt met onze shuttlebus naar de vertrekhal gebracht. Bij terugkomst gebeurt hetzelfde in omgekeerde volgorde.',
          'Dat is de hele reden dat het voordeliger is. Ruimte pal naast een terminal is schaars en duur; ruimte op een paar minuten rijden is dat niet. Het verschil in grondprijs is wat u per dag terugziet, en de afstand ertussen wordt voor u gereden.',
          'Het is bedoeld voor mensen die langer wegblijven. Voor een dagtrip is het verschil klein, maar bij twee of drie weken tikt het per dag stevig aan — en dat is precies het soort reis waarvoor deze service bestaat.',
        ]}
        photo="crewShuttleTerminal"
        objectPosition="object-[center_45%]"
      />

      <ContentSection
        id="prijsvoordeel"
        eyebrow="Het prijsvoordeel"
        title="Waarom shuttle parkeren voordeliger uitpakt"
        paragraphs={[
          'Er zitten drie dingen in het prijsverschil, en het helpt om ze los van elkaar te zien.',
          'Ten eerste de locatie: ons terrein ligt niet op de luchthaven, en dat scheelt in de kosten die aan een parkeerplaats hangen. Ten tweede de arbeid: u parkeert zelf, terwijl bij valet parking een chauffeur uw auto voor u wegzet. Ten derde de duur: hoe langer u parkeert, hoe verder de vaste kosten van uw reservering uitwaaieren over het aantal dagen.',
          'Wat het niet is: een tarief dat u pas bij het afrekenen te zien krijgt. De prijs voor uw eigen data wordt live berekend en staat in beeld voordat u iets vastlegt — inclusief het verschil tussen buiten en overdekt, zodat u die twee naast elkaar ziet in plaats van te moeten gokken.',
        ]}
        bullets={[
          'Terrein buiten de luchthaven, niet op een terminaldek',
          'U parkeert zelf, dus geen chauffeurskosten',
          'Per dag gunstiger naarmate u langer wegblijft',
          'Live berekende prijs, vóór u iets vastlegt',
          'Buiten en overdekt naast elkaar in beeld',
        ]}
        reversed
        tone="surface"
      >
        <Button href="/tarieven/" className="mt-7">
          Bereken de prijs voor uw data
        </Button>
      </ContentSection>

      <ContentSection
        id="hoe-werkt-het"
        eyebrow="Hoe het werkt"
        title="Van aankomst tot ophalen"
        paragraphs={[
          'U reserveert vooraf online en geeft door wanneer u aankomt en wanneer u terugkomt. Op de dag zelf rijdt u naar ons terrein aan de Tupolevlaan in Schiphol-Rijk — niet naar de terminal, dat is bij deze service een veelgemaakte vergissing.',
          'U parkeert uw auto zelf op de plek die u krijgt aangewezen en neemt uw autosleutel mee. De shuttlebus brengt u in 5 tot 8 minuten naar de vertrekhal, waar u gewoon door kunt lopen naar de incheckbalie.',
          'Bij terugkomst belt u ons zodra u door de bagagehal bent. De shuttle haalt u op bij de aankomsthal en brengt u terug naar het terrein, waar uw auto staat waar u hem heeft achtergelaten.',
        ]}
      >
        <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-7">
          De volledige uitleg over shuttle parkeren
        </Button>
      </ContentSection>

      <ContentSection
        id="veilig"
        eyebrow="Voordelig én bewaakt"
        title="Goedkoop hoeft niet onveilig te zijn"
        paragraphs={[
          'De vraag achter iedere zoektocht naar goedkoop parkeren is of er iets is ingeleverd om die prijs mogelijk te maken. Bij ons zit de besparing in de locatie en in het feit dat u zelf parkeert — niet in het toezicht.',
          'Het terrein is afgesloten en staat 24 uur per dag onder camerabewaking. Er geldt een vaste procedure bij aankomst en bij terugkomst, en er zijn overdekte plaatsen beschikbaar als u uw auto liever binnen zet.',
          'Daar komt bij dat u bij deze service niets afgeeft. Uw sleutel gaat mee op reis, dus uw auto blijft staan waar u hem heeft neergezet.',
        ]}
        bullets={[
          'Afgesloten, gecontroleerd parkeerterrein',
          '24/7 camerabewaking en monitoring',
          'U houdt uw eigen autosleutel',
          'Overdekt parkeren mogelijk, in beperkt aantal',
        ]}
        photo="terminalDeparture"
        objectPosition="object-[center_55%]"
        tone="surface"
      >
        <Button href="/veilig-parkeren-schiphol/" variant="link" className="mt-7">
          Meer over veilig parkeren bij Schiphol
        </Button>
      </ContentSection>

      {/* ---------- The comparison ----------
          Our two services, side by side, split by a rule. Deliberately not a
          table against Schiphol's own P-tariffs — see the note at the top. */}
      <Section spacing="lg" aria-labelledby="vergelijking-heading">
        <Container>
          <Reveal className="max-w-[36ch]">
            <Eyebrow rule>Vergelijken</Eyebrow>
            <h2 id="vergelijking-heading" className="text-display-md mt-5">
              Shuttle of valet — waar zit het verschil in prijs?
            </h2>
            <p className="text-muted mt-6 max-w-[52ch]">
              Wij bieden beide services zelf aan, dus deze vergelijking gaat over twee dingen
              waarvan wij de feiten kennen.
            </p>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <Reveal className="py-9 lg:pr-12">
              <p className="eyebrow text-muted">De voordeligste keuze</p>
              <h3 className="text-display-sm text-heading mt-3">Shuttle parkeren</h3>
              <p className="text-body mt-5 max-w-[44ch] leading-relaxed">
                U rijdt naar ons terrein, parkeert zelf en houdt uw sleutel. De shuttle brengt u in
                5 tot 8 minuten naar de vertrekhal. Dit is de goedkoopste manier om bij ons lang te
                parkeren, en verreweg het meest geboekt.
              </p>
              <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-6">
                Over shuttle parkeren
              </Button>
            </Reveal>

            <Reveal delay={80} className="py-9 lg:pl-12">
              <p className="eyebrow text-muted">De snelste keuze</p>
              <h3 className="text-display-sm text-heading mt-3">Valet parking</h3>
              <p className="text-body mt-5 max-w-[44ch] leading-relaxed">
                U rijdt tot de vertrekhal en geeft uw auto af aan onze chauffeur, die hem voor u
                parkeert. Dat kost meer dan shuttle parkeren, en wat u ervoor koopt is dat u geen
                terrein en geen busrit meer hoeft mee te maken.
              </p>
              <Button href="/valet-parking-schiphol/" variant="link" className="mt-6">
                Over valet parking
              </Button>
            </Reveal>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over goedkoop parkeren"
        lead="Over prijzen, de shuttleduur, vroeg boeken, annuleren en uw sleutel."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Bekijk wat het kost voor uw data"
        lead="De prijs wordt live berekend voor uw eigen aankomst- en retourmoment. Geen richtprijs, maar het werkelijke tarief."
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
