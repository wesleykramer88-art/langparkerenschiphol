import { ArrowRight, Check, Gauge } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { SERVICE_COPY } from '@/config/services';
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

/**
 * The client's six steps, August 2026 — his headings without the "Stap n:"
 * prefix <Timeline> already emits.
 *
 * ⚠ Step 6 is about 260 characters, which at six columns and the dense 34ch
 * measure runs to roughly nine lines. The band is materially taller than it was
 * and the last column is the deepest by some way. Nothing overflows.
 *
 * One thing our version said and his does not: "U tekent voor de overdracht."
 * His step 4 says the handover is recorded ("leggen we de overdracht vast")
 * without claiming the customer signs for it. That is the safer of the two — we
 * were never told a signature is taken — so the change is kept rather than
 * argued with.
 */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer online',
    body: 'Reserveer uw valet parking eenvoudig online en vul uw aankomst-, retour- en vluchtgegevens in. Wilt u lastminute reserveren? Valet parking kan tot minimaal één uur voor aankomst worden gereserveerd, zolang er beschikbaarheid is.',
  },
  {
    title: 'Rijd rechtstreeks naar Schiphol',
    body: 'Op de dag van vertrek rijdt u naar de Vertrekpassage van Schiphol, tussen Vertrekhal 2 en 3. U hoeft dus niet eerst naar onze parkeerlocatie te rijden.',
  },
  {
    title: 'Onze chauffeur staat voor u klaar',
    body: 'Onze chauffeur ontvangt uw reserveringsgegevens vooraf en staat op het afgesproken tijdstip bij de vertrekhal voor u klaar.',
  },
  {
    title: 'We controleren uw auto',
    body: 'Voordat wij uw auto overnemen, controleren we samen kort de staat van uw auto en leggen we de overdracht vast. Daarna geeft u uw autosleutel aan onze chauffeur en kunt u met uw bagage direct door naar de vertrekhal.',
  },
  {
    title: 'Wij parkeren uw auto',
    body: 'Onze chauffeur rijdt uw auto naar onze bewaakte parkeerlocatie. De volledige rit wordt digitaal geregistreerd, inclusief de gereden route en snelheid. Na het parkeren wordt uw autosleutel veilig opgeborgen in een brandwerende sleutelkluis op ons kantoor.',
  },
  {
    title: 'Uw auto komt terug naar Schiphol',
    body: 'Na uw landing neemt u telefonisch contact met ons op. Wij brengen uw auto terug naar de afgesproken locatie tussen Vertrekhal 2 en 3. Ook deze terugrit wordt volledig digitaal geregistreerd. U neemt uw auto en autosleutel weer in ontvangst en kunt direct uw reis naar huis vervolgen.',
  },
];

/**
 * His nine, August 2026 — the same nine questions in the same order.
 *
 * ⚠ The handover point is now written out in his words rather than interpolated
 * from `siteConfig.valetHandover`. That is a deliberate loss of a single source
 * of truth for two answers, and the reason is that his sentences put the
 * information in a different shape ("rechtstreeks naar de Vertrekpassage van
 * Schiphol, tussen Vertrekhal 2 en 3") than the config's one-line `display`
 * form. The config still owns it everywhere else on the site, including the
 * body copy of this page's own handover section.
 * TODO: if the handover point ever moves, these two answers do NOT update
 * themselves. Search "Vertrekhal 2 en 3".
 */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Waar moet ik zijn voor valet parking?',
    answer: [
      'Voor valet parking rijdt u rechtstreeks naar de Vertrekpassage van Schiphol, tussen Vertrekhal 2 en 3.',
      'U rijdt dus niet eerst naar onze parkeerlocatie. Onze chauffeur staat op het afgesproken tijdstip bij de vertrekhal voor u klaar.',
    ],
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn?',
    answer: [
      'Wij adviseren om minimaal 2,5 uur voor het vertrek van uw vlucht bij Schiphol aanwezig te zijn.',
      'De overdracht van uw auto duurt slechts enkele minuten. Daarna kunt u direct met uw bagage doorlopen naar de incheckbalie.',
    ],
  },
  {
    question: 'Wat gebeurt er met mijn autosleutel?',
    answer: [
      'Nadat uw auto is geparkeerd, wordt uw autosleutel veilig opgeborgen in een brandwerende sleutelkluis op ons kantoor.',
      'Ons kantoor is eveneens voorzien van camerabewaking. Bij uw terugkomst wordt de sleutel weer persoonlijk aan u overhandigd.',
    ],
  },
  {
    question: 'Wordt de staat van mijn auto vastgelegd?',
    answer: [
      'Ja. Voordat onze chauffeur uw auto overneemt, controleren we samen met u de staat van de auto en leggen we de overdracht vast.',
      'Zo is duidelijk in welke staat uw auto aan ons is overgedragen.',
    ],
  },
  {
    // Still states plainly that there is no arrivals-hall leg, which was the
    // correction this answer exists to carry.
    question: 'Waar krijg ik mijn auto terug?',
    answer: [
      'Uw auto wordt teruggebracht naar dezelfde locatie bij Schiphol: de Vertrekpassage tussen Vertrekhal 2 en 3.',
      'Bel ons zodra u bent geland. Wij zorgen er vervolgens voor dat uw auto naar de afgesproken locatie wordt gebracht.',
      'U hoeft dus niet naar onze parkeerlocatie of met een shuttlebus mee.',
    ],
  },
  {
    question: 'Wie rijdt er in mijn auto?',
    answer: [
      'Uw auto wordt uitsluitend door onze chauffeurs verplaatst.',
      'Zij rijden uw auto tussen Schiphol en onze parkeerlocatie. Iedere rit wordt digitaal geregistreerd, inclusief de gereden route en snelheid.',
    ],
  },
  {
    question: 'Hoeveel kilometer wordt er met mijn auto gereden?',
    answer: [
      'Er wordt alleen met uw auto gereden voor het vervoer tussen de vertrekhal van Schiphol en onze parkeerlocatie en weer terug.',
      'De kilometerstand wordt bij de overdracht vastgelegd, zodat duidelijk is hoeveel kilometer er tijdens de parkeerperiode met uw auto is gereden.',
    ],
  },
  {
    question: 'Kan ik bij aankomst betalen?',
    answer: [
      'Ja. Bij valet parking heeft u de mogelijkheid om bij aankomst af te rekenen.',
      'Bij shuttle parkeren betaalt u uw reservering vooraf.',
    ],
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer: [
      'Wij volgen de actuele vluchtinformatie en houden rekening met vertragingen en eerdere landingen.',
      'Bel ons zodra u bent geland. Zo weten wij dat u daadwerkelijk bent aangekomen en kunnen wij ervoor zorgen dat uw auto naar de afgesproken locatie wordt gebracht.',
    ],
  },
];

export default async function ValetParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Valet Parking"
        title="Valet parking bij Schiphol"
        subhead="Stap uit bij de vertrekhal. Wij doen de rest."
        lead="Rijd rechtstreeks naar de vertrekhal van Schiphol, draag uw auto over aan onze chauffeur en loop direct door naar de incheckbalie. Wij parkeren uw auto veilig op onze bewaakte parkeerlocatie."
        photo="crewHandover"
        objectPosition="object-[center_40%]"
        crumbs={CRUMBS}
        aside={<BookingPicker notch="inverse" defaultService="valet" bounds={bounds} />}
      >
        <Button href="/reservering/?service=valet" size="lg">
          Reserveer valet parking
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/tarieven/" variant="outline" size="lg">
          Bekijk tarieven
        </Button>

        {/* ── PAY ON ARRIVAL FINALLY HAS A HOME ─────────────────────────────
            This closes a TODO that has been open in ServiceChooser since
            before the client supplied his USPs: valet is the only service
            that takes payment on site, it is a genuine reason to pick the
            more expensive option, and it appeared nowhere on the site.
            His document puts it exactly here — a note under the booking
            block — so that is where it goes. Set at the same weight as the
            homepage hero's "Online reserveren met directe bevestiging",
            which is the same kind of line in the same position.
            `basis-full` so it drops below the two buttons rather than
            competing for space on their row. */}
        <p className="text-muted basis-full text-sm">
          Bij valet parking kunt u ook bij aankomst betalen.
        </p>
      </PageHero>

      <ServiceUsp
        service="valet"
        heading="Valet parkeren bij Schiphol"
        subhead="Uitstappen bij de vertrekhal, wij parkeren uw auto"
        paragraphs={[
          'Met valet parking begint uw reis zo comfortabel mogelijk. U rijdt met uw eigen auto rechtstreeks naar de vertrekhal van Schiphol. Daar staat onze chauffeur op het afgesproken tijdstip voor u klaar.',
          'Na een korte controle draagt u uw auto en autosleutel over. U pakt uw bagage en loopt direct door naar de vertrekhal. Wij zorgen voor de rest.',
        ]}
        bullets={SERVICE_COPY.valet.detailBullets}
      />

      <ContentSection
        id="hoe-het-werkt"
        eyebrow="De overdracht"
        title="Zo werkt valet parking bij de vertrekhal"
        paragraphs={[
          `Op de dag van vertrek rijdt u rechtstreeks naar de ${siteConfig.valetHandover.display}. Onze chauffeur staat daar op het afgesproken tijdstip voor u klaar en heeft uw reserveringsgegevens vooraf ontvangen.`,
          'Samen controleren we kort de staat van uw auto. Vervolgens draagt u uw autosleutel over en wordt de overdracht geregistreerd.',
          'Daarna kunt u met uw bagage direct doorlopen naar de incheckbalie. Onze chauffeur rijdt uw auto naar onze bewaakte parkeerlocatie.',
        ]}
        photo="crewTerminal"
        objectPosition="object-[center_30%]"
      >
        {/* His document closes this section with an H3 and three paragraphs,
            then the link. Kept as a subsection rather than folded into the
            paragraphs above: it is the answer to a different question. */}
        <div className="mt-10">
          <h3 className="text-heading text-lg font-semibold">
            Iedere rit wordt digitaal geregistreerd
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-body max-w-[62ch] leading-relaxed">
              Vanaf het moment dat onze chauffeur met uw auto vertrekt, wordt de rit digitaal
              geregistreerd. Daarbij leggen we onder andere de gereden route, snelheid en ritduur
              vast.
            </p>
            <p className="text-body max-w-[62ch] leading-relaxed">
              Dit gebeurt zowel tijdens de rit naar onze parkeerlocatie als tijdens de terugrit naar
              Schiphol.
            </p>
            <p className="text-body max-w-[62ch] leading-relaxed">
              Zo is achteraf inzichtelijk wanneer, waar en hoe er met uw auto is gereden.
            </p>
          </div>
        </div>

        <Button href="/digitale-ritregistratie/" variant="link" className="mt-7">
          Bekijk hoe onze digitale ritregistratie werkt
        </Button>
      </ContentSection>

      {/* ---------- The process ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Zo werkt valet parking bij Schiphol</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Van reservering tot terugkomst in 6 eenvoudige stappen
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
      {/* His copy for this band is considerably longer than the single paragraph
          that was here: a subhead, three short paragraphs, a four-item list of
          what is recorded, and two closing lines. The list is what made the old
          two-column [copy | button] row untenable — a bulleted list squeezed
          beside a button reads as a footnote — so the button now sits under the
          copy and the list runs as a compact two-column grid inside the band.
          The band's tone, spacing and accent wash are unchanged. */}
      <Section tone="accent" spacing="md" aria-labelledby="ritregistratie-heading">
        <Container>
          <Reveal className="max-w-[62ch]">
            <Gauge className="text-accent-hover size-7" strokeWidth={1.75} aria-hidden />
            <h2 id="ritregistratie-heading" className="text-display-sm mt-5 max-w-[24ch]">
              Iedere valetrit digitaal geregistreerd
            </h2>
            <p className="text-heading mt-4 text-lg font-medium">
              Extra transparantie wanneer wij in uw auto rijden
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body leading-relaxed">
                Wij begrijpen dat u wilt weten wat er met uw auto gebeurt zodra u de sleutel aan
                onze chauffeur overhandigt.
              </p>
              <p className="text-body leading-relaxed">
                Daarom wordt iedere rit met uw auto digitaal geregistreerd.
              </p>
              <p className="text-body leading-relaxed">We registreren onder andere:</p>
            </div>

            {/* divide-valet-200 rather than divide-line: the hairline has to read
                against the accent wash, and that is the divider the other
                accent-toned lists on this site use. */}
            <ul className="divide-valet-200 border-valet-200 mt-5 divide-y border-y sm:grid sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0">
              {[
                'De gereden route',
                'De gereden snelheid',
                'De duur van de rit',
                'Het tijdstip van de rit',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 py-3">
                  <Check
                    className="text-accent-hover mt-1 size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body leading-relaxed">
                De registratie geldt voor zowel de heenrit naar onze parkeerlocatie als de terugrit
                naar Schiphol.
              </p>
              <p className="text-body leading-relaxed">
                Zo zorgen we voor extra transparantie tijdens de volledige parkeerperiode.
              </p>
            </div>

            <Button href="/digitale-ritregistratie/" variant="outline" size="lg" className="mt-8">
              Bekijk hoe onze ritregistratie werkt
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </Section>

      <ContentSection
        id="verschil"
        eyebrow="Valet of shuttle parkeren?"
        title="Wanneer kiest u voor valet parking?"
        paragraphs={[
          'Valet parking is onze meest comfortabele parkeerservice. U hoeft niet naar een parkeerterrein te rijden en u hoeft niet met een shuttlebus naar Schiphol.',
          'U rijdt rechtstreeks naar de vertrekhal, stapt uit en draagt uw auto over aan onze chauffeur.',
          'Valet parking is daardoor vooral prettig wanneer gemak en tijd belangrijk zijn. Bijvoorbeeld bij een vroege vlucht, wanneer u met kinderen reist, veel bagage heeft of zo min mogelijk wilt lopen.',
          'Wilt u liever voordeliger parkeren en uw autosleutels meenemen op reis? Dan is shuttle parkeren bij Schiphol een goede keuze.',
        ]}
        bulletsHeading="Voordelen van valet parking"
        bullets={[
          'Rechtstreeks naar de vertrekhal van Schiphol',
          'Geen shuttlebus of transfer nodig',
          'Uw auto wordt door onze chauffeur geparkeerd',
          'Iedere rit digitaal geregistreerd',
          'Autosleutel veilig opgeborgen in een brandwerende kluis',
          'Bij aankomst betalen mogelijk',
        ]}
        tone="canvas"
      >
        <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-7">
          Vergelijk valet met shuttle parkeren
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over valet parking bij Schiphol"
        lead="Alles over de overdracht, uw autosleutel, onze chauffeurs, de parkeerlocatie en het ophalen van uw auto."
      />

      <ClosingCta
        heading="Valet parking bij Schiphol reserveren"
        subhead="Rijd naar de vertrekhal. Wij parkeren uw auto."
        lead={[
          'Geen parkeerterrein zoeken, geen shuttlebus en niet met uw bagage overstappen.',
          'Met valet parking rijdt u rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur neemt uw auto van u over en wij zorgen ervoor dat deze tijdens uw reis veilig wordt geparkeerd.',
          'Na uw terugkomst brengen wij uw auto weer naar Schiphol, zodat u direct uw reis naar huis kunt vervolgen.',
        ]}
        reassurances={[
          'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
          'Binnen 2 minuten online gereserveerd',
          '24/7 bewaakte parkeerlocatie',
          'Iedere valetrit digitaal geregistreerd',
          'Directe overdracht bij de vertrekhal',
        ]}
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
