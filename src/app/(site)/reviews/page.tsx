import { ArrowRight, Quote } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { formatScore, reviewSource, reviews } from '@/content/reviews';
import { aggregateRatingSchema } from '@/lib/schema';
import { siteConfig } from '@/config/site';

export const metadata = createMetadata('reviews');

const CRUMBS = [{ name: 'Ervaringen', path: '/reviews/' }];

/**
 * /reviews/
 *
 * Short and checkable. No score, stars, review count or platform is shown
 * without a verifiable public source, and the former quotes are not shown
 * because their origin was never recorded. When a real public review page
 * exists, set `reviewSource` in src/content/reviews.ts: the score, the link and
 * AggregateRating markup then follow from it.
 */

const CHECKS = [
  {
    title: 'Ingeschreven bij de Kamer van Koophandel',
    body: `${siteConfig.legal.entity}, KvK ${siteConfig.legal.kvk}. Op te zoeken in het Handelsregister.`,
  },
  {
    title: 'Een vaste shuttleparkeerlocatie',
    body: `${siteConfig.shuttleParking.display}, bij het ibis hotel.`,
  },
  {
    title: 'Telefonisch en per e-mail bereikbaar',
    body: `${siteConfig.phone.display} of ${siteConfig.email}. Neem gerust contact op vóór u reserveert.`,
  },
  {
    title: 'Voorwaarden vooraf in te zien',
    body: 'De algemene voorwaarden staan op deze site en zijn voor het reserveren te lezen.',
  },
] as const;

export default function ReviewsPage() {
  // null while no verifiable source exists, which is the current state.
  const ratingSchema = aggregateRatingSchema(reviewSource);

  return (
    <>
      <PageHero
        eyebrow="Ervaringen"
        title="Ervaringen en betrouwbaarheid"
        lead="Op dit moment tonen wij hier geen reviews of beoordelingen. Wat u wel kunt controleren, staat hieronder."
        crumbs={CRUMBS}
      />

      {reviewSource.verified ? (
        <Section tone="surface" spacing="md" aria-labelledby="score-heading">
          <Container>
            <Reveal className="flex flex-col items-start">
              <Eyebrow rule>Beoordeling</Eyebrow>
              <h2 id="score-heading" className="text-display-md mt-5">
                Beoordelingen op {reviewSource.label}
              </h2>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="numeric text-heading text-6xl leading-none font-bold">
                  {formatScore(reviewSource.score)}
                </span>
                <span className="text-muted numeric text-xl">
                  / {formatScore(reviewSource.best)}
                </span>
              </div>
              <p className="text-muted mt-4 max-w-[46ch] leading-relaxed">
                Gemiddelde van{' '}
                <span className="numeric">{reviewSource.count.toLocaleString('nl-NL')}</span>{' '}
                beoordelingen op {reviewSource.label}.
              </p>
              <Button href={reviewSource.url} variant="outline" className="mt-6">
                Bekijk de beoordelingen op {reviewSource.label}
              </Button>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {reviews.length > 0 ? (
        <Section spacing="md" aria-labelledby="ervaringen-heading">
          <Container>
            <h2 id="ervaringen-heading" className="sr-only">
              Ervaringen van klanten
            </h2>
            <Stagger as="ul" className="divide-line border-line divide-y border-y">
              {reviews.map((item) => (
                <figure key={item.name} className="grid gap-6 py-10 lg:grid-cols-[auto_1fr] lg:gap-12">
                  <Quote
                    className="text-valet-200 size-9 shrink-0 -scale-x-100"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div>
                    <blockquote className="text-heading max-w-[58ch] text-xl leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <figcaption className="text-muted mt-6 flex flex-wrap items-center gap-x-3 text-sm">
                      <span className="text-heading font-semibold">{item.name}</span>
                      <span aria-hidden className="bg-line-strong h-3 w-px" />
                      <span>{item.role}</span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      <Section tone="surface" spacing="md" aria-labelledby="controle-heading">
        <Container>
          <Reveal>
            <Eyebrow rule>Bedrijfsgegevens</Eyebrow>
            <h2 id="controle-heading" className="text-display-md mt-5 max-w-[22ch]">
              Wat u zelf kunt controleren
            </h2>
            <ul className="divide-line border-line mt-8 max-w-[62ch] divide-y border-y">
              {CHECKS.map((check) => (
                <li key={check.title} className="py-5">
                  <h3 className="text-heading text-base font-semibold">{check.title}</h3>
                  <p className="text-muted mt-1.5 text-sm leading-relaxed">{check.body}</p>
                </li>
              ))}
            </ul>
            <Button href="/waarom-lang-parkeren-schiphol/" variant="link" className="mt-8">
              Lees hoe het werkt
              <ArrowRight data-arrow className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </Section>

      <ClosingCta
        heading="Klaar om te reserveren?"
        lead="Kies uw service en reisdata en reserveer online."
        notch="surface"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />
      {/*
        AggregateRating, and ONLY against a verified source.

        `aggregateRatingSchema` returns null while `reviewSource.verified` is
        false, and nothing is emitted — which is the current state. That is not
        caution for its own sake: Google does not grant review rich results for
        reviews a business publishes about itself, and requesting them anyway is
        a documented route to a manual action on a fifteen-year-old domain.

        Still deliberately absent even when verified: per-review `Review`
        markup for quotes hosted on our own page. The aggregate points at the
        platform, where Google can see the reviews for itself.
      */}
      {ratingSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(ratingSchema) }}
        />
      ) : null}
    </>
  );
}
