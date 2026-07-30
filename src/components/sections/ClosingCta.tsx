import { ArrowRight, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTear } from '@/components/ui/Ticket';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';
import type { PhotoName } from '@/config/images';
import type { NotchColor } from '@/components/ui/Ticket';

/**
 * The close. Shared by every page, which is the point: wherever a visitor stops
 * reading, the ask is in the same place, in the same shape, saying the same
 * thing. Heading, lead and photograph are overridable for the pages whose
 * argument ends somewhere other than "book a parking space".
 *
 * Placed after the testimonials, at the point of highest confidence: decision
 * made, objections handled, proof read. Photographic, so it lands with the same
 * weight as the hero it echoes.
 *
 * The default photograph is the terminal frontage — the same frame the homepage
 * opens on, cropped to the kerb rather than the canopy. That repeat is
 * deliberate on the homepage: departures at the top, departures at the bottom,
 * and the page closes where the journey starts. It is also free, being the
 * image the browser already has.
 *
 * The ticket perforation sits on the seam above, punched out of the cream
 * canvas, so the notches are painted `canvas`. The section must not clip or the
 * punches lose the overhang that makes them read as holes; the photograph's own
 * wrapper does the clipping instead.
 *
 * Three standing reassurances run under the buttons. They are the three things
 * a visitor at this point is still weighing, and each is stated elsewhere on the
 * page — repeating them at the ask is the point of an ask.
 */

const REASSURANCES = [
  'Gratis annuleren tot 24 uur van tevoren',
  'Binnen 2 minuten geregeld',
  '24/7 bewaakte parkeerlocatie',
] as const;

export function ClosingCta({
  heading = 'Begin uw reis ontspannen',
  lead = 'Kies zekerheid, snelheid en gemak. Reserveer vandaag nog uw parkeerplaats op Schiphol.',
  photo = 'terminalDeparture',
  /** The section the seam above sits on, so the perforation punches its colour. */
  notch = 'canvas',
}: {
  heading?: string;
  lead?: string;
  photo?: PhotoName;
  notch?: NotchColor;
} = {}) {
  return (
    <Section tone="inverse" spacing="lg" aria-labelledby="cta-heading">
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Photo
          name={photo}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imageClassName="object-cover object-[center_62%]"
        />
        <div className="scrim-band absolute inset-0" />
        {/* This band's content is centred, and scrim-band is lightest through
            the middle. See scrim-center in globals.css. */}
        <div className="scrim-center absolute inset-0" />
      </div>

      <Container className="absolute inset-x-0 top-0 z-10">
        <SectionTear notch={notch} tone="dark" />
      </Container>

      <Container className="relative">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id="cta-heading" className="text-display-lg text-heading-inverse max-w-[16ch]">
            {heading}
          </h2>
          <p className="text-lead text-navy-100 mt-6 max-w-[46ch]">{lead}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/reservering/" size="lg">
              Reserveer nu
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
            <Button href={siteConfig.phone.href} variant="onDark" size="lg">
              <Phone className="size-4" aria-hidden />
              <span className="sr-only">Bel ons: </span>
              <span className="numeric">{siteConfig.phone.display}</span>
            </Button>
          </div>

          <ul className="border-line-inverse text-navy-200 mt-12 flex flex-col items-center gap-3 border-t pt-8 text-sm sm:flex-row sm:gap-8">
            {REASSURANCES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
