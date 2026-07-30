'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';

/**
 * The four steps.
 *
 * Numbered markers are justified here and nowhere else on the page: this is a
 * genuine sequence, and the order is information the reader needs. Everywhere
 * else on this site a numbered marker would be decoration, which is why there
 * is not one.
 *
 * The numerals are set large, in the mono face, in navy-300 — structure rather
 * than badges. Four filled orange circles with a digit in the middle is the
 * house style of every generated process section; a rule with a tick at each
 * stop is how a route is actually drawn. They are aria-hidden: the order is
 * already carried by the DOM and by the "Stap n:" in each heading, so a screen
 * reader gains nothing from a second copy of the digit.
 *
 * The connector draws as the section scrolls in — scaleX on desktop where the
 * timeline is horizontal, scaleY on mobile where it is vertical — and each
 * step's tick resolves as the line reaches it. Both are driven off one scroll
 * progress value, so a tick can never fire ahead of the line that is supposed
 * to have reached it.
 *
 * This is the one scroll-linked animation on the site. It uses motion because
 * scroll-linked interpolation is exactly what motion is for; every other reveal
 * on the page is the CSS/IntersectionObserver primitive.
 */

const STEPS = [
  {
    title: 'Reserveer direct.',
    body: 'In slechts 2 minuten kunt u uw parkeerplaats bij Lang Parkeren Schiphol veiligstellen.',
  },
  {
    title: 'Wij staan klaar.',
    body: 'Bij aankomst op Schiphol of in onze garage staan we voor u klaar.',
  },
  {
    title: 'Vertrek ontspannen.',
    body: 'Wij zorgen voor de rest terwijl u met een gerust hart incheckt.',
  },
  {
    title: 'Auto klaar bij terugkomst.',
    body: 'Wanneer u terugkomt, staat uw auto netjes voor u klaar.',
  },
] as const;

export function HowItWorks() {
  const prefersReduced = useReducedMotion();
  const timelineRef = useRef<HTMLOListElement>(null);

  // Starts when the list is a little above the fold, completes before it leaves
  // the middle of the screen — so the line has finished drawing while the reader
  // is still looking at it, not after they have scrolled past.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.6'],
  });

  return (
    <Section id="zo-werkt-het" spacing="lg" aria-labelledby="stappen-heading">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow rule>Zo werkt het</Eyebrow>
            <h2 id="stappen-heading" className="text-display-lg mt-5">
              Geregeld in 4 eenvoudige stappen
            </h2>
          </div>
          <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
            Van reservering tot terugkomst duurt de hele overdracht bij elkaar niet langer dan een
            paar minuten.
          </p>
        </Reveal>

        <ol
          ref={timelineRef}
          className="relative mt-14 grid gap-12 lg:mt-20 lg:grid-cols-4 lg:gap-10"
        >
          {/* The track. Two orientations, one progress value — only one of the
              two is ever visible, so they cannot disagree. */}
          <Track progress={scrollYProgress} static={Boolean(prefersReduced)} />

          {STEPS.map((step, index) => (
            <Step
              key={step.title}
              index={index}
              title={step.title}
              body={step.body}
              progress={scrollYProgress}
              static={Boolean(prefersReduced)}
            />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function Track({ progress, static: isStatic }: { progress: MotionValue<number>; static: boolean }) {
  return (
    <>
      {/* Mobile: vertical, running down the left gutter the numerals sit in. */}
      <div
        aria-hidden
        className="bg-line-strong absolute top-3 bottom-6 left-[0.4375rem] w-px lg:hidden"
      >
        <motion.div
          className="bg-accent h-full w-px origin-top"
          style={isStatic ? undefined : { scaleY: progress }}
        />
      </div>

      {/* Desktop: horizontal, on the ticks' centre line. */}
      <div
        aria-hidden
        className="bg-line-strong absolute top-[0.4375rem] right-0 left-0 hidden h-px lg:block"
      >
        <motion.div
          className="bg-accent h-px w-full origin-left"
          style={isStatic ? undefined : { scaleX: progress }}
        />
      </div>
    </>
  );
}

function Step({
  index,
  title,
  body,
  progress,
  static: isStatic,
}: {
  index: number;
  title: string;
  body: string;
  progress: MotionValue<number>;
  static: boolean;
}) {
  // The tick resolves over the slice of the scroll during which the line is
  // passing it, so it reads as the line arriving rather than as its own
  // independent animation.
  const start = index / STEPS.length;
  const scale = useTransform(progress, [start, start + 0.12], [0.4, 1], { clamp: true });
  const opacity = useTransform(progress, [start, start + 0.08], [0.25, 1], { clamp: true });

  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-x-6 lg:block">
      {/* The tick on the rule. A small square rather than a circle: it reads as
          a stop marked on a route, and it is the only shape on this page that
          is not rounded, which is what makes it register at 14px. */}
      <motion.span
        aria-hidden
        style={isStatic ? undefined : { scale, opacity }}
        // `block` is load-bearing. At lg the <li> becomes display:block, and a
        // <span> in normal flow is inline — width and height simply do not
        // apply, so the tick collapsed to nothing on exactly the breakpoint
        // where the timeline is horizontal and it matters most. On mobile the
        // grid blockified it, which is why it looked fine there.
        className="bg-accent ring-canvas relative z-10 mt-0.5 block size-3.5 shrink-0 rotate-45 rounded-xs ring-8 lg:mt-0"
      />

      <div className="lg:mt-8 lg:pr-8">
        <p aria-hidden className="ghost-numeral text-numeral text-6xl lg:text-7xl">
          {String(index + 1).padStart(2, '0')}
        </p>

        <h3 className="text-heading mt-5 text-lg font-semibold">
          {/* The digit is decorative in the numeral above; it belongs to the
              heading for anyone who cannot see it. */}
          <span className="sr-only">Stap {index + 1}: </span>
          {title}
        </h3>
        <p className="text-muted mt-2.5 max-w-[34ch] text-sm leading-relaxed sm:text-base">
          {body}
        </p>
      </div>
    </li>
  );
}
