'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { useIsMounted } from '@/hooks/useIsMounted';
import { mainNav, siteConfig } from '@/config/site';

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
 * Keyboard contract:
 *   Escape          closes and returns focus to the trigger
 *   Tab / Shift+Tab cycles within the panel and cannot escape it
 *   opening         moves focus into the panel
 *   route change    closes
 */
export function MobileNav() {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const panelId = useId();
  const mounted = useIsMounted();

  /**
   * Open state is stored as the path the panel was opened ON, and "open" is
   * derived by comparing it with the current path. Navigating therefore closes
   * the panel as a consequence of the route changing, with no effect watching
   * the pathname to push state — which would cost an extra render on every
   * navigation, open or not.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const close = useCallback(() => {
    setOpenedOn(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // Lock the page behind the panel, compensating for the scrollbar so the
    // layout underneath does not jump sideways as it disappears.
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    // Move focus into the panel.
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

      // Wrap at both ends so focus can never land on the inert page behind.
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
        // Light over the transparent header, dark once HeaderShell marks itself
        // scrolled — the same contract the logo and nav links follow.
        className={cn(
          'grid size-11 place-items-center rounded-md border lg:hidden',
          'ease-settle transition-colors duration-300',
          'border-navy-600 text-navy-100 hover:border-navy-300 hover:text-white',
          'group-data-[scrolled=true]/header:border-line-strong group-data-[scrolled=true]/header:text-heading',
          'group-data-[scrolled=true]/header:hover:border-navy-600 group-data-[scrolled=true]/header:hover:text-brand',
        )}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/*
        The scrim and panel are portalled to <body>.

        They must escape the header's subtree: SiteHeader applies backdrop-blur,
        and a backdrop-filter establishes a containing block for `position:
        fixed` descendants. Left inside it, `fixed inset-0` resolved against the
        72px header bar rather than the viewport — so the scrim covered only the
        header strip, the page behind was never dimmed, and tapping below the
        panel did not dismiss it.
      */}
      {mounted
        ? createPortal(
            <>
              {/* A real button so it is dismissible by pointer, but kept out of
                  the tab order and hidden from AT — Escape and the close control
                  are the keyboard affordances. */}
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

              <div
                ref={panelRef}
                id={panelId}
                // Hidden from AT and from the tab order while closed, so the
                // panel's links are not reachable behind the scrim.
                inert={!open}
                className={cn(
                  'fixed inset-x-0 top-0 z-50 lg:hidden',
                  'border-line bg-surface shadow-lifted border-b',
                  // `invisible` is not redundant with the off-canvas translate:
                  // sliding the panel up still leaves its drop shadow painting
                  // over the marquee strip below, which turned the navy band
                  // white on mobile. visibility:hidden stops it painting at all,
                  // and unlike `hidden` it keeps the element around so the slide
                  // still animates.
                  //
                  // The transitions are spelled out because the two properties
                  // need different timing: the transform always animates over
                  // 300ms, while visibility must flip instantly on open but wait
                  // for the slide to finish on close. A plain `delay-300` would
                  // delay the transform too, leaving the panel hanging for a beat
                  // before it moved.
                  open
                    ? 'visible translate-y-0 [transition:transform_300ms_var(--ease-settle)]'
                    : 'invisible -translate-y-full [transition:transform_300ms_var(--ease-settle),visibility_0s_300ms]',
                  'motion-reduce:transition-none',
                )}
              >
                <div className="border-line flex items-center justify-between border-b px-5 py-4">
                  <span className="eyebrow text-muted">Menu</span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Menu sluiten"
                    className="border-line-strong text-heading hover:border-navy-600 hover:text-brand ease-settle grid size-11 place-items-center rounded-md border transition-colors duration-(--duration-micro)"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <nav aria-label="Hoofdmenu" className="px-5 py-2">
                  <ul className="divide-line divide-y">
                    {mainNav.map((item) => {
                      const isCurrent = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={cn(
                              'ease-settle flex min-h-[3.25rem] items-center text-lg font-medium transition-colors duration-(--duration-micro)',
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

                <div className="flex flex-col gap-3 px-5 pt-3 pb-6">
                  <Button href="/reservering/" size="lg">
                    Reserveer nu
                  </Button>
                  {/* The portal, reachable on a phone. It carries the 10%
                      account discount and is the only way to change a booking
                      without calling — and before this pass nothing on the site
                      linked to it at any width. */}
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
