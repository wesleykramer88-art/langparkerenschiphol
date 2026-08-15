import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * Vertical rhythm and background tone for a page band.
 *
 * Sections own vertical spacing only; horizontal gutters belong to <Container>.
 * Keeping that split means a section can go full-bleed (a marquee, a photo band)
 * without fighting padding it did not ask for.
 */
const section = cva('relative', {
  variants: {
    tone: {
      /** The warm page canvas. The default; most sections use it. */
      canvas: 'bg-canvas text-body',
      /** A white band, to separate two canvas sections without a rule. */
      surface: 'bg-surface text-body',
      /** Navy. Reserved for moments that carry weight: security, closing CTA. */
      inverse: 'bg-surface-inverse text-body-inverse',
      inverseAlt: 'bg-surface-inverse-alt text-body-inverse',
      /** Accent wash. Use at most once per page, or it stops meaning anything. */
      accent: 'bg-accent-wash text-body',
    },
    /**
     * ── Raised one step, August 2026 ───────────────────────────────────────
     * The client asked for the site to read lighter and calmer — the Parkos /
     * Eazzypark feel, which is airiness rather than a different palette. Most
     * of that is bought here: 160px between desktop sections instead of 128px.
     *
     * Changed in this one file rather than per section, which is the whole
     * reason the variants exist. A fourth step was NOT added: a scale with an
     * extra rung invites per-section drift, and drift is what this file is for
     * preventing.
     *
     * `none` is untouched and stays the escape hatch for a band that owns its
     * own rhythm. TrustStrip is the one that uses it, and its padding must not
     * be swept into this — see the note there.
     */
    spacing: {
      none: '',
      sm: 'py-14 sm:py-20',
      md: 'py-20 sm:py-24 lg:py-32',
      lg: 'py-24 sm:py-32 lg:py-40',
    },
  },
  defaultVariants: { tone: 'canvas', spacing: 'md' },
});

type SectionProps = React.ComponentPropsWithoutRef<'section'> & VariantProps<typeof section>;

export function Section({ tone, spacing, className, ...props }: SectionProps) {
  return <section className={cn(section({ tone, spacing }), className)} {...props} />;
}

/**
 * There is deliberately no <SectionHeader> here any more.
 *
 * There was one — eyebrow, heading, optional lead, align left or centre — and
 * every section on the homepage called it. That is exactly why every section
 * looked like the same section: nine bands opening with an identical block, and
 * the only variable a boolean for centring. A component that renders the top of
 * every section will make every section read the same, however good it is.
 *
 * Sections now compose their own openings from <Eyebrow>, a heading and the
 * grid they need. The service chooser and the process band split the header
 * across the measure with a supporting line set right; the FAQ and the
 * testimonials put theirs in a sticky column; the photographic bands set theirs
 * over the image. None of those are variants of one shape, and none of them
 * should have to be.
 *
 * If a future page wants a shared intro, the thing to share is <Eyebrow> and
 * the type scale — both of which already exist — not the layout.
 */
