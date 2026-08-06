'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { promo } from '@/config/site';
import { cn } from '@/lib/cn';

/**
 * The seasonal discount code, in the hero.
 *
 * ── Why this is a strip and not the coupon from the mock-up ─────────────────
 * The brief came with a rotated, scissor-cut coupon with a handwritten arrow
 * pointing at it. Built literally it would sit two columns away from the
 * booking card — and that card IS this site's one signature device, a parking
 * ticket with punched notches and a perforation. A second dashed, torn,
 * ticket-shaped object beside it stops the first one being a signature and
 * starts it being a theme. See the note at the top of ui/Ticket.tsx.
 *
 * So the ticket vocabulary is quoted rather than repeated: one dashed rule, at
 * a smaller scale, no notches, no rotation, no handwriting. It still reads
 * unmistakably as a coupon while leaving the card opposite it the loudest thing
 * on the screen — which matters, because that card is what takes the booking.
 *
 * ── The code is a button ────────────────────────────────────────────────────
 * The visitor has to retype this into a field inside ParkingPro's iframe, on a
 * phone, from memory of something they read a screen ago. One tap to copy
 * removes the only step in the offer where it can be got wrong.
 */
export function PromoCoupon({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
    } catch {
      // Clipboard refused — insecure context, or permission denied. The code is
      // on screen and selectable, so this costs a convenience, not the offer.
      // Deliberately silent: an error toast about a copy button is worse than
      // the visitor simply typing seven characters.
    }
  }

  return (
    <div
      className={cn(
        'border-valet-400/45 bg-valet-400/[0.07] inline-flex flex-col gap-3 rounded-xl border border-dashed px-4 py-3.5',
        'sm:flex-row sm:items-center sm:gap-4 sm:px-5',
        className,
      )}
    >
      {/* Navy on valet-600 measures 5.0:1 and passes AA. White on the same
          orange is 3.4:1 and does not — see AccountDiscountBar. */}
      <span
        aria-hidden
        className="bg-accent text-on-accent numeric inline-flex w-fit shrink-0 items-center rounded-md px-2.5 py-1 text-sm font-bold"
      >
        {promo.percentage}%
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-heading-inverse text-sm font-semibold">korting met kortingscode</span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Kortingscode ${promo.code} kopiëren`}
          className={cn(
            'border-valet-400/60 text-heading-inverse numeric group inline-flex items-center gap-2 rounded-md border border-dashed px-2.5 py-1 text-sm font-bold tracking-wider',
            'ease-settle transition-[background-color,border-color] duration-(--duration-micro)',
            'hover:border-valet-400 hover:bg-valet-400/15',
            'focus-visible:ring-valet-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none',
          )}
        >
          {promo.code}
          {copied ? (
            <Check className="text-valet-400 size-3.5" strokeWidth={3} aria-hidden />
          ) : (
            <Copy className="text-navy-300 group-hover:text-valet-400 size-3.5" aria-hidden />
          )}
        </button>

        {/* Announced rather than shown-only, so the confirmation reaches a
            screen reader that cannot see the tick swap in. */}
        <span aria-live="polite" className="sr-only">
          {copied ? 'Kortingscode gekopieerd' : ''}
        </span>
      </div>

      <p className="text-navy-300 text-xs sm:ml-auto">Geldig {promo.validUntil}</p>
    </div>
  );
}
