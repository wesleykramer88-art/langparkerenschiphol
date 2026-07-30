import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import type { PhotoName } from '@/config/images';
import type { Crumb } from '@/lib/schema';

/**
 * The subpage hero.
 *
 * Deliberately NOT the homepage hero at a smaller size. That one is a stage:
 * near-full-viewport, an orchestrated load sequence, a booking ticket laid over
 * it, and the site's only use of the animation runtime. Reproducing it on seven
 * more pages would spend the effect entirely — the homepage hero only reads as
 * the hero because nothing else on the site is allowed to be it.
 *
 * This is a band instead: a fixed, shallow height, a photograph under the
 * signage scrim, the trail, the label, the H1, the lead. It says "you are here"
 * and gets out of the way. No motion at all — a page a visitor navigated to
 * deliberately should paint its heading immediately, not fade it in.
 *
 * ── The header clearance ────────────────────────────────────────────────────
 * The site header is transparent until scrolled and sits in normal flow at h-20.
 * `-mt-20 pt-20` pulls this band up by exactly the bar's height and pads the
 * content back down by the same amount, so the photograph slides UNDER the
 * transparent bar without moving a pixel of hero content. Without it the band
 * starts below the bar, the bar shows the cream canvas behind it, and the light
 * nav type over cream is invisible. Same trick as HeroSection — if you change
 * the header's height, both change together.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  photo,
  crumbs,
  /** Vertical crop of the photograph. Each frame has its own subject. */
  objectPosition = 'object-center',
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  photo: PhotoName;
  crumbs: readonly Crumb[];
  objectPosition?: string;
  /** Buttons or a note, under the lead. */
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-surface-inverse relative -mt-20 overflow-hidden pt-20">
      {/* Decorative. The H1 in front of it already names the page, and a screen
          reader gains nothing from a description of the backdrop. */}
      <div aria-hidden className="absolute inset-0">
        <Photo
          name={photo}
          alt=""
          fill
          // Above the fold on its own route, so it is the LCP element here and
          // must not be lazy — the same rule the homepage hero follows.
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imageClassName={`object-cover ${objectPosition}`}
        />

        {/*
          Two scrims, because the crop axis and the text width both change at lg.

          The first version of this was one flat navy veil at 82–94% across the
          whole frame. It was legible and it was wrong: it reduced every one of
          the client's photographs to dark texture, on a site whose brief opens
          with "I don't want stock, I want to use as many real photos as
          possible". A photograph nobody can make out is the same as no
          photograph, at the same number of bytes.

          Desktop uses `scrim-page` — directional like the homepage hero's, but
          holding its weight further across the frame. This band's lead runs to
          58ch with no booking card beside it, so the copy reaches past 60% of
          the width, where `scrim-hero` has already thinned to about 36%. Over
          the hi-vis jacket in the terminal frames that measures 3.5:1, which
          fails AA. See globals.css for the stops and the arithmetic.

          Mobile keeps a flat, heavy gradient: the copy runs the full width at
          that size, so there is no quiet side to move the photograph into.
        */}
        <div className="from-navy-950/92 via-navy-950/80 to-navy-950/90 absolute inset-0 bg-linear-to-b lg:hidden" />
        <div className="scrim-page absolute inset-0 hidden lg:block" />
      </div>

      <Container className="relative">
        <div className="flex flex-col py-12 sm:py-16 lg:py-20">
          <Breadcrumbs crumbs={crumbs} />

          <Eyebrow tone="accent" className="mt-9">
            {eyebrow}
          </Eyebrow>

          <h1 className="text-display-xl text-heading-inverse mt-5 max-w-[18ch]">{title}</h1>

          {lead ? (
            <p className="text-lead text-navy-100 mt-6 max-w-[58ch] text-balance">{lead}</p>
          ) : null}

          {children ? (
            <div className="mt-9 flex flex-wrap items-center gap-3">{children}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
