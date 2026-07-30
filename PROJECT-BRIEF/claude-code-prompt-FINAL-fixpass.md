# Claude Code Prompt — Final pass: ParkingPro integration, product matrix, launch blockers

> **Before pasting:** copy `parkingpro.ts` into `src/lib/parkingpro.ts`. It is written,
> typechecked under strict mode, and contains the real location IDs. Do not let Claude
> Code rewrite it.
>
> This document supersedes `claude-code-prompt-fixpass-parkingpro.md` entirely — that
> file's §6 (read values from WP Admin) is obsolete and should be ignored.
> `PROJECT-BRIEF.md` still applies.

---

All nine pages are built. This pass fixes the booking integration, corrects a product
model we got wrong, and closes the launch blockers.

`src/lib/parkingpro.ts` is already in the repo. **Use it as-is.** Every URL that points at
the booking system comes from its builders. No page composes a MyParkingPro URL by hand,
and no page hardcodes a location ID.

Only one environment variable is needed:

```
NEXT_PUBLIC_PARKINGPRO_ORIGIN="https://langparkerenschiphol.myparking.pro"
```

The location GUIDs are public — they are served by `/api/widget/locations` to anyone who
asks — so they live in version-controlled code, not env.

## 1. The booking page embeds the wrong iframe

`/reservering/` shows a **price table** instead of the **booking flow**. The client caught
it: *"I saw the reservation page you see the price form instead of Booking page."*

The cause is in `PROJECT-BRIEF.md` §6, which recorded one MyParking.pro URL ending in
`/parkingrates` and claimed both pages use it. They do not. The live WordPress site runs
the official **ParkingPro Booking Widgets** plugin (v1.2.58); each page uses a different
shortcode, and each shortcode builds a different path. Verified against plugin source.

| Page | WP shortcode | Path | Builder |
| --- | --- | --- | --- |
| `/reservering/` | `[pp_booking_iframe]` | `/reservations/add` | `bookingUrl()` |
| `/tarieven/` | `[pp_parking_rates_iframe]` | `/parkingrates` | `ratesUrl()` |
| `/login/` | `[pp_account_login_iframe]` | `/account/login` | `loginUrl()` |
| registration | `[pp_account_registration_iframe]` | `/account/register` | `registerUrl()` |

### 1.1 Prefill from the hero — the part that does not come free

The plugin docs are explicit:

> The form fields from the widget (dates, times and location) will be prefilled in the
> MyParkingPro iFrame… **This is only possible by using the shortcode. If you include the
> MyParkingPro iFrame with HTML, this won't work.**

We have no plugin, so we build the query string ourselves:

1. Hero collects arrival date/time, return date/time, service, car count.
2. Hero routes to `/reservering/?arrivalDate=…&arrivalTime=…&departureDate=…&departureTime=…&locationId=…`
3. `/reservering/` reads those params server-side and passes them to `bookingUrl()`.

Dates are `dd-mm-yyyy`, times 24-hour `HH:mm` — use `toParkingProDate()` and
`toParkingProTime()`. Any other format loads the iframe but silently ignores the prefill.

Without this the visitor types their dates twice and the hero card is decoration.
**This is the highest-value item in the pass.**

### 1.2 The postMessage bridge — required, and it fixes mobile

Implement a client-side listener in `<ParkingProFrame />` using the constants in
`PARKINGPRO_EVENTS`:

| Event | Action |
| --- | --- |
| `parkingPro.ui.pageHeightChanged` | set iframe height to `newHeight + IFRAME_HEIGHT_PADDING` |
| `parkingPro.ui.scroll` | scroll parent to the reported offset |
| `parkingPro.domain.reservationAdded` | read `e.data.reservation`, route to thank-you with its fields |
| `parkingPro.domain.registrationCompleted` | route to a confirmation state |
| `parkingPro.googleAnalytics.gtag` / `…googleTagManager.dataLayer` | forward to analytics if configured |

Guard every listener with `isParkingProOrigin(e.origin)` before trusting the payload.

**A fixed-height iframe is why booking breaks on phones.** Height must be driven by this
event, with a sensible SSR default to avoid CLS. Apply reported heights *without* adding
padding on every message or you get a resize feedback loop (plugin changelog 1.2.54).
Disable iframe-internal scrolling; the parent owns scroll. Send `parkingPro.widget.scroll`
into the iframe on parent scroll so its sticky elements position correctly.

## 2. The product model is wrong — there are four products, not two

`/api/widget/locations` on the client's live instance returns **four** sellable products.
The site currently presents two. This is a content and revenue problem, not a code problem.

| Product | Code | Service | Address | Min. notice | Pay on arrival |
| --- | --- | --- | --- | --- | --- |
| Shuttle BUITEN | LPS-S | Shuttle | Tupolevlaan 39, Schiphol-Rijk | 0h | No |
| Shuttle OVERDEKT | LPS-SO | Shuttle | Tupolevlaan 39, Schiphol-Rijk | 0h | No |
| Valet BUITEN | LPS-V | Valet | Vertrekpassage, Departures 1e verdieping | 1h | **Yes** |
| Valet OVERDEKT | LPS-VO | Valet | Vertrekpassage, Departures 1e verdieping | 1h | **Yes** |

Three consequences:

**2.1 Outdoor vs covered must be visible.** The `/tarieven/` FAQ already explains that
covered parking is priced differently, and the booking flow already offers the choice —
but the marketing site never mentions it. Extend the service-chooser into a 2×2: pick
service, then pick outdoor or covered, with the covered option carrying the premium
framing. Flag to the client for confirmation before shipping.

**2.2 Enforce the minimum notice in the date picker.** Valet requires **1 hour** lead
time, shuttle none. Use `minimumHoursNotice(serviceType)`. If the picker lets someone
choose a valet slot 20 minutes out, ParkingPro rejects it *after* they have filled the
form — the worst possible place to fail.

**2.3 "Betaal bij aankomst" is a real differentiator.** Valet accepts payment on arrival;
shuttle does not. That is a genuine reason to choose valet and it appears nowhere on the
site. Add it to the valet card.

### 2.4 The address "inconsistency" was not an error

`PROJECT-BRIEF.md` §9 flagged conflicting addresses as an SEO problem. It is not — they
are two real locations for two real services. Correct the handling:

- **Business address (`LocalBusiness` schema, footer):** Tupolevlaan 39, Schiphol-Rijk
- **Valet handover point:** Vertrekpassage, Schiphol — Vertrekhal, 1e verdieping

Show both, labelled. On `/contact/` and on the valet section this is useful operational
information, not a duplication bug. The phone number remains the one open NAP question.

### 2.5 Use `/api/widget/config` for the picker bounds

The same public API exposes `defaultArrivalTime`, `defaultDepartureTime`, `minArrivalDate`
and the min/max arrival and departure times. Drive the hero picker from these rather than
hardcoding, so the site stays correct when the client changes his operating hours.

## 3. Live prices in our own design

`/api/widget/price?locationId=&arrivalDate=&departureDate=` returns `totalWithTax`,
currency and availability. `fetchPrice()` is already implemented.

Call it from a **route handler**, never the browser, so the upstream host stays off the
client. Once the hero has both dates, show the real price in our own typography — a
departure-board number in the ticket card — before the visitor ever sees a ParkingPro
screen. Debounce, and never block render on it: `fetchPrice()` returns `null` on failure
and the card must degrade to "Bekijk prijs" silently.

Build this only after §1 is verified working end to end.

## 4. The login page is unreachable

`/login/` exists but nothing links to it.

- **Header:** an "Inloggen" text link before the primary CTA; entry in the mobile menu.
  Secondary weight — it must not compete with "Reserveer nu".
- **Footer:** under "Bedrijf", alongside Reserveren and Contact.
- **`/tarieven/` and `/reservering/`:** a slim line — *"Al klant? Log in en ontvang 10%
  korting op elke reservering."* — linking to `/login/`. That discount is real and
  currently invisible.

Keep `/login/` indexable. It is a sales page for the portal, not a bare auth form.

## 5. Mobile hero

The client's screenshot shows the hero image badly framed on a phone.

- Tune `object-position` per breakpoint; a centre crop of a landscape shot fails at 360px.
- Use `<picture>` with a portrait crop below `640px`. A 16:9 airport photo letterboxed
  into a tall viewport always looks broken.
- Check the scrim — hero text must stay legible over the image at every width.
- Re-run the 360px pass across **all nine pages**, not just the homepage.

## 6. The reviews decision may need reversing

Handover 2 removed the 4,7/5 as unsourced. The client's WordPress has both **Trustindex.io**
and a **Google Reviews** plugin installed, which suggests the rating is real and pulled
from his Google Business Profile.

Do not act on this unilaterally. Build `/reviews/` so that real reviews can be dropped in
behind a single content module, and raise it in the handover:

- If Trustindex is connected to a live GBP → restore the rating **with its source named**,
  emit legitimate `AggregateRating`, and replace the three anonymous testimonials with
  real Google reviews.
- If it is not connected → leave it out.

This turns the weakest page in the build into the strongest one. It is the trust signal
the client keeps asking for.

## 7. Launch blockers, in priority order

1. **§1 booking iframe.** Nothing else matters if the booking page cannot book.
2. **Contact form has no mail provider.** The `mailto:` fallback is honest but it is not a
   contact form. Wire Resend or Postmark, key in env, send to the canonical address. If
   the client must choose the provider, say so **today** rather than letting him find out
   after launch during peak season.
3. Login entry points (§4).
4. Mobile hero (§5).
5. Confirm the redirect map is live on the production domain, not just the preview.

## 8. Definition of done

- `/reservering/` shows the booking flow, prefilled from the hero, no double entry.
- `/tarieven/` shows rates; `/login/` shows the portal login.
- Every ParkingPro URL comes from `src/lib/parkingpro.ts`. No hardcoded paths or GUIDs.
- Iframe height responds to `pageHeightChanged` on a real phone — no inner scrollbar, no
  cut-off submit button.
- `isParkingProOrigin()` guards every `message` listener.
- Valet cannot be booked with less than 1 hour notice.
- Login reachable from header, footer, and both booking-adjacent pages.
- 360px pass clean on all nine pages.
- `npm run verify` green.

## 9. Handover note

Write a short plain-English summary for the client covering: the booking page fix; that
his ParkingPro instance **does** expose a read API (answering the question he raised on
27 July, and pointing at what to ask ParkingPro for on The Parking Company — a *write*
API); the four-product question; the two-address clarification; the reviews question; the
contact-form provider decision; and what photos are still outstanding.

He is a parking operator, not a developer. Keep it non-technical — this list is a large
part of what he is actually paying for.
