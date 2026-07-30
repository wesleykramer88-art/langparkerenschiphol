'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Reads the OS "reduce motion" preference and keeps up if it changes mid-session.
 *
 * Implemented with useSyncExternalStore rather than useState + useEffect:
 * matchMedia IS an external store, and this is the idiom React provides for
 * subscribing to one. It also avoids the cascading re-render that setting state
 * inside an effect would cause on every mount.
 *
 * globals.css already collapses every CSS animation and transition for these
 * users. This hook is the JS half of the same promise: reveal components use it
 * to render content in its FINAL position rather than mounting it hidden and
 * relying on a 0.01ms transition to bring it back.
 */
function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** No preference is knowable during SSR; assume motion is fine and correct
 *  after hydration. Returns a primitive, so there is no tearing. */
function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
