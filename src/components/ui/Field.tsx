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
