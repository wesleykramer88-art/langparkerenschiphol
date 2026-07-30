import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Crumb } from '@/lib/schema';

/**
 * The visible breadcrumb trail.
 *
 * Every subpage carries one, sitting directly under the header in the page
 * hero. This is the most literal expression of the brand instruction in the
 * whole build: an airport tells you where you are before it tells you anything
 * else, and a trail is wayfinding rather than decoration.
 *
 * It also does two unglamorous jobs. Google renders breadcrumbs in place of the
 * URL in a result when the BreadcrumbList markup and the visible trail agree —
 * so this must stay in step with the `breadcrumbSchema()` call on the same page,
 * which is why both read the same `crumbs` array. And on a phone, where the
 * header collapses to a logo and a hamburger, it is the only always-visible way
 * back up a level.
 *
 * The last crumb is the current page: rendered as plain text with
 * aria-current="page", never as a link to itself.
 */
export function Breadcrumbs({
  crumbs,
  tone = 'onDark',
  className,
}: {
  /** The trail BELOW home. Home is prepended here, exactly as in the schema. */
  crumbs: readonly Crumb[];
  tone?: 'onDark' | 'onLight';
  className?: string;
}) {
  const trail = [{ name: 'Home', path: '/' }, ...crumbs];

  const tones = {
    onDark: {
      link: 'text-navy-300 hover:text-heading-inverse decoration-navy-600 hover:decoration-navy-300',
      current: 'text-navy-100',
      separator: 'text-navy-600',
    },
    onLight: {
      link: 'text-muted hover:text-brand decoration-line-strong hover:decoration-navy-300',
      current: 'text-heading',
      separator: 'text-line-strong',
    },
  }[tone];

  return (
    <nav aria-label="Kruimelpad" className={className}>
      {/* `py-1.5` on each crumb rather than on the list: it grows the link's own
          hit area to ~28px, which clears WCAG 2.2's 24px minimum (SC 2.5.8)
          without turning a slim trail into a row of buttons. A breadcrumb is not
          a primary action, and 44px here would give the least important control
          on the page the same weight as the booking button. */}
      <ol className="-my-1.5 flex flex-wrap items-center gap-x-1.5 text-xs">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className={cn('size-3.5 shrink-0', tones.separator)} aria-hidden />
              ) : null}

              {isLast ? (
                <span aria-current="page" className={cn('py-1.5 font-medium', tones.current)}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className={cn(
                    'ease-settle inline-block py-1.5 underline underline-offset-4 transition-colors duration-(--duration-micro)',
                    tones.link,
                  )}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
