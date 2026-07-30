/**
 * Analytics consent, modelled as an external store.
 *
 * localStorage is genuinely external state, so it is read through
 * useSyncExternalStore rather than mirrored into React state by an effect. That
 * also gives correct SSR behaviour for free: React uses the server snapshot
 * (null — "undecided") while hydrating, then switches to the real value, so the
 * banner cannot appear in the static HTML and cannot become the LCP element.
 */

const STORAGE_KEY = 'lps-consent';

export type Consent = 'granted' | 'denied';

let listeners: Array<() => void> = [];

/** Cached so getSnapshot returns a referentially stable value; without this,
 *  React would re-render forever on a store that reads storage every call. */
let cached: Consent | null | undefined;

function read(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    // Private mode, or storage disabled by policy. Treat as undecided — we ask
    // again rather than assuming permission.
    return null;
  }
}

export function subscribeToConsent(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

export function getConsentSnapshot(): Consent | null {
  if (cached === undefined) cached = read();
  return cached;
}

/** Undecided during SSR, always. */
export function getConsentServerSnapshot(): Consent | null {
  return null;
}

export function setConsent(value: Consent) {
  cached = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Non-fatal: the choice still holds for this page view.
  }
  for (const listener of listeners) listener();
}
