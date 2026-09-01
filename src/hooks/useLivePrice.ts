'use client';

import { useEffect, useState } from 'react';
import type { ServiceSlug } from '@/lib/booking';

export type LivePriceEntry = {
  total: number;
  currency: string;
  covered: boolean;
};

/** @deprecated Use `useLivePrices` hook instead. Kept for backward compatibility. */
export type LivePrice = {
  total: number;
  currency: string;
  from: boolean;
  covered: boolean;
};

export type LivePrices = {
  /** Outdoor (buiten) price, or null when unavailable. */
  outdoor: LivePriceEntry | null;
  /** Covered (overdekt) price, or null when unavailable. */
  covered: LivePriceEntry | null;
};

type ApiResponse = {
  prices: LivePriceEntry[] | null;
  price: LivePrice | null;
};

/**
 * The real prices for a service and date range, fetched through our own route
 * handler.
 *
 * Returns both outdoor and covered prices so the widget can render them side by
 * side and let the visitor make an informed choice.
 *
 * ── Rules this follows, in order of importance ─────────────────────────────
 *  1. It never blocks anything. There is no loading state that hides the
 *     button, no disabled submit, no spinner over the card. The visitor can
 *     complete the booking whether or not a number ever arrives — ParkingPro
 *     will quote them in the flow regardless, and this is a courtesy shown
 *     beforehand, not a step in the funnel.
 *  2. It fails to nothing. Any error, any timeout, any unavailable product and
 *     the hook returns null; the card falls back to its standing copy without
 *     saying anything went wrong, because from the visitor's point of view
 *     nothing did.
 *  3. It debounces. Both dates change as somebody scrubs through a calendar,
 *     and each change would otherwise be a request.
 *
 * The abort is the part that matters for correctness rather than politeness:
 * without it, two in-flight requests can resolve out of order and the card
 * settles on the price for a date range the visitor has already moved off.
 */
export function useLivePrices(input: {
  service: ServiceSlug;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  /** Milliseconds of quiet before asking. */
  delay?: number;
}): LivePrices | null {
  const { service, arrivalDate, arrivalTime, departureDate, departureTime, delay = 450 } = input;

  /**
   * One key identifies one question. Null means there is nothing to ask yet.
   *
   * Everything hangs off this rather than off three separate dependencies, and
   * the ANSWER is stored with the key it answers. That is what makes the whole
   * hook safe without a single reset:
   *
   *  - a stale response cannot be shown, because its key no longer matches
   *  - changing the dates does not need `setPrices(null)` to clear the old
   *    figures; the mismatch clears them during render
   */
  const key =
    arrivalDate &&
    arrivalTime &&
    departureDate &&
    departureTime &&
    `${departureDate}T${departureTime}` > `${arrivalDate}T${arrivalTime}`
      ? `${service}|${arrivalDate}|${arrivalTime}|${departureDate}|${departureTime}`
      : null;

  const [answer, setAnswer] = useState<{ key: string; prices: LivePrices | null } | null>(null);

  useEffect(() => {
    if (!key) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          service,
          arrivalDate,
          arrivalTime,
          departureDate,
          departureTime,
        });
        // The trailing slash is load-bearing. `trailingSlash: true` applies to
        // route handlers as well as pages, so `/api/prijs?…` 308s to
        // `/api/prijs/?…`. fetch follows it, so nothing breaks — it just pays
        // an extra round trip on every keystroke-triggered lookup, which is
        // exactly what the debounce exists to avoid.
        const response = await fetch(`/api/prijs/?${params}`, { signal: controller.signal });
        if (!response.ok) {
          setAnswer({ key, prices: null });
          return;
        }
        const data = (await response.json()) as ApiResponse;
        const entries = data.prices;

        if (!entries || entries.length === 0) {
          setAnswer({ key, prices: null });
          return;
        }

        const outdoor = entries.find((e) => !e.covered) ?? null;
        const covered = entries.find((e) => e.covered) ?? null;
        setAnswer({ key, prices: { outdoor, covered } });
      } catch {
        // Includes the abort. Silent by design — see rule 2.
        setAnswer({ key, prices: null });
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, service, arrivalDate, arrivalTime, departureDate, departureTime, delay]);

  return key && answer?.key === key ? answer.prices : null;
}

/**
 * @deprecated Prefer `useLivePrices`. Kept so any call site that still uses the
 * single-price interface continues to compile and work unchanged.
 */
export function useLivePrice(input: {
  service: ServiceSlug;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  delay?: number;
}): LivePrice | null {
  const prices = useLivePrices(input);
  if (!prices) return null;

  const { outdoor, covered } = prices;
  if (!outdoor && !covered) return null;

  // Return the cheapest available as the legacy single-price shape.
  const cheapest =
    outdoor && covered
      ? outdoor.total <= covered.total
        ? outdoor
        : covered
      : (outdoor ?? covered)!;

  return {
    total: cheapest.total,
    currency: cheapest.currency,
    from: Boolean(outdoor && covered && outdoor.total !== covered.total),
    covered: cheapest.covered,
  };
}

/** €&nbsp;201,49 — Dutch formatting, which puts the symbol before the amount
 *  and uses a comma for the decimal. */
export function formatPrice(total: number, currency: string): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(total);
}
