'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { headerNav, headerLinks } from '@/config/site';

/**
 * Desktop navigation with hover/click dropdown groups.
 *
 * Keyboard contract:
 *   Enter / Space  toggle the group open or closed
 *   ArrowDown      open the group and move focus to the first item
 *   Escape         close the open group, return focus to its trigger
 *   Tab            moves through the dropdown items and then out naturally
 *
 * The ONLY reason this is a client component is pathname-based active state
 * and the open/close interaction. The header and the pages that render it
 * stay Server Components.
 *
 * Each group opens on hover (desktop intent) AND on explicit click/keyboard
 * activation (pointer-less access). A single `openGroup` index drives both.
 * Hover sets it to the hovered index on enter and clears it on leave,
 * unless focus is inside the panel (which Tab/keyboard keeps alive).
 *
 * Contrast: all links use navy text on the white/cream header surface. The
 * dropdown panel uses bg-surface with a border-line hairline — same token set
 * as cards and modals. Active state underline is the orange accent, matching
 * the flat links.
 */

export function DesktopNav() {
  const pathname = usePathname();
  const uid = useId();
  const navRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [openGroup, setOpenGroup] = useState<number | null>(null);

  // Close on click outside the entire nav.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Close on Escape anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openGroup !== null) {
        e.preventDefault();
        triggerRefs.current[openGroup]?.focus();
        setOpenGroup(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openGroup]);

  // Close on route change.
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  const open = useCallback((index: number) => setOpenGroup(index), []);
  const close = useCallback(() => setOpenGroup(null), []);
  const toggle = useCallback((index: number) => setOpenGroup((prev) => (prev === index ? null : index)), []);

  return (
    <nav aria-label="Hoofdmenu" className="hidden lg:block" ref={navRef}>
      <ul className="flex items-center gap-1">
        {/* ── Dropdown groups ── */}
        {headerNav.map((group, index) => {
          const isOpen = openGroup === index;
          const triggerId = `${uid}-trigger-${index}`;
          const panelId = `${uid}-panel-${index}`;
          // Mark the group button as active if any child matches the current path.
          const hasActive = group.items.some((item) => {
            const base = item.href.split('#')[0];
            return pathname === base || pathname === item.href;
          });

          return (
            <li
              key={group.label}
              className="relative"
              onMouseEnter={() => open(index)}
              onMouseLeave={() => {
                // Only close on mouse leave if focus is NOT inside this group's panel,
                // so keyboard users navigating dropdown items don't lose the panel.
                const panel = panelRefs.current[index];
                if (!panel?.contains(document.activeElement)) {
                  close();
                }
              }}
            >
              <button
                ref={(el) => { triggerRefs.current[index] = el; }}
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-haspopup="menu"
                onClick={() => toggle(index)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenGroup(index);
                    // Defer so the panel is visible before we move focus.
                    setTimeout(() => {
                      panelRefs.current[index]
                        ?.querySelector<HTMLElement>('a')
                        ?.focus();
                    }, 0);
                  }
                }}
                className={cn(
                  'group/btn relative inline-flex h-11 items-center gap-1.5 rounded-sm px-4 text-[0.9375rem]',
                  'ease-settle transition-colors duration-(--duration-micro)',
                  hasActive
                    ? 'font-semibold text-brand'
                    : 'text-brand font-medium hover:text-navy-700',
                )}
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    'size-3.5 shrink-0 transition-transform duration-200 ease-settle',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
                {/* Active underline, consistent with the flat links below. */}
                <span
                  aria-hidden
                  className={cn(
                    'bg-accent absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full',
                    'ease-settle transition-transform duration-200',
                    hasActive ? 'scale-x-100' : 'scale-x-0 group-hover/btn:scale-x-100',
                  )}
                />
              </button>

              {/* Dropdown panel */}
              <div
                ref={(el) => { panelRefs.current[index] = el; }}
                id={panelId}
                role="menu"
                aria-labelledby={triggerId}
                // Keep the panel alive while mouse is over it, so hover-opened
                // menus don't close the instant the cursor crosses from button to panel.
                onMouseEnter={() => open(index)}
                onMouseLeave={() => {
                  if (!triggerRefs.current[index]?.matches(':hover')) close();
                }}
                className={cn(
                  'absolute left-0 top-[calc(100%+4px)] z-50 min-w-[15rem] rounded-lg',
                  'border-line bg-surface shadow-lifted border',
                  'origin-top transition-all duration-200 ease-settle',
                  isOpen
                    ? 'pointer-events-auto visible scale-y-100 opacity-100'
                    : 'pointer-events-none invisible scale-y-95 opacity-0',
                )}
              >
                <ul className="py-1.5">
                  {group.items.map((item) => {
                    const base = item.href.split('#')[0];
                    const isCurrent = pathname === base || pathname === item.href;
                    return (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          role="menuitem"
                          aria-current={isCurrent ? 'page' : undefined}
                          onClick={() => setOpenGroup(null)}
                          className={cn(
                            'flex min-h-11 items-center px-4 text-sm',
                            'ease-settle transition-colors duration-(--duration-micro)',
                            isCurrent
                              ? 'font-semibold text-brand'
                              : 'text-heading hover:text-brand hover:bg-paper-100',
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}

        {/* ── Standalone links ── */}
        {headerLinks.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'group/link relative inline-flex h-11 items-center rounded-sm px-4 text-[0.9375rem]',
                  'ease-settle transition-colors duration-(--duration-micro)',
                  isCurrent
                    ? 'font-semibold text-brand'
                    : 'text-brand font-medium hover:text-navy-700',
                )}
              >
                {item.label}
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
