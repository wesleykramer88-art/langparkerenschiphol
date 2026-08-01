'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { Ticket, TicketTear } from '@/components/ui/Ticket';
import type { NotchColor } from '@/components/ui/Ticket';
import {
  IFRAME_HEIGHT_EPSILON,
  IFRAME_HEIGHT_PADDING,
  IFRAME_HEIGHT_SLACK,
  IFRAME_MAX_HEIGHT,
  IFRAME_MIN_HEIGHT,
  PARKINGPRO_EVENTS,
  PARKINGPRO_ORIGIN,
  isParkingProOrigin,
  readParkingProMessage,
} from '@/lib/parkingpro';
import { readReservationReference, readReservationValue, trackPurchase } from '@/lib/analytics';

/**
 * The one component that embeds MyParkingPro.
 *
 * It never builds a URL. `src` is composed on the server by the builders in
 * src/lib/parkingpro.ts and passed in, so no page — and nothing in the client
 * bundle — knows a path or a location GUID.
 *
 * ── The one rule ────────────────────────────────────────────────────────────
 * The failure mode must be "too tall", never "unreachable".
 *
 * Extra whitespace under a short step is cosmetic and nobody complains about
 * it. A frame that cuts off above the submit button is a lost booking, and the
 * visitor has no way to tell that anything is even wrong — the content is
 * there, it simply cannot be reached. Every decision below follows from that
 * asymmetry, and an earlier version of this file got each of them backwards.
 *
 * Three things keep content reachable, and they are deliberately redundant:
 *
 *   1. `scrolling="yes"`. Inner scroll is the safety net for when the height
 *      bridge fails. It is not a fallback we hope never runs — it is what makes
 *      a broken bridge survivable instead of fatal.
 *   2. The reserved height starts at the plugin's own generous default for this
 *      embed (PARKINGPRO_DEFAULT_HEIGHTS), so the frame is fully usable before
 *      a single message arrives — and there is no layout shift when one does.
 *   3. Nothing in the chain caps the height. No aspect-ratio, no max-height, no
 *      `overflow: hidden` on the frame or on the ticket card around it.
 *
 * ── What the embed actually reports, and why it must be probed ──────────────
 * MyParkingPro reports a height over postMessage, but NOT the one you would
 * assume. Its own measurement, read from the embed's bundle, is:
 *
 *     Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight,
 *              documentElement.scrollHeight, documentElement.offsetHeight,
 *              documentElement.clientHeight)
 *
 * `documentElement.clientHeight` is the frame's own viewport — the height WE
 * set. So the reported value is `max(content, frameHeight)`, and an embed whose
 * content is shorter than its frame can only ever report the frame back at us.
 * Two consequences, and both have bitten this file:
 *
 *   A frame can never shrink on its own evidence. /login/ reserved the
 *   plugin's 1500px for a sign-in form less than half that tall, reported 1500
 *   forever, and stayed at 1500 forever.
 *
 *   Acting on that echo is a runaway. `height = reported + PADDING` where
 *   `reported === height` grows the frame 50px, which triggers another report,
 *   which grows it again, without bound.
 *
 * So the frame is MEASURED before it is shown: it is rendered at
 * IFRAME_MIN_HEIGHT, behind the loading state, inside a card still holding its
 * full reserved height. The embed forces a report on load and on every resize,
 * so an answer is guaranteed, and measured against a frame that small the
 * answer is the content's own height. That first report sets the height and
 * ends the probe. Nothing of it is visible.
 *
 * Afterwards the frame is only resized when a report says something the
 * current height does not already satisfy:
 *
 *   GROW   when the content OVERFLOWS the frame by more than
 *          IFRAME_HEIGHT_EPSILON. Echoes report at `current` and are ignored.
 *   SHRINK when the frame is more than IFRAME_HEIGHT_SLACK taller than the
 *          content. Slack exceeds the padding, so a shrink settles in one step
 *          instead of chasing itself down.
 *   Otherwise leave it alone.
 *
 * All of it is only safe because of `scrolling="yes"` above: if a measurement
 * is wrong and the frame ends up too short, the content is still reachable
 * rather than lost. Under the old no-inner-scroll architecture the same probe
 * would have been unthinkable. IFRAME_MIN_HEIGHT and IFRAME_MAX_HEIGHT are the
 * backstops at either end.
 *
 * ── Trust ───────────────────────────────────────────────────────────────────
 * Every listener checks `isParkingProOrigin(event.origin)` before reading the
 * payload. Without that check any page in any tab could post a
 * `reservationAdded` message and redirect this visitor wherever it liked.
 */

export function ParkingProFrame({
  src,
  title,
  /** Stub label, e.g. "Reserveren". */
  label,
  /**
   * What the fallback link below the frame opens, as a noun phrase with its
   * article: "het reserveringssysteem", "de tarievencalculator". It is read
   * straight into "Open … in een nieuw tabblad".
   *
   * Required, because this component serves three different embeds and the
   * sentence used to be hardcoded as the booking one — so /tarieven/ offered to
   * open "het reserveringssysteem" and handed the visitor the rate table.
   */
  fallbackLabel,
  notch = 'canvas',
  /**
   * Height reserved before the frame reports its own, in px.
   *
   * This is the SSR height: what the box occupies until the first
   * `pageHeightChanged` arrives, so the embed is fully usable before a single
   * message lands and there is no layout shift when one does. Once the frame
   * reports a real content height the box follows it, up or down.
   *
   * Required, and it must be the plugin's own default for this embed — pass
   * PARKINGPRO_DEFAULT_HEIGHTS.booking / .rates / .login. There is deliberately
   * no default value here: a guess made at this end is how the frame ended up
   * reserving 620px for a 2200px booking flow.
   */
  initialHeight,
  /** Where to send the visitor once a booking completes. */
  onCompleteHref,
  className,
}: {
  src: string;
  title: string;
  label: string;
  fallbackLabel: string;
  notch?: NotchColor;
  initialHeight: number;
  onCompleteHref?: string;
  className?: string;
}) {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  /** Settled frame height. Only meaningful once `probing` is false. */
  const [height, setHeight] = useState(initialHeight);

  /**
   * True until the frame has told us how tall its content really is.
   *
   * While probing, the iframe is rendered at IFRAME_MIN_HEIGHT — the smallest
   * frame we ever show — so that the embed's first height report describes its
   * CONTENT rather than the box we put it in. See the note on measurement at
   * the top of this file. The card keeps its full reserved height throughout,
   * and the frame stays behind the loading state, so none of this is visible:
   * the visitor sees the spinner, then the frame at its correct height, once.
   *
   * A ref alongside the state because the message listener is registered once
   * and must read the live value without being torn down and rebuilt.
   */
  const [probing, setProbing] = useState(true);
  const probingRef = useRef(true);

  /** Loaded AND measured. Until both, the visitor sees the loading state. */
  const ready = loaded && !probing;

  // The vendor's JS and network cost must not compete with our own paint, so
  // the frame is given no `src` at all until it nears the viewport.
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ rootMargin: '400px 0px' });

  /** Post into the frame, but only ever to the ParkingPro origin. */
  const postToFrame = useCallback((message: unknown) => {
    frameRef.current?.contentWindow?.postMessage(message, PARKINGPRO_ORIGIN);
  }, []);

  /**
   * `scrolling="yes"`, set imperatively.
   *
   * This is the safety net, and it is the single most important line in the
   * file. If the height bridge fails — a payload shape change at the vendor's
   * end, an origin we no longer match, a browser that blocks the message — the
   * frame stays at its reserved height and the visitor scrolls inside it. The
   * booking still completes. With `scrolling="no"` the same failure hides the
   * submit button behind a wall, and nothing on our side detects it.
   *
   * The official plugin ships `scrolling="yes"` on every one of its four
   * shortcodes (v1.2.58, line 481). It never disables inner scrolling.
   *
   * It has to be done here rather than as a JSX prop because React 19 drops
   * `scrolling` — it is a deprecated HTML attribute with no React DOM mapping,
   * so the prop is silently discarded and never reaches the element. Verified:
   * `getAttribute('scrolling')` returned null with the prop present. Browsers
   * still honour the attribute, so it is set directly on the node.
   */
  useEffect(() => {
    frameRef.current?.setAttribute('scrolling', 'yes');
  }, [inView]);

  /**
   * Give up on measuring if the frame never answers.
   *
   * The embed forces a height report on its own `load` and again at 0ms, 250ms
   * and 1000ms, so an answer inside this window is close to certain. If none
   * comes — the bridge is blocked, the origin no longer matches, the vendor
   * changed the payload — the probe is abandoned and the frame is revealed at
   * its full reserved height with inner scrolling, which is the same behaviour
   * as if the bridge had never existed. The frame must never stay at the probe
   * height just because nobody replied.
   */
  useEffect(() => {
    if (!loaded || !probing) return;
    const timer = setTimeout(() => {
      probingRef.current = false;
      setProbing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [loaded, probing]);

  // ---------------------------------------------------------------------------
  // Inbound messages
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Origin check first, before touching the payload at all.
      if (!isParkingProOrigin(event.origin)) return;

      // The name arrives under `event`, not `type`. See readParkingProMessage.
      const parsed = readParkingProMessage(event.data);
      if (!parsed) return;
      const [name, message] = parsed;

      switch (name) {
        case PARKINGPRO_EVENTS.pageHeightChanged: {
          const next = message.newHeight ?? message.height;
          if (typeof next === 'number' && Number.isFinite(next) && next > 0) {
            // First report ends the probe. It was measured against a frame of
            // IFRAME_MIN_HEIGHT, so unless the content is smaller than that it
            // is the content's own height — take it at face value. `height`
            // state still holds the reserved value here and would be the wrong
            // thing to compare against, so the grow/shrink tests are skipped.
            if (probingRef.current) {
              probingRef.current = false;
              setProbing(false);
              setHeight(
                Math.min(
                  Math.max(next + IFRAME_HEIGHT_PADDING, IFRAME_MIN_HEIGHT),
                  IFRAME_MAX_HEIGHT,
                ),
              );
              break;
            }

            setHeight((prev) => {
              // Content overflows the frame — grow to fit it.
              if (next > prev + IFRAME_HEIGHT_EPSILON) {
                return Math.min(next + IFRAME_HEIGHT_PADDING, IFRAME_MAX_HEIGHT);
              }

              // Frame is meaningfully taller than its content — shrink to fit.
              if (next < prev - IFRAME_HEIGHT_SLACK) {
                return Math.max(next + IFRAME_HEIGHT_PADDING, IFRAME_MIN_HEIGHT);
              }

              // Everything in between is noise, and most of it is an echo of
              // our own last resize. Discarding it is what stops the frame
              // climbing forever — see the note on the feedback loop above.
              return prev;
            });
          }
          break;
        }

        case PARKINGPRO_EVENTS.scroll: {
          // The frame asks the PARENT to scroll, because what it wants in view
          // may be outside the parent's viewport entirely. The offset is
          // relative to the frame's top, so it has to be resolved against the
          // frame's position in this document.
          const offset = message.offset ?? message.scrollTop ?? message.position ?? 0;
          const top = (wrapperRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
          window.scrollTo({
            top: Math.max(0, top + offset - 96), // clear the sticky header
            behavior: 'smooth',
          });
          break;
        }

        case PARKINGPRO_EVENTS.reservationAdded: {
          const reference = readReservationReference(message.reservation);

          /**
           * Report the conversion HERE, not on the thank-you page.
           *
           * This is the only moment the booking's value exists on our side: it
           * is in the payload we were just handed, and it is deliberately not
           * carried across the navigation (see below). Firing on arrival at the
           * confirmation page instead would mean either a valueless conversion
           * — useless for ROAS, which is the whole point of this — or putting a
           * price in a query string, where a visitor can edit it and report
           * whatever revenue they like into the client's ad account.
           *
           * Deduplicated on the reference, because the confirmation page fires
           * a valueless backup for the case where the payment provider took
           * over the whole tab and this message was never delivered. Whichever
           * arrives first wins; see trackPurchase().
           */
          const { value, currency } = readReservationValue(message.reservation);
          trackPurchase({ transactionId: reference, value, currency, source: 'iframe' });

          if (!onCompleteHref) break;
          // ONLY the reference travels in the URL.
          //
          // The payload also carries the customer's name, e-mail and number
          // plate. Query strings end up in browser history, in server access
          // logs, and in the Referer header of every outbound request the next
          // page makes — including analytics. Putting personal data there would
          // publish it in three places nobody would think to look. The
          // confirmation page re-states what the customer already knows and
          // does not need it echoed back from a URL.
          router.push(
            reference ? `${onCompleteHref}?ref=${encodeURIComponent(reference)}` : onCompleteHref,
          );
          break;
        }

        case PARKINGPRO_EVENTS.registrationCompleted: {
          // Registration finishes inside the frame; it then shows its own signed
          // in state. Nothing to navigate to — just make sure the frame is in
          // view, since the confirmation may sit above the current scroll.
          wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }

        // Analytics is forwarded rather than re-implemented: the frame knows
        // which step the visitor reached, and this page does not. Both are
        // no-ops when no analytics is configured, which is the case in preview.
        case PARKINGPRO_EVENTS.gtag: {
          if (Array.isArray(message.args)) window.gtag?.(...message.args);
          break;
        }

        case PARKINGPRO_EVENTS.dataLayer: {
          if (message.data && Array.isArray(window.dataLayer)) window.dataLayer.push(message.data);
          break;
        }
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [router, onCompleteHref]);

  // ---------------------------------------------------------------------------
  // Outbound: tell the frame where the parent has scrolled to.
  //
  // The frame's own sticky elements (its step summary, its continue button)
  // cannot see the parent's scroll position. When the frame is sized to its
  // content — which is the normal case — the frame never scrolls internally, so
  // this is the only signal it has to position them against.
  //
  // Inert if the vendor ignores it.
  //
  // Deduplicated, and not only to save messages: anything we post can make the
  // vendor re-measure and re-report its height, so a message we did not need to
  // send is a resize we did not need to risk.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!loaded) return;

    let frame = 0;
    let lastOffset = -1;
    const onScroll = () => {
      // rAF-coalesced: scroll fires far more often than the frame can use.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;

        const offset = Math.round(Math.max(0, -rect.top));
        if (offset === lastOffset) return;
        lastOffset = offset;

        postToFrame({
          // Both keys, for the same reason we read both: the vendor's own
          // listeners key off `event`, and tolerance costs nothing here.
          event: PARKINGPRO_EVENTS.widgetScroll,
          type: PARKINGPRO_EVENTS.widgetScroll,
          // How far the parent has scrolled past the top of the frame, and how
          // much of the viewport the frame currently occupies.
          offset,
          viewportHeight: window.innerHeight,
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [loaded, postToFrame]);

  return (
    <div className={className}>
      {/* No `overflow-hidden` here. It would clip the frame the moment the
          content outgrew the card, which is the failure this component exists
          to prevent — and it was also clipping <TicketTear>'s punches, which
          hang deliberately outside both edges. The iframe rounds its own bottom
          corners instead. */}
      <Ticket notch={notch}>
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <p className="eyebrow text-muted">{label}</p>
          <p className="numeric text-muted text-xs">Beveiligde verbinding</p>
        </div>

        <TicketTear size="sm" />

        <div ref={wrapperRef} className="relative">
          {/* min-height, not height: it reserves the box for the loading state
              and for SSR, and then gets out of the way. The iframe decides how
              tall this ends up.

              While probing it holds the full reserved height even though the
              iframe inside it is only IFRAME_MIN_HEIGHT tall. That is what
              keeps the measurement invisible — the card does not collapse and
              rebound, and the page below it never moves. */}
          <div
            ref={inViewRef}
            className="relative"
            style={{ minHeight: probing ? initialHeight : height }}
          >
            {!ready ? (
              <div
                aria-hidden
                className="bg-surface-sunken absolute inset-0 grid place-items-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="border-line-strong border-t-accent size-6 animate-spin rounded-full border-2 motion-reduce:animate-none" />
                  <p className="text-muted text-sm">Laden…</p>
                </div>
              </div>
            ) : null}

            {inView ? (
              <iframe
                ref={frameRef}
                src={src}
                title={title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                // Least privilege that still lets a booking and a sign-in work:
                // scripts and same-origin for the vendor's own session, forms to
                // submit, top-navigation-by-user-activation for the payment
                // redirect. No allow-popups, no allow-downloads.
                sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation-by-user-activation"
                referrerPolicy="strict-origin-when-cross-origin"
                className={cn(
                  // rounded-b-2xl matches the ticket's own radius, so the frame
                  // sits flush in the card without an overflow ancestor to clip
                  // it. An iframe has no intrinsic height, so `height` here is
                  // the frame's size — not a cap on its content: inner scroll is
                  // on, and the height tracks what the frame reports.
                  'ease-settle block w-full rounded-b-2xl border-0 transition-opacity duration-(--duration-micro)',
                  ready ? 'opacity-100' : 'opacity-0',
                )}
                // Deliberately short while probing. See `probing` above.
                style={{ height: probing ? IFRAME_MIN_HEIGHT : height }}
              />
            ) : null}
          </div>
        </div>
      </Ticket>

      {/* The embed is a third party we do not control. If it is blocked — an ad
          blocker, a corporate proxy, a CSP we got wrong — there must still be a
          way through. Always visible, never revealed on failure: we cannot
          reliably detect the failure from out here. */}
      <p className="text-muted mt-4 text-sm">
        Lukt het niet?{' '}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand decoration-navy-300 hover:decoration-navy-600 underline underline-offset-4"
        >
          Open {fallbackLabel} in een nieuw tabblad
        </a>
        .
      </p>
    </div>
  );
}
