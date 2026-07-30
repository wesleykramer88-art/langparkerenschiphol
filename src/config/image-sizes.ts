/**
 * The widths Next's image optimiser will serve.
 *
 * ── Why this is its own module ─────────────────────────────────────────────
 * `/_next/image` rejects any `w` that is not in `deviceSizes ∪ imageSizes`. It
 * responds 400 with a plain-text body:
 *
 *     "w" parameter (width) of 360 is not allowed
 *
 * next/image never trips over this because it generates its `srcset` from the
 * same config. <HeroPhoto> builds its own srcset by hand — art direction needs
 * a real <picture>, which next/image cannot produce — so it has to respect the
 * same list, and this file is what makes that a shared fact rather than two
 * copies that agree until one is edited.
 *
 * It cost an afternoon once already: a hand-written srcset offered 360w and
 * 480w, the browser on a 360px phone picked 360w, got a 400, and rendered
 * nothing. `complete` was true and `naturalWidth` was 0, there was no console
 * error, and the hero looked exactly like a deliberately dark navy band.
 *
 * next.config.ts imports these so the optimiser and the srcset builders are
 * driven by one array. Do not inline either list anywhere else.
 */

/** Full-width candidates. Next's own defaults, stated explicitly. */
export const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;

/** Fixed-size candidates, for images narrower than the viewport. */
export const IMAGE_SIZES = [32, 48, 64, 96, 128, 256, 384] as const;

/** Everything the optimiser accepts, ascending. */
export const ALLOWED_IMAGE_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

/**
 * Clamp a wish-list of widths to what the optimiser will actually serve, and
 * drop anything that would upscale past the source.
 *
 * Upscaling is worth excluding rather than merely tolerating: the optimiser
 * happily returns a 2048px render of a 1005px source, which costs bytes and
 * buys no detail.
 */
export function allowedWidthsUpTo(sourceWidth: number, wanted: readonly number[]): number[] {
  const widths = wanted.filter(
    (width) => (ALLOWED_IMAGE_WIDTHS as readonly number[]).includes(width) && width <= sourceWidth,
  );

  // Always offer at least one candidate, even for a very small source.
  if (widths.length === 0) {
    const smallest = ALLOWED_IMAGE_WIDTHS.find((width) => width >= sourceWidth);
    return [smallest ?? ALLOWED_IMAGE_WIDTHS[ALLOWED_IMAGE_WIDTHS.length - 1]];
  }

  return widths;
}
