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

/**
 * All five are the client's final copy, August 2026. His document gives exactly
 * these five, in this order, with the same labels this band already carried in
 * all but wording — so the band's shape is untouched and only the sentences moved.
 *
 * The bodies are a little longer than the ones they replace, which is what the
 * card's `leading-relaxed` and five-column grid were already sized for; the
 * longest of them wraps to four lines at lg against the previous three.
 */
const MEASURES: readonly { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: Video,
    label: '24/7 camerabewaking',
    body: 'Onze parkeerlocaties zijn voorzien van camerabewaking en worden het hele jaar door gemonitord.',
  },
  {
    icon: Lock,
    label: 'Afgesloten parkeerterreinen',
    body: 'Onze parkeerlocaties zijn afgesloten en niet vrij toegankelijk voor onbevoegden.',
  },
  {
    icon: Warehouse,
    label: 'Overdekt parkeren',
    body: 'Uw auto liever binnen parkeren? Er is een beperkt aantal overdekte parkeerplaatsen beschikbaar.',
  },
  {
    icon: Award,
    label: 'Ervaren chauffeurs',
    body: 'Bij valet parkeren wordt uw auto uitsluitend door onze chauffeurs verplaatst.',
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
    body: 'Rijdt u elektrisch? Tijdens uw reis kan uw auto worden opgeladen bij een van onze laadpunten.',
  },
];

export function Security() {
  return (
    <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading">
      {/* The seam with the canvas section above. `tone` is not passed — it
          defaults to light, which is what this band now is. */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch="canvas" />
      </Container>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            {/* His document heads this section "Veilig parkeren bij Schiphol"
                and subtitles it with the line below, so the H1 becomes the
                eyebrow and the H2 becomes the heading. "Maximale beveiliging"
                is not a loss: it was a superlative where his label is the query
                a visitor actually types. */}
            <Eyebrow rule>Veilig parkeren bij Schiphol</Eyebrow>
            <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[18ch]">
              Uw auto veilig geparkeerd terwijl u op reis bent
            </h2>
            <p className="text-lead text-muted mt-6 max-w-[52ch]">
              Uw auto achterlaten tijdens een vakantie of zakenreis vraagt om vertrouwen. Daarom
              staat veiligheid bij Lang Parkeren Schiphol centraal.
            </p>

            {/* The one link out of this band, and it belongs here rather than
                anywhere else on the homepage: this is the section that raises
                the question "what happens to my car when I am not there", and
                ride registration is the only answer on the site that is a
                system rather than a claim. Valet-only, which the line says
                rather than leaving a shuttle customer to click and find out. */}
            <p className="text-muted mt-8 max-w-[52ch] text-sm leading-relaxed">
              Uw auto wordt tijdens uw reis geparkeerd op een afgesloten en bewaakte parkeerlocatie.
              Bij valet parkeren wordt bovendien iedere rit met uw auto digitaal geregistreerd,
              inclusief route en snelheid.
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

        {/* ── The children are <div>, and that is not a downgrade ─────────────
            <Stagger as="ul"> wraps every child in its own <Reveal as="li">, so an
            <li> here produced <li><li>…</li></li>: invalid HTML, and React threw
            a hydration mismatch on the homepage that discarded and re-rendered
            this whole subtree on the client.
            Pre-existing, found while verifying the August 2026 copy pass. The
            list semantics are unchanged — the <li> is still there, it is just
            emitted by <Stagger> rather than by this file. */}
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
