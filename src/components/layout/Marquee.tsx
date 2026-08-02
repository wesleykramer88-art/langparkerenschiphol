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
  /** Times the label set is repeated within one pass. The track translates
   *  exactly -50%, so a pass narrower than the viewport leaves a visible gap;
   *  a short label set needs repeating to stay wider than the widest screen. */
  repeat = 1,
}: {
  items: readonly string[];
  className?: string;
  duration?: number;
  repeat?: number;
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
        <MarqueeTrack items={items} repeat={repeat} />
        <MarqueeTrack items={items} repeat={repeat} hidden />
      </div>
    </div>
  );
}

/**
 * One pass of the label set. Declared at module scope, not inside Marquee —
 * a component defined during render is a new type on every render, which
 * remounts its subtree and discards the running CSS animation.
 *
 * Only the first block is exposed to assistive technology; the repeats exist
 * to fill the width, so announcing them would just stutter the same words.
 */
function MarqueeTrack({
  items,
  repeat,
  hidden,
}: {
  items: readonly string[];
  repeat: number;
  hidden?: boolean;
}) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {Array.from({ length: repeat }, (_, block) =>
        items.map((item) => (
          <li
            key={`${block}-${item}`}
            aria-hidden={block > 0 || undefined}
            className="flex items-center"
          >
            <span className="eyebrow text-navy-200 px-5 py-2.5 whitespace-nowrap">{item}</span>
            {/* Separator in hi-vis orange — the one place the accent appears above
                the fold apart from the primary CTA. */}
            <span aria-hidden className="bg-accent size-1 shrink-0 rounded-full" />
          </li>
        )),
      )}
    </ul>
  );
}
