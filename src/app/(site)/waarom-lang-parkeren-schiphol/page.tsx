import {
  ArrowRight,
  Flame,
  Lock,
  Route,
  UserCheck,
  Video,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { siteConfig, termsUrl } from '@/config/site';
import type { PhotoName } from '@/config/images';

export const metadata = createMetadata('why');

const CRUMBS = [{ name: 'Waarom Lang Parkeren Schiphol', path: '/waarom-lang-parkeren-schiphol/' }];

/**
 * /waarom-lang-parkeren-schiphol/ — the trust page.
 *
 * A new page, pre-approved by the client, for the visitor who has understood
 * the offer and has not yet decided to hand over a car. That reader is not
 * short of features; they are short of specifics. So this page is almost
 * entirely detail: what physically happens to the vehicle at each stage, what
 * the security measures actually are, and what happens when the trip does not
 * go to plan.
 *
 * The slug is the query. "waarom lang parkeren schiphol" and its variants are
 * typed constantly and no page on the live site answers them in one place.
 *
 * ── Sourcing rule for this page in particular ───────────────────────────────
 * Every factual claim below is traceable to something the business already
 * publishes — the homepage FAQ, the services page, or the rates FAQ. Nothing is
 * rounded up, and where a fact is missing it is missing on the page rather than
 * filled in. This is the page a hesitant reader checks hardest; it has to
 * survive being checked.
 *
 * The two places where something is genuinely unknown are marked TODO(client)
 * and are the first two items in the handover: the insurance specifics and
 * certifications, and the damage procedure.
 */

/* ══════════════════════════════════════════════════════════════════════════
   THE PROCESS
   Expanded from the homepage's four steps. There each step is one sentence,
   because the homepage's job is to say it is simple; here each step also says
   what happens to the CAR, because this page's job is to say it is safe.

   Numbered markers are justified here and on the partner page's agenda, and
   nowhere else on the site: this is a genuine sequence and the order is
   information the reader needs.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * The client's four steps, August 2026 — and his document keeps the "Uw auto"
 * column, which is the thing that makes this page different from the homepage's
 * four steps. It is his structure as well as ours now.
 *
 * `body` and `car` take arrays, because several of his run to two or three
 * paragraphs — step 4's body is one paragraph per service plus the call, and
 * running those together loses the parallel.
 */
const PROCESS: readonly {
  title: string;
  body: readonly string[];
  car: readonly string[];
}[] = [
  {
    title: 'U reserveert eenvoudig online',
    body: [
      'Uw parkeerplaats bij Schiphol reserveert u binnen enkele minuten. Kies tussen valet parkeren en shuttle parkeren, vul uw aankomst- en retourgegevens in en selecteer eventueel aanvullende opties.',
    ],
    car: [
      'Tijdens de reservering registreren wij onder andere uw kenteken en vluchtgegevens. Aan de hand van uw vluchtgegevens kunnen wij uw vlucht volgen en rekening houden met eventuele vertragingen of een eerdere landing.',
    ],
  },
  {
    title: 'U draagt uw auto over',
    body: [
      'Kiest u voor valet parkeren bij Schiphol? Dan rijdt u rechtstreeks naar de vertrekpassage van Schiphol, waar onze chauffeur u opwacht en uw auto van u overneemt.',
      'Kiest u voor shuttle parkeren bij Schiphol? Dan rijdt u naar onze parkeerlocatie aan de Tupolevlaan in Schiphol-Rijk. Vanaf daar brengt onze shuttlebus u in ongeveer 5 tot 8 minuten naar de vertrekhal.',
    ],
    car: [
      'Voordat wij uw auto overnemen, voeren we een korte voertuigcontrole uit. Kiest u voor shuttle parkeren? Dan kunt u uw autosleutels gewoon meenemen op reis.',
    ],
  },
  {
    title: 'Uw auto wordt veilig geparkeerd',
    body: [
      'Tijdens uw reis staat uw auto op een afgesloten en gecontroleerd parkeerterrein met 24/7 camerabewaking. Wilt u uw auto liever binnen parkeren? Dan kunt u ook kiezen voor overdekt parkeren.',
    ],
    car: [
      'Bij valet parkeren wordt de rit naar de parkeerlocatie digitaal geregistreerd. Daarbij worden onder andere de gereden route en snelheid vastgelegd.',
      'Uw autosleutel wordt vervolgens veilig opgeborgen in een brandwerende sleutelkluis op ons kantoor. Ook deze locatie is voorzien van camerabewaking.',
    ],
  },
  {
    title: 'U haalt uw auto weer op',
    body: [
      'Na uw landing op Schiphol neemt u telefonisch contact met ons op.',
      'Bij valet parkeren zorgen wij ervoor dat uw auto weer voor u klaarstaat bij de luchthaven.',
      'Bij shuttle parkeren wordt u met onze shuttlebus opgehaald en teruggebracht naar de parkeerlocatie, waar uw auto op u wacht.',
    ],
    car: [
      'Wij volgen uw vluchtinformatie en houden rekening met eventuele vertragingen of een eerdere landing. Zo kunnen wij onze planning zo goed mogelijk afstemmen op uw daadwerkelijke aankomsttijd.',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SECURITY
   All six carried from the client's own copy. No figure is invented — there is
   deliberately no camera count, no retention period and no capacity number,
   because nobody has supplied them.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * His six, August 2026 — same six measures, same order, his sentences.
 *
 * One correction lands here rather than in a comment: the ride-registration
 * measure now says "Bij valet parkeren wordt iedere rit …". Ours said "Iedere rit
 * met uw auto wordt digitaal vastgelegd" without the qualifier, on a page that
 * covers both services — which read as a promise to shuttle customers whose cars
 * nobody drives. It is valet-only and now says so.
 */
const MEASURES: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Video,
    title: '24/7 camerabewaking',
    body: 'Onze parkeerlocaties zijn voorzien van camerabewaking en worden 24 uur per dag gemonitord.',
  },
  {
    icon: Lock,
    title: 'Afgesloten parkeerterreinen',
    body: 'Uw auto staat tijdens uw reis op een afgesloten en gecontroleerde parkeerlocatie. De parkeerterreinen zijn niet vrij toegankelijk voor onbevoegden.',
  },
  {
    icon: Warehouse,
    title: 'Overdekt parkeren mogelijk',
    body: 'Wilt u uw auto beschermen tegen regen, hagel en andere weersomstandigheden? Dan kunt u kiezen voor een overdekte parkeerplaats.',
  },
  {
    icon: Route,
    title: 'Digitale ritregistratie',
    body: 'Bij valet parkeren wordt iedere rit met uw auto digitaal geregistreerd. Onder andere de gereden route en snelheid worden vastgelegd. Zo is inzichtelijk wanneer en hoe uw auto is verplaatst.',
  },
  {
    icon: Flame,
    title: 'Brandwerende sleutelkluis',
    body: 'Bij valet parkeren worden uw autosleutels na het parkeren opgeborgen in een brandwerende sleutelkluis op ons kantoor. Ook het kantoor is voorzien van camerabewaking.',
  },
  {
    icon: UserCheck,
    title: 'Ervaren chauffeurs',
    body: 'Onze chauffeurs zijn gescreend en ervaren in het ophalen, parkeren en terugbrengen van voertuigen. Zij rijden dagelijks van en naar Schiphol en onze parkeerlocaties.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   THE PHOTOGRAPHS
   Four of the client's own, shot at the airport. Every vehicle in frame
   carries a Dutch yellow plate, which is the point — see config/images.ts.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * His four captions, August 2026, and they arrive in exactly the order the four
 * frames were already in — so this is a caption rewrite, not a re-ordering.
 *
 * Each is now a bold label plus a sentence, which is how his document writes
 * them. The label is what the frame IS; the sentence is what happens there.
 */
const GALLERY: readonly {
  photo: PhotoName;
  label: string;
  caption: string;
  aspect: string;
}[] = [
  {
    photo: 'crewTerminal',
    label: 'Onze chauffeur bij Schiphol',
    caption: 'Hier vindt de overdracht van uw auto plaats wanneer u kiest voor valet parkeren.',
    aspect: 'aspect-3/4',
  },
  {
    photo: 'crewHandover',
    label: 'Een snelle en duidelijke overdracht',
    caption:
      'U haalt uw bagage uit de auto, draagt de auto over aan onze chauffeur en kunt vervolgens direct door naar de vertrekhal.',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'lotShuttle',
    label: 'Onze parkeerlocatie',
    caption:
      'Hier staat uw auto tijdens uw reis geparkeerd. Onze shuttlebus rijdt vanaf deze locatie naar de vertrekhal van Schiphol.',
    aspect: 'aspect-4/3',
  },
  {
    photo: 'crewCheck',
    label: 'Controle van uw auto',
    caption:
      'Bij de overdracht voeren we een korte controle van uw auto uit voordat deze wordt geparkeerd.',
    aspect: 'aspect-3/4',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   WHAT HAPPENS IF…
   The highest-value block on the page: these four are what a reader is
   actually worried about, and three of them are answered nowhere on the live
   site.

   The first two expand the homepage's delay answer. The third is assembled
   from what the business already states about flight tracking. The fourth
   describes only what is DOCUMENTED — that the vehicle is checked at handover
   and that every ride is digitally registered — and then points at the terms
   rather than stating a liability position we have not been given.

   TODO(client): confirm the damage procedure in your own words. What we have
   written is deliberately procedural and claims nothing about liability; if
   there is an agreed process ("meld het bij de chauffeur ter plaatse, wij maken
   een schaderapport op"), say so and we will state it plainly. Being specific
   here converts better than being careful.
   ══════════════════════════════════════════════════════════════════════════ */
const SCENARIOS: readonly FaqItem[] = [
  {
    question: 'Wat gebeurt er als mijn vlucht vertraagd is?',
    answer: [
      'Wij volgen de actuele vluchtinformatie en houden rekening met eventuele vertragingen. Daardoor kunnen wij de planning van uw auto of shuttle aanpassen aan uw werkelijke aankomsttijd.',
      'Bel ons na uw landing op Schiphol. Dan weten wij dat u bent aangekomen en kunnen we de laatste stap van uw terugkomst in gang zetten.',
    ],
  },
  {
    question: 'Wat gebeurt er als mijn vlucht eerder landt?',
    answer: [
      'Ook een eerdere landing kunnen wij via de vluchtinformatie zien. Wij proberen onze planning hier zo goed mogelijk op aan te passen.',
      'Bel ons zodra u bent geland. Bij valet parkeren zorgen we er vervolgens voor dat uw auto zo snel mogelijk voor u klaarstaat.',
    ],
  },
  {
    question: 'Wat als ik later terugkom dan ik heb gereserveerd?',
    answer: [
      'Weet u dat uw reis langer duurt? Neem dan zo snel mogelijk contact met ons op.',
      'Uw auto blijft veilig op onze parkeerlocatie staan en uw reservering kan worden verlengd. Eventuele extra parkeerdagen worden aan uw reservering toegevoegd.',
      'Uw reservering wijzigen kan telefonisch, per e-mail of via het klantenportaal.',
    ],
  },
  {
    // Still procedural, still claims nothing about liability, and still ends by
    // pointing at the terms — which is what the standing TODO above asked for.
    // He has now written it in his own words, so that TODO is answered.
    question: 'Wat als ik schade aan mijn auto constateer?',
    answer: [
      'Voordat wij uw auto overnemen, voeren we een korte voertuigcontrole uit. Bij valet parkeren worden ritten met uw auto daarnaast digitaal geregistreerd, inclusief route en snelheid.',
      'Constateert u bij terugkomst schade die er bij de overdracht nog niet was? Meld dit dan direct bij de chauffeur, zodat de situatie ter plaatse kan worden vastgelegd.',
      'De voorwaarden rondom schade en aansprakelijkheid vindt u in onze algemene voorwaarden.',
    ],
  },
];

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Waarom ons"
        title="Waarom kiezen voor Lang Parkeren Schiphol?"
        subhead={`Al meer dan ${siteConfig.yearsActive} jaar vertrouwd parkeren bij Schiphol`}
        lead={[
          'Uw auto achterlaten tijdens uw reis vraagt om vertrouwen. Daarom vinden wij het belangrijk dat u precies weet waar u aan toe bent. Van het moment van reserveren tot het moment waarop u uw auto na uw reis weer terugkrijgt.',
          'Bij Lang Parkeren Schiphol kiest u voor valet parkeren of shuttle parkeren bij Schiphol. Uw auto wordt tijdens uw reis geparkeerd op een afgesloten en bewaakte parkeerlocatie.',
        ]}
        photo="crewTerminal"
        objectPosition="object-[center_38%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/" size="lg">
          Reserveer nu
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        {/* ⚠ His label, and it is 54 characters — by far the longest button on
            the site, against "Wat als er iets misgaat?" at 24. Kept as written
            rather than trimmed, because it is client-approved copy; flagged in
            the handover as the one label worth shortening if he is willing.

            `whitespace-normal` is REQUIRED here, not cosmetic. <Button>'s base
            sets `whitespace-nowrap`, which is right for every other label on the
            site and wrong for this one: at 375px the button rendered 463px wide
            and pushed the whole document 108px past the viewport — a horizontal
            scrollbar on the page, measured, not guessed. Allowing it to wrap
            gives a two-line button on a phone and changes nothing at lg, where
            it still fits on one line. `text-center` because a wrapped label in a
            `justify-center` flex would otherwise set its second line ragged.
            twMerge makes the override replace the base utility rather than sit
            beside it — see lib/cn.ts. */}
        <Button
          href="#wat-als"
          variant="outline"
          size="lg"
          className="text-center whitespace-normal"
        >
          Bekijk wat er gebeurt als iets anders loopt dan gepland
        </Button>
      </PageHero>

      {/* ══════════ THE PROCESS ══════════ */}
      <Section spacing="lg" aria-labelledby="proces-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Van reservering tot terugkomst</Eyebrow>
              <h2 id="proces-heading" className="text-display-lg mt-5 max-w-[18ch]">
                Zo werkt parkeren bij Schiphol
              </h2>
            </div>
            <p className="text-muted max-w-[36ch] lg:pb-2 lg:text-right">
              Van uw reservering tot uw terugkomst: in vier eenvoudige stappen ziet u precies hoe
              onze parkeerservice werkt en wat er met uw auto gebeurt.
            </p>
          </Reveal>

          <ol className="mt-14 lg:mt-20">
            {PROCESS.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 60}
                className="border-line grid gap-x-8 gap-y-4 border-t py-9 lg:grid-cols-[auto_5fr_6fr] lg:gap-x-12 lg:py-11"
              >
                {/* The numeral is decorative — the order is already carried by
                    the list and by the "Stap n:" in the heading. */}
                <p aria-hidden className="ghost-numeral text-numeral text-5xl lg:text-6xl">
                  {String(index + 1).padStart(2, '0')}
                </p>

                <div>
                  <h3 className="text-display-sm text-heading">
                    <span className="sr-only">Stap {index + 1}: </span>
                    {step.title}
                  </h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {step.body.map((paragraph) => (
                      <p key={paragraph} className="text-muted max-w-[44ch] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* The car column. Set apart with a rule and the accent label,
                    because it is the reason this page exists — the homepage
                    already says the four steps are easy. */}
                <div className="border-line lg:border-l lg:pl-12">
                  {/* text-brand, not text-accent. valet-600 at 12px on the canvas is
                      2.99:1 — it fails AA, and it was failing before this pass
                      too; the ramp's own note in globals.css restricts it to
                      >=24px display text, icons and non-text borders. navy-600
                      is 6.29:1 here. */}
                  <p className="eyebrow text-brand">Uw auto</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {step.car.map((paragraph) => (
                      <p key={paragraph} className="text-body max-w-[44ch] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ══════════ SECURITY & INSURANCE ══════════ */}
      {/* Was navy. Lightened with the rest of the site — client, August 2026:
          "nergens donker". The section keeps its weight through width and
          through the six measures it lists, not through its background.
          Contrast on surface: navy-950 headings 16.90:1, ink-700 body 9.58:1,
          ink-500 supporting 5.48:1. */}
      <Section tone="surface" spacing="lg" aria-labelledby="beveiliging-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Veilig lang parkeren bij Schiphol</Eyebrow>
              <h2 id="beveiliging-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Zo zorgen wij goed voor uw auto
              </h2>
              <p className="text-body mt-6 max-w-[42ch] leading-relaxed">
                Uw auto veilig achterlaten tijdens uw vakantie of zakenreis vinden wij minstens zo
                belangrijk als u. Daarom nemen wij verschillende maatregelen om uw auto tijdens de
                parkeerperiode goed te beschermen.
              </p>
            </Reveal>

            <Stagger as="ul" className="divide-line border-line divide-y border-y">
              {MEASURES.map((measure) => (
                <div key={measure.title} className="flex items-start gap-5 py-6">
                  <measure.icon
                    className="text-accent mt-0.5 size-6 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold">{measure.title}</h3>
                    <p className="text-muted mt-2 max-w-[52ch] text-sm leading-relaxed">
                      {measure.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>

          {/*
            ── INSURANCE: A DELIBERATE GAP ────────────────────────────────────
            TODO(client): THIS IS THE SINGLE MOST IMPORTANT THING STILL MISSING
            FROM THIS PAGE.

            We need, in your words:
              · which insurance covers a customer's car while it is with you,
                and what it covers
              · the insurer and the policy type, if you are willing to name them
              · any certification, keurmerk or branch membership you hold
                (e.g. Q-Park/BOVAG-style schemes, ISO, a parking trade body)

            Nothing is written here in the meantime, because insurance is the
            one subject on this page where a plausible-sounding sentence is a
            liability rather than a gap. What is below points at the terms and
            asserts nothing beyond their existence.

            When you send the specifics, this becomes the strongest block on the
            page: "verzekerd tot € X via Y" answers the question the reader is
            actually asking, and no competitor on this keyword states it.
          */}
          <Reveal className="border-line mt-16 border-t pt-10">
            <h3 className="text-heading text-lg font-semibold">Verzekering en aansprakelijkheid</h3>
            {/* His two paragraphs. The insurance TODO above is NOT closed by
                them — he still names no insurer, policy or certification, and
                this block still asserts nothing beyond the terms' existence. */}
            <p className="text-body mt-4 max-w-[68ch] leading-relaxed">
              Wat er tijdens de parkeerperiode precies geldt op het gebied van aansprakelijkheid en
              verzekering, hebben wij vastgelegd in onze algemene voorwaarden.
            </p>
            <p className="text-body mt-4 max-w-[68ch] leading-relaxed">
              Heeft u vóór uw reservering een specifieke vraag over uw auto, verzekering of
              aansprakelijkheid? Neem dan gerust contact met ons op. We leggen het u liever
              duidelijk uit dan dat u met vragen op reis gaat.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={termsUrl} variant="outline">
                Lees onze algemene voorwaarden
              </Button>
              <Button href="/contact/" variant="outline">
                Neem contact met ons op
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ THE TEAM AND THE CARS ══════════ */}
      <Section tone="surface" spacing="lg" aria-labelledby="team-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Onze mensen en onze parkeerlocatie</Eyebrow>
            <h2 id="team-heading" className="text-display-lg mt-5">
              Bekijk waar uw auto wordt geparkeerd
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Wij vinden dat u moet kunnen zien aan wie u uw auto toevertrouwt. Daarom gebruiken we
              hier geen algemene stockfoto&#39;s van buitenlandse parkeerterreinen.
            </p>
            <p className="text-muted mt-4 leading-relaxed">
              Dit zijn onze eigen medewerkers, onze shuttlebus en de parkeerlocatie die wij
              gebruiken voor lang parkeren bij Schiphol.
            </p>
          </Reveal>

          {/* A masonry-ish grid rather than four equal thumbnails: two portrait
              frames and two landscape, so the block reads as a set of
              photographs rather than as a gallery widget. */}
          <Stagger
            as="ul"
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
          >
            {GALLERY.map((item, index) => (
              <figure key={item.photo} className={index % 2 === 1 ? 'lg:mt-12' : undefined}>
                <div className={`shadow-photo relative overflow-hidden rounded-xl ${item.aspect}`}>
                  <Photo
                    name={item.photo}
                    fill
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="object-cover object-center"
                  />
                </div>
                <figcaption className="mt-4 text-sm leading-relaxed">
                  <span className="text-heading block font-semibold">{item.label}</span>
                  <span className="text-muted mt-1 block">{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ══════════ WHAT HAPPENS IF… ══════════ */}
      <Section id="wat-als" spacing="lg" aria-labelledby="wat-als-heading" className="scroll-mt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Als uw reis anders loopt dan gepland</Eyebrow>
              <h2 id="wat-als-heading" className="text-display-lg mt-5 max-w-[14ch]">
                Wat gebeurt er als…?
              </h2>
              <p className="text-muted mt-6 max-w-[40ch] leading-relaxed">
                Een vlucht kan vertraagd zijn, eerder landen of uw reis kan onverwacht langer duren.
                Daarom proberen wij onze parkeerservice zo flexibel mogelijk aan te laten sluiten op
                uw reis.
              </p>
              <p className="text-muted mt-4 max-w-[40ch] leading-relaxed">
                Hieronder beantwoorden we een aantal veelgestelde vragen.
              </p>

              <div className="border-line mt-10 border-t pt-8">
                <p className="text-heading text-base font-semibold">
                  Staat uw situatie er niet tussen?
                </p>
                <p className="text-muted mt-2 max-w-[36ch] text-sm leading-relaxed">
                  Neem dan gerust contact met ons op. Bij vragen over een lopende reservering kunt u
                  ons het beste bellen.
                </p>
                <a
                  href={siteConfig.phone.href}
                  className="text-heading hover:text-brand ease-settle mt-3 inline-flex min-h-11 items-center gap-3 font-medium transition-colors duration-(--duration-micro)"
                >
                  <span className="sr-only">Bel ons: </span>
                  <span className="numeric">{siteConfig.phone.display}</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <Accordion items={SCENARIOS} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* His closing block gives no H2, only a heading and two paragraphs, so no
          `subhead` is passed here.
          ⚠ His five reassurances are written with a literal "✓ " in front of each
          one. Stripped: the strip draws no marks of its own, so keeping them
          would put a tick in running text — and on the pages where the same list
          appears without ticks it would be inconsistent. The words are his. */}
      <ClosingCta
        heading="Lang parkeren bij Schiphol met een vertrouwd gevoel"
        lead={[
          `Al meer dan ${siteConfig.yearsActive} jaar helpen wij reizigers met parkeren bij Schiphol. Of u nu kiest voor het gemak van valet parkeren of liever uw autosleutels meeneemt met shuttle parkeren: wij zorgen ervoor dat uw parkeerplaats geregeld is terwijl u op reis bent.`,
          'Reserveer uw parkeerplaats eenvoudig online en begin uw reis zonder onnodig gedoe.',
        ]}
        reassurances={[
          'Flexibel annuleren tot 24 uur voor aankomst met annuleringsdekking',
          'Binnen 2 minuten online gereserveerd',
          '24/7 bewaakte parkeerlocatie',
          'Keuze uit valet en shuttle parkeren',
          'Overdekt parkeren mogelijk',
        ]}
        photo="terminalDeparture"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* Emitted from the same array the accordion renders. These four answers
          exist nowhere else on the site, so this is a genuinely new rich-result
          surface rather than a duplicate of the homepage FAQ. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(SCENARIOS)) }}
      />
    </>
  );
}
