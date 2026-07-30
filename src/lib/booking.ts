import { z } from 'zod';
import { fromIso, todayIso } from '@/lib/date';
import {
  LOCATIONS,
  ServiceType,
  minimumHoursNotice,
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
 * ── One date format, and the cost of having believed otherwise ──────────────
 * We hold dates as `YYYY-MM-DD` and times as `HH:mm`, matching what the native
 * date/time inputs produce and sorting correctly as plain strings.
 *
 * ParkingPro reads exactly that. Both interfaces do — the booking frame and the
 * price API — so the prefill is a passthrough with no conversion anywhere.
 *
 * It was written as a conversion to `dd-mm-yyyy`, and that is what broke the
 * feature this module exists for: the frame took the URL, kept the two times
 * (`HH:mm` is the same string either way) and dropped both dates without a word.
 * The visitor typed their dates a second time — the precise failure the prefill
 * was built to prevent, reintroduced by the fix for it. If a date ever goes
 * missing from the frame again, this is the first thing to check, and
 * src/lib/parkingpro.ts records the evidence for the format.
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
 * Our format → ParkingPro's. Which, it turns out, is our format.
 *
 * The frame reads ISO `YYYY-MM-DD` and `HH:mm` — see the note above
 * PARKINGPRO_PATHS' date section in src/lib/parkingpro.ts for how that was
 * established. So nothing is reformatted here; a date is passed on only once
 * `fromIso` confirms it is a real calendar date, and a time only once it looks
 * like a clock time.
 *
 * Validating rather than trusting matters because this input arrives from a
 * query string. `2026-02-31` would sail through a regex, and the frame's
 * response to a date that does not exist is the same as its response to a
 * malformed one: ignore the prefill, render an empty form, say nothing. Dropping
 * it here at least means the two fields fail together rather than the visitor
 * getting a half-filled form.
 *
 * A date is only sent WITH its time, and vice versa. The frame treats them as
 * one moment; handing it a date whose time was rejected prefills midnight, which
 * is a wrong answer wearing the clothes of a right one.
 */
export function toParkingProParams(selection: Partial<BookingSelection>) {
  const moment = (iso: string | undefined, time: string | undefined) =>
    iso && fromIso(iso) && time && /^\d{2}:\d{2}$/.test(time)
      ? { date: iso, time }
      : { date: undefined, time: undefined };

  const arrival = moment(selection.arrivalDate, selection.arrivalTime);
  const departure = moment(selection.departureDate, selection.departureTime);
  const service = selection.service;

  return {
    arrivalDate: arrival.date,
    arrivalTime: arrival.time,
    departureDate: departure.date,
    departureTime: departure.time,
    // No `locationId`: narrowing the choice is right, preselecting one of two
    // prices for the visitor is not. See locationsFor().
    showLocations: service ? locationChoicesFor(service) : undefined,
  };
}

/**
 * The dates the price API wants — ISO `YYYY-MM-DD`, the same as the frame.
 *
 * This was documented as the one interface that DIFFERED from the iframe, which
 * is the belief that produced the dd-mm-yyyy conversion and lost the prefill.
 * The API is simply stricter about being given it: `dd-mm-yyyy` 400s here with
 * "not valid for DateTimeOffset", where the frame swallows it silently.
 *
 * Kept as a named function even though it now only picks two fields — it is the
 * place a call site looks to ask what the API expects.
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
