'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';
import { env } from '@/lib/env';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  setConsent,
  subscribeToConsent,
} from '@/lib/consent';

/**
 * Consent-gated analytics.
 *
 * No measurement script is requested until the visitor actively agrees. Under
 * GDPR/ePrivacy as enforced in the Netherlands, analytics cookies are not
 * "strictly necessary", so pre-ticked or implied consent is not lawful — and a
 * banner that loads the tag before you answer it is worse than no banner.
 *
 * If NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, nothing renders at all: no banner,
 * no script, no cookie. That is the correct default for preview deployments.
 */
export function Analytics() {
  const measurementId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // null during SSR and hydration, then the stored answer. The banner therefore
  // never appears in the static HTML and can never be the LCP element.
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  if (!measurementId) return null;

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <div
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-body"
          className="border-line bg-surface shadow-lifted fixed inset-x-0 bottom-0 z-50 border-t"
        >
          <Container>
            <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <div>
                <h2 id="consent-title" className="text-heading text-sm font-semibold">
                  Mogen wij meten hoe de site gebruikt wordt?
                </h2>
                <p id="consent-body" className="text-muted mt-1 max-w-[62ch] text-sm">
                  Wij gebruiken analytische cookies om de site te verbeteren. U kunt gewoon
                  reserveren als u weigert — er verandert niets aan de service.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Button variant="outline" size="sm" onClick={() => setConsent('denied')}>
                  Weigeren
                </Button>
                <Button size="sm" onClick={() => setConsent('granted')}>
                  Accepteren
                </Button>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
