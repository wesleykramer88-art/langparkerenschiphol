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
 *   1. Payment finished inside the iframe. ParkingProFrame stashed the value
 *      and pushed us here with `?ref=`. Reference and value both in hand.
 *
 *   2. The payment provider took over the whole tab and ParkingPro's own return
 *      URL brought them back. There is no `?ref=` on that path — we never got
 *      to add one — so the stash left behind before the tab was taken over is
 *      the only evidence the booking happened, and the only copy of its value.
 *
 * Path 2 is why this reports off the stash and not only off the URL. It is also
 * why the previous shape of this component was ineffective: it required a `?ref=`
 * that path 2 never has, so the one case it existed to cover was the one case it
 * could not fire on.
 *
 * ── What stops a bare visit counting ────────────────────────────────────────
 * A bookmark, a shared link or a back-button lands here with no `?ref=` and no
 * stash, and reports nothing. Something has to have been left behind by an
 * actual completed booking in this tab.
 */
export function PurchaseReporter({ reference }: { reference: string | null }) {
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
      value: sameBooking ? (pending?.value ?? null) : null,
      currency: pending?.currency,
      source: reference ? 'in-frame' : 'returned-from-payment',
    });

    clearPendingBooking();
  }, [reference]);

  return null;
}
