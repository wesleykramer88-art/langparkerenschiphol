import { ArrowRight, BatteryCharging, type LucideIcon } from 'lucide-react';
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
 *   - what the paid option actually costs (€35 — a real figure, from the
 *     client's own FAQ copy, which is the only place it currently appears).
 *     "Keep keys" (€15) used to sit beside it and was withdrawn by the client
 *     on 2 Aug 2026; keeping keys on the shuttle service is not sold here.
 *   - that a free account takes 10% off it
 *
 * The last of those is the point of the page. See AccountDiscountBar.
 *
 * The live page's H1 is "Kosten Lang Parkeren Schiphol | Bekijk Onze Tarieven" —
 * a <title> written into a heading, pipe and all. The <title> keeps that string
 * verbatim because it is indexed; the H1 is written as a sentence, because the
 * pipe was never meant for the page.
 */

/** Verbatim from the live page. Real figures, and the only place they appear. */
const OPTIONS: readonly { icon: LucideIcon; name: string; price: string; body: string }[] = [
  {
    icon: BatteryCharging,
    name: 'Opladen',
    price: '€ 35,00',
    body: 'Wij laden uw elektrische auto op tijdens uw reis, zodat hij met een volle accu voor u klaarstaat als u terugkomt.',
  },
];

/** The FAQ answers, verbatim from the live page. */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Hoe worden de tarieven voor lang parkeren bij Schiphol berekend?',
    answer:
      'Onze parkeertarieven zijn volledig transparant en inclusief BTW. De prijs wordt berekend op basis van het exacte aantal dagen dat je parkeert en de service die je kiest. Je hebt hierbij de keuze uit voordelig buiten parkeren of comfortabel overdekt parkeren, beschikbaar voor zowel onze Shuttle- als Valet-service.',
  },
  {
    question: 'Is de shuttlebus gratis inbegrepen bij het parkeertarief?',
    answer:
      'Ja. Bij Shuttle Parking is de transfer van de parkeerlocatie naar Schiphol en terug inbegrepen voor maximaal 5 personen. Vanaf de 6e persoon geldt een toeslag van €10 per extra persoon per reservering. Voor Valet Parking geldt geen personentoeslag.',
  },
  {
    question: 'Wanneer betaal ik een nachttoeslag?',
    answer:
      'Voor een aankomst of terugkomst tussen 00:00 en 07:00 geldt een nachttoeslag van €15. Dit geldt voor zowel Shuttle Parking als Valet Parking. Vallen zowel uw aankomst als terugkomst binnen dit tijdvak, dan kan de totale nachttoeslag €30 bedragen.',
  },
  {
    question: 'Is het mogelijk om mijn elektrische auto op te laden tijdens het parkeren?',
    answer:
      "Ja, wij beschikken over laadfaciliteiten op ons terrein. Voor € 35,00 kun je de optie 'Opladen' aan je reservering toevoegen. Wij zorgen er dan voor dat je elektrische auto met een volle accu voor je klaarstaat zodra je weer terugkomt van je reis.",
  },
];

export default function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarieven"
        title="Kosten lang parkeren Schiphol"
        lead="Bekijk de actuele parkeren Schiphol kosten voor uw parkeerduur. U ziet direct de prijs voor valet- of shuttle parkeren en kunt uw plek eenvoudig online reserveren."
        photo="lotShuttle"
        objectPosition="object-[center_45%]"
        photoAlt="parkeren Schiphol kosten en parkeertarieven"
        crumbs={CRUMBS}
      />

      {/* ---------- The calculator ---------- */}
      <Section spacing="lg" aria-labelledby="calculator-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Bereken uw prijs</Eyebrow>
              <h2 id="calculator-heading" className="text-display-md mt-5 max-w-[16ch]">
                Uw exacte prijs, in één scherm
              </h2>
              <p className="text-muted mt-6 max-w-[42ch] leading-relaxed">
                Vul uw aankomst- en vertrekmoment in en kies de service. De prijs die u ziet is de
                prijs die u betaalt — inclusief BTW, en bij Shuttle Parking inclusief de rit van en
                naar de vertrekhal.
              </p>

              {/* Three standing facts about the number in the frame beside it.
                  Not decoration: "is the shuttle extra" and "is VAT included"
                  are the two questions this page gets asked most, and they are
                  answered before the reader has to open an accordion to find
                  out. */}
              <ul className="divide-line border-line mt-9 divide-y border-y text-sm">
                {[
                  'Alle prijzen inclusief BTW',
                  'Shuttlerit van en naar de vertrekhal inbegrepen',
                  'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
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
                  is what this pass fixes. */}
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

      {/* ---------- Toeslagen informatieblok ---------- */}
      <Section
        id="voorwaarden-en-toeslagen"
        tone="surface"
        spacing="md"
        aria-labelledby="toeslagen-heading"
        className="scroll-mt-28"
      >
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Toeslagen</Eyebrow>
            <h2 id="toeslagen-heading" className="text-display-md mt-5">
              Goed om te weten over toeslagen
            </h2>
          </Reveal>
          <div className="border-line mt-10 grid border-t sm:grid-cols-2">
            <div className="py-8 sm:pr-10">
              <h3 className="text-heading text-base font-semibold">
                Nachttoeslag – Shuttle en Valet
              </h3>
              <p className="text-muted mt-3 max-w-[38ch] text-sm leading-relaxed">
                Voor een aankomst of terugkomst tussen 00:00 en 07:00 geldt een nachttoeslag van
                €15. Dit geldt voor zowel Shuttle Parking als Valet Parking. Vallen zowel uw
                aankomst als terugkomst binnen dit tijdvak, dan kan de totale nachttoeslag €30
                bedragen.
              </p>
            </div>
            <div className="border-line py-8 sm:border-l sm:pl-10">
              <h3 className="text-heading text-base font-semibold">
                Aantal personen – uitsluitend Shuttle
              </h3>
              <p className="text-muted mt-3 max-w-[38ch] text-sm leading-relaxed">
                Bij Shuttle Parking is de transfer van en naar Schiphol inbegrepen voor maximaal 5
                personen. Vanaf de 6e persoon betaalt u €10 per extra persoon per reservering. Voor
                Valet Parking geldt geen personentoeslag.
              </p>
            </div>
          </div>
          <p className="text-muted mt-4 text-xs">Alle genoemde bedragen zijn inclusief btw.</p>
        </Container>
      </Section>

      {/* ---------- Paid options ----------
          The only hard price we publish, because it is fixed and the client
          wrote it down himself. Set in the mono face with tabular figures, the
          way the ticket stub and the trust board set a number. The grid stays
          two-column so the single card keeps its measure rather than stretching
          a 38ch paragraph across the container. */}
      <Section tone="surface" spacing="md" aria-labelledby="opties-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Opties</Eyebrow>
            <h2 id="opties-heading" className="text-display-md mt-5">
              Eén extra, met een vaste prijs
            </h2>
            <p className="text-muted mt-5 leading-relaxed">
              Aan te vinken tijdens het reserveren. Al het overige zit al in het tarief.
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
                  <p className="numeric text-heading text-xl font-semibold whitespace-nowrap">
                    {option.price}
                  </p>
                </div>
                <div className="mt-4 flex items-start gap-3.5">
                  <option.icon
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <p className="text-muted max-w-[38ch] text-sm leading-relaxed">{option.body}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section spacing="lg" aria-labelledby="tarieven-faq-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Over de tarieven</Eyebrow>
              <h2 id="tarieven-faq-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Wat zit er in de prijs?
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Vier vragen over hoe het tarief tot stand komt en welke toeslagen kunnen gelden.
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
        heading="Klaar om te reserveren?"
        lead="Bereken de exacte prijs in de boekingsmodule — inclusief alle gekozen opties."
        photo="terminalDeparture"
        photoAlt="parkeerprijzen Schiphol per dag bij Vertrek 2"
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
