import { Car, Clock, MapPin, Warehouse, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { ContentSection } from '@/components/sections/ContentSection';
import { FaqSection } from '@/components/sections/Faq';
import { ClusterLinks } from '@/components/sections/ClusterLinks';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal, Stagger } from '@/components/motion/Reveal';

export const metadata = createMetadata('safeParking');

const PATH = '/veilig-parkeren-schiphol/';
const CRUMBS = [{ name: 'Veilig parkeren Schiphol', path: PATH }];

/**
 * /veilig-parkeren-schiphol/ — Pagina 4 of the SEO document.
 *
 * This page describes confirmed parking options and practical instructions,
 * without making unverified security claims.
 */

const MEASURES: readonly { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: MapPin,
    label: 'Shuttle parkeren buiten',
    body: `U parkeert op ${siteConfig.shuttleParking.display}.`,
  },
  {
    icon: Clock,
    label: 'Doorlopende shuttle',
    body: `De rit naar Schiphol duurt ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten.`,
  },
  {
    icon: Car,
    label: 'Valet parkeren buiten',
    body: `U geeft uw auto af op ${siteConfig.valetHandover.display}.`,
  },
  {
    icon: Warehouse,
    label: 'Valet parkeren overdekt',
    body: 'Met Valet kunt u kiezen voor buiten of overdekt parkeren.',
  },
];

const FAQS: readonly FaqItem[] = [
  {
    question: 'Waar parkeer ik mijn auto bij Shuttle?',
    answer:
      `Op ${siteConfig.shuttleParking.display}. De shuttle brengt u in ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten naar Schiphol.`,
  },
  {
    question: 'Hoe kom ik bij terugkomst terug naar mijn auto met Shuttle?',
    answer:
      `U loopt naar de vaste shuttlehalte op Schiphol Plaza. De shuttle rijdt doorlopend en u hoeft niet te bellen.`,
  },
  {
    question: 'Waar geef ik mijn auto af voor Valet?',
    answer:
      `${siteConfig.valetHandover.display}.`,
  },
  {
    question: 'Kan ik bij Shuttle overdekt parkeren?',
    answer:
      'Nee. Shuttle parkeren is buiten beschikbaar. Overdekt parkeren is beschikbaar bij Valet.',
  },
  {
    question: 'Wanneer moet ik bellen bij Valet?',
    answer:
      `Bel 30 minuten vóór aankomst op ${siteConfig.valetPhone.display}. Bel bij terugkomst direct na de landing en nogmaals zodra u uw ruimbagage heeft ontvangen.`,
  },
  {
    question: 'Moet ik bellen als ik terugkom met Shuttle?',
    answer:
      'Nee. Loop naar de vaste shuttlehalte op Schiphol Plaza; de shuttle rijdt doorlopend.',
  },
];

export default function SafeParkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Veilig parkeren"
        title="Veilig parkeren bij Schiphol"
        lead="Bekijk waar u uw auto parkeert, hoe Shuttle en Valet werken en wat u bij terugkomst kunt verwachten."
        photo="lotShuttle"
        photoAlt="beveiligd parkeren Schiphol"
        objectPosition="object-[center_30%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer uw plek
        </Button>
        <Button href="/waarom-lang-parkeren-schiphol/" variant="outline" size="lg">
          Waarom ons
        </Button>
      </PageHero>

      <ContentSection
        id="waarom-veiligheid"
        eyebrow="Parkeren bij Schiphol"
        title="Kies de parkeerservice die bij uw reis past"
        paragraphs={[
          'Met Shuttle parkeert u buiten in Badhoevedorp en reist u met de doorlopende shuttle naar Schiphol. Met Valet geeft u uw auto af bij de vertrekhallen en kiest u tussen buiten en overdekt parkeren.',
          'Hieronder vindt u de locaties en praktische instructies voor uw aankomst en terugkomst.',
        ]}
      />

      <Section tone="surface" spacing="lg" aria-labelledby="maatregelen-heading">
        <Container>
          <Reveal className="max-w-[36ch]">
            <Eyebrow rule>Onze diensten</Eyebrow>
            <h2 id="maatregelen-heading" className="text-display-md mt-5">
              Twee manieren van parkeren
            </h2>
          </Reveal>

          <Stagger as="ul" className="divide-line border-line mt-12 divide-y border-y">
            {MEASURES.map((measure) => (
              <li key={measure.label} className="grid gap-4 py-7 sm:grid-cols-[auto_1fr_2fr]">
                <measure.icon
                  className="text-accent size-6 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="text-heading text-base font-semibold sm:text-lg">{measure.label}</h3>
                <p className="text-muted max-w-[54ch] text-sm leading-relaxed sm:text-base">
                  {measure.body}
                </p>
              </li>
            ))}
          </Stagger>
        </Container>
      </Section>

      <ContentSection
        id="shuttle-locatie"
        eyebrow="Shuttle parkeren"
        title="Parkeerlocatie in Badhoevedorp"
        paragraphs={[
          `Bij Shuttle parkeert u op ${siteConfig.shuttleParking.display}. De shuttle rijdt doorlopend en de transfertijd naar Schiphol is ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten.`,
          'Bij terugkomst loopt u naar de vaste shuttlehalte op Schiphol Plaza. U hoeft niet te bellen.',
        ]}
        photo="lotShuttle"
        photoAlt="Parkeerlocatie voor Shuttle parkeren bij Schiphol"
        objectPosition="object-[center_45%]"
      >
      </ContentSection>

      <FaqSection
        items={FAQS}
        heading="Praktische vragen over parkeren"
        lead="Locaties, beschikbare parkeervarianten en de instructies voor uw terugkomst."
      />

      <ClusterLinks currentPath={PATH} />

      <ClosingCta
        heading="Kies uw parkeerservice"
        lead="Bekijk de beschikbare opties en reserveer uw parkeerplaats bij Schiphol."
        photo="lotShuttle"
        photoAlt="Parkeerterrein voor Shuttle parkeren bij Schiphol"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
