import {
  BadgeCheck,
  FileCheck,
  Gauge,
  MousePointerClick,
  ShieldCheck,
  Timer,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';

/**
 * Why us.
 *
 * This section absorbs the live site's separate "USP quad" (Direct via onze site
 * / Veilig en professioneel / Digitale ritcontroles / Snel Geregeld), which sat
 * immediately above it and made near-identical claims. Shipping both as card
 * grids would have put eight undifferentiated reassurance boxes between the hero
 * and the offer — and eight icons in eight bordered rectangles is the single
 * clearest tell of a generated page.
 *
 * Every line of that copy is still here, at two different weights:
 *
 *   - The four REASONS are an editorial list. No borders, no card backgrounds,
 *     no fills behind the icons — just hairlines and type. A list that looks
 *     like a list reads as an argument; the same list in boxes reads as filler.
 *   - The four USPS run as a quiet hairline strip at the foot of the section,
 *     visibly a summary rather than a second grid.
 *
 * The photograph earns its column: the chauffeur in the branded jacket, facing
 * the Vertrek 2 entrance. A standing figure is the one subject that survives a
 * tall crop without looking like a mistake, and it puts a person against the
 * argument — which is what "vertrouwde keuze" actually rests on.
 */

type Item = { icon: LucideIcon; title: string; body: string };

/** The four supporting claims, verbatim from the live site. */
const REASONS: readonly Item[] = [
  {
    icon: Zap,
    title: 'Super snel en probleemloos',
    body: 'Kies uw parkeerservice, wij zorgen voor de rest.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 zorg voor uw auto',
    body: 'Video surveillance en ervaren chauffeurs in dienst.',
  },
  {
    icon: Gauge,
    title: 'Altijd inzicht en controle',
    body: 'Digitale ritregistratie, inclusief snelheid en route.',
  },
  {
    icon: Users,
    title: 'Betrouwbare keuze',
    body: 'Betrouwbare keuze voor reizigers van en naar Schiphol.',
  },
];

/** The absorbed USP quad. Same copy, quieter treatment. */
const USPS: readonly Item[] = [
  {
    icon: MousePointerClick,
    title: 'Direct via onze site',
    body: 'Direct geregeld — reserveer, bevestig en betaal op één plek.',
  },
  {
    icon: BadgeCheck,
    title: 'Veilig en professioneel',
    body: 'Je auto in betrouwbare, ervaren handen.',
  },
  {
    icon: FileCheck,
    title: 'Digitale ritcontroles',
    body: 'Veiligheid en controle dankzij digitale ritregistratie.',
  },
  {
    icon: Timer,
    title: 'Snel geregeld',
    body: 'Reserveer binnen enkele minuten, zodat u zorgeloos op reis kunt.',
  },
];

export function WhyUs() {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="waarom-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_6fr] lg:items-stretch lg:gap-16">
          {/* ---------- The photograph ----------
              Stretches to whatever the text column ends up being, so the two
              columns end level regardless of how the Dutch copy wraps. */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative h-full min-h-96 overflow-hidden rounded-xl lg:min-h-136">
              <Photo
                name="crewTerminal"
                fill
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover object-[center_35%]"
              />
            </div>
          </Reveal>

          {/* ---------- The argument ---------- */}
          <div className="order-1 flex flex-col lg:order-2">
            <Reveal>
              <Eyebrow rule>Waarom Lang Parkeren bij Schiphol?</Eyebrow>
              <h2 id="waarom-heading" className="text-display-lg mt-5">
                De vertrouwde keuze voor valet en shuttle parkeren op Schiphol
              </h2>

              <div className="text-muted mt-6 flex max-w-[52ch] flex-col gap-4">
                <p>
                  We weten precies wat reizigers nodig hebben: snelheid, zekerheid en gemak. Of u nu
                  kiest voor valet of shuttle parkeren, we zorgen ervoor dat uw reis ontspannen
                  begint vanaf het moment dat u aankomt.
                </p>
                <p>
                  Uw auto is bij ons in betrouwbare handen. Professionele chauffeurs, veilige
                  parkeerplaatsen en slimme tracking bieden maximale controle en veiligheid.
                </p>
              </div>
            </Reveal>

            {/* The four reasons, as a list rather than as a grid of boxes. */}
            <Stagger as="ul" className="divide-line border-line mt-10 divide-y border-t border-b">
              {REASONS.map((item) => (
                <div key={item.title} className="flex items-start gap-5 py-5">
                  <item.icon
                    className="text-accent mt-0.5 size-6 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold">{item.title}</h3>
                    <p className="text-muted mt-1.5 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </Stagger>

            <Reveal className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/tarieven/" variant="outline">
                Bekijk tarieven
              </Button>
              <Button href="#zo-werkt-het" variant="link">
                Hoe het werkt
              </Button>
            </Reveal>
          </div>
        </div>

        {/* The absorbed USP quad: a summary row, not a second grid. */}
        <Stagger
          as="ul"
          className="border-line mt-16 grid gap-8 border-t pt-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4"
        >
          {USPS.map((item) => (
            <div key={item.title} className="flex gap-3.5">
              <item.icon
                className="text-brand mt-0.5 size-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
              <div>
                <h3 className="text-heading text-sm font-semibold">{item.title}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
