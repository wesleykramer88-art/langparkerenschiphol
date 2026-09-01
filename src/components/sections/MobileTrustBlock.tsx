import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

const ITEMS = [
  '24/7 camerabewaking en monitoring',
  'Afgesloten parkeerlocatie',
  'Sleutels mee bij Shuttle',
  'Digitale ritregistratie bij Valet',
] as const;

export function MobileTrustBlock() {
  return (
    <Section
      tone="surface"
      spacing="none"
      aria-labelledby="mobiel-vertrouwen-heading"
      className="py-12 md:hidden"
    >
      <Container>
        <div className="border-line rounded-xl border bg-canvas p-5">
          <Eyebrow>Vertrouwen en veiligheid</Eyebrow>
          <div className="mt-4 flex items-start gap-3">
            <ShieldCheck className="text-accent mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden />
            <div>
              <h2 id="mobiel-vertrouwen-heading" className="text-display-sm text-heading">
                Uw auto staat veilig, uw keuze blijft helder
              </h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Beide services werken vanuit een bewaakte parkeerlocatie, met digitale ritregistratie
                als extra controle bij Valet.
              </p>
            </div>
          </div>

          <ul className="border-line mt-5 space-y-3 border-t pt-5">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-snug">
                <Check className="text-accent mt-0.5 size-4 shrink-0" strokeWidth={2.5} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button href="/veilig-parkeren-schiphol/" variant="link" className="mt-4">
            Meer over veiligheid
            <ArrowRight data-arrow className="size-4" aria-hidden />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
