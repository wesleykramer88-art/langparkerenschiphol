import { ArrowRight, Check } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { PageHero } from '@/components/sections/PageHero';
import { AppScreenshot } from '@/components/sections/AppScreenshot';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { FaqSection } from '@/components/sections/Faq';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal, Stagger } from '@/components/motion/Reveal';

export const metadata = createMetadata('rideRegistration');

const PATH = '/digitale-ritregistratie/';
const CRUMBS = [{ name: 'Digitale ritregistratie', path: PATH }];

/**
 * /digitale-ritregistratie/
 *
 * Valet-only. The page that answers the question the valet page raises and
 * cannot fully answer in a paragraph: what happens to my car while somebody
 * else is driving it.
 *
 * ── THE COPY ON THIS PAGE IS DELIBERATELY UNDERPOWERED. DO NOT STRENGTHEN IT ──
 * The client supplied the hero and the two section texts, and they are
 * reproduced verbatim. They are worded to build trust WITHOUT making a legal or
 * technical evidentiary claim, and that restraint is the entire point.
 *
 * Specifically, the speed section says the speed is registered so that the
 * company "kan controleren dat iedere chauffeur zich aan de interne
 * veiligheidsrichtlijnen houdt". It does NOT say the data proves anything, that
 * it is retained for any period, that a customer can request it, or that it
 * would settle a dispute. Every one of those would be a promise about a system
 * whose retention, accuracy and access rules we have not been told — and the
 * first customer to ask for a speed log after a scratch would find out.
 *
 * The FAQ answers below are written to the same standard: they describe what is
 * recorded and who sees it, and they stop there. If a future edit here starts a
 * sentence with "altijd", "volledig aantoonbaar" or "u kunt opvragen", it is
 * almost certainly overclaiming.
 *
 * TODO(client): if you want this page to promise a customer access to their own
 * ride data, tell us the retention period and the request procedure and we will
 * write that section properly. Until then it says what the system does, not
 * what it proves.
 */

/** The client's six steps, verbatim, with a supporting line under each. */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Auto opgehaald',
    body: 'Onze chauffeur neemt uw auto over bij de vertrekhal, met uw gegevens al digitaal in beeld.',
  },
  {
    title: 'Rit gestart',
    body: 'De rit wordt in de app gestart. Vanaf dat moment loopt de registratie.',
  },
  {
    title: 'GPS actief',
    body: 'De route van de vertrekhal naar onze parkeerlocatie wordt gevolgd.',
  },
  {
    title: 'Snelheid geregistreerd',
    body: 'De gereden snelheid wordt tijdens de rit digitaal vastgelegd.',
  },
  {
    title: 'Auto veilig geparkeerd',
    body: 'Uw auto komt aan op onze beveiligde locatie en de rit wordt afgesloten.',
  },
  {
    title: 'Terugrit opnieuw geregistreerd',
    body: 'De rit terug naar de Vertrekpassage wordt op dezelfde manier vastgelegd.',
  },
];

/** "Waarom doen wij dit?" — the client's five reasons, verbatim. */
const REASONS = [
  'Meer veiligheid',
  'Meer transparantie',
  'Interne kwaliteitscontrole',
  'Extra zekerheid voor onze klanten',
  'Continue monitoring van onze dienstverlening',
] as const;

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wordt iedere rit geregistreerd?',
    answer:
      'Ja. Iedere valetrit wordt digitaal geregistreerd — zowel de rit van de vertrekhal naar onze parkeerlocatie als de rit terug. U geeft uw auto af en krijgt hem terug op dezelfde plek, tussen Vertrekhal 2 en 3. Bij shuttle parkeren rijdt niemand anders in uw auto, dus daar is dit niet van toepassing.',
  },
  {
    question: 'Wordt mijn locatie gedeeld?',
    answer:
      'Nee. De registratie betreft de rit van uw auto tussen de vertrekhal en onze parkeerlocatie, en die gegevens zijn voor intern gebruik. Ze worden niet met derden gedeeld en er wordt niets van uw eigen telefoon of locatie gevolgd.',
  },
  {
    question: 'Worden snelheden opgeslagen?',
    answer:
      'Ja. De gereden snelheid wordt tijdens de rit vastgelegd, zodat wij kunnen controleren dat onze chauffeurs zich aan de interne veiligheidsrichtlijnen houden. Het gaat om onze eigen kwaliteitscontrole op onze eigen chauffeurs.',
  },
  {
    question: 'Wie kan deze gegevens bekijken?',
    answer:
      'De gegevens zijn bedoeld voor intern gebruik binnen ons bedrijf en worden bekeken door de mensen die verantwoordelijk zijn voor de kwaliteit van onze dienstverlening. Heeft u een vraag over de rit met uw auto, neem dan contact met ons op.',
  },
  {
    question: 'Waarom doen jullie dit?',
    answer:
      'Omdat wij u vragen uw auto aan een ander toe te vertrouwen. Door iedere rit vast te leggen, houden wij zicht op hoe er met uw auto wordt gereden en kunnen wij onze eigen dienstverlening blijven controleren. Dat is beter voor u en het houdt ons scherp.',
  },
];

export default function RideRegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Digitale ritregistratie"
        // The client's exact H1. Long for a heading, and kept whole: the second
        // sentence is what states the purpose, and without it the first is a
        // description of a feature rather than a reason to trust it.
        title="Iedere rit digitaal geregistreerd. Voor maximale veiligheid en transparantie."
        lead="Tijdens iedere valetrit wordt de route, snelheid en duur digitaal geregistreerd. Zo zorgen wij voor volledige transparantie en extra zekerheid voor onze klanten."
        photo="crewHandover"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=valet" size="lg">
          Reserveer veilig
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/valet-parking-schiphol/" variant="outline" size="lg">
          Over valet parking
        </Button>
      </PageHero>

      {/* ---------- Reservation data ----------
          The screenshot sits on the right and the argument on the left. The
          panel it sits in is surface-sunken, so the capture's own near-white
          ground reads as a screen inside a frame rather than as a bleed. */}
      <Section tone="surface" spacing="lg" aria-labelledby="gegevens-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Eyebrow rule>Voor de rit</Eyebrow>
              <h2 id="gegevens-heading" className="text-display-md mt-5 max-w-[18ch]">
                Iedere reservering digitaal vastgelegd
              </h2>
              <p className="text-body mt-6 max-w-[54ch] leading-relaxed">
                Zodra uw reservering actief wordt, ontvangt onze chauffeur alle benodigde gegevens
                digitaal. Van voertuiggegevens tot vluchtinformatie: alles wordt veilig verwerkt
                zodat fouten worden voorkomen.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <AppScreenshot name="appReservation" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Speed registration ----------
          Mirrored, so the two screenshot sections do not stack into the same
          row twice. */}
      <Section spacing="lg" aria-labelledby="snelheid-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <Eyebrow rule>Tijdens de rit</Eyebrow>
              <h2 id="snelheid-heading" className="text-display-md mt-5 max-w-[18ch]">
                Snelheidsregistratie tijdens iedere rit
              </h2>
              {/* Verbatim, and deliberately not stronger than this. See the
                  note at the top of this file before editing a word of it. */}
              <p className="text-body mt-6 max-w-[54ch] leading-relaxed">
                Tijdens de rit wordt de gereden snelheid digitaal geregistreerd. Hierdoor kunnen wij
                controleren dat iedere chauffeur zich aan de interne veiligheidsrichtlijnen houdt.
              </p>
            </Reveal>

            <Reveal delay={80} className="lg:order-1">
              <AppScreenshot name="appRideRegistration" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- The six steps ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="stappen-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Van ophalen tot terugbrengen</Eyebrow>
              <h2 id="stappen-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Wat er tijdens een valetrit wordt vastgelegd
              </h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Zes momenten, van de overdracht bij de hal tot de terugrit na uw landing.
            </p>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      {/* ---------- Why ----------
          The accent wash, used once on this page. Contrast on valet-100:
          navy-950 heading 14.90:1 AAA, ink-700 body 8.44:1 AAA. */}
      <Section tone="accent" spacing="md" aria-labelledby="waarom-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              <h2 id="waarom-heading" className="text-display-md max-w-[14ch]">
                Waarom doen wij dit?
              </h2>
              <p className="text-body mt-6 max-w-[42ch] leading-relaxed">
                Omdat wij u vragen uw auto aan iemand anders toe te vertrouwen. Dat is een
                beslissing die u alleen neemt als u weet wat er in de tussentijd gebeurt.
              </p>
            </Reveal>

            <Stagger as="ul" className="divide-valet-200 divide-y">
              {REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-4 py-4">
                  <Check
                    className="text-accent-hover mt-1 size-5 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span className="text-heading text-base font-medium sm:text-lg">{reason}</span>
                </li>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------- The people and the place ----------
          Real photographs only. This page's entire purpose is authenticity, so
          a stock frame here would undo it — see the standing rule at the top of
          config/images.ts.

          The layout is deliberately uneven: one tall frame and two stacked, so
          it does not read as a three-up grid of interchangeable tiles.

          ⚠ There is no sleutelkluis photograph in the library, and the brief
          asked for one. It is left out rather than substituted.
          TODO(client): a frame of the brandwerende kluis on kantoor would be the
          single most useful photograph you could send for this page — it is the
          one thing the valet FAQ describes that nobody can currently see. Same
          for a chauffeur mid-registratie with the app in hand; `crewCheck`
          below is the only frame of that and it is 590px wide, which is why it
          is an inset here and not a band. */}
      <Section spacing="lg" aria-labelledby="beeld-heading">
        <Container>
          <Reveal className="max-w-[38ch]">
            <Eyebrow rule>Onze mensen en ons terrein</Eyebrow>
            <h2 id="beeld-heading" className="text-display-md mt-5">
              Geen voorraadbeelden, maar onze eigen locatie
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Reveal>
              <div className="shadow-photo relative aspect-3/4 overflow-hidden rounded-xl">
                <Photo
                  name="crewTerminal"
                  fill
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imageClassName="object-cover object-[center_30%]"
                />
              </div>
            </Reveal>

            <div className="flex flex-col gap-6 lg:gap-8">
              <Reveal delay={80}>
                <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
                  <Photo
                    name="lotShuttle"
                    fill
                    sizes="(min-width: 1024px) 36rem, 100vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="object-cover object-[center_45%]"
                  />
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="shadow-photo relative aspect-21/9 overflow-hidden rounded-xl">
                  <Photo
                    name="crewCheck"
                    fill
                    sizes="(min-width: 1024px) 36rem, 100vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="object-cover object-center"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={FAQS}
        heading="Vragen over de registratie"
        lead="Wat er wordt vastgelegd, wie het kan inzien en waarom wij het doen."
      />

      <ClosingCta
        heading="Reserveer veilig"
        lead="Valet parking bij de vertrekhal van Schiphol, met iedere rit digitaal geregistreerd."
        photo="crewShuttleTerminal"
        bookingHref="/reservering/?service=valet"
        bookingLabel="Reserveer veilig"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
