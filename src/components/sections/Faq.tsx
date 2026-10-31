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
 * The accordion and structured data share the same verified public answers.
 */

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat is het verschil tussen valet en shuttle parkeren?',
    answer:
      'Bij Shuttle parkeert u buiten aan de Schipholweg 181 in Badhoevedorp; de shuttle rijdt doorlopend naar Schiphol Plaza en de rit duurt ongeveer 8 minuten. Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3 en kiest u tussen buiten of overdekt parkeren.',
  },
  {
    question: 'Waar parkeer ik mijn auto?',
    answer:
      'Bij Shuttle parkeert u buiten op Schipholweg 181 in Badhoevedorp. Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3; de auto wordt volgens uw reservering buiten of overdekt geparkeerd.',
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
    question: 'Waar geef ik mijn auto af voor Valet?',
    answer:
      `Tussen Vertrekhal 2 en 3 op Schiphol. Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}. Bij terugkomst belt u direct na de landing en nogmaals zodra u uw ruimbagage heeft ontvangen.`,
  },
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer:
      `Bij Valet parkeren belt u direct na de landing op ${siteConfig.valetPhone.display}; met ruimbagage belt u opnieuw zodra u die heeft ontvangen. Bij Shuttle parkeren loopt u na aankomst naar de vaste shuttlehalte op Schiphol Plaza. U hoeft daarvoor niet te bellen.`,
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn voor mijn vlucht?',
    answer:
      `De Shuttle-transfertijd is ongeveer 8 minuten. Houd daarnaast rekening met de tijd voor parkeren, wachten en inchecken. Bij Valet belt u 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}.`,
  },
];

/** The homepage FAQ, rendered once at every breakpoint. */
export function Faq() {
  return (
    <FaqSection
      items={FAQS}
      heading="Alles over onze dienstverlening"
      lead="De beschikbare parkeerdiensten, locaties, prijzen en praktische instructies."
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
