'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/analytics';

/**
 * The safety net for a booking that never posted `reservationAdded`.
 *
 * ── The failure this exists for ─────────────────────────────────────────────
 * The booking iframe is sandboxed with `allow-top-navigation-by-user-activation`
 * specifically so iDEAL and the card flows can take over the whole tab for
 * payment. When they do, our page is unloaded — the frame's `reservationAdded`
 * message is posted into a window that no longer exists, ParkingProFrame never
 * hears it, and the conversion is simply never reported. The booking completes,
 * the customer is charged, and Google Ads learns nothing.
 *
 * That path is invisible from the code: whether it happens depends on which
 * payment method the customer picked and on ParkingPro's own redirect
 * configuration, neither of which we control. So rather than assume it does or
 * does not, both routes report and the reference deduplicates them.
 *
 * ── Why this one carries no value ───────────────────────────────────────────
 * It cannot. The value lived in the postMessage payload, and on this path that
 * payload was never delivered. Passing it through the URL instead would make it
 * editable by anyone who reads their own address bar, which in an ad account
 * optimising on a ROAS target is a way to poison bidding, not a workaround.
 *
 * So it fires with `value_missing: true`. In GTM that is the signal to watch:
 * it means a real booking was counted with no revenue attached, and if it shows
 * up regularly then the top-level payment path is the normal one and the value
 * has to be recovered server-side instead — from ParkingPro's API against the
 * reference, which is exactly what the reference is here for.
 *
 * Fires only when ParkingPro supplied a reference. Without one there is nothing
 * to deduplicate against, and a bare visit to this URL — a bookmark, a
 * back-button, a shared link — would report a booking that never happened.
 */
export function PurchaseFallback({ reference }: { reference: string | null }) {
  useEffect(() => {
    if (!reference) return;

    // A no-op when the iframe path already reported this reference, which is
    // the common case. trackPurchase owns that decision.
    trackPurchase({
      transactionId: reference,
      value: null,
      source: 'confirmation-page',
    });
  }, [reference]);

  return null;
}
