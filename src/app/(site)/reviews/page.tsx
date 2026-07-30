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
 * ── The decision this page represents ───────────────────────────────────────
 * The brief set out two versions of this page. If the client supplies a
 * verifiable public review source — a Google Business Profile, a Trustpilot
 * page — the page is built around real reviews and emits AggregateRating. If he
 * cannot, it is built from the three existing named testimonials, emits no
 * rating markup at all, and the unsourced "4,7/5" comes off the homepage.
 *
 * No source has been supplied, so this is the second version, and the 4,7 is
 * gone from the hero, the footer and the testimonials block. That is not a
 * silent choice — it is the top item in the handover, phrased as a question,
 * because it is reversible the moment a link arrives.
 *
 * Why it was not simply left as it was: rating markup Google cannot verify is a
 * manual-action risk on a fifteen-year-old domain worth far more than this
 * page, and an average review score published without stating how it was
 * gathered is, since the EU Omnibus directive, an unfair commercial practice
 * under Dutch law with a turnover-based fine. Neither risk is worth a number
 * nobody can check.
 *
 * ── What this page does instead ─────────────────────────────────────────────
 * It makes the honesty the argument. Three quotes, presented as exactly what
 * they are, with a plain statement of where they came from and an invitation to
 * check the business by other means — call the office, read the terms, look at
 * the photographs of the actual crew. On a page whose whole subject is
 * trustworthiness, "here is what we can prove and here is what we cannot"
 * outperforms a decimal number, and it is the only version that survives being
 * checked.
 *
 * ── This is now one flag, not a rebuild ────────────────────────────────────
 * The client's WordPress turns out to have both Trustindex.io and a Google
 * Reviews plugin installed, which makes it likely the 4,7 was real and pulled
 * from a Google Business Profile — it just lost its provenance on the way to
 * the page. So the page is built for both answers.
 *
 * `reviewSource` in src/content/reviews.ts is the switch. Setting it to
 * `verified: true` with a platform, a public URL, the score and the count:
 *
 *   · replaces the "geen gemiddeld cijfer" block with the score, named and
 *     linked to the platform it comes from
 *   · emits AggregateRating — legitimately, because it is now checkable
 *
 * Nothing else on this page, or anywhere else, needs editing.
 */

/** The other ways a reader can check this business, since no review platform is
 *  available to point them at. Each is real and each is verifiable today. */
const CHECKS = [
  {
    title: 'Ingeschreven bij de Kamer van Koophandel',
    body: `${siteConfig.legal.entity}, KvK ${siteConfig.legal.kvk}. Op te zoeken in het Handelsregister.`,
  },
  {
    title: 'Een adres op de luchthaven zelf',
    body: `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.locality}. Geen postbus.`,
  },
  {
    title: 'Een telefoonnummer dat wordt opgenomen',
    body: `${siteConfig.phone.display}. Bel gerust vóór u reserveert — dat is de snelste manier om te merken met wie u te maken heeft.`,
  },
  {
    title: 'Onze eigen mensen op de foto',
    body: 'De foto’s op deze site zijn van ons eigen team, ons eigen busje en ons eigen terrein bij Vertrek 2.',
  },
] as const;

export default function ReviewsPage() {
  // null while no verifiable source exists, which is the current state.
  const ratingSchema = aggregateRatingSchema(reviewSource);

  return (
    <>
      <PageHero
        eyebrow="Ervaringen"
        title="Wat reizigers over ons zeggen"
        lead="Drie reacties van klanten die hun auto bij ons achterlieten — over de overdracht bij de vertrekhal, de shuttle en de staat van de auto bij terugkomst."
        photo="crewHandover"
        objectPosition="object-[center_55%]"
        crumbs={CRUMBS}
      />

      {/* ══════════ THE QUOTES ══════════ */}
      <Section spacing="lg" aria-labelledby="ervaringen-heading">
        <Container>
          <h2 id="ervaringen-heading" className="sr-only">
            Ervaringen van klanten
          </h2>

          <Stagger as="ul" className="divide-line border-line divide-y border-y">
            {reviews.map((item) => (
              <figure
                key={item.name}
                className="grid gap-6 py-10 lg:grid-cols-[auto_1fr] lg:gap-12 lg:py-14"
              >
                <Quote
                  className="text-valet-200 size-9 shrink-0 -scale-x-100"
                  strokeWidth={1.5}
                  aria-hidden
                />

                <div>
                  {/* No star row. No per-review score was ever collected, so
                      five stars beside a quote would be a rating we invented. */}
                  <blockquote className="text-heading max-w-[58ch] text-xl leading-relaxed sm:text-2xl">
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

      {/* ══════════ THE SCORE — only when it can be checked ══════════
          Shown against a verified source and never otherwise. The platform is
          named and linked, because a score whose origin is not stated is the
          thing that had to be removed in the first place. */}
      {reviewSource.verified ? (
        <Section tone="surface" spacing="lg" aria-labelledby="score-heading">
          <Container>
            <Reveal className="flex flex-col items-start">
              <Eyebrow rule>Beoordeling</Eyebrow>
              <h2 id="score-heading" className="text-display-md mt-5">
                Wat reizigers ons gemiddeld geven
              </h2>

              <div className="mt-9 flex items-baseline gap-3">
                <span className="numeric text-heading text-6xl leading-none font-bold">
                  {formatScore(reviewSource.score)}
                </span>
                <span className="text-muted numeric text-xl">
                  / {formatScore(reviewSource.best)}
                </span>
              </div>

              <p className="text-muted mt-5 max-w-[46ch] leading-relaxed">
                Gemiddelde van{' '}
                <span className="numeric">{reviewSource.count.toLocaleString('nl-NL')}</span>{' '}
                beoordelingen op {reviewSource.label}. U kunt ze daar zelf nalezen — wij publiceren
                geen cijfer dat u niet kunt controleren.
              </p>

              <Button href={reviewSource.url} variant="outline" className="mt-7">
                Bekijk de beoordelingen op {reviewSource.label}
              </Button>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ══════════ WHERE THESE COME FROM ══════════
          The block that makes this page work. Saying plainly that three
          testimonials are three testimonials — and that we are not going to
          publish an average we cannot show the workings of — is a stronger
          trust signal on this particular page than the number would have been.

          When reviewSource.verified flips true in config/site.ts, this is where
          the score, the count and the link to the platform go. */}
      {!reviewSource.verified ? (
        <Section tone="surface" spacing="lg" aria-labelledby="herkomst-heading">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
              <Reveal>
                <Eyebrow rule>Waar deze reacties vandaan komen</Eyebrow>
                <h2 id="herkomst-heading" className="text-display-md mt-5 max-w-[18ch]">
                  Geen gemiddeld cijfer, en dat is met opzet
                </h2>
              </Reveal>

              <Reveal delay={80}>
                <div className="text-body flex max-w-[62ch] flex-col gap-4 leading-relaxed">
                  <p>
                    Dit zijn drie reacties die klanten ons rechtstreeks stuurden. Wij verzamelen ze
                    nog niet via een openbaar reviewplatform, en daarom staat er op deze site geen
                    gemiddeld cijfer of aantal beoordelingen.
                  </p>
                  <p>
                    Dat is een bewuste keuze. Een cijfer dat u nergens kunt controleren zegt u niets
                    — en u staat op het punt uw auto aan ons toe te vertrouwen. Zodra wij reviews
                    verzamelen op een platform waar u ze zelf kunt nalezen, staan het cijfer en de
                    link hier.
                  </p>
                </div>

                {/* Four things that ARE checkable, offered in place of the score
                    that is not. */}
                <ul className="divide-line border-line mt-10 divide-y border-y">
                  {CHECKS.map((check) => (
                    <li key={check.title} className="py-5">
                      <h3 className="text-heading text-base font-semibold">{check.title}</h3>
                      <p className="text-muted mt-1.5 max-w-[54ch] text-sm leading-relaxed">
                        {check.body}
                      </p>
                    </li>
                  ))}
                </ul>

                <Button href="/waarom-lang-parkeren-schiphol/" variant="link" className="mt-8">
                  Lees wat er precies met uw auto gebeurt
                  <ArrowRight data-arrow className="size-4" aria-hidden />
                </Button>
              </Reveal>
            </div>
          </Container>
        </Section>
      ) : null}

      <ClosingCta
        heading="Ervaar het zelf"
        lead="Reserveer in twee minuten en beoordeel ons daarna gerust zelf — wij horen het graag, goed of slecht."
        photo="terminalDeparture"
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
