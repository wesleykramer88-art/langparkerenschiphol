# Design rebalance + zeven nieuwe pagina's

**Date:** 2026-08-13
**Branch:** `staging/rebalance-en-nieuwe-paginas`
**Status:** design approved, awaiting spec review

Staging only. Nothing merges to `main` until the client has reviewed the preview
— `main` deploys straight to the live site.

---

## 1. What this is

Three pieces of work that share one branch and two review gates:

1. **A rebalance** of the existing design toward a lighter, whitespace-led feel,
   expressed entirely through the tokens already in `globals.css`.
2. **Hero copy + local-SEO** changes on the homepage.
3. **Seven new pages** — two service pages, five SEO pages from the client's
   content document, one Valet trust page — built out of the existing component
   library rather than new components.

Phase 1 is (1) and (2). It deploys and is reviewed **before** phase 2 is built,
so seven new pages are not constructed in a look the client has not approved.

## 2. Constraints that govern every decision

These are not negotiable and each one is already documented in the codebase.

- **No hex value outside `globals.css`.** Components reference semantic aliases
  (`--color-canvas`, `--color-accent`, …), never the raw ramps.
- **No new hue.** `--color-accent` is the literal colour of the crew's hi-vis
  jackets at thevaletguys.nl. No Parkos blue, no Eazzypark green.
- **Every text/background pair gets a measured ratio**, cited in a comment, in
  the style already used throughout `globals.css`.
- **Real photographs must be seen.** The brief's first rule. This is why the
  light close keeps its photograph rather than dropping it.
- **Only published facts.** Any claim not already live on the site is written in
  its honest neutral form and carries a `TODO(client)` naming what is needed —
  the pattern the codebase already uses for the 4,7/5 rating and the covered-
  parking price anomaly.

### Verified contrast — the pairs this work introduces

Computed sRGB, WCAG 2.1. Method reproduces every figure already documented in
`globals.css` to the decimal, which is how it was validated.

| pair                      | ratio   | verdict                                                           |
| ------------------------- | ------- | ----------------------------------------------------------------- |
| `navy-950` on `paper-50`  | 16.90:1 | AAA — light-section headings                                      |
| `ink-700` on `paper-50`   | 9.58:1  | AAA — light-section body                                          |
| `ink-500` on `paper-50`   | 5.48:1  | AA — light-section lead (`--text-lead` is normal text; needs 4.5) |
| `navy-600` on `paper-50`  | 7.08:1  | AAA — links                                                       |
| `navy-950` on `valet-600` | 5.02:1  | AA — button label on accent                                       |
| `valet-700` on `paper-50` | 4.81:1  | AA — accent text on light, where accent text is needed            |
| `valet-600` on `paper-50` | 3.37:1  | **FAILS normal text.** Icons and ≥24px display only               |

`valet-600` remains forbidden as body copy on light. Where a light section needs
accent-coloured _text_, it uses `--color-accent-hover` (valet-700, 4.81:1).

---

## 3. Phase 1 — the rebalance

### 3.1 Vertical rhythm

[`src/components/ui/Section.tsx`](../../../src/components/ui/Section.tsx) is the
single source of section spacing, so the whole site moves from one edit.

| variant | now                       | proposed                  | desktop delta |
| ------- | ------------------------- | ------------------------- | ------------- |
| `sm`    | `py-12 sm:py-16`          | `py-14 sm:py-20`          | 64 → 80px     |
| `md`    | `py-16 sm:py-20 lg:py-24` | `py-20 sm:py-24 lg:py-32` | 96 → 128px    |
| `lg`    | `py-20 sm:py-28 lg:py-32` | `py-24 sm:py-32 lg:py-40` | 128 → 160px   |

160px between desktop sections is airy without reading as an unfinished page.
No new variant is added — a fourth step would only invite per-section drift,
which is the thing this file exists to prevent.

`TrustStrip` overrides `spacing` with its own `pt-32 pb-14 lg:pt-44 lg:pb-20`
and must **not** be swept into this change: that top padding is clearance for
the hero ticket's `-mb-24 / lg:-mb-32` overhang, and reducing it below the
overhang drops the ticket onto the first board claim.

### 3.2 The one dark → light conversion: `ClosingCta`

Current homepage dark zones: hero + trust strip (one continuous block), the
`Security` photo band, the `ClosingCta` photo band, the footer. The brief asks
for "hero, one trust band". `Security` is the band that earns it — it answers
"is my car safe while I am abroad", it carries the site's only justified
glassmorphism, and the code argues the case at length. So `ClosingCta` converts.

New shape, `tone="surface"` (paper-50):

```
┌─ white section ────────────────┐
│  ╭──────────────────────────╮  │
│  │   [ terminal photo ]     │  │  contained, rounded-xl, shadow-photo
│  ╰──────────────────────────╯  │
│                                │
│     Begin uw reis ontspannen   │  navy-950   16.90:1
│     Kies zekerheid, snelheid…  │  ink-500     5.48:1
│                                │
│     [Reserveer nu] [085-401…]  │  accent + navy secondary
│     ──────────────────────────  │
│     3 reassurances             │  ink-500     5.48:1
└────────────────────────────────┘
```

Consequences, all of them intentional:

- The photograph stays on every page's close, in a contained panel. The brief
  protects real photography; dropping it to gain lightness trades one rule for
  another.
- `scrim-band` and `scrim-center` are no longer applied here. Both utilities
  **remain in `globals.css`** — `scrim-band` is still used by `Security` and
  `/samenwerken/`, and `scrim-center` becomes unused but is kept, documented as
  such, because deleting a measured utility to save four lines is how it gets
  reinvented worse later.
- The phone button changes `variant="onDark"` → `variant="secondary"`
  (navy fill, `heading-inverse` label — the pair already documented at 16.90:1).
- `SectionTear` keeps its perforation and simply **drops** `tone="dark"` —
  `tone` already defaults to `'light'`, so the dash reverts to
  `--color-line-strong` with no new prop. Its `notch` is the colour of the
  section _above_ the seam and continues to be set per call site.

**After this change every interior page is already at hero + one navy band.**
`/onze-services/`, `/waarom-lang-parkeren-schiphol/` and `/samenwerken/` each
have a `PageHero` plus exactly one `tone="inverse"` section. They need no
conversion. That is the minimal correct change rather than a sweep.

### 3.3 Cards: canvas → surface — audited, no work

The brief asks whether cards currently sitting on `--color-canvas` would read
calmer on `--color-surface`. Audited: **they already do.** Every card on the
site resolves to `bg-surface` — the `Card` component's `surface` variant
(`Card.tsx:12`), `ServiceChooser`'s service cards (`ServiceChooser.tsx:214`),
`ContactForm` (`ContactForm.tsx:102`), the terms identity block, every input and
the `Ticket` itself.

The canvas sections that carry no card — `HowItWorks`, `Faq`, the chooser
comparison — use hairline-ruled lists instead, and that is a documented house
style, not an oversight: see the note at the foot of `Section.tsx` and
`ClosingCta`'s _"not a card with a border: a hairline block"_. Boxing them to
gain white would undo the thing that stops the site reading as a stack of
generated cards.

So this item closes with no change. The lightness the brief is asking for comes
from §3.1 spacing and §3.2, not from here.

### 3.4 Hero copy

[`HeroSection.tsx:48`](../../../src/components/sections/HeroSection.tsx#L48):

```
HEADLINE_LINES  ['Zorgeloos', 'lang parkeren', 'op Schiphol.']
             →  ['Lang Parkeren', 'op Schiphol']
```

`Zorgeloos geregeld.` becomes a display subhead directly beneath the H1, inside
the same masked-line load sequence.

**The existing lead paragraph stays.** It carries the shuttle/valet fork and the
free transfer — conversion content — and the brief called this a copy change,
not a content cut.

**Scrim math is untouched.** The H1 goes from three lines to two and no line
gets wider than `lang parkeren` was, so the copy column neither widens nor
extends. `scrim-hero`'s 46ch measurement and its 64.5%-at-the-lead figure still
hold. No re-measure required, and none is performed — inventing a new number
here would be worse than citing the correct existing one.

### 3.5 Local SEO and the address

Verified present, no work needed:

- `ParkingFacility` (a `LocalBusiness` subtype) with a complete `PostalAddress`
  at [`schema.ts:36`](../../../src/lib/schema.ts#L36). Complete street,
  postcode, locality, region, country, plus geo, opening hours and KvK.
- The real full address stays in the footer and in the structured data. It is
  **not** reduced to "Schiphol, Nederland" — rejected by the client for
  local-SEO and legal-risk reasons.
- The KvK _registered_ address remains absent. It is the client's home; see the
  note at [`site.ts:132`](../../../src/config/site.ts#L132). Do not restore it.

Work to do:

- **"Schiphol" prominence** — served by the new H1 and by seven new page titles
  and slugs, all of which carry it.
- **Proximity line.** The brief suggests "Op 5 minuten van Schiphol". This is
  **not** hardcoded. The site publishes **5 tot 8 minuten** for the shuttle in
  six separate places; a new, shorter, contradicting figure would be the
  client's own claim disagreeing with itself in the one row whose job is to be
  checkable. The hero proof row's third item becomes:

  ```
  'Boek direct via de website'  →  'Op 5 tot 8 minuten van de vertrekhal'
  ```

  with `TODO(client)` asking whether he wants a driving distance stated instead,
  and noting that if so it must replace the 5–8 figure everywhere or replace it
  nowhere.

---

## 4. Phase 2 — seven pages

### 4.1 The URL collision, resolved

Task #4 specifies `/shuttle-parkeren-schiphol/` as the Shuttle service page.
The content document's **Pagina 2** specifies the same URL as the main
informational product page. They are **one page**. The document itself calls
Pagina 2 _"de meest complete uitlegpagina binnen het cluster"_ and warns
explicitly against overlapping intent, so splitting them would create exactly
the cannibalisation it cautions about.

Seven new URLs:

| URL                                            | source             | intent                                         |
| ---------------------------------------------- | ------------------ | ---------------------------------------------- |
| `/shuttle-parkeren-schiphol/`                  | task #4 + docx p.2 | Shuttle service **and** the cluster's hub page |
| `/valet-parking-schiphol/`                     | task #4            | Valet service                                  |
| `/goedkoop-shuttle-parkeren-schiphol/`         | docx p.1           | price-led                                      |
| `/parkeren-schiphol-zonder-sleutel-inleveren/` | docx p.3           | the key question                               |
| `/veilig-parkeren-schiphol/`                   | docx p.4           | safety-led                                     |
| `/zelf-parkeren-schiphol/`                     | docx p.5           | control/process-led                            |
| `/digitale-ritregistratie/`                    | task #6            | Valet-only trust page                          |

All keep trailing slashes — `next.config.ts` sets `trailingSlash: true` and the
indexed canonicals have them.

### 4.2 Component extensions — reuse, not rebuild

Each of these is an extraction or a prop, never a parallel implementation.

| component              | change                                                                       | why                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SERVICE_LABELS`       | moves from `BookingPicker.tsx:76` to `src/config/services.ts`                | the picker's "Uw voordeel" stub and the new pages' USP blocks must read one source or they will drift                                              |
| `BookingPicker`        | gains `defaultService?: ServiceSlug`                                         | currently hardcodes `'shuttle'`; the two service pages need their own default                                                                      |
| `Faq`                  | layout extracted as `<FaqSection items eyebrow heading lead />`              | homepage's seven answers stay exactly where they are; each new page passes its own and gets `FAQPage` JSON-LD free, from the same array it renders |
| `HowItWorks`           | timeline extracted as `<Timeline steps />`, scroll math reads `steps.length` | the ritregistratie page needs six steps, not four                                                                                                  |
| `PageHero`             | gains optional `aside` slot                                                  | the two service pages put the booking ticket there                                                                                                 |
| `navigation` (site.ts) | seven entries, `inNav: false, inSitemap: true`                               | **the sitemap generates itself from this array** — no separate sitemap edit exists or should                                                       |
| `pageSeo` (seo.ts)     | seven entries                                                                | `createMetadata()` derives canonical + OG + Twitter from one entry, so they cannot drift                                                           |

Long-form Dutch copy lives in `src/content/*.ts`, matching the existing pattern
(`reviews.ts`, `algemene-voorwaarden.ts`).

### 4.3 The two service pages

Both: `PageHero` with the booking ticket in the `aside` slot, the hard-coded
"Uw voordeel" USP line, the service's four USP bullets (verbatim from the
client's own list, already in `ServiceChooser`), the trust sections, the
`ticket-notch` styling, a page-specific FAQ, and `ClosingCta`.

- **`/shuttle-parkeren-schiphol/`** — picker defaults to Shuttle. USP:
  `🔑 Sleutels mee op reis · Gratis transfer naar Schiphol`. Bullets: zelf
  parkeren sleutels mee / snelle transfer zonder wachttijd / duidelijk en strak
  georganiseerd / veilig terrein betrouwbare service. Additionally carries the
  docx p.2 structure (step-by-step, travel time, who it suits, concerns, FAQ)
  and links to the other four cluster pages.
- **`/valet-parking-schiphol/`** — picker defaults to Valet. USP:
  `🚗 Direct voor de vertrekhal · Auto wordt voor u geparkeerd`. Bullets: direct
  uitstappen / snelste start / professionele overdracht / comfort en zekerheid.
  Links to `/digitale-ritregistratie/` as a trust signal, since ride
  registration is Valet-only.

The client's originals open with an emoji. `BookingPicker` already renders these
as line icons rather than emoji, with a documented reason (`KeyRound`,
`CarFront` — a colour emoji would be the only one on the site). The new pages
follow the same treatment, and the separator stays `·` for the same reason.

### 4.4 The five SEO pages

Structure and section order follow the content document exactly. Copy is written
— the document contains section _briefs_ ("Sectie over prijsvoordeel: waarom
shuttle parking meestal goedkoper is…"), not body text — in the site's existing
voice: `u` throughout, nuchter, no keyword stuffing.

Every page: unique H1, logical H2s, an FAQ block with `FAQPage` markup, natural
internal links to the other cluster pages, and a distinct primary intent so the
five do not compete with each other or with the homepage.

Claims are constrained to what the site already publishes: 5–8 minute shuttle,
24/7 camerabewaking, sleutels mee bij shuttle, 15 jaar, optionele
annuleringsdekking, beveiligd en afgesloten terrein, overdekt beschikbaar.
Anything the document asks for that is not on that list — shuttle frequency,
night-time service, price comparisons against official Schiphol parking — is
written in its honest neutral form with a `TODO(client)` naming the exact fact
needed. **No prices are hardcoded**; `/tarieven/` computes them live.

### 4.5 `/digitale-ritregistratie/`

Built to the exact structure specified, in order: hero → reservation data →
speed registration → six-step timeline → "Waarom doen wij dit?" → photo section
→ FAQ → close.

**The speed-registration paragraph is reproduced verbatim and is not
embellished.** It is deliberately worded to build trust without making a
legal or technical evidentiary claim. The FAQ answers are written to the same
standard — they describe what is recorded and who sees it, and they do not
promise what the recording proves.

Timeline steps, styled with `--color-numeral` via the extracted `<Timeline>`:
Auto opgehaald · Rit gestart · GPS actief · Snelheid geregistreerd · Auto veilig
geparkeerd · Terugrit opnieuw geregistreerd.

**The screenshots.** Both client-supplied images are the driver app:

- `BA716C7B-…png` (1007×1561) — booking `#J4G7A`, vehicle, flight and check-in
  data. Goes in the reservation-data section.
- `6C523F6E-…png` (899×1750) — "Rit bijhouden", live speed and GPS status. Goes
  in the speed-registration section.

They render on a `--color-surface` panel and **without the `photo` grade**. That
grade's desaturation and navy veil exist to make disparate photographs read as
one estate; applied to a UI screenshot it just looks broken. Two notes:

- The app UI is teal-green — a hue the palette rationale excludes. It is
  contained on a white panel and never placed adjacent to the accent, so it
  reads as evidence of a third-party tool rather than as a brand colour.
- Both contain dummy contact details (`john.devries@mail.com`, `+31612345678`,
  plate `7-xgf-98`). Obviously fabricated test data, but it will be on a public
  page. Flagged to the client; masking is a one-line crop if wanted.

**Photographs.** Real client assets only — the page's entire purpose is
authenticity. Available: `crewTerminal` (chauffeur), `lotShuttle` (terrein),
`crewHandover` (overdracht), and `crewCheck`, which the manifest already
describes as _"the evidence behind digitale ritregistratie"_ — though at
590×224 it is an inset, never a band. There is **no sleutelkluis photograph**;
that slot gets a `TODO(client)` rather than stock. Layout alternates so the
section does not read as a monotone grid.

Linked from `/valet-parking-schiphol/` and from a homepage trust section, and in
the sitemap via `navigation`.

---

## 5. Acceptance criteria

- [ ] No hardcoded hex outside `globals.css`.
- [ ] Every new or changed text/background pair has a measured ratio in a
      comment; none below 4.5:1 for normal text, 3:1 for ≥24px and non-text.
- [ ] Sitemap contains all seven new URLs (automatic, via `navigation`).
- [ ] Title / description / canonical / OG unique per new page, and distinct
      from the homepage — no intent cannibalisation.
- [ ] `BookingPicker`, `Ticket`, the USP swap logic, `Faq` and the timeline are
      **reused**, with a single source of truth each.
- [ ] `npm run verify` (typecheck + lint + build) passes.
- [ ] Preview deployed; URL reported. **Nothing merged to `main`.**

## 6. Risks

| risk                                                     | mitigation                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Client rejects the calmer balance after 7 pages exist    | Two-phase build; phase 1 deploys and is reviewed alone                                                               |
| New copy makes claims the business cannot support        | Published facts only; `TODO(client)` on everything else                                                              |
| Five cluster pages cannibalise each other                | Distinct primary intent per page, per the document's own instruction; cross-links are contextual, not a footer block |
| `Section` spacing change breaks the hero-ticket overhang | `TrustStrip`'s explicit padding is excluded from the change, with a comment saying why                               |
| Screenshot hue conflicts with the palette                | Contained on white, never adjacent to accent, documented at the call site                                            |

## 7. Open questions for the client

Carried as `TODO(client)` in the code, and worth raising directly:

1. Driving distance/time to the terminal — do you want a figure, and does it
   replace the 5–8 minute shuttle claim or sit beside it?
2. Shuttle frequency and night-time service — the content document asks for
   both and neither is published anywhere.
3. A sleutelkluis photograph for the ritregistratie page.
4. Mask the dummy contact details in the two app screenshots?
5. The 590×224 `crewCheck` reshoot, already open in the manifest, would carry
   the ritregistratie page far better than it can at that size.
