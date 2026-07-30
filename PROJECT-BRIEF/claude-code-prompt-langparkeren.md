# Claude Code Prompt — LangparkerenSchiphol.nl rebuild

> Paste everything below the line into Claude Code as your first message.
> Then keep this file in the repo root as `PROJECT-BRIEF.md` so it stays in context.

---

You are the senior frontend architect and design lead on this project. Build with the
care of a studio that gives every client a visual identity that could not be mistaken
for anyone else's. Do not produce templated output.

## 1. What we are building

A full rebuild of **langparkerenschiphol.nl** — a long-stay airport parking service at
Amsterdam Airport Schiphol offering **valet parking** and **shuttle parking**. The
current site is WordPress + Elementor. We are replacing it with Next.js.

**This is not a clone.** Keep the Dutch copy and the functionality; redesign everything
else to feel premium, fast, and modern. The client's competitor reference is
`royalparking.nl` and his aspirational reference is `staytick.com`.

**Audience:** Dutch travellers booking 1–8 weeks ahead — families, holidaymakers, and
business travellers. Two anxieties drive every decision on this site: *will my car be
safe* and *will I miss my flight*. The single job of the homepage is to get a confident
person into the booking flow.

**Language:** All user-facing copy is **Dutch (nl-NL)**. Code, comments, commit
messages and filenames are English.

## 2. Stack — exact versions, verified 27 July 2026

Scaffold with:

```bash
npx create-next-app@latest langparkerenschiphol \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

That currently gives you:

| Package | Version |
| --- | --- |
| next | 16.2.12 |
| react / react-dom | 19.2.x |
| tailwindcss | 4.x |
| eslint-config-next | 16.2.12 |

Then add:

```bash
npm i motion lucide-react clsx tailwind-merge class-variance-authority \
      zod react-hook-form @hookform/resolvers
npm i -D prettier prettier-plugin-tailwindcss eslint-config-prettier
```

**Two version traps — do not fall into them:**

- **TypeScript**: npm's `latest` is now **7.0.2** (the native Go compiler). Next 16's
  toolchain and `eslint-config-next` still pin `typescript@^5`. **Stay on TypeScript 5.**
- **ESLint**: npm's `latest` is **10.x**, but `eslint-config-next@16.2.12` peers on
  `eslint@^9`. **Stay on ESLint 9.**

"Latest stable" means latest stable *that the framework supports*. Verify with
`npm ls` after install and report anything that resolves unexpectedly.

Node ≥ 20.9. Deployment target is Vercel.

## 3. Design direction — LOCKED, do not re-propose

The client has already approved the palette. He has **rejected three typefaces**
(Space Grotesk, IBM Plex Sans, Roboto), so treat type as an open question to be
resolved by showing, not guessing — see §3.2.

### 3.1 Palette — "Navy runway, valet orange"

Navy carries the trust and precision of aviation. The orange is not decorative: it is
the exact tone of the hi-vis jackets worn by `thevaletguys.nl`, the crew who physically
take the customer's car. The screen and the kerbside match. Say this in the code
comments so nobody "improves" it later.

| Token | Hex | Use |
| --- | --- | --- |
| `navy-950` | `#071E33` | Dark sections, headings |
| `navy-900` | `#0A2942` | Dark section variation |
| `navy-600` | `#1E5C8C` | Brand blue, links, secondary UI |
| `valet-600` | `#E8631C` | Primary CTA, accent — **use sparingly** |
| `valet-100` | `#FDEEE3` | Accent wash, highlight backgrounds |
| `paper-200` | `#F5F1EA` | Page canvas (warm, not grey) |
| `paper-50` | `#FFFFFF` | Cards and surfaces |
| `ink-700` | `#33475B` | Body text |
| `ink-500` | `#5A6B7C` | Muted / captions |

Build the full 50→950 ramps for navy and valet. Everything lives in `@theme` in
`globals.css` as Tailwind v4 tokens plus **semantic aliases** (`--color-canvas`,
`--color-surface`, `--color-accent`, `--color-heading`, `--color-line`…). Components
reference semantic tokens only. **No hex value ever appears in a component file.**

Verify every text/background pair against WCAG AA. `valet-600` on white is roughly
3.1:1 — it is fine for large text and for solid buttons with white text, but **never**
use it for body copy on a light background.

### 3.2 Typography — the unresolved decision

Set up so that changing the entire site's typeface is a **one-line edit** in
`src/lib/fonts.ts`, exposed to CSS as `--font-brand-sans` / `--font-brand-mono`.

**Self-host the fonts. Do not use `next/font/google`.** Requesting from
`fonts.gstatic.com` sends every Dutch visitor's IP to Google on page load, which EU
courts have treated as a GDPR problem — and this is a purely NL-facing site. Pull the
`.woff2` files from the Fontsource npm packages (`@fontsource-variable/*`, all
OFL-1.1), copy the latin variable file into `src/fonts/`, then load with
`next/font/local`. This also removes a third-party DNS + TLS handshake from the LCP
path.

Bundle these four sans candidates and one mono, with `preload: true` on the active
face only:

- **Inter** — the neutral "standard" default
- **Manrope** — geometric, slightly warmer
- **Plus Jakarta Sans** — friendly, common on modern Dutch sites
- **Figtree** — soft humanist, very legible at small sizes
- **JetBrains Mono** — times, prices, reference codes only

Then build a `/design-system/` route (`robots: noindex`) that renders **the client's
own Dutch copy** — the real H1, the real lead paragraph, a real price row — in each
candidate, with a switcher. He has rejected fonts twice from static screenshots;
he will decide faster from live, switchable type in his own words. Ship this in the
first handover.

Once he picks, delete the unused files and their entries in `fonts.ts`.

Type scale: fluid `clamp()` display sizes (`display-xl` → `display-sm`), a `lead`
size, and an `eyebrow` utility (0.75rem, `0.16em` tracking, uppercase) — the eyebrow is
the airport-signage voice and appears above section headings. Prices, times, durations
and booking references use the mono with `font-variant-numeric: tabular-nums` so digits
align in columns like a departure board.

### 3.3 Signature element

**The parking ticket.** One memorable device, executed precisely, and nothing else
competing with it:

- The hero reservation card is shaped like a physical parking ticket — punched notches
  on both edges, a dashed tear rule, a stub carrying a reference code in mono.
- The price summary on `/tarieven/` reuses the same shape.
- A thin marquee strip of terminal-style labels (`VALET PARKEREN · SHUTTLE PARKEREN ·
  SCHIPHOL · 24/7 BEWAKING`) sits above the header. The client has already seen and
  approved this.

Implement the notch as a CSS `@utility ticket-notch` with a `--notch-color` variable so
it works on any background. Spend the boldness here; keep everything around it quiet.

### 3.4 Motion

One easing family — everything decelerates the way a car comes to rest
(`cubic-bezier(0.16, 1, 0.3, 1)`). Use `motion` (Framer Motion v12).

- An orchestrated page-load sequence in the hero, not scattered effects everywhere.
- Scroll reveals: **12–16px** of travel and a fade. Anything more reads as cheap.
- Hover micro-interactions on cards and buttons: 150–260ms.
- Route transitions: subtle, and they must never delay LCP.
- `prefers-reduced-motion: reduce` is honoured **globally** in `globals.css`, not
  per-component. Build a `<Reveal>` / `<Stagger>` pair that also reads the preference so
  reduced-motion users get content immediately in its final position.

Restraint is part of the brief. Over-animation is the clearest tell of AI-generated
design, and the client is paying for something that doesn't look generated.

## 4. Information architecture — preserve every URL

The live site ranks. **Keep the exact slugs and the trailing slashes.** Set
`trailingSlash: true` in `next.config.ts` so every indexed URL and backlink resolves
`200` instead of `301`, and no link equity is lost in the migration.

| Route | Nav label | Notes |
| --- | --- | --- |
| `/` | Home | |
| `/onze-services/` | Onze Services | anchors `#valet` and `#Shuttle` are linked from the footer — keep both, including the capital S |
| `/tarieven/` | Tarieven | embeds the MyParking.pro rates widget |
| `/samenwerken/` | Reisbureaus | slug and label differ — this is intentional |
| `/contact/` | Contact | |
| `/reservering/` | — | embeds the MyParking.pro booking widget |

Also ship: `not-found.tsx`, `error.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts`.

## 5. Content inventory (from the live site)

Reuse this copy verbatim unless flagged in §9. The client considers it SEO-solid and
does not want it rewritten.

### Homepage

- **Eyebrow/trust:** `4.7/5 · Duizenden reizigers elk jaar`
- **H1:** `Zorgeloos lang parkeren op Schiphol.`
- **Lead:** `Binnen 2 minuten geregeld. Kies voor valet of shuttle parkeren — veilig, snel en professioneel.`
- **Hero bullets:** Boek direct via de website · 24/7 camerabewaking en monitoring · De meest gekozen parkeerservice
- **CTAs:** `Hoe werkt het?` (anchor) · `Bekijk tarieven` (`/tarieven/`)
- **Booking card:** "Reserveer uw parkeerplaats" — Parkeerperiode / Aankomstdatum en tijd* / Retourdatum en tijd* / `Reserveer nu`
- **Reassurance strip:** Veilig Parkeren · Directe bevestiging per e-mail · Meer dan 15 jaar actief op Schiphol · Duizenden tevreden reizigers per jaar · Tot 24 uur van tevoren gratis annuleren · Valet- en shuttleservice
- **USP quad:** Direct via onze site / Veilig en professioneel / Digitale ritcontroles / Snel geregeld
- **Why-us section:** `Al meer dan 15 jaar de vertrouwde keuze rond Schiphol` + 4 supporting cards (Super snel en probleemloos · 24/7 Zorg voor uw auto · Altijd inzicht en controle · Meest populaire service)
- **Service chooser:** two cards — **Valet Parkeren** (badge "Snelste optie") and **Shuttle Parkeren** (badge "Meest betaalbare keuze"), each with 3 bullets and a CTA to `/reservering/`
- **Security section:** `Uw auto is veilig terwijl u zorgeloos reist` — 24/7 videobewaking · Afgesloten parkeerterreinen · Overdekte parkeergarage · Vakbekwame chauffeurs
- **How it works — 4 steps:** Reserveer direct → Wij staan klaar → Vertrek ontspannen → Auto klaar bij terugkomst
- **FAQ — 7 questions:** verschil valet/shuttle · hoe veilig · kosteloos annuleren · hoe ver van tevoren reserveren · autosleutels · vertraagde vlucht · hoe laat aanwezig zijn *(shuttle: 3 uur voor vertrek; valet: 2,5 uur)*
- **Closing CTA:** `Begin uw reis ontspannen`
- **Testimonials — 3:** Mark v.D. (Schiphol reiziger) · Sandra & Peter (Vakantiegangers) · K. de Jong (Zakelijke reiziger)

### /onze-services/

H1 `Parkeren bij Schiphol — op uw manier.` Two deep sections (Valet, Shuttle), each
with a description, a "Voordelen van…" list of 5 bullets, and three supporting cards.
Then a Veiligheid & Kwaliteit block and a two-column "Kies Valet als u… / Kies Shuttle
als u…" comparison.

### /tarieven/

H1 `Kosten Lang Parkeren Schiphol | Bekijk Onze Tarieven`. Embeds the rates widget.
Four FAQ items covering: how rates are calculated (incl. BTW, per exact day, outdoor vs
covered), shuttle included free, **Keep keys — € 15,00**, **Opladen (EV) — € 35,00**.

### /samenwerken/

Travel-agent partner page. H2 `Verdien eenvoudig extra aan iedere reis die u verkoopt.`
Commission model, "Extra inkomsten, zonder extra werk", "Een slimme extra service voor
uw klanten", a five-card "Waarom samenwerken" grid, and a partner CTA.
**See §9 — this page has content bugs.**

### /contact/

H2 `Persoonlijke service — voor, tijdens en na uw reis.` — "Doorgaans reageren wij
binnen 1 uur." Telephone / e-mail / location blocks plus a contact form
(Naam, E-mail, Telefoonnummer, Bericht → `Stuur bericht`).

### /reservering/

H2 `Boek uw parkeerplaats`. Embeds the MyParking.pro booking widget.

### Footer (all pages)

Tagline: `Al meer dan 15 jaar de betrouwbare keuze voor valet en shuttle parkeren op
Amsterdam Airport Schiphol.` Columns: Diensten (valet / shuttle anchors) · Bedrijf
(Reserveren, Contact) · Contact (phone, e-mail, Schiphol, Noord-Holland) ·
BETAALMETHODEN payment icons · `© Lang Parkeren Schiphol. 2026` · Algemene voorwaarden
(currently links to `valetparkingschiphol.nl/algemene-voorwaarden/`).

## 6. The booking widget — the biggest open risk

Both `/tarieven/` and `/reservering/` currently embed MyParking.pro:

```
https://langparkerenschiphol.myparking.pro/parkingrates?&hideHeader&hideTitle&maxNumberOfDays=30&culture=nl-NL
```

The client is checking whether MyParking.pro exposes an **API**. Until we know:

- Build a `<BookingWidget />` component with **one prop that switches between `iframe`
  and `native` modes**. Everything else in the app talks to that component, never to
  the iframe directly. When the API answer arrives, one file changes.
- **Iframe mode:** wrap it in our ticket-shaped frame so the surrounding chrome is
  ours. Set an explicit aspect ratio to prevent CLS, `loading="lazy"`, a proper `title`
  for screen readers, and a `sandbox` attribute. Lazy-load it below the fold. Never let
  it block LCP.
- **Native mode:** the hero date/time picker is ours — animated, on-brand, validated
  with Zod — and only hands off to MyParking.pro at the payment step.

Put the origin in `NEXT_PUBLIC_BOOKING_ORIGIN` and keep `frame-src` in the CSP scoped
to it.

Even in iframe mode, build the **hero** date-and-time selector natively and pass the
values through as query parameters. The first interaction on the page should look like
ours regardless of what MyParking.pro says.

## 7. Architecture

```
src/
  app/
    (site)/              # shared header + footer shell
      page.tsx
      onze-services/page.tsx
      tarieven/page.tsx
      samenwerken/page.tsx
      contact/page.tsx
      reservering/page.tsx
    design-system/       # noindex; tokens + font switcher
    layout.tsx           # html/body, fonts, JSON-LD, analytics
    globals.css          # ALL design tokens live here
    sitemap.ts  robots.ts  manifest.ts  not-found.tsx  error.tsx
  components/
    ui/                  # Button, Container, Section, Card, Badge, Eyebrow, Ticket, Accordion, Field
    layout/              # SiteHeader, SiteFooter, MobileNav, SkipLink, Marquee
    motion/              # Reveal, Stagger, Marquee primitives
    booking/             # BookingWidget + native picker
    sections/            # page-level composed sections
  config/
    site.ts              # NAP, nav, socials, single source of truth
    content/             # Dutch copy, one typed module per page
  lib/
    cn.ts  fonts.ts  seo.ts  schema.ts  env.ts
  hooks/
  types/
```

Rules:

- **Server Components by default.** `"use client"` only where there is state, an event
  handler, or `motion`. Push the boundary as deep as possible — a page should not
  become a client component because one button needs `onClick`.
- **Content is data, not JSX.** All Dutch copy lives in typed modules under
  `config/content/`. Sections map over it. This is what makes the next five rebuilds
  (`valetparkingschiphol.nl`, `flightparking.nl`, and eventually
  `theparkingcompany.com`) cheap: same components, new content module.
- `cn()` = `clsx` + `tailwind-merge`. Component variants via `cva`.
- Every UI primitive forwards `className` and the correct HTML props, and renders the
  correct semantic element (`<button>` vs `<a>` — never a `<div>` with `onClick`).
- Validate `process.env` once in `lib/env.ts` with Zod and fail the build loudly.

## 8. Non-negotiable quality floor

**SEO** (the client asked about this explicitly):

- `metadata` export on every route: title, description, canonical, OpenGraph, Twitter.
  Carry over the existing meta descriptions — they are already written and indexed.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`. `lang="nl"` on `<html>`.
- JSON-LD in `lib/schema.ts`: `LocalBusiness` (`ParkingFacility`) with NAP, opening
  hours and `areaServed`, plus `BreadcrumbList`, plus `FAQPage` on the homepage and
  `/tarieven/` — the FAQ content is already there and is a free rich-result win the
  current site is not claiming.
- `sitemap.ts` and `robots.ts` generated from the route config, not hand-written.
- One `<h1>` per page. Real heading hierarchy. The current site uses `<h2>` for page
  titles on several pages — fix that.
- Google Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
  Analytics loaded with `next/script` at `afterInteractive`, gated behind consent.

**Performance:** Lighthouse ≥ 95 across the board on mobile. LCP < 2.0s. CLS < 0.05.
Every image through `next/image` with explicit dimensions; hero image `priority`,
everything else lazy. No layout shift from fonts (`display: swap` + a tuned fallback
metric). Keep the client JS bundle small — `motion` is the only heavy dependency and it
must not appear in the initial chunk of a page that doesn't animate above the fold.

**Accessibility:** Skip link. Visible focus on everything, never `outline: none`.
Keyboard-operable mobile nav with focus trap and `Escape` to close. FAQ accordion built
on real `<button>` + `aria-expanded` + `aria-controls`. Form fields with real
`<label>`, `aria-describedby` error text, and `aria-live` on the submit result. Colour
is never the only signal. Test the whole site with the keyboard only before calling any
page done.

**Responsive:** 360px → 1920px. Design mobile-first; most airport-parking traffic is
phones. Tap targets ≥ 44px.

## 9. Content problems found on the live site — raise these with the client

Do not silently "fix" these. Implement the sensible version, list them in the handover,
and let him confirm. Finding them is part of the value we're delivering.

1. **NAP is inconsistent**, which actively hurts local SEO:
   - Homepage header shows `085-4013918`; every other page's header shows `0297-785515`.
   - Footer shows `085-4013918`; the contact page shows `0297 — 785 515`.
   - Footer e-mail is `klantenservice@…`; contact page e-mail is `info@…`.
   - Location is "Schiphol, Noord-Holland" in the footer and "Schiphol-Rijk, Nederland"
     on the contact page.
   → Ask which phone and which e-mail are canonical. Put the answer in
   `config/site.ts` and render it everywhere from there.

2. **Broken phone link.** The header on all subpages uses `href="tel:123456789"` — a
   placeholder that was never replaced. Anyone tapping the number on mobile calls
   nothing.

3. **`/samenwerken/` has copy-paste damage.** The "Extra inkomsten" block is followed
   by bullets lifted from the services page ("Snel en zonder moeite wilt parkeren…"),
   and an entire "Kies Shuttle Parking als u:" section appears on the partner page where
   it makes no sense. The five "Waarom samenwerken" cards have headings that don't match
   their descriptions ("10+ jaar ervaring" → "24/7 camerabewaking op alle locaties";
   two cards share identical text). This page needs new copy from the client.

4. **"15 jaar" vs "10+ jaar".** The homepage and footer say more than 15 years; the
   partner page says 10+. Pick one.

5. **Partner page CTA is wrong.** The section says "Klaar om partner te worden? Neem
   vrijblijvend contact op" but the buttons are "Reserveer nu" and "Hoe het werkt".
   Should point at `/contact/`.

6. **Terms are hosted on a different domain.** `Algemene voorwaarden` links to
   `valetparkingschiphol.nl`. Ask whether to host a copy on this domain — cross-domain
   legal pages are a small trust and SEO cost.

7. **No reviews are marked up.** The site claims 4.7/5 and shows three testimonials but
   emits no review schema. If the 4.7 comes from a real, verifiable source (Google,
   Trustpilot), we can mark it up. If it doesn't, we should not — fabricated
   `AggregateRating` is a manual-action risk. Ask before implementing.

## 10. How to work

1. **Set up the foundation first**: config, tokens, fonts, layout shell, UI primitives,
   motion primitives, SEO plumbing, `/design-system/`. No page content yet.
2. Then build **page by page**, homepage first. Before each page, post a short plan:
   the section order, what you're changing from the current site, and why. Wait for a
   response on the homepage; move faster on the rest once the language is agreed.
3. After each page: `npm run typecheck && npm run lint && npm run build`. Zero errors,
   zero warnings. Never hand over something that doesn't build.
4. Commit in small, described steps.
5. If a requirement here conflicts with something you find in the real site, say so
   rather than guessing.

Ask before assuming on anything in §9. Everything else — build it.
