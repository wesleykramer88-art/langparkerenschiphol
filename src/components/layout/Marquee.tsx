import { cn } from '@/lib/cn';

/**
 * The terminal label strip that runs above the header.
 *
 * Client-approved. It is the first thing on the page, so it is a Server
 * Component with a pure-CSS animation: no JS, no hydration, nothing on the
 * critical path.
 *
 * The label set is rendered twice. Copy one is read by assistive technology;
 * copy two is aria-hidden, so the strip announces its four labels once rather
 * than eight times.
 */
export function Marquee({
  items,
  className,
  /** Seconds for one full pass. Slower than it feels like it should be — fast
   *  scrolling text is unreadable and reads as a banner ad. */
  duration = 46,
}: {
  items: readonly string[];
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        'marquee-pausable border-line-inverse bg-surface-inverse overflow-hidden border-b',
        className,
      )}
    >
      <div
        className="marquee-track"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <MarqueeTrack items={items} />
        <MarqueeTrack items={items} hidden />
      </div>
    </div>
  );
}

/**
 * One pass of the label set. Declared at module scope, not inside Marquee —
 * a component defined during render is a new type on every render, which
 * remounts its subtree and discards the running CSS animation.
 */
function MarqueeTrack({ items, hidden }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="eyebrow text-navy-200 px-5 py-2.5 whitespace-nowrap">{item}</span>
          {/* Separator in hi-vis orange — the one place the accent appears above
              the fold apart from the primary CTA. */}
          <span aria-hidden className="bg-accent size-1 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
