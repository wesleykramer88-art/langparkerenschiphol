/**
 * Date helpers for the Dutch booking fields.
 *
 * Everything here works on `YYYY-MM-DD` strings, never Date objects, except
 * where a Date is needed purely for formatting. A Date is an instant in UTC; the
 * dates on this site are local wall-clock days at Schiphol. Round-tripping a
 * booking date through a Date is how a reservation lands a day early across a
 * DST boundary — and the Netherlands changes clocks twice inside the 1–8 week
 * booking window this site is built for.
 */

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Dutch month names, nominative. Used in the calendar header. */
export const MONTHS_NL = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
] as const;

/**
 * Weekday initials, MONDAY FIRST. The Dutch week starts on Monday; a
 * Sunday-first calendar is immediately, visibly wrong to a Dutch reader.
 */
export const WEEKDAYS_NL_SHORT = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'] as const;

/** Full weekday names for the accessible label on each day cell. */
export const WEEKDAYS_NL_FULL = [
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
  'zondag',
] as const;

const pad = (n: number) => String(n).padStart(2, '0');

/** Build `YYYY-MM-DD` from parts. `month` is 1-based. */
export function toIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Split `YYYY-MM-DD` into 1-based parts. Returns null if malformed. */
export function fromIso(iso: string): { year: number; month: number; day: number } | null {
  if (!ISO_DATE.test(iso)) return null;
  const [year, month, day] = iso.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** Today as `YYYY-MM-DD`, in the visitor's local timezone. */
export function todayIso(): string {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** `month` is 1-based. Handles leap years via the Date rollover trick. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Weekday index of the 1st of the month, 0 = Monday … 6 = Sunday.
 * getUTCDay() is 0 = Sunday, so it is rotated to put Monday first.
 */
export function firstWeekdayMondayFirst(year: number, month: number): number {
  const sundayFirst = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return (sundayFirst + 6) % 7;
}

/** Weekday index of a given ISO date, 0 = Monday. */
export function weekdayMondayFirst(iso: string): number {
  const parts = fromIso(iso);
  if (!parts) return 0;
  const sundayFirst = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  return (sundayFirst + 6) % 7;
}

/**
 * `YYYY-MM-DD` → `dd-mm-jjjj`, the format a Dutch reader writes.
 * Returns '' for anything malformed so a partially typed value never renders
 * as "NaN-NaN-".
 */
export function isoToDisplay(iso: string): string {
  const parts = fromIso(iso);
  if (!parts) return '';
  return `${pad(parts.day)}-${pad(parts.month)}-${parts.year}`;
}

/** `dd-mm-jjjj` → `YYYY-MM-DD`. Returns null unless it is a real calendar date. */
export function displayToIso(display: string): string | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(display.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2200) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return toIso(year, month, day);
}

/**
 * Progressive input mask: digits in, `dd-mm-jjjj` out.
 * Separators are inserted as the visitor types and are never something they have
 * to enter themselves — typing "14082026" produces "14-08-2026".
 */
export function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

/** Shift an ISO date by whole days. Safe across month and year boundaries. */
export function addDays(iso: string, days: number): string {
  const parts = fromIso(iso);
  if (!parts) return iso;
  // UTC arithmetic: exact whole days, immune to the DST shift that would break
  // a local-time addition.
  const base = Date.UTC(parts.year, parts.month - 1, parts.day);
  const next = new Date(base + days * 86_400_000);
  return toIso(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

/** Shift by whole months, clamping the day to the target month's length. */
export function addMonths(iso: string, months: number): string {
  const parts = fromIso(iso);
  if (!parts) return iso;
  const total = parts.year * 12 + (parts.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  // 31 Jan + 1 month is 28/29 Feb, not 3 March.
  return toIso(year, month, Math.min(parts.day, daysInMonth(year, month)));
}

/** ISO strings compare correctly as plain strings — no parsing needed. */
export function isBefore(a: string, b: string): boolean {
  return a < b;
}

/** "donderdag 14 augustus 2026" — the accessible name for a day cell. */
export function isoToLongLabel(iso: string): string {
  const parts = fromIso(iso);
  if (!parts) return '';
  const weekday = WEEKDAYS_NL_FULL[weekdayMondayFirst(iso)];
  return `${weekday} ${parts.day} ${MONTHS_NL[parts.month - 1]} ${parts.year}`;
}

/** "14 aug" — the short form used on the ticket stub. */
export function isoToShortLabel(iso: string): string {
  const parts = fromIso(iso);
  if (!parts) return '';
  return `${parts.day} ${MONTHS_NL[parts.month - 1].slice(0, 3)}`;
}

/**
 * Every quarter hour from 00:00 to 23:45.
 * Built once at module scope — it is a constant, not per-render work.
 */
export const TIME_OPTIONS: readonly string[] = buildTimeOptions(15);

/**
 * Every time of day at the given interval, `HH:mm`.
 *
 * The interval is not always ours to choose: ParkingPro exposes a
 * `timePickerInterval` in its widget config, and when the client sets one the
 * picker should follow it rather than offering slots his system will not take.
 * See src/lib/parkingpro-config.ts.
 *
 * Guarded at both ends. A zero or negative interval — which is what an
 * unconfigured ParkingPro instance reports — would loop forever; anything over
 * a day produces a single option, which is at least harmless.
 */
export function buildTimeOptions(intervalMinutes: number): readonly string[] {
  const step = Math.min(Math.max(Math.round(intervalMinutes) || 15, 1), 1440);
  const count = Math.ceil(1440 / step);

  return Array.from({ length: count }, (_, index) => {
    const total = index * step;
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
  });
}
