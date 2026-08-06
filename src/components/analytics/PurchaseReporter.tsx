'use client';

import { useEffect } from 'react';
import { clearPendingBooking, readPendingBooking, trackPurchase } from '@/lib/analytics';

/**
 * Reports the booking conversion, on the thank-you page, once.
 *
 * ── Why here and nowhere else ───────────────────────────────────────────────
 * This is the client's own definition of a conversion: every step completed,
 * paid, and landed on this page. Reporting earlier — when ParkingPro says a
 * reservation record exists — would count bookings whose payment never
 * settled, and an ad account bidding to a ROAS target would then optimise
 * towards traffic that abandons at iDEAL.
 *
 * ── The two ways a visitor gets here ────────────────────────────────────────
 *   1. ONLINE PAYMENT — nearly all bookings. ParkingPro redirects here after
 *      the provider settles and appends `reservationCode` and `totalWithTax`.
 *      They confirmed on 2026-08-06 that `reservationAdded` is NOT emitted on
 *      this path, so the query string is the only evidence we get. Both values
 *      arrive as props, read and bounded on the server.
 *
 *   2. A reservation made WITHOUT the online payment flow. `reservationAdded`
 *      does fire there, so ParkingProFrame stashed the value and pushed us here
 *      with `?ref=`.
 *
 * The URL wins over the stash whenever it carries a value. On path 1 the stash
 * is empty anyway; on the rare occasion both exist, ParkingPro's own figure for
 * this reservation beats one this tab happened to be holding.
 *
 * ── What stops a bare visit counting ────────────────────────────────────────
 * A bookmark, a shared link or a back-button lands here with no reference and
 * no stash, and reports nothing. Something has to have been left behind by an
 * actual completed booking.
 */
export function PurchaseReporter({
  reference,
  urlValue = null,
  fromOnlinePayment = false,
}: {
  reference: string | null;
  /** `totalWithTax` from ParkingPro's redirect, already bounded. */
  urlValue?: number | null;
  /** True when `reservationCode` was present — i.e. path 1. */
  fromOnlinePayment?: boolean;
}) {
  useEffect(() => {
    /**
     * If ParkingPro honours `returnUrl` by redirecting the IFRAME rather than
     * the tab, this page is now rendering inside a 600px box on our own booking
     * page — the whole site, nested in itself. Climb out first.
     *
     * Deliberately before the conversion fires, not after. Breaking out reloads
     * this page at the top level, where the reporter runs again; firing here
     * first would consume the stash and leave that second run with nothing to
     * report. Same-origin, so the top-level run shares this sessionStorage.
     *
     * If the navigation is refused — a sandbox without top-navigation, a
     * cross-origin top we are not allowed to move — we fall through and report
     * from inside the frame. A conversion in an iframe still counts; an ugly
     * page is worth less than a lost booking.
     */
    if (window.top && window.top !== window.self) {
      try {
        window.top.location.replace(window.location.href);
        return;
      } catch {
        // Refused. Report from here instead.
      }
    }

    const pending = readPendingBooking();

    // No stash and no reference: not a booking, just a visit to the URL.
    if (!pending && !reference) return;

    /**
     * Trust the stashed value only when it belongs to THIS reservation.
     *
     * They disagree when a visitor books twice in one tab and the second
     * booking's stash is still sitting there — rare, but attaching the wrong
     * booking's revenue is worse than attaching none, and `value_missing` makes
     * the gap visible in GTM rather than silent.
     */
    const sameBooking = !pending?.reference || !reference || pending.reference === reference;

    trackPurchase({
      transactionId: reference ?? pending?.reference ?? null,
      value: urlValue ?? (sameBooking ? (pending?.value ?? null) : null),
      currency: pending?.currency,
      source: fromOnlinePayment ? 'online-payment' : 'in-frame',
    });

    clearPendingBooking();
  }, [reference, urlValue, fromOnlinePayment]);

  return null;
}
