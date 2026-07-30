'use client';

import { useEffect, useState } from 'react';

/**
 * Page transition: fade and 8px of rise, 300ms.
 *
 * A template rather than a layout, because Next remounts a template on every
 * navigation — which is exactly the boundary a route transition needs.
 *
 * It deliberately does NOT animate the first paint. The hero is this site's LCP
 * element, and fading it in on arrival would push the largest paint back by the
 * length of the transition for no benefit — nobody perceives the first page of a
 * visit as a "transition". The flag lives at module scope, starts false in both
 * the server render and the fresh client bundle (so hydration matches), and is
 * set once the first template has mounted.
 */
let hasNavigated = false;

export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  // Captured once, at mount. It must be decided before the first paint — set
  // after mount instead, the class would land a frame late and flash.
  const [animate] = useState(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  // The animation includes a transform, which briefly makes this element the
  // containing block for any position:fixed descendant. That is only true while
  // it runs (300ms, no fill), and the one fixed element on the site — the mobile
  // booking bar — is off-screen at the top of a fresh navigation anyway.
  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
