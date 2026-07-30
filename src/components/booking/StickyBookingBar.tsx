'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

/**
 * The mobile booking bar.
 *
 * Slides up once the hero's booking card has scrolled away, and drops back out
 * of the way when the footer arrives — a permanently pinned bar would sit on top
 * of the footer's phone number and links, which are the other two things a
 * visitor on a phone reaches for.
 *
 * Deliberately price-free. We do not know the visitor's dates at this point, and
 * a "vanaf €x" that turns into something else at the vendor's widget is worse
 * than no number at all. It carries the one promise that is always true instead.
 *
 * Below `lg` only: on desktop the hero card and the header CTA are both still
 * within reach, so a pinned bar would be noise.
 *
 * `inert` rather than just a transform: an off-screen bar is still in the tab
 * order, and a keyboard user should not land on a control they cannot see.
 */
export function StickyBookingBar({
  /** Element that must leave the viewport before the bar appears. */
  watchId,
  /** Element whose arrival dismisses it again. */
  hideAfterId,
}: {
  watchId: string;
  hideAfterId: string;
}) {
  const [pastCard, setPastCard] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const card = document.getElementById(watchId);
    const footer = document.getElementById(hideAfterId);
    const observers: IntersectionObserver[] = [];

    if (card) {
      const observer = new IntersectionObserver(([entry]) => setPastCard(!entry.isIntersecting));
      observer.observe(card);
      observers.push(observer);
    }

    if (footer) {
      const observer = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
      observer.observe(footer);
      observers.push(observer);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, [watchId, hideAfterId]);

  const visible = pastCard && !atFooter;

  return (
    <div
      inert={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-line bg-surface/95 shadow-lifted border-t backdrop-blur-md',
        // The inset keeps the bar clear of the iOS home indicator.
        'pb-[env(safe-area-inset-bottom)]',
        'ease-settle transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <p className="text-muted flex min-w-0 items-center gap-2 text-xs leading-snug">
          <ShieldCheck className="text-accent size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Gratis annuleren met annuleringsdekking
        </p>
        <Button href="/reservering/" className="shrink-0">
          Reserveer nu
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
