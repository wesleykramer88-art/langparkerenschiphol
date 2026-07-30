import type { Metadata } from 'next';
import { ArrowRight, Check, Mail, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Ticket, TicketTear } from '@/components/ui/Ticket';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { siteConfig } from '@/config/site';

/**
 * The thank-you page, reached when ParkingPro posts `reservationAdded`.
 *
 * ── Deliberately not indexed ────────────────────────────────────────────────
 * It is reachable only after a completed booking and says nothing to anyone
 * else. Indexed, it would compete with /reservering/ for booking queries and
 * land people on a confirmation for a reservation they never made — which is
 * the same duplicate-page problem the /old-* redirects exist to clean up.
 *
 * ── Why so little data is shown ─────────────────────────────────────────────
 * The postMessage payload carries the customer's name, e-mail address and
 * number plate. None of it travels here. Query strings are written to browser
 * history, to server access logs, and into the Referer header of every request
 * the page then makes — including analytics — so personal data in a URL is
 * published in three places nobody thinks to check.
 *
 * Only a reservation reference is passed, and only when ParkingPro supplies
 * one. Everything else the customer needs is in the confirmation e-mail their
 * system sends, which is the correct channel for it.
 */
export const metadata: Metadata = {
  title: 'Reservering bevestigd - Lang Parkeren Schiphol',
  description: 'Uw parkeerreservering bij Lang Parkeren Schiphol is bevestigd.',
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    title: 'U ontvangt een bevestiging per e-mail',
    body: 'Daarin staan uw reserveringsnummer, de gekozen service en het adres waar u wordt verwacht. Komt er niets binnen, kijk dan even in uw spamfolder.',
  },
  {
    title: 'Zet de aankomsttijd in uw agenda',
    body: 'Bij shuttle parkeren adviseren wij om minimaal 3 uur voor vertrek aanwezig te zijn, bij valet parkeren minimaal 2,5 uur.',
  },
  {
    title: 'Bel ons direct na de landing',
    body: 'Wij volgen uw vlucht, maar één telefoontje bij terugkomst zorgt ervoor dat uw auto klaarstaat op het moment dat u bij de vertrekhal bent.',
  },
] as const;

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.ref;
  // Defensive: this value comes from a third party's postMessage payload and is
  // rendered on the page. Length-capped and restricted to the characters a
  // reference can plausibly contain.
  const reference = typeof raw === 'string' && /^[A-Za-z0-9-]{1,32}$/.test(raw) ? raw : null;

  return (
    <Section spacing="lg">
      <Container width="narrow">
        <Breadcrumbs
          tone="onLight"
          crumbs={[
            { name: 'Reserveren', path: '/reservering/' },
            { name: 'Bevestiging', path: '/reservering/bevestiging/' },
          ]}
        />

        <div className="mt-10 flex flex-col items-start">
          <span className="bg-accent-wash text-accent-hover grid size-14 place-items-center rounded-full">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </span>

          <Eyebrow className="mt-7">Bevestigd</Eyebrow>
          <h1 className="text-display-lg mt-4">Uw parkeerplaats is gereserveerd</h1>
          <p className="text-lead text-muted mt-6">
            Dank u wel. Uw reservering staat klaar en u ontvangt de bevestiging per e-mail.
          </p>
        </div>

        {reference ? (
          <Ticket notch="canvas" className="mt-10">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <p className="eyebrow text-muted">Reservering</p>
              <p className="numeric text-muted text-xs">Lang Parkeren Schiphol</p>
            </div>
            <TicketTear size="sm" />
            <div className="px-6 pt-5 pb-6">
              <p className="eyebrow text-muted">Uw reserveringsnummer</p>
              <p className="numeric text-heading mt-2 text-2xl font-semibold">{reference}</p>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                Houd dit nummer bij de hand als u contact met ons opneemt over deze reservering.
              </p>
            </div>
          </Ticket>
        ) : null}

        <ol className="divide-line border-line mt-12 divide-y border-y">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-5 py-6">
              <p aria-hidden className="ghost-numeral text-numeral text-2xl">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div>
                <h2 className="text-heading text-base font-semibold">{step.title}</h2>
                <p className="text-muted mt-2 text-sm leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="/login/">
            Bekijk uw reservering in het portaal
            <ArrowRight data-arrow className="size-4" aria-hidden />
          </Button>
          <Button href={siteConfig.phone.href} variant="outline">
            <Phone className="size-4" aria-hidden />
            <span className="sr-only">Bel ons: </span>
            <span className="numeric">{siteConfig.phone.display}</span>
          </Button>
        </div>

        <p className="text-muted border-line mt-10 border-t pt-8 text-sm leading-relaxed">
          Iets aanpassen of een vraag over uw reservering? Mail{' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-brand decoration-navy-300 hover:decoration-navy-600 break-all underline underline-offset-4"
          >
            {siteConfig.email}
          </a>{' '}
          <Mail className="inline size-3.5 align-[-0.1em]" aria-hidden /> of bel ons. Wij reageren
          doorgaans binnen 1 uur.
        </p>
      </Container>
    </Section>
  );
}
