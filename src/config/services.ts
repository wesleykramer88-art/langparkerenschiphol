import {
  BusFront,
  CarFront,
  DoorOpen,
  Phone,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { ServiceSlug } from '@/lib/booking';

/**
 * The public copy shared by the booking picker and service landing pages.
 *
 * Not what it is — src/lib/parkingpro.ts owns the products, the GUIDs and the
 * booking rules, and src/lib/booking.ts owns the selection model. This file
 * owns the verified descriptions for each active service.
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
 * `note` and `usp` summarize the service; `bullets` list its practical details.
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
    note: 'Buiten parkeren · shuttle rijdt doorlopend',
    usp: { icon: BusFront, text: 'Buiten parkeren · ongeveer 8 minuten naar Schiphol' },
    bullets: [
      { icon: BusFront, text: 'De shuttle rijdt doorlopend' },
      { icon: BusFront, text: 'Shuttlerit naar Schiphol: ongeveer 8 minuten' },
      { icon: DoorOpen, text: 'Bij terugkomst naar de vaste halte op Schiphol Plaza lopen' },
      { icon: Warehouse, text: 'Shuttle parkeren is buiten beschikbaar' },
    ],
    where: `${siteConfig.shuttleParking.street}, ${siteConfig.shuttleParking.locality}`,
    href: '/shuttle-parkeren-schiphol/',
  },
  valet: {
    name: 'Valet',
    fullName: 'Valet Parkeren',
    note: 'Auto afgeven tussen Vertrekhal 2 en 3',
    usp: { icon: CarFront, text: 'Valet parkeren · keuze tussen buiten en overdekt' },
    bullets: [
      { icon: DoorOpen, text: 'Inleveren en ophalen tussen Vertrekhal 2 en 3' },
      { icon: Warehouse, text: 'Kies voor buiten of overdekt parkeren' },
      { icon: Phone, text: 'Bel 30 minuten vóór aankomst' },
      { icon: Phone, text: 'Bel na landing en na ontvangst van ruimbagage' },
    ],
    // Read from the one place the handover point is defined. It used to be
    // retyped here, and when the client corrected it to "tussen Vertrekhal 2
    // en 3" this copy kept saying the old thing on the homepage.
    where: siteConfig.valetHandover.display,
    href: '/valet-parking-schiphol/',
  },
};
