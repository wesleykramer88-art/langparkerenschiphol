'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  MONTHS_NL,
  WEEKDAYS_NL_SHORT,
  addDays,
  addMonths,
  daysInMonth,
  displayToIso,
  firstWeekdayMondayFirst,
  fromIso,
  isBefore,
  isoToDisplay,
  isoToLongLabel,
  maskDateInput,
  toIso,
  todayIso,
} from '@/lib/date';

/**
 * Dutch date field: a masked `dd-mm-jjjj` text input with a calendar popover.
 *
 * Why this exists rather than <input type="date">: the native control renders in
 * the BROWSER's locale, not the page's `lang`. A Dutch visitor on a US-configured
 * browser sees mm/dd/yyyy on a Dutch parking site, which reads as "this was not
 * built for you" — and on a booking form, an ambiguous date is a real support
 * cost, not just a cosmetic one. There is no markup that fixes it.
 *
 * Built without a date library on purpose. This is four fields; react-day-picker
 * plus date-fns is ~40KB gzipped to render a 42-cell grid, and every byte lands
 * in the hero's critical path.
 *
 * Keyboard: the input accepts typing directly. In the calendar, arrows move by
 * day/week, PageUp/PageDown by month, Home/End to week bounds, Enter or Space
 * selects, Escape closes and returns focus to the trigger.
 */
export function DateField({
  value,
  onChange,
  onBlur,
  id,
  min,
  max,
  invalid,
  describedBy,
  required,
  className,
}: {
  /** ISO `YYYY-MM-DD`, or '' when empty. */
  value: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  id?: string;
  /** Earliest selectable ISO date, inclusive. */
  min?: string;
  /** Latest selectable ISO date, inclusive. */
  max?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
  className?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const dialogId = `${generatedId}-calendar`;

  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => isoToDisplay(value));
  // The month the grid is showing, as an ISO date inside that month.
  const [viewMonth, setViewMonth] = useState(() => value || min || todayIso());
  // The day the roving tabindex currently sits on.
  const [focusedDay, setFocusedDay] = useState(() => value || min || todayIso());

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Set when the calendar should move focus to the active day on next paint.
  const shouldFocusDay = useRef(false);

  // Keep the visible text in step when the value is changed from outside (e.g.
  // the return date being clamped forward when the arrival date moves).
  //
  // Adjusted during render against the previous prop rather than in an effect:
  // an effect would paint the stale text for one frame first, and React would
  // then re-render anyway. This is the documented pattern for state that has to
  // track a prop — the setState is guarded by a comparison, so it runs once and
  // does not loop.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (displayToIso(text) !== value) setText(isoToDisplay(value));
  }

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const isDisabled = useCallback(
    (iso: string) => {
      if (min && isBefore(iso, min)) return true;
      if (max && isBefore(max, iso)) return true;
      return false;
    },
    [min, max],
  );

  const commit = useCallback(
    (iso: string) => {
      if (isDisabled(iso)) return;
      onChange(iso);
      setText(isoToDisplay(iso));
      close();
    },
    [isDisabled, onChange, close],
  );

  // Close on outside pointer down. Pointerdown rather than click, so the popover
  // is gone before a click on something behind it resolves.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Move DOM focus onto the active day after the grid renders.
  useEffect(() => {
    if (!open || !shouldFocusDay.current) return;
    shouldFocusDay.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]')?.focus();
  });

  const openCalendar = () => {
    const start = value || min || todayIso();
    setViewMonth(start);
    setFocusedDay(start);
    shouldFocusDay.current = true;
    setOpen(true);
  };

  const moveFocus = (iso: string) => {
    setFocusedDay(iso);
    setViewMonth(iso);
    shouldFocusDay.current = true;
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    let next: string | null = null;

    if (key === 'ArrowLeft') next = addDays(focusedDay, -1);
    else if (key === 'ArrowRight') next = addDays(focusedDay, 1);
    else if (key === 'ArrowUp') next = addDays(focusedDay, -7);
    else if (key === 'ArrowDown') next = addDays(focusedDay, 7);
    else if (key === 'PageUp') next = addMonths(focusedDay, -1);
    else if (key === 'PageDown') next = addMonths(focusedDay, 1);
    else if (key === 'Home') next = addDays(focusedDay, -weekdayIndex(focusedDay));
    else if (key === 'End') next = addDays(focusedDay, 6 - weekdayIndex(focusedDay));
    else if (key === 'Escape') {
      event.preventDefault();
      close();
      return;
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      commit(focusedDay);
      return;
    } else {
      return;
    }

    event.preventDefault();
    moveFocus(next);
  };

  const view = fromIso(viewMonth) ?? fromIso(todayIso())!;
  const monthLength = daysInMonth(view.year, view.month);
  const leadingBlanks = firstWeekdayMondayFirst(view.year, view.month);
  const today = todayIso();

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="dd-mm-jjjj"
          maxLength={10}
          value={text}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          required={required}
          onChange={(event) => {
            const masked = maskDateInput(event.target.value);
            setText(masked);
            const iso = displayToIso(masked);
            // Only publish a complete, real, in-range date. Half-typed input
            // must not trip validation on every keystroke.
            if (iso && !isDisabled(iso)) onChange(iso);
            else if (masked === '') onChange('');
          }}
          onBlur={onBlur}
          className={cn(
            'numeric border-line-strong bg-surface h-12 w-full rounded-md border',
            'text-heading placeholder:text-ink-400 pr-11 pl-3.5 text-base placeholder:font-sans',
            'ease-settle transition-[border-color] duration-(--duration-micro)',
            'hover:border-navy-300',
            'focus:border-navy-600 focus:outline-none',
            'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
            invalid && 'border-valet-700',
          )}
        />

        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          aria-label={open ? 'Kalender sluiten' : 'Kalender openen'}
          onClick={() => (open ? close() : openCalendar())}
          className={cn(
            'absolute top-1 right-1 grid size-10 place-items-center rounded-sm',
            'text-ink-500 ease-settle transition-colors duration-(--duration-micro)',
            'hover:bg-surface-sunken hover:text-brand',
          )}
        >
          <CalendarDays className="size-[1.125rem]" />
        </button>
      </div>

      {open ? (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label="Kies een datum"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              close();
            }
          }}
          className={cn(
            'absolute top-[calc(100%+0.5rem)] left-0 z-30 w-[19.5rem] max-w-[calc(100vw-2.5rem)]',
            'border-line bg-surface shadow-lifted rounded-xl border p-3',
          )}
        >
          <div className="flex items-center justify-between gap-2 px-1 pb-2">
            <button
              type="button"
              aria-label="Vorige maand"
              onClick={() => setViewMonth(addMonths(viewMonth, -1))}
              className="text-ink-600 hover:bg-surface-sunken hover:text-brand ease-settle grid size-9 place-items-center rounded-sm transition-colors duration-(--duration-micro)"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* aria-live so month changes are announced to a screen reader
                driving the calendar with PageUp/PageDown. */}
            <p aria-live="polite" className="text-heading text-sm font-semibold">
              {MONTHS_NL[view.month - 1]} {view.year}
            </p>

            <button
              type="button"
              aria-label="Volgende maand"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="text-ink-600 hover:bg-surface-sunken hover:text-brand ease-settle grid size-9 place-items-center rounded-sm transition-colors duration-(--duration-micro)"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Monday-first. A Sunday-first week is instantly wrong to a Dutch reader. */}
          <div aria-hidden className="grid grid-cols-7 gap-0.5 pb-1">
            {WEEKDAYS_NL_SHORT.map((day) => (
              <span
                key={day}
                className="text-ink-400 grid h-7 place-items-center text-[0.6875rem] font-semibold tracking-wider uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          {/* One roving tabindex across the grid: Tab leaves the calendar, arrows
              move within it — the expected behaviour for a composite widget. */}
          <div
            ref={gridRef}
            role="grid"
            aria-label={`${MONTHS_NL[view.month - 1]} ${view.year}`}
            onKeyDown={onGridKeyDown}
            className="grid grid-cols-7 gap-0.5"
          >
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} role="presentation" />
            ))}

            {Array.from({ length: monthLength }, (_, i) => {
              const day = i + 1;
              const iso = toIso(view.year, view.month, day);
              const disabled = isDisabled(iso);
              const selected = iso === value;
              const active = iso === focusedDay;

              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  data-active={active}
                  tabIndex={active ? 0 : -1}
                  disabled={disabled}
                  aria-selected={selected}
                  aria-current={iso === today ? 'date' : undefined}
                  aria-label={isoToLongLabel(iso)}
                  onClick={() => commit(iso)}
                  className={cn(
                    'numeric grid h-9 place-items-center rounded-sm text-sm',
                    'ease-settle transition-colors duration-(--duration-micro)',
                    'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-1',
                    disabled && 'text-ink-400/45 cursor-not-allowed',
                    !disabled && !selected && 'text-heading hover:bg-accent-wash',
                    selected && 'bg-accent text-on-accent font-semibold',
                    // Today gets a ring as well as its aria-current, so the
                    // marker is not carried by colour alone.
                    !selected && iso === today && 'ring-navy-300 ring-1 ring-inset',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** 0 = Monday. Local helper so the grid can jump to week bounds. */
function weekdayIndex(iso: string): number {
  const parts = fromIso(iso);
  if (!parts) return 0;
  const sundayFirst = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  return (sundayFirst + 6) % 7;
}
