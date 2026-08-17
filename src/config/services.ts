import {
  BusFront,
  CarFront,
  DoorOpen,
  Gauge,
  Handshake,
  KeyRound,
  Lock,
  Route,
  ShieldCheck,
  SquareParking,
  Timer,
  Video,
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
 *
 * ── August 2026: the client's final copy, and why there are now TWO lists ────
 * His new page documents give a DIFFERENT number of USPs depending on where the
 * list appears: four on the homepage's service cards, six on the shuttle landing
 * page, five on the valet landing page. Those are not three transcriptions of
 * one list that drifted — they are three lists, and the longer ones say things
 * the compact one deliberately leaves out (the 5-to-8-minute figure, the ride
 * registration).
 *
 * So `bullets` stays the compact four — the homepage cards and the picker stub —
 * and `detailBullets` carries the long version for each service's own landing
 * page, where <ServiceUsp> renders it. Both come from his documents verbatim.
 *
 * ── Blast radius, checked rather than assumed ────────────────────────────────
 * Everything in this file reaches exactly three routes, and all three were in the
 * August 2026 copy pass:
 *
 *   <ServiceChooser>  /                              (bullets, where)
 *   <BookingPicker>   /, /shuttle-…, /valet-…        (name, note, usp)
 *   <ServiceUsp>      /shuttle-…, /valet-…           (usp, detailBullets)
 *
 * /onze-services/ does NOT read this file — its longer five-item benefit lists
 * are its own, which is what the note above about the "compacte versie" means.
 * /reservering/ embeds the ParkingPro iframe rather than <BookingPicker>. Neither
 * is affected by anything here.
 *
 * If you add a consumer, that list is what a future copy change has to be checked
 * against — verify it, do not assume it.
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
  /** The client's four compact USPs, one icon each. Cards and the picker stub. */
  bullets: readonly { icon: LucideIcon; text: string }[];
  /**
   * The longer list for this service's own landing page. Five for valet, six for
   * shuttle — his numbers, not a padded version of `bullets`.
   */
  detailBullets: readonly { icon: LucideIcon; text: string }[];
  /** Where the customer physically goes. The two services differ. */
  where: string;
  /** The landing page for this service. */
  href: string;
};

export const SERVICE_COPY: Record<ServiceSlug, ServiceCopy> = {
  shuttle: {
    name: 'Shuttle',
    fullName: 'Shuttle Parkeren',
    // ── The picker's radio note. Three documents give three versions of this
    // line: the homepage's runs to two sentences ("… Onze shuttle brengt u naar
    // de vertrekhal"), the two service pages' to one. This is the one-sentence
    // form, because the note sits under a radio inside a booking card where the
    // homepage's second sentence wraps the stub onto a third line.
    // TODO(client): if you want the longer homepage wording everywhere, say so —
    // it is the card's height that decides this, not a preference.
    note: 'U parkeert zelf en neemt uw autosleutels mee op reis.',
    usp: { icon: KeyRound, text: 'Sleutels mee op reis · Gratis transfer van en naar Schiphol' },
    bullets: [
      { icon: SquareParking, text: 'Zelf uw auto parkeren' },
      { icon: KeyRound, text: 'Autosleutels mee op reis' },
      { icon: BusFront, text: 'Gratis transfer van en naar Schiphol' },
      { icon: ShieldCheck, text: 'Afgesloten en bewaakte parkeerlocatie' },
    ],
    detailBullets: [
      { icon: SquareParking, text: 'Zelf uw auto parkeren' },
      { icon: KeyRound, text: 'Autosleutels mee op reis' },
      { icon: BusFront, text: 'Gratis shuttle van en naar Schiphol' },
      { icon: Timer, text: 'Slechts 5 tot 8 minuten van de vertrekhal' },
      { icon: Video, text: '24/7 camerabewaking' },
      { icon: Lock, text: 'Afgesloten en bewaakte parkeerlocatie' },
    ],
    where: `${siteConfig.address.street}, ${siteConfig.address.locality}`,
    href: '/shuttle-parkeren-schiphol/',
  },
  valet: {
    name: 'Valet',
    fullName: 'Valet Parkeren',
    note: 'Wij nemen uw auto over bij de vertrekhal van Schiphol.',
    usp: {
      icon: CarFront,
      text: 'Direct uitstappen bij de vertrekhal · Uw auto wordt voor u geparkeerd',
    },
    bullets: [
      { icon: DoorOpen, text: 'Direct uitstappen bij de vertrekhal' },
      { icon: Route, text: 'Geen shuttle of transfer nodig' },
      { icon: Handshake, text: 'Professionele overdracht van uw auto' },
      { icon: Zap, text: 'Snel en comfortabel op reis' },
    ],
    detailBullets: [
      { icon: DoorOpen, text: 'Direct uitstappen bij de vertrekhal' },
      { icon: Route, text: 'Geen shuttle of transfer nodig' },
      { icon: Handshake, text: 'Professionele overdracht van uw auto' },
      { icon: ShieldCheck, text: 'Uw auto op een bewaakte parkeerlocatie' },
      { icon: Gauge, text: 'Iedere valetrit digitaal geregistreerd' },
    ],
    // Read from the one place the handover point is defined. It used to be
    // retyped here, and when the client corrected it to "tussen Vertrekhal 2
    // en 3" this copy kept saying the old thing on the homepage.
    where: siteConfig.valetHandover.display,
    href: '/valet-parking-schiphol/',
  },
};
