import {
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { siteConfig, termsUrl } from '@/config/site';
import type { PhotoName } from '@/config/images';

export const metadata = createMetadata('why');

const CRUMBS = [{ name: 'Waarom Lang Parkeren Schiphol', path: '/waarom-lang-parkeren-schiphol/' }];

/**
 * The page summarizes confirmed service locations, options, and instructions.
 */

const PROCESS: readonly { title: string; body: string; car: string }[] = [
  {
    title: 'U reserveert online',
    body: 'Kies Shuttle parkeren buiten of Valet parkeren buiten of overdekt en vul uw reisgegevens in.',
    car: 'Bekijk de actuele prijs en beschikbaarheid tijdens het reserveren.',
  },
  {
    title: 'U parkeert of geeft uw auto af',
    body: 'Bij Shuttle parkeert u buiten aan de Schipholweg 181 in Badhoevedorp. Bij Valet geeft u uw auto af tussen Vertrekhal 2 en 3.',
    car: 'Bij Valet kiest u voor buiten of overdekt parkeren.',
  },
  {
    title: 'U reist naar Schiphol',
    body: 'De Shuttle rijdt doorlopend naar Schiphol Plaza. De transfertijd is ongeveer 8 minuten.',
    car: 'Met Valet parkeert u buiten of overdekt volgens uw reservering.',
  },
  {
    title: 'U komt terug',
    body: `Bij Valet belt u direct na de landing op ${siteConfig.valetPhone.display}; met ruimbagage belt u opnieuw na ontvangst. Bij Shuttle loopt u naar de vaste halte op Schiphol Plaza en hoeft u niet te bellen.`,
    car: `Bij Valet belt u direct na de landing op ${siteConfig.valetPhone.display}. Met ruimbagage belt u opnieuw zodra u die heeft ontvangen.`,
  },
];

const MEASURES: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MapPin,
    title: 'Shuttle parkeren buiten',
    body: 'Parkeerlocatie: Schipholweg 181, Badhoevedorp.',
  },
  {
    icon: Warehouse,
    title: 'Overdekt parkeren bij Valet',
    body: 'Bij Valet kiest u tussen buiten en overdekt parkeren.',
  },
  {
    icon: Clock,
    title: 'Doorlopende shuttle',
    body: 'De rit naar Schiphol Plaza duurt ongeveer 8 minuten.',
  },
  {
    icon: Phone,
    title: 'Valet terugkomst',
    body: `Bel direct na de landing en nogmaals na ontvangst van ruimbagage. Telefoon: ${siteConfig.valetPhone.display}.`,
  },
];

const GALLERY: readonly { photo: PhotoName; caption: string; aspect: string; alt: string }[] = [
  {
    photo: 'crewTerminal',
    caption: 'Valet-overdracht tussen Vertrekhal 2 en 3.',
    alt: 'Valet parkeren bij Schiphol',
    aspect: 'aspect-3/4',
  },
  {
    photo: 'crewHandover',
    caption: 'Overdracht van een auto bij Schiphol.',
    alt: 'Auto wordt overgedragen voor valet parkeren',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'lotShuttle',
    caption: 'Shuttle parkeren bij Schiphol.',
    alt: 'Shuttle parkeren bij Schiphol',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'crewCheck',
    caption: 'Auto bij de parkeerlocatie.',
    alt: 'Auto op de parkeerlocatie',
    aspect: 'aspect-3/4',
  },
];

const SCENARIOS: readonly FaqItem[] = [
  {
    question: 'Hoe werkt terugkomst bij Shuttle?',
    answer:
      'Loop naar de vaste shuttlehalte op Schiphol Plaza. De shuttle rijdt doorlopend; u hoeft niet te bellen.',
  },
  {
    question: 'Hoe werkt terugkomst bij Valet?',
    answer:
      `Bel direct na de landing op ${siteConfig.valetPhone.display}. Heeft u ruimbagage, bel dan opnieuw zodra u die heeft ontvangen.`,
  },
  {
    question: 'Ik kom later terug dan ik had gereserveerd. Wat nu?',
    answer:
      'Neem contact op met de klantenservice voor instructies. De toepasselijke voorwaarden vindt u in de algemene voorwaarden.',
  },
  {
    question: 'Wat als er schade aan mijn auto is?',
    answer:
      'Raadpleeg de algemene voorwaarden en neem contact op met de klantenservice voor de toepasselijke procedure.',
  },
];

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Waarom ons"
        title="Kies uw parkeerservice bij Schiphol"
        lead="Parkeer buiten met Shuttle aan de Schipholweg 181 in Badhoevedorp, of geef uw auto af met Valet tussen Vertrekhal 2 en 3. Valet is buiten of overdekt beschikbaar."
        photo="crewTerminal"
        photoAlt="Parkeren bij Schiphol"
        objectPosition="object-[center_38%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer nu
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="#wat-als" variant="outline" size="lg">
          Wat als er iets misgaat?
        </Button>
      </PageHero>

      {/* ══════════ THE PROCESS ══════════ */}
      <Section spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Van reservering tot terugkomst</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Wat er met uw auto gebeurt
              </h2>
            </div>
            <p className="text-muted max-w-[36ch] lg:pb-2 lg:text-right">
              De locaties, beschikbare opties en instructies voor uw terugkomst.
            </p>
          </Reveal>

          <ol className="mt-14 lg:mt-20">
            {PROCESS.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 60}
                className="border-line grid gap-x-8 gap-y-4 border-t py-9 lg:grid-cols-[auto_5fr_6fr] lg:gap-x-12 lg:py-11"
              >
                {/* The numeral is decorative — the order is already carried by
                    the list and by the "Stap n:" in the heading. */}
                <p aria-hidden className="ghost-numeral text-numeral text-5xl lg:text-6xl">
                  {String(index + 1).padStart(2, '0')}
                </p>

                <div>
                  <h3 className="text-display-sm text-heading">
                    <span className="sr-only">Stap {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-muted mt-4 max-w-[44ch] leading-relaxed">{step.body}</p>
                </div>

                {/* The car column. Set apart with a rule and the accent label,
                    because it is the reason this page exists — the homepage
                    already says the four steps are easy. */}
                <div className="border-line lg:border-l lg:pl-12">
                  {/* text-brand, not text-accent. valet-600 at 12px on the canvas is
                      2.99:1 — it fails AA, and it was failing before this pass
                      too; the ramp's own note in globals.css restricts it to
                      >=24px display text, icons and non-text borders. navy-600
                      is 6.29:1 here. */}
                  <p className="eyebrow text-brand">Uw auto</p>
                  <p className="text-body mt-3 max-w-[44ch] leading-relaxed">{step.car}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>De services</Eyebrow>
              <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Wat u vooraf wilt weten
              </h2>
              <p className="text-body mt-6 max-w-[42ch] leading-relaxed">
                Hieronder staan de parkeerlocaties en de praktische verschillen tussen Shuttle en Valet.
              </p>
            </Reveal>

            <Stagger as="ul" className="divide-line border-line divide-y border-y">
              {MEASURES.map((measure) => (
                <div key={measure.title} className="flex items-start gap-5 py-6">
                  <measure.icon
                    className="text-accent mt-0.5 size-6 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold">{measure.title}</h3>
                    <p className="text-muted mt-2 max-w-[52ch] text-sm leading-relaxed">
                      {measure.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>

          <Reveal className="border-line mt-16 border-t pt-10">
            <h3 className="text-heading text-lg font-semibold">Verzekering en aansprakelijkheid</h3>
            <p className="text-body mt-4 max-w-[68ch] leading-relaxed">
              Wat er precies geldt terwijl uw auto bij ons staat — waarvoor wij aansprakelijk zijn
              en onder welke voorwaarden — is vastgelegd in onze algemene voorwaarden. Heeft u hier
              vooraf een concrete vraag over, bel ons dan even; wij beantwoorden die liever
              persoonlijk dan met een algemene zin op een website.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={termsUrl} variant="outline">
                Lees de algemene voorwaarden
              </Button>
              <Button href="/contact/" variant="outline">
                Stel uw vraag
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="surface" spacing="lg" aria-labelledby="team-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Impressie</Eyebrow>
            <h2 id="team-heading" className="text-display-lg mt-5">
              Parkeren en overdracht bij Schiphol
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Bekijk beelden van parkeren en de overdracht bij Schiphol.
            </p>
          </Reveal>

          {/* A masonry-ish grid rather than four equal thumbnails: two portrait
              frames and two landscape, so the block reads as a set of
              photographs rather than as a gallery widget. */}
          <Stagger
            as="ul"
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
          >
            {GALLERY.map((item, index) => (
              <figure key={item.photo} className={index % 2 === 1 ? 'lg:mt-12' : undefined}>
                <div className={`shadow-photo relative overflow-hidden rounded-xl ${item.aspect}`}>
                  <Photo
                    name={item.photo}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="object-cover object-center"
                  />
                </div>
                <figcaption className="text-muted mt-4 text-sm leading-relaxed">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ══════════ WHAT HAPPENS IF… ══════════ */}
      <Section id="wat-als" spacing="lg" aria-labelledby="wat-als-heading" className="scroll-mt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Als het anders loopt</Eyebrow>
              <h2 id="wat-als-heading" className="text-display-lg mt-5 max-w-[14ch]">
                Wat gebeurt er als…
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Hier vindt u de instructies voor Shuttle en Valet en de contactroute bij andere vragen.
              </p>

              <div className="border-line mt-10 border-t pt-8">
                <p className="text-heading text-base font-semibold">Zit uw situatie er niet bij?</p>
                <p className="text-muted mt-2 max-w-[36ch] text-sm leading-relaxed">
                  Bel ons. Bij iets rond een lopende reis is dat altijd sneller dan mailen.
                </p>
                <a
                  href={siteConfig.phone.href}
                  className="text-heading hover:text-brand ease-settle mt-3 inline-flex min-h-11 items-center gap-3 font-medium transition-colors duration-(--duration-micro)"
                >
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <Accordion items={SCENARIOS} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <ClosingCta
        heading="Kies uw parkeerservice"
        lead="Bekijk de beschikbare opties en reserveer uw parkeerplaats bij Schiphol."
        photo="crewHandover"
        photoAlt="Valet-overdracht bij Schiphol"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* Emitted from the same array the accordion renders. These four answers
          exist nowhere else on the site, so this is a genuinely new rich-result
          surface rather than a duplicate of the homepage FAQ. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(SCENARIOS)) }}
      />
    </>
  );
}
