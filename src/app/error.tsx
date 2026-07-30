'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { siteConfig } from '@/config/site';

/**
 * Route-level error boundary. Must be a Client Component — React needs to attach
 * it as a boundary and `reset` re-renders the segment.
 *
 * The copy explains what happened and gives two ways forward: retry, or reach a
 * person. It does not apologise and it does not speculate about the cause. The
 * phone number is here on purpose — if the page a visitor needs to book with is
 * broken, the phone is the working path to the same outcome.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side digest only; the message itself may contain internals and is
    // never shown to the visitor.
    console.error('Route error:', error.digest ?? error.message);
  }, [error]);

  return (
    <Section spacing="lg">
      <Container width="narrow">
        <div className="flex flex-col items-start gap-8">
          <Eyebrow rule>Er ging iets mis</Eyebrow>

          <div className="flex flex-col gap-4">
            <h1 className="text-display-lg">Deze pagina kon niet worden geladen.</h1>
            <p className="text-lead text-muted">
              Probeer het opnieuw. Lukt het dan nog niet, bel ons dan even — wij regelen uw
              reservering telefonisch net zo snel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={reset}>
              Opnieuw proberen
            </Button>
            <Button href={siteConfig.phone.href} variant="outline" size="lg">
              Bel {siteConfig.phone.display}
            </Button>
          </div>

          {error.digest ? (
            <p className="numeric text-muted text-xs">Referentie: {error.digest}</p>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
