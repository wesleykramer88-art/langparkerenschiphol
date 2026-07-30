/**
 * ParkingPro / MyParkingPro integration.
 *
 * Single source of truth for every URL that points at the booking system.
 * No page composes these by hand.
 *
 * Values below were read from the live instance:
 *   GET https://langparkerenschiphol.myparking.pro/api/widget/locations
 *
 * Path scheme verified against the official WordPress plugin source
 * (wordpress.org/plugins/parkingpro-booking-widgets, v1.2.58).
 */

// ---------------------------------------------------------------------------
// Origin
// ---------------------------------------------------------------------------

export const PARKINGPRO_ORIGIN =
  process.env.NEXT_PUBLIC_PARKINGPRO_ORIGIN ?? 'https://langparkerenschiphol.myparking.pro';

/** Paths on the MyParkingPro host. Each maps to a different plugin shortcode. */
export const PARKINGPRO_PATHS = {
  /** [pp_booking_iframe] — the actual reservation flow. */
  booking: '/reservations/add',
  /** [pp_parking_rates_iframe] — price table only. */
  rates: '/parkingrates',
  /** [pp_account_login_iframe] */
  login: '/account/login',
  /** [pp_account_register_iframe] */
  register: '/account/register',
} as const;

/**
 * Starting height the official plugin reserves per shortcode, in px.
 *
 * Read from public/class-parkingpro-booking-widgets-public.php in the official
 * plugin, v1.2.58 — booking at line 390, rates at 702, registration and login at
 * 542 and 612. They are deliberately generous: the plugin renders the embed at
 * this height and lets `pageHeightChanged` adjust from there.
 *
 * These are large because the failure mode has to be "too tall", never
 * "unreachable". Extra whitespace under a short step is cosmetic. A frame that
 * cuts off above the submit button is a lost booking.
 */
export const PARKINGPRO_DEFAULT_HEIGHTS = {
  booking: 2200,
  rates: 2800,
  login: 1500,
  register: 1500,
} as const;

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

/** ParkingPro's own enum. 1 = shuttle, 2 = valet. */
export const ServiceType = {
  Shuttle: 1,
  Valet: 2,
} as const;

export type ServiceTypeValue = (typeof ServiceType)[keyof typeof ServiceType];

export type ParkingLocation = {
  id: string;
  code: string;
  name: string;
  /** Dutch label for our own UI — ParkingPro's `name` is operational, not customer-facing. */
  label: string;
  serviceType: ServiceTypeValue;
  /** true = overdekt (covered), false = buiten (outdoor). */
  covered: boolean;
  address: string;
  /** Reservation must start at least this many hours from now. */
  minimumHoursNotice: number;
  canPayOnArrival: boolean;
};

export const AMS_AIRPORT_ID = '0ac7c086-66a6-405e-9a5a-86ce87498050';

export const LOCATIONS = {
  shuttleOutdoor: {
    id: 'd38f71c3-889e-43b7-9a74-ac09b17aee5d',
    code: 'LPS-S',
    name: 'Shuttle Parking Schiphol BUITEN',
    label: 'Shuttle parkeren — buitenterrein',
    serviceType: ServiceType.Shuttle,
    covered: false,
    address: 'Tupolevlaan 39, Schiphol-Rijk',
    minimumHoursNotice: 0,
    canPayOnArrival: false,
  },
  shuttleCovered: {
    id: '48670ed4-cafe-4d6a-9c95-0cbd55c2d977',
    code: 'LPS-SO',
    name: 'Shuttle Parking Schiphol OVERDEKT',
    label: 'Shuttle parkeren — overdekt',
    serviceType: ServiceType.Shuttle,
    covered: true,
    address: 'Tupolevlaan 39, Schiphol-Rijk',
    minimumHoursNotice: 0,
    canPayOnArrival: false,
  },
  valetOutdoor: {
    id: '87c2f0e8-f93c-416a-aef0-2fcb27799f8d',
    code: 'LPS-V',
    name: 'Valet Parking Schiphol BUITEN',
    label: 'Valet parkeren — buitenterrein',
    serviceType: ServiceType.Valet,
    covered: false,
    address: 'Vertrekpassage, Schiphol (Vertrekhal, 1e verdieping)',
    minimumHoursNotice: 1,
    canPayOnArrival: true,
  },
  valetCovered: {
    id: 'bcfd1319-06e0-4b0c-9778-85c253018b4b',
    code: 'LPS-VO',
    name: 'Valet Parking Schiphol OVERDEKT',
    label: 'Valet parkeren — overdekte garage',
    serviceType: ServiceType.Valet,
    covered: true,
    address: 'Vertrekpassage, Schiphol (Vertrekhal, 1e verdieping)',
    minimumHoursNotice: 1,
    canPayOnArrival: true,
  },
} as const satisfies Record<string, ParkingLocation>;

export const ALL_LOCATIONS: readonly ParkingLocation[] = Object.values(LOCATIONS);

export function locationsByService(serviceType: ServiceTypeValue): readonly ParkingLocation[] {
  return ALL_LOCATIONS.filter((l) => l.serviceType === serviceType);
}

/** Minimum notice for a service, in hours. Enforce this in the date picker. */
export function minimumHoursNotice(serviceType: ServiceTypeValue): number {
  return Math.max(...locationsByService(serviceType).map((l) => l.minimumHoursNotice));
}

// ---------------------------------------------------------------------------
// Date formatting
//
// `/reservations/add` takes ISO `YYYY-MM-DD` and 24h `HH:mm` — the SAME format
// our pickers already hold, so the prefill is a passthrough and there is no
// converter here to get wrong.
//
// This was previously written as dd-mm-yyyy, which is what killed the prefill:
// the frame accepted the URL, kept the two times (`HH:mm` is identical in both
// readings) and silently dropped both dates. No error, no log — the only symptom
// was the visitor typing their dates a second time.
//
// The format is not a guess. The official Booking Widgets plugin builds the
// iframe URL on the live WordPress site and passes the query string straight
// through, unconverted:
//
//   /reservations/add?hideHeader=true&hideTitle=true
//     &arrivalDate=2026-07-31&arrivalTime=00%3A30
//     &departureDate=2026-08-21&departureTime=01%3A00&culture=nl-NL
//
// Which also means the iframe and the price API agree after all — both want ISO.
// See toParkingProParams() and toPriceApiDates() in src/lib/booking.ts.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// URL building
// ---------------------------------------------------------------------------

export type BookingParams = {
  arrivalDate?: string;
  arrivalTime?: string;
  departureDate?: string;
  departureTime?: string;
  /** Number of cars. */
  startCarCount?: number;
  locationId?: string;
  airportId?: string;
  /** Restrict the picker to these location ids. */
  showLocations?: readonly string[];
  /** Travel-agent affiliate id — the mechanism behind /samenwerken/. */
  partnerId?: string;
  /** Where MyParkingPro sends the visitor after a completed booking. */
  returnUrl?: string;
  referrer?: string;
};

type FlagKey = 'hideHeader' | 'hideTitle';

/**
 * `hideHeader` and `hideTitle` are *valueless* flags. The plugin changelog
 * (1.2.58) records a bug where re-serialising the query string turned them
 * into `hideHeader=` and MyParkingPro started rendering its own header again.
 * So the query string is assembled by hand rather than via URLSearchParams.
 */
function buildUrl(
  path: string,
  flags: readonly FlagKey[],
  params: Record<string, string | number | undefined>,
): string {
  const parts: string[] = [...flags];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    parts.push(`${key}=${encodeURIComponent(String(value))}`);
  }

  return `${PARKINGPRO_ORIGIN}${path}?${parts.join('&')}`;
}

export function bookingUrl(params: BookingParams = {}): string {
  const { showLocations, startCarCount, ...rest } = params;

  return buildUrl(PARKINGPRO_PATHS.booking, ['hideHeader', 'hideTitle'], {
    ...rest,
    startCarCount,
    showLocations: showLocations?.join(','),
    culture: 'nl-NL',
  });
}

export function ratesUrl(
  options: { maxNumberOfDays?: number; showLocations?: readonly string[] } = {},
): string {
  return buildUrl(PARKINGPRO_PATHS.rates, ['hideHeader', 'hideTitle'], {
    culture: 'nl-NL',
    maxNumberOfDays: options.maxNumberOfDays ?? 30,
    showLocations: options.showLocations?.join(','),
  });
}

export function loginUrl(): string {
  return buildUrl(PARKINGPRO_PATHS.login, ['hideHeader', 'hideTitle'], {
    culture: 'nl-NL',
  });
}

export function registerUrl(
  options: { customerType?: 'private' | 'company'; lockCustomerType?: boolean } = {},
): string {
  return buildUrl(PARKINGPRO_PATHS.register, ['hideHeader', 'hideTitle'], {
    culture: 'nl-NL',
    customerType: options.customerType,
    lockCustomerType: options.lockCustomerType ? 'true' : undefined,
  });
}

// ---------------------------------------------------------------------------
// Price API
//
// Public, unauthenticated, read-only. Enough to render real prices in our own
// design before the visitor ever sees a ParkingPro screen. Booking itself still
// completes inside the iframe — there is no public write API.
//
// Call this from a route handler, never the browser: keep the GUIDs and the
// upstream host off the client.
// ---------------------------------------------------------------------------

export type PriceQuote = {
  id: string;
  currency: string;
  isUnavailable: boolean;
  locationStatus: number;
  totalWithTax: number;
};

export async function fetchPrice(input: {
  locationId: string;
  arrivalDate: string;
  departureDate: string;
  signal?: AbortSignal;
}): Promise<PriceQuote | null> {
  const url =
    `${PARKINGPRO_ORIGIN}/api/widget/price` +
    `?locationId=${encodeURIComponent(input.locationId)}` +
    `&arrivalDate=${encodeURIComponent(input.arrivalDate)}` +
    `&departureDate=${encodeURIComponent(input.departureDate)}`;

  try {
    const response = await fetch(url, {
      signal: input.signal,
      // Prices change rarely enough that a short cache is safe and keeps us
      // off ParkingPro's servers on every keystroke.
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as Partial<PriceQuote>;
    if (!data?.id || typeof data.totalWithTax !== 'number') return null;

    return {
      id: data.id,
      currency: data.currency ?? 'EUR',
      isUnavailable: data.isUnavailable ?? false,
      locationStatus: data.locationStatus ?? 0,
      totalWithTax: data.totalWithTax,
    };
  } catch {
    // A price we cannot fetch is a price we do not show. Never block the page.
    return null;
  }
}

// ---------------------------------------------------------------------------
// postMessage bridge
// ---------------------------------------------------------------------------

export const PARKINGPRO_EVENTS = {
  pageHeightChanged: 'parkingPro.ui.pageHeightChanged',
  scroll: 'parkingPro.ui.scroll',
  reservationAdded: 'parkingPro.domain.reservationAdded',
  registrationCompleted: 'parkingPro.domain.registrationCompleted',
  gtag: 'parkingPro.googleAnalytics.gtag',
  dataLayer: 'parkingPro.googleTagManager.dataLayer',
  /** Sent parent -> iframe on scroll so internal sticky elements position correctly. */
  widgetScroll: 'parkingPro.widget.scroll',
} as const;

/** Padding the official plugin adds to every reported height (plugin line 458). */
export const IFRAME_HEIGHT_PADDING = 50;

/**
 * How far a reported height must EXCEED the frame's current height before we
 * act on it.
 *
 * This is what stops the runaway. The vendor's document stretches to fill
 * whatever frame we give it, so after a resize it reports back the height we
 * just set. Adding padding to that report and applying it grows the frame by
 * IFRAME_HEIGHT_PADDING, which produces another report, which grows it again —
 * 50px per message, without bound. It is the plugin's own changelog-1.2.54 bug
 * arriving from the other direction.
 *
 * A report that does not exceed the current height carries no information: the
 * content fits, with padding to spare. Only a report that overflows the frame
 * means anything, and the epsilon absorbs the few px of margin and scrollbar
 * noise that would otherwise creep the height up one small step at a time.
 */
export const IFRAME_HEIGHT_EPSILON = 32;

/**
 * How much dead space below the content we tolerate before shrinking the frame
 * to fit, in px.
 *
 * Must stay comfortably ABOVE IFRAME_HEIGHT_PADDING, or the frame chases its
 * own tail: shrink to `content + padding`, measure again, find `padding` px of
 * slack, shrink again. With slack > padding the frame settles one step after a
 * shrink and stops.
 *
 * Only the embeds that report a true content height ever shrink — /tarieven/'s
 * rate table is shorter than the plugin's generous 2800px reservation, and left
 * alone it renders 600px of empty card. Embeds whose document stretches to fill
 * the frame report the frame's own height, which trips neither this nor the
 * growth test, so they are untouched.
 */
export const IFRAME_HEIGHT_SLACK = 64;

/**
 * The smallest frame we ever render, in px. Two jobs.
 *
 * It is the floor for a shrink, so a malformed or mid-transition report cannot
 * collapse the card to nothing. And it is the height the frame is MEASURED at
 * before it is revealed — see the probe in ParkingProFrame, which is the only
 * way to find out how tall an embed's content actually is.
 *
 * Both are only safe because `scrolling="yes"` means a frame that ends up too
 * short is still fully reachable rather than truncated.
 */
export const IFRAME_MIN_HEIGHT = 240;

/**
 * Absolute ceiling, in px. A backstop, not a layout constraint — nothing the
 * vendor legitimately renders comes close. If a future payload change restarts
 * the loop, the frame stops here with its inner scrollbar intact rather than
 * growing until the tab dies.
 */
export const IFRAME_MAX_HEIGHT = 12000;

/** Parse to a bare origin, or null if the value is not a URL at all. */
function safeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const NORMALISED_ORIGIN = safeOrigin(PARKINGPRO_ORIGIN);

/**
 * Both sides are normalised through `new URL().origin` before comparing.
 *
 * A raw string compare is the wrong tool here. `NEXT_PUBLIC_PARKINGPRO_ORIGIN`
 * with a trailing slash — or with an explicit `:443`, or different casing in the
 * host — never equals the `event.origin` the browser hands us, so every message
 * is dropped and the height bridge looks exactly as if it had never been built.
 * env.ts rejects the trailing-slash case at build time, but that guard only
 * covers the one spelling we thought of.
 */
export function isParkingProOrigin(origin: string): boolean {
  const incoming = safeOrigin(origin);
  return incoming !== null && incoming === NORMALISED_ORIGIN;
}

/** Shape we accept from the frame. Everything is optional and unvalidated — it
 *  is somebody else's payload and it may change without notice. */
export type ParkingProPayload = {
  event?: string;
  type?: string;
  newHeight?: number;
  height?: number;
  offset?: number;
  scrollTop?: number;
  position?: number;
  reservation?: Record<string, unknown>;
  args?: unknown[];
  data?: unknown;
};

/**
 * Normalise an inbound `MessageEvent.data` to `[eventName, payload]`.
 *
 * Two tolerances, both load-bearing:
 *
 * 1. The name arrives under `event`. The plugin reads `e.data.event` at lines
 *    456, 551, 621 and 711 — there is no `type` key anywhere in it. Reading
 *    `type` instead is why the bridge never fired: every message was dropped
 *    before the switch, so the frame stayed at whatever height was reserved for
 *    it. `type` is still accepted in case a future embed sends it.
 * 2. Some embeds post a JSON string rather than a structured clone. Parsing is
 *    attempted before giving up, never after.
 *
 * Returns null for anything unrecognisable. Callers must still check the origin
 * FIRST — this function deliberately performs no trust check of its own.
 */
export function readParkingProMessage(data: unknown): [string, ParkingProPayload] | null {
  let value = data;

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!value || typeof value !== 'object') return null;

  const payload = value as ParkingProPayload;
  const name = payload.event ?? payload.type;

  return typeof name === 'string' ? [name, payload] : null;
}
