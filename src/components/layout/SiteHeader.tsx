import { LogIn, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { siteConfig } from '@/config/site';

/**
 * Header: solid from the first paint with proper contrast.
 *
 * The header now uses a solid light background (bg-surface/92) with
 * subtle border and backdrop-blur from the start. Dark navy text provides
 * excellent contrast against the light cream background.
 *
 * `border-transparent` is included rather than omitted, so the bar's height
 * does not change by a pixel when the border appears on scroll — that would
 * nudge everything below.
 *
 * On non-homepage routes the header was already solid; on homepage it now
 * starts solid instead of transparent, ensuring legible navigation text
 * from first paint.
 */
const barClasses = [
  'border-b border-line bg-surface/92 backdrop-blur-md',
  'transition-[background-color,border-color] duration-300 ease-settle',
].join(' ');

/**
 * Site header.
 *
 * A Server Component. Two client leaves: HeaderShell (currently read-only,
 * as scrolled state is no longer used for styling) and MobileNav (open state).
 *
 * The phone number comes from config/site.ts. On the site this replaces, every
 * subpage header linked to `tel:123456789` — a placeholder that was never filled
 * in, so tapping the number on a phone called nothing.
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      {/* One sentence is far narrower than the four labels it replaces, so it is
          repeated to keep a pass wider than the screen, and the duration is
          raised with it — otherwise the same seconds over a longer pass would
          scroll roughly three times faster. */}
      {/* Disabled, not deleted. To restore, add back:
            import { Marquee } from '@/components/layout/Marquee';
            const MARQUEE_LABELS = ['Start uw reis comfortabel, veilig en met een gerust gevoel.'] as const;
          and uncomment the line below. The import and the constant were removed
          because an unused import is an eslint error, and a failing `npm run
          verify` teaches everyone to stop reading its output. */}
      {/* <Marquee items={MARQUEE_LABELS} repeat={3} duration={96} /> */}

      <div className={barClasses}>
        <Container>
          <div className="ease-settle flex h-20 items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled=true]/header:h-[4.5rem]">
            <Logo tone="solid" />

            <div className="flex items-center gap-2">
              <DesktopNav />

              <div className="ml-2 hidden items-center gap-2 md:flex">
                <Button
                  href={siteConfig.phone.href}
                  variant="link"
                  className="text-brand decoration-navy-300 hover:decoration-navy-500 px-3 text-sm"
                >
                  <Phone className="size-4" aria-hidden />
                  <span className="sr-only">Bel ons: </span>
                  {siteConfig.phone.display}
                </Button>

                {/* ---------- Inloggen ----------
                    The portal is where a returning customer changes a booking
                    without phoning, and where the 10% account discount lives.
                    Nothing on the site linked to it, so nobody used either.

                    Set at secondary weight on purpose: no underline, no fill,
                    and it sits BEFORE the booking button rather than beside it.
                    A returning customer scans the top-right corner for a way in
                    and will find it; a new visitor's eye still lands on
                    "Reserveer nu", which is the only thing here that should
                    look like a button. */}
                <Button
                  href="/login/"
                  variant="link"
                  className="text-brand hover:text-navy-700 px-3 text-sm no-underline"
                >
                  <LogIn className="size-4" aria-hidden />
                  Inloggen
                </Button>

                <Button href="/reservering/" size="sm">
                  Reserveer nu
                </Button>
              </div>

              <MobileNav />
            </div>
          </div>
        </Container>
      </div>
    </HeaderShell>
  );
}
