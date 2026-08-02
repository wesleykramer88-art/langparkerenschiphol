import { LogIn, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { Marquee } from '@/components/layout/Marquee';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { siteConfig } from '@/config/site';

/** Wording for the strip above the header. Client-approved. */
const MARQUEE_LABELS = ['Start uw reis comfortabel, veilig en met een gerust gevoel.'] as const;

/**
 * Transparent over a dark hero, solid once scrolled past it.
 *
 * `border-transparent` rather than no border, so the bar's height does not
 * change by a pixel as the border appears — that would nudge everything below.
 */
const barClasses = [
  'border-b border-transparent bg-transparent',
  'transition-[background-color,border-color] duration-300 ease-settle',
  'group-data-[scrolled=true]/header:border-line',
  'group-data-[scrolled=true]/header:bg-surface/92',
  'group-data-[scrolled=true]/header:backdrop-blur-md',
].join(' ');

/**
 * Site header.
 *
 * A Server Component. Three client leaves only: HeaderShell (scroll state),
 * DesktopNav (pathname, for aria-current) and MobileNav (open state). Everything
 * that restyles on scroll does it through the `group-data-[scrolled]` attribute
 * HeaderShell publishes, so no state is drilled through the tree.
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
      <Marquee items={MARQUEE_LABELS} repeat={3} duration={96} />

      <div className={barClasses}>
        <Container>
          <div className="ease-settle flex h-20 items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled=true]/header:h-[4.5rem]">
            <Logo tone="auto" />

            <div className="flex items-center gap-2">
              <DesktopNav />

              <div className="ml-2 hidden items-center gap-2 md:flex">
                <Button
                  href={siteConfig.phone.href}
                  variant="link"
                  className="text-navy-100 decoration-navy-500 hover:decoration-navy-200 group-data-[scrolled=true]/header:text-brand group-data-[scrolled=true]/header:decoration-navy-300 px-3 text-sm"
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
                  className="text-navy-100 group-data-[scrolled=true]/header:text-body group-data-[scrolled=true]/header:hover:text-brand px-3 text-sm no-underline hover:text-white"
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
