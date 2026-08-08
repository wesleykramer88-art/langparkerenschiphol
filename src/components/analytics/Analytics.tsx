'use client';

import { useSyncExternalStore } from 'react';
import { env } from '@/lib/env';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { updateGoogleConsent } from '@/lib/analytics';
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  setConsent,
  subscribeToConsent,
  type Consent,
} from '@/lib/consent';

/**
 * Google Tag Manager, under Consent Mode v2.
 *
 * ── What changed here, and why ──────────────────────────────────────────────
 * This component used to load gtag.js directly and only after the visitor
 * pressed Accept. That was the stricter reading of ePrivacy art. 5(3), and it
 * is defensible — but it has a cost the client is now paying: Google receives
 * nothing at all from the roughly half of visitors who decline, so it cannot
 * model their conversions, and Smart Bidding on a ROAS target is optimising
 * against a systematically incomplete picture of revenue.
 *
 * Advanced Consent Mode is the standard answer, and it is what runs now:
 *
 *   Undecided / declined  GTM loads. `ad_storage` and `analytics_storage` are
 *                         DENIED, so no cookie is written and no identifier is
 *                         set. Google receives cookieless pings it uses only in
 *                         aggregate to model the gap.
 *   Accepted              A `consent update` grants all four signals and normal
 *                         measurement begins.
 *
 * No cookie, no device identifier and no localStorage entry is created before
 * the visitor agrees, which is the obligation art. 5(3) actually imposes. The
 * cookieless ping is a network request, not storage on the visitor's device.
 *
 * ── The default is NOT set here ─────────────────────────────────────────────
 * It cannot be. The default consent state has to be on the dataLayer before
 * gtm.js executes, and anything this component renders is ordered after the
 * document head. The bootstrap is an inline script in the root layout — see
 * buildConsentBootstrap() in src/lib/analytics.ts. This component only handles
 * the visitor CHANGING their answer during the page view.
 *
 * If NEXT_PUBLIC_GTM_ID is unset, nothing renders: no container, no banner, no
 * request. That is the correct default for preview deployments.
 */
export function Analytics() {
  const containerId = env.NEXT_PUBLIC_GTM_ID;

  // null during SSR and hydration, then the stored answer. The banner therefore
  // never appears in the static HTML and can never be the LCP element.
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  if (!containerId) return null;

  /**
   * Order matters: Google is told first, then the store is written.
   *
   * setConsent notifies subscribers synchronously, which re-renders this
   * component and removes the banner. Doing that before the consent update is
   * pushed would leave a window — short, but real — in which the UI says the
   * visitor has accepted and Google still has them recorded as denied. Any tag
   * that fired in that window is the one measurement you actually wanted.
   */
  const decide = (value: Consent) => {
    updateGoogleConsent(value === 'granted');
    setConsent(value);
  };

  return (
    <>
      {/*
        The container is NOT loaded here any more — it is an inline script in
        <head>, next to the consent default. See buildGtmLoader() in
        src/lib/analytics.ts for why it had to move: `afterInteractive` never
        reaches the server-rendered HTML, so Google Ads reported a missing tag
        on a site that was measuring correctly.

        It still loads on every page view regardless of the visitor's answer —
        that is what makes this Advanced rather than Basic consent mode, and the
        whole reason conversion modelling works. Storage stays denied until
        `decide` says otherwise. This component now owns only the banner and the
        consent update.
      */}

      {/*
        No <noscript> iframe fallback.

        The standard GTM snippet ships one, and it is pure cost here: it would
        need googletagmanager.com added to frame-src, widening the CSP on a site
        whose only other framed origin is the booking system. What it buys is a
        pageview from visitors with JavaScript disabled — who cannot complete a
        booking in the first place, since the reservation flow is itself a
        script-driven iframe. There is no conversion behind it to measure.
      */}

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
                  Wij gebruiken analytische en advertentiecookies om de site te verbeteren en onze
                  advertenties te meten. U kunt gewoon reserveren als u weigert — er verandert niets
                  aan de service.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Button variant="outline" size="sm" onClick={() => decide('denied')}>
                  Weigeren
                </Button>
                <Button size="sm" onClick={() => decide('granted')}>
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
