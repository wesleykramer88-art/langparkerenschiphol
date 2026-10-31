import { ArrowRight, BusFront, CarFront, MapPin, Phone, Warehouse, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { SectionTear } from '@/components/ui/Ticket';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';

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
    icon: MapPin,
    label: 'Shuttle parkeren buiten',
    body: `Schipholweg 181, ${siteConfig.shuttleParking.postalCode} ${siteConfig.shuttleParking.locality}.`,
  },
  {
    icon: BusFront,
    label: 'Shuttle rijdt doorlopend',
    body: `De transfer naar Schiphol duurt ongeveer ${siteConfig.shuttleParking.transferMinutes} minuten.`,
  },
  {
    icon: Phone,
    label: 'Terug met de shuttle',
    body: 'Loop naar de vaste shuttlehalte op Schiphol Plaza. U hoeft bij terugkomst niet te bellen.',
  },
  {
    icon: CarFront,
    label: 'Valet afgeven',
    body: `${siteConfig.valetHandover.display}.`,
  },
  {
    icon: Warehouse,
    label: 'Valet buiten of overdekt',
    body: 'Bij Valet kiest u tussen buiten parkeren en overdekt parkeren.',
  },
];

export function Security() {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading" className="py-14 md:py-24 lg:py-40">
      {/* The seam with the canvas section above. `tone` is not passed — it
          defaults to light, which is what this band now is. */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch="canvas" />
      </Container>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow rule>Parkeren bij Schiphol</Eyebrow>
            <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[18ch]">
              Heldere afspraken voor Shuttle en Valet
            </h2>
            <p className="text-lead text-muted mt-6 max-w-[52ch]">
              Parkeer buiten bij Shuttle of kies bij Valet voor buiten of overdekt parkeren. De
              dienstverlening verschilt per service; hieronder ziet u waar u naartoe gaat en hoe de
              terugreis werkt.
            </p>

            <Button href="/reservering/" variant="outline" className="mt-8">
              Bekijk beschikbaarheid
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
          </Reveal>

          {/* Use a service image instead of implying an extra parking add-on. */}
          <Reveal delay={80}>
            <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
              <Photo
                name="lotShuttle"
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover object-center"
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
