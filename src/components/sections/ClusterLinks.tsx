import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { seoCluster } from '@/config/site';

/**
 * The cluster's internal links.
 *
 * Five pages that each take one facet of the same proposition, so each one
 * links to the other four. The client's SEO document asks for exactly this and
 * qualifies it: "laat de pagina's onderling naar elkaar linken op een
 * natuurlijke manier".
 *
 * `natuurlijk` is why this is a labelled section with a sentence per link and
 * not a row of naked anchors in the footer. A block of five keyword-shaped
 * links with nothing around them is a link farm whatever it is called, and it
 * reads as one to a person as well as to a crawler. Each row here says what is
 * on the other page, which is the thing that makes a visitor click it.
 *
 * The current page removes itself. A page linking to itself in its own "read
 * more" block is the tell that the list was pasted rather than built.
 *
 * ── Contrast ────────────────────────────────────────────────────────────────
 * On the canvas: navy-950 label 15.01:1, ink-500 blurb 4.87:1 (AA at 14px,
 * needs 4.5). The hover state moves the label to navy-600, 6.29:1 on canvas.
 */
export function ClusterLinks({
  currentPath,
  heading = 'Meer over parkeren bij Schiphol',
  eyebrow = 'Verder lezen',
}: {
  /** This page's own path, so it is dropped from the list. */
  currentPath: string;
  heading?: string;
  eyebrow?: string;
}) {
  const links = seoCluster.filter((link) => link.href !== currentPath);

  return (
    <Section spacing="md" aria-labelledby="cluster-heading">
      <Container>
        <Reveal className="max-w-[34ch]">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <h2 id="cluster-heading" className="text-display-md mt-5">
            {heading}
          </h2>
        </Reveal>

        {/* <div>, not <li>: <Stagger as="ul"> supplies the <li>, so an <li> here
            nested one inside another. Pre-existing; found while verifying the
            August 2026 copy pass. */}
        <Stagger as="ul" className="divide-line border-line mt-10 divide-y border-y">
          {links.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className="group ease-settle flex items-start justify-between gap-6 py-6 transition-colors duration-(--duration-micro)"
              >
                <span className="min-w-0">
                  <span className="text-heading group-hover:text-brand ease-settle block text-base font-semibold transition-colors duration-(--duration-micro) sm:text-lg">
                    {link.label}
                  </span>
                  <span className="text-muted mt-1.5 block max-w-[52ch] text-sm leading-relaxed">
                    {link.blurb}
                  </span>
                </span>
                <ArrowRight
                  data-arrow
                  className="text-accent ease-settle mt-1 size-5 shrink-0 transition-transform duration-(--duration-micro) group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
