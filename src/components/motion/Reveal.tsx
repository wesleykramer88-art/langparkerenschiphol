'use client';

import { Children, isValidElement } from 'react';
import { cn } from '@/lib/cn';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Tags a reveal may render as. Kept narrow so callers stay semantic. */
type RevealElement = 'div' | 'section' | 'li' | 'article' | 'header' | 'p';

/**
 * Scroll reveal: 16px of travel and a fade, once, on first entry.
 *
 * Restraint is the point. Anything beyond ~16px of travel, or any scale or
 * rotation, reads as cheap and is the clearest tell of a generated design.
 *
 * Deliberately NOT motion/Framer. Reveals appear on every section of this page,
 * so using the animation runtime for them would pull ~34KB into the route chunk
 * of pages that animate nothing above the fold. This is an IntersectionObserver
 * and a CSS transition. motion is reserved for the hero load sequence and the
 * timeline scrub, where it earns its weight.
 *
 * Reduced-motion users get the content immediately in its final position — no
 * transform, no transition, and no invisible first frame.
 */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  /** Milliseconds. Prefer <Stagger> for sequences. */
  delay?: number;
  as?: RevealElement;
}) {
  const prefersReduced = usePrefersReducedMotion();
  // -80px bottom margin: start the reveal slightly before the element is fully
  // on screen, so it has finished by the time the reader's eye arrives.
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '0px 0px -80px 0px' });

  const shown = inView || prefersReduced;

  // Widened to ElementType because the props of the allowed tags have no common
  // supertype — intersecting them yields a ref type no element can satisfy.
  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      className={cn('reveal', shown && 'reveal-shown', className)}
      style={prefersReduced ? undefined : { transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Reveals its children in sequence, 80ms apart.
 *
 * Each child is wrapped in its own <Reveal> with an incrementing delay, so a
 * card grid resolves across rather than snapping in as one block. Keep grids to
 * 4–5 items: at 80ms, a six-item grid takes 480ms to finish, which starts to
 * feel slow rather than orchestrated.
 */
export function Stagger({
  children,
  step = 80,
  delay = 0,
  className,
  childClassName,
  as = 'div',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  /** Milliseconds between each child. */
  step?: number;
  /** Milliseconds before the first child. */
  delay?: number;
  childClassName?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  // A list wrapper must stagger <li> children, or the markup is invalid.
  const childAs: RevealElement = as === 'ul' || as === 'ol' ? 'li' : 'div';
  const Component = as as React.ElementType;

  return (
    <Component className={className} {...props}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return (
          <Reveal as={childAs} delay={delay + index * step} className={childClassName}>
            {child}
          </Reveal>
        );
      })}
    </Component>
  );
}
