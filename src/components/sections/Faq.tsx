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

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat is het verschil tussen valet en shuttle parkeren?',
    answer:
      'Bij valet parkeren rijdt u rechtstreeks naar de vertrekhal en parkeert onze chauffeur uw auto. Bij shuttle parkeren parkeert u uw eigen auto op onze locatie en brengt onze shuttlebus u binnen 5 tot 8 minuten naar de vertrekhal.',
  },
  {
    question: 'Hoe veilig is mijn auto geparkeerd?',
    answer:
      'Uw auto staat geparkeerd op een professioneel parkeerterrein dat 24 uur per dag wordt bewaakt en gemonitord. Alle ritten worden digitaal geregistreerd, zodat er altijd inzicht is in de verplaatsingen van uw voertuig. Zo kunt u met een gerust gevoel op reis, terwijl uw auto veilig achterblijft.',
  },
  {
    // Reworded away from the live site's "kosteloos annuleren", which asked the
    // reader whether cancelling is free and answered "ja" — while the cover
    // that makes it free is a paid option they have not bought yet. The answer
    // now states the cover is paid before it states what it buys.
    question: 'Kan ik mijn reservering annuleren?',
    answer:
      'Ja, met een annuleringsdekking annuleert u uw reservering tot 24 uur voor aankomst. De annuleringsdekking is een optionele, betaalde toevoeging die u tijdens het reserveren aan uw boeking toevoegt; de prijs ziet u voordat u afrekent. Binnen 24 uur voor uw reis is annuleren niet meer mogelijk. Daarvoor dient u uw eigen reisverzekering in te schakelen.',
  },
  {
    question: 'Hoe ver van tevoren moet ik een reservering maken?',
    answer:
      'Wij adviseren om uw parkeerplaats zo vroeg mogelijk te reserveren voor de beste beschikbaarheid en tarieven. Lastminute reserveringen zijn vaak ook mogelijk, mits er nog plaatsen beschikbaar zijn. Houd er rekening mee dat voor reserveringen op korte termijn extra kosten in rekening kunnen worden gebracht.',
  },
  {
    question: 'Worden mijn autosleutels veilig opgeborgen?',
    answer:
      'Ja, uw autosleutels worden met de grootste zorg behandeld. Bij onze shuttle service kunt u ervoor kiezen om uw autosleutels zelf mee op reis te nemen. Maakt u gebruik van valet parking, dan worden uw sleutels veilig opgeborgen in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking.',
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer:
      'Geen zorgen. Wij volgen de actuele vluchtinformatie en passen de ophaaltijd indien nodig aan. Bij een vertraging of vervroegde landing zorgen wij ervoor dat uw auto weer op het afgesproken moment beschikbaar is. Vergeet niet direct te bellen na uw landing op Schiphol.',
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn voor mijn vlucht?',
    answer:
      'Wij adviseren om bij shuttle parkeren minimaal 3 uur voor vertrek aanwezig te zijn. Bij valet parkeren adviseren wij minimaal 2,5 uur voor vertrek aanwezig te zijn. Zo heeft u voldoende tijd voor de overdracht en het inchecken op Schiphol.',
  },
];

const MOBILE_FAQS: readonly FaqItem[] = [FAQS[0], FAQS[1], FAQS[2], FAQS[5]];

/** The homepage FAQ. Its seven answers stay exactly where they were. */
export function Faq() {
  return (
    <>
      <Section spacing="none" aria-labelledby="faq-heading-mobile" className="py-14 md:hidden">
        <Container>
          <Reveal>
            <Eyebrow rule>Veelgestelde vragen</Eyebrow>
            <h2 id="faq-heading-mobile" className="text-display-md mt-4 max-w-[12ch]">
              De belangrijkste vragen, direct beantwoord
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <Accordion items={MOBILE_FAQS} defaultOpen={null} />
          </Reveal>
        </Container>
      </Section>

      <div className="hidden md:block">
        <FaqSection
          items={FAQS}
          heading="Alles over onze dienstverlening"
          lead="De vragen die reizigers ons het vaakst stellen, over veiligheid, annuleren en de overdracht van uw auto."
        />
      </div>
    </>
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
            <div className="border-line mt-10 border-t pt-8">
              <p className="text-heading text-base font-semibold">Staat uw vraag er niet bij?</p>
              <p className="text-muted mt-2 max-w-[38ch] text-sm leading-relaxed">
                Onze klantenservice helpt u persoonlijk verder — ook bij vertraging of een
                gewijzigde terugkomst.
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
