import { ArrowRight, Check, Clock, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
import type { PhotoName } from '@/config/images';

export const metadata = createMetadata('services');

const CRUMBS = [{ name: 'Onze Services', path: '/onze-services/' }];

/**
 * /onze-services/
 *
 * The page explains only the currently offered services and their practical
 * locations and instructions.
 *
 * ── The anchor ids ──────────────────────────────────────────────────────────
 * `#valet` and `#Shuttle`. The capital S is NOT a typo and must not be
 * "corrected": it matches the anchor the live site's footer has linked to for
 * years, and those links exist on other people's pages. Fragment matching is
 * case-sensitive, so lowercasing it silently breaks every one of them.
 */

type ServiceBlock = {
  id: string;
  eyebrow: string;
  badge: string;
  badgeTone: 'accent' | 'brand';
  title: string;
  body: string;
  benefitsTitle: string;
  benefits: readonly string[];
  closing: string;
  photo: PhotoName;
  objectPosition: string;
  photoAlt: string;
};

const SERVICES: readonly ServiceBlock[] = [
  {
    id: 'valet',
    eyebrow: 'Valet Parking',
    badge: 'Buiten of overdekt',
    badgeTone: 'accent',
    title: 'Valet Parking bij de vertrekhal van Schiphol',
    body: 'Geef uw auto af op Schiphol, tussen Vertrekhal 2 en 3. U kiest bij het reserveren voor buiten of overdekt parkeren.',
    benefitsTitle: 'Voordelen van Valet Parking',
    benefits: [
      'Inleveren en ophalen tussen Vertrekhal 2 en 3',
      'Keuze tussen buiten en overdekt parkeren',
      'Bel 30 minuten vóór aankomst',
      'Bel direct na de landing en nogmaals na ontvangst van ruimbagage',
    ],
    closing:
      'U krijgt uw auto bij terugkomst terug tussen Vertrekhal 2 en 3.',
    photo: 'crewHandover',
    objectPosition: 'object-[center_40%]',
    photoAlt: 'Schiphol parkeerplaats met valet bij de vertrekhal',
  },
  {
    // Capital S. See the note above — do not normalise this.
    id: 'Shuttle',
    eyebrow: 'Shuttle Parking',
    badge: 'Buiten parkeren',
    badgeTone: 'brand',
    title: 'Shuttle parkeren buiten bij Schiphol',
    body: 'U parkeert buiten aan de Schipholweg 181 in Badhoevedorp. De shuttle rijdt doorlopend; de rit naar Schiphol Plaza duurt ongeveer 8 minuten.',
    benefitsTitle: 'Voordelen van Shuttle Parking',
    benefits: [
      'Parkeren op Schipholweg 181 in Badhoevedorp',
      'Doorlopende shuttle naar Schiphol',
      'Transfertijd ongeveer 8 minuten',
      'Bij terugkomst naar de vaste halte op Schiphol Plaza lopen',
    ],
    closing: 'Bij terugkomst hoeft u niet te bellen; loop naar de vaste shuttlehalte op Schiphol Plaza.',
    photo: 'lotShuttle',
    objectPosition: 'object-[center_35%]',
    photoAlt: 'Schiphol parkeerplaats met shuttle op het parkeerterrein',
  },
];

/** The practical instructions that help visitors distinguish the services. */
const CLAIMS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MapPin,
    title: 'Shuttlelocatie',
    body: 'Shuttle parkeren vindt plaats buiten aan de Schipholweg 181 in Badhoevedorp.',
  },
  {
    icon: Clock,
    title: 'Shuttle naar Schiphol',
    body: 'De shuttle rijdt doorlopend. De rit naar Schiphol duurt ongeveer 8 minuten.',
  },
  {
    icon: Phone,
    title: 'Valet bellen',
    body: 'Bel 30 minuten vóór aankomst en volg de terugkomstinstructies voor uw vlucht en ruimbagage.',
  },
];

/** The service facts visitors need before choosing. */
const SERVICE_FACTS = [
  'Shuttle parkeren buiten aan de Schipholweg 181 in Badhoevedorp',
  'Doorlopende shuttle naar de vaste halte op Schiphol Plaza',
  'Valet afgeven tussen Vertrekhal 2 en 3',
  'Valet parkeren buiten of overdekt',
] as const;

const CHOOSER = [
  {
    title: 'Kies Valet Parking als u:',
    href: '#valet',
    items: [
      'Uw auto bij de vertrekhallen wilt afgeven',
      'Buiten of overdekt wilt parkeren',
    ],
  },
  {
    title: 'Kies Shuttle Parking als u:',
    href: '#Shuttle',
    items: [
      'Uw auto zelf buiten wilt parkeren',
      'Met de shuttle naar Schiphol wilt reizen',
    ],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Onze Services"
        title="Parkeren bij Schiphol — op uw manier."
        lead="Kies Shuttle parkeren buiten of Valet parkeren bij de vertrekhallen, met keuze tussen buiten en overdekt."
        photo="crewTerminal"
        photoAlt="Schiphol parkeerplaats en parkeerservice bij de luchthaven"
        objectPosition="object-[center_30%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer nu
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/tarieven/" variant="outline" size="lg">
          Bekijk tarieven
        </Button>
      </PageHero>

      {/* ---------- Valet ---------- */}
      <ServiceSection service={SERVICES[0]} />

      {/* ---------- The three claims ----------
          A hairline strip on the white band, not a third grid of bordered
          boxes. Three icons in three rectangles between two photographic
          sections is the exact rhythm this page was rebuilt to break. */}
      <Section tone="surface" spacing="md" aria-labelledby="kenmerken-heading">
        <Container>
          <h2 id="kenmerken-heading" className="sr-only">
            Kenmerken van onze parkeerservice
          </h2>
          <Stagger as="ul" className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {CLAIMS.map((claim) => (
              <div key={claim.title} className="border-line border-t pt-6">
                <claim.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
                <h3 className="text-heading mt-4 text-base font-semibold">{claim.title}</h3>
                <p className="text-muted mt-2 max-w-[34ch] text-sm leading-relaxed">{claim.body}</p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- Shuttle ---------- */}
      <ServiceSection service={SERVICES[1]} reversed />

      <Section tone="accent" spacing="lg" aria-labelledby="veiligheid-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              <Eyebrow rule>De services</Eyebrow>
              <h2 id="veiligheid-heading" className="text-display-lg mt-5 max-w-[14ch]">
                De locaties en terugkomstinstructies.
              </h2>
              <p className="text-lead text-body mt-6 max-w-[40ch]">
                Shuttle en Valet verschillen in waar u uw auto parkeert en hoe u bij terugkomst contact opneemt.
              </p>
            </Reveal>

            <div>
              <Stagger as="ul" className="divide-valet-200 border-valet-200 divide-y border-y">
                {SERVICE_FACTS.map((item) => (
                  <div key={item} className="flex items-start gap-5 py-5">
                    <Check
                      className="text-accent-hover mt-1 size-5 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span className="text-heading text-base sm:text-lg">{item}</span>
                  </div>
                ))}
              </Stagger>

              <Reveal>
                <p className="text-muted mt-8 max-w-[52ch] text-sm leading-relaxed">
                  Bij Shuttle loopt u bij terugkomst naar de vaste shuttlehalte. Bij Valet belt u direct na de landing; met ruimbagage belt u opnieuw na ontvangst.
                </p>
                <Button href="/waarom-lang-parkeren-schiphol/" variant="outline" className="mt-7">
                  Lees de praktische parkeerinformatie
                  <ArrowRight data-arrow className="size-4" aria-hidden />
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- The chooser ----------
          Two columns split by a single rule, which is what a comparison
          actually looks like. Two bordered cards side by side would say these
          are two products in a catalogue; a rule between them says they are two
          answers to one question. */}
      <Section spacing="lg" aria-labelledby="keuze-heading">
        <Container>
          <Reveal className="max-w-[34ch]">
            <Eyebrow rule>Welke past bij u?</Eyebrow>
            <h2 id="keuze-heading" className="text-display-md mt-5">
              Twee services, één beslissing
            </h2>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {CHOOSER.map((column, index) => (
              <Reveal
                key={column.title}
                delay={index * 80}
                className={index === 0 ? 'py-9 lg:pr-12' : 'py-9 lg:pl-12'}
              >
                <h3 className="text-display-sm text-heading">{column.title}</h3>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {column.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check
                        className="text-accent mt-1 size-4 shrink-0"
                        strokeWidth={3}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href={column.href} variant="link" className="mt-6">
                  Meer over deze service
                </Button>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <ClosingCta
        heading="Reserveer eenvoudig uw parkeerplek."
        lead="Binnen enkele minuten geregeld. Kies de service die bij u past en start uw reis zonder zorgen."
        photo="crewHandover"
        photoAlt="Schiphol parkeerplaats bij Vertrek 2 van de luchthaven"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* One Service node per product, each pointing back at the business by
          @id so the graph resolves to a single entity. No Offer block: the
          price depends on duration and options only MyParking.pro can compute,
          and a "from" price the booking flow then contradicts is worse than
          none. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            serviceSchema({
              name: 'Valet Parkeren Schiphol',
              description: SERVICES[0].body,
              serviceType: 'Valet parking',
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            serviceSchema({
              name: 'Shuttle Parkeren Schiphol',
              description: SERVICES[1].body,
              serviceType: 'Airport shuttle parking',
            }),
          ),
        }}
      />
    </>
  );
}

/**
 * One service, set across the measure: photograph on one side, the argument on
 * the other. `reversed` mirrors it, which is the whole reason the two blocks do
 * not read as the same block twice.
 *
 * `scroll-mt-28` gives the anchor jump room to clear the sticky header — the
 * global `scroll-padding-top` covers in-page links, but a fragment arriving
 * from another page lands before that applies.
 */
function ServiceSection({
  service,
  reversed = false,
}: {
  service: ServiceBlock;
  reversed?: boolean;
}) {
  const headingId = `${service.id}-heading`;

  return (
    <Section id={service.id} spacing="lg" aria-labelledby={headingId} className="scroll-mt-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={reversed ? 'lg:order-2' : undefined}>
            <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
              <Photo
                name={service.photo}
                alt={service.photoAlt}
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName={`object-cover ${service.objectPosition}`}
              />
              <Badge tone={service.badgeTone} className="absolute top-5 left-5 z-10">
                {service.badge}
              </Badge>
            </div>
          </Reveal>

          <div className={reversed ? 'lg:order-1' : undefined}>
            <Reveal>
              <Eyebrow rule>{service.eyebrow}</Eyebrow>
              <h2 id={headingId} className="text-display-md mt-5">
                {service.title}
              </h2>
              <p className="text-muted mt-6 max-w-[52ch] leading-relaxed">{service.body}</p>
            </Reveal>

            <Reveal delay={80} className="mt-9">
              <h3 className="eyebrow text-muted">{service.benefitsTitle}</h3>
              <ul className="divide-line border-line mt-4 divide-y border-y">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3.5 py-3.5">
                    <Check
                      className="text-accent mt-1 size-4 shrink-0"
                      strokeWidth={3}
                      aria-hidden
                    />
                    <span className="text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <p className="text-muted mt-7 max-w-[48ch] text-sm leading-relaxed">
                {service.closing}
              </p>
              <Button href="/reservering/" className="mt-7">
                Reserveer {service.eyebrow}
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
