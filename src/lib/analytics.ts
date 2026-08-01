/**
 * The dataLayer contract between this site and GTM container GTM-WJXJ44J6.
 *
 * ── Why GTM and not gtag.js ─────────────────────────────────────────────────
 * The client's container already has both destinations wired into it:
 *
 *   G-N2KKPQR770   Google Analytics 4
 *   AW-934465672   Google Ads
 *
 * So the site loads ONE script and pushes ONE well-formed event. Which tags
 * fire, and what a conversion is worth, is configured in GTM by whoever runs
 * the ad account — not redeployed by us. Next's own third-party guide says the
 * same thing: with GTM present, configure GA4 inside it rather than shipping a
 * second gtag.js. Two GA4 loads on one page double-count every session.
 *
 * ── This file never names a tag ─────────────────────────────────────────────
 * There is no AW- or G- id anywhere in this codebase, deliberately. The site's
 * job ends at "a booking completed and it was worth €X". Mapping that onto a
 * Google Ads conversion action is a GTM concern, and keeping it there means a
 * change of conversion action, of value rules, or of ad account is a GTM
 * publish rather than a code change and a deploy.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * The one event the booking flow emits. Named `purchase` because that is the
 * GA4 reserved e-commerce event — GA4 recognises `value` and `currency` on it
 * without configuration, and the Ads conversion tag can read the same fields.
 */
export const PURCHASE_EVENT = 'purchase';

/** Everything ParkingPro quotes and charges is in euro. */
export const DEFAULT_CURRENCY = 'EUR';

// ---------------------------------------------------------------------------
// Reading a price out of somebody else's payload
// ---------------------------------------------------------------------------

/**
 * Coerce one field to a positive amount, or null.
 *
 * Strings are accepted because a JSON payload assembled by a .NET back end may
 * serialise a decimal as `"201.49"`, and a Dutch-cultured one as `"201,49"` or
 * even `"€ 1.201,49"`. Getting that wrong is not a rounding error — read
 * naively, `1.201,49` parses as `1.20` and a €1201 booking is reported to
 * Google Ads as worth one euro twenty. Bidding then optimises away from the
 * most valuable bookings on the site.
 *
 * So the separators are resolved by position rather than assumed: whichever of
 * `.` or `,` appears LAST is the decimal point, and the other is a thousands
 * separator. That reading is correct for both conventions and needs no locale.
 */
function toAmount(input: unknown): number | null {
  if (typeof input === 'number') {
    return Number.isFinite(input) && input > 0 ? input : null;
  }

  if (typeof input !== 'string') return null;

  // Drop everything that is not a digit or a separator: currency symbols,
  // non-breaking spaces, thin spaces used as thousands separators.
  const cleaned = input.replace(/[^\d.,-]/g, '');
  if (!cleaned) return null;

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');

  let normalised: string;
  if (lastDot === -1 && lastComma === -1) {
    normalised = cleaned;
  } else if (lastComma > lastDot) {
    // `1.201,49` — comma is the decimal point.
    normalised = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // `1,201.49` — dot is the decimal point.
    normalised = cleaned.replace(/,/g, '');
  }

  const value = Number.parseFloat(normalised);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Field names that might carry the booking total, most specific first.
 *
 * `totalWithTax` leads because that is what ParkingPro's own public price API
 * returns (see PriceQuote in src/lib/parkingpro.ts), so it is the one name we
 * have actually observed on this instance. The rest are the plausible spellings
 * around it.
 *
 * Order matters and the list is deliberately gross-first. Reporting a net,
 * ex-VAT figure to Google Ads understates every conversion by 21% and quietly
 * drags a ROAS target off by the same amount — the customer paid the gross
 * price, so the gross price is the revenue.
 */
const VALUE_KEYS = [
  'totalWithTax',
  'totalIncVat',
  'totalInclVat',
  'totalIncludingTax',
  'grandTotal',
  'totalPrice',
  'totalAmount',
  'total',
  'amount',
  'price',
] as const;

/** Sub-objects worth looking inside before giving up. */
const NESTED_KEYS = ['price', 'prices', 'total', 'totals', 'payment', 'order', 'amounts'] as const;

/**
 * Best-effort extraction of the booking value from ParkingPro's
 * `reservationAdded` payload.
 *
 * UNVERIFIED, and it has to be. The payload shape is not documented anywhere we
 * have access to, and this instance's own flow is the only place it can be
 * observed — so this reads defensively across the plausible names rather than
 * asserting one. Returning null is a valid answer: the caller reports the
 * conversion without a value and flags it, which is recoverable. Reporting a
 * confidently wrong number is not.
 *
 * Once the real key is confirmed in Tag Assistant against a live booking, this
 * list should be narrowed to it.
 */
export function readReservationValue(reservation: Record<string, unknown> | undefined) {
  if (!reservation) return { value: null, currency: DEFAULT_CURRENCY };

  const currency =
    typeof reservation.currency === 'string' && /^[A-Z]{3}$/.test(reservation.currency)
      ? reservation.currency
      : DEFAULT_CURRENCY;

  for (const key of VALUE_KEYS) {
    const value = toAmount(reservation[key]);
    if (value !== null) return { value, currency };
  }

  // One level down. Not a recursive walk: an unbounded search over a third
  // party's object is how you end up reporting a VAT line or a deposit as the
  // order total.
  for (const key of NESTED_KEYS) {
    const nested = reservation[key];
    if (!nested || typeof nested !== 'object' || Array.isArray(nested)) continue;
    for (const valueKey of VALUE_KEYS) {
      const value = toAmount((nested as Record<string, unknown>)[valueKey]);
      if (value !== null) return { value, currency };
    }
  }

  return { value: null, currency };
}

/** Pull a reservation reference out of the payload without assuming a key. */
export function readReservationReference(
  reservation: Record<string, unknown> | undefined,
): string | null {
  if (!reservation) return null;
  for (const key of ['reservationNumber', 'number', 'reference', 'code', 'id']) {
    const value = reservation[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Firing the conversion
// ---------------------------------------------------------------------------

const FIRED_PREFIX = 'lps-purchase:';

/**
 * Has this reservation already been reported in this tab?
 *
 * sessionStorage rather than a module variable, because the two call sites are
 * on opposite sides of a navigation and one of them may be a cold page load —
 * see the note on the two completion paths below. A module variable is reset by
 * that load and would double-count every booking that takes it.
 */
function alreadyFired(key: string): boolean {
  try {
    return window.sessionStorage.getItem(FIRED_PREFIX + key) !== null;
  } catch {
    // Private mode or storage disabled. Fall through and fire: an occasional
    // duplicate is a smaller error than a silently missing conversion, and
    // Google Ads deduplicates on transaction_id at its end anyway.
    return false;
  }
}

function markFired(key: string) {
  try {
    window.sessionStorage.setItem(FIRED_PREFIX + key, '1');
  } catch {
    // Non-fatal — see above.
  }
}

/**
 * Report a completed booking to GTM, exactly once per reservation per tab.
 *
 * ── Why this is deduplicated rather than fired in one obvious place ─────────
 * A booking can finish along two different paths, and only one of them is the
 * one everybody pictures:
 *
 *   1. Payment completes INSIDE the iframe. ParkingPro posts
 *      `reservationAdded`, ParkingProFrame catches it, and we route to
 *      /reservering/bevestiging/ ourselves. The payload is in hand, so the
 *      value is known. This is the good path.
 *
 *   2. The payment provider takes over the WHOLE TAB. The frame is sandboxed
 *      with `allow-top-navigation-by-user-activation` precisely so iDEAL and
 *      the card flows can do this. No postMessage is ever delivered to us,
 *      because by then our page is gone.
 *
 * Firing only from the message handler misses every booking that takes path 2.
 * Firing only from the thank-you page misses the value, and double-counts on a
 * refresh or a back-button. So both fire, both go through here, and the
 * reservation reference makes the second one a no-op.
 *
 * The reference is also sent as `transaction_id`, which is what lets Google Ads
 * discard a duplicate that slips past this — in a second tab, say, or after the
 * session store is cleared.
 */
export function trackPurchase(input: {
  transactionId: string | null;
  value: number | null;
  currency?: string;
  /** Which path reported it. Surfaces in Tag Assistant while this is bedding in. */
  source: 'iframe' | 'confirmation-page';
}): boolean {
  if (typeof window === 'undefined') return false;

  // With no reference there is nothing to deduplicate ON, so the whole session
  // gets one slot. A visitor who genuinely books twice in one tab without a
  // reference is a case worth losing to avoid double-counting every refresh.
  const key = input.transactionId ?? 'anonymous';
  if (alreadyFired(key)) return false;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: PURCHASE_EVENT,
    transaction_id: input.transactionId ?? undefined,
    value: input.value ?? undefined,
    currency: input.currency ?? DEFAULT_CURRENCY,
    /**
     * True when the booking completed but its value could not be read.
     *
     * This is the field to watch in GTM. A conversion with no value still
     * counts, but it contributes nothing to ROAS, so a container that sees
     * these regularly is a container reporting revenue that is too low — and
     * the failure is otherwise invisible, because the conversion count looks
     * perfectly healthy. Set a GTM trigger exception or an alert on it.
     */
    value_missing: input.value === null,
    booking_source: input.source,
  });

  markFired(key);
  return true;
}

// ---------------------------------------------------------------------------
// Consent Mode v2
// ---------------------------------------------------------------------------

/**
 * Tell Google the visitor has answered the banner.
 *
 * The DEFAULT state is set by an inline script in the root layout, before GTM
 * loads — see buildConsentBootstrap() below for why it cannot live here. This
 * function only handles the visitor changing that answer during the page view.
 *
 * `ad_user_data` and `ad_personalization` are the two signals added in Consent
 * Mode v2. Without them Google Ads treats EEA traffic as non-consented no
 * matter what the other four say, and remarketing audiences stop collecting.
 */
export function updateGoogleConsent(granted: boolean) {
  if (typeof window === 'undefined') return;

  const state = granted ? 'granted' : 'denied';

  /**
   * Called through `window.gtag`, never pushed onto the dataLayer by hand.
   *
   * The gtag shim is `function gtag(){dataLayer.push(arguments)}` — it pushes
   * the live `arguments` OBJECT, and GTM's consent handling keys off exactly
   * that. A plain array pushed in its place looks similar in the debugger and
   * is silently ignored, which would leave every visitor who pressed Accept
   * still recorded as denied.
   *
   * The bootstrap script in the root layout defines `window.gtag` before GTM
   * loads, so it is present here. The shim is only re-created for the case
   * where that script was blocked and the dataLayer array is all we have.
   */
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });

  // Stop redacting ad click identifiers once the visitor has agreed to them.
  window.gtag('set', 'ads_data_redaction', !granted);
}

/**
 * The inline script that sets the Consent Mode DEFAULT, as a string for the
 * root layout to embed.
 *
 * ── Why this is inline and hand-written rather than a component ─────────────
 * It MUST execute before gtm.js does. Consent Mode's whole design is that the
 * default state is on the dataLayer before any tag reads it; a default that
 * lands afterwards is not a default, it is a late update, and everything that
 * fired in between has already fired unconsented. `next/script` with
 * `beforeInteractive` gets close, but the ordering guarantee it offers is
 * relative to Next's own bundles, not to a script we inject from a client
 * component further down the tree. A raw inline <script> in <head> is ordered
 * by the parser, which is the only guarantee that actually holds.
 *
 * ── Why it reads localStorage itself ────────────────────────────────────────
 * A returning visitor who already pressed Accept should not be defaulted to
 * denied and then corrected a moment later. That gap produces a cookieless
 * pageview followed by a consented one for the same visit, which GA4 counts as
 * two sessions from two different users. Reading the stored answer here means
 * the default IS the visitor's standing answer, and `updateGoogleConsent` above
 * only ever handles a change made during this page view.
 *
 * The storage key is passed in from src/lib/consent.ts rather than written out
 * again, so the two cannot drift apart. If they did, every returning visitor
 * would silently revert to denied.
 */
export function buildConsentBootstrap(storageKey: string): string {
  return `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;
var s='denied';
try{if(window.localStorage.getItem(${JSON.stringify(storageKey)})==='granted')s='granted'}catch(e){}
gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',s!=='granted');
gtag('set','url_passthrough',true);
})();`;
}
