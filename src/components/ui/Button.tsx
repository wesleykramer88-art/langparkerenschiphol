import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * Button styles.
 *
 * The primary fill is valet orange with NAVY text, not white. White on
 * valet-600 measures 3.4:1, which fails WCAG AA for label text at normal size;
 * navy-950 on valet-600 is 5.0:1 and passes. It is also the truer reference —
 * hi-vis safety signage is dark type on orange, never white on orange.
 *
 * Every variant is at least 44px tall so it clears the minimum tap target on the
 * phones that make up most of this site's traffic.
 */
const button = cva(
  [
    // --radius-md, not a pill. Full-pill buttons paired with heavily rounded
    // cards is the house style of every generated landing page; the tighter
    // radius is most of what separates this from that. Pills survive only on
    // small status badges, where the shape carries meaning.
    'inline-flex items-center justify-center gap-2 rounded-md',
    // Trailing arrows slide on hover. Scoped to [data-arrow] so a LEADING icon
    // (the phone glyph, say) does not drift away from its label.
    '[&_[data-arrow]]:transition-transform [&_[data-arrow]]:duration-(--duration-micro)',
    '[&_[data-arrow]]:ease-settle hover:[&_[data-arrow]]:translate-x-1',
    'font-semibold whitespace-nowrap',
    'transition-[background-color,color,border-color,transform,box-shadow]',
    'duration-(--duration-micro) ease-settle',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-55',
  ],
  {
    variants: {
      variant: {
        /** The booking action. One per view — that is what makes it read as
         *  the thing to do. Its shadow is accent-tinted rather than navy: on
         *  the one control that matters most, a warm shadow reads as the button
         *  being lit, where a neutral one reads as a rectangle on a page. */
        primary:
          'bg-accent text-on-accent shadow-accent hover:bg-accent-hover hover:shadow-accent-lifted hover:-translate-y-0.5',
        /** Secondary navigation-weight action on light backgrounds. */
        secondary: 'bg-surface-inverse text-heading-inverse hover:bg-navy-800',
        /** Quiet action that still needs a visible boundary. */
        outline:
          'border border-line-strong bg-surface text-heading hover:border-navy-600 hover:text-brand',
        /** On navy sections. */
        onDark:
          'border border-line-inverse bg-transparent text-heading-inverse hover:border-navy-200 hover:bg-navy-900',
        /** Text-only. Keeps an underline so colour is never the only signal.
         *
         *  `min-h-11` rather than `h-auto`: this variant is always a standalone
         *  call to action here, never a link inside a sentence, and at its own
         *  line height it was a 16px-tall tap target. The horizontal padding
         *  stays at zero so it still reads as text and aligns with the copy
         *  above it — the 44px is bought vertically, where nothing sees it. */
        link: 'min-h-11 rounded-sm px-0 text-brand underline decoration-navy-300 decoration-1 underline-offset-4 hover:decoration-navy-600',
      },
      size: {
        sm: 'h-11 px-4 text-sm',
        md: 'h-12 px-6 text-[0.9375rem]',
        lg: 'h-14 px-8 text-base',
      },
    },
    // The link variant sets its own height and padding; the size variants must
    // not put a fixed `h-*` or horizontal padding back on it.
    compoundVariants: [
      { variant: 'link', size: ['sm', 'md', 'lg'], class: 'h-auto min-h-11 px-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonVariants = VariantProps<typeof button>;

type ButtonAsButton = ButtonVariants & React.ComponentPropsWithoutRef<'button'> & { href?: never };

type ButtonAsLink = ButtonVariants &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Renders a real <button> when it performs an action and a real <a> when it
 * navigates — decided by the presence of `href`, never by a prop the caller can
 * get wrong. There is no code path here that produces a <div> with an onClick.
 *
 * External and hash-only hrefs bypass next/link, which cannot prefetch them.
 */
export function Button({ variant, size, className, ...props }: ButtonProps) {
  const classes = cn(button({ variant, size }), className);

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    const isInternal = href.startsWith('/');

    if (!isInternal) {
      const { ...anchorProps } = rest as React.ComponentPropsWithoutRef<'a'>;
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          className={classes}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...anchorProps}
        />
      );
    }

    return <Link href={href} className={classes} {...rest} />;
  }

  const { type = 'button', ...buttonProps } = props as ButtonAsButton;
  return <button type={type} className={classes} {...buttonProps} />;
}
