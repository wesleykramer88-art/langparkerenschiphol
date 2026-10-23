import { ArrowRight } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { FaqSection } from '@/components/sections/Faq';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('rideRegistration');

const PATH = '/digitale-ritregistratie/';
const CRUMBS = [{ name: 'Valet: overdracht en ritten', path: PATH }];

/**
 * /digitale-ritregistratie/
 *
 * Kept as a short, neutral page so the URL keeps working. It makes no claim
 * about digital ride registration, GPS, speed logging or data retention: none
 * of that is verified. Do not add such claims without confirmation.
 */

const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat gebeurt er met mijn auto bij valet parking?',
    answer: `U draagt uw auto over bij de ${siteConfig.valetHandover.display}. De chauffeur parkeert hem op onze parkeerlocatie. Bij terugkomst belt u ons na de landing en staat uw auto weer klaar tussen Vertrekhal 2 en 3.`,
  },
  {
    question: 'Geldt dit ook voor shuttle parkeren?',
    answer:
      'Nee. Bij shuttle parkeren parkeert u zelf op Schipholweg 181 in Badhoevedorp en houdt u de sleutel. Er rijdt dus niemand anders in uw auto.',
  },
  {
    question: 'Heb ik vragen over de rit met mijn auto?',
    answer: 'Neem dan contact met ons op. Wij helpen u graag verder.',
  },
];

export default function RideRegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Valet parking"
        title="Valet parking: overdracht en terugkomst"
        lead="Bij Valet parkeren draagt u uw auto over bij de vertrekhal en krijgt u hem daar ook weer terug."
        photo="crewHandover"
        photoAlt="Overdracht van de auto bij valet parking"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=valet" size="lg">
          Reserveer valet
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/valet-parking-schiphol/" variant="outline" size="lg">
          Over valet parking
        </Button>
      </PageHero>

      <Section tone="surface" spacing="lg" aria-labelledby="overdracht-heading">
        <Container>
          <Reveal className="max-w-[60ch]">
            <Eyebrow rule>Hoe het werkt</Eyebrow>
            <h2 id="overdracht-heading" className="text-display-md mt-5">
              Afgeven en terugkrijgen bij de vertrekhal
            </h2>
            <p className="text-body mt-6 leading-relaxed">
              {`U draagt uw auto over bij de ${siteConfig.valetHandover.display}. De chauffeur parkeert hem op onze parkeerlocatie. Na de landing belt u ons, waarna uw auto tussen Vertrekhal 2 en 3 voor u klaarstaat.`}
            </p>
          </Reveal>
        </Container>
      </Section>

      <FaqSection
        items={FAQS}
        heading="Veelgestelde vragen"
        lead="Kort over de overdracht bij valet parking."
      />

      <ClosingCta
        heading="Reserveer valet parking"
        lead="Valet parking bij de vertrekhal van Schiphol."
        photo="crewShuttleTerminal"
        photoAlt="Valet parking bij Schiphol"
        bookingHref="/reservering/?service=valet"
        bookingLabel="Reserveer valet"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
