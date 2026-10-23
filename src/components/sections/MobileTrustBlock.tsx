import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';

const ITEMS = [
  'Shuttle: zelf parkeren en sleutels mee',
  'Valet: auto afgeven bij de vertrekhal',
  'Vaste procedure bij aankomst en terugkomst',
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
          <div className="shadow-photo relative aspect-[16/8] overflow-hidden rounded-lg">
            <Photo
              name="lotShuttle"
              fill
              sizes="100vw"
              className="absolute inset-0 h-full w-full"
              imageClassName="object-cover object-center"
            />
          </div>
          <Eyebrow>Duidelijkheid vooraf</Eyebrow>
          <div className="mt-4 flex items-start gap-3">
            <ShieldCheck className="text-accent mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden />
            <div>
              <h2 id="mobiel-vertrouwen-heading" className="text-display-sm text-heading">
                Uw keuze blijft helder
              </h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Bij Shuttle parkeert u zelf en houdt u uw sleutel. Bij Valet geeft u uw auto af bij de
                vertrekhal.
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
