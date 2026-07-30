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
import { isBefore, isoToShortLabel } from '@/lib/date';
import { DEFAULT_BOUNDS, type PickerBounds } from '@/lib/parkingpro-config';
import { formatPrice, useLivePrice } from '@/hooks/useLivePrice';
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

const SERVICE_LABELS: Record<ServiceSlug, { name: string; note: string }> = {
  shuttle: { name: 'Shuttle', note: 'U parkeert zelf · shuttle naar de vertrekhal' },
  valet: { name: 'Valet', note: 'Wij nemen uw auto over bij de vertrekhal' },
};

export function BookingPicker({
  notch = 'canvas',
  /**
   * Opening hours and defaults, read from ParkingPro's own widget config on the
   * server. Today his instance returns nulls for all of them and these are the
   * values the picker always used; the moment he sets opening hours in his back
   * office, this follows without a deploy. See src/lib/parkingpro-config.ts.
   */
  bounds = DEFAULT_BOUNDS,
  className,
}: {
  notch?: NotchColor;
  bounds?: PickerBounds;
  className?: string;
}) {
  const router = useRouter();
  const errorId = useId();
  const serviceLabelId = useId();

  const [values, setValues] = useState<BookingSelection>({
    // Shuttle first: it is the cheaper product, it carries no minimum notice, so
    // nothing is disabled on first render, and it is what most long-stay
    // travellers book. Valet is one tap away.
    service: 'shuttle',
    arrivalDate: '',
    arrivalTime: bounds.defaultArrivalTime,
    departureDate: '',
    departureTime: bounds.defaultDepartureTime,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingSelection, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const nights = countNights(values.arrivalDate, values.departureDate);

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

  // The real price, in our own typography, before the visitor has seen a single
  // ParkingPro screen. Never blocks and never fails loudly — see useLivePrice.
  const price = useLivePrice({
    service: values.service,
    arrivalDate: values.arrivalDate,
    departureDate: values.departureDate,
  });

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
        <div className="px-6 pt-7 pb-6 sm:px-7">
          <h2 className="text-display-sm">Reserveer uw parkeerplaats</h2>

          {/* ---------- Service ----------
              A radiogroup rather than a select: two options, both worth reading,
              and the choice changes what the rest of the form allows. Rendered
              as real radio inputs with the label styled — so it is operable with
              arrow keys and announced as a group, which a row of buttons is not. */}
          <fieldset className="mt-6 border-0 p-0">
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
                    {SERVICE_LABELS[slug].name}
                  </label>
                );
              })}
            </div>

            <p className="text-muted mt-2.5 text-xs leading-relaxed">
              {SERVICE_LABELS[values.service].note}
            </p>
          </fieldset>

          <fieldset className="mt-6 flex flex-col gap-4 border-0 p-0">
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

          <Button type="submit" size="lg" disabled={submitting} className="mt-5 w-full">
            Reserveer nu
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
        <div className="flex items-end justify-between gap-4 px-6 pt-4 pb-6 sm:px-7">
          <div className="min-w-0">
            <p className="eyebrow text-muted">{nights ? 'Parkeerperiode' : 'Uw voordeel'}</p>
            <p className="numeric text-heading mt-1.5 truncate text-base font-medium">
              {nights
                ? `${isoToShortLabel(values.arrivalDate)} — ${isoToShortLabel(values.departureDate)}`
                : 'Optionele annuleringsdekking'}
            </p>
          </div>
          <div className="numeric shrink-0 text-right">
            {nights && price ? (
              <>
                <span className="text-heading block text-xl leading-none font-semibold">
                  {formatPrice(price.total, price.currency)}
                </span>
                <span className="text-muted mt-1 block text-xs">
                  {price.from ? 'vanaf · ' : ''}
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
    <div className="grid gap-3 sm:grid-cols-[1fr_7.5rem]">
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
