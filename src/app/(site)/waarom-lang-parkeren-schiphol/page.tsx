import {
  ArrowRight,
  Flame,
  Lock,
  Route,
  UserCheck,
  Video,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { siteConfig, termsUrl } from '@/config/site';
import type { PhotoName } from '@/config/images';

export const metadata = createMetadata('why');

const CRUMBS = [{ name: 'Waarom Lang Parkeren Schiphol', path: '/waarom-lang-parkeren-schiphol/' }];

/**
 * /waarom-lang-parkeren-schiphol/ — the trust page.
 *
 * A new page, pre-approved by the client, for the visitor who has understood
 * the offer and has not yet decided to hand over a car. That reader is not
 * short of features; they are short of specifics. So this page is almost
 * entirely detail: what physically happens to the vehicle at each stage, what
 * the security measures actually are, and what happens when the trip does not
 * go to plan.
 *
 * The slug is the query. "waarom lang parkeren schiphol" and its variants are
 * typed constantly and no page on the live site answers them in one place.
 *
 * ── Sourcing rule for this page in particular ───────────────────────────────
 * Every factual claim below is traceable to something the business already
 * publishes — the homepage FAQ, the services page, or the rates FAQ. Nothing is
 * rounded up, and where a fact is missing it is missing on the page rather than
 * filled in. This is the page a hesitant reader checks hardest; it has to
 * survive being checked.
 *
 * The two places where something is genuinely unknown are marked TODO(client)
 * and are the first two items in the handover: the insurance specifics and
 * certifications, and the damage procedure.
 */

/* ══════════════════════════════════════════════════════════════════════════
   THE PROCESS
   Expanded from the homepage's four steps. There each step is one sentence,
   because the homepage's job is to say it is simple; here each step also says
   what happens to the CAR, because this page's job is to say it is safe.

   Numbered markers are justified here and on the partner page's agenda, and
   nowhere else on the site: this is a genuine sequence and the order is
   information the reader needs.
   ══════════════════════════════════════════════════════════════════════════ */
const PROCESS: readonly { title: string; body: string; car: string }[] = [
  {
    title: 'U reserveert online',
    body: 'In twee minuten geregeld. U kiest valet of shuttle, uw aankomst- en retourmoment en eventuele opties.',
    car: 'Wij leggen uw kenteken en uw vluchtgegevens vast. Die vluchtgegevens zijn geen formaliteit — daarmee volgen wij later uw vlucht.',
  },
  {
    title: 'Wij nemen uw auto over',
    body: 'Bij valet parkeren rijdt u naar de Vertrekpassage op Schiphol — vertrekhal, 1e verdieping — waar onze chauffeur u opwacht. Bij shuttle parkeren rijdt u naar ons terrein aan de Tupolevlaan in Schiphol-Rijk en brengt de shuttlebus u binnen 5 tot 8 minuten naar de vertrekhal.',
    car: 'Voordat wij de auto overnemen doen wij een korte controle van het voertuig. Kiest u shuttle parkeren, dan kunt u uw sleutels meenemen op reis.',
  },
  {
    title: 'Uw auto staat op een bewaakt terrein',
    body: 'De auto wordt geparkeerd op een afgesloten en gecontroleerd parkeerterrein met 24/7 camerabewaking. Overdekt parkeren is mogelijk.',
    car: 'De rit ernaartoe wordt digitaal geregistreerd, inclusief snelheid en route. Bij valet parkeren gaan uw sleutels in een brandwerende kluis op ons kantoor, dat eveneens onder camerabewaking staat.',
  },
  {
    title: 'Uw auto staat klaar bij terugkomst',
    body: 'Bel ons direct na de landing op Schiphol. Bij valet parkeren staat uw auto voor u klaar bij de luchthaven; bij shuttle parkeren haalt de bus u op en brengt u terug naar uw auto.',
    car: 'Wij volgen de actuele vluchtinformatie en passen de ophaaltijd aan bij vertraging of een vervroegde landing.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SECURITY
   All six carried from the client's own copy. No figure is invented — there is
   deliberately no camera count, no retention period and no capacity number,
   because nobody has supplied them.
   ══════════════════════════════════════════════════════════════════════════ */
const MEASURES: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Video,
    title: '24/7 camerabewaking',
    body: 'Onze parkeerlocaties worden vierentwintig uur per dag bewaakt en gemonitord met camera’s.',
  },
  {
    icon: Lock,
    title: 'Afgesloten terreinen',
    body: 'De terreinen zijn afgesloten en gecontroleerd. Er komt niemand op die er niet hoort te zijn.',
  },
  {
    icon: Warehouse,
    title: 'Overdekt parkeren mogelijk',
    body: 'U kunt kiezen voor een plek in de overdekte garage in plaats van buiten op het terrein.',
  },
  {
    icon: Route,
    title: 'Digitale ritregistratie',
    body: 'Iedere rit met uw auto wordt digitaal vastgelegd, inclusief snelheid en route. Er is dus altijd inzicht in de verplaatsingen van uw voertuig.',
  },
  {
    icon: Flame,
    title: 'Brandwerende sleutelkluis',
    body: 'Bij valet parkeren worden uw autosleutels opgeborgen in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking.',
  },
  {
    icon: UserCheck,
    title: 'Gescreende chauffeurs',
    body: 'Onze chauffeurs zijn gescreend, in dienst en ervaren. Zij rijden dagelijks bij de vertrekhal van Schiphol.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   THE PHOTOGRAPHS
   Four of the client's own, shot at the airport. Every vehicle in frame
   carries a Dutch yellow plate, which is the point — see config/images.ts.
   ══════════════════════════════════════════════════════════════════════════ */
const GALLERY: readonly { photo: PhotoName; caption: string; aspect: string; alt: string }[] = [
  {
    photo: 'crewTerminal',
    caption: 'Onze chauffeur bij Vertrek 2, waar de overdracht plaatsvindt.',
    alt: 'medewerkers veilig parkeren Schiphol',
    aspect: 'aspect-3/4',
  },
  {
    photo: 'crewHandover',
    caption: 'De overdracht zelf: bagage eruit, auto over, u loopt door.',
    alt: 'auto veilig parkeren Schiphol',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'lotShuttle',
    caption: 'Ons parkeerterrein, met de shuttlebus die naar de vertrekhal rijdt.',
    alt: 'veilig parkeerterrein bij Schiphol',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'crewCheck',
    caption: 'Elke auto wordt bij overdracht gecontroleerd en vastgelegd.',
    alt: 'beveiligd parkeren bij Schiphol',
    aspect: 'aspect-3/4',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   WHAT HAPPENS IF…
   The highest-value block on the page: these four are what a reader is
   actually worried about, and three of them are answered nowhere on the live
   site.

   The first two expand the homepage's delay answer. The third is assembled
   from what the business already states about flight tracking. The fourth
   describes only what is DOCUMENTED — that the vehicle is checked at handover
   and that every ride is digitally registered — and then points at the terms
   rather than stating a liability position we have not been given.

   TODO(client): confirm the damage procedure in your own words. What we have
   written is deliberately procedural and claims nothing about liability; if
   there is an agreed process ("meld het bij de chauffeur ter plaatse, wij maken
   een schaderapport op"), say so and we will state it plainly. Being specific
   here converts better than being careful.
   ══════════════════════════════════════════════════════════════════════════ */
const SCENARIOS: readonly FaqItem[] = [
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer:
      'Geen zorgen. Wij volgen de actuele vluchtinformatie en passen de ophaaltijd indien nodig aan. Bij een vertraging zorgen wij ervoor dat uw auto weer op het afgesproken moment beschikbaar is. Vergeet niet direct te bellen na uw landing op Schiphol, dan weten wij dat u er bent.',
  },
  {
    question: 'En als ik juist eerder land dan gepland?',
    answer:
      'Dat werkt precies zo. Omdat wij uw vlucht volgen, zien wij een vervroegde landing net zo goed als een vertraging, en passen wij de ophaaltijd daarop aan. Bel ons direct na de landing; dan staat uw auto klaar zodra u bij de vertrekhal bent.',
  },
  {
    question: 'Ik kom later terug dan ik had gereserveerd. Wat nu?',
    answer:
      'Neem contact met ons op zodra u weet dat u later terug bent. Uw auto blijft gewoon op onze parkeerlocatie staan; wij verlengen de reservering en de extra dagen worden aan uw reservering toegevoegd. Wijzigen kan telefonisch, per e-mail of zelf in het klantenportaal.',
  },
  {
    question: 'Wat als er schade aan mijn auto is?',
    answer:
      'Voordat wij uw auto overnemen voeren wij een korte controle van het voertuig uit, en iedere rit met uw auto wordt digitaal geregistreerd inclusief snelheid en route. Constateert u bij terugkomst toch iets, meld het dan direct bij de chauffeur die uw auto terugbrengt, zodat het ter plaatse kan worden vastgelegd. Wat er verder geldt, staat in onze algemene voorwaarden.',
  },
];

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Waarom ons"
        title="Uw auto in vertrouwde handen op Schiphol"
        lead="Uw auto is bij ons in vertrouwde handen. Met veilig parkeren Schiphol kiest u voor een zorgeloze start van uw reis. Onze medewerkers zorgen zorgvuldig voor uw auto, terwijl u met een gerust gevoel op reis kunt."
        photo="crewTerminal"
        photoAlt="veilig parkeren Schiphol"
        objectPosition="object-[center_38%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer nu
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="#wat-als" variant="outline" size="lg">
          Wat als er iets misgaat?
        </Button>
      </PageHero>

      {/* ══════════ THE PROCESS ══════════ */}
      <Section spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Van reservering tot terugkomst</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Wat er met uw auto gebeurt
              </h2>
            </div>
            <p className="text-muted max-w-[36ch] lg:pb-2 lg:text-right">
              Vier stappen, en bij elke stap wat er op dat moment met het voertuig zelf gebeurt.
            </p>
          </Reveal>

          <ol className="mt-14 lg:mt-20">
            {PROCESS.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 60}
                className="border-line grid gap-x-8 gap-y-4 border-t py-9 lg:grid-cols-[auto_5fr_6fr] lg:gap-x-12 lg:py-11"
              >
                {/* The numeral is decorative — the order is already carried by
                    the list and by the "Stap n:" in the heading. */}
                <p aria-hidden className="ghost-numeral text-numeral text-5xl lg:text-6xl">
                  {String(index + 1).padStart(2, '0')}
                </p>

                <div>
                  <h3 className="text-display-sm text-heading">
                    <span className="sr-only">Stap {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-muted mt-4 max-w-[44ch] leading-relaxed">{step.body}</p>
                </div>

                {/* The car column. Set apart with a rule and the accent label,
                    because it is the reason this page exists — the homepage
                    already says the four steps are easy. */}
                <div className="border-line lg:border-l lg:pl-12">
                  {/* text-brand, not text-accent. valet-600 at 12px on the canvas is
                      2.99:1 — it fails AA, and it was failing before this pass
                      too; the ramp's own note in globals.css restricts it to
                      >=24px display text, icons and non-text borders. navy-600
                      is 6.29:1 here. */}
                  <p className="eyebrow text-brand">Uw auto</p>
                  <p className="text-body mt-3 max-w-[44ch] leading-relaxed">{step.car}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ══════════ SECURITY & INSURANCE ══════════ */}
      {/* Was navy. Lightened with the rest of the site — client, August 2026:
          "nergens donker". The section keeps its weight through width and
          through the six measures it lists, not through its background.
          Contrast on surface: navy-950 headings 16.90:1, ink-700 body 9.58:1,
          ink-500 supporting 5.48:1. */}
      <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Beveiliging</Eyebrow>
              <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Zes maatregelen, geen van alle vrijblijvend
              </h2>
              <p className="text-body mt-6 max-w-[42ch] leading-relaxed">
                Dit is wat er concreet geregeld is rond uw voertuig — niet als geruststelling, maar
                als opsomming van wat er staat, draait en wordt vastgelegd.
              </p>
            </Reveal>

            <Stagger as="ul" className="divide-line border-line divide-y border-y">
              {MEASURES.map((measure) => (
                <div key={measure.title} className="flex items-start gap-5 py-6">
                  <measure.icon
                    className="text-accent mt-0.5 size-6 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold">{measure.title}</h3>
                    <p className="text-muted mt-2 max-w-[52ch] text-sm leading-relaxed">
                      {measure.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>

          {/*
            ── INSURANCE: A DELIBERATE GAP ────────────────────────────────────
            TODO(client): THIS IS THE SINGLE MOST IMPORTANT THING STILL MISSING
            FROM THIS PAGE.

            We need, in your words:
              · which insurance covers a customer's car while it is with you,
                and what it covers
              · the insurer and the policy type, if you are willing to name them
              · any certification, keurmerk or branch membership you hold
                (e.g. Q-Park/BOVAG-style schemes, ISO, a parking trade body)

            Nothing is written here in the meantime, because insurance is the
            one subject on this page where a plausible-sounding sentence is a
            liability rather than a gap. What is below points at the terms and
            asserts nothing beyond their existence.

            When you send the specifics, this becomes the strongest block on the
            page: "verzekerd tot € X via Y" answers the question the reader is
            actually asking, and no competitor on this keyword states it.
          */}
          <Reveal className="border-line mt-16 border-t pt-10">
            <h3 className="text-heading text-lg font-semibold">Verzekering en aansprakelijkheid</h3>
            <p className="text-body mt-4 max-w-[68ch] leading-relaxed">
              Wat er precies geldt terwijl uw auto bij ons staat — waarvoor wij aansprakelijk zijn
              en onder welke voorwaarden — is vastgelegd in onze algemene voorwaarden. Heeft u hier
              vooraf een concrete vraag over, bel ons dan even; wij beantwoorden die liever
              persoonlijk dan met een algemene zin op een website.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={termsUrl} variant="outline">
                Lees de algemene voorwaarden
              </Button>
              <Button href="/contact/" variant="outline">
                Stel uw vraag
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ THE TEAM AND THE CARS ══════════ */}
      <Section tone="surface" spacing="lg" aria-labelledby="team-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Het team en de auto&#39;s</Eyebrow>
            <h2 id="team-heading" className="text-display-lg mt-5">
              Dit zijn wij, en dit is waar uw auto staat
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Geen stockfoto&#39;s van een parkeergarage in een ander land. Dit zijn onze eigen
              mensen, ons eigen busje en ons eigen terrein, gefotografeerd bij Vertrek 2 op
              Schiphol.
            </p>
          </Reveal>

          {/* A masonry-ish grid rather than four equal thumbnails: two portrait
              frames and two landscape, so the block reads as a set of
              photographs rather than as a gallery widget. */}
          <Stagger
            as="ul"
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
          >
            {GALLERY.map((item, index) => (
              <figure key={item.photo} className={index % 2 === 1 ? 'lg:mt-12' : undefined}>
                <div className={`shadow-photo relative overflow-hidden rounded-xl ${item.aspect}`}>
                  <Photo
                    name={item.photo}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="object-cover object-center"
                  />
                </div>
                <figcaption className="text-muted mt-4 text-sm leading-relaxed">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ══════════ WHAT HAPPENS IF… ══════════ */}
      <Section id="wat-als" spacing="lg" aria-labelledby="wat-als-heading" className="scroll-mt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Als het anders loopt</Eyebrow>
              <h2 id="wat-als-heading" className="text-display-lg mt-5 max-w-[14ch]">
                Wat gebeurt er als…
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Reizen loopt zelden precies volgens plan. Dit zijn de vier situaties waar reizigers
                ons het vaakst naar vragen, en wat er in elk van die gevallen gebeurt.
              </p>

              <div className="border-line mt-10 border-t pt-8">
                <p className="text-heading text-base font-semibold">Zit uw situatie er niet bij?</p>
                <p className="text-muted mt-2 max-w-[36ch] text-sm leading-relaxed">
                  Bel ons. Bij iets rond een lopende reis is dat altijd sneller dan mailen.
                </p>
                <a
                  href={siteConfig.phone.href}
                  className="text-heading hover:text-brand ease-settle mt-3 inline-flex min-h-11 items-center gap-3 font-medium transition-colors duration-(--duration-micro)"
                >
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <Accordion items={SCENARIOS} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <ClosingCta
        heading="Uw auto in vertrouwde handen"
        lead="De keuze van reizigers die vanaf Schiphol vertrekken. Reserveer in twee minuten."
        photo="terminalDeparture"
        photoAlt="veilige parkeerlocatie bij Schiphol"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* Emitted from the same array the accordion renders. These four answers
          exist nowhere else on the site, so this is a genuinely new rich-result
          surface rather than a duplicate of the homepage FAQ. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(SCENARIOS)) }}
      />
    </>
  );
}
