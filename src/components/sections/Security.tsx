import { ArrowRight, Award, Lock, PlugZap, Video, Warehouse, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { SectionTear } from '@/components/ui/Ticket';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';

/**
 * Security.
 *
 * The emotional low point of the page — the "is my car safe while I am in
 * another country" worry — and the section given the most room to answer it.
 *
 * ── THIS WAS THE ONE DARK SECTION WE KEPT. IT IS NOW LIGHT TOO ─────────────
 * The August 2026 rebalance lightened the closing CTA and argued this band
 * should stay navy: it answers the page's hardest question, a full-bleed
 * photograph under a heavy scrim gave it gravity, and it carried the site's
 * only justified use of glassmorphism.
 *
 * The client has since said plainly: "nergens donker". Nowhere dark. That
 * settles it, and on inspection the argument for keeping it was weaker than it
 * looked — it rested on the idea that reassurance needs weight, and weight was
 * being read as darkness. A section can be the most substantial thing on a page
 * without being the darkest thing on it.
 *
 * What is kept is the SIZE of the answer: this is still the widest, tallest
 * section on the homepage, still the one with a photograph, and still the one
 * that gets five separate measures rather than a sentence.
 *
 * ── What went, and what that costs ──────────────────────────────────────────
 * The glass panels are gone with the dark band, because glass over nothing is a
 * tinted box pretending to be glass — the exact failure `glass-dark` documents
 * in globals.css. The measures are now hairline cards on the surface. The
 * utility itself stays defined and unused; it is measured and will be right
 * again the moment anything is laid over a photograph.
 *
 * The photograph moves into a contained panel at full strength with no scrim,
 * the same treatment PageHero and ClosingCta now use. It is more visible here
 * than it was under `scrim-band`, not less.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 *   navy-950 heading  on surface ... 16.90:1  AAA
 *   ink-700  body     on surface .... 9.58:1  AAA
 *   ink-500  measure  on surface .... 5.48:1  AA   (14px, needs 4.5)
 *   navy-600 eyebrow  on surface .... 7.08:1  AAA
 * The measure icons are valet-600 at 3.37:1 — below the 4.5 for text and above
 * the 3.0 that non-text graphics need, which is their correct floor: each icon
 * repeats the label beside it and is aria-hidden.
 */

const MEASURES: readonly { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: Video,
    label: '24/7 videobewaking',
    body: 'Camerabewaking en monitoring, het hele jaar door.',
  },
  {
    icon: Lock,
    label: 'Afgesloten parkeerterreinen',
    body: 'Afgesloten en gecontroleerd. Geen vrije toegang.',
  },
  {
    icon: Warehouse,
    label: 'Overdekte parkeergarage',
    body: 'Liever binnen? Beperkt aantal overdekte plaatsen.',
  },
  {
    icon: Award,
    label: 'Vakbekwame chauffeurs',
    body: 'Rijdt er iemand in uw auto, dan is dat onze eigen chauffeur.',
  },
  {
    // ── EV charging. Client, August 2026: a real differentiator he wants
    // surfaced, and none of the competitors on this keyword mention it.
    //
    // The claim is deliberately thin: that it exists, and where. We have not
    // been told how many chargers there are, what a charge costs, whether it
    // has to be requested at booking, or which connector — and every one of
    // those is the first thing an EV driver will ask. Stating any of them
    // without knowing is how a customer arrives expecting a charged car.
    // TODO(client): aantal laadpunten, kosten, en of het vooraf aangevraagd
    // moet worden. Zodra we die hebben, verdient dit een eigen blok in plaats
    // van één regel.
    icon: PlugZap,
    label: 'Elektrisch opladen',
    body: 'Laadpunten op onze eigen parkeerlocatie, voor wie elektrisch rijdt.',
  },
];

export function Security() {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading" className="hidden md:block">
      {/* The seam with the canvas section above. `tone` is not passed — it
          defaults to light, which is what this band now is. */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch="canvas" />
      </Container>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow rule>Maximale beveiliging</Eyebrow>
            <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[18ch]">
              Uw auto is veilig terwijl u zorgeloos reist
            </h2>
            <p className="text-lead text-muted mt-6 max-w-[52ch]">
              Bij Lang Parkeren Schiphol staat veiligheid voorop. Vanaf het moment van inleveren tot
              uw terugkeer, houden we volledige controle.
            </p>

            {/* The one link out of this band, and it belongs here rather than
                anywhere else on the homepage: this is the section that raises
                the question "what happens to my car when I am not there", and
                ride registration is the only answer on the site that is a
                system rather than a claim. Valet-only, which the line says
                rather than leaving a shuttle customer to click and find out. */}
            <p className="text-muted mt-8 max-w-[52ch] text-sm leading-relaxed">
              Bij valet parking wordt daarnaast iedere rit met uw auto digitaal geregistreerd —
              route, snelheid en duur.
            </p>
            <Button href="/digitale-ritregistratie/" variant="outline" className="mt-5">
              Bekijk de digitale ritregistratie
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
          </Reveal>

          {/* ── The EV frame, and why it took this slot ─────────────────────
              This was `lotShuttle` — his terrain under the shuttle. It moved
              aside for `evCharging` because the EV claim is the newest thing on
              this band and was the only measure here with nothing behind it:
              four of the five are states of a car park, which the terrain photo
              showed adequately, while "elektrisch opladen" was an assertion.
              Now it is a photograph of his own charger, his own garage and his
              own staff member plugging in.

              The terrain is not lost — it still carries /veilig-parkeren-
              schiphol/, the shuttle page's hero and the samenwerken band.

              The frame is 3:2 and this slot is 4:3, so the crop trims the
              sides. object-[38%_50%] keeps the charge point and the connector —
              the part that makes the point — inside the frame; centred, the
              charger's left edge falls off. */}
          <Reveal delay={80}>
            <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
              <Photo
                name="evCharging"
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover object-[38%_50%]"
              />
            </div>
          </Reveal>
        </div>

        <Stagger as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {MEASURES.map((measure) => (
            <div
              key={measure.label}
              className="border-line bg-canvas flex h-full flex-col gap-3 rounded-xl border px-6 py-7"
            >
              <measure.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
              <span className="text-heading text-sm leading-snug font-semibold">
                {measure.label}
              </span>
              <span className="text-muted text-sm leading-relaxed">{measure.body}</span>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
