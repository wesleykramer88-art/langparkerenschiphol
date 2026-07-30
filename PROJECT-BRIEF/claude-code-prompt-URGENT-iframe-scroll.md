# Claude Code Prompt — Urgent: iframe content is unreachable

> Paste below the rule. This **corrects two instructions in the earlier specs that were
> wrong**. Where this document and `PROJECT-BRIEF.md` / the final fix pass disagree, this
> document wins.

---

The ParkingPro iframes are clipped and their content cannot be scrolled. On `/tarieven/`
the rate table stops at "17 dagen". On `/reservering/` the booking form is cut off inside
"Product kiezen". The visitor cannot reach the rest of the form. **The booking flow is
currently unusable.**

## 1. Root cause — two bad instructions, compounding

Two things in the earlier specs were wrong. Either alone is survivable; together they trap
the content.

**Wrong instruction 1:** *"Disable iframe-internal scrolling; the parent owns scroll."*

This came from a changelog line and it does not match the shipped plugin. Verified in
`class-parkingpro-booking-widgets-public.php` — **every** iframe the official plugin emits
carries `scrolling="yes"`:

```php
$html .= '<iframe id="parkingpro_booking_widgets_iframe" … scrolling="yes"></iframe>';
```

All four shortcodes. The plugin never disables inner scrolling.

**Wrong instruction 2:** *"Set an explicit aspect ratio to prevent CLS."*

An `aspect-ratio` (or any `max-height`, or an `overflow: hidden` wrapper such as the
rounded ticket card) fights the dynamic height and clips the frame.

Disabled inner scroll + a height cap = content that exists but cannot be reached.

## 2. The plugin's real defaults

The official plugin sets a **generous** starting height per shortcode and lets
`pageHeightChanged` adjust from there. Match these exactly:

| Embed | Plugin default |
| --- | --- |
| Booking (`/reservations/add`) | **2200px** |
| Rates (`/parkingrates`) | **2800px** |
| Login (`/account/login`) | **1500px** |
| Registration (`/account/register`) | **1500px** |

Note the rates table is the *tallest* default, at 2800px. Our `/tarieven/` embed is
nowhere near that.

## 3. The correct architecture

The failure mode must be **"too tall"**, never **"unreachable."** A frame with extra
whitespace at the bottom is a cosmetic issue. A frame that hides the submit button is a
lost booking.

Rewrite `<ParkingProFrame />` so that:

1. **`scrolling="yes"` always.** Never `scrolling="no"`, never `overflow: hidden` on the
   iframe. Inner scroll is the safety net when messaging fails.
2. **Height starts at the plugin default for that embed type** (§2), passed as a prop.
   That is the SSR height, so there is no CLS and the content is fully usable before a
   single message arrives.
3. **`pageHeightChanged` only ever *grows* the frame**, never shrinks it below the
   default. Guard: `setHeight(prev => Math.max(prev, newHeight + 50))`. This also kills
   the shrink-grow feedback loop.
4. **No `aspect-ratio`, no `max-height`, no `height` cap anywhere in the chain.** Audit
   every ancestor of the iframe for `overflow: hidden` — the rounded ticket card is the
   likely culprit. Keep the card's visual treatment but let it grow with its content, or
   move the border-radius to a wrapper that does not clip.
5. **`min-height` on the wrapper**, not `height`. Content decides the rest.

## 4. Fix the origin check so it cannot silently swallow everything

The official plugin performs **no origin check at all** — it reads `e.data.event`
directly. Ours should check, but a mismatched check drops every message silently and looks
exactly like "the bridge doesn't work."

- Normalise both sides with `new URL(x).origin` before comparing. A trailing slash in
  `NEXT_PUBLIC_PARKINGPRO_ORIGIN` is enough to break it.
- The payload is a plain object: `{ event: "parkingPro.ui.pageHeightChanged", newHeight: n }`.
  Some embeds post a JSON **string** — accept both: if `typeof e.data === "string"`, try
  `JSON.parse` inside a `try/catch` before reading `.event`.
- In development only, `console.warn` when a message arrives from an unexpected origin,
  printing both values. Silent rejection is what hid this.
- In development only, warn if no `pageHeightChanged` arrives within 4 seconds of load.

## 5. Keep the escape hatch, and make it honest

The "Lukt het niet? Open het reserveringssysteem in een nieuw tabblad" link is good work —
keep it on all three pages. Move it directly beneath the frame and give it an external-link
icon. It is the last line of defence if a visitor's browser blocks third-party frames
entirely, which does happen with strict privacy extensions.

## 6. Check the dev overlay

Both screenshots show the Next.js overlay reporting **2 issues**. Open it and resolve them
before shipping — the `/_next/image` 400 pattern found earlier produced no console error
either, so a silent-failure class of bug is already established on this project.

## 7. Verification — on a real phone, not a resized desktop window

1. `/reservering/`: scroll to the very bottom of the booking form. The submit button must
   be reachable and tappable.
2. `/tarieven/`: the rate table must reach its final row.
3. `/login/`: the sign-in button must be reachable.
4. Temporarily block the postMessage handler and confirm **all three pages are still fully
   usable** via inner scroll. This is the test that matters — it proves the safety net.
5. Rotate to landscape and back; no clipping either way.
6. Confirm no ancestor of the iframe has `overflow: hidden`, `max-height` or
   `aspect-ratio`.
