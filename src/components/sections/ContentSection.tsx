import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import type { PhotoName } from '@/config/images';

/**
 * A prose band: eyebrow, H2, one or more paragraphs, an optional bullet list,
 * and an optional photograph across the measure.
 *
 * The five SEO cluster pages are mostly this shape — the client's content
 * document specifies them as a sequence of "Sectie over X" blocks — and writing
 * that markup out seven times is how seven pages quietly stop matching.
 *
 * ── What this is NOT ────────────────────────────────────────────────────────
 * It is not a <SectionHeader>. There was one of those and it was deleted for
 * good reason: every homepage section opened with an identical block, so every
 * section read the same (see the note at the foot of Section.tsx). The
 * difference is that THOSE sections each have their own argument and shape,
 * while these are consecutive passages of body copy on one page — a form where
 * consistency is the point rather than the failure.
 *
 * Which is also the limit. If a section wants to be anything other than a
 * passage of prose, it composes its own markup. Do not add variants here.
 *
 * `reversed` mirrors the photograph across the measure so consecutive
 * illustrated sections do not stack into a column of identical rows.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 * canvas: navy-950 heading 15.01:1, ink-700 body 8.51:1, ink-500 aside 4.87:1.
 * surface: 16.90:1, 9.58:1, 5.48:1. Both AA or better at every size used here.
 */
export function ContentSection({
  id,
  eyebrow,
  title,
  paragraphs,
  bullets,
  photo,
  photoAlt,
  objectPosition = 'object-center',
  reversed = false,
  tone = 'canvas',
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  photo?: PhotoName;
  /** Override the manifest alt where this crop shows something more specific. */
  photoAlt?: string;
  objectPosition?: string;
  reversed?: boolean;
  tone?: 'canvas' | 'surface';
  /** A CTA or a note, after the copy. */
  children?: React.ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;

  const copy = (
    <div>
      <Reveal>
        {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
        <h2 id={headingId} className={`text-display-md ${eyebrow ? 'mt-5' : ''}`}>
          {title}
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body max-w-[62ch] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      {bullets?.length ? (
        <Reveal delay={80}>
          <ul className="divide-line border-line mt-8 divide-y border-y">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3.5 py-3.5">
                <Check className="text-accent mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden />
                <span className="text-sm sm:text-base">{bullet}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {children ? <Reveal delay={120}>{children}</Reveal> : null}
    </div>
  );

  return (
    <Section
      id={id}
      tone={tone}
      spacing="md"
      aria-labelledby={headingId}
      className={id ? 'scroll-mt-28' : undefined}
    >
      <Container>
        {photo ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className={reversed ? 'lg:order-2' : undefined}>
              <div className="shadow-photo relative aspect-4/3 overflow-hidden rounded-xl">
                <Photo
                  name={photo}
                  alt={photoAlt}
                  fill
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imageClassName={`object-cover ${objectPosition}`}
                />
              </div>
            </Reveal>
            <div className={reversed ? 'lg:order-1' : undefined}>{copy}</div>
          </div>
        ) : (
          <div className="max-w-[72ch]">{copy}</div>
        )}
      </Container>
    </Section>
  );
}
