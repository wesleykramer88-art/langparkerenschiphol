import { Award, Lock, Video, Warehouse, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTear } from '@/components/ui/Ticket';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';

/**
 * Security.
 *
 * The emotional low point of the page — the "is my car safe while I am in
 * another country" worry — and the only section given the full width of a
 * photograph to answer it. It was previously a 34rem thumbnail beside four
 * bordered pills, which is a small answer to a large question.
 *
 * The photograph is his own terrain — rows of Dutch yellow plates with the
 * orange shuttle running along the top of the frame. It replaced an amber-lit
 * stock deck that was prettier and German-plated; on a section whose entire job
 * is "your car is safe HERE", a photograph of somebody else's car park was
 * answering a different question.
 *
 * It is the same photograph the shuttle card above uses, cropped and graded
 * differently: a small 16:10 card of the rows, and a full-bleed band pulled up
 * to the bus line under a heavy navy scrim. Until the client's next shoot lands
 * there are four photographs for five placements, and this is the pair where a
 * repeat costs least — the treatments share no visible framing.
 *
 * This is also the one place glassmorphism appears. The four measures sit in
 * glass panels ON the photograph, where there is genuinely something behind
 * them to refract. Used on a flat background it is a tinted box pretending to
 * be glass, which is how it usually shows up.
 *
 * The seam above carries the ticket perforation: the divider is punched out of
 * the white section above, so the notches are painted `surface`. The section
 * itself must NOT clip — the punches overhang upward past its top edge, and
 * that overhang is what makes them read as holes rather than as half-circles.
 * Clipping is therefore done by the photograph's own wrapper.
 */

const MEASURES: readonly { icon: LucideIcon; label: string }[] = [
  { icon: Video, label: '24/7 videobewaking' },
  { icon: Lock, label: 'Afgesloten parkeerterreinen' },
  { icon: Warehouse, label: 'Overdekte parkeergarage' },
  { icon: Award, label: 'Vakbekwame chauffeurs' },
];

export function Security() {
  return (
    <Section tone="inverse" spacing="lg" aria-labelledby="beveiliging-heading">
      {/* The photograph and its scrim. Clipped here, not on the section. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Photo
          name="lotShuttle"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          // Pulled up to the bus line: the top third of the frame carries the
          // shuttle and the far rows, which is the part that reads at band size.
          imageClassName="object-cover object-[center_28%]"
        />
        <div className="scrim-band absolute inset-0" />
      </div>

      {/* Sits on the seam with the white section above, hence notch="surface". */}
      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch="surface" tone="dark" />
      </Container>

      <Container className="relative">
        <Reveal className="max-w-184">
          <Eyebrow rule tone="accent">
            Maximale beveiliging
          </Eyebrow>
          <h2
            id="beveiliging-heading"
            className="text-display-lg text-heading-inverse mt-5 max-w-[18ch]"
          >
            Uw auto is veilig terwijl u zorgeloos reist
          </h2>
          <p className="text-lead text-navy-100 mt-6 max-w-[52ch]">
            Bij Lang Parkeren Schiphol staat veiligheid voorop. Vanaf het moment van inleveren tot
            uw terugkeer, houden we volledige controle.
          </p>
        </Reveal>

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {MEASURES.map((measure) => (
            <div
              key={measure.label}
              className="glass-dark flex h-full flex-col gap-4 rounded-xl px-6 py-7"
            >
              <measure.icon className="text-valet-400 size-6" strokeWidth={1.75} aria-hidden />
              <span className="text-heading-inverse text-sm leading-snug font-medium">
                {measure.label}
              </span>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
