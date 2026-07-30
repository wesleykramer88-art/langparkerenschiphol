import { z } from 'zod';
import { fromIso, todayIso } from '@/lib/date';
import {
  LOCATIONS,
  ServiceType,
  minimumHoursNotice,
  toParkingProDate,
  toParkingProTime,
  type ParkingLocation,
  type ServiceTypeValue,
} from '@/lib/parkingpro';

/**
 * The hero picker's selection model, and the adapter from our format to
 * ParkingPro's.
 *
 * This module used to build MyParkingPro URLs as well. It no longer does, and
 * must not again: src/lib/parkingpro.ts is the single source of truth for every
 * path, GUID and query string. What lives here is only the shape of what the
 * visitor chose in OUR picker, and the translation into what their system
 * expects.
 *
 * ── The two date formats, and why both exist ────────────────────────────────
 * We hold dates as `YYYY-MM-DD` and times as `HH:mm`, matching what the native
 * date/time inputs produce and sorting correctly as plain strings.
 *
 * ParkingPro expects `dd-mm-yyyy`. This is not a preference — send anything
 * else and the iframe loads perfectly, shows an empty form, and silently
 * discards the prefill. There is no error and nothing in any log; the only
 * symptom is a visitor typing their dates a second time. That is exactly the
 * failure this pass exists to fix, so the conversion happens in one function
 * and nowhere else.
 */

/** Which of the two services the visitor picked in the hero. */
export const serviceSlugs = ['shuttle', 'valet'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const SERVICE_BY_SLUG: Record<ServiceSlug, ServiceTypeValue> = {
  shuttle: ServiceType.Shuttle,
  valet: ServiceType.Valet,
};

/**
 * Both products of a service: outdoor and covered.
 *
 * The hero asks for the SERVICE, not the product. Outdoor versus covered is a
 * price trade-off, and the place to make a price trade-off is the booking flow,
 * where both numbers are on screen together — not a radio button on a
 * photograph, before the visitor knows what either costs.
 *
 * ── Why no `locationId` is preselected ──────────────────────────────────────
 * The obvious thing is to preselect the cheaper of the pair. We do not, because
 * on this instance we cannot say which that is, and the live prices are strange
 * enough that guessing would be steering:
 *
 *   14–21 Aug 2026    shuttle buiten € 201,49   shuttle overdekt € 211,49
 *                     valet   buiten € 361,49   valet   overdekt € 182,48
 *
 * Shuttle behaves as expected — covered costs ten euro more. Valet does not:
 * outdoor is consistently about €184 MORE than covered, across every date range
 * checked. Either LPS-V's rate list is misconfigured or it means something we
 * have not been told, and it is flagged in the handover for the client to check.
 *
 * Until it is answered, `showLocations` narrows the flow to the chosen service's
 * two products and lets the visitor pick with both prices in front of them.
 * That is correct whichever way the answer goes, and it cannot push somebody
 * onto a €361 product when a €182 one is sitting beside it.
 */
export function locationsFor(slug: ServiceSlug): readonly ParkingLocation[] {
  return slug === 'valet'
    ? [LOCATIONS.valetOutdoor, LOCATIONS.valetCovered]
    : [LOCATIONS.shuttleOutdoor, LOCATIONS.shuttleCovered];
}

/** Ids only, for `showLocations`. */
export function locationChoicesFor(slug: ServiceSlug): readonly string[] {
  return locationsFor(slug).map((location) => location.id);
}

/** Minimum lead time for a service, in hours. Valet needs 1, shuttle none. */
export function noticeHoursFor(slug: ServiceSlug): number {
  return minimumHoursNotice(SERVICE_BY_SLUG[slug]);
}

/**
 * The earliest arrival a service can be booked for, as `{ date, time }` in our
 * own format.
 *
 * Enforced in the picker rather than left to ParkingPro. Their system rejects a
 * too-soon valet slot at the END of the flow — after the visitor has entered
 * their number plate, their contact details and their flight number. Failing
 * there is the most expensive place on the whole site to fail.
 */
export function earliestArrival(slug: ServiceSlug, now: Date = new Date()) {
  const hours = noticeHoursFor(slug);
  const earliest = new Date(now.getTime() + hours * 3_600_000);

  return {
    date: `${earliest.getFullYear()}-${String(earliest.getMonth() + 1).padStart(2, '0')}-${String(
      earliest.getDate(),
    ).padStart(2, '0')}`,
    time: `${String(earliest.getHours()).padStart(2, '0')}:${String(earliest.getMinutes()).padStart(2, '0')}`,
    hours,
  };
}

export const bookingSelectionSchema = z
  .object({
    service: z.enum(serviceSlugs),
    arrivalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Kies een aankomstdatum.'),
    arrivalTime: z.string().regex(/^\d{2}:\d{2}$/, 'Kies een aankomsttijd.'),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Kies een retourdatum.'),
    departureTime: z.string().regex(/^\d{2}:\d{2}$/, 'Kies een retourtijd.'),
  })
  .refine(
    (value) =>
      `${value.departureDate}T${value.departureTime}` > `${value.arrivalDate}T${value.arrivalTime}`,
    {
      // ISO-ordered fields compare lexicographically in chronological order, so
      // this needs no parsing and cannot drift across a DST boundary.
      path: ['departureDate'],
      message: 'De retourdatum moet na de aankomstdatum liggen.',
    },
  )
  .refine(
    (value) => {
      const { date, time } = earliestArrival(value.service);
      return `${value.arrivalDate}T${value.arrivalTime}` >= `${date}T${time}`;
    },
    {
      path: ['arrivalTime'],
      message:
        'Valet parkeren kan tot 1 uur voor aankomst worden geboekt. Kies een later tijdstip.',
    },
  );

export type BookingSelection = z.infer<typeof bookingSelectionSchema>;

/**
 * Parse what arrived on /reservering/ as query parameters.
 *
 * Deliberately lenient: a visitor may land here from an old link, a bookmark or
 * a half-copied URL, and the right response to a malformed date is an empty
 * booking form rather than an error page. Anything that does not parse is simply
 * dropped, and the flow opens unprefilled — exactly what it did before this
 * feature existed.
 */
export function parseSelectionParams(
  params: Record<string, string | string[] | undefined>,
): Partial<BookingSelection> {
  const read = (key: string): string | undefined => {
    const value = params[key];
    return typeof value === 'string' ? value : undefined;
  };

  const service = read('service');
  const out: Partial<BookingSelection> = {};

  if (service === 'valet' || service === 'shuttle') out.service = service;

  for (const key of ['arrivalDate', 'departureDate'] as const) {
    const value = read(key);
    if (value && fromIso(value)) out[key] = value;
  }

  for (const key of ['arrivalTime', 'departureTime'] as const) {
    const value = read(key);
    if (value && /^\d{2}:\d{2}$/.test(value)) out[key] = value;
  }

  return out;
}

/**
 * Our format → ParkingPro's.
 *
 * Dates are rebuilt from their parts into a LOCAL Date rather than parsed with
 * `new Date('2026-08-14')`, which the spec defines as UTC midnight. On a server
 * running west of Greenwich that lands on the 13th, and the visitor's
 * reservation would be prefilled one day early — a bug that never reproduces
 * for a Dutch developer and always reproduces on somebody's laptop.
 */
export function toParkingProParams(selection: Partial<BookingSelection>) {
  const dateFor = (iso: string | undefined, time: string | undefined) => {
    const parts = iso ? fromIso(iso) : null;
    if (!parts) return null;
    const [hours, minutes] = (time ?? '00:00').split(':').map(Number);
    return new Date(parts.year, parts.month - 1, parts.day, hours || 0, minutes || 0);
  };

  const arrival = dateFor(selection.arrivalDate, selection.arrivalTime);
  const departure = dateFor(selection.departureDate, selection.departureTime);
  const service = selection.service;

  return {
    arrivalDate: arrival ? toParkingProDate(arrival) : undefined,
    arrivalTime: arrival ? toParkingProTime(arrival) : undefined,
    departureDate: departure ? toParkingProDate(departure) : undefined,
    departureTime: departure ? toParkingProTime(departure) : undefined,
    // No `locationId`: narrowing the choice is right, preselecting one of two
    // prices for the visitor is not. See locationsFor().
    showLocations: service ? locationChoicesFor(service) : undefined,
  };
}

/**
 * ISO `YYYY-MM-DD` is what the PRICE API wants — not the dd-mm-yyyy the iframe
 * wants. Same vendor, same instance, two different date formats on two
 * different interfaces, and each rejects the other's:
 *
 *   /reservations/add?arrivalDate=14-08-2026   ✅ prefills   ❌ ISO is ignored
 *   /api/widget/price?arrivalDate=2026-08-14   ✅ 200        ❌ dd-mm-yyyy 400s
 *
 * The API at least fails loudly ("not valid for DateTimeOffset"). The iframe
 * fails silently. Both formats are produced here so no call site has to
 * remember which is which.
 */
export function toPriceApiDates(selection: Partial<BookingSelection>) {
  return {
    arrivalDate: selection.arrivalDate,
    departureDate: selection.departureDate,
  };
}

/** Nights between two ISO dates, for the ticket stub. */
export function countNights(arrivalDate: string, departureDate: string): number | null {
  const a = fromIso(arrivalDate);
  const b = fromIso(departureDate);
  if (!a || !b) return null;
  // UTC arithmetic: exact whole days, immune to the DST shift that would break a
  // local-time subtraction.
  const start = Date.UTC(a.year, a.month - 1, a.day);
  const end = Date.UTC(b.year, b.month - 1, b.day);
  const nights = Math.round((end - start) / 86_400_000);
  return nights > 0 ? nights : null;
}

/** Today, exposed here so the picker does not import two date modules. */
export { todayIso };
