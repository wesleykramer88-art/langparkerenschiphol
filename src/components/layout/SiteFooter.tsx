import Link from 'next/link';
import {
  CreditCard,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/layout/Logo';
import {
  footerNav,
  independenceDisclaimer,
  paymentMethods,
  siteConfig,
  termsUrl,
  accountDiscount,
  type PaymentMethod,
} from '@/config/site';

/**
 * Payment methods — the mark beside each name.
 *
 * ── These are NOT the schemes' logos, and that is not an oversight ──────────
 * The client asked for icons. The obvious reading is the real brand marks — the
 * iDEAL lozenge, the Apple Pay glyph, the Klarna wordmark — and those we cannot
 * ship. Every one is a registered trademark whose use is governed by that
 * scheme's brand guidelines, we do not hold the licensed asset files, and a
 * redrawn or recoloured mark is a trademark problem rather than a near miss.
 * Apple in particular publishes rules on the Apple Pay mark that a hand-drawn
 * copy breaks immediately.
 *
 * So each method gets a mark for its KIND instead: what the visitor will
 * actually be doing. That is honest, it needs no licence, and it carries
 * information the logos do not — four of these nine are bank buttons, and a row
 * of nine unfamiliar wordmarks does not tell a Dutch customer that.
 *
 *   Landmark   → you are sent to your own bank to approve it
 *   Smartphone → you confirm on your phone or watch
 *   Wallet     → you sign in to an account that holds your money
 *   CreditCard → you type a card number
 *
 * Repetition across the column is deliberate: the four bank buttons SHOULD look
 * like each other.
 *
 * TODO(client): if you want the real marks, they come in your PSP's brand kit
 * as licensed SVGs — send that folder and this becomes a straight swap. Please
 * send the kit rather than files pulled off a search, which is where the
 * licence problem starts.
 */
const PAYMENT_ICONS: Record<PaymentMethod, LucideIcon> = {
  iDEAL: Landmark,
  Creditcard: CreditCard,
  'Apple Pay': Smartphone,
  'Google Pay': Smartphone,
  PayPal: Wallet,
  Klarna: Wallet,
  Bancontact: Landmark,
  'KBC/CBC-betaalknop': Landmark,
  'Belfius-betaalknop': Landmark,
};

export function SiteFooter() {
  // Evaluated at build time. The site is statically rendered, so a rebuild is
  // what rolls this over — Vercel redeploys handle it in practice.
  const year = new Date().getFullYear();

  return (
    // The id is watched by StickyBookingBar, which stands down when the footer
    // arrives rather than sitting on top of its links.
    <footer id="site-footer" className="bg-surface-inverse text-body-inverse">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-24">
          <div className="max-w-sm">
            <Logo tone="dark" />
            <p className="text-navy-200 mt-6 text-sm leading-relaxed">
              De betrouwbare keuze voor valet en shuttle parkeren op Amsterdam Airport Schiphol.
            </p>

            {/* Where the unsourced "4,7 / 5" and its five stars used to sit.
                What replaces it is the account offer — the strongest thing this
                business already has written down and the only reason a returning
                visitor has to scroll this far. See config/site.ts for why the
                score went. */}
            <div className="border-line-inverse mt-8 border-t pt-8">
              <p className="text-heading-inverse text-sm font-semibold">
                {accountDiscount.percentage}% korting met een gratis account
              </p>
              <p className="text-navy-300 mt-2 max-w-[34ch] text-xs leading-relaxed">
                Reserveer sneller met opgeslagen gegevens en beheer al uw boekingen op één plek.
              </p>
              <Link
                href="/login/"
                className="text-heading-inverse decoration-navy-500 hover:decoration-valet-400 ease-settle mt-1 inline-flex min-h-11 items-center text-xs underline underline-offset-4 transition-colors duration-(--duration-micro)"
              >
                Naar het klantenportaal
              </Link>
            </div>
          </div>

          <FooterColumn title="Diensten">
            {footerNav.diensten.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Bedrijf">
            {footerNav.bedrijf.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
            {footerNav.account.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a href={siteConfig.phone.href} className={footerLinkClasses}>
                <Phone className="text-navy-400 size-4 shrink-0" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                <span className="numeric">{siteConfig.phone.display}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className={cn(footerLinkClasses, 'break-all')}>
                <Mail className="text-navy-400 size-4 shrink-0" aria-hidden />
                {siteConfig.email}
              </a>
            </li>
            {/* The BUSINESS address — the terrain and the office. This is the
                one that carries the LocalBusiness markup and makes the listing
                eligible for the local pack.

                The valet handover point is a different address and is
                deliberately not here: in a footer, two addresses with no room
                to explain them reads as an error. It is stated on /contact/ and
                on the valet service, where there is space to say which is
                which. See config/site.ts. */}
            <li className="text-navy-200 flex items-start gap-2.5 text-sm">
              <MapPin className="text-navy-400 mt-0.5 size-4 shrink-0" aria-hidden />
              <address className="not-italic">
                {siteConfig.address.street}
                <br />
                <span className="numeric">{siteConfig.address.postalCode}</span>{' '}
                {siteConfig.address.locality}
              </address>
            </li>
          </FooterColumn>
        </div>

        <div className="border-line-inverse border-t py-8">
          <p className="eyebrow text-navy-400">Betaalmethoden</p>
          {/* Nine chips rather than four, so they wrap to two rows on a laptop
              and several on a phone. `items-center` on the chip and `shrink-0`
              on the mark keep a wrapped row's baselines together. */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => {
              const Mark = PAYMENT_ICONS[method];
              return (
                <li
                  key={method}
                  className="border-line-inverse text-navy-200 flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium"
                >
                  {/* aria-hidden: the mark says "bank button", the text says
                      which bank button. Announcing both would read every row
                      twice, and the icon is the less precise of the two. */}
                  <Mark className="text-navy-400 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  {method}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-line-inverse flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-navy-400 text-xs">
            &copy; {year} {siteConfig.name}.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <li>
              {/* On this domain now, so it is a Link rather than an <a> opening a
                  new tab: a same-site page has no reason to leave the site, and
                  the terms are the one page a hesitant visitor opens mid-booking
                  and then wants the back button from. */}
              <Link
                href={termsUrl}
                className="text-navy-300 decoration-navy-600 hover:text-heading-inverse ease-settle inline-flex min-h-11 items-center underline underline-offset-4 transition-colors duration-(--duration-micro)"
              >
                Algemene voorwaarden
              </Link>
            </li>
            {/* Dutch distance-selling law requires the trader's identity and
                registration number to be discoverable. The site this replaces
                published neither. */}
            <li className="text-navy-400">{siteConfig.legal.entity}</li>
            <li className="numeric text-navy-400">KvK {siteConfig.legal.kvk}</li>
          </ul>
        </div>

        {/*
          Independence disclaimer.

          The design deliberately evokes airport infrastructure rather than
          parking vendor — terminal signage, departure-board figures, wayfinding
          type — because that is the client's brief and the value of his domain.
          This sentence is the counterweight that keeps the evocation on the
          right side of a trademark challenge, and it is standard among
          competitors ranking for the same term.

          Placed below the copyright, small, in navy-400 — the inverse-surface
          equivalent of the ink-500 the brief specifies, which is a light-surface
          token and would be unreadable here. It measures 5.2:1 on navy-950 and
          passes AA at this size; it is quiet, but a disclaimer that cannot be
          read is not a disclaimer.
        */}
        <p className="text-navy-400 max-w-[68ch] pt-5 pb-8 text-xs leading-relaxed">
          {independenceDisclaimer}
        </p>
      </Container>
    </footer>
  );
}

/**
 * The gap between items used to be `gap-3.5` with links only as tall as their
 * line box — 17px. On a phone that is a column of targets well under the 24px
 * WCAG 2.2 requires (SC 2.5.8) and nowhere near the 44px this project's brief
 * asks for, in the one part of the page where links are stacked closest
 * together.
 *
 * The gap is gone and each link now carries the height instead: `min-h-11` is
 * exactly 44px, so the targets touch without overlapping and the column takes
 * up no more room than it did.
 */
function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-navy-400">{title}</h2>
      <ul className="mt-3 flex flex-col">{children}</ul>
    </div>
  );
}

/** Shared by the nav columns and the contact column, so their touch targets
 *  cannot drift apart. */
const footerLinkClasses =
  'flex min-h-11 items-center gap-2.5 text-navy-200 hover:text-heading-inverse ease-settle text-sm transition-colors duration-(--duration-micro)';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className={footerLinkClasses}>
        {children}
      </Link>
    </li>
  );
}
