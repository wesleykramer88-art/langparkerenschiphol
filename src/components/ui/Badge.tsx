import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * A short status label — "Snelste optie", "Meest betaalbare keuze".
 *
 * Uses the eyebrow's letterforms so badges and section eyebrows read as the same
 * signage voice rather than two competing label styles.
 */
const badge = cva('eyebrow inline-flex items-center gap-1.5 rounded-full px-3 py-1.5', {
  variants: {
    tone: {
      /** The stronger of the two. Marks the recommended option. */
      accent: 'bg-accent text-on-accent',
      brand: 'bg-navy-100 text-navy-700',
      neutral: 'bg-paper-300 text-ink-700',
      onDark: 'bg-navy-800 text-navy-100',
      outline: 'border border-line-strong text-ink-600',
    },
  },
  defaultVariants: { tone: 'brand' },
});

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof badge>;

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
