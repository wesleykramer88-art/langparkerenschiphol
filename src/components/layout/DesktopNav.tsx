'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { mainNav } from '@/config/site';

/**
 * Desktop navigation.
 *
 * The ONLY reason this is a client component is aria-current, which needs the
 * pathname. Kept as a leaf so the header, and the pages that render it, stay
 * Server Components.
 *
 * The current page is marked three ways — aria-current for AT, weight for
 * scanning, and an underline rule — because colour alone is never a sufficient
 * signal.
 *
 * On the solid light header, all links use dark navy text for excellent
 * contrast. Current page is bold with an orange underline. Hover state
 * uses navy-700 for visual feedback.
 */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Hoofdmenu" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'group/link relative inline-flex h-11 items-center rounded-sm px-4 text-[0.9375rem]',
                  'ease-settle transition-colors duration-(--duration-micro)',
                  // Dark navy text on solid light header.
                  isCurrent
                    ? 'font-semibold text-brand'
                    : 'text-brand font-medium hover:text-navy-700',
                )}
              >
                {item.label}
                {/* Orange rule: static under the current page, wiping in from the
                    left on hover elsewhere. scaleX on an origin, so it runs on
                    the compositor rather than reflowing. */}
                <span
                  aria-hidden
                  className={cn(
                    'bg-accent absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full',
                    'ease-settle transition-transform duration-200',
                    isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100',
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
