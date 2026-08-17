'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type AccordionItem = {
  question: string;
  /**
   * One paragraph, or several. Structurally identical to `FaqItem` in
   * lib/schema.ts — deliberately declared here rather than imported, so a UI
   * primitive does not depend on the schema layer, and every caller passes the
   * same shape to both.
   */
  answer: string | readonly string[];
};

/**
 * FAQ accordion.
 *
 * Built on a real <button> with aria-expanded and aria-controls, so it is
 * operable with Enter and Space and announces its state. The panel is a labelled
 * region pointing back at its trigger.
 *
 * The open/close animation uses grid-template-rows 0fr→1fr rather than
 * measuring heights in JS: no layout thrash, no ResizeObserver, and it degrades
 * to an instant toggle under the global prefers-reduced-motion rule in
 * globals.css without this component knowing anything about it.
 *
 * The panel stays in the DOM when collapsed (hidden from AT via the collapsed
 * grid row and `inert`), because the same copy is emitted as FAQPage JSON-LD and
 * Google expects the answer text to be present in the rendered page.
 */
export function Accordion({
  items,
  /** Index opened on first paint. `null` opens nothing. */
  defaultOpen = null,
  className,
}: {
  items: readonly AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('divide-line border-line divide-y border-y', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  'flex w-full items-start justify-between gap-6 py-5 text-left',
                  'ease-settle min-h-[3.25rem] transition-colors duration-(--duration-micro)',
                  'hover:text-brand',
                  isOpen && 'text-brand',
                )}
              >
                <span className="text-base font-semibold sm:text-lg">{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border',
                    'ease-settle transition-[transform,background-color,border-color] duration-(--duration-micro)',
                    isOpen
                      ? 'border-accent bg-accent text-on-accent rotate-45'
                      : 'border-line-strong text-ink-500',
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.25} />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
              className={cn(
                'ease-settle grid transition-[grid-template-rows] duration-(--duration-micro)',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              {/* An answer may be one paragraph or several — see FaqItem. The
                  padding-bottom moves to the wrapper so it is not repeated
                  between paragraphs, and the gap does the separating. */}
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 pb-6">
                  {(typeof item.answer === 'string' ? [item.answer] : item.answer).map(
                    (paragraph) => (
                      <p key={paragraph} className="text-body max-w-[62ch] pr-10">
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
