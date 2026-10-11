import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Building2, BusFront, CalendarX2 } from 'lucide-react';

/**
 * The board.
 *
 * Three concise service and independence facts below the hero.
 */

type TrustItem = {
  icon: typeof Building2;
  title: string;
  label: string;
};

const ITEMS: readonly TrustItem[] = [
  {
    icon: Building2,
    title: 'Onafhankelijke aanbieder',
    label: 'Een merk van The Parking Company. Geen onderdeel van Schiphol.',
  },
  {
    icon: BusFront,
    title: 'Shuttle of valet',
    label: 'Zelf parkeren met transfer, of uw auto afgeven bij de vertrekhal.',
  },
  {
    icon: CalendarX2,
    title: 'Optioneel annuleren',
    label: 'Met betaalde annuleringsdekking tot 24 uur vóór aankomst.',
  },
];

export function TrustStrip() {
  return (
    <Section tone="canvas" spacing="none" className="pt-8 pb-6 md:pt-12 md:pb-8 lg:pt-20 lg:pb-10">
      <Container>
        <ul className="grid gap-5 md:grid-cols-3 md:gap-8">
          {ITEMS.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 80}
              className="flex items-start gap-3.5 border-line border-b pb-5 last:border-b-0 md:border-b-0 md:pb-0 md:not-first:border-l md:not-first:pl-6"
            >
              <item.icon className="text-brand mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden />
              <div>
                <h2 className="text-heading text-sm font-semibold">{item.title}</h2>
                <p className="text-muted mt-1 max-w-[38ch] text-sm leading-relaxed">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
