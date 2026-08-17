import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  FileText,
  Gauge,
  MapPin,
  Route,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { PageHero } from '@/components/sections/PageHero';
import { AppScreenshot } from '@/components/sections/AppScreenshot';
import { Timeline, type TimelineStep } from '@/components/sections/Timeline';
import { FaqSection } from '@/components/sections/Faq';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import type { PhotoName } from '@/config/images';

export const metadata = createMetadata('rideRegistration');

const PATH = '/digitale-ritregistratie/';
const CRUMBS = [{ name: 'Digitale ritregistratie', path: PATH }];

/**
 * /digitale-ritregistratie/
 *
 * Valet-only. The page that answers the question the valet page raises and
 * cannot fully answer in a paragraph: what happens to my car while somebody
 * else is driving it.
 *
 * ── THE COPY ON THIS PAGE IS DELIBERATELY UNDERPOWERED. DO NOT STRENGTHEN IT ──
 * All of it is the client's, and it is reproduced verbatim. It is worded to build
 * trust WITHOUT making a legal or technical evidentiary claim, and that restraint
 * is the entire point.
 *
 * Specifically, the speed copy says the speed is registered so that the company
 * can check whether its drivers follow internal guidelines. It does NOT say the
 * data proves anything, that it is retained for any period, or that it would
 * settle a dispute. Every one of those would be a promise about a system whose
 * retention and accuracy rules we have not been told.
 *
 * His August 2026 copy holds that line and goes one step further in the
 * customer's favour, which is worth noting because it looks like an omission:
 * where our FAQ said the data is "voor intern gebruik" and "niet met derden
 * gedeeld", his says the customer may ASK about a specific ride and we will check
 * the available data. That is a weaker claim about secrecy and a stronger one
 * about access, and both are his to make.
 *
 * If a future edit here starts a sentence with "altijd", "volledig aantoonbaar"
 * or "u kunt opvragen", it is almost certainly overclaiming.
 *
 * TODO(client): retention period and the request procedure are still unstated. If
 * you want this page to promise a customer access to their own ride data rather
 * than "neem contact op en wij controleren het", tell us those two things.
 *
 * ── August 2026: three sections are new, and two old ones are ORPHANED ───────
 * His document specifies: the hero, "Alleen bij valet parking", the six-step
 * sequence, "Waarom registreren wij iedere valetrit?", "Wat registreren wij?",
 * "En bij shuttle parkeren?", the photographs, a nine-answer FAQ, and the close.
 *
 * ⚠ It contains NO copy for the two <AppScreenshot> sections ("Iedere reservering
 * digitaal vastgelegd" and "Snelheidsregistratie tijdens iedere rit"). They are
 * KEPT, with their existing copy, because they carry the only screenshots of the
 * actual system on the whole site — deleting them would remove the page's only
 * evidence to solve a problem nobody reported. But his structure now says some of
 * the same things they say, so the page repeats itself around the speed claim in
 * particular.
 * TODO(client): confirm whether you want these two screenshot blocks kept. If the
 * document was meant as the complete page, they should go; if the screenshots are
 * worth keeping, the speed block wants a sentence that does not duplicate "De
 * snelheid wordt geregistreerd" two sections below it.
 */

/* ══════════════════════════════════════════════════════════════════════════
   ONLY FOR VALET
   New. The scope limit, stated before anything else — because the single most
   likely misreading of this page is a shuttle customer thinking we drive their
   car and track it.
   ══════════════════════════════════════════════════════════════════════════ */
const SCOPE: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ArrowRight,
    title: 'Heenrit geregistreerd',
    body: 'De rit vanaf Schiphol naar onze parkeerlocatie wordt digitaal vastgelegd.',
  },
  {
    icon: Route,
    title: 'Terugrit geregistreerd',
    body: 'Na uw reis wordt ook de rit vanaf onze parkeerlocatie terug naar Schiphol geregistreerd.',
  },
  {
    icon: MapPin,
    title: 'Route vastgelegd',
    body: 'We registreren welke route onze chauffeur met uw auto heeft gereden.',
  },
  {
    icon: Gauge,
    title: 'Snelheid vastgelegd',
    body: 'Tijdens de volledige rit wordt de gereden snelheid digitaal geregistreerd.',
  },
  {
    icon: Timer,
    title: 'Ritduur vastgelegd',
    body: 'We registreren wanneer de rit begint, wanneer deze eindigt en hoe lang de rit heeft geduurd.',
  },
];

/** The client's six steps, August 2026 — his headings, without the "Stap n:"
 *  prefix <Timeline> already emits. */
const STEPS: readonly TimelineStep[] = [
  {
    title: 'Overdracht bij Schiphol',
    body: 'U rijdt rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur staat op het afgesproken tijdstip voor u klaar. Voordat wij uw auto overnemen, controleren we samen kort de staat van uw auto. Daarna draagt u uw autosleutel over en kunt u met uw bagage direct doorlopen naar de vertrekhal.',
  },
  {
    title: 'De ritregistratie wordt gestart',
    body: 'Zodra onze chauffeur met uw auto vertrekt, wordt de valetrit in ons systeem gestart. Vanaf dat moment wordt de rit digitaal geregistreerd.',
  },
  {
    title: 'De gereden route wordt vastgelegd',
    body: 'Tijdens de rit naar onze parkeerlocatie wordt de gereden route digitaal geregistreerd. Zo kunnen we achteraf controleren welke route met uw auto is gereden.',
  },
  {
    title: 'De snelheid wordt geregistreerd',
    body: 'Ook de gereden snelheid wordt tijdens de volledige valetrit vastgelegd. Hiermee kunnen wij controleren hoe er met uw auto is gereden en of onze chauffeurs zich aan onze interne richtlijnen houden.',
  },
  {
    title: 'Uw auto wordt geparkeerd',
    body: 'Na aankomst op onze bewaakte parkeerlocatie wordt uw auto geparkeerd en wordt de rit afgesloten. Uw autosleutel wordt vervolgens veilig opgeborgen in een brandwerende sleutelkluis op ons kantoor.',
  },
  {
    title: 'Ook de terugrit wordt geregistreerd',
    body: 'Na uw terugkomst brengen wij uw auto weer naar Schiphol. Ook tijdens deze valetrit worden de route, snelheid en ritduur digitaal geregistreerd. Pas wanneer uw auto weer bij Schiphol is aangekomen, wordt de terugrit afgesloten.',
  },
];

/**
 * "Waarom registreren wij iedere valetrit?" — four now, not five.
 *
 * They were five bare phrases ("Meer veiligheid", "Interne kwaliteitscontrole")
 * rendered as a tick list. His four each carry a sentence explaining what the
 * heading actually means, which is the difference between a claim and a label.
 */
const REASONS: readonly { title: string; body: string }[] = [
  {
    title: 'Meer transparantie',
    body: 'Iedere valetrit wordt digitaal geregistreerd. Zo is achteraf inzichtelijk welke route met uw auto is gereden.',
  },
  {
    title: 'Controle op snelheid',
    body: 'De gereden snelheid wordt tijdens de volledige rit vastgelegd.',
  },
  {
    title: 'Controle op onze chauffeurs',
    body: 'De geregistreerde ritgegevens helpen ons controleren of onze chauffeurs zich aan onze interne richtlijnen houden.',
  },
  {
    title: 'Extra zekerheid',
    body: 'Heeft u achteraf een vraag over een rit met uw auto? Dan kunnen wij de geregistreerde ritgegevens controleren.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   WHAT IS RECORDED
   New. The list this page most needed: it previously described registration in
   prose and never enumerated the fields, which is the first thing a privacy-
   minded reader looks for.

   Note the fifth item and the note under the list — both his. Together they are
   the page's only statement about what is NOT collected, and that is the half
   that makes the rest of it reassuring rather than alarming.
   ══════════════════════════════════════════════════════════════════════════ */
const RECORDED: readonly { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MapPin,
    title: 'Gereden route',
    body: 'We registreren de route die onze chauffeur met uw auto rijdt tussen Schiphol en onze parkeerlocatie.',
  },
  {
    icon: Gauge,
    title: 'Gereden snelheid',
    body: 'Tijdens de valetrit wordt de gereden snelheid digitaal vastgelegd.',
  },
  {
    icon: Timer,
    title: 'Ritduur',
    body: 'We registreren het begin- en eindtijdstip van de rit en daarmee ook de totale ritduur.',
  },
  {
    icon: Clock,
    title: 'Ritmoment',
    body: 'We kunnen achteraf zien wanneer de heen- en terugrit met uw auto hebben plaatsgevonden.',
  },
  {
    icon: FileText,
    title: 'Reserverings- en voertuiggegevens',
    body: 'De rit wordt gekoppeld aan de gegevens die nodig zijn om uw valetreservering correct uit te voeren.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   AND WITH SHUTTLE?
   New, and the section that stops this page frightening the 90% of customers
   it does not apply to. Two columns, stated as a contrast rather than as a
   ranking — neither is the better service here, they are simply different in
   whether anyone else drives the car.
   ══════════════════════════════════════════════════════════════════════════ */
const COMPARISON: readonly {
  name: string;
  points: readonly string[];
  cta: string;
  href: string;
}[] = [
  {
    name: 'Shuttle parkeren',
    points: [
      'U parkeert uw auto zelf',
      'U neemt uw autosleutels mee op reis',
      'Wij rijden niet in uw auto',
      'Daarom is ritregistratie niet van toepassing',
      'Gratis shuttle van en naar Schiphol',
    ],
    cta: 'Bekijk shuttle parkeren',
    href: '/shuttle-parkeren-schiphol/',
  },
  {
    name: 'Valet parking',
    points: [
      'U rijdt rechtstreeks naar Schiphol',
      'Onze chauffeur neemt uw auto over',
      'Wij rijden uw auto naar onze parkeerlocatie',
      'Iedere heen- en terugrit wordt digitaal geregistreerd',
      'Route, snelheid en ritduur worden vastgelegd',
    ],
    cta: 'Bekijk valet parking',
    href: '/valet-parking-schiphol/',
  },
];

/**
 * The photographs, now captioned — his four labels and sentences.
 *
 * ── Why these four frames ───────────────────────────────────────────────────
 * The section used to run three uncaptioned frames in a deliberately uneven
 * one-tall-plus-two-stacked arrangement. His copy names FOUR moments, so a fourth
 * frame is added (`lotShuttle`, for "Veilig geparkeerd") and the block adopts the
 * offset four-up the trust page already uses — which is still not a plain grid of
 * interchangeable tiles, the thing the old arrangement existed to avoid.
 *
 * `crewPaperwork` is kept and takes "Rit naar onze parkeerlocatie": it is the
 * only frame in the library showing a chauffeur holding a reservation, i.e. the
 * administrative half of the job, which is what this page is about. It arrived
 * under a `ChatGPT Image …` filename and is nevertheless a real photograph — the
 * client's own frame with the crew jacket recoloured from blue to the correct
 * orange. That is retouching, not generation, and the distinction is what makes
 * it admissible on a page whose entire purpose is authenticity. The reasoning and
 * the inspection are recorded at its manifest entry; read that note before adding
 * any other file with that filename shape here.
 *
 * ⚠ There is still no sleutelkluis photograph in the library, and his "Veilig
 * geparkeerd" caption ends on the brandwerende sleutelkluis. `lotShuttle` shows
 * the lot but not the safe, so that half of the caption is unillustrated rather
 * than substituted.
 * TODO(client): a frame of the brandwerende kluis on kantoor is still the single
 * most useful photograph you could send for this page.
 */
const GALLERY: readonly {
  photo: PhotoName;
  label: string;
  caption: string;
  aspect: string;
  objectPosition: string;
}[] = [
  {
    photo: 'crewTerminal',
    label: 'Overdracht bij Schiphol',
    caption: 'Onze chauffeur neemt uw auto bij de vertrekhal van Schiphol van u over.',
    aspect: 'aspect-3/4',
    objectPosition: 'object-[center_30%]',
  },
  {
    photo: 'crewCheck',
    label: 'Controle van uw auto',
    caption: 'Voor vertrek controleren we samen kort de staat van uw auto.',
    aspect: 'aspect-4/3',
    objectPosition: 'object-center',
  },
  {
    photo: 'crewPaperwork',
    label: 'Rit naar onze parkeerlocatie',
    caption:
      'Onze chauffeur rijdt uw auto naar onze bewaakte parkeerlocatie. Deze volledige rit wordt digitaal geregistreerd.',
    aspect: 'aspect-3/4',
    // 3:2 frame into a 3:4 slot: a centred crop keeps the empty tarmac on the
    // left and pushes the shuttle out of the right edge. At 62% the chauffeur
    // sits on the vertical third with the bus behind him and the yellow plate
    // still in shot.
    objectPosition: 'object-[62%_50%]',
  },
  {
    photo: 'lotShuttle',
    label: 'Veilig geparkeerd',
    caption:
      'Na aankomst wordt uw auto geparkeerd en uw autosleutel veilig opgeborgen in onze brandwerende sleutelkluis.',
    aspect: 'aspect-4/3',
    objectPosition: 'object-[center_35%]',
  },
];

/** His nine, August 2026, against the five that were here. */
const FAQS: readonly FaqItem[] = [
  {
    question: 'Geldt digitale ritregistratie voor iedere reservering?',
    answer: [
      'Nee.',
      'Digitale ritregistratie geldt uitsluitend voor valet parking.',
      'Bij valet parking rijdt onze chauffeur uw auto van Schiphol naar onze parkeerlocatie en na uw reis weer terug. Beide ritten worden digitaal geregistreerd.',
      'Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutels mee op reis. Onze chauffeurs rijden dan niet in uw auto en daarom is ritregistratie niet van toepassing.',
    ],
  },
  {
    question: 'Wordt iedere valetrit geregistreerd?',
    answer: [
      'Ja.',
      'Zowel de rit van Schiphol naar onze parkeerlocatie als de terugrit naar Schiphol wordt digitaal geregistreerd.',
    ],
  },
  {
    question: 'Wat wordt er tijdens een valetrit geregistreerd?',
    answer: [
      'We registreren onder andere de gereden route, de gereden snelheid, het begin- en eindtijdstip en de duur van de rit.',
    ],
  },
  {
    question: 'Wordt mijn locatie tijdens mijn vakantie gevolgd?',
    answer: [
      'Nee.',
      'Wij volgen niet waar u zich tijdens uw reis bevindt en registreren niet de locatie van uw telefoon.',
      'De digitale ritregistratie heeft uitsluitend betrekking op de rit die onze chauffeur met uw auto uitvoert.',
    ],
  },
  {
    question: 'Wordt de snelheid van mijn auto geregistreerd?',
    answer: [
      'Ja.',
      'Tijdens iedere valetrit wordt de gereden snelheid digitaal vastgelegd. Hiermee kunnen wij achteraf controleren hoe er met uw auto is gereden.',
    ],
  },
  {
    question: 'Wordt de gereden route geregistreerd?',
    answer: [
      'Ja.',
      'Zowel tijdens de heenrit naar onze parkeerlocatie als tijdens de terugrit naar Schiphol wordt de gereden route digitaal vastgelegd.',
    ],
  },
  {
    question: 'Waarom registreren jullie valetritten?',
    answer: [
      'Omdat u uw auto tijdelijk aan onze chauffeur toevertrouwt.',
      'Wij vinden dat u erop moet kunnen vertrouwen dat er zorgvuldig met uw auto wordt omgegaan. Met digitale ritregistratie hebben we extra inzicht en controle tijdens de momenten waarop onze chauffeurs in uw auto rijden.',
    ],
  },
  {
    question: 'Wie kan de ritgegevens bekijken?',
    answer: [
      'De ritgegevens worden gebruikt voor de uitvoering en controle van onze valetservice.',
      'Heeft u een specifieke vraag over een rit met uw auto? Neem dan contact op met onze klantenservice. Wij kunnen de beschikbare ritgegevens vervolgens controleren.',
    ],
  },
  {
    question: 'Kan ik mijn ritgegevens opvragen?',
    answer: [
      'Heeft u na uw parkeerperiode een specifieke vraag over een rit met uw auto? Neem dan contact op met onze klantenservice.',
      'Wij kunnen de beschikbare gegevens controleren en uw vraag onderzoeken.',
    ],
  },
];

export default function RideRegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Digitale ritregistratie"
        title="Digitale ritregistratie bij valet parking"
        subhead="Iedere valetrit digitaal geregistreerd"
        // ⚠ Four paragraphs, which is the longest hero lead on the site by some
        // way — this band is roughly twice the height of the other page heroes at
        // lg. All four are his, and the fourth is load-bearing: it is the only
        // place above the fold that says the whole page does not apply to shuttle
        // customers.
        lead={[
          'Wanneer u kiest voor valet parking bij Schiphol, geeft u uw auto en autosleutel tijdelijk aan onze chauffeur. Wij begrijpen dat dit vertrouwen vraagt.',
          'Daarom wordt iedere rit die onze chauffeur met uw auto maakt digitaal geregistreerd. We registreren onder andere de gereden route, snelheid en ritduur — zowel tijdens de heenrit naar onze parkeerlocatie als tijdens de terugrit naar Schiphol.',
          'Zo kunnen wij achteraf precies controleren wanneer, waar en hoe er met uw auto is gereden.',
          'Digitale ritregistratie geldt uitsluitend voor valet parking. Bij shuttle parkeren parkeert u uw auto zelf en neemt u uw autosleutels mee op reis. Er wordt dan niet door onze chauffeurs in uw auto gereden.',
        ]}
        photo="crewHandover"
        objectPosition="object-[center_35%]"
        crumbs={CRUMBS}
      >
        <Button href="/reservering/?service=valet" size="lg">
          Reserveer valet parking
          <ArrowRight data-arrow className="size-4" aria-hidden />
        </Button>
        <Button href="/valet-parking-schiphol/" variant="outline" size="lg">
          Meer over valet parkeren
        </Button>
      </PageHero>

      {/* ---------- Only for valet ----------
          NEW, August 2026. */}
      <Section tone="surface" spacing="lg" aria-labelledby="scope-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Alleen bij valet parking</Eyebrow>
              <h2 id="scope-heading" className="text-display-md mt-5 max-w-[18ch]">
                Extra controle wanneer wij in uw auto rijden
              </h2>
              <p className="text-body mt-6 max-w-[46ch] leading-relaxed">
                Bij valet parking rijdt u rechtstreeks naar de vertrekhal van Schiphol. Daar neemt
                onze chauffeur uw auto van u over.
              </p>
              <p className="text-body mt-4 max-w-[46ch] leading-relaxed">
                Vanaf het moment dat onze chauffeur met uw auto vertrekt, wordt de rit digitaal
                geregistreerd.
              </p>
            </Reveal>

            <Stagger as="ul" className="divide-line border-line divide-y border-y">
              {SCOPE.map((item) => (
                <div key={item.title} className="flex items-start gap-5 py-5">
                  <item.icon
                    className="text-accent mt-0.5 size-5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold">{item.title}</h3>
                    <p className="text-muted mt-1.5 max-w-[52ch] text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------- Reservation data ----------
          ⚠ ORPHANED BY THE AUGUST 2026 COPY — his document has no text for this
          section. Kept with its existing copy because the screenshot is real
          product evidence and nothing else on the site shows it. See the note at
          the top of this file. */}
      <Section spacing="lg" aria-labelledby="gegevens-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Eyebrow rule>Voor de rit</Eyebrow>
              <h2 id="gegevens-heading" className="text-display-md mt-5 max-w-[18ch]">
                Iedere reservering digitaal vastgelegd
              </h2>
              <p className="text-body mt-6 max-w-[54ch] leading-relaxed">
                Zodra uw reservering actief wordt, ontvangt onze chauffeur alle benodigde gegevens
                digitaal. Van voertuiggegevens tot vluchtinformatie: alles wordt veilig verwerkt
                zodat fouten worden voorkomen.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <AppScreenshot name="appReservation" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Speed registration ----------
          ⚠ ALSO ORPHANED — see above. Mirrored, so the two screenshot sections do
          not stack into the same row twice. */}
      <Section tone="surface" spacing="lg" aria-labelledby="snelheid-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <Eyebrow rule>Tijdens de rit</Eyebrow>
              <h2 id="snelheid-heading" className="text-display-md mt-5 max-w-[18ch]">
                Snelheidsregistratie tijdens iedere rit
              </h2>
              {/* Verbatim, and deliberately not stronger than this. See the
                  note at the top of this file before editing a word of it. */}
              <p className="text-body mt-6 max-w-[54ch] leading-relaxed">
                Tijdens de rit wordt de gereden snelheid digitaal geregistreerd. Hierdoor kunnen wij
                controleren dat iedere chauffeur zich aan de interne veiligheidsrichtlijnen houdt.
              </p>
            </Reveal>

            <Reveal delay={80} className="lg:order-1">
              <AppScreenshot name="appRideRegistration" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- The six steps ---------- */}
      <Section spacing="lg" aria-labelledby="stappen-heading">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <Eyebrow rule>Van overdracht tot parkeerlocatie</Eyebrow>
              <h2 id="stappen-heading" className="text-display-lg mt-5 max-w-[16ch]">
                Zo werkt onze digitale ritregistratie
              </h2>
            </div>
            <div className="lg:max-w-[34ch] lg:pb-2 lg:text-right">
              <p className="text-muted text-base">
                Digitale ritregistratie is onderdeel van onze valet parking service bij Schiphol.
                Vanaf de overdracht bij de vertrekhal tot het parkeren van uw auto leggen we de rit
                digitaal vast.
              </p>
              <p className="text-muted mt-3 text-base">
                Bij uw terugkomst gebeurt hetzelfde tijdens de rit terug naar Schiphol.
              </p>
            </div>
          </Reveal>

          <Timeline steps={STEPS} />
        </Container>
      </Section>

      {/* ---------- Why ----------
          The accent wash, used once on this page. Contrast on valet-100:
          navy-950 heading 14.90:1 AAA, ink-700 body 8.44:1 AAA. */}
      <Section tone="accent" spacing="md" aria-labelledby="waarom-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              <h2 id="waarom-heading" className="text-display-md max-w-[18ch]">
                Waarom registreren wij iedere valetrit?
              </h2>
              <p className="text-heading mt-5 text-lg font-medium">
                Omdat u moet kunnen vertrouwen op degene die in uw auto rijdt
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <p className="text-body max-w-[46ch] leading-relaxed">
                  Bij valet parking geeft u uw auto tijdelijk uit handen. U moet erop kunnen
                  vertrouwen dat daar zorgvuldig mee wordt omgegaan.
                </p>
                <p className="text-body max-w-[46ch] leading-relaxed">
                  Daarom vinden wij alleen een veilige parkeerlocatie niet genoeg. We willen ook
                  inzicht hebben in wat er gebeurt tijdens de momenten waarop een chauffeur
                  daadwerkelijk in uw auto rijdt.
                </p>
                <p className="text-body max-w-[46ch] leading-relaxed">
                  Met digitale ritregistratie kunnen wij achteraf controleren wanneer, waar en hoe
                  uw auto tussen Schiphol en onze parkeerlocatie is verplaatst.
                </p>
              </div>
            </Reveal>

            {/* Each of his four now has a body, so the tick list this used to be
                becomes a titled list. divide-valet-200 because it sits on the
                accent wash. */}
            {/* Children are <div>: <Stagger as="ul"> supplies the <li> itself. */}
            <Stagger as="ul" className="divide-valet-200 divide-y">
              {REASONS.map((reason) => (
                <div key={reason.title} className="flex items-start gap-4 py-5">
                  <Check
                    className="text-accent-hover mt-1 size-5 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-heading text-base font-semibold sm:text-lg">
                      {reason.title}
                    </h3>
                    <p className="text-body mt-1.5 max-w-[52ch] text-sm leading-relaxed">
                      {reason.body}
                    </p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------- What is recorded ----------
          NEW, August 2026. */}
      <Section spacing="lg" aria-labelledby="gegevens-lijst-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow rule>Wat registreren wij bij valet parking?</Eyebrow>
              <h2 id="gegevens-lijst-heading" className="text-display-md mt-5 max-w-[18ch]">
                De belangrijkste gegevens van iedere valetrit
              </h2>
              <p className="text-body mt-6 max-w-[46ch] leading-relaxed">
                Onze digitale ritregistratie heeft uitsluitend betrekking op ritten die onze
                chauffeurs met auto&#39;s van valetklanten uitvoeren.
              </p>
              <p className="text-body mt-4 max-w-[46ch] leading-relaxed">
                Tijdens deze ritten registreren we:
              </p>
            </Reveal>

            <div>
              <Stagger as="ul" className="divide-line border-line divide-y border-y">
                {RECORDED.map((item) => (
                  <div key={item.title} className="flex items-start gap-5 py-5">
                    <item.icon
                      className="text-accent mt-0.5 size-5 shrink-0"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-heading text-base font-semibold">{item.title}</h3>
                      <p className="text-muted mt-1.5 max-w-[52ch] text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </Stagger>

              {/* His note, set in bold in the document. It is the only statement
                  on the page about what is NOT tracked, so it gets its own
                  weight rather than becoming a sixth row. */}
              <Reveal>
                <p className="text-heading mt-8 max-w-[62ch] text-base font-semibold">
                  De ritregistratie volgt uw auto uitsluitend tijdens de ritten die onze chauffeur
                  uitvoert. Wij volgen niet de locatie van uw telefoon of uw locatie tijdens uw
                  reis.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- And with shuttle? ----------
          NEW, August 2026. */}
      <Section tone="surface" spacing="lg" aria-labelledby="shuttle-heading">
        <Container>
          <Reveal className="max-w-[52ch]">
            <Eyebrow rule>En bij shuttle parkeren?</Eyebrow>
            <h2 id="shuttle-heading" className="text-display-lg mt-5">
              Geen ritregistratie nodig: u houdt zelf uw autosleutel
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body leading-relaxed">
                Digitale ritregistratie geldt niet voor shuttle parkeren.
              </p>
              <p className="text-body leading-relaxed">Daar is een eenvoudige reden voor.</p>
              <p className="text-body leading-relaxed">
                Bij shuttle parkeren rijdt u zelf naar onze parkeerlocatie in Schiphol-Rijk. U
                parkeert uw auto zelf en neemt uw autosleutels mee op reis.
              </p>
              <p className="text-body leading-relaxed">
                Tijdens uw parkeerperiode rijdt er dus geen chauffeur van Lang Parkeren Schiphol in
                uw auto.
              </p>
              <p className="text-body leading-relaxed">
                Uw auto blijft staan op de parkeerplaats waar u deze zelf heeft geparkeerd totdat u
                na uw reis terugkomt.
              </p>
            </div>
          </Reveal>

          <div className="divide-line border-line mt-12 grid divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {COMPARISON.map((column, index) => (
              <Reveal
                key={column.name}
                delay={index * 80}
                className={index === 0 ? 'py-10 lg:pr-14' : 'py-10 lg:pl-14'}
              >
                <h3 className="text-display-sm text-heading">{column.name}</h3>

                <ul className="divide-line border-line mt-6 divide-y border-y">
                  {column.points.map((point) => (
                    <li key={point} className="flex items-start gap-3.5 py-3">
                      {/* BadgeCheck rather than Check for the shuttle column's
                          "niet van toepassing" lines too: these are statements of
                          fact about the service, not benefits being claimed, and
                          a tick beside "Wij rijden niet in uw auto" is the right
                          reading — it IS the reassurance. */}
                      <BadgeCheck
                        className="text-accent mt-0.5 size-4 shrink-0"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                      <span className="text-sm sm:text-base">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button href={column.href} variant="outline" className="mt-7">
                  {column.cta}
                  <ArrowRight data-arrow className="size-4" aria-hidden />
                </Button>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- The people and the place ----------
          Real photographs only. This page's entire purpose is authenticity, so
          a stock frame here would undo it — see the standing rule at the top of
          config/images.ts, and the note on GALLERY above for why these four. */}
      <Section spacing="lg" aria-labelledby="beeld-heading">
        <Container>
          <Reveal className="max-w-[46ch]">
            <Eyebrow rule>Onze chauffeurs en parkeerlocatie</Eyebrow>
            <h2 id="beeld-heading" className="text-display-md mt-5">
              Zie aan wie u uw auto toevertrouwt
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              Wanneer u kiest voor valet parking, geeft u uw auto en autosleutel tijdelijk aan ons
              uit handen.
            </p>
            <p className="text-muted mt-4 leading-relaxed">
              Daarom vinden wij het belangrijk dat u kunt zien met wie u te maken heeft en waar uw
              auto tijdens uw reis wordt geparkeerd.
            </p>
            <p className="text-muted mt-4 leading-relaxed">
              Op onze website gebruiken we foto&#39;s van onze eigen werkwijze, chauffeurs en
              parkeerlocatie.
            </p>
          </Reveal>

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
                    imageClassName={`object-cover ${item.objectPosition}`}
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

      <FaqSection
        items={FAQS}
        eyebrow="Veelgestelde vragen over digitale ritregistratie"
        heading="Duidelijkheid over wat we wel en niet registreren"
        schema={false}
      />

      <ClosingCta
        heading="Valet parking met digitale ritregistratie"
        subhead="Uw auto uit handen geven met extra controle"
        lead={[
          'Met valet parking rijdt u rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur neemt uw auto daar van u over en rijdt deze naar onze bewaakte parkeerlocatie.',
          'Vanaf het moment dat onze chauffeur met uw auto vertrekt, wordt de rit digitaal geregistreerd.',
          'En na uw reis? Dan gebeurt precies hetzelfde tijdens de terugrit naar Schiphol.',
          // His four-word line, set in bold in the document. Kept as its own
          // paragraph rather than given a separate weight: inside a centred
          // closing block a bold fragment between two paragraphs reads as a
          // caption that lost its picture.
          'Route. Snelheid. Ritduur. Heen én terug.',
          'Zo combineren we het gemak van valet parking bij Schiphol met extra transparantie over de momenten waarop wij in uw auto rijden.',
        ]}
        reassurances={[
          'Uitsluitend van toepassing op valet parking',
          'Iedere heen- en terugrit digitaal geregistreerd',
          'Route en snelheid vastgelegd',
          '24/7 bewaakte parkeerlocatie',
          'Overdracht direct bij de vertrekhal',
          'Binnen 2 minuten online gereserveerd',
        ]}
        photo="crewShuttleTerminal"
        bookingHref="/reservering/?service=valet"
        bookingLabel="Reserveer valet parking"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/* NEW rich-result surface: this page had no FAQPage node before, because
          it had no FAQ section eligible for one. These nine answers exist nowhere
          else on the site. `schema={false}` on the section above, so it is
          emitted here with the other structured data for the route. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQS)) }}
      />
    </>
  );
}
