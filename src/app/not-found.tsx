import type { Metadata } from 'next';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Ticket, TicketTear, TicketStub } from '@/components/ui/Ticket';
import { mainNav } from '@/config/site';

export const metadata: Metadata = {
  title: 'Pagina niet gevonden - Lang Parkeren Schiphol',
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Renders the site chrome itself because it sits outside the (site) route group
 * — Next resolves the root not-found for any unmatched URL, including ones that
 * never entered the group.
 *
 * The copy does one job: get the visitor back to a page that can take a booking.
 * No apology, no joke at the reader's expense — someone who mistyped a URL on
 * the way to parking their car wants a route out, not personality.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Section spacing="lg">
          <Container width="narrow">
            <div className="flex flex-col items-start gap-8">
              <Eyebrow rule>Foutcode 404</Eyebrow>

              <div className="flex flex-col gap-4">
                <h1 className="text-display-lg">Deze pagina konden wij niet vinden.</h1>
                <p className="text-lead text-muted">
                  De link klopt niet meer of is verkeerd overgenomen. Uw reservering is hier niet
                  door geraakt — u kunt gewoon verder.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/reservering/" size="lg">
                  Reserveer uw parkeerplaats
                </Button>
                <Button href="/" variant="outline" size="lg">
                  Naar de homepage
                </Button>
              </div>

              <nav aria-label="Overige pagina's" className="border-line w-full border-t pt-8">
                <p className="eyebrow text-muted">Of ga direct naar</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Button href={item.href} variant="link">
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </Container>
        </Section>

        <Section tone="surface" spacing="md">
          <Container width="narrow">
            <Ticket notch="surface" className="mx-auto max-w-sm">
              <div className="px-6 pt-6 pb-2">
                <p className="eyebrow text-muted">Status</p>
                <p className="text-display-sm mt-2">Geen geldig ticket</p>
              </div>
              <TicketTear />
              <TicketStub label="Foutcode" value="404" meta="AMS · SCHIPHOL" />
            </Ticket>
          </Container>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
