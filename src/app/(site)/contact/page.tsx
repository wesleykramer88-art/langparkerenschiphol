import { Car, Mail, MapPin, Phone } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, contactPageSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { RouteButton } from '@/components/ui/RouteButton';
import { Reveal } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('contact');

const CRUMBS = [{ name: 'Contact', path: '/contact/' }];

/**
 * /contact/
 *
 * ── Two locations, both labelled ───────────────────────────────────────────
 * Shuttle parks at Schipholweg 181 (Badhoevedorp, ibis hotel); valet hands
 * over at the Vertrekpassage in the terminal itself. Both are published here,
 * each labelled with what happens there, because a customer who drives to the
 * wrong one misses their flight. Neither is presented as a registered
 * business address.
 *
 * The phone question is closed: 020-303 3460 is the only number on the site, per
 * the client. The 0297 line and the secondary-number block that used to sit
 * under it are gone. See config/site.ts.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Persoonlijke service — voor, tijdens en na uw reis."
        lead="Een vraag over uw reservering, een wijziging of de aankomst? Ons team is bereikbaar voor, tijdens en na uw reis. Doorgaans reageren wij binnen 1 uur."
        photo="crewHandover"
        photoAlt="Lang Parkeren Schiphol contact bij de overdracht van een auto"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
      />

      <Section spacing="lg" aria-labelledby="contact-heading">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
            {/* ---------- NAP ----------
                Set as a definition list rather than as three cards: this is
                reference data a visitor scans for one line, and a card grid
                gives three equally-weighted boxes to read through first. */}
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Bereikbaarheid</Eyebrow>
              <h2 id="contact-heading" className="text-display-md mt-5 max-w-[14ch]">
                Direct contact
              </h2>
              <p className="text-muted mt-4 max-w-[42ch] text-sm leading-relaxed">
                Lang Parkeren Schiphol is een merk van The Parking Company. Hieronder ziet u waar u
                terechtkunt voor Shuttle parkeren en waar de Valet-overdracht plaatsvindt.
              </p>

              <dl className="divide-line border-line mt-9 divide-y border-y">
                <div className="flex items-start gap-4 py-5">
                  <Phone
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="eyebrow text-muted">Telefoon</dt>
                    <dd className="mt-2">
                      {/* min-h-11 on the primary number: on a phone this is the
                          single most-tapped element of the whole site, and at
                          its own line height it was a 23px target. */}
                      <a
                        href={siteConfig.phone.href}
                        className="numeric text-heading hover:text-brand ease-settle inline-flex min-h-11 items-center text-lg font-medium transition-colors duration-(--duration-micro)"
                      >
                        <span className="sr-only">Bel ons: </span>
                        {siteConfig.phone.display}
                      </a>
                      {/* There is no second number any more. This page used to
                          carry "Of 020-303 3460" underneath, from when the
                          site ran two lines and we had picked the wrong one as
                          canonical. The client has settled it: 020 is the only
                          number, and it is now the one above. */}
                      <p className="text-muted mt-1.5 text-sm">
                        Bereikbaar voor reserveringen, wijzigingen en vragen.
                      </p>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-5">
                  <Mail
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <dt className="eyebrow text-muted">E-mail</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-heading hover:text-brand ease-settle inline-flex min-h-11 items-center text-lg font-medium break-all transition-colors duration-(--duration-micro)"
                      >
                        {siteConfig.email}
                      </a>
                    </dd>
                  </div>
                </div>

                {/* ---------- Two locations, labelled ----------
                    Not a duplication bug. Shuttle customers drive to the
                    parking location at Schipholweg 181; valet customers drive to the
                    terminal kerb at Vertrekpassage. Somebody who goes to the
                    wrong one of these misses a flight, so both are stated with
                    what happens at each. See config/site.ts. */}
                <div className="flex items-start gap-4 py-5">
                  <MapPin
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="eyebrow text-muted">Shuttle parkeren — parkeerlocatie</dt>
                    <dd className="text-heading mt-2 text-lg font-medium">
                      <address className="not-italic">
                        {siteConfig.shuttleParking.name}
                        <br />
                        {siteConfig.shuttleParking.street}
                        <br />
                        <span className="numeric">{siteConfig.shuttleParking.postalCode}</span>{' '}
                        {siteConfig.shuttleParking.locality}
                        <br />
                        {siteConfig.shuttleParking.countryName}
                      </address>
                    </dd>
                    <p className="text-muted mt-2 max-w-[34ch] text-sm leading-relaxed">
                      Parkeerlocatie bij het ibis hotel. Hier parkeert u zelf; de shuttlebus rijdt u in
                      ongeveer 8 minuten naar de bushalte op Schiphol Plaza, en haalt u daar bij
                      terugkomst weer op.
                    </p>
                    <div className="mt-3">
                      <RouteButton />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-5">
                  <Car
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="eyebrow text-muted">Valet parkeren — overdracht</dt>
                    <dd className="text-heading mt-2 text-lg font-medium">
                      <address className="not-italic">
                        {siteConfig.valetHandover.street}
                        <br />
                        {siteConfig.valetHandover.detail}
                      </address>
                    </dd>
                    <p className="text-muted mt-2 max-w-[34ch] text-sm leading-relaxed">
                      Hier neemt onze chauffeur uw auto over, bij de vertrekhal van Schiphol zelf.
                    </p>
                  </div>
                </div>
              </dl>

              <div className="border-line mt-8 border-t pt-8">
                <p className="text-heading text-base font-semibold">
                  Al een reservering en iets te wijzigen?
                </p>
                <p className="text-muted mt-2 max-w-[38ch] text-sm leading-relaxed">
                  In het klantenportaal past u uw reservering zelf aan, zonder te bellen of te
                  mailen.
                </p>
                <Button href="/login/" variant="outline" className="mt-5">
                  Naar het klantenportaal
                </Button>
              </div>
            </Reveal>

            {/* ---------- The form ---------- */}
            <Reveal delay={80}>
              <h2 className="text-display-md">Stuur ons een bericht</h2>
              <p className="text-muted mt-4 max-w-[48ch] leading-relaxed">
                Vul het formulier in en wij reageren zo snel mogelijk. Gaat het over een bestaande
                reservering? Vermeld dan uw reserveringsnummer, dan kunnen wij direct meekijken.
              </p>

              <div className="mt-9">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(contactPageSchema()) }}
      />
    </>
  );
}
