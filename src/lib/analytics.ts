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
 * The field carrying the booking total.
 *
 * Named by ParkingPro Support on 2026-08-06: `totalWithTax`, gross, in EUR,
 * both in the `reservationAdded` payload and as a query parameter on the
 * post-payment redirect. It matches the field their public price API already
 * returns (PriceQuote in src/lib/parkingpro.ts).
 *
 * This used to be ten plausible spellings searched in order, plus a one-level
 * walk into nested objects, because the payload was undocumented and guessing
 * beat reporting nothing. The vendor has now named the field, so the guessing
 * is gone — a search that can still find `price` somewhere is a search that can
 * report a VAT line or a deposit as the order total.
 *
 * Gross, deliberately: an ex-VAT figure understates every conversion by 21% and
 * drags a ROAS target off by the same amount. The customer paid the gross
 * price, so the gross price is the revenue.
 */
const VALUE_KEY = 'totalWithTax';

/**
 * The largest booking value this site will report.
 *
 * Not a business rule — a poison guard, and it is needed now in a way it was
 * not before. `totalWithTax` arrives in the QUERY STRING on the payment
 * redirect, which means the visitor can edit it before the page reads it, and
 * an account bidding to a ROAS target believes whatever number it is handed.
 * One booking reported at €9,999,999 teaches Smart Bidding to go and find more
 * people like whoever sent it.
 *
 * Set far above any real reservation, so it never rejects a genuine booking and
 * only ever catches a fabricated one. Anything above it reports as NO value
 * rather than as a clamped one — a confidently wrong number is worse than a
 * missing one, and `value_missing` makes it visible in GTM either way.
 */
const MAX_PLAUSIBLE_VALUE = 5000;

/** `toAmount`, with the poison guard applied. */
function boundedAmount(input: unknown): number | null {
  const value = toAmount(input);
  if (value === null) return null;
  return value <= MAX_PLAUSIBLE_VALUE ? value : null;
}

/**
 * The booking value from a `reservationAdded` payload.
 *
 * Still used, but no longer the main path: ParkingPro confirmed that
 * `reservationAdded` is NOT emitted after an online payment. It fires only for
 * reservations created without the payment provider, so this now serves that
 * narrower case. See the note on trackPurchase().
 */
export function readReservationValue(reservation: Record<string, unknown> | undefined) {
  if (!reservation) return { value: null, currency: DEFAULT_CURRENCY };

  const currency =
    typeof reservation.currency === 'string' && /^[A-Z]{3}$/.test(reservation.currency)
      ? reservation.currency
      : DEFAULT_CURRENCY;

  return { value: boundedAmount(reservation[VALUE_KEY]), currency };
}

/**
 * The booking value from the post-payment redirect's query string.
 *
 * Separate from the payload reader because the trust level is different, not
 * because the parsing is: this input has been through the visitor's address
 * bar. `toAmount` handles a .NET back end serialising a decimal as "201,49" or
 * "€ 1.201,49"; `boundedAmount` handles someone typing their own number in.
 */
export function readValueParam(raw: string | string[] | undefined): number | null {
  return typeof raw === 'string' ? boundedAmount(raw) : null;
}

/**
 * Pull a reservation reference out of a `reservationAdded` payload.
 *
 * `reservationCode` leads: ParkingPro named it on 2026-08-06 as the unique
 * transaction id and the field to deduplicate on. The rest are kept as
 * fallbacks for the non-payment path, whose payload shape they never described.
 */
export function readReservationReference(
  reservation: Record<string, unknown> | undefined,
): string | null {
  if (!reservation) return null;
  for (const key of ['reservationCode', 'reservationNumber', 'number', 'reference', 'code', 'id']) {
    const value = reservation[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Firing the conversion
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Holding the value until the visitor reaches the thank-you page
// ---------------------------------------------------------------------------

const PENDING_KEY = 'lps-pending-booking';

export type PendingBooking = {
  reference: string | null;
  value: number | null;
  currency: string;
};

/**
 * Park a completed booking's value until the thank-you page is actually reached.
 *
 * ── Why the value waits here instead of being reported on the spot ───────────
 * The client's definition of a conversion is explicit: it counts once the
 * visitor has been through every step, PAID, and landed on the thank-you page.
 * `reservationAdded` is the wrong moment to report against that rule — it is
 * ParkingPro telling us a reservation record now exists, and whether that
 * happens before or after the payment provider confirms is theirs to decide,
 * not something this codebase can see. Report there and a bounced iDEAL payment
 * is a conversion in the ad account.
 *
 * The thank-you page is the gate the client described, so that is where it
 * fires. This just carries the value across the navigation.
 *
 * ── Why sessionStorage and not the URL ──────────────────────────────────────
 * Same reason the reference is the only thing in the query string: a price in
 * the address bar is a price the visitor can edit, and an account bidding to a
 * ROAS target will believe whatever number it is handed. sessionStorage is
 * per-tab and per-origin, it is not in history, not in access logs and not in
 * the Referer header — and, critically, it SURVIVES the payment provider taking
 * over the whole tab and sending the visitor back. That is the one path where
 * the value would otherwise be lost for good.
 */
export function stashPendingBooking(booking: PendingBooking) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(booking));
  } catch {
    // Private mode or storage disabled. The thank-you page will still report the
    // conversion off the URL reference, just without a value — degraded, not
    // broken. Losing the value beats losing the conversion.
  }
}

/** The booking parked by `reservationAdded`, if this tab has one in flight. */
export function readPendingBooking(): PendingBooking | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const { reference, value, currency } = parsed as Record<string, unknown>;
    return {
      reference: typeof reference === 'string' ? reference : null,
      value: typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null,
      currency: typeof currency === 'string' ? currency : DEFAULT_CURRENCY,
    };
  } catch {
    return null;
  }
}

/**
 * Drop the parked booking once it has been reported.
 *
 * Without this, a visitor who books and then browses back to the thank-you page
 * later in the same tab would re-report. `alreadyFired` catches that too, but
 * only while its key survives; clearing the source is the cheaper guarantee.
 */
export function clearPendingBooking() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // Nothing to do — see above.
  }
}

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
 * Called from ONE place — the thank-you page — because that is the client's
 * stated definition of a conversion. What differs is how the visitor got there,
 * and ParkingPro Support confirmed the two paths on 2026-08-06:
 *
 *   1. ONLINE PAYMENT, which is nearly all of them. The payment provider takes
 *      the whole tab; ParkingPro then redirects to the `returnUrl` we pass on
 *      the booking iframe and appends `reservationCode` and `totalWithTax`.
 *      `reservationAdded` is explicitly NOT emitted on this path — so the
 *      query string is the only source of both the reference and the value.
 *
 *   2. A reservation created WITHOUT the online payment flow. Here
 *      `reservationAdded` does fire, ParkingProFrame stashes the value and
 *      routes to /reservering/bevestiging/?ref=… itself.
 *
 * Path 1 is why the earlier design could not have worked: it reported from the
 * postMessage, and the postMessage never arrives for a paid booking.
 *
 * Still deduplicated, because the thank-you page is a URL like any other: a
 * refresh, a back-button or a bookmarked visit would otherwise each count as a
 * fresh booking. ParkingPro recommends deduplicating on `reservationCode`,
 * which is what the key is.
 *
 * The reference also goes out as `transaction_id`, which is what lets Google Ads
 * discard a duplicate that slips past this — in a second tab, say, or after the
 * session store is cleared.
 */
export function trackPurchase(input: {
  transactionId: string | null;
  value: number | null;
  currency?: string;
  /** Which of the two paths above reported it. Visible in Tag Assistant. */
  source: 'online-payment' | 'in-frame';
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
/**
 * The GTM container loader, as a string for the root layout to embed in <head>.
 *
 * ── Why this moved out of <Analytics /> ─────────────────────────────────────
 * It used to be a `<Script strategy="afterInteractive">` at the bottom of
 * <body>. That works for real visitors — the container loads, tags fire, and a
 * conversion was verified end to end on 2026-08-07 — but `afterInteractive` is
 * injected by the client AFTER hydration and therefore never appears in the
 * server-rendered HTML.
 *
 * Google Ads reads that HTML. On 2026-08-08 both campaigns showed "Er ontbreekt
 * een Google-tag op uw website", because from Google's side the tag genuinely
 * is not there: their scanner sees the document we serve, not the DOM React
 * builds afterwards. Next's own docs are explicit that only
 * `beforeInteractive` is "injected into the initial HTML from the server".
 *
 * So the container is emitted in <head> as a raw inline script, exactly as the
 * consent bootstrap is, and for a related reason: parser order. The bootstrap
 * runs first and sets the Consent Mode default, then this runs. That ordering
 * was previously guaranteed by <head> coming before <body>; it is now
 * guaranteed by two adjacent lines, which is stronger and easier to see.
 *
 * ── The cost, stated plainly ────────────────────────────────────────────────
 * gtm.js now starts downloading earlier and competes for bandwidth with the
 * hero image. The script itself is `async` and blocks nothing, and the hero is
 * priority-loaded, so the expected LCP impact is small — but it is not zero.
 * Worth a PageSpeed check after deploying. The trade buys a container that
 * Google can see and that is running before the first event rather than after
 * hydration.
 */
export function buildGtmLoader(containerId: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer',${JSON.stringify(containerId)});`;
}

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
