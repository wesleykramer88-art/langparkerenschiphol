import {
  ArrowRight,
  BadgeEuro,
  Briefcase,
  Building2,
  Check,
  Compass,
  Handshake,
  Phone,
  Plane,
  ShieldCheck,
  SquareUser,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { SectionTear } from '@/components/ui/Ticket';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { FaqSection } from '@/components/sections/Faq';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('partners');

const CRUMBS = [{ name: 'Reisbureaus', path: '/samenwerken/' }];

/**
 * /samenwerken/
 *
 * ── This page was rebuilt once, and is now the client's own copy ─────────────
 * It used to be the only page on the site where the copy could not simply be
 * moved across, because a large part of it was never about this page: bullets
 * lifted from the services page that addressed a traveller rather than a travel
 * agent, five "waarom samenwerken" cards whose headings did not match their
 * descriptions, "10+ jaar" against "meer dan 15 jaar" everywhere else, and a
 * closing block that asked for a partnership and then offered a "Reserveer nu"
 * button.
 *
 * All of that was fixed in the rebuild. As of August 2026 the copy is the
 * client's own throughout, from his samenwerken document, and it resolves the
 * one thing the rebuild could not:
 *
 * ── HE HAS ANSWERED THE COMMISSION TODO. SORT OF ────────────────────────────
 * The rebuild deliberately stated no commission percentage, tier, payment term
 * or contract length, because nobody had told us what they were, and a number
 * invented on a B2B page is one a partner quotes back in a negotiation.
 *
 * His copy still states no figure — but it now says explicitly and repeatedly
 * that the commission is agreed per partner during the intake ("De commissie
 * spreken we vooraf met u af"). That is a real answer rather than a gap: the
 * page is no longer silent about why there is no number on it.
 * TODO(client): if you ever want a figure or a band on the page, send it. "10%
 * over iedere boeking" converts considerably better than "we spreken het af",
 * and no competitor on this keyword states one.
 *
 * ── Six sections are new ────────────────────────────────────────────────────
 * His document specifies, in this order: the proposition, the two services with
 * a per-service benefit list, why us, how the partnership starts, who it suits,
 * what happens after a referral, the intake, a six-question FAQ, and the close.
 * Everything below follows that order.
 */

/* ══════════════════════════════════════════════════════════════════════════
   THE PROPOSITION
   Three claims, replacing the two that were here. His third one — "extra
   service voor uw klanten" — is the one the rebuild had no home for.
   ══════════════════════════════════════════════════════════════════════════ */
const PROPOSITION: readonly { icon: LucideIcon; title: string; paragraphs: readonly string[] }[] = [
  {
    icon: BadgeEuro,
    title: 'Extra inkomsten per boeking',
    paragraphs: [
      'Als partner ontvangt u commissie over de parkeerboekingen die via uw reisbureau worden aangebracht.',
      'Zo creëert u een extra inkomstenstroom naast de reis die u al verkoopt.',
    ],
  },
  {
    icon: Wallet,
    title: 'Geen extra operationeel werk',
    paragraphs: [
      'Wij verzorgen de uitvoering van de parkeerservice.',
      'Van reservering en parkeerplaats tot klantenservice, chauffeur, shuttle en terugkomst: wij regelen het.',
    ],
  },
  {
    icon: Handshake,
    title: 'Extra service voor uw klanten',
    paragraphs: [
      'Uw klant kan de reis én het parkeren vooraf regelen.',
      'Dat betekent minder uitzoekwerk voor de reiziger en een completere service vanuit uw reisbureau.',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   TWO SERVICES, ONE PARTNER
   New. The partner-facing version of the homepage's service chooser — same two
   products, described in terms of the agent's customer rather than the visitor.

   These lists are NOT SERVICE_COPY's. That file holds the consumer-facing USPs
   ("u parkeert zelf"); these are written in the third person about "de klant",
   which is the whole point of a B2B page. Sharing them would mean one of the two
   audiences reading copy aimed at the other.
   ══════════════════════════════════════════════════════════════════════════ */
const PARTNER_SERVICES: readonly {
  name: string;
  paragraphs: readonly string[];
  benefits: readonly string[];
}[] = [
  {
    name: 'Valet parking',
    paragraphs: [
      'Voor klanten die vooral gemak willen.',
      'De klant rijdt rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur neemt de auto daar over en rijdt deze naar onze bewaakte parkeerlocatie.',
      'Na terugkomst brengen wij de auto weer naar Schiphol.',
    ],
    benefits: [
      'Rechtstreeks naar de vertrekhal',
      'Geen shuttle of transfer nodig',
      'Auto wordt door onze chauffeur geparkeerd',
      'Iedere valetrit digitaal geregistreerd',
      'Route en snelheid digitaal vastgelegd',
    ],
  },
  {
    name: 'Shuttle parkeren',
    paragraphs: [
      'Voor klanten die voordeliger willen parkeren en hun autosleutels graag zelf meenemen.',
      'De klant rijdt naar onze parkeerlocatie in Schiphol-Rijk, parkeert zelf en neemt de autosleutels mee op reis.',
      'Onze shuttle brengt de klant vervolgens in ongeveer 5 tot 8 minuten naar de vertrekhal.',
    ],
    benefits: [
      'Voordelige parkeeroptie',
      'Zelf de auto parkeren',
      'Autosleutels mee op reis',
      'Gratis shuttle van en naar Schiphol',
      'Slechts 5 tot 8 minuten van de vertrekhal',
    ],
  },
];

/**
 * Six reasons now, not five — his sixth is "Persoonlijk contact", the vast
 * aanspreekpunt, which is the one thing on this page a large aggregator cannot
 * offer and which the rebuild's five did not mention.
 *
 * Every heading still describes the same thing its body describes, which was the
 * entire problem with the five that were originally live.
 */
const REASONS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Building2,
    title: `Meer dan ${siteConfig.yearsActive} jaar ervaring`,
    body: `Wij hebben meer dan ${siteConfig.yearsActive} jaar ervaring met parkeren bij Schiphol en helpen jaarlijks duizenden reizigers.`,
  },
  {
    icon: ShieldCheck,
    title: 'Bewaakte parkeerlocaties',
    body: "De auto's van uw klanten worden geparkeerd op afgesloten en gecontroleerde parkeerlocaties met 24/7 camerabewaking. Overdekt parkeren is eveneens mogelijk.",
  },
  {
    icon: SquareUser,
    title: 'Ervaren chauffeurs',
    body: 'Bij valet parking wordt de auto door onze chauffeurs tussen Schiphol en onze parkeerlocatie gereden. Iedere valetrit wordt digitaal geregistreerd, inclusief gereden route en snelheid.',
  },
  {
    icon: Handshake,
    title: 'Valet én shuttle',
    body: 'Met één samenwerking kunt u uw klanten twee verschillende parkeerservices aanbieden. Zo kunt u zowel de klant die vooral gemak zoekt als de prijsbewuste reiziger een passende parkeeroplossing bieden.',
  },
  {
    icon: Wallet,
    title: 'Wij verzorgen de volledige uitvoering',
    body: 'Uw klant maakt gebruik van onze parkeerservice en wij verzorgen de operationele afhandeling. Uw reisbureau hoeft zelf geen parkeerplaatsen, chauffeurs, shuttles of klantenservice te organiseren.',
  },
  {
    icon: UserRound,
    title: 'Persoonlijk contact',
    body: 'Als partner heeft u een vast aanspreekpunt voor vragen, wijzigingen en bijzonderheden rondom reserveringen.',
  },
];

/**
 * The agenda for a first conversation. His four, and they are the same four the
 * rebuild guessed at — which is the most useful confirmation in the document.
 * Each now has his two sentences rather than our one.
 */
const AGENDA: readonly { title: string; paragraphs: readonly string[] }[] = [
  {
    title: 'Uw commissie',
    paragraphs: [
      'We spreken vooraf af welke vergoeding u ontvangt voor aangebrachte boekingen en hoe de commissie wordt berekend.',
      'Zo weet u vooraf wat iedere succesvolle parkeerboeking uw reisbureau oplevert.',
    ],
  },
  {
    title: 'Hoe uw klanten reserveren',
    paragraphs: [
      'We kiezen samen een werkwijze die aansluit op uw organisatie.',
      'Afhankelijk van de samenwerking kunnen reserveringen bijvoorbeeld via een eigen boekingslink, telefonisch of per e-mail worden aangebracht.',
    ],
  },
  {
    title: 'Facturatie en uitbetaling',
    paragraphs: [
      'We maken duidelijke afspraken over de administratieve afhandeling en het moment waarop commissies worden afgerekend.',
      'Zo blijft de samenwerking ook administratief eenvoudig.',
    ],
  },
  {
    title: 'Uw vaste contactpersoon',
    paragraphs: [
      'U krijgt een vast aanspreekpunt binnen Lang Parkeren Schiphol.',
      'Heeft u een wijziging, vraag of bijzonderheid rondom een reservering? Dan weet u direct bij wie u terechtkunt.',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   WHO IT SUITS
   New. Five audiences, and the fifth is deliberately open-ended — his
   "Andere reispartners" invites anyone who does not fit the four above.
   ══════════════════════════════════════════════════════════════════════════ */
const AUDIENCES: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Compass,
    title: 'Reisbureaus',
    body: 'Bied parkeren direct aan als aanvulling op een vakantie, stedentrip of andere reis.',
  },
  {
    icon: Briefcase,
    title: 'Zakenreisbureaus',
    body: 'Maak het voor zakelijke reizigers mogelijk om vervoer en parkeren vooraf goed te regelen.',
  },
  {
    icon: Plane,
    title: 'Touroperators',
    body: 'Voeg parkeren bij Schiphol toe als aanvullende service binnen uw reisaanbod.',
  },
  {
    icon: Users,
    title: 'Reisadviseurs',
    body: 'Geef uw klanten één aanspreekpunt voor hun reis en bied tegelijkertijd een praktische parkeeroplossing aan.',
  },
  {
    icon: Handshake,
    title: 'Andere reispartners',
    body: 'Werkt u met klanten die regelmatig vanaf Schiphol vliegen? Neem gerust contact met ons op. We bekijken graag of een samenwerking interessant is.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   AFTER A REFERRAL
   New, and rendered on <Timeline> because it is genuinely a sequence: before
   departure, on the day, during the trip, after landing. Four stops, which is
   the count the timeline was built around.
   ══════════════════════════════════════════════════════════════════════════ */
const HANDOVER: readonly TimelineStep[] = [
  {
    title: 'Voor vertrek',
    body: 'De klant ontvangt de benodigde informatie over de gekozen parkeerservice, locatie en aankomst.',
  },
  {
    title: 'Op de dag van vertrek',
    body: 'Bij valet parking ontmoeten we de klant bij de vertrekhal van Schiphol. Bij shuttle parkeren rijdt de klant naar onze parkeerlocatie in Schiphol-Rijk en verzorgen wij de transfer naar de luchthaven.',
  },
  {
    title: 'Tijdens de reis',
    body: 'De auto staat op onze bewaakte parkeerlocatie. Bij valet parking wordt iedere rit die onze chauffeur met de auto maakt digitaal geregistreerd.',
  },
  {
    title: 'Na de landing',
    body: 'Wij verzorgen de terugkomst van de klant. Bij valet brengen we de auto terug naar Schiphol. Bij shuttle halen we de klant op en brengen we deze terug naar de parkeerlocatie.',
  },
];

/** New: the page had no FAQ at all. His six. */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Wat verdient mijn reisbureau per boeking?',
    answer: [
      'De commissie spreken we vooraf met u af.',
      'Tijdens de kennismaking bespreken we de verwachte aantallen boekingen, de gewenste werkwijze en de parkeerservices die u wilt aanbieden.',
    ],
  },
  {
    question: 'Moeten wij zelf de klantenservice verzorgen?',
    answer: [
      'Nee.',
      'Wij verzorgen de operationele afhandeling van de parkeerservice en ondersteunen klanten bij vragen over hun parkeerreservering.',
    ],
  },
  {
    question: 'Kunnen wij zowel valet als shuttle aanbieden?',
    answer: [
      'Ja.',
      'Als partner kunt u beide parkeerservices aanbieden.',
      'Zo kunt u klanten die vooral gemak zoeken valet parking aanbieden en klanten die voordeliger willen parkeren onze shuttleservice.',
    ],
  },
  {
    question: 'Hoe kunnen onze klanten reserveren?',
    answer: [
      'Dat stemmen we samen af.',
      'Afhankelijk van de samenwerking kan dit bijvoorbeeld via een eigen boekingslink, telefonisch of per e-mail.',
    ],
  },
  {
    question: 'Wie verzorgt de parkeerlocatie en chauffeurs?',
    answer: [
      'Wij verzorgen de volledige parkeerservice.',
      'U hoeft zelf geen parkeerplaatsen, chauffeurs of shuttlevervoer te organiseren.',
    ],
  },
  {
    question: 'Kunnen we eerst vrijblijvend kennismaken?',
    answer: [
      'Natuurlijk.',
      'Tijdens een korte kennismaking bespreken we hoe de samenwerking eruit kan zien en beantwoorden we uw vragen.',
      'Daarna bepaalt u zelf of u met Lang Parkeren Schiphol wilt samenwerken.',
    ],
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Samenwerken?"
        title="Samenwerken met Lang Parkeren Schiphol"
        subhead="Verdien extra aan iedere reis die u verkoopt"
        lead={[
          'Bied uw klanten naast hun reis ook parkeren bij Schiphol aan en ontvang commissie over iedere succesvolle boeking.',
          'Wij verzorgen de volledige parkeerservice. Van de reservering en klantenservice tot het parkeren van de auto en de terugkomst van uw klant.',
          'U brengt de klant aan. Wij regelen de rest.',
        ]}
        photo="crewTerminal"
        objectPosition="object-[center_28%]"
        crumbs={CRUMBS}
      >
        {/* ⚠ His document gives BOTH "Word partner" and "Neem vrijblijvend
            contact op" as buttons here, and on this site both can only go to
            /contact/ — there is no separate partner sign-up form. They are
            rendered as he wrote them rather than silently merged, but two
            buttons to one destination is a defect in the copy, not a design
            decision.
            TODO(client): pick one of these two labels, or tell us what the
            second one should point at (a form, a calendar link, an e-mail). */}
        <Button href="/contact/" size="lg">
          Word partner
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/contact/" variant="outline" size="lg">
          Neem vrijblijvend contact op
        </Button>

        {/* His document puts the phone number on its own line under the two
            buttons rather than as a third button, which is also the right call
            visually — three buttons in a hero row is a menu, not a call to
            action. `basis-full` drops it below them. */}
        <p className="text-muted basis-full text-sm">
          <Phone className="mr-2 inline size-4 align-[-0.2em]" aria-hidden />
          <span className="sr-only">Bel ons: </span>
          Bel ons:{' '}
          <a
            href={siteConfig.phone.href}
            className="numeric text-brand decoration-navy-300 hover:decoration-navy-600 underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>
        </p>
      </PageHero>

      {/* ---------- The proposition ----------
          Three columns split by hairlines rather than boxed cards, the same
          treatment the two-column version used. */}
      <Section spacing="lg" aria-labelledby="propositie-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Parkeren als extra service voor uw klanten</Eyebrow>
            <h2 id="propositie-heading" className="text-display-lg mt-5">
              Meer service voor uw klant én extra omzet voor uw reisbureau
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-muted leading-relaxed">
                Uw klant heeft een reis geboekt. De volgende vraag is vaak: hoe komen we op Schiphol
                en waar laten we de auto?
              </p>
              <p className="text-muted leading-relaxed">
                Als partner van Lang Parkeren Schiphol kunt u direct een passende parkeeroplossing
                aanbieden.
              </p>
              <p className="text-muted leading-relaxed">
                Uw klanten kunnen kiezen uit valet parking bij de vertrekhal of shuttle parkeren
                vlak bij Schiphol.
              </p>
              <p className="text-muted leading-relaxed">
                Wij verzorgen vervolgens de volledige uitvoering.
              </p>
            </div>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {PROPOSITION.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 80}
                className={`py-10 ${index === 0 ? 'lg:pr-10' : index === 1 ? 'lg:px-10' : 'lg:pl-10'}`}
              >
                <item.icon className="text-accent size-7" strokeWidth={1.5} aria-hidden />
                <h3 className="text-display-sm text-heading mt-6">{item.title}</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted max-w-[42ch] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Two services, one partner ----------
          NEW, August 2026. */}
      <Section tone="surface" spacing="lg" aria-labelledby="services-heading">
        <Container className="absolute inset-x-0 top-0 z-10">
          <SectionTear notch="canvas" />
        </Container>

        <Container className="relative">
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Twee parkeerservices, één partner</Eyebrow>
            <h2 id="services-heading" className="text-display-lg mt-5">
              Valet én shuttle parkeren bij Schiphol
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Niet iedere reiziger zoekt hetzelfde. Daarom kunt u als partner zowel valet als
              shuttle parkeren aanbieden.
            </p>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {PARTNER_SERVICES.map((service, index) => (
              <Reveal
                key={service.name}
                delay={index * 80}
                className={index === 0 ? 'py-10 lg:pr-14' : 'py-10 lg:pl-14'}
              >
                <h3 className="text-display-sm text-heading">{service.name}</h3>

                <div className="mt-5 flex flex-col gap-4">
                  {service.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted max-w-[46ch] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <p className="text-heading mt-8 text-base font-semibold">
                  Voordelen voor uw klant:
                </p>
                <ul className="divide-line border-line mt-4 divide-y border-y">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3.5 py-3">
                      <Check
                        className="text-accent mt-1 size-4 shrink-0"
                        strokeWidth={3}
                        aria-hidden
                      />
                      <span className="text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Six reasons ---------- */}
      <Section spacing="lg" aria-labelledby="waarom-partner-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <Reveal className="max-w-[40ch]">
              <Eyebrow rule>Waarom samenwerken met Lang Parkeren Schiphol?</Eyebrow>
              <h2 id="waarom-partner-heading" className="text-display-lg mt-5">
                Een parkeerpartner waarop u kunt vertrouwen
              </h2>
              <p className="text-muted mt-6 leading-relaxed">
                Wanneer u onze parkeerservice aan uw klanten adviseert, verbinden zij die ervaring
                ook aan uw reisbureau.
              </p>
              <p className="text-muted mt-4 leading-relaxed">
                Daarom vinden wij betrouwbaarheid, duidelijke communicatie en een professionele
                uitvoering belangrijk.
              </p>
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
                className="border-line bg-surface flex h-full flex-col gap-4 rounded-xl border px-6 py-7"
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
          What a first conversation covers. Still the most honest thing on the
          page: his copy confirms these are the four things that get agreed, and
          states outright that the commission is one of them rather than
          publishing a figure. */}
      <Section tone="surface" spacing="lg" aria-labelledby="afstemmen-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Zo werkt de samenwerking</Eyebrow>
              <h2 id="afstemmen-heading" className="text-display-md mt-5 max-w-[16ch]">
                Eenvoudig starten als partner
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Samenwerken hoeft niet ingewikkeld te zijn. Tijdens een korte kennismaking bespreken
                we hoe onze parkeerservice het beste aansluit op uw reisbureau.
              </p>
              <p className="text-muted mt-4 max-w-[40ch] leading-relaxed">
                Daarbij maken we duidelijke afspraken over vier onderdelen.
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
                    <div className="mt-2 flex flex-col gap-2">
                      {item.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-muted max-w-[46ch] text-sm leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------- Who it suits ----------
          NEW, August 2026. Five, so the grid runs 2 / 3 rather than a row of
          five: at five columns each card is about 210px and the longest body
          here sets to three words a line. */}
      <Section spacing="md" aria-labelledby="doelgroep-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Voor welke partners is dit interessant?</Eyebrow>
            <h2 id="doelgroep-heading" className="text-display-md mt-5">
              Parkeren toevoegen aan een bestaande reisboeking
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Onze samenwerking is vooral interessant voor bedrijven die regelmatig klanten naar
              Schiphol laten reizen.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.title}
                className="border-line bg-surface flex h-full flex-col gap-4 rounded-xl border px-6 py-7"
              >
                <audience.icon className="text-accent size-6" strokeWidth={1.75} aria-hidden />
                <h3 className="text-heading text-base font-semibold">{audience.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{audience.body}</p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---------- What happens after a referral ----------
          NEW, August 2026. On <Timeline> because it is a genuine sequence. */}
      <Section tone="surface" spacing="lg" aria-labelledby="uitvoering-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Wat gebeurt er nadat u een klant aanbrengt?</Eyebrow>
              <h2 id="uitvoering-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Wij nemen de uitvoering van u over
              </h2>
            </div>
            <p className="text-muted max-w-[34ch] text-base lg:pb-2 lg:text-right">
              Zodra een reservering bij ons bekend is, verzorgen wij de parkeerservice.
            </p>
          </Reveal>

          <Timeline steps={HANDOVER} />

          {/* His closing line for the section, set in bold in the document. */}
          <Reveal>
            <p className="text-heading mt-12 text-base font-semibold">
              Uw reisbureau hoeft hier operationeel niets voor te regelen.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------- The intake ----------
          NEW, August 2026. Deliberately a quiet prose band rather than a second
          call-to-action block: the close below is the ask, and two accent
          sections thirty percent apart would compete. */}
      <Section spacing="md" aria-labelledby="kennismaken-heading">
        <Container>
          <Reveal className="max-w-[62ch]">
            <Eyebrow rule>Samenwerken zonder ingewikkelde constructies</Eyebrow>
            <h2 id="kennismaken-heading" className="text-display-md mt-5">
              Eerst kennismaken, daarna bepalen we wat bij u past
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body leading-relaxed">
                Geen twee reisbureaus werken precies hetzelfde.
              </p>
              <p className="text-body leading-relaxed">
                Daarom beginnen we met een korte kennismaking. We bespreken hoeveel reizigers u
                ongeveer bedient, welke parkeerservice bij uw klanten past en hoe u parkeren wilt
                aanbieden.
              </p>
              <p className="text-body leading-relaxed">
                Daarna maken we duidelijke afspraken over de boekingswijze, commissie, facturatie en
                communicatie.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/contact/" size="lg">
                Vrijblijvend kennismaken
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href={siteConfig.phone.href} variant="outline" size="lg">
                <Phone className="size-4" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                <span className="numeric">{siteConfig.phone.display}</span>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------- FAQ ----------
          NEW: this page had no FAQ at all, and these six are the questions a
          travel agent actually asks. Its FAQPage markup is emitted below from
          the same array. */}
      <FaqSection
        items={FAQS}
        eyebrow="Veelgestelde vragen over samenwerken"
        heading="Partner worden van Lang Parkeren Schiphol"
        schema={false}
      />

      {/* ---------- The close ----------
          Not the site-wide <ClosingCta>: that one asks for a booking, and this
          page is not asking for a booking. The live page made exactly this
          mistake — "Klaar om partner te worden? Neem vrijblijvend contact op",
          followed by a "Reserveer nu" button. */}
      <Section tone="accent" spacing="lg" aria-labelledby="partner-cta-heading">
        <Container>
          <Reveal className="max-w-[62ch]">
            <h2 id="partner-cta-heading" className="text-display-lg">
              Klaar om partner te worden?
            </h2>
            <p className="text-heading mt-5 text-lg font-medium">
              Verdien mee aan de parkeerbehoefte van uw klanten
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body text-lead">
                Uw klanten boeken bij u hun reis. Met Lang Parkeren Schiphol kunt u ook het parkeren
                voor hen regelen.
              </p>
              <p className="text-body text-lead">
                U biedt een extra service, ontvangt commissie over succesvolle boekingen en wij
                verzorgen de volledige uitvoering.
              </p>
              <p className="text-heading text-lead font-medium">
                Meer service voor uw klant. Extra omzet voor uw reisbureau. Geen extra operationeel
                werk.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/contact/" size="lg">
                Plan een vrijblijvende kennismaking
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href={siteConfig.phone.href} variant="outline" size="lg">
                <Phone className="size-4" aria-hidden />
                <span className="sr-only">Bel ons: </span>
                <span className="numeric">{siteConfig.phone.display}</span>
              </Button>
            </div>

            {/* His six closing points. divide/border in valet-200 rather than
                --color-line, because they sit on the accent wash. */}
            <ul className="border-valet-200 mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2">
              {[
                'Commissie over succesvolle boekingen',
                'Valet én shuttle parkeren',
                `Meer dan ${siteConfig.yearsActive} jaar ervaring`,
                '24/7 bewaakte parkeerlocaties',
                'Volledige uitvoering door Lang Parkeren Schiphol',
                'Vast aanspreekpunt voor partners',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="text-accent-hover mt-1 size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span className="text-body text-sm">{item}</span>
                </li>
              ))}
            </ul>

            {/* Business accounts and the reisbureau partnership are adjacent
                propositions for overlapping audiences, and on the live site
                neither page mentions the other. His copy keeps this and gives it
                a heading of its own. */}
            <div className="border-valet-200 mt-10 border-t pt-8">
              <h3 className="text-heading text-lg font-semibold">Geen reisbureau?</h3>
              <p className="text-body mt-3 leading-relaxed">
                Heeft u meerdere medewerkers of voertuigen waarvoor regelmatig parkeren bij Schiphol
                moet worden geregeld?
              </p>
              <p className="text-body mt-3 leading-relaxed">
                Dan past een zakelijk account waarschijnlijk beter bij uw organisatie. Daarmee kunt
                u reserveringen centraal beheren en heeft u alle parkeerboekingen overzichtelijk op
                één plek.
              </p>
              <Button href="/login/" variant="outline" className="mt-5">
                Bekijk zakelijk parkeren
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* Emitted here rather than by <FaqSection>, purely so it sits with the
          other structured data for this route. `schema={false}` above. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQS)) }}
      />
    </>
  );
}
