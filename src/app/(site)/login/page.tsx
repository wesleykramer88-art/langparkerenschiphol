import { ArrowRight, Check } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { PortalFrame } from '@/components/booking/PortalFrame';
import { accountDiscount } from '@/config/site';

export const metadata = createMetadata('login');

const CRUMBS = [{ name: 'Klantenportaal', path: '/login/' }];

/**
 * /login/
 *
 * Every word of the body copy is carried over verbatim from the live page. It
 * is good copy — specific, benefit-led, and it names a real 10% discount — and
 * it has been sitting on a page with no inbound link from the navigation, the
 * booking flow or the rates page. Nobody reads it.
 *
 * That is fixed structurally rather than here: the discount now appears under
 * the rates calculator and above the booking widget (see AccountDiscountBar),
 * and this page is linked from the footer. This page's job is to convert the
 * visitor who followed one of those.
 *
 * The sign-in frame sits FIRST on desktop, beside the benefits rather than
 * under them. Two audiences arrive here — the returning customer who wants the
 * form and nothing else, and the new visitor being sold the account — and a
 * layout that makes the returning customer scroll past a sales pitch to find
 * the login box gets the priority backwards.
 *
 * The zakelijk block deliberately cross-links to /samenwerken/: business
 * accounts and the reisbureau partnership are adjacent propositions for
 * overlapping audiences, and on the live site neither page mentions the other.
 */

/** Verbatim from the live page. The order is the client's. */
const BENEFITS = [
  'Sneller reserveren dankzij automatisch ingevulde gegevens zoals naam, contactgegevens en kenteken',
  'Al uw reserveringen overzichtelijk op één plek terugvinden',
  'Facturen direct bekijken, downloaden en eenvoudig betalen',
  'Zelf uw reservering wijzigen zonder te hoeven bellen of e-mailen',
  `Exclusieve ${accountDiscount.percentage}% klantenkorting op iedere reservering`,
  'Sneller boeken bij toekomstige reizen vanaf Schiphol',
] as const;

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Klantenportaal"
        title="Klantenportaal Lang Parkeren Schiphol"
        lead="Wist u dat u met een persoonlijk account nog sneller en voordeliger kunt reserveren? Met uw eigen klantenportaal beheert u eenvoudig al uw reserveringen op één centrale plek én profiteert u van exclusieve voordelen."
        photo="crewTerminal"
        objectPosition="object-[center_25%]"
        crumbs={CRUMBS}
      />

      <Section spacing="lg" aria-labelledby="portaal-heading">
        <Container>
          <h2 id="portaal-heading" className="sr-only">
            Inloggen of een account aanmaken
          </h2>

          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
            {/* The form first on desktop — a returning customer should not have
                to read a sales pitch to find the box they came for. On mobile
                the source order puts it first too.

                NOT sticky. A sticky element taller than the viewport pins at
                its offset and stops moving, so everything below the fold stays
                below the fold — on a 1500px frame that put the sign-in button
                permanently out of reach on desktop. Sticky is for the short
                prose columns on /tarieven/ and /reservering/, not for a frame
                whose height is the vendor's to decide. */}
            <Reveal>
              <PortalFrame notch="canvas" />
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow rule>De voordelen van een account</Eyebrow>
                <h3 className="text-display-md mt-5 max-w-[18ch]">
                  Eenmalig aanmaken, daarna {accountDiscount.percentage}% korting op iedere
                  reservering
                </h3>
              </Reveal>

              <Stagger as="ul" className="divide-line border-line mt-9 divide-y border-y">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-4 py-4">
                    <Check
                      className="text-accent mt-1 size-4 shrink-0"
                      strokeWidth={3}
                      aria-hidden
                    />
                    <span className="text-sm sm:text-base">{benefit}</span>
                  </div>
                ))}
              </Stagger>

              {/* ---------- Zakelijk ----------
                  An accent-wash block: the one permitted use of that tone per
                  page, spent here because this is a genuinely different
                  proposition for a different reader, not a restatement. */}
              <Reveal
                delay={80}
                className="bg-accent-wash border-valet-200 mt-10 rounded-xl border p-6 sm:p-8"
              >
                <h3 className="text-display-sm text-heading">Zakelijk parkeren?</h3>
                <p className="text-body mt-4 max-w-[56ch] leading-relaxed">
                  Voor bedrijven, reisorganisaties en frequente reizigers bieden wij ook
                  bedrijfsaccounts aan. Hiermee kunt u meerdere voertuigen, bestuurders en
                  medewerkers beheren binnen één account. Zo reserveert u eenvoudig parkeerplaatsen
                  voor collega&#39;s of klanten en behoudt u altijd een duidelijk overzicht van alle
                  boekingen en facturen.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button href="/contact/" variant="outline">
                    Bedrijfsaccount aanvragen
                  </Button>
                  <Button href="/samenwerken/" variant="link">
                    Samenwerken als reisbureau
                    <ArrowRight data-arrow className="size-4" aria-hidden />
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <p className="text-muted mt-10 max-w-[56ch] leading-relaxed">
                  Maak vandaag nog een account aan en profiteer direct van extra gemak én korting
                  bij uw volgende parkeerreservering.
                </p>
              </Reveal>
            </div>
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
