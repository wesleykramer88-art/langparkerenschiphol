import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { accountDiscount } from '@/config/site';

/**
 * The account discount, surfaced where money is being decided.
 *
 * ── Why this component exists ───────────────────────────────────────────────
 * "Exclusieve 10% klantenkorting op iedere reservering" is written on the live
 * site, in full, today. It is on /login/ — a page with no inbound link from the
 * main navigation, no link from the booking flow, and no link from the rates
 * page. It is the single strongest conversion lever the business already owns
 * and effectively nobody reads it.
 *
 * So it goes in the two places where a visitor is looking at a number and
 * deciding: directly under the rates calculator, and in the booking card. Ten
 * per cent off, for filling in a form once, at the exact moment somebody is
 * weighing the price — that is a better offer than anything we could invent.
 *
 * Deliberately a slim bar and not a card, a banner or a modal. It has to be
 * impossible to miss and equally impossible to mistake for an advertisement,
 * because a visitor who has just been shown a price and is then shouted at
 * assumes the price was inflated.
 */
export function AccountDiscountBar({
  /** `inline` sits inside an existing container; `band` brings its own. */
  variant = 'band',
  className,
}: {
  variant?: 'band' | 'inline';
  className?: string;
}) {
  const content = (
    <Link
      href="/login/"
      className={cn(
        'group border-valet-200 bg-accent-wash flex flex-col gap-3 rounded-xl border px-5 py-4',
        'ease-settle transition-[border-color,background-color] duration-(--duration-micro)',
        'hover:border-valet-300 sm:flex-row sm:items-center sm:gap-5 sm:px-6',
      )}
    >
      {/* The badge carries the figure. Navy on valet-600 measures 5.0:1 and
          passes AA — white on the same orange is 3.4:1 and does not. */}
      <span
        aria-hidden
        className="bg-accent text-on-accent numeric inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold"
      >
        <Percent className="size-3.5" strokeWidth={3} />
        {accountDiscount.percentage}
      </span>

      <span className="flex-1">
        <span className="text-heading block text-sm font-semibold sm:text-base">
          {accountDiscount.percentage}% korting met een gratis klantenaccount
        </span>
        <span className="text-muted mt-1 block text-sm leading-relaxed">
          Eenmalig aanmaken, daarna reserveert u sneller met opgeslagen gegevens — en betaalt u op
          iedere boeking {accountDiscount.percentage}% minder.
        </span>
      </span>

      <span className="text-brand ease-settle group-hover:text-navy-700 inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition-colors duration-(--duration-micro)">
        Account aanmaken
        <ArrowRight
          data-arrow
          className="ease-settle size-4 transition-transform duration-(--duration-micro) group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );

  /**
   * The returning customer's version of the same sentence.
   *
   * The bar above sells the account to somebody who has not got one. This line
   * is for the far more valuable visitor who already has one and is about to
   * book without signing in — paying full price for a discount they are
   * entitled to, and giving up the prefilled details that make the booking
   * faster. One line, directly under the offer, costing nothing.
   */
  const returning = (
    <p className="text-muted mt-3 text-sm">
      Al klant?{' '}
      <Link
        href="/login/"
        className="text-brand decoration-navy-300 hover:decoration-navy-600 underline underline-offset-4"
      >
        Log in
      </Link>{' '}
      en ontvang {accountDiscount.percentage}% korting op elke reservering.
    </p>
  );

  if (variant === 'inline') {
    return (
      <div className={className}>
        {content}
        {returning}
      </div>
    );
  }

  return (
    <div className={cn('bg-canvas', className)}>
      <Container className="py-8">
        {content}
        {returning}
      </Container>
    </div>
  );
}
