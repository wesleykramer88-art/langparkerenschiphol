'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Counts to a number once, when it first enters the viewport.
 *
 * Formatted with Intl in nl-NL, so 4.7 renders as "4,7" — a Dutch reader sees a
 * decimal comma or the number reads as foreign. This is the same class of detail
 * as the date format: cheap to get right, expensive to get wrong.
 *
 * Rendered in tabular figures with the final string reserving its own width, so
 * the surrounding layout cannot reflow as digits change. A count-up that nudges
 * its neighbours around is worse than no count-up.
 *
 * Reduced-motion users get the final value immediately.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1100,
  prefix = '',
  suffix = '',
  className,
}: {
  to: number;
  decimals?: number;
  /** Milliseconds for the full count. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ rootMargin: '0px 0px -60px 0px' });
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  const format = (n: number) =>
    new Intl.NumberFormat('nl-NL', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);

  useEffect(() => {
    if (!inView || prefersReduced) return;

    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      // Same deceleration as --ease-settle: the number arrives rather than stops.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, prefersReduced, to, duration]);

  const display = prefersReduced || !inView ? to : value;

  return (
    <span ref={ref} className={cn('numeric tabular-nums', className)}>
      {/* Reserves the final width so the layout cannot shift while counting. */}
      <span aria-hidden className="inline-block" style={{ minWidth: '1ch' }}>
        {prefix}
        {format(display)}
        {suffix}
      </span>
      {/* AT reads the destination once, not every intermediate frame. */}
      <span className="sr-only">
        {prefix}
        {format(to)}
        {suffix}
      </span>
    </span>
  );
}
