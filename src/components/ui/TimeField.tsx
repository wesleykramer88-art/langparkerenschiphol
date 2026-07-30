'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { TIME_OPTIONS, buildTimeOptions } from '@/lib/date';

/**
 * 24-hour time field, quarter-hour increments, 00:00–23:45.
 *
 * A native <select> rather than a custom listbox, deliberately:
 *
 *  - It already satisfies the whole keyboard contract — arrows move, Enter
 *    selects, Escape closes, focus stays on the control — without us
 *    reimplementing a combobox and its ARIA, which is one of the easiest widgets
 *    to get subtly wrong.
 *  - On phones, which are most of this site's traffic, it opens the OS wheel
 *    picker. No custom list beats that with a thumb.
 *  - The 12-hour problem that forced <DateField> to be custom does not apply:
 *    the option text is ours, so "08:00" renders as "08:00" in every locale.
 *
 * Set in the mono face with tabular figures, so the two time fields in a row
 * line up like a departure board.
 */
export function TimeField({
  value,
  onChange,
  onBlur,
  id,
  invalid,
  describedBy,
  required,
  min,
  max,
  interval,
  className,
}: {
  /** `HH:mm`, 24-hour. */
  value: string;
  onChange: (time: string) => void;
  onBlur?: () => void;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
  /**
   * Earliest selectable time, `HH:mm`. Used to enforce ParkingPro's minimum
   * booking notice — valet needs an hour's lead time — on the day that limit
   * actually bites, which is today and no other.
   *
   * Times before this are rendered but DISABLED rather than removed. A select
   * whose option list silently changes length as another field changes is
   * disorienting, and a disabled option explains itself; a missing one does not.
   */
  min?: string;
  /** Latest selectable time, `HH:mm`. Same treatment as `min`. */
  max?: string;
  /**
   * Minutes between options. Comes from ParkingPro's own widget config, so the
   * picker follows the client's back office rather than a number chosen here.
   * Defaults to the quarter-hour grid the site has always used.
   */
  interval?: number;
  className?: string;
}) {
  const options = interval && interval !== 15 ? buildTimeOptions(interval) : TIME_OPTIONS;

  return (
    <div className={cn('relative', className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        required={required}
        className={cn(
          'numeric border-line-strong bg-surface h-12 w-full appearance-none rounded-md border',
          'text-heading pr-10 pl-3.5 text-base',
          'ease-settle transition-[border-color] duration-(--duration-micro)',
          'hover:border-navy-300',
          'focus:border-navy-600 focus:outline-none',
          'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
          invalid && 'border-valet-700',
        )}
      >
        {options.map((time) => (
          // `HH:mm` strings compare correctly as plain strings.
          <option
            key={time}
            value={time}
            disabled={(min && time < min) || (max && time > max) || undefined}
          >
            {time}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden
        className="text-ink-500 pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
      />
    </div>
  );
}
