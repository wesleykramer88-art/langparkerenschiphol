import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { CalendarX2, MailCheck, Warehouse } from 'lucide-react';

/**
 * The board.
 *
 * Three concise booking benefits below the hero.
 */

type TrustItem = {
  icon: typeof Building2;
  title: string;
  label: string;
};

const ITEMS: readonly TrustItem[] = [
  {
    icon: MailCheck,
    title: 'Directe boekingsbevestiging',
    label: 'U ontvangt uw bevestiging per e-mail.',
  },
  {
    icon: Warehouse,
    title: 'Buiten of overdekt',
    label: 'Kies uw parkeeroptie tijdens het reserveren.',
  },
  {
    icon: CalendarX2,
    title: 'Optioneel annuleren',
    label: 'Met betaalde annuleringsdekking tot 24 uur vóór aankomst.',
  },
];

export function TrustStrip() {
  return (
    <Section tone="canvas" spacing="none" className="pt-7 pb-5 md:pt-10 md:pb-7 lg:pt-12 lg:pb-8">
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
