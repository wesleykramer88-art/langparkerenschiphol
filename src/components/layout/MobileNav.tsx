'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogIn, Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { useIsMounted } from '@/hooks/useIsMounted';
import { headerNav, headerLinks, siteConfig } from '@/config/site';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Mobile navigation.
 *
 * Animated with CSS transitions rather than motion. The header renders on every
 * route, so importing motion here would put ~34KB of animation runtime into the
 * initial chunk of every page — including pages that animate nothing above the
 * fold. motion is reserved for the homepage hero, the one place it earns its
 * weight.
 *
 * The two dropdown groups from the desktop nav become accordion sections here.
 * Each section has a disclosure button that toggles its child links. Standalone
 * links remain as flat entries. The rest of the panel (Reserveer nu, Inloggen,
 * phone) is unchanged.
 *
 * Keyboard contract:
 *   Escape          closes the panel, returns focus to the trigger
 *   Tab / Shift+Tab cycles within the panel and cannot escape it
 *   Enter / Space   toggle accordion sections
 *   opening panel   moves focus into the panel
 *   route change    closes the panel
 */
export function MobileNav() {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const panelId = useId();
  const uid = useId();
  const mounted = useIsMounted();

  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  // Track which accordion group is open (index into headerNav).
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpenedOn(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        onClick={() => setOpenedOn(open ? null : pathname)}
        className={cn(
          'grid size-11 place-items-center rounded-md border lg:hidden',
          'ease-settle transition-colors duration-300',
          'border-navy-300 text-brand hover:border-navy-600 hover:text-navy-700',
        )}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {mounted
        ? createPortal(
            <>
              {/* Scrim */}
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={close}
                className={cn(
                  'bg-navy-950/45 fixed inset-0 z-40 backdrop-blur-[2px] lg:hidden',
                  'ease-settle transition-opacity duration-(--duration-micro)',
                  open ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              />

              {/* Panel */}
              <div
                ref={panelRef}
                id={panelId}
                inert={!open}
                className={cn(
                  'fixed inset-x-0 top-0 z-50 lg:hidden',
                  'border-line bg-surface shadow-lifted border-b',
                  open
                    ? 'visible translate-y-0 [transition:transform_300ms_var(--ease-settle)]'
                    : 'invisible -translate-y-full [transition:transform_300ms_var(--ease-settle),visibility_0s_300ms]',
                  'motion-reduce:transition-none',
                )}
              >
                {/* Header row */}
                <div className="border-line flex items-center justify-between border-b px-5 py-4">
                  <span className="eyebrow text-muted">Menu</span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Menu sluiten"
                    className="border-line-strong text-heading hover:border-navy-600 hover:text-brand ease-settle grid size-11 place-items-center rounded-md border transition-colors duration-300"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <nav aria-label="Hoofdmenu" className="px-5 py-2">
                  <ul className="divide-line divide-y">
                    {/* ── Accordion groups ── */}
                    {headerNav.map((group, index) => {
                      const isExpanded = openAccordion === index;
                      const sectionId = `${uid}-acc-${index}`;
                      const btnId = `${uid}-accbtn-${index}`;
                      const hasActive = group.items.some((item) => {
                        const base = item.href.split('#')[0];
                        return pathname === base || pathname === item.href;
                      });

                      return (
                        <li key={group.label}>
                          <button
                            id={btnId}
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={sectionId}
                            onClick={() =>
                              setOpenAccordion((prev) => (prev === index ? null : index))
                            }
                            className={cn(
                              'ease-settle flex w-full min-h-[3.25rem] items-center justify-between text-lg font-medium transition-colors duration-300',
                              hasActive ? 'text-brand' : 'text-heading',
                            )}
                          >
                            <span>{group.label}</span>
                            <ChevronDown
                              className={cn(
                                'size-4 shrink-0 transition-transform duration-200 ease-settle',
                                isExpanded && 'rotate-180',
                              )}
                              aria-hidden
                            />
                          </button>

                          {/* Accordion body */}
                          <div
                            id={sectionId}
                            role="region"
                            aria-labelledby={btnId}
                            className={cn(
                              'overflow-hidden transition-all duration-300 ease-settle',
                              isExpanded ? 'max-h-96 pb-2' : 'max-h-0',
                            )}
                          >
                            <ul className="flex flex-col">
                              {group.items.map((item) => {
                                const base = item.href.split('#')[0];
                                const isCurrent = pathname === base || pathname === item.href;
                                return (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      aria-current={isCurrent ? 'page' : undefined}
                                      onClick={close}
                                      className={cn(
                                        'ease-settle flex min-h-11 items-center pl-4 text-base transition-colors duration-300',
                                        isCurrent
                                          ? 'font-semibold text-brand'
                                          : 'text-muted hover:text-brand',
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
                            onClick={close}
                            className={cn(
                              'ease-settle flex min-h-[3.25rem] items-center text-lg font-medium transition-colors duration-300',
                              isCurrent ? 'text-brand' : 'text-heading hover:text-brand',
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* CTA buttons */}
                <div className="flex flex-col gap-3 px-5 pt-3 pb-6">
                  <Button href="/reservering/" size="lg">
                    Reserveer nu
                  </Button>
                  <Button href="/login/" variant="outline" size="lg">
                    <LogIn className="size-4" aria-hidden />
                    Inloggen op klantenportaal
                  </Button>
                  <Button href={siteConfig.phone.href} variant="outline" size="lg">
                    <Phone className="size-4" aria-hidden />
                    <span className="sr-only">Bel ons: </span>
                    {siteConfig.phone.display}
                  </Button>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
