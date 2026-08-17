import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import type { PhotoName } from '@/config/images';
import type { Crumb } from '@/lib/schema';

/**
 * The subpage hero.
 *
 * Deliberately NOT the homepage hero at a smaller size. That one is a stage:
 * near-full-viewport, an orchestrated load sequence, a booking ticket laid over
 * it, and the site's only use of the animation runtime. Reproducing it on
 * fifteen more pages would spend the effect entirely — the homepage hero only
 * reads as the hero because nothing else on the site is allowed to be it.
 *
 * ── THIS BAND WAS NAVY WITH TEXT OVER A PHOTOGRAPH. IT IS NOW LIGHT ─────────
 * Client, August 2026: "nergens donker" — nowhere dark. The previous pass
 * lightened the closing CTA and left this alone, and that was not enough,
 * because this band opens SIXTEEN pages. Whatever the sections below it did,
 * every route still began on a full-bleed navy field, so the site still read
 * dark.
 *
 * What replaced it is not a lighter scrim. Text over a photograph needs either
 * a dark veil with light type or a light veil with dark type, and both of those
 * are a veil — at the opacity a light veil would need for AA on navy-950 type,
 * the photograph underneath is washed out to nothing. Either way the client's
 * photography loses.
 *
 * So the veil is gone entirely. The photograph moves into a contained panel
 * beside the copy, at FULL strength with no scrim over it at all, and the band
 * itself is the page canvas. That serves both things the brief asks for at
 * once: the site gets lighter, and the client's real photographs are seen
 * better than they ever were under 82–94% navy.
 *
 * `scrim-page` is now unused. It is kept and documented in globals.css rather
 * than deleted — its stops are measured against real frames from this library.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 * Flat pairs now, so these hold regardless of which photograph a page passes:
 *   navy-950 heading      on canvas ... 15.01:1  AAA
 *   ink-700  lead         on canvas .... 8.51:1  AAA
 *   navy-600 eyebrow      on canvas .... 6.29:1  AA   (12px, needs 4.5)
 *   ink-500  crumb link   on canvas .... 4.87:1  AA   (12px, needs 4.5)
 *   navy-950 current crumb on canvas .. 15.01:1  AAA
 *
 * Two things had to change colour when the band stopped being navy, and both
 * were caught by measuring rather than by eye:
 *
 *   · The eyebrow was `tone="accent"` — valet-600, which is 3.16:1 on the
 *     canvas. It is `tone="brand"` (navy-600) now. Do not put valet-600 back:
 *     the ramp's own note in globals.css restricts it to ≥24px display text,
 *     icons and non-text borders.
 *   · <Breadcrumbs> defaults to `onDark` and was left on it, which put a
 *     navy-300 link at 1.85:1 and a navy-100 current crumb at 1.10:1 on cream
 *     across all sixteen pages. It is passed `onLight` below.
 */
export function PageHero({
  eyebrow,
  title,
  subhead,
  lead,
  photo,
  crumbs,
  /** Vertical crop of the photograph. Each frame has its own subject. */
  objectPosition = 'object-center',
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  /**
   * The promise, between the H1 and the lead.
   *
   * Added for the client's August 2026 copy, where every subpage document is
   * written as an H1 followed by an H2 — "Shuttle parkeren bij Schiphol" /
   * "Zelf parkeren, uw autosleutels mee op reis". Folding that second line into
   * the lead was the alternative and it loses the distinction the documents are
   * making: the H1 names the product, the subhead states what the reader gets.
   *
   * Set at display-md, the same treatment the homepage hero gives its own
   * SUBHEAD, so the two heroes agree about what this line is. It is NOT a
   * heading element — the page already has its H1 above and the sections below
   * own the H2s, and an <h2> here would sit outside any section it describes.
   *
   * Contrast on the canvas: ink-700 at 8.51:1, AAA. It deliberately does not
   * take the accent — valet-600 on cream is 3.16:1 and the ramp's own note in
   * globals.css restricts it to >=24px display text, which this is, but the
   * homepage's orange subhead is over a navy scrim and reads as the accent's one
   * appearance in that column. Repeating it on sixteen pages spends it.
   */
  subhead?: string;
  /** One paragraph, or several where the client's copy runs to more than one. */
  lead?: string | readonly string[];
  photo: PhotoName;
  crumbs: readonly Crumb[];
  objectPosition?: string;
  /** Buttons or a note, under the lead. */
  children?: React.ReactNode;
  /**
   * A card beside the copy — in practice the booking ticket, on the two
   * service landing pages.
   *
   * When this is present the photograph is NOT rendered. The band would
   * otherwise carry a tall ticket, a photo panel and the copy across one row,
   * which is three focal points competing at the top of a page whose job is to
   * get one booking started. Both service pages carry the frame in the section
   * immediately below instead.
   */
  aside?: React.ReactNode;
}) {
  const showPhoto = Boolean(photo) && !aside;

  return (
    // No -mt-20/pt-20 any more. That pair existed to slide a dark photograph
    // UNDER a transparent header; this band is the canvas and the header is
    // solid on every route except '/' (see HeaderShell), so there is nothing
    // left to slide under and the offset would only add 80px of dead space.
    <Section tone="canvas" spacing="md">
      <Container>
        <div
          className={
            showPhoto || aside
              ? 'grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16'
              : 'flex flex-col'
          }
        >
          <div className="flex flex-col items-start">
            {/* onLight, because this band is the canvas now. The default is
                onDark — navy-300 link, navy-100 current — which measured
                1.85:1 and 1.10:1 once the band stopped being navy. */}
            <Breadcrumbs crumbs={crumbs} tone="onLight" />

            <Eyebrow rule className="mt-8">
              {eyebrow}
            </Eyebrow>

            <h1 className="text-display-xl text-heading mt-5 max-w-[18ch]">{title}</h1>

            {subhead ? (
              // max-w-[28ch], not the lead's measure: at display-md a line this
              // size running to 46ch is four words short of the H1's own width
              // and the two stop reading as a heading and its promise.
              <p className="text-display-md text-body mt-4 max-w-[28ch]">{subhead}</p>
            ) : null}

            {lead ? (
              // `text-balance` is dropped once there is more than one paragraph:
              // balancing is for a short block where an orphan is visible, and
              // applied per-paragraph across three of them it makes each one a
              // different width, which reads as ragged rather than as balanced.
              <div
                className={`mt-6 flex flex-col gap-4 ${
                  showPhoto || aside ? 'max-w-[46ch]' : 'max-w-[58ch]'
                }`}
              >
                {(typeof lead === 'string' ? [lead] : lead).map((paragraph) => (
                  <p
                    key={paragraph}
                    className={`text-lead text-body ${typeof lead === 'string' ? 'text-balance' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {children ? (
              <div className="mt-9 flex flex-wrap items-center gap-3">{children}</div>
            ) : null}
          </div>

          {aside ? <div className="relative z-10 w-full">{aside}</div> : null}

          {showPhoto ? (
            <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl lg:aspect-square">
              <Photo
                name={photo}
                alt=""
                fill
                // Above the fold on its own route, so it is the LCP element
                // here and must not be lazy.
                priority
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="absolute inset-0 h-full w-full"
                imageClassName={`object-cover ${objectPosition}`}
              />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
