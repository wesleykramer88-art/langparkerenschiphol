import {
  ArrowRight,
  BadgeEuro,
  Building2,
  Handshake,
  Phone,
  ShieldCheck,
  SquareUser,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { SectionTear } from '@/components/ui/Ticket';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('partners');

const CRUMBS = [{ name: 'Reisbureaus', path: '/samenwerken/' }];

/**
 * /samenwerken/
 *
 * ── This page was rebuilt rather than carried over ──────────────────────────
 * It is the only page on the site where the copy could not simply be moved
 * across, because a large part of it was never about this page. What was live:
 *
 *   · "Extra inkomsten, zonder extra werk" was followed by three bullets lifted
 *     straight from the services page — "Snel en zonder moeite wilt parkeren /
 *     Direct bij de vertrekhal wilt uitstappen / Maximale luxe en gemak zoekt".
 *     Those address a traveller. This page addresses a travel agent.
 *   · An entire "Kies Shuttle Parking als u:" block, also lifted, sat in the
 *     middle of the partner argument.
 *   · Five "waarom samenwerken" cards whose headings did not match their
 *     descriptions — "10+ jaar ervaring" described camera surveillance,
 *     "Professionele chauffeurs" described closed terrain — and the last two
 *     carried word-for-word identical text.
 *   · The closing block asked "Klaar om partner te worden? Neem vrijblijvend
 *     contact op" and then offered two buttons: "Reserveer nu" and "Hoe het
 *     werkt". Neither goes to contact. A B2B page whose only call to action
 *     sends the prospect into a consumer booking flow converts nobody.
 *
 * What is KEPT verbatim: the H1, the lead, and the two argument paragraphs
 * ("Extra inkomsten, zonder extra werk" and "Een slimme extra service voor uw
 * klanten"). Those are well written and they are this page's actual case.
 *
 * What is NEW: five reasons whose headings and descriptions describe the same
 * thing, every claim traceable to something the business already states
 * elsewhere; an agenda for the first conversation; and a closing block that
 * asks for the conversation it says it wants.
 *
 * What is deliberately ABSENT: any commission percentage, tier, payment term or
 * contract length. Nobody has told us what they are, and a number invented on a
 * B2B page is one a partner will quote back in a negotiation.
 * TODO(client): send the commission structure, the invoicing arrangement and
 * how partners should place bookings, and this page can state them outright —
 * which converts considerably better than "aantrekkelijke commissie".
 */

/** Five reasons. Each heading and its body describe the same thing — which was
 *  the entire problem with the five that were live. */
const REASONS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Building2,
    title: 'Gevestigde parkeerservice op Schiphol',
    body: 'Uw klanten komen terecht bij een gevestigde parkeerservice die dagelijks bij de vertrekhal rijdt — niet bij een tussenpersoon die het werk doorzet.',
  },
  {
    icon: ShieldCheck,
    title: 'Beveiligde, afgesloten locaties',
    body: 'Afgesloten en gecontroleerde parkeerterreinen met 24/7 camerabewaking, en de mogelijkheid tot overdekt parkeren.',
  },
  {
    icon: SquareUser,
    title: 'Gescreende chauffeurs',
    body: 'Onze chauffeurs zijn gescreend en ervaren. Iedere rit wordt digitaal geregistreerd, inclusief snelheid en route.',
  },
  {
    icon: Handshake,
    title: 'Twee services, één partner',
    body: 'Valet parking bij de vertrekhal voor wie haast heeft, shuttle parking voor wie voordeliger uit wil zijn. U maakt met ons één afspraak voor beide.',
  },
  {
    icon: Wallet,
    title: 'Wij doen de volledige afhandeling',
    body: 'Van reservering tot terugkomst van de auto. Uw klant boekt via u, wij nemen het daarna over — u heeft er geen omkijken naar.',
  },
];

/**
 * The agenda for a first conversation.
 *
 * This block exists instead of inventing partner terms. It is honest — these
 * genuinely are the four things that get agreed — and it does the prospect a
 * favour by telling them what the call will be about, which is more than a
 * "neem contact op" button does.
 */
const AGENDA = [
  {
    title: 'De commissie',
    body: 'Wat u per boeking overhoudt, en hoe dat wordt berekend voor valet en voor shuttle.',
  },
  {
    title: 'Hoe uw klanten boeken',
    body: 'Via een eigen link, telefonisch of per e-mail — wat het beste past bij hoe u nu werkt.',
  },
  {
    title: 'Facturatie',
    body: 'Per boeking of periodiek verzameld, en op welke termijn wij afrekenen.',
  },
  {
    title: 'Uw vaste contactpersoon',
    body: 'Eén naam en één nummer voor wijzigingen, vragen en spoedgevallen rond een reis.',
  },
] as const;

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Samenwerken?"
        title="Verdien eenvoudig extra aan iedere reis die u verkoopt."
        lead="Bij Lang Parkeren Schiphol bieden wij reisbureaus de mogelijkheid om hun service uit te breiden met een waardevolle en winstgevende toevoeging: betrouwbaar parkeren bij Schiphol. Uw klanten boeken bij u hun reis — wij zorgen ervoor dat hun reis ontspannen begint, vanaf het moment dat zij van huis vertrekken."
        photo="crewTerminal"
        objectPosition="object-[center_28%]"
        crumbs={CRUMBS}
      >
        <Button href="/contact/" size="lg">
          Neem vrijblijvend contact op
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href={siteConfig.phone.href} variant="outline" size="lg">
          <Phone className="size-4" aria-hidden />
          <span className="sr-only">Bel ons: </span>
          <span className="numeric">{siteConfig.phone.display}</span>
        </Button>
      </PageHero>

      {/* ---------- The two arguments ----------
          Both paragraphs verbatim. On the live page each was followed by a
          block of traveller-facing bullets that had been pasted in from
          /onze-services/; those are gone, and what is left is the argument
          itself, set at reading weight rather than boxed. */}
      <Section spacing="lg" aria-labelledby="propositie-heading">
        <Container>
          <Reveal className="max-w-[34ch]">
            <Eyebrow rule>De propositie</Eyebrow>
            <h2 id="propositie-heading" className="text-display-lg mt-5">
              Twee redenen om parkeren aan te bieden
            </h2>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <Reveal className="py-10 lg:pr-14">
              <BadgeEuro className="text-accent size-7" strokeWidth={1.5} aria-hidden />
              <h3 className="text-display-sm text-heading mt-6">
                Extra inkomsten, zonder extra werk
              </h3>
              <p className="text-muted mt-4 max-w-[46ch] leading-relaxed">
                Als partner profiteert u van een aantrekkelijke commissie op iedere boeking. Wij
                verzorgen de volledige afhandeling, van reservering tot uitvoering.
              </p>
            </Reveal>

            <Reveal delay={80} className="py-10 lg:pl-14">
              <Handshake className="text-accent size-7" strokeWidth={1.5} aria-hidden />
              <h3 className="text-display-sm text-heading mt-6">
                Een slimme extra service voor uw klanten
              </h3>
              <p className="text-muted mt-4 max-w-[46ch] leading-relaxed">
                Steeds meer reizigers zoeken naar gemak, zekerheid en comfort rondom hun reis. Door
                onze parkeeroplossingen aan te bieden, biedt u uw klanten een complete reiservaring
                — van valet parking bij de vertrekhal tot shuttle parking in een beveiligde
                parkeergarage. Wij regelen het volledig.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Five reasons ----------
          Rewritten. See the note at the top of this file for what was here. */}
      {/* Was a full-bleed photograph under scrim-band with glass panels over
          it. Lightened with the rest of the site — client, August 2026:
          "nergens donker". The photograph is not lost, it is contained and
          ungraded beside the copy, where the plates and the shuttle are
          actually legible; the glass went with the dark field, because glass
          over a flat colour is a tinted box pretending to be glass.

          Contrast on surface: navy-950 heading 16.90:1, ink-700 card titles
          9.58:1, ink-500 card body 5.48:1. */}
      <Section tone="surface" spacing="lg" aria-labelledby="waarom-partner-heading">
        <Container className="absolute inset-x-0 top-0 z-10">
          <SectionTear notch="canvas" />
        </Container>

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <Reveal className="max-w-[30ch]">
              <Eyebrow rule>Waarom wij</Eyebrow>
              <h2 id="waarom-partner-heading" className="text-display-lg mt-5">
                Waarom samenwerken met Lang Parkeren Schiphol?
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
                <Photo
                  name="lotShuttle"
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imageClassName="object-cover object-[center_35%]"
                />
              </div>
            </Reveal>
          </div>

          <Stagger as="ul" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="border-line bg-canvas flex h-full flex-col gap-4 rounded-xl border px-6 py-7"
              >
                <reason.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
                <h3 className="text-heading text-base font-semibold">{reason.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{reason.body}</p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- The agenda ----------
          What a first conversation covers. This replaces the commission
          percentages and contract terms that a partner page would normally
          state, because nobody has told us what they are — and it is genuinely
          more useful than a vague promise. */}
      <Section spacing="lg" aria-labelledby="afstemmen-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Het eerste gesprek</Eyebrow>
              <h2 id="afstemmen-heading" className="text-display-md mt-5 max-w-[16ch]">
                Wat we samen afstemmen
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Een kennismaking duurt een kwartier. Dit zijn de vier dingen die we erin vastleggen,
                zodat u daarna weet waar u aan toe bent.
              </p>
            </Reveal>

            <Stagger as="ol" className="divide-line border-line divide-y border-y">
              {AGENDA.map((item, index) => (
                <div key={item.title} className="grid grid-cols-[auto_1fr] gap-x-6 py-6">
                  {/* A real sequence — the conversation runs in this order — so
                      a numeral is information rather than decoration. Same rule
                      as the process timeline; same treatment. */}
                  <p aria-hidden className="ghost-numeral text-numeral text-3xl">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <div>
                    <h3 className="text-heading text-base font-semibold">
                      <span className="sr-only">Punt {index + 1}: </span>
                      {item.title}
                    </h3>
                    <p className="text-muted mt-2 max-w-[46ch] text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------- The close ----------
          Not the site-wide <ClosingCta>: that one asks for a booking, and this
          page is not asking for a booking. The live page made exactly this
          mistake — "Klaar om partner te worden? Neem vrijblijvend contact op",
          followed by a "Reserveer nu" button. */}
      <Section tone="accent" spacing="lg" aria-labelledby="partner-cta-heading">
        <Container>
          <Reveal className="max-w-[52ch]">
            <h2 id="partner-cta-heading" className="text-display-lg">
              Klaar om partner te worden?
            </h2>
            <p className="text-body text-lead mt-6">
              Wilt u uw klanten een extra service bieden én uw omzet verhogen? Neem vrijblijvend
              contact op voor een kennismaking. Wij vertellen u graag hoe eenvoudig het is om
              partner te worden.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/contact/" size="lg">
                Plan een kennismaking
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href={siteConfig.phone.href} variant="outline" size="lg">
                <Phone className="size-4" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                <span className="numeric">{siteConfig.phone.display}</span>
              </Button>
            </div>

            {/* Business accounts and the reisbureau partnership are adjacent
                propositions for overlapping audiences, and on the live site
                neither page mentions the other. */}
            <p className="text-muted border-valet-200 mt-10 border-t pt-8 text-sm leading-relaxed">
              Geen reisbureau, maar wel meerdere voertuigen of medewerkers te beheren? Dan is een{' '}
              <a
                href="/login/"
                className="text-brand decoration-navy-300 hover:decoration-navy-600 underline underline-offset-4"
              >
                zakelijk account in het klantenportaal
              </a>{' '}
              waarschijnlijk wat u zoekt.
            </p>
          </Reveal>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
    </>
  );
}
