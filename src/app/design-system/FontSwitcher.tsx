'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { FONT_CANDIDATES, candidateVariables } from './candidates';
import { Ticket, TicketTear, TicketStub } from '@/components/ui/Ticket';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * Live typeface comparison.
 *
 * The client has rejected three faces from static screenshots. Screenshots are a
 * bad instrument for this decision: they fix one size, one weight and one line
 * length, and they show the type in someone else's words. This renders his OWN
 * Dutch copy — the real H1, the real lead, a real price row — and lets him
 * switch faces under it in place, so he is comparing the thing itself.
 *
 * Every candidate's @font-face is declared by the wrapper's variable classes;
 * switching only changes which custom property the specimen reads from, so there
 * is no reflow from loading and no flash of fallback type between options.
 */
export function FontSwitcher() {
  const [active, setActive] = useState(FONT_CANDIDATES[0]);

  return (
    <div className={candidateVariables}>
      {/* -- Switcher ------------------------------------------------------ */}
      <div
        role="radiogroup"
        aria-label="Kies een lettertype"
        className="border-line bg-surface/92 sticky top-[7.5rem] z-10 -mx-2 mb-10 flex flex-wrap gap-2 rounded-2xl border p-2 backdrop-blur-md"
      >
        {FONT_CANDIDATES.map((font) => {
          const isActive = font.id === active.id;
          return (
            <button
              key={font.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActive(font)}
              style={{ fontFamily: `var(${font.cssVar})` }}
              className={cn(
                'ease-settle min-h-11 flex-1 rounded-xl px-4 py-2.5 text-left transition-colors duration-(--duration-micro)',
                isActive
                  ? 'bg-surface-inverse text-heading-inverse'
                  : 'text-body hover:bg-surface-sunken',
              )}
            >
              <span className="block text-base font-semibold">{font.name}</span>
              <span
                className={cn(
                  'numeric block text-[0.6875rem]',
                  isActive ? 'text-navy-300' : 'text-muted',
                )}
              >
                {font.axis}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-muted mb-10 max-w-[62ch] text-sm">{active.note}</p>

      {/* -- Specimen ------------------------------------------------------
          Everything below is set in the selected face. The copy is verbatim from
          the live site so the comparison is in the client's own words. */}
      <div style={{ fontFamily: `var(${active.cssVar})` }} className="flex flex-col gap-14">
        {/* Hero, as it will actually appear */}
        <section>
          <p className="eyebrow text-brand mb-4">De echte hero</p>
          <div className="border-line bg-surface rounded-2xl border p-7 sm:p-10">
            <p className="eyebrow text-muted mb-5">
              <span className="numeric">4,7</span>/5 · Duizenden reizigers elk jaar
            </p>
            <h2 className="text-display-xl">Zorgeloos lang parkeren op Schiphol.</h2>
            <p className="text-lead text-muted mt-5 max-w-[52ch]">
              Binnen 2 minuten geregeld. Kies voor valet of shuttle parkeren — veilig, snel en
              professioneel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">Hoe werkt het?</Button>
              <Button variant="outline" size="lg">
                Bekijk tarieven
              </Button>
            </div>
          </div>
        </section>

        {/* Small sizes — where a typeface usually fails */}
        <section>
          <p className="eyebrow text-brand mb-4">Kleine formaten</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-2xl border p-6">
              <h3 className="text-display-sm">Super snel en probleemloos</h3>
              <p className="text-body mt-3 text-sm leading-relaxed">
                U rijdt naar de vertrekhal, wij nemen uw auto over en parkeren hem op een afgesloten
                terrein met 24/7 camerabewaking. Tot 24 uur van tevoren gratis annuleren.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge tone="accent">Snelste optie</Badge>
                <Badge tone="outline">Meest gekozen</Badge>
              </div>
            </div>
            <div className="border-line bg-surface rounded-2xl border p-6">
              <h3 className="text-display-sm">Formuliervelden</h3>
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <span className="text-heading block text-sm font-medium">
                    Aankomstdatum en tijd <span className="text-accent-hover">*</span>
                  </span>
                  <span className="border-line-strong text-ink-400 mt-1 block rounded-lg border px-3.5 py-3 text-base">
                    dd-mm-jjjj, --:--
                  </span>
                </div>
                <p className="text-muted text-xs">
                  Wij zijn 24/7 bereikbaar, ook bij een vertraagde vlucht.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The price row — the real test of the mono pairing */}
        <section>
          <p className="eyebrow text-brand mb-4">Prijsregel · mono met tabulaire cijfers</p>
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="border-line bg-surface overflow-hidden rounded-2xl border">
              <table className="w-full text-left">
                <caption className="sr-only">Voorbeeldtarieven</caption>
                <thead>
                  <tr className="border-line border-b">
                    <th scope="col" className="eyebrow text-muted px-6 py-4">
                      Aanvullende service
                    </th>
                    <th scope="col" className="eyebrow text-muted px-6 py-4 text-right">
                      Prijs
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-line divide-y">
                  {[
                    ['Keep keys', '€ 15,00'],
                    ['Opladen (elektrisch)', '€ 35,00'],
                    ['Boekingskosten', '€ 2,50'],
                    ['Shuttleservice', 'Inbegrepen'],
                  ].map(([label, price]) => (
                    <tr key={label}>
                      <td className="text-body px-6 py-4">{label}</td>
                      <td className="numeric text-heading px-6 py-4 text-right font-medium">
                        {price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* The ticket, in the selected face */}
            <Ticket notch="canvas">
              <div className="px-6 pt-6 pb-2">
                <p className="eyebrow text-muted">Parkeerperiode</p>
                <p className="numeric text-heading mt-2 text-lg font-medium">14 aug — 28 aug</p>
                <p className="numeric text-muted mt-1 text-sm">14 nachten · valet</p>
              </div>
              <TicketTear />
              <TicketStub label="Reserveringsnr." value="LPS-4718-AMS" meta="24/7" />
            </Ticket>
          </div>
        </section>

        {/* Full scale */}
        <section>
          <p className="eyebrow text-brand mb-4">Typografische schaal</p>
          <div className="border-line bg-surface flex flex-col gap-6 rounded-2xl border p-7">
            {(
              [
                ['display-xl', 'text-display-xl', 'Zorgeloos lang parkeren'],
                ['display-lg', 'text-display-lg', 'Parkeren bij Schiphol — op uw manier'],
                ['display-md', 'text-display-md', 'Uw auto is veilig terwijl u reist'],
                ['display-sm', 'text-display-sm', 'Al meer dan 15 jaar de vertrouwde keuze'],
                ['lead', 'text-lead text-muted', 'Binnen 2 minuten geregeld.'],
                ['base', 'text-base text-body', 'Tot 24 uur van tevoren gratis annuleren.'],
                ['sm', 'text-sm text-body', 'Directe bevestiging per e-mail.'],
              ] as const
            ).map(([name, className, sample]) => (
              <div
                key={name}
                className="border-line flex flex-col gap-1 border-b pb-5 last:border-0 last:pb-0"
              >
                <span className="numeric text-muted text-[0.6875rem]">{name}</span>
                <span className={className}>{sample}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* -- How to apply the choice -------------------------------------- */}
      <div className="border-valet-200 bg-accent-wash mt-14 rounded-2xl border p-7">
        <p className="eyebrow text-valet-800">Zo zetten wij de keuze door</p>
        <p className="text-body mt-3">
          Kies een lettertype hierboven. Wij wijzigen dan één regel in{' '}
          <code className="numeric bg-surface rounded px-1.5 py-0.5 text-sm">src/lib/fonts.ts</code>{' '}
          en de hele site volgt — koppen, formulieren, prijzen en alles daartussen.
        </p>
        {/* `id` matches the .woff2 filename stem exactly, so this is the literal
            text to paste — no translation step for whoever applies it. */}
        <p className="numeric bg-surface text-heading mt-4 rounded-lg px-4 py-3 text-sm">
          src: &apos;../fonts/{active.id}-latin-wght-normal.woff2&apos;, weight: &apos;
          {active.axis}&apos;
        </p>
      </div>
    </div>
  );
}
