import { cn } from '@/lib/cn';

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  /** `wide` for full-bleed grids, `narrow` for reading measure (FAQ, legal). */
  width?: 'default' | 'wide' | 'narrow';
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'width'>;

const widths = {
  // ~1216px of content. Wide enough for a 3-up card grid without the cards
  // becoming letterboxes.
  default: 'max-w-[76rem]',
  wide: 'max-w-[88rem]',
  // ~68ch. Long Dutch compounds need a slightly wider measure than English.
  narrow: 'max-w-[46rem]',
} as const;

/**
 * Horizontal gutter and max width. The only component allowed to own page-level
 * horizontal padding — sections must not add their own, or nested containers
 * double the gutter.
 */
export function Container<T extends React.ElementType = 'div'>({
  as,
  width = 'default',
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn('mx-auto w-full px-5 sm:px-8 lg:px-10', widths[width], className)}
      {...props}
    />
  );
}
