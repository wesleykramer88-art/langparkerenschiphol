import { cn } from '@/lib/cn';

/**
 * ============================================================================
 * SIGNATURE ELEMENT — the parking ticket.
 * ============================================================================
 *
 * This site has exactly one memorable device and this is it. The hero
 * reservation card is shaped like the physical ticket a driver takes at a
 * barrier; the price summary on /tarieven/ reuses the same shape. Everything
 * else on the site stays quiet so this reads as deliberate rather than as one
 * decoration among many.
 *
 * Anatomy, top to bottom:
 *
 *   ┌─────────────────────────┐
 *   │  <Ticket>               │  the card body
 *   │                         │
 *  ─┤  <TicketTear />         ├─ punched notches + dashed tear rule
 *   │                         │
 *   │  <TicketStub>           │  reference / total, set in mono
 *   └─────────────────────────┘
 *
 * The notches are painted in the colour of whatever sits BEHIND the card, so the
 * punch has to be told what that is. Every consumer therefore sets `notch` to
 * match its surrounding section — get it wrong and you see two coloured dots
 * instead of two holes.
 */

const notchColors = {
  canvas: '[--notch-color:var(--color-canvas)]',
  surface: '[--notch-color:var(--color-surface)]',
  sunken: '[--notch-color:var(--color-surface-sunken)]',
  inverse: '[--notch-color:var(--color-surface-inverse)]',
  inverseAlt: '[--notch-color:var(--color-surface-inverse-alt)]',
  accentWash: '[--notch-color:var(--color-accent-wash)]',
} as const;

export type NotchColor = keyof typeof notchColors;

type TicketProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * The background the ticket is sitting on. Required in practice: the punched
   * notches are painted this colour to read as holes.
   */
  notch?: NotchColor;
  tone?: 'surface' | 'inverse';
};

export function Ticket({
  notch = 'canvas',
  tone = 'surface',
  className,
  children,
  ...props
}: TicketProps) {
  return (
    <div
      className={cn(
        // --radius-2xl. The ticket is the ONE element allowed to be softer than
        // the rest of the page, because it is the signature — everything around
        // it holds --radius-md/--radius-xl so this reads as deliberate.
        'relative rounded-2xl',
        tone === 'surface'
          ? 'bg-surface text-body shadow-ticket'
          : 'bg-surface-inverse text-body-inverse shadow-ticket',
        notchColors[notch],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * The perforation: two punched notches and the dashed rule between them.
 *
 * The notches hang off both edges of this element, so it must span the ticket's
 * full width — do not nest it inside a padded wrapper.
 */
export function TicketTear({
  size = 'md',
  notches = true,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  size?: 'sm' | 'md';
  /**
   * Draw the punched notches.
   *
   * Set to false when the card floats over a photograph. The punches are
   * painted in the colour of whatever is behind the card, which is the only way
   * a solid circle can read as a hole — and over an image there is no such
   * colour. A navy dot on a photograph reads as a dot. The dashed rule alone
   * still says "ticket", so that is what is kept.
   */
  notches?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative',
        notches && 'ticket-notch',
        size === 'sm' ? '[--notch-size:1.125rem]' : '[--notch-size:1.5rem]',
        // Centre the punches on the dashed rule itself.
        '[--notch-y:50%]',
        className,
      )}
      {...props}
    >
      {/* Inset so the dashes stop short of the punches rather than running
          into them. */}
      <div className={cn('ticket-tear', notches && 'mx-4')} />
    </div>
  );
}

/**
 * The perforation used as a divider between two page sections.
 *
 * Same idea as <TicketTear>, one scale up: a dashed hairline across the content
 * measure with a punch at each end, sitting on the seam between two sections. It
 * ties the page's joins back to the signature element without introducing a new
 * one. Part 4 of the brief: use it at two or three joins, not at every one.
 *
 * `notch` is the colour of the section ABOVE the seam — that is what shows
 * through the punch. The dash colour follows the section below, which is why
 * `tone` exists separately.
 */
export function SectionTear({
  notch = 'canvas',
  tone = 'light',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  notch?: NotchColor;
  /** The section the divider sits ON. Dark sections need a lighter dash. */
  tone?: 'light' | 'dark';
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'ticket-notch relative [--notch-size:1.75rem] [--notch-y:0px]',
        notchColors[notch],
        tone === 'dark' && '[--tear-color:var(--color-line-inverse)]',
        className,
      )}
      {...props}
    >
      <div className="ticket-tear" />
    </div>
  );
}

/**
 * The stub. Carries a reference, a total, or a computed duration — always set in
 * mono with tabular figures so the digits line up like a departure board.
 *
 * `label` names the value; `value` is the value. Keep the label short: on a real
 * ticket it is printed small because the number is the point.
 */
export function TicketStub({
  label,
  value,
  meta,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  label: string;
  value: React.ReactNode;
  /** Optional third column, e.g. a location or service code. */
  meta?: React.ReactNode;
}) {
  return (
    <div
      className={cn('flex items-end justify-between gap-4 px-6 pt-4 pb-6', className)}
      {...props}
    >
      <div className="min-w-0">
        <p className="eyebrow text-muted">{label}</p>
        <p className="numeric text-heading mt-1.5 truncate text-lg font-medium">{value}</p>
      </div>
      {meta ? <div className="numeric text-muted shrink-0 text-xs">{meta}</div> : null}
    </div>
  );
}
