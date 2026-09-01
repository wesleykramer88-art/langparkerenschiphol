'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DateField } from '@/components/ui/DateField';
import { TimeField } from '@/components/ui/TimeField';
import { Ticket, TicketTear } from '@/components/ui/Ticket';
import type { NotchColor } from '@/components/ui/Ticket';
import {
  bookingSelectionSchema,
  countNights,
  earliestArrival,
  serviceSlugs,
  type BookingSelection,
  type ServiceSlug,
} from '@/lib/booking';
import { SERVICE_COPY } from '@/config/services';
import { isBefore, isoToShortLabel } from '@/lib/date';
import { DEFAULT_BOUNDS, type PickerBounds } from '@/lib/parkingpro-config';
import { formatPrice, useLivePrices, type LivePriceEntry } from '@/hooks/useLivePrice';
import { cn } from '@/lib/cn';

/**
 * The hero reservation card — our own picker, shaped like a parking ticket.
 *
 * Deliberately not the vendor widget. The first interaction on the page is
 * ours: on-brand, Dutch-formatted, validated in Dutch, and instant. The
 * selection is handed to /reservering/ as query parameters, which converts it
 * into ParkingPro's format and prefills the booking flow.
 *
 * ── This card only works if the prefill works ───────────────────────────────
 * Before this pass the card collected four values, routed to /reservering/, and
 * the booking flow opened empty — so the visitor entered their dates twice and
 * the card was decoration with a form attached. The chain is now:
 *
 *   BookingPicker  →  /reservering/?service&arrivalDate&…
 *                  →  toParkingProParams()   (validate; ISO passes through)
 *                  →  bookingUrl()           (the one URL builder)
 *                  →  the flow, prefilled
 *
 * If any link in that chain changes format, the iframe still loads and still
 * shows an empty form. There is no error to catch, so the formats live in one
 * place — see src/lib/booking.ts.
 *
 * ── Why the service choice is here ──────────────────────────────────────────
 * ParkingPro sells four products: shuttle and valet, each outdoor or covered.
 * The service is the real decision and it changes the rules — valet cannot be
 * booked less than an hour ahead, shuttle can be booked for right now — so it
 * has to be made before the times are validated.
 *
 * Outdoor versus covered is NOT asked here. It is a price trade-off, and the
 * place to make a price trade-off is the booking flow, where both numbers are
 * on screen together. Asking on a photograph, before the visitor knows what
 * either costs, would be asking them to guess.
 */

/**
 * The names, the mechanical note and the "Uw voordeel" line all now live in
 * src/config/services.ts.
 *
 * They were declared here, which was right while this card was the only thing
 * that rendered them. The two service landing pages lead with the same benefit
 * line and the same bullets, and a second copy of the client's own words is a
 * copy that will eventually disagree with the first.
 */

export function BookingPicker({
  notch = 'canvas',
  /**
   * Which service is selected on first paint.
   *
   * Defaults to shuttle: it is the cheaper product, it carries no minimum
   * notice — so nothing is disabled on first render — and it is what most
   * long-stay travellers book. Valet is one tap away.
   *
   * The two service landing pages override it, because a visitor who has just
   * clicked through to a page about ONE service and is then shown a form
   * defaulted to the other one has been asked to correct the page.
   */
  defaultService = 'shuttle',
  /**
   * Opening hours and defaults, read from ParkingPro's own widget config on the
   * server. Today his instance returns nulls for all of them and these are the
   * values the picker always used; the moment he sets opening hours in his back
   * office, this follows without a deploy. See src/lib/parkingpro-config.ts.
   */
  bounds = DEFAULT_BOUNDS,
  className,
  headingLevel = 'h2',
}: {
  notch?: NotchColor;
  defaultService?: ServiceSlug;
  bounds?: PickerBounds;
  className?: string;
  headingLevel?: 'h1' | 'h2';
}) {
  const router = useRouter();
  const errorId = useId();
  const serviceLabelId = useId();

  const [values, setValues] = useState<BookingSelection>({
    service: defaultService,
    arrivalDate: '',
    arrivalTime: bounds.defaultArrivalTime,
    departureDate: '',
    departureTime: bounds.defaultDepartureTime,
  });
  // null = no choice yet, false = outdoor (buiten), true = covered (overdekt)
  const [covered, setCovered] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingSelection, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const nights = countNights(values.arrivalDate, values.departureDate);

  // Capitalised so JSX treats it as a component rather than an <usp> element.
  // Reading it here keeps the stub's markup to the one thing that changes.
  const Usp = SERVICE_COPY[values.service].usp.icon;

  // Recomputed on render rather than held in state: it depends on the clock, and
  // a visitor who leaves the tab open over the hour boundary should not be
  // holding a stale limit.
  const earliest = earliestArrival(values.service);

  // Two independent limits on the arrival time, and the later of them wins:
  // the operator's opening time, which applies every day, and the minimum
  // booking notice, which only bites on the first bookable day.
  const noticeMin = values.arrivalDate === earliest.date ? earliest.time : undefined;
  const arrivalTimeMin =
    noticeMin && bounds.minTime
      ? noticeMin > bounds.minTime
        ? noticeMin
        : bounds.minTime
      : (noticeMin ?? bounds.minTime ?? undefined);

  // The real prices, in our own typography, before the visitor has seen a single
  // ParkingPro screen. Both outdoor and covered are fetched simultaneously.
  // Never blocks and never fails loudly — see useLivePrices.
  const prices = useLivePrices({
    service: values.service,
    arrivalDate: values.arrivalDate,
    arrivalTime: values.arrivalTime,
    departureDate: values.departureDate,
    departureTime: values.departureTime,
  });

  // Price for whichever product the visitor has actively selected.
  // null while no selection is made (covered === null) or prices haven't
  // arrived yet — the CTA falls back to "Bekijk mijn prijs" in that case.
  const selectedPrice: LivePriceEntry | null =
    covered === null ? null : covered ? (prices?.covered ?? null) : (prices?.outdoor ?? null);

  const setField = <K extends keyof BookingSelection>(key: K, value: BookingSelection[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };

      // Moving the arrival past the return would leave an impossible period on
      // screen until submit. Push the return forward instead of letting it go
      // stale — the intent is unambiguous and the correction is visible.
      if (
        key === 'arrivalDate' &&
        next.departureDate &&
        isBefore(next.departureDate, value as string)
      ) {
        next.departureDate = value as string;
      }

      // Switching to valet can invalidate a date or time that was legal for
      // shuttle a moment ago. Correct it here rather than waiting for submit:
      // the visitor did not do anything wrong and should not be told off for
      // changing their mind about the service.
      if (key === 'service') {
        const limit = earliestArrival(value as ServiceSlug);
        if (next.arrivalDate && isBefore(next.arrivalDate, limit.date)) {
          next.arrivalDate = limit.date;
        }
        if (next.arrivalDate === limit.date && next.arrivalTime < limit.time) {
          next.arrivalTime = limit.time;
        }
        // Reset the product choice: buiten/overdekt prices differ per service.
        setCovered(null);
      }

      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = bookingSelectionSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<Record<keyof BookingSelection, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingSelection;
        nextErrors[key] ??= issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const params = new URLSearchParams(result.data);
    // Pass the covered choice so /reservering/ can prefill the exact locationId.
    // Absent means no choice was made; parseSelectionParams treats that as null
    // and falls back to showLocations, which is backward-compatible.
    if (covered !== null) params.set('covered', String(covered));
    router.push(`/reservering/?${params.toString()}`);
  };

  const firstError =
    errors.arrivalDate ??
    errors.arrivalTime ??
    errors.departureDate ??
    errors.departureTime ??
    errors.service;

  return (
    <Ticket notch={notch} className={className}>
      <form onSubmit={onSubmit} noValidate>
        <div className="px-5 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-6">
          {headingLevel === 'h1' ? (
            <h1 className="text-display-sm">Bekijk direct uw parkeerprijs</h1>
          ) : (
            <h2 className="text-display-sm">Bekijk direct uw parkeerprijs</h2>
          )}

          {/* ---------- Service ----------
              A radiogroup rather than a select: two options, both worth reading,
              and the choice changes what the rest of the form allows. Rendered
              as real radio inputs with the label styled — so it is operable with
              arrow keys and announced as a group, which a row of buttons is not. */}
          <fieldset className="mt-5 border-0 p-0 sm:mt-6">
            <legend id={serviceLabelId} className="eyebrow text-muted mb-2.5">
              Welke service?
            </legend>

            <div className="border-line-strong grid grid-cols-2 gap-1 rounded-md border p-1">
              {serviceSlugs.map((slug) => {
                const active = values.service === slug;
                return (
                  <label
                    key={slug}
                    className={cn(
                      'ease-settle relative flex min-h-11 cursor-pointer items-center justify-center rounded-sm px-3 text-sm font-semibold',
                      'transition-[background-color,color] duration-(--duration-micro)',
                      // The focus ring has to live on the label, because the
                      // input itself is visually hidden.
                      'has-focus-visible:outline-focus has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
                      active
                        ? 'bg-surface-inverse text-heading-inverse'
                        : 'text-muted hover:text-heading',
                    )}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={slug}
                      checked={active}
                      onChange={() => setField('service', slug)}
                      className="sr-only"
                    />
                    {SERVICE_COPY[slug].name}
                  </label>
                );
              })}
            </div>

            <p className="text-muted mt-2.5 text-xs leading-relaxed">
              {SERVICE_COPY[values.service].note}
            </p>
          </fieldset>

          <fieldset className="mt-5 flex flex-col gap-3.5 border-0 p-0 sm:mt-6 sm:gap-4">
            <legend className="eyebrow text-muted mb-1">Parkeerperiode</legend>

            <DateTimeRow
              label="Aankomstdatum"
              date={values.arrivalDate}
              time={values.arrivalTime}
              // Valet cannot be booked for the next hour, so that day may not
              // even be selectable — enforced here rather than at the end of
              // ParkingPro's flow, which is where it would otherwise surface.
              min={earliest.date}
              timeMin={arrivalTimeMin}
              timeMax={bounds.maxTime ?? undefined}
              interval={bounds.interval}
              invalid={Boolean(errors.arrivalDate || errors.arrivalTime)}
              describedBy={firstError ? errorId : undefined}
              onDate={(iso) => setField('arrivalDate', iso)}
              onTime={(time) => setField('arrivalTime', time)}
            />

            <DateTimeRow
              label="Retourdatum"
              date={values.departureDate}
              time={values.departureTime}
              min={values.arrivalDate || earliest.date}
              timeMin={bounds.minTime ?? undefined}
              timeMax={bounds.maxTime ?? undefined}
              interval={bounds.interval}
              invalid={Boolean(errors.departureDate)}
              describedBy={firstError ? errorId : undefined}
              onDate={(iso) => setField('departureDate', iso)}
              onTime={(time) => setField('departureTime', time)}
            />
          </fieldset>

          {/* ---------- Product cards (Buiten / Overdekt) ----------
              Shown once the visitor has entered both dates. The cards load their
              prices from ParkingPro in the background; while waiting they render
              without a price and become selectable the moment a number arrives.
              A product that ParkingPro marks unavailable is shown greyed out and
              cannot be selected.

              NOTE — Valet Buiten pricing anomaly:
              Valet outdoor (LPS-V) is currently priced ~€184 ABOVE valet
              covered, which is the reverse of what shuttle does and of what a
              visitor would expect. This is reported directly from ParkingPro's
              own /api/widget/price endpoint and is NOT a code issue. The client
              should verify the LPS-V rate configuration in the ParkingPro back
              office. No correction or workaround has been applied here. */}
          {nights ? (
            <div className="mt-4 sm:mt-5">
              <p className="eyebrow text-muted mb-2.5">Parkeeroptie</p>
              <div className="grid grid-cols-2 gap-2">
                <ProductCard
                  label="Buiten"
                  description="Beveiligd buitenterrein"
                  price={prices?.outdoor ?? null}
                  loading={prices === null}
                  active={covered === false}
                  onSelect={() => setCovered(false)}
                />
                <ProductCard
                  label="Overdekt"
                  description="Droog en beschermd"
                  price={prices?.covered ?? null}
                  loading={prices === null}
                  active={covered === true}
                  onSelect={() => setCovered(true)}
                />
              </div>
            </div>
          ) : null}

          {/* One live region for the whole form. Always present, so the region
              exists before a message arrives — a region inserted at the same
              moment as its text is often not announced. */}
          <p
            id={errorId}
            aria-live="polite"
            className={cn(
              'text-valet-800 mt-3 text-sm font-medium',
              firstError ? 'flex items-start gap-1.5' : 'sr-only',
            )}
          >
            {firstError ? (
              <>
                <span aria-hidden>&#9888;</span>
                {firstError}
              </>
            ) : null}
          </p>

          <Button type="submit" size="lg" disabled={submitting} className="mt-4 w-full sm:mt-5">
            {selectedPrice
              ? `Reserveer voor ${formatPrice(selectedPrice.total, selectedPrice.currency)}`
              : 'Bekijk mijn prijs'}
            <ArrowRight data-arrow className="size-4" aria-hidden />
          </Button>
        </div>

        {/* Draws left-to-right as the last beat of the hero load sequence.
            No punched notches: this card floats over the hero photograph, and a
            punch is painted in the colour of what sits behind the card — over an
            image there is no such colour. See TicketTear. */}
        <TicketTear notches={false} className="ticket-tear-draw" />

        {/* The stub.
            Empty     → the standing promise
            Dates set → the period, and the real price once it lands.

            The price is a departure-board number in the mono face, which is the
            whole point of quoting it here: the visitor sees what it costs, set
            in our own typography, before ParkingPro renders anything. It
            appears when it appears and its absence is not signalled. */}
        <div className="flex items-end justify-between gap-4 px-5 pt-3 pb-5 sm:px-7 sm:pt-4 sm:pb-6">
          <div className="min-w-0">
            <p className="eyebrow text-muted">{nights ? 'Parkeerperiode' : 'Uw voordeel'}</p>
            {/* The period is a departure-board value — mono, tabular, one line,
                truncated if it must be. The USP is prose, so it gets neither:
                `numeric` is for prices, times and references, and a nowrap run
                here is what starves this column on a phone, where the valet
                stub's "Betaal bij aankomst" takes half the row.

                This slot used to hold one standing line, "Optionele
                annuleringsdekking", whichever service was selected. It now
                follows the radios. The cancellation cover is not lost — it is
                stated on /reservering/ in the reassurance list and in the
                service chooser's own intro — and a benefit that changes with
                the choice is worth more here than one that never moves.

                Note this is the DATELESS state only: once both dates are set the
                eyebrow above becomes "Parkeerperiode" and this line shows the
                period instead. That is the right trade — a visitor who has
                entered dates is past being sold to and wants to see what they
                typed — but it does mean the USP is a first-impression element,
                not a permanent one. */}
            <p
              className={cn(
                'text-heading mt-1.5 text-base font-medium',
                nights ? 'numeric truncate' : 'leading-snug text-balance',
              )}
            >
              {nights ? (
                `${isoToShortLabel(values.arrivalDate)} — ${isoToShortLabel(values.departureDate)}`
              ) : (
                // items-start, not items-center: the text runs to two or three
                // lines in this column on a phone, and a centred icon would
                // drift to the middle of the block instead of marking its first
                // line.
                <span className="flex items-start gap-2">
                  <Usp className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{SERVICE_COPY[values.service].usp.text}</span>
                </span>
              )}
            </p>
          </div>
          {/* Same rule as the left column: mono and unshrinkable while this
              holds a number, plain and wrappable while it holds a label — so
              "Betaal bij aankomst" stops claiming half the row on a phone. */}
          <div className={cn('text-right', nights ? 'numeric shrink-0' : 'shrink')}>
            {nights && selectedPrice ? (
              <>
                <span className="text-heading block text-xl leading-none font-semibold">
                  {formatPrice(selectedPrice.total, selectedPrice.currency)}
                </span>
                <span className="text-muted mt-1 block text-xs">
                  {nights} {nights === 1 ? 'nacht' : 'nachten'}
                </span>
              </>
            ) : nights ? (
              <>
                <span className="text-heading block text-lg font-semibold">{nights}</span>
                <span className="text-muted block text-xs">
                  {nights === 1 ? 'nacht' : 'nachten'}
                </span>
              </>
            ) : values.service === 'valet' ? (
              // Only valet takes payment on arrival. It is a real difference
              // between the two products and it appears nowhere else on the
              // site, so the stub says it while the service is selected.
              <span className="text-muted inline-flex items-center gap-1.5 text-xs">
                <Wallet className="size-3.5" aria-hidden />
                Betaal bij aankomst
              </span>
            ) : (
              <span className="text-muted text-xs">AMS · 24/7</span>
            )}
          </div>
        </div>
      </form>
    </Ticket>
  );
}

/** A date and its time, on one row. */
function DateTimeRow({
  label,
  date,
  time,
  min,
  timeMin,
  timeMax,
  interval,
  invalid,
  describedBy,
  onDate,
  onTime,
}: {
  label: string;
  date: string;
  time: string;
  min: string;
  timeMin?: string;
  timeMax?: string;
  interval?: number;
  invalid: boolean;
  describedBy?: string;
  onDate: (iso: string) => void;
  onTime: (time: string) => void;
}) {
  const dateId = useId();
  const timeId = useId();

  return (
    <div className="grid gap-2.5 sm:grid-cols-[1fr_7.5rem] sm:gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={dateId} className="text-heading text-sm font-medium">
          {label}{' '}
          <span className="text-accent-hover" aria-hidden>
            *
          </span>
          <span className="sr-only">(verplicht)</span>
        </label>
        <DateField
          id={dateId}
          value={date}
          onChange={onDate}
          min={min}
          invalid={invalid}
          describedBy={describedBy}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={timeId} className="text-heading text-sm font-medium">
          Tijd{' '}
          <span className="text-accent-hover" aria-hidden>
            *
          </span>
          <span className="sr-only">(verplicht)</span>
        </label>
        <TimeField
          id={timeId}
          value={time}
          onChange={onTime}
          min={timeMin}
          max={timeMax}
          interval={interval}
          required
        />
      </div>
    </div>
  );
}

/**
 * A selectable product card for buiten or overdekt.
 *
 * The card is a button (not a radio) because it also shows the price — a
 * radio's label cannot contain interactive content in some AT implementations,
 * and the price is the whole point. `aria-pressed` signals the selected state.
 *
 * When `loading` is true the price area is withheld: rendering a placeholder
 * keeps the layout stable while the fetch is in flight. When `price` is null
 * after loading the card is disabled — ParkingPro has indicated unavailability
 * or returned no valid price.
 */
function ProductCard({
  label,
  description,
  price,
  loading,
  active,
  onSelect,
}: {
  label: string;
  description: string;
  price: LivePriceEntry | null;
  /** True while prices are still fetching — withholds the price area. */
  loading: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const unavailable = !loading && price === null;

  return (
    <button
      type="button"
      onClick={unavailable || active ? undefined : onSelect}
      disabled={unavailable}
      aria-pressed={active}
      className={cn(
        'ease-settle flex w-full flex-col rounded-md border px-3 py-3 text-left text-sm',
        'transition-[background-color,border-color,color] duration-(--duration-micro)',
        'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        active
          ? 'border-accent bg-accent-wash text-heading'
          : unavailable
            ? 'border-line text-muted cursor-not-allowed opacity-50'
            : 'border-line text-heading hover:border-accent/60',
      )}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-muted mt-0.5 block text-xs leading-snug">{description}</span>
      {!loading && price ? (
        <span className="numeric text-accent mt-2 block text-base font-semibold leading-none">
          {formatPrice(price.total, price.currency)}
        </span>
      ) : !loading && unavailable ? (
        <span className="mt-2 block text-xs">Niet beschikbaar</span>
      ) : null}
    </button>
  );
}
