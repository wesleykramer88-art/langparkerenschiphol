import Image from 'next/image';
import { photos, type PhotoName } from '@/config/images';

/**
 * One of the client's driver-app screen captures.
 *
 * ── Why this is not <Photo> ─────────────────────────────────────────────────
 * <Photo> applies the house grade: saturate(0.82), contrast(1.06) and an 8%
 * navy veil, plus overflow-hidden and a fill mode. That grade exists to pull
 * photographs shot under different light onto one hue line, and it is exactly
 * wrong here — desaturating a user interface and laying a blue cast over its
 * white cards does not read as "graded", it reads as a screenshot that has gone
 * wrong. So this renders next/image directly and takes the LQIP and the
 * dimensions from the same manifest.
 *
 * ── The app is teal-green, and that is allowed here ─────────────────────────
 * Green is not in this palette and is deliberately excluded from it. These two
 * images are evidence of a third-party tool rather than a brand surface, which
 * is a different thing — the way a screenshot of a bank's app in a case study
 * is not a claim about the case study's colours.
 *
 * What keeps it from reading as a palette break is placement: the capture sits
 * on a paper panel with generous padding, so the green is contained by a frame
 * rather than bleeding to a section edge, and it is never set beside the accent.
 * Do not put one of these next to an orange button.
 *
 * ── Sized by HEIGHT, not width ──────────────────────────────────────────────
 * The two captures have noticeably different aspect ratios — 0.65:1 and 0.51:1
 * — so a shared `max-width` renders them at two different heights, and the two
 * sections that use them then have two different panel sizes for no reason a
 * reader could name. Worse, at a width that fills a half-measure column they
 * run past 800px tall, which leaves the paragraph beside them floating in the
 * middle of a wall of empty panel.
 *
 * So the frame is a fixed height and the image is `h-full w-auto` inside it.
 * Both captures then come out the same height, the width follows from each
 * one's own ratio, and the panel is proportionate to the copy it sits beside.
 */
export function AppScreenshot({
  name,
  className,
  alt,
}: {
  name: PhotoName;
  className?: string;
  /** Optional page-specific alt text; falls back to the manifest description. */
  alt?: string;
}) {
  const photo = photos[name];

  return (
    <div
      className={`bg-surface-sunken border-line shadow-card flex h-96 items-center justify-center rounded-xl border p-6 sm:h-112 sm:p-8 ${className ?? ''}`}
    >
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        blurDataURL={photo.blurDataURL}
        placeholder="blur"
        loading="lazy"
        // The rendered box is only ~230px wide, so the browser never needs the
        // 900–1000px master. Without this it would fetch a 2x source for an
        // element the size of a phone in the hand.
        sizes="16rem"
        className="h-full w-auto max-w-full rounded-[1.5rem] object-contain"
      />
    </div>
  );
}
