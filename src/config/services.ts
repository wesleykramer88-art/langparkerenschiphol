import {
  BadgeCheck,
  BusFront,
  CarFront,
  DoorOpen,
  Handshake,
  KeyRound,
  LayoutGrid,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { ServiceSlug } from '@/lib/booking';

/**
 * What each of the two services SAYS about itself.
 *
 * Not what it is — src/lib/parkingpro.ts owns the products, the GUIDs and the
 * booking rules, and src/lib/booking.ts owns the selection model. This file owns
 * the client's own marketing copy for each service and nothing else.
 *
 * ── Why this exists as a file ───────────────────────────────────────────────
 * This copy was declared inside BookingPicker, which was correct while the
 * picker was the only thing that rendered it. It is not any more: the two
 * service landing pages (/shuttle-parkeren-schiphol/ and
 * /valet-parking-schiphol/) lead with the same "Uw voordeel" line and the same
 * four bullets, and a second copy of a client's own words is a copy that will
 * eventually disagree with the first. The picker's stub and the landing pages
 * now read from here.
 *
 * ── The copy is the client's, 31 July 2026 ──────────────────────────────────
 * `note` is MECHANICAL — what physically happens to the car. `usp` is the
 * BENEFIT — what the visitor gets out of that. They are deliberately not the
 * same sentence: a card that makes the same point at both ends only reinforces
 * if the words have moved on.
 *
 * His originals open with an emoji (🔑 Sleutels mee op reis, 🚗 Direct voor de
 * vertrekhal). Those are line icons here, because a colour emoji would be the
 * only one on the site, and because the stub already sets an icon-plus-label
 * pair in its right column.
 *
 * His separator was "•". This uses "·", which is what the ticket stub's own
 * "AMS · 24/7" and the rest of the card already use.
 *
 * `bullets` are his "compacte versie voor icon-blokken" — his phrase, and the
 * reason each line carries its own icon rather than a fourth identical tick.
 * Each icon restates its own line (a key for the keys you keep, a door for
 * stepping out at the hall) so the block is scannable before it is read. The
 * LONGER five-item lists on /onze-services/ are a different thing and stay
 * where they are; these are the compact ones.
 */
export type ServiceCopy = {
  /** Short name, as it appears on the picker's radio. */
  name: string;
  /** Full product name, for headings and CTAs. */
  fullName: string;
  /** Mechanical: what happens to the car. Sits under the picker's radios. */
  note: string;
  /** The benefit line. The picker's "Uw voordeel" stub, and the landing heroes. */
  usp: { icon: LucideIcon; text: string };
  /** The client's four compact USPs, one icon each. */
  bullets: readonly { icon: LucideIcon; text: string }[];
  /** Where the customer physically goes. The two services differ. */
  where: string;
  /** The landing page for this service. */
  href: string;
};

export const SERVICE_COPY: Record<ServiceSlug, ServiceCopy> = {
  shuttle: {
    name: 'Shuttle',
    fullName: 'Shuttle Parkeren',
    note: 'U parkeert zelf · shuttle naar de vertrekhal',
    usp: { icon: KeyRound, text: 'Sleutels mee op reis · Gratis transfer naar Schiphol' },
    bullets: [
      { icon: KeyRound, text: 'Zelf parkeren, sleutels mee op reis' },
      { icon: BusFront, text: 'Transfer op 5 tot 8 minuten van Schiphol' },
      { icon: LayoutGrid, text: 'Duidelijk en strak georganiseerd' },
      { icon: ShieldCheck, text: 'Veilig terrein, betrouwbare service' },
    ],
    where: `${siteConfig.address.street}, ${siteConfig.address.locality}`,
    href: '/shuttle-parkeren-schiphol/',
  },
  valet: {
    name: 'Valet',
    fullName: 'Valet Parkeren',
    note: 'Wij nemen uw auto over bij de vertrekhal',
    usp: { icon: CarFront, text: 'Direct voor de vertrekhal · Auto wordt voor u geparkeerd' },
    bullets: [
      { icon: DoorOpen, text: 'Direct uitstappen bij de vertrekhal' },
      { icon: Zap, text: 'De snelste start van uw reis' },
      { icon: Handshake, text: 'Professionele overdracht van uw auto' },
      { icon: BadgeCheck, text: 'Comfort en zekerheid zonder stress' },
    ],
    // Read from the one place the handover point is defined. It used to be
    // retyped here, and when the client corrected it to "tussen Vertrekhal 2
    // en 3" this copy kept saying the old thing on the homepage.
    where: siteConfig.valetHandover.display,
    href: '/valet-parking-schiphol/',
  },
};
