import Link from 'next/link';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/config/site';

/**
 * Wordmark.
 *
 * A typographic lockup rather than an image: it stays crisp at every size, costs
 * no request, and cannot shift layout while it loads.
 *
 * Set as a stacked two-line lockup because that is how airport signage reads —
 * a small wide-tracked qualifier above a heavy place name. The orange rule is
 * the only accent in the header apart from the CTA.
 *
 * TODO(client): the live site has a logo asset (a 1474x381 WebP referenced in
 * its Organization schema). If there is a vector original, supply it and we will
 * swap this lockup for the real mark.
 */
export function Logo({
  className,
  tone = 'light',
}: {
  className?: string;
  /**
   * 'light' — muted type, for light surfaces.
   * 'dark'  — heading-inverse type, for navy surfaces.
   * 'solid' — brand/heading type, for the solid light header on all routes.
   */
  tone?: 'light' | 'dark' | 'solid';
}) {
  const isDark = tone === 'dark';
  const isSolid = tone === 'solid';
  const isLight = tone === 'light';

  return (
    <Link
      href="/"
      // The visible text reads "LANG PARKEREN / SCHIPHOL" across two lines; give
      // AT the company name as one continuous string.
      aria-label={`${siteConfig.name} — naar de homepage`}
      className={cn(
        'group inline-flex items-center gap-3 rounded-sm',
        'ease-settle transition-opacity duration-(--duration-micro) hover:opacity-85',
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-accent ease-settle h-9 w-1 shrink-0 rounded-full transition-[height] duration-(--duration-micro) group-hover:h-10"
      />
      <span aria-hidden className="flex flex-col leading-none">
        <span
          className={cn(
            'eyebrow ease-settle transition-colors duration-300',
            isDark && 'text-navy-300',
            isSolid && 'text-brand',
            isLight && 'text-muted',
          )}
        >
          Lang Parkeren
        </span>
        {/*
          A literal space between the two lines of the lockup.

          It changes nothing visually — these are two flex-column children — but
          it is what makes the link pass WCAG 2.5.3 Label in Name (Level A).
          Without it the rendered text of this link concatenates to
          "Lang ParkerenSchiphol", which the aria-label
          ("Lang Parkeren Schiphol — naar de homepage") does not contain as a
          substring. A speech-input user saying "Lang Parkeren Schiphol" would
          not be able to activate the link.

          Do not remove it, and do not let a formatter collapse it into the
          newline above: JSX discards whitespace containing a line break, which
          is exactly how the space went missing in the first place.
        */}{' '}
        <span
          className={cn(
            'ease-settle mt-1 text-xl font-bold tracking-[-0.02em] transition-colors duration-300',
            isDark && 'text-heading-inverse',
            isSolid && 'text-heading',
            isLight && 'text-heading',
          )}
        >
          Schiphol
        </span>
      </span>
    </Link>
  );
}
