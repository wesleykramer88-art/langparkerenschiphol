import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * A plain surface. Deliberately restrained: the parking ticket is this site's
 * one bold device, so ordinary cards stay quiet — hairline border, soft
 * navy-tinted shadow, no gradient, no coloured left edge.
 */
const card = cva('relative rounded-xl transition-[transform,box-shadow,border-color]', {
  variants: {
    tone: {
      surface: 'border border-line bg-surface shadow-card',
      sunken: 'border border-line bg-surface-sunken',
      accent: 'border border-valet-200 bg-accent-wash',
      inverse: 'border border-line-inverse bg-navy-900',
      /** No chrome at all — for grid items that only need padding. */
      bare: '',
    },
    padding: {
      none: '',
      sm: 'p-5',
      md: 'p-6 sm:p-7',
      lg: 'p-7 sm:p-9',
    },
    /** Lift on hover. Only for cards that are themselves a link. */
    interactive: {
      true: 'duration-200 ease-settle hover:-translate-y-1 hover:shadow-lifted',
      false: '',
    },
  },
  defaultVariants: { tone: 'surface', padding: 'md', interactive: false },
});

type CardProps<T extends React.ElementType> = {
  as?: T;
} & VariantProps<typeof card> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as' | keyof VariantProps<typeof card>>;

export function Card<T extends React.ElementType = 'div'>({
  as,
  tone,
  padding,
  interactive,
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';
  return <Component className={cn(card({ tone, padding, interactive }), className)} {...props} />;
}
