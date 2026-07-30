import { NextResponse } from 'next/server';
import { fetchPrice } from '@/lib/parkingpro';
import { locationsFor, serviceSlugs, type ServiceSlug } from '@/lib/booking';
import { fromIso } from '@/lib/date';

/**
 * Live price for a service and a date range.
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
 * The CHEAPEST of the chosen service's two products, so the figure can honestly
 * be labelled "vanaf". It deliberately does not assume which of the two that is
 * — on this instance valet-covered is cheaper than valet-outdoor, which is
 * probably a misconfigured rate list and is flagged in the handover. Taking the
 * minimum is correct whichever way that turns out.
 *
 * Never throws and never 500s: a price we cannot fetch is a price we do not
 * show, and the booking card has to keep working either way.
 */

export const dynamic = 'force-dynamic';

/** ParkingPro wants ISO here — `dd-mm-yyyy` 400s. See toPriceApiDates(). */
const isServiceSlug = (value: string | null): value is ServiceSlug =>
  value !== null && (serviceSlugs as readonly string[]).includes(value);

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
    return NextResponse.json({ price: null }, { status: 400 });
  }

  const locations = locationsFor(service);

  const quotes = await Promise.all(
    locations.map((location) =>
      fetchPrice({ locationId: location.id, arrivalDate, departureDate }),
    ),
  );

  const available = quotes
    .map((quote, index) => ({ quote, location: locations[index] }))
    .filter(
      (
        entry,
      ): entry is {
        quote: NonNullable<(typeof quotes)[number]>;
        location: (typeof locations)[number];
      } => entry.quote !== null && !entry.quote.isUnavailable && entry.quote.totalWithTax > 0,
    );

  if (available.length === 0) {
    return NextResponse.json({ price: null });
  }

  const cheapest = available.reduce((best, entry) =>
    entry.quote.totalWithTax < best.quote.totalWithTax ? entry : best,
  );

  return NextResponse.json({
    price: {
      total: cheapest.quote.totalWithTax,
      currency: cheapest.quote.currency,
      // True whenever the service has more than one product and they differ, so
      // the card can say "vanaf" only when that is actually the case.
      from: available.length > 1,
      covered: cheapest.location.covered,
    },
  });
}
