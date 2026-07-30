import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { Ticket, TicketTear, TicketStub } from '@/components/ui/Ticket';
import { FontSwitcher } from './FontSwitcher';

/**
 * Internal design system reference. Not part of the public site.
 *
 * noindex here AND disallowed in robots.ts — the two do different jobs: robots
 * stops the crawl, noindex stops the indexing if the URL is ever found via a
 * link. Neither alone is sufficient.
 */
export const metadata: Metadata = {
  title: 'Design system — intern',
  robots: { index: false, follow: false, nocache: true },
};

/** Palette entries. Values are read from the tokens, never re-declared here. */
const SWATCHES = [
  { name: 'navy-950', className: 'bg-navy-950', hex: '#071E33', use: 'Donkere secties, koppen' },
  { name: 'navy-900', className: 'bg-navy-900', hex: '#0A2942', use: 'Variatie donkere sectie' },
  { name: 'navy-600', className: 'bg-navy-600', hex: '#1E5C8C', use: 'Merkblauw, links' },
  { name: 'valet-600', className: 'bg-valet-600', hex: '#E8631C', use: 'Primaire CTA, accent' },
  { name: 'valet-100', className: 'bg-valet-100', hex: '#FDEEE3', use: 'Accentvlak' },
  { name: 'paper-200', className: 'bg-paper-200', hex: '#F5F1EA', use: 'Paginacanvas' },
  { name: 'paper-50', className: 'bg-paper-50', hex: '#FFFFFF', use: 'Kaarten' },
  { name: 'ink-700', className: 'bg-ink-700', hex: '#33475B', use: 'Bodytekst' },
  { name: 'ink-500', className: 'bg-ink-500', hex: '#5A6B7C', use: 'Bijschriften' },
] as const;

const CONTRAST = [
  { pair: 'ink-700 op paper-200', ratio: '8,5:1', verdict: 'AAA', pass: true },
  { pair: 'ink-500 op paper-200', ratio: '4,9:1', verdict: 'AA', pass: true },
  { pair: 'navy-600 op wit', ratio: '7,1:1', verdict: 'AAA', pass: true },
  { pair: 'wit op navy-950', ratio: '16,9:1', verdict: 'AAA', pass: true },
  { pair: 'navy-950 op valet-600', ratio: '5,0:1', verdict: 'AA', pass: true },
  { pair: 'wit op valet-600', ratio: '3,4:1', verdict: 'Alleen groot', pass: false },
  { pair: 'valet-600 op wit', ratio: '3,4:1', verdict: 'Nooit bodytekst', pass: false },
] as const;

const DEMO_FAQ = [
  {
    question: 'Wat is het verschil tussen valet en shuttle parkeren?',
    answer:
      'Bij valet parkeren rijdt u naar de vertrekhal en neemt onze chauffeur uw auto daar over. Bij shuttle parkeren parkeert u zelf op ons beveiligde terrein en brengt de shuttle u naar de terminal.',
  },
  {
    question: 'Kan ik kosteloos annuleren?',
    answer: 'Ja, tot 24 uur voor aankomst kunt u uw reservering kosteloos annuleren.',
  },
] as const;

export default function DesignSystemPage() {
  return (
    <div className="bg-canvas min-h-dvh">
      <header className="border-line bg-surface border-b">
        <Container>
          <div className="flex flex-col gap-3 py-8">
            <Eyebrow rule>Intern · niet geïndexeerd</Eyebrow>
            <h1 className="text-display-md">Design system</h1>
            <p className="text-muted max-w-[62ch]">
              Kleuren, typografie en componenten van Lang Parkeren Schiphol. Deze pagina is alleen
              voor intern gebruik en staat niet in Google.
            </p>
          </div>
        </Container>
      </header>

      <Container className="flex flex-col gap-20 py-14">
        {/* ---- The open decision, first: it is what this page is for ---- */}
        <section aria-labelledby="type">
          <div className="mb-8 flex flex-col gap-3">
            <Eyebrow rule>Openstaande keuze</Eyebrow>
            <h2 id="type" className="text-display-md">
              Welk lettertype wordt het?
            </h2>
            <p className="text-muted max-w-[62ch]">
              Vier kandidaten, uw eigen teksten. Klik een naam aan en alles hieronder verandert
              direct mee — koppen, formulieren en prijzen in één keer.
            </p>
          </div>
          <FontSwitcher />
        </section>

        {/* ---- Palette ---- */}
        <section aria-labelledby="palette">
          <div className="mb-8 flex flex-col gap-3">
            <Eyebrow rule>Vastgesteld</Eyebrow>
            <h2 id="palette" className="text-display-md">
              Navy runway, valet orange
            </h2>
            <p className="text-muted max-w-[68ch]">
              Het navy staat voor de precisie van de luchtvaart. Het oranje is niet decoratief: het
              is exact de tint van de hi-vis jassen die onze chauffeurs dragen wanneer zij uw auto
              overnemen. Het scherm en de stoep komen overeen.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SWATCHES.map((swatch) => (
              <li key={swatch.name}>
                <Card padding="none" className="overflow-hidden">
                  <div className={`h-20 ${swatch.className}`} />
                  <div className="p-4">
                    <p className="numeric text-heading text-sm font-medium">{swatch.name}</p>
                    <p className="numeric text-muted text-xs">{swatch.hex}</p>
                    <p className="text-body mt-2 text-sm">{swatch.use}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          <div className="border-line bg-surface mt-8 overflow-hidden rounded-2xl border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Gecontroleerde contrastverhoudingen</caption>
              <thead>
                <tr className="border-line border-b">
                  <th scope="col" className="eyebrow text-muted px-5 py-3.5">
                    Combinatie
                  </th>
                  <th scope="col" className="eyebrow text-muted px-5 py-3.5">
                    Ratio
                  </th>
                  <th scope="col" className="eyebrow text-muted px-5 py-3.5">
                    Oordeel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {CONTRAST.map((row) => (
                  <tr key={row.pair}>
                    <td className="text-body px-5 py-3.5">{row.pair}</td>
                    <td className="numeric text-heading px-5 py-3.5">{row.ratio}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={row.pass ? 'brand' : 'outline'}>
                        {row.pass ? '✓ ' : '! '}
                        {row.verdict}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---- Signature ---- */}
        <section aria-labelledby="ticket">
          <div className="mb-8 flex flex-col gap-3">
            <Eyebrow rule>Signatuur</Eyebrow>
            <h2 id="ticket" className="text-display-md">
              Het parkeerticket
            </h2>
            <p className="text-muted max-w-[68ch]">
              Eén herkenbaar element, precies uitgevoerd. De reserveringskaart in de hero heeft de
              vorm van een fysiek parkeerticket: geponste inkepingen, een gestippelde scheurlijn en
              een strook met de referentie. De prijsopgave op /tarieven/ gebruikt dezelfde vorm.
              Verder blijft alles rustig.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Ticket notch="canvas">
              <div className="px-6 pt-6 pb-2">
                <p className="eyebrow text-muted">Op canvas</p>
                <p className="numeric text-heading mt-2 text-lg font-medium">14 aug — 28 aug</p>
              </div>
              <TicketTear />
              <TicketStub label="Reserveringsnr." value="LPS-4718-AMS" meta="24/7" />
            </Ticket>

            <div className="bg-surface rounded-2xl p-5">
              <Ticket notch="surface" className="shadow-card">
                <div className="px-6 pt-6 pb-2">
                  <p className="eyebrow text-muted">Op wit</p>
                  <p className="numeric text-heading mt-2 text-lg font-medium">7 nachten</p>
                </div>
                <TicketTear />
                <TicketStub label="Totaal" value="€ 89,00" meta="incl. btw" />
              </Ticket>
            </div>

            <div className="bg-surface-inverse rounded-2xl p-5">
              <Ticket notch="inverse" tone="inverse">
                <div className="px-6 pt-6 pb-2">
                  <p className="eyebrow text-navy-300">Op navy</p>
                  <p className="numeric text-heading-inverse mt-2 text-lg font-medium">
                    Valet parkeren
                  </p>
                </div>
                <TicketTear />
                <div className="flex items-end justify-between gap-4 px-6 pt-4 pb-6">
                  <div>
                    <p className="eyebrow text-navy-300">Aanwezig</p>
                    <p className="numeric text-heading-inverse mt-1.5 text-lg font-medium">
                      2,5 uur voor vertrek
                    </p>
                  </div>
                </div>
              </Ticket>
            </div>
          </div>
        </section>

        {/* ---- Components ---- */}
        <section aria-labelledby="components">
          <div className="mb-8 flex flex-col gap-3">
            <Eyebrow rule>Bouwstenen</Eyebrow>
            <h2 id="components" className="text-display-md">
              Componenten
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="text-display-sm">Knoppen</h3>
              <p className="text-muted mt-2 text-sm">
                De primaire knop is oranje met donkerblauwe tekst, niet witte. Wit op valet-600
                haalt 3,4:1 en zakt daarmee onder de toegankelijkheidsnorm; donkerblauw haalt 5,0:1.
                Het is bovendien hoe hi-vis signalering er in het echt uitziet.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button>Reserveer nu</Button>
                <Button variant="secondary">Bekijk tarieven</Button>
                <Button variant="outline">Hoe werkt het?</Button>
                <Button variant="link">Meer informatie</Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button size="sm">Klein</Button>
                <Button size="md">Normaal</Button>
                <Button size="lg">Groot</Button>
              </div>
              <div className="bg-surface-inverse mt-5 rounded-xl p-5">
                <Button variant="onDark">Op donkere sectie</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-display-sm">Labels</h3>
              <p className="text-muted mt-2 text-sm">
                Badges en eyebrows delen dezelfde letterbehandeling, zodat ze als één
                signaleringstaal lezen in plaats van twee.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="accent">Snelste optie</Badge>
                <Badge tone="brand">Meest betaalbare keuze</Badge>
                <Badge tone="neutral">Meest gekozen</Badge>
                <Badge tone="outline">24/7 bewaking</Badge>
              </div>
              <div className="border-line mt-6 flex flex-col gap-3 border-t pt-5">
                <Eyebrow rule>Met streep</Eyebrow>
                <Eyebrow tone="accent">Accentkleur</Eyebrow>
                <Eyebrow tone="muted">Gedempt</Eyebrow>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h3 className="text-display-sm">Accordeon</h3>
              <p className="text-muted mt-2 max-w-[62ch] text-sm">
                Echte knoppen met aria-expanded en aria-controls, bedienbaar met Enter en spatie. De
                antwoorden blijven in de HTML staan wanneer ze dicht zijn, omdat dezelfde tekst als
                FAQPage-structuurdata wordt meegestuurd.
              </p>
              <Accordion items={DEMO_FAQ} className="mt-5" />
            </Card>
          </div>
        </section>
      </Container>
    </div>
  );
}
