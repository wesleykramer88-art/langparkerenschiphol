import {
  BadgeCheck,
  FileCheck,
  Gauge,
  MousePointerClick,
  Timer,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';

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

/**
 * The four supporting claims. Client's final copy, August 2026 — his document
 * gives exactly four here and exactly four below, in this order, which is why
 * this section needed no restructuring at all.
 *
 * Two of the four stop making claims we could not support:
 *   · "Meest populaire service" → "Duizenden reizigers per jaar". The
 *     popularity claim was unfalsifiable and had a standing TODO against it in
 *     the hero for the same reason. He has replaced it with the count.
 *   · "24/7 zorg voor uw auto" → "24/7 camerabewaking". Narrower and true: the
 *     cameras run around the clock, which is not the same as somebody watching.
 */
const REASONS: readonly Item[] = [
  {
    icon: Zap,
    title: 'Snel en eenvoudig geregeld',
    body: 'Kies uw parkeerservice en reserveer binnen enkele minuten online. U ontvangt direct een bevestiging.',
  },
  {
    // Video, not ShieldCheck: the line is now specifically about cameras, and
    // this is the mark the security band and the trust page already use for it.
    icon: Video,
    title: '24/7 camerabewaking',
    body: 'Onze parkeerlocaties zijn voorzien van camerabewaking en worden 24 uur per dag gemonitord.',
  },
  {
    icon: Gauge,
    title: 'Digitale ritregistratie bij valet',
    body: 'Bij valet parkeren wordt iedere rit met uw auto digitaal geregistreerd, inclusief gereden route en snelheid.',
  },
  {
    icon: Users,
    title: 'Duizenden reizigers per jaar',
    body: 'Jaarlijks maken duizenden reizigers gebruik van onze valet- en shuttleservice bij Schiphol.',
  },
];

/**
 * The absorbed USP quad. Same treatment, his new copy.
 *
 * The mixed form of address is gone from the last one here too — "Je auto in
 * betrouwbare, ervaren handen" was the last "je" left in this component, under
 * paragraphs written in "u". All four are now in "u".
 */
const USPS: readonly Item[] = [
  {
    icon: MousePointerClick,
    title: 'Direct bij ons gereserveerd',
    body: 'U reserveert rechtstreeks via onze eigen website, zonder tussenpartij.',
  },
  {
    icon: BadgeCheck,
    title: 'Veilig en professioneel',
    body: 'Uw auto wordt tijdens uw reis geparkeerd op een afgesloten en bewaakte parkeerlocatie.',
  },
  {
    icon: FileCheck,
    title: 'Controle bij valet parkeren',
    body: 'Bij valet parkeren registreren we de ritten met uw auto digitaal, inclusief route en snelheid.',
  },
  {
    icon: Timer,
    title: 'Binnen enkele minuten geregeld',
    body: 'Reserveer eenvoudig online en ontvang direct uw reserveringsbevestiging.',
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
              <Eyebrow rule>Waarom Lang Parkeren Schiphol?</Eyebrow>
              <h2 id="waarom-heading" className="text-display-lg mt-5">
                Al meer dan {siteConfig.yearsActive} jaar vertrouwd parkeren bij Schiphol
              </h2>

              {/* Both paragraphs are his. The second one's "slimme tracking"
                  is gone with it — a phrase that described the ride registration
                  in vaguer and more surveillance-flavoured terms than the system
                  itself warrants, and which the reasons list below now states
                  properly and valet-only. */}
              <div className="text-muted mt-6 flex max-w-[52ch] flex-col gap-4">
                <p>
                  Wanneer u uw auto tijdens een reis achterlaat, wilt u weten dat deze in goede
                  handen is. Daarom combineren wij een snelle parkeerservice met duidelijke
                  afspraken en een veilige parkeerlocatie.
                </p>
                <p>
                  Of u nu kiest voor valet parkeren of shuttle parkeren bij Schiphol: wij zorgen
                  ervoor dat uw reis zo makkelijk mogelijk begint en uw auto tijdens uw afwezigheid
                  veilig geparkeerd staat.
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
                Bekijk hoe het werkt
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
