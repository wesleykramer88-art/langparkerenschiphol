import Image from 'next/image';
import { cn } from '@/lib/cn';
import { photos, type PhotoName } from '@/config/images';

/**
 * A photograph, in the house grade.
 *
 * Wraps next/image and applies three things every image on this site gets and
 * none should have to ask for: the `photo` grade from globals.css, the asset's
 * own LQIP so it resolves out of its own colours rather than out of a grey box,
 * and intrinsic dimensions read from the manifest so the box is reserved before
 * the bytes land.
 *
 * Callers name a photograph — <Photo name="deckAmber" /> — they do not type a
 * path. The manifest in config/images.ts is the only place a filename appears.
 */
export function Photo({
  name,
  sizes,
  priority = false,
  fill = false,
  className,
  imageClassName,
  /** Overrides the manifest's alt. Pass '' for a purely decorative placement. */
  alt,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  name: PhotoName;
  /** Required whenever the image is not a fixed known width — see next/image. */
  sizes?: string;
  priority?: boolean;
  /** Fill its positioned parent instead of flowing at its intrinsic ratio. */
  fill?: boolean;
  imageClassName?: string;
  alt?: string;
}) {
  const photo = photos[name];

  return (
    <div className={cn('photo', className)} {...props}>
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        blurDataURL={photo.blurDataURL}
        placeholder="blur"
        priority={priority}
        // The LCP image must not be lazy; everything else must be, or the hero
        // competes for bandwidth with photographs eight screens down.
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        className={cn(fill ? 'object-cover' : 'w-full', imageClassName)}
        {...(fill ? { fill: true } : { width: photo.width, height: photo.height })}
      />
    </div>
  );
}
