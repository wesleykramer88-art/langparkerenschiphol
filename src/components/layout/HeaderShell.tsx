'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

/**
 * Routes whose hero is a dark full-bleed block, over which the header floats
 * transparently until the visitor scrolls past it.
 *
 * On every other route the header is solid from the first paint — a transparent
 * header over the cream canvas would put white wordmark on cream and render the
 * logo invisible.
 */
const OVERLAY_ROUTES = new Set(['/']);

/**
 * Header chrome: transparent over a dark hero, solid white with a hairline
 * border and reduced height once scrolled past 80px.
 *
 * Only this wrapper is a Client Component. It publishes its state as
 * `data-scrolled` on a named group, so the server-rendered logo, nav and buttons
 * inside can restyle themselves with `group-data-[scrolled=true]/header:` —
 * no prop drilling, and the header's contents stay Server Components.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverlay = OVERLAY_ROUTES.has(pathname);

  // The scroll position is external state, so it is read through
  // useSyncExternalStore rather than mirrored into a useState from an effect.
  // That also gets the first read right for free: a restored scroll position or
  // a deep link means the page can already be past the threshold before the
  // first scroll event ever fires.
  //
  // The listener is only attached on overlay routes; everywhere else the header
  // is solid from the first paint and there is nothing to listen for.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!isOverlay) return () => {};
      window.addEventListener('scroll', onChange, { passive: true });
      return () => window.removeEventListener('scroll', onChange);
    },
    [isOverlay],
  );

  const scrolled = useSyncExternalStore(
    subscribe,
    () => !isOverlay || window.scrollY > 80,
    // Server render: solid on ordinary routes, transparent over a dark hero.
    () => !isOverlay,
  );

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'group/header sticky top-0 z-30',
        // The transition is on the inner bar, not here, so the sticky
        // positioning is never itself animated.
      )}
    >
      {children}
    </header>
  );
}
