import { Mail, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/motion/Reveal';
import { faqSchema, jsonLd, type FaqItem } from '@/lib/schema';
import { siteConfig } from '@/config/site';

/**
 * The FAQ, and the FAQPage markup for it.
 *
 * One source, two outputs: the accordion and the JSON-LD are rendered from the
 * same array, so the structured data can never describe an answer the page does
 * not actually show — which is the usual way an FAQ rich result gets penalised.
 * The live site has these seven answers written and claims none of them.
 *
 * Laid out in two columns rather than centred on a narrow measure. A centred
 * heading over a full-width accordion is the default shape of this section
 * everywhere; putting the heading in a sticky left column gives the answers
 * somewhere to be read against, and buys the space for the thing this section
 * actually needs — a way to reach a human when the list does not cover it.
 * Somebody scrolling an FAQ about their car is a few seconds from either
 * booking or leaving.
 *
 * Copy is verbatim, with one correction: the live site asks "Wat gebeurd er als
 * mijn vlucht vertraagd is" — a d/t error that is visible in the Google snippet.
 */

/**
 * The client's final seven, August 2026 — the same seven questions in the same
 * order, so this list is a rewording rather than a restructuring.
 *
 * Two changes are worth naming because they close notes that were open here:
 *   · The cancellation answer no longer ends "Daarvoor dient u uw eigen
 *     reisverzekering in te schakelen." That was ours, not his, and it advised
 *     the customer about a product we know nothing about. His version stops at
 *     what is true of ours.
 *   · The lastminute answer drops "voor reserveringen op korte termijn kunnen
 *     extra kosten in rekening worden gebracht" — a charge that appears nowhere
 *     in the client's rate list and which we could never source.
 */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat is het verschil tussen valet en shuttle parkeren?',
    answer: [
      'Bij valet parkeren rijdt u rechtstreeks naar de vertrekhal van Schiphol. Daar neemt onze chauffeur uw auto van u over en parkeert deze op onze parkeerlocatie.',
      'Bij shuttle parkeren rijdt u zelf naar onze parkeerlocatie in Schiphol-Rijk. U parkeert uw auto zelf en kunt uw autosleutels meenemen op reis. Onze shuttlebus brengt u vervolgens in ongeveer 5 tot 8 minuten naar de vertrekhal.',
    ],
  },
  {
    question: 'Hoe veilig staat mijn auto geparkeerd?',
    answer: [
      'Uw auto staat tijdens uw reis op een afgesloten en bewaakte parkeerlocatie met 24/7 camerabewaking.',
      'Bij valet parkeren wordt daarnaast iedere rit met uw auto digitaal geregistreerd, inclusief route en snelheid.',
    ],
  },
  {
    // His version keeps the thing that mattered about ours: the cover is named
    // as optional and priced before the reader is told what it buys.
    question: 'Kan ik mijn reservering annuleren?',
    answer: [
      'Ja. Wanneer u tijdens het reserveren kiest voor onze optionele annuleringsdekking, kunt u uw reservering tot 24 uur voor de geplande aankomst annuleren.',
      'De prijs van de annuleringsdekking wordt tijdens het reserveren weergegeven voordat u betaalt. Binnen 24 uur voor aankomst is annuleren niet meer mogelijk.',
    ],
  },
  {
    question: 'Hoe ver van tevoren moet ik reserveren?',
    answer: [
      'Wij adviseren om uw parkeerplaats zo vroeg mogelijk te reserveren. Zo heeft u de meeste keuze en profiteert u doorgaans van de beste beschikbaarheid.',
      'Lastminute reserveren is vaak ook mogelijk, zolang er nog parkeerplaatsen beschikbaar zijn.',
    ],
  },
  {
    question: 'Wat gebeurt er met mijn autosleutels?',
    answer: [
      'Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutels mee op reis.',
      'Bij valet parkeren hebben wij uw autosleutel nodig om uw auto te kunnen parkeren en weer terug te brengen. Na het parkeren wordt uw sleutel veilig opgeborgen in een brandwerende sleutelkluis op ons kantoor, dat eveneens voorzien is van camerabewaking.',
    ],
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer: [
      'Wij volgen de actuele vluchtinformatie en houden rekening met eventuele vertragingen of een eerdere landing.',
      'Bel ons na uw landing op Schiphol. Zo weten wij dat u bent aangekomen en kunnen we uw terugkomst verder afhandelen.',
    ],
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn?',
    answer: [
      'Bij shuttle parkeren adviseren wij om minimaal 3 uur voor vertrek van uw vlucht op onze parkeerlocatie aanwezig te zijn.',
      'Bij valet parkeren adviseren wij om minimaal 2,5 uur voor vertrek van uw vlucht bij Schiphol aanwezig te zijn.',
      'Zo heeft u voldoende tijd voor de overdracht, eventuele transfer en het inchecken.',
    ],
  },
];

/** The homepage FAQ. His seven, in his order. */
export function Faq() {
  return (
    <FaqSection
      items={FAQS}
      heading="Alles over parkeren bij Schiphol"
      lead="Heeft u een vraag over onze valet- of shuttleservice, veiligheid, annuleren of de overdracht van uw auto? Hieronder vindt u de antwoorden op de meestgestelde vragen."
    />
  );
}

/**
 * The FAQ section, for any page.
 *
 * Extracted from the homepage FAQ when the service and cluster pages needed the
 * same block with their own questions. Everything that made this section work is
 * in here — the sticky heading column, the two-column measure, the escape hatch
 * to a human, and the FAQPage markup — so a page supplies questions and gets all
 * of it. What it must NOT become is a section with a `variant` prop; if a future
 * page needs a different SHAPE of FAQ, it composes one from <Accordion>.
 *
 * The JSON-LD is rendered from the SAME array as the accordion, which is the
 * point: the structured data cannot describe an answer the page does not show,
 * and that is the usual way an FAQ rich result gets penalised.
 *
 * ⚠ `id="faq-heading"` is fixed rather than generated. That is safe because a
 * page has one FAQ section; two on one page would emit a duplicate id AND two
 * FAQPage nodes, and the second of those is the real problem.
 */
export function FaqSection({
  items,
  eyebrow = 'Veelgestelde vragen',
  heading,
  lead,
  /** Set false on a page that already emits FAQPage markup elsewhere. */
  schema = true,
}: {
  items: readonly FaqItem[];
  eyebrow?: string;
  heading: string;
  lead?: string;
  schema?: boolean;
}) {
  return (
    <Section spacing="lg" aria-labelledby="faq-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <h2 id="faq-heading" className="text-display-lg mt-5 max-w-[14ch]">
              {heading}
            </h2>
            {lead ? <p className="text-muted mt-6 max-w-[42ch]">{lead}</p> : null}

            {/* Not a card with a border: a hairline block, so it reads as part
                of the column rather than as a widget dropped into it. */}
            {/* His wording, and it is the same two sentences in the homepage,
                shuttle, valet and ritregistratie documents — so it is set here
                once rather than passed per page. Ours added "ook bij vertraging
                of een gewijzigde terugkomst", which is true but reads as a
                second answer in a block whose job is to hand over to a person. */}
            <div className="border-line mt-10 border-t pt-8">
              <p className="text-heading text-base font-semibold">Staat uw vraag er niet tussen?</p>
              <p className="text-muted mt-2 max-w-[38ch] text-sm leading-relaxed">
                Onze klantenservice helpt u graag persoonlijk verder.
              </p>

              {/* `min-h-11` on both: these are standalone contact actions, not
                  links inside a sentence, and on a phone they are among the
                  most-tapped things on the site. At their own line height they
                  were 20px targets. The gap comes off because the height now
                  provides the separation. */}
              <div className="mt-4 flex flex-col">
                <a
                  href={siteConfig.phone.href}
                  className="group text-heading hover:text-brand ease-settle inline-flex min-h-11 items-center gap-3 text-sm font-medium transition-colors duration-(--duration-micro)"
                >
                  <Phone className="text-accent size-4 shrink-0" aria-hidden />
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-heading hover:text-brand ease-settle inline-flex min-h-11 items-center gap-3 text-sm font-medium break-all transition-colors duration-(--duration-micro)"
                >
                  <Mail className="text-accent size-4 shrink-0" aria-hidden />
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Accordion items={items} defaultOpen={0} />
          </Reveal>
        </div>
      </Container>

      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(items)) }}
        />
      ) : null}
    </Section>
  );
}
