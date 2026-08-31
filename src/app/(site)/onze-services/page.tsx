import { ArrowRight, Check, Gauge, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
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
 * Every line of copy is carried over verbatim from the live page. What changed
 * is the order and the shape.
 *
 * The live page runs: valet block → three claims → shuttle block → safety →
 * "Kies Valet als u" / "Kies Shuttle als u" → CTA. That order is right and it is
 * kept. What is not kept is that all six of those bands are centred headings
 * over grids of bordered rectangles, so the page reads as one shape repeated
 * until it stops.
 *
 * Here the two service blocks mirror each other across the measure (photograph
 * left, then photograph right), the three claims run as a hairline strip rather
 * than a second card grid, the safety band is navy and typographic — no
 * photograph, no glass, so it does not restate the homepage's security band —
 * and the chooser is a genuine two-column comparison split by a rule.
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
    badge: 'Snelste optie',
    badgeTone: 'accent',
    title: 'Valet Parking bij de vertrekhal van Schiphol',
    body: 'De meest comfortabele manier van parkeren. U rijdt rechtstreeks naar de vertrekhal van Schiphol, waar één van onze professionele chauffeurs u opwacht. Na een korte controle van uw voertuig nemen wij uw auto direct van u over. Terwijl u zonder vertraging doorloopt naar uw vlucht, zorgen wij ervoor dat uw auto veilig wordt geparkeerd op onze beveiligde locatie.',
    benefitsTitle: 'Voordelen van Valet Parking',
    benefits: [
      'Direct uitstappen bij de vertrekhal',
      'Geen tijdverlies of zoeken naar een parkeerplek',
      'Ideaal voor zakelijke reizigers en gezinnen',
      'Professionele en gescreende chauffeurs',
      'Uw auto wordt veilig en gecontroleerd geparkeerd',
    ],
    closing:
      'Bij terugkomst staat uw auto weer voor u klaar bij de luchthaven. Snel, comfortabel en volledig zorgeloos.',
    photo: 'crewHandover',
    objectPosition: 'object-[center_40%]',
    photoAlt: 'Schiphol parkeerplaats met valet bij de vertrekhal',
  },
  {
    // Capital S. See the note above — do not normalise this.
    id: 'Shuttle',
    eyebrow: 'Shuttle Parking',
    badge: 'Meest betaalbare keuze',
    badgeTone: 'brand',
    title: 'Shuttle Parking — voordelig en comfortabel',
    body: 'Voordelig parkeren zonder in te leveren op comfort. U parkeert uw auto zelf in onze luxe en beveiligde parkeergarage. Vervolgens brengen wij u met een comfortabel shuttlebusje binnen 5 tot 8 minuten naar de vertrekhal van Schiphol.',
    benefitsTitle: 'Voordelen van Shuttle Parking',
    benefits: [
      'Parkeer uw auto zelf in onze moderne parkeergarage',
      'Luxe shuttlebus naar de luchthaven',
      'Binnen 5–8 minuten bij de vertrekhal',
      'Voordelige oplossing zonder concessies op service',
      '24/7 beschikbaar',
    ],
    closing: 'Bij terugkomst wordt u weer opgehaald en teruggebracht naar uw auto.',
    photo: 'lotShuttle',
    objectPosition: 'object-[center_35%]',
    photoAlt: 'Schiphol parkeerplaats met shuttle op het parkeerterrein',
  },
];

/** The three claims that sit between the two service blocks, verbatim. */
const CLAIMS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Zap,
    title: 'Supersnel & zorgeloos',
    body: 'Binnen enkele minuten geregeld. Bij valet parking stapt u direct uit bij de vertrekhal — wij doen de rest.',
  },
  {
    icon: ShieldCheck,
    title: 'Veilig & professioneel',
    body: '24/7 camerabewaking, gecontroleerde terreinen en ervaren chauffeurs. Uw auto wordt altijd veilig geparkeerd.',
  },
  {
    icon: Gauge,
    title: 'Altijd inzicht & controle',
    body: 'Uw auto en chauffeur zijn live traceerbaar tijdens de rit. Volledige transparantie, van afgifte tot terugkomst.',
  },
];

/** The safety band, verbatim. */
const SAFETY = [
  '24/7 camerabewaking op alle locaties',
  'Afgesloten en gecontroleerde parkeerterreinen',
  'Mogelijkheid tot overdekt parkeren',
  'Professionele, betrouwbare chauffeurs',
] as const;

/** The chooser, verbatim. */
const CHOOSER = [
  {
    title: 'Kies Valet Parking als u:',
    href: '#valet',
    items: [
      'Snel en zonder moeite wilt parkeren',
      'Direct bij de vertrekhal wilt uitstappen',
      'Maximale luxe en gemak zoekt',
    ],
  },
  {
    title: 'Kies Shuttle Parking als u:',
    href: '#Shuttle',
    items: [
      'Voordelig wilt parkeren',
      'Uw auto zelf wilt parkeren',
      'Comfortabel naar de luchthaven gebracht wilt worden',
    ],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Onze Services"
        title="Parkeren bij Schiphol — op uw manier."
        lead="Een goede Schiphol parkeerplaats vinden hoeft niet ingewikkeld of duur te zijn. Bij Lang Parkeren Schiphol kiest u eenvoudig de parkeerservice die bij uw reis past: Valet Parking bij de vertrekhal of Shuttle Parking op ons veilige parkeerterrein."
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

      {/* ---------- Safety ----------
          Typographic, on the accent wash. It was a flat navy field, on the
          reasoning that the homepage already spends a photograph and the site's
          only glassmorphism on this same argument and a second photographic
          treatment would weaken the stronger of the two. That reasoning holds;
          only the colour changed, because the client asked for no dark sections
          anywhere ("nergens donker").

          The wash rather than plain surface: this page runs canvas, white,
          canvas, and a fourth plain band would disappear into the stack. Used
          once per page, which is the rule on it.

          Contrast on valet-100: navy-950 heading 14.90:1 AAA, ink-700 items
          8.44:1 AAA, ink-500 note 4.66:1 AA. */}
      <Section tone="accent" spacing="lg" aria-labelledby="veiligheid-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              <Eyebrow rule>Veiligheid &amp; Kwaliteit</Eyebrow>
              <h2 id="veiligheid-heading" className="text-display-lg mt-5 max-w-[14ch]">
                Altijd veilig parkeren bij Schiphol.
              </h2>
              <p className="text-lead text-body mt-6 max-w-[40ch]">
                Welke service u ook kiest, uw auto is bij ons altijd in goede handen.
              </p>
            </Reveal>

            <div>
              <Stagger as="ul" className="divide-valet-200 border-valet-200 divide-y border-y">
                {SAFETY.map((item) => (
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
                  Wij combineren jarenlange ervaring met moderne technologie om u maximale zekerheid
                  te bieden.
                </p>
                <Button href="/waarom-lang-parkeren-schiphol/" variant="outline" className="mt-7">
                  Lees hoe wij uw auto beveiligen
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
        photo="terminalDeparture"
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
