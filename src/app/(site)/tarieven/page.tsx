import {
  ArrowRight,
  BatteryCharging,
  CalendarRange,
  Check,
  CloudRain,
  Layers,
  ShieldCheck,
  Sun,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
// import { AccountDiscountBar } from '@/components/sections/AccountDiscountBar';
import { ParkingProFrame } from '@/components/booking/ParkingProFrame';
import { PARKINGPRO_DEFAULT_HEIGHTS, ratesUrl } from '@/lib/parkingpro';

export const metadata = createMetadata('rates');

const CRUMBS = [{ name: 'Tarieven', path: '/tarieven/' }];

/**
 * /tarieven/
 *
 * The rates themselves come from MyParking.pro. We do not restate them anywhere
 * on this page, and that is a deliberate refusal rather than a gap: a duration
 * band or a "vanaf" price typed into our own markup is a number that goes stale
 * the first time the client changes a tariff, and the visitor finds out by being
 * quoted something different at checkout. The calculator is the price.
 *
 * What this page adds around it is everything the calculator cannot say:
 *
 *   - that the figure it shows is inclusive of VAT and of the shuttle
 *   - what the paid options actually are (€35 for charging — a real figure, from
 *     the client's own copy, and the only place it appears. The cancellation
 *     cover is the second option and deliberately carries NO figure, because he
 *     does not publish one; his copy says the price is shown during booking.)
 *     "Keep keys" (€15) used to sit beside these and was withdrawn by the client
 *     on 2 Aug 2026; keeping keys on the shuttle service is not sold here.
 *   - what the price actually depends on
 *   - that a free account takes 10% off it
 *
 * The last of those is the point of the page. See AccountDiscountBar.
 *
 * The live page's H1 was "Kosten Lang Parkeren Schiphol | Bekijk Onze Tarieven" —
 * a <title> written into a heading, pipe and all. The <title> keeps that string
 * verbatim because it is indexed; the H1 is the client's own, from his August
 * 2026 copy.
 *
 * ── August 2026: four sections are new ──────────────────────────────────────
 * His rates document specifies, in this order: the calculator, a valet-vs-shuttle
 * comparison with an "inbegrepen" list per service, an outdoor-vs-covered block,
 * the paid options, a "what determines the price" block, and eight FAQ answers
 * against the three that were here. Everything below follows that order. Nothing
 * invents a price.
 */

/* ══════════════════════════════════════════════════════════════════════════
   WHAT EACH SERVICE'S PRICE INCLUDES
   New. His document's second section, and the one that answers the question
   the calculator provokes: the two services quote different numbers and the
   page never said what the difference buys.

   No prices here, deliberately — only what is in the box. The figures stay in
   the calculator.
   ══════════════════════════════════════════════════════════════════════════ */
const SERVICE_PRICING: readonly {
  name: string;
  paragraphs: readonly string[];
  included: readonly string[];
  cta: string;
  href: string;
}[] = [
  {
    name: 'Shuttle parkeren',
    paragraphs: [
      'U rijdt zelf naar onze parkeerlocatie in Schiphol-Rijk en parkeert uw auto op de aangewezen parkeerplaats.',
      'Uw autosleutels neemt u mee op reis. Onze shuttlebus brengt u vervolgens in ongeveer 5 tot 8 minuten naar de vertrekhal van Schiphol en haalt u na uw reis weer op.',
    ],
    included: [
      'Parkeerplaats tijdens uw volledige parkeerperiode',
      'Gratis shuttle naar Schiphol',
      'Gratis shuttle terug naar de parkeerlocatie',
      '24/7 camerabewaking',
      'Autosleutels mee op reis',
    ],
    cta: 'Bekijk tarieven shuttle parkeren',
    // ⚠ AMBIGUOUS IN THE DOCUMENT. His label is "Bekijk tarieven shuttle
    // parkeren" on the page that IS the rates page, so it cannot mean "go to
    // /tarieven/". It points at the booking flow narrowed to this service,
    // which is where a real figure for it appears — the same destination the
    // homepage's service cards use.
    // TODO(client): if you meant these to link to the shuttle and valet
    // information pages instead, say so and we will swap them.
    href: '/reservering/?service=shuttle',
  },
  {
    name: 'Valet parking',
    paragraphs: [
      'Wilt u zo comfortabel mogelijk aan uw reis beginnen? Kies dan voor valet parking.',
      'U rijdt rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur neemt uw auto daar van u over en rijdt deze naar onze bewaakte parkeerlocatie.',
      'Na uw reis brengen wij uw auto weer terug naar Schiphol.',
    ],
    included: [
      'Overdracht direct bij de vertrekhal',
      'Parkeren tijdens uw volledige parkeerperiode',
      'Heen- en terugrit van uw auto',
      'Digitale registratie van iedere valetrit',
      '24/7 bewaakte parkeerlocatie',
      'Uw autosleutel veilig opgeborgen',
    ],
    cta: 'Bekijk tarieven valet parking',
    href: '/reservering/?service=valet',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   OUTDOOR OR COVERED
   New. The half of the product range this page never mentioned, even though
   the covered rate is a separate rate — see the longer note on the same
   subject in ServiceChooser, which explains why neither is framed as the
   premium option.
   ══════════════════════════════════════════════════════════════════════════ */
const COVER: readonly { icon: LucideIcon; title: string; paragraphs: readonly string[] }[] = [
  {
    icon: Sun,
    title: 'Buiten parkeren',
    paragraphs: [
      'Uw auto staat tijdens uw reis op onze afgesloten en bewaakte parkeerlocatie.',
      'Dit is doorgaans de voordeligste keuze voor lang parkeren bij Schiphol.',
    ],
  },
  {
    icon: Warehouse,
    title: 'Overdekt parkeren',
    paragraphs: [
      'Wilt u uw auto tijdens uw reis liever beschermd tegen regen, hagel en andere weersomstandigheden parkeren?',
      'Kies dan tijdens het reserveren voor overdekt parkeren. Het aantal overdekte parkeerplaatsen is beperkt en het tarief wordt automatisch weergegeven in de reserveringsmodule.',
    ],
  },
];

/**
 * The paid options. Two now, not one.
 *
 * `price` is optional, and the cancellation cover deliberately has none: his copy
 * says the figure is shown during booking and never states it, so neither does
 * this page. A "vanaf" or an invented number here is exactly what the note at the
 * top of this file refuses.
 */
const OPTIONS: readonly {
  icon: LucideIcon;
  name: string;
  price?: string;
  paragraphs: readonly string[];
}[] = [
  {
    icon: BatteryCharging,
    name: 'Elektrische auto opladen',
    price: '€ 35,00',
    paragraphs: [
      'Rijdt u elektrisch? Voeg dan tijdens het reserveren de optie Opladen toe.',
      'Wij laden uw elektrische auto tijdens uw parkeerperiode op, zodat u na uw reis weer met een opgeladen accu kunt vertrekken.',
    ],
  },
  {
    icon: ShieldCheck,
    name: 'Annuleringsdekking',
    paragraphs: [
      'Reisplannen kunnen veranderen. Daarom kunt u tijdens het reserveren kiezen voor een optionele annuleringsdekking.',
      'Met deze dekking kunt u uw reservering tot 24 uur voor de geplande aankomst annuleren.',
      'De actuele prijs van de annuleringsdekking wordt tijdens het reserveren weergegeven voordat u betaalt.',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   WHAT DETERMINES THE PRICE
   New. Four factors, and the reason this block is worth its space: the page
   refuses to publish a rate table, so it owes the reader an explanation of
   what the calculator is actually calculating.
   ══════════════════════════════════════════════════════════════════════════ */
const FACTORS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: CalendarRange,
    title: 'Uw parkeerperiode',
    body: 'Het aantal dagen dat uw auto bij ons geparkeerd staat, heeft invloed op de totale prijs.',
  },
  {
    icon: Layers,
    title: 'Valet of shuttle parkeren',
    body: 'U kiest zelf tussen onze valet- en shuttleservice. De actuele prijs van beide opties ziet u direct in de reserveringsmodule.',
  },
  {
    icon: CloudRain,
    title: 'Buiten of overdekt parkeren',
    body: 'Buiten parkeren is doorgaans de voordeligste optie. Voor overdekt parkeren geldt een ander tarief.',
  },
  {
    icon: Check,
    title: 'Extra opties',
    body: 'Kiest u bijvoorbeeld voor het opladen van uw elektrische auto of een annuleringsdekking? Dan worden deze kosten duidelijk weergegeven voordat u uw reservering afrondt.',
  },
];

/** His eight, August 2026, against the three that were here. */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Hoe worden de tarieven voor lang parkeren bij Schiphol berekend?',
    answer: [
      'De prijs wordt automatisch berekend aan de hand van uw parkeerperiode, gekozen parkeerservice en eventuele aanvullende opties.',
      'Vul uw aankomst- en retourdatum in onze reserveringsmodule in om direct uw actuele prijs te bekijken.',
    ],
  },
  {
    question: 'Is de shuttle naar Schiphol bij de prijs inbegrepen?',
    answer: [
      'Ja.',
      'Wanneer u kiest voor shuttle parkeren, zijn zowel de transfer naar Schiphol als de transfer terug naar onze parkeerlocatie bij uw parkeertarief inbegrepen.',
      'U betaalt hiervoor dus niet apart.',
    ],
  },
  {
    // ── NOTE THE REFUSAL, AND KEEP IT ────────────────────────────────────────
    // The question is "is valet more expensive", and his answer does not say
    // yes. It says the price depends on the period and availability and sends
    // the reader to the module. That is correct and it matters: the client's own
    // live rate list has valet-covered cheaper than valet-outdoor by €179, so
    // "valet kost meer" is false for part of the range. See the longer note on
    // COVER_OPTIONS in ServiceChooser.
    question: 'Is valet parking duurder dan shuttle parkeren?',
    answer: [
      'De actuele prijs is afhankelijk van uw parkeerperiode en beschikbaarheid.',
      'Valet parking biedt meer gemak: u rijdt rechtstreeks naar de vertrekhal en onze chauffeur parkeert uw auto voor u.',
      'Bij shuttle parkeren rijdt u zelf naar onze parkeerlocatie en brengen wij u met onze shuttlebus naar Schiphol.',
      'Bekijk in de reserveringsmodule de actuele prijs voor beide parkeerservices.',
    ],
  },
  {
    question: 'Zijn de tarieven inclusief btw?',
    answer: 'Ja. Alle prijzen die tijdens het reserveren worden weergegeven zijn inclusief btw.',
  },
  {
    question: 'Zijn er verborgen kosten?',
    answer: [
      'De totale prijs van uw reservering wordt weergegeven voordat u betaalt.',
      'Eventuele aanvullende opties die u zelf selecteert, zoals elektrisch opladen of een annuleringsdekking, worden apart weergegeven voordat u de reservering afrondt.',
    ],
  },
  {
    question: 'Kan ik mijn elektrische auto laten opladen?',
    answer: [
      'Ja.',
      'Voor € 35,00 kunt u tijdens het reserveren de optie Opladen toevoegen.',
      'Wij laden uw elektrische auto tijdens uw parkeerperiode op, zodat u na uw reis weer met een opgeladen accu kunt vertrekken.',
    ],
  },
  {
    question: 'Kan ik mijn reservering annuleren?',
    answer: [
      'Wanneer u tijdens het reserveren kiest voor onze optionele annuleringsdekking, kunt u uw reservering tot 24 uur voor de geplande aankomst annuleren.',
      'De actuele prijs en voorwaarden van deze optie worden tijdens het reserveren weergegeven.',
    ],
  },
  {
    question: 'Wanneer kan ik het beste reserveren?',
    answer: [
      'Wij adviseren om uw parkeerplaats zo vroeg mogelijk te reserveren.',
      'De beschikbaarheid en tarieven kunnen per periode verschillen. Vooral tijdens vakanties en drukke reisperiodes is het verstandig om uw parkeerplaats op tijd vast te leggen.',
    ],
  },
];

export default function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarieven"
        title="Tarieven lang parkeren bij Schiphol"
        subhead="Bereken direct uw parkeertarief"
        lead={[
          'Wilt u weten wat parkeren bij Schiphol tijdens uw reis kost? Vul uw aankomst- en retourdatum in en bekijk direct de actuele tarieven voor valet- en shuttle parkeren bij Schiphol.',
          'De prijs wordt automatisch berekend op basis van uw parkeerperiode, gekozen parkeerservice en eventuele extra opties.',
        ]}
        photo="lotShuttle"
        objectPosition="object-[center_45%]"
        crumbs={CRUMBS}
      >
        {/* His hero CTA. An in-page anchor rather than a route: the thing it
            promises is the calculator two sections down, and sending the visitor
            to /reservering/ to "bereken uw prijs" would skip the page they just
            landed on. */}
        <Button href="#bereken" size="lg">
          Bereken uw prijs
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
      </PageHero>

      {/* ---------- The calculator ---------- */}
      <Section
        id="bereken"
        spacing="lg"
        aria-labelledby="calculator-heading"
        className="scroll-mt-28"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Bereken uw parkeerprijs</Eyebrow>
              <h2 id="calculator-heading" className="text-display-md mt-5 max-w-[16ch]">
                Direct uw actuele tarief bekijken
              </h2>
              <p className="text-muted mt-6 max-w-[42ch] leading-relaxed">
                Vul hieronder uw aankomst- en retourdatum in en kies de parkeerservice die bij u
                past.
              </p>
              <p className="text-muted mt-4 max-w-[42ch] leading-relaxed">
                U ziet direct wat uw reservering kost. Alle weergegeven prijzen zijn inclusief btw.
                Kiest u voor shuttle parkeren? Dan is de transfer van onze parkeerlocatie naar
                Schiphol én de transfer terug bij de prijs inbegrepen.
              </p>

              {/* His six standing facts about the number in the frame beside it,
                  against the three that were here. "Geen reserveringskosten" is
                  new to the site and is his claim; it agrees with the "verborgen
                  kosten" answer in the FAQ below. */}
              <ul className="divide-line border-line mt-9 divide-y border-y text-sm">
                {[
                  'Alle prijzen inclusief btw',
                  'Geen reserveringskosten',
                  'Shuttle van en naar Schiphol inbegrepen bij shuttle parkeren',
                  'Keuze uit valet en shuttle parkeren',
                  'Buiten en overdekt parkeren mogelijk',
                  'Optionele annuleringsdekking beschikbaar',
                ].map((item) => (
                  <li key={item} className="text-body py-3.5">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              {/* The rates table — [pp_parking_rates_iframe] on the old site,
                  /parkingrates here. This is the ONE page where that path is
                  correct; /reservering/ was accidentally showing it too, which
                  is what this pass fixes.

                  His document adds a fallback line ("Lukt het niet om de
                  calculator te laden? Open de tarievencalculator in een nieuw
                  tabblad."). It is not passed as new copy because the component
                  already renders exactly that affordance from `fallbackLabel` —
                  see ParkingProFrame. */}
              <ParkingProFrame
                src={ratesUrl()}
                title="Tarieven berekenen voor parkeren bij Schiphol"
                label="Tarieven berekenen"
                fallbackLabel="de tarievencalculator"
                notch="canvas"
                // The tallest of the four plugin defaults — a full rate table
                // runs to 30 days.
                initialHeight={PARKINGPRO_DEFAULT_HEIGHTS.rates}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- The 10% account offer ----------
          Directly under the calculator, which is the one moment on the whole
          site where a visitor is looking at a price and has not yet committed
          to it. This offer has existed in writing for as long as the portal
          has, on a page nothing links to. */}
      {/* <AccountDiscountBar /> */}

      {/* ---------- What each service's price includes ----------
          NEW, August 2026. Two columns split by a hairline rather than two
          cards: they are two versions of one product, which is the same
          reasoning the service chooser's outdoor/covered pair uses. */}
      <Section tone="surface" spacing="lg" aria-labelledby="services-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Valet of shuttle parkeren?</Eyebrow>
            <h2 id="services-heading" className="text-display-lg mt-5">
              Kies de parkeerservice die bij u past
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              De prijs van uw parkeerplaats is onder andere afhankelijk van de gekozen
              parkeerservice.
            </p>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {SERVICE_PRICING.map((service, index) => (
              <Reveal
                key={service.name}
                delay={index * 80}
                className={index === 0 ? 'py-10 lg:pr-14' : 'py-10 lg:pl-14'}
              >
                <h3 className="text-display-sm text-heading">{service.name}</h3>

                <div className="mt-5 flex flex-col gap-4">
                  {service.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted max-w-[46ch] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <p className="text-heading mt-8 text-base font-semibold">
                  Bij de prijs inbegrepen:
                </p>
                <ul className="divide-line border-line mt-4 divide-y border-y">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-3.5 py-3">
                      <Check
                        className="text-accent mt-1 size-4 shrink-0"
                        strokeWidth={3}
                        aria-hidden
                      />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button href={service.href} variant="outline" className="mt-7">
                  {service.cta}
                  <ArrowRight data-arrow className="size-4" aria-hidden />
                </Button>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Outdoor or covered ----------
          NEW, August 2026. */}
      <Section spacing="md" aria-labelledby="overdekt-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Buiten of overdekt parkeren</Eyebrow>
            <h2 id="overdekt-heading" className="text-display-md mt-5">
              Kies zelf waar uw auto wordt geparkeerd
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Bij zowel valet als shuttle parkeren kunt u, afhankelijk van de beschikbaarheid,
              kiezen tussen buiten en overdekt parkeren.
            </p>
          </Reveal>

          {/* Children are <div>, not <li>: <Stagger as="ul"> wraps each child in
              its own <li> already, so an <li> here nests one inside another —
              invalid markup and a hydration mismatch. */}
          <Stagger as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {COVER.map((option) => (
              <div
                key={option.title}
                className="border-line bg-surface flex h-full flex-col rounded-xl border px-6 py-7"
              >
                <option.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
                <h3 className="text-heading mt-4 text-lg font-semibold">{option.title}</h3>
                <div className="mt-3 flex flex-col gap-3">
                  {option.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- Paid options ----------
          The only hard price we publish is the €35, because it is fixed and the
          client wrote it down himself. Set in the mono face with tabular
          figures, the way the ticket stub and the trust board set a number.
          The second option carries no figure at all — see OPTIONS. */}
      <Section tone="surface" spacing="md" aria-labelledby="opties-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Extra opties</Eyebrow>
            <h2 id="opties-heading" className="text-display-md mt-5">
              Stel uw reservering samen zoals u dat wilt
            </h2>
            <p className="text-muted mt-5 leading-relaxed">
              Tijdens het reserveren kunt u, indien beschikbaar, aanvullende opties aan uw
              parkeerreservering toevoegen.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-12 grid gap-px sm:grid-cols-2">
            {OPTIONS.map((option) => (
              <div
                key={option.name}
                className="border-line flex h-full flex-col border-t pt-6 sm:not-first:border-l sm:not-first:pt-6 sm:not-first:pl-10"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-heading text-lg font-semibold">{option.name}</h3>
                  {option.price ? (
                    <p className="numeric text-heading text-xl font-semibold whitespace-nowrap">
                      {option.price}
                    </p>
                  ) : null}
                </div>
                <div className="mt-4 flex items-start gap-3.5">
                  <option.icon
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div className="flex flex-col gap-3">
                    {option.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-muted max-w-[38ch] text-sm leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- What determines the price ----------
          NEW, August 2026. */}
      <Section spacing="md" aria-labelledby="factoren-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Wat bepaalt de prijs van parkeren bij Schiphol?</Eyebrow>
              <h2 id="factoren-heading" className="text-display-md mt-5 max-w-[16ch]">
                Uw tarief wordt automatisch berekend
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                De prijs van uw parkeerreservering is afhankelijk van verschillende factoren.
              </p>
            </Reveal>

            <div>
              <Stagger as="ul" className="divide-line border-line divide-y border-y">
                {FACTORS.map((factor) => (
                  <div key={factor.title} className="flex items-start gap-5 py-6">
                    <factor.icon
                      className="text-accent mt-0.5 size-6 shrink-0"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-heading text-base font-semibold">{factor.title}</h3>
                      <p className="text-muted mt-2 max-w-[52ch] text-sm leading-relaxed">
                        {factor.body}
                      </p>
                    </div>
                  </div>
                ))}
              </Stagger>

              {/* His closing line for this block, set in bold in the document.
                  Given weight here as a standalone statement rather than as a
                  fifth row, because it is the promise the four factors add up
                  to. */}
              <Reveal>
                <p className="text-heading mt-8 text-base font-semibold">
                  U ziet vóór het betalen altijd de totale prijs van uw reservering.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- FAQ ----------
          Left on the canvas rather than given `tone="surface"`. With four new
          sections the band tones now run canvas → surface → canvas → surface →
          canvas → here, and <ClosingCta> below is always surface: a surface FAQ
          would put two surface bands together and its perforated seam would
          punch surface holes in a surface background, i.e. vanish. Canvas here
          means the factoren band above and this one read as one continuous
          canvas — no seam to draw — and the CTA's tear lands on the tone it
          expects. */}
      <Section spacing="lg" aria-labelledby="tarieven-faq-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Over de tarieven</Eyebrow>
              <h2 id="tarieven-faq-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Veelgestelde vragen over onze parkeertarieven
              </h2>
              {/* Was "Drie vragen over hoe het tarief tot stand komt…" — there
                  are eight now, so the sentence had to go regardless. This is
                  his H2 for the section. */}
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Duidelijkheid over de kosten.
              </p>
              <Button href="/waarom-lang-parkeren-schiphol/" variant="link" className="mt-7">
                Alle vragen over onze service
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
            </Reveal>

            <Reveal delay={80}>
              <Accordion items={FAQS} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <ClosingCta
        heading="Bereken direct wat uw parkeerplaats kost"
        subhead="Bekijk uw actuele tarief voor parkeren bij Schiphol"
        lead={[
          'Geen ingewikkelde prijstabellen of tarieven die niet bij uw reisperiode passen.',
          'Vul uw aankomst- en retourdatum in en vergelijk direct de beschikbare opties voor valet- en shuttle parkeren bij Schiphol.',
          'U ziet vooraf wat uw reservering kost en kunt vervolgens direct online reserveren.',
        ]}
        reassurances={[
          'Alle tarieven inclusief btw',
          'Shuttletransfer inbegrepen bij shuttle parkeren',
          'Keuze uit valet en shuttle parkeren',
          'Buiten en overdekt parkeren mogelijk',
          '24/7 bewaakte parkeerlocatie',
          'Binnen 2 minuten online gereserveerd',
        ]}
        photo="terminalDeparture"
        // His label, and it calculates rather than books — so it points back at
        // the calculator on this page rather than into the booking flow.
        bookingHref="#bereken"
        bookingLabel="Bereken mijn parkeertarief"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* Rendered from the same array the accordion renders, so the markup can
          never describe an answer the page does not show — which is why pulling
          the keys answer out above also pulled it out of the rich result. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQS)) }}
      />
    </>
  );
}
