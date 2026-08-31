import { NextResponse } from 'next/server';
import { fetchPrice } from '@/lib/parkingpro';
import { locationsFor, serviceSlugs, type ServiceSlug } from '@/lib/booking';
import { fromIso } from '@/lib/date';

/**
 * Live prices for a service and a date range.
 *
 * ── Why this exists rather than calling ParkingPro from the browser ─────────
 * Three reasons, in order of how much they matter:
 *
 *  1. It keeps the location GUIDs and the upstream host out of the client
 *     bundle. They are public — anyone can read them from /api/widget/locations
 *     — but there is no reason to hand them out, and shipping them means every
 *     future change to the product set is a redeploy of the front end.
 *  2. The CSP has no `connect-src` entry for the ParkingPro origin, and adding
 *     one to let the browser talk to it would widen the policy for every page.
 *  3. Responses are cached for five minutes on our side (see fetchPrice), so a
 *     visitor nudging dates back and forth does not put a request per keystroke
 *     onto somebody else's server.
 *
 * ── What it returns ────────────────────────────────────────────────────────
 * Both outdoor and covered prices for the chosen service, each from ParkingPro's
 * /api/widget/price endpoint with the exact locationId. An entry is omitted from
 * the response when ParkingPro marks it unavailable or returns no valid price.
 *
 * NOTE — Valet Buiten pricing anomaly:
 * During investigation, valet-outdoor was found to be consistently ~€184 MORE
 * expensive than valet-covered. This is not a code issue — the prices come
 * directly from ParkingPro per locationId and are returned as-is. The client
 * should verify LPS-V's rate configuration in the ParkingPro back office.
 *
 * Never throws and never 500s: a price we cannot fetch is a price we do not
 * show, and the booking card has to keep working either way.
 */

export const dynamic = 'force-dynamic';

/** ParkingPro wants ISO here — `dd-mm-yyyy` 400s. See toPriceApiDates(). */
const isServiceSlug = (value: string | null): value is ServiceSlug =>
  value !== null && (serviceSlugs as readonly string[]).includes(value);

export type PriceEntry = {
  total: number;
  currency: string;
  covered: boolean;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const service = searchParams.get('service');
  const arrivalDate = searchParams.get('arrivalDate');
  const departureDate = searchParams.get('departureDate');

  // Validated strictly, not because a bad value is dangerous — the upstream
  // call is a fixed shape with a whitelisted location id — but so this endpoint
  // can never be pointed at anything except a price lookup.
  if (
    !isServiceSlug(service) ||
    !arrivalDate ||
    !departureDate ||
    !fromIso(arrivalDate) ||
    !fromIso(departureDate) ||
    departureDate <= arrivalDate
  ) {
    return NextResponse.json({ prices: null }, { status: 400 });
  }

  const locations = locationsFor(service);

  const quotes = await Promise.all(
    locations.map((location) =>
      fetchPrice({ locationId: location.id, arrivalDate, departureDate }),
    ),
  );

  const prices: PriceEntry[] = quotes
    .map((quote, index) => ({ quote, location: locations[index] }))
    .filter(
      (entry): entry is { quote: NonNullable<typeof entry.quote>; location: (typeof locations)[number] } =>
        entry.quote !== null && !entry.quote.isUnavailable && entry.quote.totalWithTax > 0,
    )
    .map((entry) => ({
      total: entry.quote.totalWithTax,
      currency: entry.quote.currency,
      covered: entry.location.covered,
    }));

  // Maintain backward-compatible `price` field (cheapest) alongside new `prices`.
  const cheapest = prices.length > 0
    ? prices.reduce((best, p) => p.total < best.total ? p : best)
    : null;

  return NextResponse.json({
    // New: per-product prices so the widget can show both.
    prices: prices.length > 0 ? prices : null,
    // Legacy: single cheapest price — keeps any existing consumers working.
    price: cheapest
      ? { total: cheapest.total, currency: cheapest.currency, from: prices.length > 1, covered: cheapest.covered }
      : null,
  });
}
