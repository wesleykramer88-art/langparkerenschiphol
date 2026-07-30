import { Clock, Phone, ShieldCheck, Undo2, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { AccountDiscountBar } from '@/components/sections/AccountDiscountBar';
import { ParkingProFrame } from '@/components/booking/ParkingProFrame';
import { PARKINGPRO_DEFAULT_HEIGHTS, bookingUrl } from '@/lib/parkingpro';
import { parseSelectionParams, toParkingProParams } from '@/lib/booking';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('booking');

const CRUMBS = [{ name: 'Reserveren', path: '/reservering/' }];

/**
 * /reservering/
 *
 * The end of the funnel, and therefore the quietest page on the site. There is
 * no closing CTA, no testimonials band and no photographic close: somebody on
 * this page has already decided, and every extra section between them and the
 * frame is a chance to change their mind.
 *
 * ── THIS PAGE WAS EMBEDDING THE WRONG THING ────────────────────────────────
 * It showed the price table. The client spotted it: "I saw the reservation page
 * you see the price form instead of Booking page."
 *
 * The cause was a single recorded URL. Phase 1 captured one MyParkingPro
 * address, ending in /parkingrates, and assumed both this page and /tarieven/
 * used it. They do not. The WordPress site it replaces runs the official
 * ParkingPro Booking Widgets plugin, and every page uses a DIFFERENT shortcode
 * resolving to a different path:
 *
 *   /reservering/  [pp_booking_iframe]           → /reservations/add
 *   /tarieven/     [pp_parking_rates_iframe]     → /parkingrates
 *   /login/        [pp_account_login_iframe]     → /account/login
 *
 * Every one of those now comes from a named builder in src/lib/parkingpro.ts.
 * No page composes a MyParkingPro URL by hand, and no page contains a location
 * GUID — which is what made this class of mistake possible in the first place.
 *
 * ── The prefill ────────────────────────────────────────────────────────────
 * The official plugin prefills the frame from its own shortcode, and its docs
 * say plainly that embedding the iframe as HTML loses that. We have no plugin,
 * so the query string is built here: the hero picker routes to this page with
 * the visitor's choice, and it is translated into ParkingPro's date format
 * before being handed to bookingUrl().
 *
 * Without it the visitor enters their dates twice and the hero card is
 * decoration.
 *
 * ── Note on the redirect ────────────────────────────────────────────────────
 * /reserveren/ — a second, older booking page titled "Old RESERVEREN" — is still
 * live and indexed, competing with this URL for the same queries. next.config.ts
 * now 308s it here. That redirect matters more to this page's ranking than
 * anything on it.
 */

const REASSURANCES: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Clock,
    title: 'Binnen 2 minuten geregeld',
    body: 'Kies uw data, kies valet of shuttle, reken af. U ontvangt de bevestiging direct per e-mail.',
  },
  {
    icon: Undo2,
    title: 'Gratis annuleren met annuleringsdekking',
    body: 'Met een annuleringsdekking annuleert u tot 24 uur voor aanvang geheel kosteloos.',
  },
  {
    icon: ShieldCheck,
    title: 'Betaling via een beveiligde omgeving',
    body: 'Betalen gaat via iDEAL, creditcard of Bancontact in de beveiligde omgeving van ons reserveringssysteem.',
  },
  {
    icon: Phone,
    title: 'Vertraging of vervroegde landing?',
    body: 'Wij volgen uw vlucht en passen de ophaaltijd aan. Bel ons direct na de landing op Schiphol.',
  },
];

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Read on the server, so the visitor's dates are already in the iframe's src
  // on first paint. Doing it in the browser would mean rendering the frame
  // once empty and then swapping its src, which reloads the vendor's whole
  // application and is visible as a flash.
  const selection = parseSelectionParams(await searchParams);
  const src = bookingUrl(toParkingProParams(selection));

  return (
    <>
      <PageHero
        eyebrow="Reserveren"
        title="Boek uw parkeerplaats"
        lead="Wilt u lang parkeren op Schiphol? Maak direct uw reservering en zorg voor een ontspannen begin van de reis."
        photo="terminalDeparture"
        objectPosition="object-[center_50%]"
        crumbs={CRUMBS}
      />

      <Section spacing="lg" aria-labelledby="reserveren-heading">
        <Container>
          <h2 id="reserveren-heading" className="sr-only">
            Reserveer uw parkeerplaats
          </h2>

          <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            {/* ---------- The widget ---------- */}
            <Reveal>
              {/* The account offer, immediately above the frame. Ten per cent
                  is a larger saving than anything else on this page and the
                  visitor is about to pay; if it is going to be mentioned at
                  all, it has to be mentioned before the total, not after. */}
              <AccountDiscountBar variant="inline" className="mb-6" />

              <ParkingProFrame
                src={src}
                title="Reserveringssysteem van Lang Parkeren Schiphol"
                label="Reserveren"
                notch="canvas"
                // The plugin's own default for [pp_booking_iframe]. The height
                // held until the frame reports its own, and the floor it can
                // never drop below afterwards — see ParkingProFrame.
                initialHeight={PARKINGPRO_DEFAULT_HEIGHTS.booking}
                onCompleteHref="/reservering/bevestiging/"
              />
            </Reveal>

            {/* ---------- The four hesitations ---------- */}
            <Reveal delay={80} className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Goed om te weten</Eyebrow>
              <ul className="divide-line border-line mt-6 divide-y border-y">
                {REASSURANCES.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 py-5">
                    <item.icon
                      className="text-accent mt-0.5 size-5 shrink-0"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-heading text-sm font-semibold">{item.title}</h3>
                      <p className="text-muted mt-1.5 max-w-[36ch] text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-line mt-8 border-t pt-8">
                <p className="text-heading text-sm font-semibold">Liever telefonisch reserveren?</p>
                <a
                  href={siteConfig.phone.href}
                  className="text-heading hover:text-brand ease-settle mt-1 inline-flex min-h-11 items-center gap-3 text-sm font-medium transition-colors duration-(--duration-micro)"
                >
                  <Phone className="text-accent size-4 shrink-0" aria-hidden />
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
