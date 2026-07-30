'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when an element first enters the viewport.
 *
 * Deliberately a bare IntersectionObserver rather than motion's `whileInView`.
 * Scroll reveals appear on nearly every section of this site, so using motion
 * for them would pull ~34KB of animation runtime into the route chunk of pages
 * that animate nothing above the fold. This is roughly 400 bytes and produces
 * the identical 14px-and-fade result via a CSS transition. motion stays reserved
 * for the one place it earns its weight: the hero's orchestrated load sequence.
 *
 * There is no "IntersectionObserver is missing" branch here on purpose. The
 * hidden starting state is applied by CSS only under `html.js`, and the inline
 * bootstrap in the root layout sets that class only when IntersectionObserver
 * actually exists. A browser without it — or with JS off entirely — never gets
 * the hidden state, so content cannot be stranded invisible.
 */
export function useInView<T extends HTMLElement>(options?: {
  /** Start the reveal slightly before the element is fully on screen. */
  rootMargin?: string;
  threshold?: number;
}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  const rootMargin = options?.rootMargin ?? '0px 0px -12% 0px';
  const threshold = options?.threshold ?? 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Set from the observer callback, not the effect body: this is the
        // external system notifying React, which is exactly what effects are for.
        setInView(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}
