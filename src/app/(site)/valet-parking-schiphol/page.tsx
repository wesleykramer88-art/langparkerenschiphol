import { Phone } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
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
 * page states the confirmed handover and return instructions early and in detail.
 *
 * ── The address on this page is NOT the shuttle parking address ─────────────
 * Valet customers drive to the terminal, not to the shuttle parking location. A
 * valet customer who follows the footer address misses their flight. See the note on
 * `valetHandover` in config/site.ts — the two addresses are both correct and
 * are for different things.
 */

const STEPS: readonly TimelineStep[] = [
  {
    title: 'Reserveer vooraf.',
    body: 'U reserveert online en geeft uw vluchtgegevens door. Valet reserveert u minimaal een uur van tevoren.',
  },
  {
    title: 'Rijd naar de vertrekhal.',
    body: `Bel 30 minuten vóór aankomst op ${siteConfig.valetHandover.display}.`,
  },
  {
    title: 'Onze chauffeur wacht u op.',
    body: 'U geeft uw auto af op Schiphol, tussen Vertrekhal 2 en 3.',
  },
  {
    title: 'U kiest uw parkeerwijze.',
    body: 'Bij het reserveren kiest u voor buiten of overdekt parkeren.',
  },
  {
    title: 'Wij parkeren, u loopt door.',
    body: 'U kunt uw reis vervolgen; uw auto wordt volgens uw reservering buiten of overdekt geparkeerd.',
  },
  {
    title: 'Terug tussen Vertrekhal 2 en 3.',
    body: 'Bel direct na de landing. Heeft u ruimbagage, bel dan opnieuw zodra u uw bagage heeft ontvangen. Uw auto staat klaar tussen Vertrekhal 2 en 3.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Waar moet ik zijn voor valet parking?',
    answer: `Bij de ${siteConfig.valetHandover.display}. Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}.`,
  },
  {
    question: 'Hoe laat moet ik aanwezig zijn?',
    answer:
      `Bel 30 minuten vóór aankomst op Schiphol op ${siteConfig.valetPhone.display}.`,
  },
  {
    question: 'Waar krijg ik mijn auto terug?',
    answer: `${siteConfig.valetHandover.returnNote} Bel direct na de landing. Heeft u ruimbagage, bel dan opnieuw zodra u uw bagage heeft ontvangen. Bel ${siteConfig.valetPhone.display}.`,
  },
  {
    question: 'Wat als mijn vlucht vertraagd is?',
    answer: `Bel direct na de landing op ${siteConfig.valetPhone.display}. Heeft u ruimbagage, bel dan opnieuw zodra u uw bagage heeft ontvangen.`,
  },
];

export default async function ValetParkingPage() {
  const bounds = await fetchPickerBounds();

  return (
    <>
      <PageHero
        eyebrow="Valet Parking"
        title="Valet parkeren bij Schiphol"
        lead={`Bij Valet parkeren geeft u uw auto af bij de ${siteConfig.valetHandover.display}. Kies voor buiten of overdekt parkeren.`}
        photo="crewHandover"
        objectPosition="object-[center_40%]"
        crumbs={CRUMBS}
        aside={<BookingPicker notch="inverse" defaultService="valet" bounds={bounds} />}
      />

      <ServiceUsp service="valet" heading="Uitstappen bij de hal, de rest doen wij" />

      <ContentSection
        id="hoe-het-werkt"
        eyebrow="De overdracht"
        title="Wat er precies gebeurt bij de vertrekhal"
        paragraphs={[
          `Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display} en rijd naar de ${siteConfig.valetHandover.display}.`,
          'U draagt uw auto over tussen Vertrekhal 2 en 3 en kunt daarna uw reis vervolgen. Uw auto wordt buiten of overdekt geparkeerd, afhankelijk van uw reservering.',
          'Bij terugkomst belt u direct na de landing. Heeft u ruimbagage, bel dan opnieuw zodra u uw bagage heeft ontvangen. U krijgt uw auto terug tussen Vertrekhal 2 en 3.',
        ]}
        photo="crewTerminal"
        photoAlt="valet parking bij Schiphol vertrekhal"
        objectPosition="object-[center_30%]"
      >
        <div className="border-line mt-5 border-t pt-5">
          <p className="text-muted text-sm leading-relaxed">
            Bel 30 minuten vóór aankomst en bij terugkomst direct na de landing. Met ruimbagage belt u
            opnieuw zodra u de bagage heeft ontvangen.
          </p>
          <a
            href={siteConfig.valetPhone.href}
            className="text-heading hover:text-brand ease-settle mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors duration-(--duration-micro)"
          >
            <Phone className="text-accent size-4" aria-hidden />
            <span className="sr-only">Bel voor Valet: </span>
            <span className="numeric">{siteConfig.valetPhone.display}</span>
          </a>
        </div>
        <p className="text-muted mt-5 max-w-[52ch] text-sm leading-relaxed">
          Voor een aankomst of terugkomst tussen 00:00 en 07:00 geldt een nachttoeslag van €15.{' '}
          <a
            href="/tarieven/#voorwaarden-en-toeslagen"
            className="text-accent underline underline-offset-2 hover:text-accent-hover"
          >
            Bekijk de voorwaarden en toeslagen
          </a>
        </p>
      </ContentSection>

      {/* ---------- The process ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Zo werkt het</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Van reservering tot terugkomst
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
      <ContentSection
        id="verschil"
        eyebrow="Valet of shuttle"
        title="Buiten of overdekt parkeren met Valet"
        paragraphs={[
          'Bij Valet geeft u uw auto af op Schiphol, tussen Vertrekhal 2 en 3. U kiest bij het reserveren voor buiten of overdekt parkeren.',
          'Shuttle parkeren is de andere service: u parkeert buiten aan de Schipholweg 181 in Badhoevedorp en reist met de doorlopende shuttle naar Schiphol Plaza.',
        ]}
        bullets={[
          'Inleveren en ophalen tussen Vertrekhal 2 en 3',
          'Keuze tussen buiten en overdekt parkeren',
          'Bel 30 minuten vóór aankomst',
          'Bel direct na de landing en nogmaals na ontvangst van ruimbagage',
          `Valet-telefoon: ${siteConfig.valetPhone.display}`,
        ]}
        tone="canvas"
      >
        <Button href="/shuttle-parkeren-schiphol/" variant="link" className="mt-7">
          Vergelijk met shuttle parkeren
        </Button>
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen over valet parking"
        lead="Over de overdracht, uw sleutels, wie er in uw auto rijdt en wat er wordt vastgelegd."
      />

      <ClosingCta
        heading="Geef uw auto af bij de hal"
        lead="Reserveer valet parking en rijd op de dag zelf rechtstreeks naar de vertrekhal van Schiphol."
        photo="crewShuttleTerminal"
        photoAlt="auto afgeven valet parking Schiphol"
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
                'U geeft uw auto af tussen Vertrekhal 2 en 3. Valet parkeren is beschikbaar buiten en overdekt.',
              serviceType: 'Valet parking',
            }),
          ),
        }}
      />
    </>
  );
}
