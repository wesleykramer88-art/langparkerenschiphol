'use client';

import { useEffect, useState } from 'react';
import type { ServiceSlug } from '@/lib/booking';

export type LivePrice = {
  total: number;
  currency: string;
  from: boolean;
  covered: boolean;
};

/**
 * The real price for a service and date range, fetched through our own route
 * handler.
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
export function useLivePrice(input: {
  service: ServiceSlug;
  arrivalDate: string;
  departureDate: string;
  /** Milliseconds of quiet before asking. */
  delay?: number;
}): LivePrice | null {
  const { service, arrivalDate, departureDate, delay = 450 } = input;

  /**
   * One key identifies one question. Null means there is nothing to ask yet.
   *
   * Everything hangs off this rather than off three separate dependencies, and
   * the ANSWER is stored with the key it answers. That is what makes the whole
   * hook safe without a single reset:
   *
   *  - a stale response cannot be shown, because its key no longer matches
   *  - changing the dates does not need `setPrice(null)` to clear the old
   *    figure; the mismatch clears it during render
   *
   * The second point is not only tidiness. Calling setState synchronously
   * inside an effect forces a second render pass on every date change, and the
   * React Compiler flags it — correctly, since the value is derivable.
   */
  const key =
    arrivalDate && departureDate && departureDate > arrivalDate
      ? `${service}|${arrivalDate}|${departureDate}`
      : null;

  const [answer, setAnswer] = useState<{ key: string; price: LivePrice | null } | null>(null);

  useEffect(() => {
    if (!key) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ service, arrivalDate, departureDate });
        // The trailing slash is load-bearing. `trailingSlash: true` applies to
        // route handlers as well as pages, so `/api/prijs?…` 308s to
        // `/api/prijs/?…`. fetch follows it, so nothing breaks — it just pays
        // an extra round trip on every keystroke-triggered lookup, which is
        // exactly what the debounce exists to avoid.
        const response = await fetch(`/api/prijs/?${params}`, { signal: controller.signal });
        const data = response.ok ? ((await response.json()) as { price: LivePrice | null }) : null;
        setAnswer({ key, price: data?.price ?? null });
      } catch {
        // Includes the abort. Silent by design — see rule 2.
        setAnswer({ key, price: null });
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, service, arrivalDate, departureDate, delay]);

  return key && answer?.key === key ? answer.price : null;
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
