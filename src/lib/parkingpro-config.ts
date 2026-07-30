import { PARKINGPRO_ORIGIN } from '@/lib/parkingpro';

/**
 * The picker's bounds, read from ParkingPro rather than hardcoded.
 *
 * `/api/widget/config` is the same public, unauthenticated API the price lookup
 * uses. It exposes the operating limits the client sets in his own ParkingPro
 * back office: default arrival and departure times, the earliest bookable date,
 * the earliest and latest times of day, and the time picker's interval.
 *
 * Reading them means the hero picker stays correct when he changes his opening
 * hours, without anybody touching this repository.
 *
 * ── What his instance returns TODAY ────────────────────────────────────────
 *     {"minArrivalDate":null,"minArrivalDepartureTime":null,
 *      "maxArrivalDepartureTime":null,"defaultArrivalTime":null,
 *      "defaultDepartureTime":null,"timePickerInterval":0}
 *
 * Every value is null and the interval is zero — he has not configured any of
 * it. So today this changes nothing on screen, and every fallback below is what
 * the picker already used.
 *
 * That is the point of wiring it now rather than later: the moment he sets an
 * opening time in ParkingPro, the site follows. Left hardcoded, the site would
 * keep offering 06:00 arrivals after he stopped accepting them, and the first
 * anyone would know is a customer arriving to a closed barrier.
 *
 * TODO(client): if there are hours outside which you cannot accept a car,
 * set them in ParkingPro and they will appear here automatically.
 */

export type PickerBounds = {
  /** `HH:mm`. */
  defaultArrivalTime: string;
  defaultDepartureTime: string;
  /** `HH:mm`, or null for no limit. */
  minTime: string | null;
  maxTime: string | null;
  /** Minutes between selectable times. */
  interval: number;
};

/** What the picker used before this was wired, kept as the fallback. */
export const DEFAULT_BOUNDS: PickerBounds = {
  defaultArrivalTime: '08:00',
  defaultDepartureTime: '18:00',
  minTime: null,
  maxTime: null,
  interval: 15,
};

type RawConfig = {
  minArrivalDate?: string | null;
  minArrivalDepartureTime?: string | null;
  maxArrivalDepartureTime?: string | null;
  defaultArrivalTime?: string | null;
  defaultDepartureTime?: string | null;
  timePickerInterval?: number | null;
};

/** ParkingPro returns times as `HH:mm:ss` or `HH:mm`; we want `HH:mm`. */
function toHhMm(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = /^(\d{2}):(\d{2})/.exec(value.trim());
  return match ? `${match[1]}:${match[2]}` : null;
}

/**
 * Fetch the bounds. Server-side only — see the note in the price route about
 * keeping the upstream host off the client and out of the CSP.
 *
 * Cached for an hour: opening hours are not something anybody changes twice in
 * an afternoon, and this runs on every render of the homepage.
 *
 * Never throws. If ParkingPro is unreachable the picker gets the defaults,
 * which is exactly what it had before — an unavailable config API must not be
 * able to take the booking form down.
 */
export async function fetchPickerBounds(): Promise<PickerBounds> {
  try {
    const response = await fetch(`${PARKINGPRO_ORIGIN}/api/widget/config`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return DEFAULT_BOUNDS;

    const raw = (await response.json()) as RawConfig;

    return {
      defaultArrivalTime: toHhMm(raw.defaultArrivalTime) ?? DEFAULT_BOUNDS.defaultArrivalTime,
      defaultDepartureTime: toHhMm(raw.defaultDepartureTime) ?? DEFAULT_BOUNDS.defaultDepartureTime,
      minTime: toHhMm(raw.minArrivalDepartureTime),
      maxTime: toHhMm(raw.maxArrivalDepartureTime),
      // `0` is what an unconfigured instance returns, and a zero-minute
      // interval would generate an infinite list of times.
      interval:
        typeof raw.timePickerInterval === 'number' && raw.timePickerInterval > 0
          ? raw.timePickerInterval
          : DEFAULT_BOUNDS.interval,
    };
  } catch {
    return DEFAULT_BOUNDS;
  }
}
