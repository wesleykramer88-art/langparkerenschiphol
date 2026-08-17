'use client';

// Client-only: useId is a hook, and the render-prop child below is a function,
// which cannot be serialised across the server/client boundary. Both forms that
// use this (contact, booking) are interactive anyway.

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Form field wrapper: real <label>, optional hint, and an error region wired up
 * through aria-describedby.
 *
 * Errors are announced with aria-live="polite" and are prefixed with an icon
 * glyph as well as colour, so the failure is never communicated by colour alone.
 *
 * The control is supplied as a render prop rather than as children, so the
 * generated ids reach the input without the caller having to thread them.
 */
export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
    required: boolean | undefined;
  }) => React.ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-heading text-sm font-medium">
        {label}
        {required ? (
          <>
            {' '}
            <span className="text-accent-hover" aria-hidden>
              *
            </span>
            <span className="sr-only">(verplicht)</span>
          </>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="text-muted text-xs">
          {hint}
        </p>
      ) : null}

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required: required || undefined,
      })}

      {/* Always rendered so the live region exists before the message arrives —
          a region inserted at the same moment as its text is often not announced. */}
      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          'text-valet-800 text-xs font-medium',
          error ? 'flex items-center gap-1' : 'sr-only',
        )}
      >
        {error ? (
          <>
            <span aria-hidden>&#9888;</span>
            {error}
          </>
        ) : null}
      </p>
    </div>
  );
}

/** Shared control styling, so input/select/textarea cannot drift apart. */
export const controlClasses = cn(
  'h-12 w-full rounded-md border border-line-strong bg-surface px-3.5',
  'text-base text-heading placeholder:text-ink-400',
  'transition-[border-color,box-shadow] duration-(--duration-micro) ease-settle',
  'hover:border-navy-300',
  'focus:border-navy-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'aria-[invalid=true]:border-valet-700',
);

export function Input({ className, ...props }: React.ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentPropsWithoutRef<'textarea'>) {
  return (
    <textarea
      rows={5}
      className={cn(controlClasses, 'h-auto resize-y py-3 leading-relaxed', className)}
      {...props}
    />
  );
}

/**
 * A native <select>, on the same control styling as the input.
 *
 * Native rather than a listbox built out of divs: this is a nine-option subject
 * picker on a contact form, and the platform control already has keyboard
 * support, type-ahead, an accessible name from the <label> above it, and the
 * correct wheel picker on a phone. A custom one would be a great deal of code
 * to arrive back where this starts.
 *
 * `appearance-none` plus a chevron drawn as a background image, because the
 * native arrow is drawn in the OS's own colour and sits at the OS's own inset —
 * beside an <Input> on the same row that reads as a rendering error rather than
 * as a different control. `pr-10` keeps the longest option clear of it.
 *
 * The chevron is inlined as a data: URI rather than an icon component: a
 * background image cannot be a React element, and a wrapper div with an
 * absolutely-positioned <ChevronDown> would break the shared `controlClasses`
 * focus ring by moving the focusable element inside another box.
 */
const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function Select({ className, ...props }: React.ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={cn(controlClasses, 'cursor-pointer appearance-none bg-no-repeat pr-10', className)}
      style={{
        backgroundImage: chevron,
        backgroundPosition: 'right 0.75rem center',
      }}
      {...props}
    />
  );
}
