import { ParkingProFrame } from '@/components/booking/ParkingProFrame';
import { PARKINGPRO_DEFAULT_HEIGHTS, loginUrl } from '@/lib/parkingpro';
import type { NotchColor } from '@/components/ui/Ticket';

/**
 * The customer portal sign-in.
 *
 * A thin wrapper over <ParkingProFrame>, on purpose: the sign-in form is the
 * same kind of thing as the other two embeds — a third-party frame on the
 * vendor's origin — so it inherits the same guarantees rather than getting a
 * second, subtly different implementation of them. Sandboxing, lazy loading,
 * the height bridge, the origin check on every message, the fallback link.
 *
 * The URL comes from `loginUrl()`. On the old WordPress site this page used the
 * [pp_account_login_iframe] shortcode, which resolves to /account/login — a
 * different path from both the booking flow and the rates table. Phase 1 had
 * all three pointing at /parkingrates.
 *
 * It exists as its own component only so /login/ reads as a page about an
 * account rather than a page about a booking widget, and so the reserved height
 * — a sign-in form is much shorter than a booking flow — lives with the thing it
 * describes.
 *
 * ── One caveat worth knowing ────────────────────────────────────────────────
 * `sandbox` includes `allow-same-origin`, which the vendor needs to keep its own
 * session cookie. That is what makes a sign-in possible inside a frame at all;
 * it also means the frame is a full-privilege origin of its own. It is the
 * vendor's origin handling the vendor's credentials — no password ever touches
 * this domain, and nothing on this domain can read the frame or be read by it.
 *
 * If MyParkingPro ever sets `X-Frame-Options: DENY` or a restrictive
 * `frame-ancestors` on the account routes, this renders an empty box with no
 * error we can catch. That is what the always-visible fallback link is for.
 */
export function PortalFrame({
  notch = 'canvas',
  className,
}: {
  notch?: NotchColor;
  className?: string;
}) {
  return (
    <ParkingProFrame
      src={loginUrl()}
      title="Inloggen op het klantenportaal van Lang Parkeren Schiphol"
      label="Inloggen"
      fallbackLabel="het klantenportaal"
      notch={notch}
      // The plugin's own default for [pp_account_login_iframe]. It is far
      // taller than a two-field sign-in form looks like it needs, and that is
      // the point: the frame must be usable before the height bridge reports
      // anything, and whitespace is cheaper than an unreachable button.
      initialHeight={PARKINGPRO_DEFAULT_HEIGHTS.login}
      className={className}
    />
  );
}
