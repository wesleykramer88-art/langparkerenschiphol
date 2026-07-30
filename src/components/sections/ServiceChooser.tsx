import { ArrowRight, Check, MapPin, Wallet } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal, Stagger } from '@/components/motion/Reveal';
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
 * Copy is verbatim from the live homepage. The mixed u/jij address inside the
 * bullets ("Check direct in voor je vlucht" under a "u" paragraph) is the live
 * site's, kept as-is — normalising it is a copy decision for the client, not
 * ours to make silently.
 * TODO(client): pick one form of address, u or je, and we will align all copy.
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
  bullets: readonly string[];
  cta: string;
  photo: PhotoName;
  /** The service's booking slug, carried into the hero picker's format. */
  slug: 'valet' | 'shuttle';
  /** Where the customer physically goes. The two services differ. */
  where: string;
  /** Set where it is a real differentiator; only valet takes payment on site. */
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
    bullets: [
      'Stap direct uit bij de vertrekhal',
      'Check direct in voor je vlucht',
      'Ideaal voor zakenreizen en vakanties',
    ],
    cta: 'Reserveer Valet Parkeren',
    // The crew in the branded hi-vis. The only photograph on the page of the
    // actual service being performed, so it carries the option it belongs to.
    photo: 'crewHandover',
    slug: 'valet',
    where: 'Vertrekpassage, Vertrekhal 1e verdieping',
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
    bullets: ['Autosleutels blijven bij jou', 'Snelle transferservice', 'Korte wachttijden'],
    cta: 'Reserveer Shuttle Parkeren',
    // His own terrain, with the shuttle bus running along the top of the frame
    // and Dutch yellow plates through every row. Literally what this option is.
    photo: 'lotShuttle',
    slug: 'shuttle',
    where: 'Tupolevlaan 39, Schiphol-Rijk',
  },
];

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
  },
  {
    label: 'Overdekt',
    body: 'Uw auto staat binnen, uit weer en wind. Beperkt beschikbaar.',
  },
] as const;

export function ServiceChooser() {
  return (
    <Section id="diensten" spacing="lg" aria-labelledby="diensten-heading">
      <Container>
        {/* The heading and its supporting line sit side by side rather than
            stacked and centred. Centred eyebrow-over-title-over-grid is the
            default rhythm of every generated page; splitting the header across
            the measure gives the section its own shape before a single card
            has been drawn. */}
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow rule>Welke parkeeroptie past bij u?</Eyebrow>
            <h2 id="diensten-heading" className="text-display-lg mt-5 max-w-[16ch]">
              Kies uw parkeerwijze bij Schiphol
            </h2>
          </div>
          <p className="text-muted max-w-[36ch] text-base lg:pb-2 lg:text-right">
            Twee manieren om bij de vertrekhal te komen. Beide met bewaakte parkeerplaats en een
            optionele annuleringsdekking.
          </p>
        </Reveal>

        <Stagger as="ul" className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      id={service.id}
      className="group border-line bg-surface shadow-photo hover:shadow-lifted ease-settle flex h-full flex-col overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5"
    >
      {/* The frame clips the zoom; the photograph itself is what moves. */}
      <div className="relative aspect-16/10 overflow-hidden">
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

        <Badge tone={service.badgeTone} className="absolute top-5 left-5 z-10">
          {service.badge}
        </Badge>

        <h3 className="text-display-sm text-heading-inverse absolute right-6 bottom-5 left-6 z-10">
          {service.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="max-w-[46ch]">{service.description}</p>

        <ul className="border-line mt-6 flex flex-col gap-3 border-t pt-6">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className="text-accent mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden />
              <span className="text-sm sm:text-base">{bullet}</span>
            </li>
          ))}

          {/* Only valet takes payment on site. It is a real, checkable
              difference between the two products — and a reason to pick the
              more expensive one — and it appeared nowhere on the old site. */}
          {/* {service.payOnArrival ? (
            <li className="flex items-start gap-3">
              <Wallet className="text-accent mt-1 size-4 shrink-0" strokeWidth={2.5} aria-hidden />
              <span className="text-sm font-medium sm:text-base">Betalen kan ook bij aankomst</span>
            </li>
          ) : null} */}
        </ul>

        {/* ---------- Outdoor or covered ----------
            The 2×2. Each service comes in both, at different rates, and the
            booking flow has always offered the choice — the site simply never
            said so. Set as a hairline pair rather than two more cards: this is
            a variant of the product above it, not a third and fourth product. */}
        <div className="border-line mt-6 border-t pt-6">
          <p className="eyebrow text-muted">Kies uw parkeerlocatie</p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {COVER_OPTIONS.map((option) => (
              <div key={option.label} className="border-line rounded-md border p-3.5">
                <dt className="text-heading text-sm font-semibold">{option.label}</dt>
                <dd className="text-muted mt-1 text-xs leading-relaxed">{option.body}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted mt-3 text-xs leading-relaxed">
            <MapPin className="mr-1 inline size-3.5 align-[-0.15em]" aria-hidden />
            {service.where}
          </p>
        </div>

        <div className="mt-auto pt-8">
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
        </div>
      </div>
    </article>
  );
}
