'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

/**
 * A numbered sequence, drawn as a route.
 *
 * Numbered markers are justified where the ORDER is information the reader
 * needs, and nowhere else — everywhere else on this site a numbered marker
 * would be decoration, which is why there is not one.
 *
 * The numerals are set large, in the mono face, in --color-numeral: structure
 * rather than badges. Filled orange circles with a digit in the middle is the
 * house style of every generated process section; a rule with a tick at each
 * stop is how a route is actually drawn. They are aria-hidden, because the
 * order is already carried by the DOM and by the "Stap n:" in each heading, so
 * a screen reader gains nothing from a second copy of the digit.
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
 *
 * ── Extracted from HowItWorks, August 2026 ──────────────────────────────────
 * It was four hard-coded steps inside the homepage process band. The digitale
 * ritregistratie page needs the same treatment for six, so the count is now a
 * property of the data rather than of the component: the tick timing divides by
 * `steps.length`, and the desktop grid reads its column count from the same
 * number. Do not put a `columns` prop on this — the grid and the tick timing
 * have to agree, and two props that must agree eventually will not.
 */

export type TimelineStep = {
  title: string;
  body: string;
};

/**
 * Column counts for the desktop grid, keyed by step count.
 *
 * A map rather than a template string, because Tailwind scans source for whole
 * class names — `lg:grid-cols-${n}` compiles to nothing at all.
 *
 * Six steps run as ONE row of six, not two rows of three. Two rows was the
 * obvious layout and it breaks the thing this component is for: the connector
 * is a single horizontal rule, so across two rows it would either cut through
 * the second row's numerals or have to be dropped — and dropped, the ticks
 * become six orphan squares marking a route that is not drawn. A route that is
 * not continuous is not a route. Six columns is tight (about 150px at 1280px)
 * and the type is stepped down for it below.
 */
const GRID_COLS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export function Timeline({ steps }: { steps: readonly TimelineStep[] }) {
  const prefersReduced = useReducedMotion();
  const timelineRef = useRef<HTMLOListElement>(null);

  // Starts when the list is a little above the fold, completes before it leaves
  // the middle of the screen — so the line has finished drawing while the reader
  // is still looking at it, not after they have scrolled past.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.6'],
  });

  // Six columns leave about 150px each. The numeral and the body step down at
  // that density so the figure stays a quiet marker rather than the widest
  // thing in its column, and the body stops setting to three words a line.
  const dense = steps.length >= 6;

  return (
    <ol
      ref={timelineRef}
      className={`relative mt-14 grid gap-12 lg:mt-20 lg:gap-10 ${GRID_COLS[steps.length] ?? 'lg:grid-cols-4'}`}
    >
      <Track progress={scrollYProgress} static={Boolean(prefersReduced)} />

      {steps.map((step, index) => (
        <Step
          key={step.title}
          index={index}
          total={steps.length}
          title={step.title}
          body={step.body}
          dense={dense}
          progress={scrollYProgress}
          static={Boolean(prefersReduced)}
        />
      ))}
    </ol>
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
  total,
  title,
  body,
  dense,
  progress,
  static: isStatic,
}: {
  index: number;
  total: number;
  title: string;
  body: string;
  dense: boolean;
  progress: MotionValue<number>;
  static: boolean;
}) {
  // The tick resolves over the slice of the scroll during which the line is
  // passing it, so it reads as the line arriving rather than as its own
  // independent animation.
  const start = index / total;
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

      <div className={dense ? 'lg:mt-8 lg:pr-4' : 'lg:mt-8 lg:pr-8'}>
        <p
          aria-hidden
          className={`ghost-numeral text-numeral text-6xl ${dense ? 'lg:text-5xl' : 'lg:text-7xl'}`}
        >
          {String(index + 1).padStart(2, '0')}
        </p>

        <h3 className={`text-heading mt-5 font-semibold ${dense ? 'text-base' : 'text-lg'}`}>
          {/* The digit is decorative in the numeral above; it belongs to the
              heading for anyone who cannot see it. */}
          <span className="sr-only">Stap {index + 1}: </span>
          {title}
        </h3>
        <p
          className={`text-muted mt-2.5 max-w-[34ch] leading-relaxed ${dense ? 'text-sm' : 'text-sm sm:text-base'}`}
        >
          {body}
        </p>
      </div>
    </li>
  );
}
