import { cn } from '@/lib/cn';
import { photos, type PhotoName } from '@/config/images';
import { allowedWidthsUpTo } from '@/config/image-sizes';

/**
 * The hero photograph, art-directed: a portrait crop on phones, the landscape
 * original everywhere else.
 *
 * ── Why this is not <Photo> ────────────────────────────────────────────────
 * next/image cannot art-direct. It renders a single <img> and picks a RESOLUTION
 * from `sizes`; it has no way to pick a different CROP at a different width.
 * That is what is needed here, and the difference is not cosmetic:
 *
 *   landscape source   2400 × 1340   = 1.79 : 1
 *   phone viewport      360 ×  780   = 0.46 : 1
 *
 * `object-cover` between those two throws away roughly three quarters of the
 * width. On the client's own hero — the branded van under the Vertrek 2 sign —
 * what survived on a phone was a strip of tinted glass. He reported it as the
 * image "looking bad on mobile". It was worse than that: the photograph was
 * doing no work at all, on the pages where most of his traffic is.
 *
 * ── Why not two <Image>s with `hidden` ─────────────────────────────────────
 * The obvious workaround is to render both and hide one with CSS. Browsers
 * still download an <img> inside a `display: none` parent, and this is the LCP
 * element on the busiest page of the site — so that costs every phone visitor a
 * full extra hero download to show them nothing. A <picture> with a `media`
 * source is the one construct where the browser evaluates the condition BEFORE
 * fetching, and downloads exactly one.
 *
 * ── The srcset is built against Next's optimiser ────────────────────────────
 * `/_next/image` is the same endpoint next/image itself points at, so both
 * crops still get resized, cached and format-negotiated: the optimiser reads
 * the Accept header and returns AVIF or WebP per `images.formats` in
 * next.config.ts. Nothing is served unoptimised, and no second copy of the
 * pipeline exists.
 */

/**
 * Candidate widths per crop.
 *
 * These are WISHES, not the final list: `allowedWidthsUpTo` drops anything the
 * optimiser would reject and anything that would upscale past the source. Every
 * width here must survive that filter or the browser can pick a URL that 400s,
 * which renders as no image at all and logs nothing. See config/image-sizes.ts.
 */
const PORTRAIT_WIDTHS = [384, 640, 750, 828, 1080] as const;
const LANDSCAPE_WIDTHS = [640, 828, 1080, 1200, 1920, 2048] as const;

/**
 * The optimiser endpoint next/image uses. Public and stable.
 *
 * THE TRAILING SLASH IS REQUIRED. `trailingSlash: true` in next.config.ts
 * applies to the built-in image route as well as to pages: `/_next/image?…`
 * 308s to `/_next/image/?…`. next/image emits the slashed form itself, which is
 * how it goes unnoticed — hand-written URLs do not, and every hero variant then
 * pays a redirect before a byte of image arrives, on the LCP element, on the
 * busiest page of the site.
 */
function optimised(src: string, width: number, quality = 75): string {
  return `/_next/image/?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

function srcSet(src: string, widths: readonly number[]): string {
  return widths.map((width) => `${optimised(src, width)} ${width}w`).join(', ');
}

export function HeroPhoto({
  name,
  portraitName,
  /** Below this width the portrait crop is used. */
  breakpoint = 640,
  alt = '',
  className,
  imageClassName,
}: {
  name: PhotoName;
  portraitName: PhotoName;
  breakpoint?: number;
  alt?: string;
  className?: string;
  imageClassName?: string;
}) {
  const landscape = photos[name];
  const portrait = photos[portraitName];

  return (
    <div className={cn('photo', className)}>
      {/* `block h-full w-full` is load-bearing. <picture> defaults to
          display: inline with no height of its own, so the <img>'s `h-full`
          resolves against an auto-height inline box and collapses — the
          photograph simply does not appear, and the hero renders as a flat navy
          field with nothing logged anywhere to say why. */}
      <picture className="block h-full w-full">
        <source
          media={`(max-width: ${breakpoint - 1}px)`}
          srcSet={srcSet(portrait.src, allowedWidthsUpTo(portrait.width, PORTRAIT_WIDTHS))}
          sizes="100vw"
        />
        <source
          srcSet={srcSet(landscape.src, allowedWidthsUpTo(landscape.width, LANDSCAPE_WIDTHS))}
          sizes="100vw"
        />
        {/* A bare <img> on purpose: it is the fallback child of <picture>, and
            <picture> art direction is the whole point of this component.
            next/image cannot switch crops at a breakpoint. See above. */}
        <img
          src={optimised(landscape.src, 1200)}
          alt={alt}
          width={landscape.width}
          height={landscape.height}
          // The LCP element on the homepage. It must not be lazy, and it must be
          // discoverable by the preload scanner in the initial HTML — which is
          // the other reason this is a plain <picture> and not a client-rendered
          // swap.
          fetchPriority="high"
          decoding="async"
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      </picture>
    </div>
  );
}
