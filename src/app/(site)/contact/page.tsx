import { Car, Mail, MapPin, MessageSquare, Phone, SquarePen, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, contactPageSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { FaqSection } from '@/components/sections/Faq';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('contact');

const CRUMBS = [{ name: 'Contact', path: '/contact/' }];

const mailto = `mailto:${siteConfig.email}`;

/**
 * Directions to the shuttle terrain, for his "Route naar parkeerlocatie" button.
 *
 * Built from the address in config rather than pasted as a place URL: a Google
 * place ID is a thing that can go stale or point at a neighbouring unit, whereas
 * a directions query against the street address is what a person would type. It
 * is also derived from the ONE place the address lives, so it cannot disagree
 * with the address printed beside it.
 *
 * Deliberately the SHUTTLE terrain only. There is no directions link for valet:
 * that destination is a spot inside the terminal's departures passage, and a maps
 * pin on "Schiphol" would send a valet customer to the airport in general — which
 * they were going to anyway — while implying precision it does not have.
 */
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.locality}`,
)}`;

/**
 * /contact/
 *
 * ── The NAP, and the address that was not a mistake ────────────────────────
 * The live site showed three location strings. Two of them were the same place
 * written loosely — "Schiphol-Rijk, Nederland" and "Schiphol, Noord-Holland".
 *
 * The third is a different place. ParkingPro's own product data shows shuttle
 * operating from Tupolevlaan 39 in Schiphol-Rijk and valet handing over at the
 * Vertrekpassage in the terminal itself. Both are published here, each labelled
 * with what happens there, because a customer who drives to the wrong one
 * misses their flight. Only the business address carries LocalBusiness markup.
 *
 * The phone question is closed: 085-4013918 is the only number on the site, per
 * the client. See config/site.ts.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠ AUGUST 2026: THIS PAGE NOW REVERSES THE SITE'S POSITION ON THE PHONE
 * ══════════════════════════════════════════════════════════════════════════
 * The client's contact copy states, in four separate places, that the phone line
 * is for the OPERATIONAL day only — arriving to hand a car over, or having landed
 * and wanting it back — and that everything else goes by e-mail. His FAQ answer
 * "Kan ik bellen met een algemene vraag?" answers no.
 *
 * That is a deliberate service decision and this page implements it faithfully:
 * every general route on it is e-mail or the portal, and the number appears only
 * beside the day-of use case, with his restriction sentence attached.
 *
 * ⚠ IT CONTRADICTS THE REST OF THE SITE, WHICH WAS NOT IN THIS PASS'S SCOPE:
 *   · <ClosingCta> renders a phone button on thirteen pages, next to "Reserveer nu"
 *   · <FaqSection>'s "Staat uw vraag er niet tussen?" block offers the number on
 *     six pages, for exactly the general questions this page redirects to e-mail
 *   · the header carries it at all times on desktop
 *   · his OWN other seven documents all still print "Bel ons: 085 - 401 3918",
 *     including the homepage and both service pages
 * So the seven other documents and this one disagree with each other, not just
 * with our markup.
 *
 * Nothing outside this page was changed. What WAS changed is the two places on
 * this route that would have contradicted the page they sit on — the contact
 * form's confirmation and its helper line, both of which promised a reply within
 * the hour and invited a call. See ContactForm.
 *
 * TODO(client): decide which it is. Either the number is a general-purpose line
 * (in which case this page's restriction should soften) or it is not (in which
 * case the closing CTA and the FAQ escape hatch need to stop offering it
 * site-wide). Right now a visitor can read "bel ons" on the homepage and "niet
 * bellen voor algemene vragen" here.
 *
 * ── Structure ───────────────────────────────────────────────────────────────
 * His document is a much larger page than the two-column one this was. New:
 * "Hoe kunnen we u helpen?", "E-mail klantenservice", a six-answer FAQ (this
 * route had none, and therefore no FAQPage markup) and a closing block. The
 * locations and the form are the two things that carried over.
 */

/* ══════════════════════════════════════════════════════════════════════════
   THREE ROUTES
   New. The most useful thing his copy adds: the page now sorts the visitor by
   what they want before it gives them a channel, rather than listing channels
   and leaving them to choose.
   ══════════════════════════════════════════════════════════════════════════ */
const ROUTES: readonly {
  icon: LucideIcon;
  title: string;
  paragraphs: readonly string[];
  /** Rendered as the prominent contact detail inside the card. */
  detail: { kind: 'email' | 'phone' };
  /** Bullets under the paragraphs, where his copy has them. */
  bulletsIntro?: string;
  bullets?: readonly string[];
  /** A closing note, set at heading weight where his copy bolds it. */
  note?: string;
  cta?: { label: string; href: string };
}[] = [
  {
    icon: MessageSquare,
    title: 'Ik heb een algemene vraag',
    paragraphs: [
      'Heeft u een vraag over valet parkeren, shuttle parkeren, tarieven, een betaling, annulering of onze werkwijze?',
      'Stuur dan een e-mail naar:',
    ],
    detail: { kind: 'email' },
    note: 'Vermeld bij vragen over een bestaande boeking altijd uw reserveringsnummer.',
    cta: { label: 'Stuur een e-mail', href: mailto },
  },
  {
    icon: SquarePen,
    title: 'Ik wil mijn reservering wijzigen',
    paragraphs: [
      'Heeft u al een reservering en wilt u bijvoorbeeld uw aankomsttijd, vluchtgegevens of andere gegevens aanpassen?',
      'Veel gegevens kunt u zelf wijzigen via het klantenportaal.',
      'Lukt dit niet of heeft u hulp nodig? Stuur dan een e-mail naar onze klantenservice en vermeld uw reserveringsnummer.',
    ],
    detail: { kind: 'email' },
    cta: { label: 'Naar het klantenportaal', href: '/login/' },
  },
  {
    icon: Car,
    title: 'Ik wil mijn auto inleveren of ophalen',
    paragraphs: [
      'Alleen op de dag van aankomst of terugkomst kunt u ons operationele telefoonnummer gebruiken voor het inleveren of ophalen van uw auto.',
    ],
    detail: { kind: 'phone' },
    bulletsIntro:
      'Dit telefoonnummer is bedoeld voor klanten die op dat moment gebruikmaken van onze valet- of shuttleservice. Bijvoorbeeld wanneer:',
    bullets: [
      'u onderweg bent naar onze parkeerlocatie;',
      'u aankomt voor de overdracht van uw auto;',
      'u bent geland en uw auto wilt ophalen;',
      'u bent geland en opgehaald wilt worden door onze shuttle.',
    ],
    note: 'Heeft u een algemene vraag of wilt u iets aan uw reservering wijzigen? Stuur ons dan een e-mail of gebruik het klantenportaal.',
  },
];

/** What the mailbox handles. His nine, in his order. */
const EMAIL_TOPICS = [
  'een bestaande reservering;',
  'wijzigen of annuleren;',
  'betalingen en facturen;',
  'valet parkeren;',
  'shuttle parkeren;',
  'tarieven en extra opties;',
  'schade of een andere melding;',
  'zakelijke aanvragen;',
  'overige vragen.',
] as const;

/** New: this route had no FAQ, and therefore no FAQPage markup. His six. */
const FAQS: readonly FaqItem[] = [
  {
    // The answer that reverses the site's phone position. See the note above.
    question: 'Kan ik bellen met een algemene vraag?',
    answer: [
      "Ons telefoonnummer is bedoeld voor de operationele afhandeling van het inleveren en ophalen van auto's op de dag zelf.",
      `Heeft u een algemene vraag over uw reservering, tarieven, betaling, annulering of onze parkeerservice? Stuur dan een e-mail naar ${siteConfig.email}.`,
    ],
  },
  {
    question: 'Wanneer mag ik wel bellen?',
    answer: [
      'U kunt ons operationele telefoonnummer gebruiken wanneer u op de dag zelf uw auto komt inleveren of ophalen.',
      'Dit geldt zowel voor valetklanten als voor shuttleklanten die contact moeten opnemen over hun aankomst of terugkomst.',
      `Operationeel telefoonnummer: ${siteConfig.phone.display}`,
    ],
  },
  {
    question: 'Hoe kan ik mijn reservering wijzigen?',
    answer: [
      'Veel gegevens kunt u zelf wijzigen via het klantenportaal.',
      'Lukt dit niet? Stuur dan een e-mail naar onze klantenservice en vermeld uw reserveringsnummer.',
    ],
  },
  {
    question: 'Waar kan ik terecht met een vraag over mijn betaling of factuur?',
    answer: [
      `Stuur hiervoor een e-mail naar ${siteConfig.email}.`,
      'Vermeld uw reserveringsnummer en, indien relevant, de naam waarop de reservering is gemaakt.',
    ],
  },
  {
    question: 'Ik ben geland. Wat moet ik doen?',
    answer: [
      'Volg de instructies in uw reserveringsbevestiging.',
      `Bent u geland en moet uw auto worden teruggebracht of wilt u worden opgehaald door onze shuttle? Dan kunt u het operationele telefoonnummer gebruiken: ${siteConfig.phone.display}.`,
    ],
  },
  {
    question: 'Waar kan ik terecht met een klacht of schade?',
    answer: [
      `Stuur uw melding per e-mail naar ${siteConfig.email}.`,
      "Vermeld uw reserveringsnummer en voeg indien relevant foto's of andere informatie toe. Zo kunnen wij uw melding goed beoordelen.",
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact met Lang Parkeren Schiphol"
        subhead="Heeft u een vraag? Stuur ons een e-mail"
        // His lead. Note what is NOT here any more: "Ons team is bereikbaar voor
        // reserveringen, wijzigingen of vragen. Doorgaans reageren wij binnen 1
        // uur." Both halves of that are gone on his instruction — the phone is no
        // longer a general channel, and he does not commit to an hour.
        lead={[
          'Heeft u een vraag over een reservering, onze parkeerservice, tarieven, annuleren of iets anders? Neem dan contact op met onze klantenservice via e-mail.',
          'Wij proberen uw vraag zo snel mogelijk te beantwoorden.',
        ]}
        photo="crewHandover"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
      >
        {/* The address itself, above the buttons. His document prints it as its
            own line in the hero, and it is the page's primary call to action —
            so it is a real link at reading size rather than only a button label. */}
        <p className="basis-full">
          <a
            href={mailto}
            className="text-heading hover:text-brand ease-settle inline-flex min-h-11 items-center gap-3 text-lg font-medium break-all transition-colors duration-(--duration-micro)"
          >
            <Mail className="text-accent size-5 shrink-0" aria-hidden />
            {siteConfig.email}
          </a>
        </p>

        <Button href={mailto} size="lg">
          Stuur een e-mail
        </Button>
        <Button href="/login/" variant="outline" size="lg">
          Naar het klantenportaal
        </Button>

        <p className="text-muted basis-full text-sm leading-relaxed">
          Heeft u al een reservering? Vermeld dan altijd uw reserveringsnummer in uw e-mail. Zo
          kunnen we uw boeking direct terugvinden en u sneller helpen.
        </p>
      </PageHero>

      {/* ---------- Three routes ----------
          NEW, August 2026. Cards rather than hairline columns, and this is the one
          block on the site where boxes are the right answer: they are three
          mutually exclusive choices and the border is what makes them read as
          pick-one rather than as a continuous argument. */}
      <Section tone="surface" spacing="lg" aria-labelledby="routes-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Hoe kunnen we u helpen?</Eyebrow>
            <h2 id="routes-heading" className="text-display-lg mt-5">
              Kies hieronder de juiste manier om contact op te nemen
            </h2>
          </Reveal>

          {/* Children are <div>: <Stagger as="ul"> already wraps each one in its
              own <li>, and an <li> here would nest inside that. */}
          <Stagger as="ul" className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {ROUTES.map((route) => (
              <div
                key={route.title}
                className="border-line bg-canvas flex h-full flex-col rounded-xl border p-6 sm:p-7"
              >
                <route.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
                <h3 className="text-heading mt-4 text-lg font-semibold">{route.title}</h3>

                <div className="mt-4 flex flex-col gap-3">
                  {route.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* The channel, given weight inside the card. */}
                {route.detail.kind === 'email' ? (
                  <a
                    href={mailto}
                    className="text-heading hover:text-brand ease-settle mt-4 inline-flex min-h-11 items-center text-sm font-semibold break-all transition-colors duration-(--duration-micro)"
                  >
                    {siteConfig.email}
                  </a>
                ) : (
                  <a
                    href={siteConfig.phone.href}
                    className="numeric text-heading hover:text-brand ease-settle mt-4 inline-flex min-h-11 items-center text-lg font-semibold transition-colors duration-(--duration-micro)"
                  >
                    <span className="sr-only">Bel ons: </span>
                    {siteConfig.phone.display}
                  </a>
                )}

                {route.bulletsIntro ? (
                  <p className="text-muted mt-3 text-sm leading-relaxed">{route.bulletsIntro}</p>
                ) : null}

                {route.bullets ? (
                  <ul className="text-muted mt-3 flex flex-col gap-1.5 text-sm leading-relaxed">
                    {route.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span aria-hidden className="text-accent">
                          ·
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* mt-auto so the notes and CTAs sit on the card's floor and the
                    three cards' bottom edges line up despite very different
                    amounts of copy — the third card is roughly twice the first. */}
                <div className="mt-auto pt-5">
                  {route.note ? (
                    <p className="text-heading text-sm leading-relaxed font-medium">{route.note}</p>
                  ) : null}

                  {route.cta ? (
                    <Button href={route.cta.href} variant="outline" className="mt-4">
                      {route.cta.label}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- The mailbox ----------
          NEW, August 2026. */}
      <Section spacing="lg" aria-labelledby="email-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>E-mail klantenservice</Eyebrow>
              <h2 id="email-heading" className="text-display-md mt-5 max-w-[18ch]">
                Voor vragen over uw reservering of onze parkeerservice
              </h2>

              <a
                href={mailto}
                className="text-heading hover:text-brand ease-settle mt-6 inline-flex min-h-11 items-center gap-3 text-lg font-medium break-all transition-colors duration-(--duration-micro)"
              >
                <Mail className="text-accent size-5 shrink-0" aria-hidden />
                {siteConfig.email}
              </a>

              <Button href={mailto} className="mt-6">
                Stuur een e-mail
              </Button>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-body leading-relaxed">
                U kunt onze klantenservice per e-mail onder andere bereiken voor vragen over:
              </p>

              <ul className="divide-line border-line mt-5 divide-y border-y sm:grid sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0">
                {EMAIL_TOPICS.map((topic) => (
                  <li key={topic} className="text-body py-3 text-sm sm:text-base">
                    {topic}
                  </li>
                ))}
              </ul>

              <p className="text-heading mt-6 max-w-[62ch] leading-relaxed font-medium">
                Heeft uw vraag betrekking op een bestaande reservering? Vermeld dan uw
                reserveringsnummer, naam en kenteken. Daarmee kunnen we uw reservering sneller
                terugvinden.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Self-service ----------
          Was a hairline block in the old page's left column; his document gives
          it a section of its own. */}
      <Section tone="surface" spacing="md" aria-labelledby="portaal-heading">
        <Container>
          <Reveal className="max-w-[62ch]">
            <Eyebrow rule>Uw reservering zelf beheren</Eyebrow>
            <h2 id="portaal-heading" className="text-display-md mt-5">
              Veel wijzigingen kunt u direct online regelen
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body leading-relaxed">
                Heeft u al gereserveerd? Dan hoeft u voor veel wijzigingen geen contact met onze
                klantenservice op te nemen.
              </p>
              <p className="text-body leading-relaxed">
                Via het klantenportaal kunt u uw reservering bekijken en, waar mogelijk, zelf
                aanpassen.
              </p>
              <p className="text-body leading-relaxed">
                Zo kunt u snel uw gegevens controleren of wijzigen zonder op een antwoord van onze
                klantenservice te hoeven wachten.
              </p>
            </div>

            <Button href="/login/" className="mt-8">
              Naar het klantenportaal
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* ---------- The two locations ----------
          Not a duplication bug. Shuttle customers drive to the terrain at
          Tupolevlaan; valet customers drive to the terminal kerb at
          Vertrekpassage. Somebody who goes to the wrong one of these misses a
          flight, so both are stated with what happens at each. His document gives
          each one its own block and its own explanation, which is a better
          treatment than the two rows of a definition list they used to be. */}
      <Section spacing="lg" aria-labelledby="locaties-heading">
        <Container>
          <Reveal>
            <Eyebrow rule>Onze locaties</Eyebrow>
            <h2 id="locaties-heading" className="text-display-lg mt-5 max-w-[20ch]">
              Waar u moet zijn, per parkeerservice
            </h2>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <Reveal className="py-10 lg:pr-14">
              <MapPin className="text-accent size-6" strokeWidth={1.75} aria-hidden />
              <h3 className="text-display-sm text-heading mt-5">Shuttle parkeren</h3>

              <address className="text-heading mt-4 text-lg font-medium not-italic">
                {siteConfig.address.street}
                <br />
                <span className="numeric">{siteConfig.address.postalCode}</span>{' '}
                {siteConfig.address.locality}
              </address>

              <div className="mt-5 flex flex-col gap-3">
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Kiest u voor shuttle parkeren? Dan rijdt u rechtstreeks naar deze parkeerlocatie.
                </p>
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  U parkeert uw auto zelf en neemt uw autosleutels mee op reis. Vanaf de
                  parkeerlocatie brengt onze shuttlebus u in ongeveer 5 tot 8 minuten naar de
                  vertrekhal van Schiphol.
                </p>
              </div>

              <Button href={directionsUrl} variant="outline" className="mt-7">
                Route naar parkeerlocatie
              </Button>
            </Reveal>

            <Reveal delay={80} className="py-10 lg:pl-14">
              <Car className="text-accent size-6" strokeWidth={1.75} aria-hidden />
              <h3 className="text-display-sm text-heading mt-5">
                Valet parking — overdracht bij Schiphol
              </h3>

              <address className="text-heading mt-4 text-lg font-medium not-italic">
                {siteConfig.valetHandover.street} {siteConfig.valetHandover.locality}
                <br />
                {siteConfig.valetHandover.detail}
              </address>

              <div className="mt-5 flex flex-col gap-3">
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Kiest u voor valet parking? Dan rijdt u rechtstreeks naar Schiphol.
                </p>
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Onze chauffeur neemt uw auto bij de vertrekhal van u over en rijdt deze vervolgens
                  naar onze bewaakte parkeerlocatie.
                </p>
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Na uw terugkomst wordt uw auto weer naar de afgesproken locatie bij Schiphol
                  gebracht.
                </p>
              </div>

              {/* No directions button here, deliberately — see the note on
                  `directionsUrl`. */}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- The form ---------- */}
      <Section tone="surface" spacing="lg" aria-labelledby="formulier-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Stuur ons een bericht</Eyebrow>
              <h2 id="formulier-heading" className="text-display-md mt-5 max-w-[18ch]">
                Wij helpen u graag per e-mail
              </h2>

              <div className="mt-6 flex flex-col gap-4">
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Heeft u een vraag? Vul het contactformulier hieronder in.
                </p>
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Uw bericht wordt naar onze klantenservice gestuurd. Wij proberen uw vraag zo snel
                  mogelijk te beantwoorden.
                </p>
                <p className="text-muted max-w-[46ch] leading-relaxed">
                  Gaat uw vraag over een bestaande reservering? Vermeld dan uw reserveringsnummer in
                  uw bericht.
                </p>
              </div>
            </Reveal>

            {/* The form's fields are his too — Naam, E-mailadres,
                Reserveringsnummer, Onderwerp, Bericht. The phone field it used to
                ask for is gone, which follows from the phone policy above. See
                ContactForm and contact/actions.ts. */}
            <Reveal delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={FAQS}
        eyebrow="Veelgestelde vragen over contact"
        // His document gives no H2 for this section, so this heading is the one
        // thing on the page that is not his wording. It states what the six
        // answers are about rather than adding a claim.
        heading="Bellen, mailen en uw reservering wijzigen"
        schema={false}
      />

      {/* ---------- The close ----------
          NEW: this route had no closing block. Deliberately NOT <ClosingCta> —
          that one asks for a booking, and a visitor who has read this far is
          trying to reach a person, not to buy a parking space. Same reasoning as
          the partner page's close, and the same accent band. */}
      <Section tone="accent" spacing="lg" aria-labelledby="contact-cta-heading">
        <Container>
          <Reveal className="max-w-[62ch]">
            <h2 id="contact-cta-heading" className="text-display-lg">
              Heeft u een vraag?
            </h2>
            <p className="text-heading mt-5 text-lg font-medium">
              Onze klantenservice helpt u graag per e-mail
            </p>

            <p className="text-body text-lead mt-6">
              Voor algemene vragen, wijzigingen, betalingen, annuleringen en andere vragen over uw
              reservering kunt u contact opnemen via:
            </p>

            <a
              href={mailto}
              className="text-heading hover:text-brand ease-settle mt-5 inline-flex min-h-11 items-center gap-3 text-lg font-medium break-all transition-colors duration-(--duration-micro)"
            >
              <Mail className="text-accent-hover size-5 shrink-0" aria-hidden />
              {siteConfig.email}
            </a>

            <p className="text-body mt-5 leading-relaxed">
              Heeft u al gereserveerd? Vermeld dan altijd uw reserveringsnummer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={mailto} size="lg">
                Stuur een e-mail
              </Button>
              <Button href="/login/" variant="outline" size="lg">
                Naar het klantenportaal
              </Button>
            </div>

            {/* The number, and the ONLY place on this page it is offered without
                a qualifier attached — because the qualifier is the heading. */}
            <div className="border-valet-200 mt-10 border-t pt-8">
              <h3 className="text-heading text-lg font-semibold">
                Alleen voor inleveren en ophalen op de dag zelf
              </h3>

              <a
                href={siteConfig.phone.href}
                className="numeric text-heading hover:text-brand ease-settle mt-3 inline-flex min-h-11 items-center gap-3 text-xl font-medium transition-colors duration-(--duration-micro)"
              >
                <Phone className="text-accent-hover size-5 shrink-0" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                {siteConfig.phone.display}
              </a>

              <p className="text-body mt-4 leading-relaxed">
                Gebruik dit nummer wanneer u op de dag van uw reservering contact nodig heeft voor
                het inleveren of ophalen van uw auto of voor de shuttletransfer.
              </p>
              <p className="text-body mt-3 leading-relaxed">
                Voor overige vragen verzoeken wij u vriendelijk om per e-mail contact op te nemen.
              </p>
            </div>
          </Reveal>
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
      {/* NEW rich-result surface: this route had no FAQ section and therefore no
          FAQPage node. `schema={false}` on the section above so it is emitted
          here with the rest of the route's structured data. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQS)) }}
      />
    </>
  );
}
