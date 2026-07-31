import { createMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PageHero } from '@/components/sections/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/config/site';
import { TERMS, type Article, type Clause } from '@/content/algemene-voorwaarden';

export const metadata = createMetadata('terms');

const CRUMBS = [{ name: 'Algemene voorwaarden', path: '/algemene-voorwaarden/' }];

/**
 * /algemene-voorwaarden/
 *
 * The terms, hosted here for the first time. They lived on
 * valetparkingschiphol.nl until now, which meant the one link every page in the
 * footer carries sent the visitor to a different domain — see the note on
 * `termsUrl` in config/site.ts.
 *
 * ── This page is read, not browsed ──────────────────────────────────────────
 * Almost nobody arrives here to read nineteen articles end to end. They arrive
 * from the footer mid-booking with ONE question — can I cancel, what happens if
 * my flight is delayed, who pays if there is a scratch — and they need to find
 * the article that answers it and leave. Everything below follows from that:
 *
 *   The contents list is not decoration. Nineteen articles is past the point
 *   where scrolling to find one is reasonable, so the list is the primary
 *   navigation of the page and gets a sticky column of its own at lg. Below lg
 *   it sits inline above the text, where it still works as a jump list.
 *
 *   Every article is an anchor (#artikel-5), so a support agent can send
 *   somebody straight to the clause rather than to the page.
 *
 *   The measure is capped at 72ch and the text is set at the body size, not
 *   smaller. Legal text set small and full-width is the house style of every
 *   terms page on the internet and it is the reason nobody reads them. This one
 *   is set to be read.
 *
 * ── Numbering ───────────────────────────────────────────────────────────────
 * The clause numbers come from the browser's own <ol> counter, never from the
 * data. The supplied document arrived with a broken running counter (see the
 * note in src/content/algemene-voorwaarden.ts); deriving the numbers from list
 * position means the rendered numbering cannot disagree with the order of the
 * clauses, whatever happens to that file later. Article 14 lid 8 cross-refers
 * to "artikel 13" — those references are to ARTICLE numbers, which are
 * explicit in the data, so they stay correct.
 *
 * ── No JSON-LD beyond the breadcrumb ────────────────────────────────────────
 * Deliberate. There is no schema.org type for a set of terms that Google does
 * anything with, and the temptation is to reach for FAQPage because the content
 * is question-shaped. That would be a rich-result violation — FAQ markup is for
 * a page that asks and answers questions, not for any page with numbered
 * paragraphs — and the penalty lands on the whole domain, not on this page.
 */

/**
 * Version date, printed under the heading.
 *
 * TODO(client): the supplied document carries no date. Set this to the date the
 * current version took effect and it renders; until then the line is omitted,
 * because a made-up date on a contract is worse than no date. Format: the
 * string exactly as it should appear.
 */
const LAST_UPDATED: string | null = null;

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(CRUMBS)) }}
      />

      <PageHero
        eyebrow="Algemene voorwaarden"
        title="De voorwaarden waaronder wij uw auto parkeren."
        lead={`Deze algemene voorwaarden gelden voor iedere reservering bij ${siteConfig.legal.entity}, voor zowel Valet Parking als Shuttle Parking.`}
        photo="lotShuttle"
        objectPosition="object-[center_60%]"
        crumbs={CRUMBS}
      />

      <Section spacing="lg" aria-labelledby="voorwaarden-heading">
        <Container>
          <h2 id="voorwaarden-heading" className="sr-only">
            Algemene voorwaarden
          </h2>

          {/* The identity block. Dutch distance-selling law (BW 6:230m) requires
              a trader to state who it is, how it can be reached and under which
              registration number — and the terms themselves are where a visitor
              looks for it. Article 1 lid 1 carries the name and the KvK number
              but buried in the middle of a definition; repeating them here as a
              legible card is the difference between "disclosed" and "findable".

              The law also asks for a geographic address, which this card does
              NOT show, because the registered one is the client's home. The KvK
              number carries that requirement in the interim — it resolves to the
              registered office in a public register — and the contact row below
              gives a visitor the reachability the rule is really protecting. */}
          <Reveal className="border-line bg-surface max-w-[72ch] rounded-lg border p-6 sm:p-7">
            <Eyebrow rule>Wie is uw contractspartij</Eyebrow>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted text-xs">Onderneming</dt>
                <dd className="text-heading mt-1 font-medium">{siteConfig.legal.entity}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">KvK-nummer</dt>
                <dd className="numeric text-heading mt-1 font-medium">{siteConfig.legal.kvk}</dd>
              </div>
              {/* There is no "Vestigingsadres" row, and that is deliberate —
                  the registered office is the client's home address. See the
                  note on `legal` in config/site.ts. When the company is
                  re-registered at a business address, add the row back here and
                  restore the phrase in article 1. */}
              <div className="sm:col-span-2">
                <dt className="text-muted text-xs">Bereikbaarheid</dt>
                <dd className="text-heading mt-1 font-medium">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-brand ease-settle transition-colors duration-(--duration-micro)"
                  >
                    {siteConfig.email}
                  </a>
                  <span className="text-muted"> · </span>
                  <a
                    href={siteConfig.phone.href}
                    className="numeric hover:text-brand ease-settle transition-colors duration-(--duration-micro)"
                  >
                    {siteConfig.phone.display}
                  </a>
                </dd>
              </div>
            </dl>

            {LAST_UPDATED ? (
              <p className="border-line text-muted mt-6 border-t pt-4 text-sm">
                Laatst bijgewerkt: {LAST_UPDATED}
              </p>
            ) : null}
          </Reveal>

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <TableOfContents />

            {/* The document. `min-w-0` so a long unbroken string in the legal
                text cannot blow out the grid column on a phone. */}
            <div className="max-w-[72ch] min-w-0">
              {TERMS.map((article) => (
                <ArticleBlock key={article.number} article={article} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * The jump list.
 *
 * `lg:sticky lg:top-32` matches the offset the contact and rates pages use for
 * their sticky columns — 8rem clears the h-20 header plus breathing room, and
 * all three agreeing means the site has one sticky offset rather than three.
 *
 * Not <nav aria-label> on mobile as well as desktop by accident: it is one
 * element that moves, so a screen reader meets a single "Inhoudsopgave"
 * landmark at either size rather than a duplicated list.
 */
function TableOfContents() {
  return (
    <nav aria-labelledby="inhoud-heading" className="lg:sticky lg:top-32 lg:self-start">
      <h2 id="inhoud-heading" className="eyebrow text-muted">
        Inhoudsopgave
      </h2>

      {/* Two columns below lg so nineteen items do not push the document a full
          screen down the page; one column in the sticky rail, where the width
          will not take two. */}
      <ol className="mt-5 grid gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-1">
        {TERMS.map((article) => (
          <li key={article.number}>
            <a
              href={`#artikel-${article.number}`}
              className="text-muted hover:text-brand ease-settle flex min-h-9 items-baseline gap-2.5 text-sm transition-colors duration-(--duration-micro)"
            >
              <span
                aria-hidden
                className="numeric text-line-strong w-4 shrink-0 text-right text-xs"
              >
                {article.number}
              </span>
              <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:decoration-current">
                {article.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ArticleBlock({ article }: { article: Article }) {
  return (
    <Reveal
      as="section"
      // `scroll-mt-28` is what makes the anchors usable: without it a jump from
      // the contents list puts the heading underneath the sticky header, and the
      // visitor lands on what looks like the middle of the previous article.
      className="border-line scroll-mt-28 border-t pt-8 first:border-t-0 first:pt-0 [&+*]:mt-10"
      id={`artikel-${article.number}`}
      aria-labelledby={`artikel-${article.number}-heading`}
    >
      <Eyebrow tone="muted">Artikel {article.number}</Eyebrow>

      <h3
        id={`artikel-${article.number}-heading`}
        className="text-heading mt-3 text-xl font-semibold sm:text-2xl"
      >
        {article.title}
      </h3>

      {article.intro ? <p className="mt-5 leading-relaxed">{article.intro}</p> : null}

      {/* list-decimal, not a rendered index: see the note on numbering at the
          top of this file. `marker:` keeps the counter in the muted tone and at
          the smaller size without giving up the native <ol> semantics, so a
          screen reader announces position in the list for free. */}
      <ol className="marker:text-muted mt-5 list-decimal space-y-4 ps-6 marker:text-sm">
        {article.clauses.map((clause, index) => (
          <li key={index} className="ps-1 leading-relaxed">
            <ClauseBody clause={clause} />
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function ClauseBody({ clause }: { clause: Clause }) {
  return (
    <>
      {clause.term ? (
        <>
          {/* <dfn> rather than <strong>: article 1 IS the defining instance of
              each of these terms, and every later article uses them with the
              capital letter that points back here. That is exactly what <dfn>
              marks, and it costs nothing. */}
          <dfn className="text-heading font-semibold not-italic">{clause.term}</dfn>
          {': '}
        </>
      ) : null}
      {clause.text}

      {clause.sub ? (
        <ol className="marker:text-muted mt-3 list-[lower-alpha] space-y-2 ps-6 marker:text-sm">
          {clause.sub.map((item, index) => (
            <li key={index} className="ps-1">
              {item}
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
