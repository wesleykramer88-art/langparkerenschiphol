import { cn } from '@/lib/cn';

/**
 * The airport-signage voice: small, wide-tracked, uppercase. Sits above a
 * section heading and names the section the way a departure board names a
 * column.
 *
 * Optionally preceded by a short rule, which gives the label something to hang
 * off and keeps a lone line of small caps from floating.
 */
export function Eyebrow({
  children,
  rule = false,
  tone = 'brand',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'> & {
  /** Draw a short leading rule. */
  rule?: boolean;
  tone?: 'brand' | 'accent' | 'muted' | 'onDark';
}) {
  const tones = {
    brand: 'text-brand',
    accent: 'text-accent',
    muted: 'text-muted',
    onDark: 'text-navy-300',
  } as const;

  const ruleTones = {
    brand: 'bg-navy-300',
    accent: 'bg-accent',
    muted: 'bg-line-strong',
    onDark: 'bg-navy-600',
  } as const;

  return (
    <p className={cn('eyebrow flex items-center gap-3', tones[tone], className)} {...props}>
      {rule ? <span aria-hidden className={cn('h-px w-8 shrink-0', ruleTones[tone])} /> : null}
      {children}
    </p>
  );
}
