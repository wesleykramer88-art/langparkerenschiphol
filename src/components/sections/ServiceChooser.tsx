import { ArrowRight, MapPin, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { SERVICE_COPY } from '@/config/services';
import type { PhotoName } from '@/config/images';

/**
 * Valet or shuttle — the fork.
 *
 * Moved up from position five on the live site, where it sat behind eight cards
 * of undifferentiated trust claims. This is the first question a visitor
 * actually has, and it is the one that leads to a booking: decision first,
 * reassurance second.
 *
 * The two cards are editorial rather than illustrative: the photograph runs
 * full-bleed to the card's edges and the service name is set ON it, over a
 * bottom-weighted scrim. A picture with a caption underneath is a catalogue
 * entry; a title on the image is a spread. The body, the bullets and the CTA
 * sit below on the surface, where they are readable.
 *
 * ── The USPs, and the address form that came with them ─────────────────────
 * The four bullets per card are the client's own, supplied 31 July 2026 as the
 * "compacte versie voor icon-blokken" — his phrase, and the reason each one now
 * carries its own icon rather than a row of identical check marks. They replace
 * three shorter lines carried over from the live homepage.
 *
 * That also closes a TODO that had been open since the first pass. The old
 * bullets mixed forms of address — "Check direct in voor je vlucht" sat under a
 * paragraph written in "u" — and normalising it was a copy decision we were not
 * willing to make on the client's behalf. He has now made it: all four USPs per
 * service are in "u", which matches the descriptions above them and the rest of
 * the site. There is no mixed address left in this component.
 *
 * The longer five-item benefit lists on /onze-services/ are NOT these. They are
 * the detailed version and stay as they are; this is the compact one.
 *
 * ── The CTAs now carry the service ─────────────────────────────────────────
 * They used to point at a bare /reservering/, on the reasoning that no
 * documented parameter existed for preselecting a service. There is one: the
 * ParkingPro widget API takes `showLocations`, and the four location GUIDs are
 * public. So each card hands its service through, and the booking flow opens
 * narrowed to that service's two products instead of all four.
 */

type Service = {
  id: string;
  title: string;
  badge: string;
  /** accent = the recommended option; there is only ever one. */
  badgeTone: 'accent' | 'brand';
  description: string;
  mobileDescription: string;
  /**
   * The client's USPs for this service, each with its own mark.
   *
   * An icon per line rather than one repeated check: the client asked for
   * "icon-blokken", and four identical ticks say only "this is a list" four
   * times. Each icon is chosen to restate its own line — a key for the keys you
   * keep, a door for stepping out at the hall — so the row is scannable before
   * it is read. Keep them distinct within a card; two cards may share one.
   */
  usps: readonly { icon: LucideIcon; text: string }[];
  cta: string;
  photo: PhotoName;
  /** The service's booking slug, carried into the hero picker's format. */
  slug: 'valet' | 'shuttle';
  /** Where the customer physically goes. The two services differ. */
  where: string;
  /**
   * Only valet takes payment on site. True, and a genuine reason to pick the
   * more expensive service — but NOT rendered.
   *
   * It had been sitting here as a commented-out fifth list item since before the
   * client supplied his USPs. Now that the list is his four and each line has
   * its own mark, a fifth row in a different voice would dilute them. The fact
   * is kept in the data rather than deleted, because it is the sort of thing
   * that is expensive to rediscover.
   * TODO(client): confirm this is still true, and we will find it a home —
   * the payment section on /reservering/ is the natural one.
   */
  payOnArrival?: boolean;
};

const SERVICES: readonly Service[] = [
  {
    id: 'valet',
    title: 'Valet Parkeren',
    badge: 'Snelste optie',
    badgeTone: 'accent',
    description:
      'Rijd rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur staat klaar, controleert uw auto en rijdt deze naar onze veilige parkeerlocatie.',
    mobileDescription: 'Geef uw auto af bij de vertrekhal en loop direct door naar de check-in.',
    // Read from the one place the client's compact USPs live, rather than
    // retyped. This card, the ticket stub and the two service landing pages all
    // render them; three transcriptions of the same four lines is three chances
    // for one of them to quietly stop matching. See src/config/services.ts.
    usps: SERVICE_COPY.valet.bullets,
    cta: 'Reserveer Valet Parkeren',
    // The crew in the branded hi-vis. The only photograph on the page of the
    // actual service being performed, so it carries the option it belongs to.
    photo: 'crewHandover',
    slug: 'valet',
    where: SERVICE_COPY.valet.where,
    // Only valet does. It is a genuine reason to choose it and it appeared
    // nowhere on the site before this pass — see the note on the card below.
    payOnArrival: true,
  },
  {
    id: 'shuttle',
    title: 'Shuttle Parkeren',
    badge: 'Meest betaalbare keuze',
    badgeTone: 'brand',
    description:
      'Parkeer uw auto op ons terrein. Onze shuttlebus brengt u comfortabel binnen 5 tot 8 minuten naar de vertrekhal van Schiphol.',
    mobileDescription: 'Parkeer zelf op ons terrein en reis in 5 tot 8 minuten met de shuttle naar Schiphol.',
    usps: SERVICE_COPY.shuttle.bullets,
    cta: 'Reserveer Shuttle Parkeren',
    // His own terrain, with the shuttle bus running along the top of the frame
    // and Dutch yellow plates through every row. Literally what this option is.
    photo: 'lotShuttle',
    slug: 'shuttle',
    where: SERVICE_COPY.shuttle.where,
  },
];

const MOBILE_SERVICES: readonly Service[] = [SERVICES[1], SERVICES[0]];

/**
 * Outdoor or covered — the half of the product range the site never mentioned.
 *
 * ParkingPro sells FOUR products, not two: each service in an outdoor and a
 * covered version, with separate rate lists. The rates FAQ already explains
 * that covered is priced differently and the booking flow already offers the
 * choice; only the marketing site was behaving as though there were two.
 *
 * ── Why neither is framed as the premium one ────────────────────────────────
 * The obvious treatment is "covered = the upgrade". The client's own live
 * prices say otherwise, and only for one of the two services:
 *
 *   shuttle   buiten € 201,49   overdekt € 211,49    (+ €10, as expected)
 *   valet     buiten € 361,49   overdekt € 182,48    (− €179, consistently)
 *
 * That holds across every date range checked. Either LPS-V's rate list is
 * misconfigured or valet-outdoor means something we have not been told. Until
 * the client answers, this block states what each option IS and lets the live
 * prices in the booking flow speak for themselves. Writing "overdekt kost iets
 * meer" here would be false for half the range and would survive right up until
 * a customer noticed.
 */
const COVER_OPTIONS = [
  {
    label: 'Buitenterrein',
    body: 'Uw auto staat op ons afgesloten, bewaakte buitenterrein.',
    mobileBody: 'Afgesloten buitenterrein',
  },
  {
    label: 'Overdekt',
    body: 'Uw auto staat binnen, uit weer en wind. Beperkt beschikbaar.',
    mobileBody: 'Binnen, uit weer en wind',
  },
] as const;

export function ServiceChooser() {
  return (
    <Section id="diensten" spacing="lg" aria-labelledby="diensten-heading" className="py-14 md:py-24 lg:py-40">
      <Container>
        {/* The heading and its supporting line sit side by side rather than
            stacked and centred. Centred eyebrow-over-title-over-grid is the
            default rhythm of every generated page; splitting the header across
            the measure gives the section its own shape before a single card
            has been drawn. */}
        <Reveal className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow rule>Welke parkeeroptie past bij u?</Eyebrow>
            <h2 id="diensten-heading" className="text-display-md mt-4 max-w-[14ch] md:text-display-lg md:mt-5 md:max-w-[16ch]">
              Kies uw parkeerwijze bij Schiphol
            </h2>
          </div>
          <p className="text-muted max-w-[32ch] text-sm leading-relaxed md:max-w-[36ch] md:text-base lg:pb-2 lg:text-right">
            Twee manieren om bij de vertrekhal te komen. Beide met bewaakte parkeerplaats en een
            optionele annuleringsdekking.
          </p>
        </Reveal>

        <Stagger as="ul" className="mt-8 grid gap-4 md:hidden">
          {MOBILE_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} uspCount={3} />
          ))}
        </Stagger>

        <Stagger as="ul" className="mt-12 hidden gap-6 md:grid lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

function ServiceCard({ service, uspCount }: { service: Service; uspCount?: number }) {
  return (
    <article
      id={service.id}
      className="group border-line bg-surface shadow-photo hover:shadow-lifted ease-settle flex h-full flex-col overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5"
    >
      {/* The frame clips the zoom; the photograph itself is what moves. */}
      <div className="relative aspect-[16/8] overflow-hidden md:aspect-16/10">
        <Photo
          name={service.photo}
          fill
          sizes="(min-width: 1024px) 36rem, (min-width: 640px) 90vw, 100vw"
          className="absolute inset-0 h-full w-full"
          imageClassName="ease-settle transition-transform duration-[700ms] group-hover:scale-[1.06]"
        />

        {/* Bottom-weighted, so the title has something to sit on regardless of
            what the photograph is doing at its foot. */}
        <div aria-hidden className="scrim-card absolute inset-0" />

        <Badge tone={service.badgeTone} className="absolute top-5 left-5 z-10 hidden md:inline-flex">
          {service.badge}
        </Badge>

        <h3 className="text-display-sm text-heading-inverse absolute right-6 bottom-5 left-6 z-10 hidden md:block">
          {service.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 md:hidden">
          <div>
            <h3 className="text-display-sm text-heading">{service.title}</h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">{service.mobileDescription}</p>
          </div>
          <Badge tone={service.badgeTone}>{service.badge}</Badge>
        </div>

        <p className="hidden max-w-[46ch] md:block">{service.description}</p>

        {/* The USP block.

            `gap-3.5` rather than the old `gap-3`: four rows of distinct marks
            need slightly more air than three identical ticks, or the icons read
            as a vertical strip of their own instead of as one mark per line.

            The icon keeps `size-4` and sits in a `shrink-0` box so a line that
            wraps on a narrow card stays hung off its mark rather than sliding
            back under it. Every icon is aria-hidden — each one restates the
            sentence beside it, so announcing both would read the list twice. */}
        <ul className="border-line mt-5 flex flex-col gap-3 border-t pt-5 md:mt-6 md:gap-3.5 md:pt-6">
          {(uspCount ? service.usps.slice(0, uspCount) : service.usps).map((usp) => (
            <li key={usp.text} className="flex items-start gap-3">
              <usp.icon
                className="text-accent mt-0.5 size-4 shrink-0"
                strokeWidth={2.25}
                aria-hidden
              />
              <span className="text-sm md:text-base">{usp.text}</span>
            </li>
          ))}
        </ul>

        {/* ---------- Outdoor or covered ----------
            The 2×2. Each service comes in both, at different rates, and the
            booking flow has always offered the choice — the site simply never
            said so. Set as a hairline pair rather than two more cards: this is
            a variant of the product above it, not a third and fourth product. */}
        <div className="border-line mt-5 border-t pt-5 md:mt-6 md:pt-6">
          <p className="eyebrow text-muted">Kies uw parkeerlocatie</p>
          <dl className="mt-3 grid gap-2 md:gap-3 sm:grid-cols-2">
            {COVER_OPTIONS.map((option) => (
              <div key={option.label} className="border-line rounded-md border p-3 md:p-3.5">
                <dt className="text-heading text-sm font-semibold">{option.label}</dt>
                <dd className="text-muted mt-1 text-xs leading-relaxed md:hidden">{option.mobileBody}</dd>
                <dd className="text-muted mt-1 hidden text-xs leading-relaxed md:block">{option.body}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted mt-3 text-xs leading-relaxed">
            <MapPin className="mr-1 inline size-3.5 align-[-0.15em]" aria-hidden />
            {service.where}
          </p>
        </div>

        <div className="mt-auto pt-6 md:pt-8">
          {/* Carries the service into the booking flow, which narrows it to
              that service's two products. The picker's own format — see
              src/lib/booking.ts. */}
          {/* Width is capped rather than shrink-to-fit. `sm:w-auto` sized each
              button to its own label — "Reserveer Shuttle Parkeren" is 14px
              wider than "Reserveer Valet Parkeren" — so the two cards' CTAs
              never lined up. A capped full width makes both exactly max-w-xs on
              every card, and holds under translation, where the labels diverge
              again by a different amount. */}
          <Button href={`/reservering/?service=${service.slug}`} className="w-full sm:max-w-xs">
            {service.cta}
            <ArrowRight data-arrow className="size-4" aria-hidden />
          </Button>

          {/* The secondary route, added when each service got its own landing
              page. Kept as a text link under the button rather than as a second
              button: a visitor who is ready to book should meet one obvious
              action, and a visitor who is not should still have somewhere to go
              other than away. */}
          <Button
            href={SERVICE_COPY[service.slug].href}
            variant="link"
            className="mt-3 block text-sm sm:mt-5"
          >
            Meer over {service.title.toLowerCase()}
          </Button>
        </div>
      </div>
    </article>
  );
}
