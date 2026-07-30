# UX & UI Strategy — Lang Parkeren Schiphol

**Version 1.0 · 28 July 2026 · Proposal, not yet implemented**

This is the document promised in `HANDOVER.md` §7: the section order and the
reasoning behind it, posted **before** the homepage is built.

Three sites were analysed:

| Ref     | Site                                   | Role       |
| ------- | -------------------------------------- | ---------- |
| **OURS** | Lang Parkeren Schiphol (this codebase) | Ours       |
| **RP**   | Royal Parking Schiphol Valet           | Competitor |
| **SPL**  | Schiphol.nl                            | Competitor |

Nothing here is a copy of either competitor. Both are used the way a competitor
should be used: as evidence about what this audience responds to, and as a list
of mistakes we now do not have to make ourselves.

**Nothing in this document has been implemented.** It is a decision brief.
`§13 Roadmap` sequences the work and marks what needs a client answer first.

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Competitive analysis](#2-competitive-analysis)
3. [Honest audit of our own site](#3-honest-audit-of-our-own-site)
4. [The four opportunities](#4-the-four-opportunities)
5. [UX strategy](#5-ux-strategy)
6. [Design system](#6-design-system)
7. [Page structure, section by section](#7-page-structure-section-by-section)
8. [Motion system](#8-motion-system)
9. [Responsive strategy](#9-responsive-strategy)
10. [Conversion optimisation](#10-conversion-optimisation)
11. [Accessibility](#11-accessibility)
12. [SEO structure](#12-seo-structure)
13. [Performance budget](#13-performance-budget)
14. [Roadmap and open questions](#14-roadmap-and-open-questions)
15. [Explicit non-goals](#15-explicit-non-goals)

---

## 1. Executive summary

Our site is already the best-designed of the three. That is not the problem.

The problem is that it is the best-designed of the three **and it does not show
a price, does not prove a single review, and cannot be used by anyone who has
already booked.** Royal Parking, which is visually a Tailwind admin template
with five accent colours, beats us on all three. A visitor comparing tabs does
not grade typography. They ask: *what does it cost, who says it works, and where
do I change my booking.*

So the strategy is not a redesign. The visual language — navy runway, hi-vis
valet orange, the punched parking ticket, the departure-board voice — is strong,
disciplined, and worth more than anything either competitor has. **We keep all
of it.** What changes is what that language is asked to carry.

Five moves, in order of expected revenue impact:

| #   | Move                                                                             | Beats            | Effort |
| --- | -------------------------------------------------------------------------------- | ---------------- | ------ |
| 1   | **Price in the hero.** The booking ticket returns a number, not a redirect.       | RP (on execution) | L      |
| 2   | **Verified reviews.** Source-attributed, dated, linked out, counted.               | RP (on honesty)   | M      |
| 3   | **Returning-customer path.** "Mijn reservering" in the header, on every page.      | RP (they only log in) | M  |
| 4   | **Intent segmentation.** Leisure / business / travel agency, without IA bloat.     | SPL (on focus)    | S      |
| 5   | **Location & wayfinding.** Where we are, how you reach us, how long it takes.      | Both              | M      |

Everything else in this document — the design system extensions, the section
rewrites, the motion rules — exists to make those five land without diluting a
design language that is currently our biggest competitive asset.

---

## 2. Competitive analysis

### 2.1 Royal Parking (RP)

Light-blue and white. A booking card in the hero, a four-card benefits grid, a
three-step process on a blue gradient band, a Google review row, a B2B band, a
footer with a support widget.

#### What RP does well — and what we take

**① The hero CTA promises a price, not a purchase.**
The button reads **"Bereken prijs & Reserveren"**. Ours reads "Reserveer nu".
Theirs is a lower-commitment ask that ends in the same funnel. A visitor who is
price-shopping — which at this stage is nearly all of them — clicks the first and
not the second. This is the single most valuable thing on any of the three sites.
**Take it. Improve it: we will show the price in place rather than navigating to
find it.**

**② Third-party review proof, with the source visible.**
A Google logo, `4.6`, five stars, *"Gebaseerd op 27 Google Reviews"*, then five
named reviewers with avatars, initials and dates ("Recep Y. — een jaar geleden"),
ending in **"Bekijk alle reviews op Google →"**.

27 reviews is a small number. It does not matter. It is a *verifiable* number
from a source the visitor already trusts, and it beats our unverifiable
"duizenden reizigers" on the only axis that counts. **This is our largest single
gap. Take it.**

**③ A returning-customer door.**
"Inloggen" in the header. Someone who booked in March and is flying tomorrow has
a place to go. We have none.

**④ B2B is addressed explicitly.**
A whole band — *"Zakelijk Parkeren?"* — with corporate rates, monthly invoicing,
priority service, and its own CTA and its own card. We have `/samenwerken/`
buried in the nav under a label most visitors will not connect to themselves.

**⑤ Language switcher.** A flag dropdown in the header. Schiphol is an
international airport; NL-only is a decision, and right now it is an undeclared
one.

#### What RP does poorly — and what we must not import

- **Five accent colours with no meaning.** The four benefit cards carry blue,
  green, orange and purple top-borders and matching icon chips. The colour
  encodes nothing. Below them, four stat tiles in orange, blue, green and cyan.
  This is the clearest tell that the palette came from a template rather than a
  brand. Our one-accent rule is worth more than everything else we could copy.
- **A two-tone headline.** "Zorgeloos parkeren op **Schiphol**" with the last
  word in blue and underlined by a squiggle. A 2018 pattern. Emphasis by colour
  inside a headline is a substitute for a typographic hierarchy, not one.
- **Weak typographic scale.** Headline, section heading and card title are close
  enough in size that the page reads flat. Body copy is small and low contrast.
- **The booking card is cramped and under-labelled.** Two unlabelled "Uur"
  dropdowns, placeholder-as-label ("Kies een datum"), low-contrast placeholder
  text. Placeholders are not labels; they vanish exactly when the user needs them.
- **A testimonial carousel clipped at both edges** with no visible controls. Cards
  cut mid-word signal "there is more" without saying how much or how to reach it.
- **Gradient bands everywhere.** Three full-width blue mesh gradients. Gradient is
  used as a substitute for structure.
- **Hero photograph is stock.** An empty road, a control tower, no people, and no
  depiction of the service being sold.

### 2.2 Schiphol.nl (SPL)

The airport's own site. Dark slate-green, cream, gold. Enormous IA. Very
disciplined visually.

#### What SPL does well — and what we take

**① Intent segmentation before product segmentation.**
The band under the hero: **"Ik ga — Vertrekken · Aankomen · Overstappen ·
Schiphol bezoeken"**, as a tab set that reflows the cards beneath it.

The site does not ask *which product do you want*. It asks *what are you doing
today*, then shows the products that serve it. Our page asks the product
question ("valet or shuttle?") before establishing that the visitor is a leisure
traveller with a family and two suitcases, or a consultant flying out Tuesday
mornings. **Take the pattern. Do not take the scale** — SPL has four intents
because it is a portal. We have three, and they are worth one row, not a tab set.

**② One job in the hero.** A search field: *"Vind je vlucht"*. Nothing else
competes. The whole hero is a single input and a single button.

**③ Live, operational content.**
*"Hoe druk is het vandaag op Schiphol? — Vandaag is een drukke dag. We
verwachten dat je meer moet wachten bij security en de paspoortcontrole."*

This is the most trust-building block on any of the three sites and it costs
them almost nothing. It is specific, dated, operational and occasionally
unflattering — which is exactly why it reads as true. Marketing copy cannot buy
what a slightly bad honest number buys.

**④ Photography with faces in it.** People embracing at arrivals. A family. A
woman with coffee. SPL sells the *feeling either side of the flight*. Our entire
library is cars and concrete at night — atmospheric, well-graded, and emotionally
empty. Exactly one of our images contains a person.

**⑤ Palette discipline at scale.** One dark green, one cream, one gold. Across a
page that must be five times more complex than ours, they never reach for a
sixth colour. Confirms our own rule.

**⑥ Inclusive design stated out loud.**
*"Heb je extra hulp nodig?"* — assistance, travelling with children, awkward
baggage. Named as a service, not hidden in an accessibility statement.

#### What SPL does poorly — and what we must not import

- **Carousels that clip cards at the viewport edge.** Two of them. Content is
  hidden with no indication of how much, and the horizontal scroll competes with
  the vertical one on touch.
- **A footer link farm.** Roughly sixty links in eight columns. Sitemap as design.
- **Monotonous rhythm.** Nearly every block is image-card-plus-label. Across
  6,600px there is no compression or expansion — no section is allowed to be
  louder than another, so nothing is.
- **Overlay pile-up.** Cookie bar, feedback tab, chat affordance, and a sticky
  header all present at once.
- **No conversion pressure at all.** Correct for a portal, fatal for us.

### 2.3 Scorecard

Scored 1–5 against what a Schiphol parking customer needs.

| Dimension                 | OURS | RP  | SPL | Note                                                    |
| ------------------------- | :--: | :-: | :-: | ------------------------------------------------------- |
| Information architecture  |  4   |  3  |  3  | Ours is clean; SPL's intent model is smarter            |
| Hero clarity              |  4   |  3  |  5  | SPL has one job in the hero and does it                 |
| **Price transparency**    |  1   |  3  |  3  | **Our worst score on the board**                        |
| Typography                |  5   |  2  |  4  | Our scale is the best of the three by a distance        |
| Colour discipline         |  5   |  1  |  5  | RP has five accents and no rule                         |
| Visual hierarchy          |  5   |  2  |  3  | —                                                       |
| Layout consistency        |  5   |  3  |  4  | —                                                       |
| CTA placement             |  4   |  4  |  2  | Comparable; ours are better-formed, theirs better-worded |
| **Trust — verifiable**    |  2   |  4  |  5  | Ours is well-written and unprovable                     |
| Trust — legal/identity    |  5   |  2  |  4  | We publish KvK; RP publishes nothing                    |
| Animation                 |  5   |  2  |  3  | Ours is budgeted and purposeful                         |
| Mobile                    |  4   |  3  |  4  | Ours needs the sticky bar work in §9                    |
| Accessibility             |  5   |  2  |  4  | Contrast verified, reduced-motion, no-JS reveals        |
| Performance               |  5   |  2  |  2  | Self-hosted fonts, ~400-byte reveal hook                |
| SEO structure             |  4   |  2  |  4  | FAQPage in place; more schema available                 |
| **Returning customer**    |  1   |  3  |  4  | We have no door at all                                  |
| **Intent segmentation**   |  1   |  2  |  5  | —                                                       |
| **Location / wayfinding** |  1   |  2  |  5  | We never say where we are                               |

**Reading of the table.** We win on craft, comprehensively. We lose on the five
rows in bold — and every one of those rows is a row a customer actually checks
before handing over their car keys. Craft is what stops them leaving. Those five
rows are what makes them book.

---

## 3. Honest audit of our own site

Referenced against the current build.

### 3.1 Blocking gaps

**① There is no price on the homepage. Anywhere.**
Both hero CTAs — `Reserveer nu` → `/reservering/`, `Bekijk tarieven` →
`/tarieven/` — defer the number to another page. Airport parking is a
price-compared commodity: the visitor has three tabs open and will close the one
that will not tell them. Even *"vanaf €6,50 per dag"* under the H1 would fix the
worst of it.

**② The hero booking picker does not compute anything.**
`BookingPicker` collects dates and times and hands off to `/reservering/`, which
loads the MyParking.pro iframe. The single most interactive element on the page
is a form that produces no feedback. Worse, per `HANDOVER.md` §5 the prefill
parameters are inferred, not documented — so it may hand over dates that are
silently dropped, and the visitor re-enters them. That is the highest-friction
possible outcome for the highest-intent possible user.

**③ Reviews are self-published and unattributed.**
`Testimonials.tsx` carries three quotes with names ("Mark v.D.", "Sandra &
Peter"), roles, no source, no date, no link, decorative star rows that are
`aria-hidden` because *"no per-review score is published"*. The code comment is
honest and correct. The section is still, to a sceptical reader, three
paragraphs a copywriter could have written in five minutes.

The `4,7` in `site.ts` is deliberately not marked up as `AggregateRating` — a
correct call, and one we keep. **But the answer to "we cannot prove it" is to go
and get proof, not to present it unproven in a beautiful frame.**

**④ No returning-customer path.** No login, no "wijzig mijn reservering", no
booking lookup, no "mijn vlucht is vertraagd". The FAQ *answers* the delayed
flight question and then offers nowhere to act on it. Every one of those becomes
a phone call.

**⑤ We never say where we are.**
`site.ts` models the business as service-area only — locality plus coordinates,
no street address, correctly refusing to publish the Vinkeveen registered office
25km away. That is right for schema. It leaves a real content hole: no map, no
route, no "X minuten van de A4", no "de shuttle rijdt elke Y minuten". "Where do
I actually drive to" is a top-three pre-booking question and the page never
addresses it.

### 3.2 Structural weaknesses

**⑥ Uniform section rhythm.** Nine sections, effectively all at `spacing="lg"`.
A page with no compression has no emphasis: if every section is important, none
reads as the important one. See §6.5.

**⑦ Claim redundancy.** *24/7 camerabewaking* appears in the hero proof row, in
`WhyUs` reasons, in `Security` measures and in the FAQ. *Binnen 2 minuten* in the
hero lead, in `HowItWorks` step 1 and in `ClosingCta`. *Gratis annuleren tot 24
uur* in `ServiceChooser`, `TrustStrip`, the FAQ and `ClosingCta`. Repetition at
the ask is deliberate and good. Repetition in four consecutive explanatory
sections is cognitive load — the reader is re-reading, and re-reading feels like
being sold to.

**⑧ `WhyUs` is doing two jobs.** The four `REASONS` and the four absorbed `USPS`
make near-identical claims at two visual weights. The code comment explains why
they were merged rather than shipped as eight boxes — right decision. The next
step is to cut, not to re-weight.

**⑨ The marquee.** A `<Marquee>` label strip sits above the header on a 42s
loop. It carries no information the header does not, it costs vertical space
above the fold on mobile, and its WCAG 2.2.2 mitigation is pause-on-hover — which
does not exist on touch, where the cost is highest. **Recommend: replace with a
static utility bar carrying phone, language and "Mijn reservering".** That bar
earns its pixels; the marquee does not.

**⑩ Photography is emotionally cold.** Six images, all cars and concrete, mostly
at night. Beautifully graded and consistent — the `photo` / `scrim-*` utilities
do real work. But we are selling *"begin uw reis ontspannen"* and showing an
empty parking deck. SPL sells the same abstract thing and shows people hugging.

### 3.3 What is already excellent — do not touch

For the avoidance of doubt, since §3.1–3.2 are unrelenting:

- **The token layer.** One accent, one easing family, navy-tinted shadows, a
  documented contrast table, semantic aliases that components consume instead of
  raw ramps. Better than either competitor's, and better than most agency work.
- **The `--color-on-accent` decision.** Navy on orange at 5.0:1 instead of white
  at 3.4:1, justified by both WCAG and by hi-vis signage convention. Keep.
- **The ticket motif.** `ticket-notch`, `ticket-tear`, `SectionTear`. A real
  proprietary asset, used structurally at section seams. Neither competitor has
  anything like it. §6.8 extends it rather than replacing it.
- **The motion budget.** Framer only in the hero and one scroll-linked timeline;
  everything else on a ~400-byte IntersectionObserver hook. Keep exactly.
- **The no-JS reveal ordering.** Revealed is the default; hidden applies only
  under `html.js`. Most sites with scroll reveals render blank without JS.
- **The editorial layouts.** Split headers, sticky left columns, hairline lists
  instead of box grids, the `ghost-numeral` process markers. This is why we score
  5 on hierarchy and RP scores 2.
- **NAP consolidation, the `tel:` fix, FAQ schema, self-hosted fonts.**

---

## 4. The four opportunities

Where the gap between what this market offers and what it wants is widest.

### Opportunity 1 — Be the only one that answers "what does it cost" honestly

RP asks you to press a button. SPL sends you to a tariff table. Nobody in this
market shows a real, dated, all-in price on the homepage.

**The play:** the hero ticket calculates in place. Dates in → a price out, on the
same card, without navigation. Then: *"Prijs inclusief btw. Geen boekingskosten.
Gratis annuleren tot 24 uur voor aankomst."* All-in, stated, before the ask.

Everything else in this document is refinement. This is the move.

### Opportunity 2 — Be the only one whose proof is checkable

RP shows 27 verified Google reviews. We show three unverifiable quotes and a
number with no denominator.

**The play:** source-attributed reviews — platform mark, reviewer name, date,
star count, review count, link out to the source. If the honest count is small,
show the small count. *"4,7 · gebaseerd op 38 Google-reviews"* with a working
link outperforms *"duizenden tevreden reizigers"* by a wide margin, because one
of them can be checked in a second and the other is a claim about ourselves.

This requires the client to actually collect reviews. That is a business action,
not a design one, and it is item 1 in §14.

### Opportunity 3 — Own the moment *after* the booking

The entire market designs for acquisition and abandons the customer at
confirmation. But the anxious moments are all post-booking: *my flight moved, I
land at 02:00, which terminal, what is the number, I have lost the email.*

**The play:** a permanent "Mijn reservering" door in the header, and a `/hulp/`
page organised by moment — *before you leave / at the airport / on return / plans
changed*. Deflects support calls, and every returning visitor who finds their
booking in two taps is a repeat customer.

RP has "Inloggen", which is a database door. This is a *customer* door.

### Opportunity 4 — Be specific where everyone else is generic

Both competitors write in unfalsifiable adjectives: veilig, betrouwbaar,
professioneel, comfortabel. We do too — see §3.2 ⑦.

**The play:** replace adjectives with figures wherever a real figure exists.

| Instead of                    | Say                                                        |
| ----------------------------- | ---------------------------------------------------------- |
| "Snelle transferservice"      | "Shuttle elke 10 minuten, 5–8 minuten naar de vertrekhal"   |
| "24/7 bewaakt"                | "24/7 camerabewaking, afgesloten terrein, 340 plaatsen"     |
| "Ervaren chauffeurs"          | "Chauffeurs in vaste dienst, gemiddeld 6 jaar in dienst"    |
| "Binnen 2 minuten geregeld"   | Keep — it is already a figure, and it is the good kind      |

Only for numbers the client can stand behind. A fabricated specific is worse
than an honest generic. §14 flags every one that needs confirmation.

---

## 5. UX strategy

### 5.1 Who is on the page

| Segment                       | Share (est.) | Enters asking                 | Leaves if                          |
| ----------------------------- | ------------ | ----------------------------- | ---------------------------------- |
| **Leisure, planning ahead**   | ~55%         | "How much, and is it safe?"   | No price, or no checkable proof     |
| **Business, booking fast**    | ~20%         | "Fastest option, invoice?"    | More than three steps to a price    |
| **Returning customer**        | ~15%         | "Where is my booking?"        | No door — they phone instead        |
| **Travel agency / partner**   | ~5%          | "Rates, allocation, contact"  | Nothing addresses them             |
| **Last-minute, on mobile**    | ~5%          | "Can I still park tomorrow?"  | Availability is not visible         |

Currently the page is designed for segment 1 only, and even for them it withholds
the price. Segments 3 and 4 have no entry point at all.

**Design consequence:** one primary funnel (price → book), with three explicit
side doors that never compete with it — *Mijn reservering* (header), *Zakelijk &
reisbureaus* (one band + footer), *Direct bellen* (header, hero, FAQ, footer).

### 5.2 The journey we are designing

```
   ARRIVE            ORIENT             DECIDE           RESOLVE          ACT
     │                  │                  │                │             │
 Hero: what this is  Which service     Is it safe?      Objections     Book
 + a price in 5s     suits me?         Who says so?     answered       ────►
     │                  │                  │                │             │
  ticket card       service chooser    security +      FAQ + human     sticky bar
  price + dates     + price-from       verified proof   contact         always
```

Four principles govern every section below.

**① One question per screen.** No section asks the visitor to decide two things.
The hero asks *when*. The chooser asks *which*. Security asks nothing and only
reassures. Mixing them is what makes a page feel tiring rather than long.

**② The price is never more than one screen away.** Hero card, service cards,
sticky bar, closing CTA. Four price surfaces, one number, always all-in.

**③ Objections are handled in falling order of frequency.**
Cost → safety → cancellation → timing → delays. Which is also the FAQ order,
which is also the section order. That alignment is not decorative: it means a
visitor who scrolls linearly meets each worry roughly when they first have it.

**④ Every claim carries its evidence within one line of itself.**
"Veilig" alone is noise. "Veilig — 24/7 camerabewaking, afgesloten terrein" is
information. Where no evidence exists, the claim is cut, not softened.

### 5.3 Reducing cognitive load

Concretely, against the current build:

- **Cut the section count from 9 to 8 while adding four new blocks**, by merging
  `WhyUs` + `Security` into one *"Zo houden we uw auto veilig"* section (they are
  the same argument at two temperatures), and dropping the absorbed `USPS` row
  entirely — its four claims already appear in `REASONS`, the hero proof row and
  the FAQ.
- **Cap every section at one CTA.** `WhyUs` currently ends with two ("Bekijk
  tarieven" + "Hoe het werkt"). Two equal-weight CTAs is a decision, and a
  decision costs more than a click.
- **Never more than 4 items in a scannable group.** Already respected; state it
  as a rule so it stays true.
- **Progressive disclosure on price.** Headline price on the card; the breakdown
  behind a "Wat zit erbij in?" disclosure. Everything shown, nothing forced.

---

## 6. Design system

The existing token layer in `src/app/globals.css` is the foundation and does not
change. This section **extends** it. Every addition is listed with what it is
for; nothing here overwrites an approved anchor.

### 6.1 Typography

**Scale — unchanged.** `display-2xl` → `display-sm`, `lead`, body, plus the
`eyebrow`, `numeric` and `ghost-numeral` utilities. It is fluid, it is
well-spaced, it is better than both competitors'. Keep.

**Three additions:**

```css
/* Prices. The one figure a visitor is here to read, and the only thing on the
   site allowed to compete with the H1 for size within a card. Mono, tabular,
   tightly tracked — it belongs to the departure-board voice, not to the
   marketing voice. */
--text-price: clamp(2rem, 1.5rem + 2.2vw, 3rem);
--text-price--line-height: 1;
--text-price--letter-spacing: -0.03em;
--text-price--font-weight: 700;

/* Price qualifier: "per dag", "incl. btw". Sits on the price baseline. */
--text-price-unit: 0.9375rem;

/* Long-form measure for the two places we run real prose (about, help). */
--text-prose: 1.0625rem;
--text-prose--line-height: 1.7;
```

**Rules that stay rules:**

- `display-2xl` — the H1 only. Nowhere else, ever. That exclusivity is what makes
  the hero read as the hero.
- Measure: 46–52ch for prose, 34–38ch for supporting copy, 12–18ch for headings.
  Already applied consistently via `max-w-[NNch]`. Keep doing exactly this.
- **Never emphasise inside a headline with colour.** RP's blue word is the
  pattern to avoid. Emphasis comes from size, weight and position.
- Words never take the mono face; only figures. Already documented in
  `TrustStrip`. Elevate it to a system rule.

### 6.2 Colour

**The ramps and semantic aliases are unchanged.** Navy, valet, paper, ink, and
the verified contrast table. One accent. No third hue.

**What is missing, and is needed the moment a booking form exists:** there are no
status colours in the system. A price calculator has validation, availability
states, and errors, and right now a component would have to invent a hex — which
the file explicitly forbids.

```css
/* -- Status ---------------------------------------------------------------
   Deliberately desaturated and hue-shifted toward the navy line so they read
   as part of this palette rather than as browser defaults. These are the ONLY
   hues outside navy/valet/paper/ink, they appear only in form and booking
   feedback, and they are never used decoratively. Verified on paper-50. */
--color-success:      #1a7a52;  /*  4.8:1  — confirmations, availability   */
--color-success-wash: #e8f5ee;
--color-warning:      #9a6410;  /*  4.9:1  — low availability, cut-offs    */
--color-warning-wash: #fdf3e0;
--color-danger:       #b3261e;  /*  5.1:1  — validation errors only        */
--color-danger-wash:  #fdecea;

/* On the inverse surfaces, the same three lightened to clear 4.5:1 on
   navy-950. Status must be legible in the sticky bar and the dark hero card. */
--color-success-inverse: #5cc998;
--color-warning-inverse: #e5b25c;
--color-danger-inverse:  #f08e86;
```

**Never** use `--color-success` as a decorative accent — that is exactly how RP
ended up with five colours. Status colour appears only where the system is
reporting the state of something.

### 6.3 Buttons

Current `Button` variants: solid accent, `onDark`, `outline`, `link`. Sound.
Three refinements:

| Variant     | Use                                | Rule                                     |
| ----------- | ---------------------------------- | ---------------------------------------- |
| `primary`   | The booking action                 | **Max one per viewport.** Non-negotiable |
| `secondary` | Tarieven, Hoe het werkt            | Outline on light, `onDark` on inverse    |
| `link`      | Tertiary, inline                   | Underline offset 4, never a lone CTA     |
| `ghost`     | *New.* Header, utility bar, nav    | No border until hover                    |

**Additions the booking flow requires:**

- **A loading state.** Price calculation takes network time. Without a pending
  state the visitor double-submits. Spinner replaces the arrow; label swaps to
  *"Prijs berekenen…"*; `aria-busy`; width locked so the button does not resize.
- **A disabled state that explains itself.** Never a greyed button alone —
  always a sibling line saying what is missing (*"Kies eerst een retourdatum"*).
  A disabled control with no explanation is the most common dead-end in booking
  UIs.
- **48px minimum touch target** on every control, including the header phone
  link and the date-field steppers.

The existing `data-arrow` hover translate is the correct amount of
micro-interaction. Do not add more.

### 6.4 Cards

Three types, and no fourth may be introduced:

| Type            | Radius       | Elevation        | Where                            |
| --------------- | ------------ | ---------------- | -------------------------------- |
| **Surface**     | `--radius-xl` | `--shadow-card`  | Text/content cards               |
| **Photographic**| `--radius-xl` | `--shadow-photo` | Service chooser, gallery         |
| **Ticket**      | `--radius-2xl`| `--shadow-ticket`| Booking card, confirmation only  |

`glass-dark` stays restricted to panels laid over a photograph, per its own
comment. That restriction is the difference between glassmorphism as a material
and glassmorphism as a tell.

**Hover, one rule for all three:** `translateY(-6px)` + shadow step up, over
`--duration-micro` on `--ease-settle`. No scale, no border-colour change, no
glow. `ServiceChooser` already does this at `-translate-y-1.5`; standardise.

### 6.5 Spacing and rhythm

The `Section` component takes `spacing="lg" | "none"`. Two values is not a
rhythm — it is why every section currently weighs the same (§3.2 ⑥).

Proposed four-step scale, and the rule for choosing:

```
sm   →  py-16 lg:py-20    Utility bands, the trust board, the location strip
md   →  py-20 lg:py-28    Standard content sections
lg   →  py-28 lg:py-40    Sections carrying a photograph or a decision
xl   →  py-32 lg:py-48    The hero and the closing CTA only
```

**The rule: a section's vertical space is proportional to the weight of the
decision it asks for, not to how much content it holds.** A tall section that
asks nothing is an interruption; a generously spaced section that asks for the
booking reads as important. This single change does more for perceived quality
than any new component.

Horizontal: `Container` unchanged. Add a `narrow` variant (max-width ~68ch) for
prose-led pages — help, terms, about — where the wide container leaves lines too
long to read comfortably.

### 6.6 Radius, elevation, borders

Unchanged, and the reasoning in `globals.css` is right: tight radii, pills only
where the shape carries meaning, navy-tinted shadows because grey shadows on
warm paper read as dirt.

One addition — the sticky bars need an elevation that reads as *floating above
the document* rather than *sitting on it*:

```css
--shadow-sticky:
  0 -1px 0 color-mix(in srgb, var(--color-navy-950) 8%, transparent),
  0 -12px 32px -12px color-mix(in srgb, var(--color-navy-950) 22%, transparent);
```

Upward-cast, because the mobile booking bar is anchored to the bottom edge and a
downward shadow on a bottom-anchored element is physically wrong.

### 6.7 Icons

Lucide, `strokeWidth={1.75}`, `size-5`/`size-6`. Consistent already. Rules:

- **Icons never carry meaning alone** — always paired with a label. Present
  usage is compliant.
- **Never in a filled coloured circle.** Four filled circles in a row is RP's
  benefits grid and the single most recognisable generated-page pattern. Our
  bare-icon-plus-hairline treatment in `WhyUs` is the house style.
- **One accent-coloured icon per group, maximum**, and only when it marks the
  recommended option.
- `aria-hidden` on every decorative icon. Already done throughout.

### 6.8 Imagery

The `photo` grade (`saturate(0.82) contrast(1.06)` + 8% navy veil) is doing real
work: it makes a sodium-lit deck and a cold night lot read as one estate. Keep
it exactly, and keep the `scrim-hero` / `scrim-band` / `scrim-card` family.

**What the library needs, ranked** (per §3.2 ⑩):

1. **People.** Minimum three new frames with human faces: the handover at the
   kerb, a customer collecting keys on return, the shuttle interior with
   passengers. We sell relief; relief has a face.
2. **The location.** Wide establishing shot of the terrain, the entrance as it
   appears from the road, the shuttle at the departure hall. Needed for the new
   location section, and it doubles as proof the place exists.
3. **Daylight.** The library is almost entirely night. Half of all handovers are
   in daylight; showing only night reads as either atmospheric styling or as
   hiding something.

**Treatment rules:** `object-cover` always, `sizes` always accurate (currently
correct), `priority` on the hero frame only, `alt=""` plus `aria-hidden` for
decorative frames — all already correct. Add: **no image with a face may be
`aria-hidden` if the face is the content.** A photo of a customer being handed
keys is information, not wallpaper.

### 6.9 Component inventory

New components this strategy requires, none of which break the existing system:

| Component            | Purpose                                        | Built from                    |
| -------------------- | ---------------------------------------------- | ----------------------------- |
| `PriceDisplay`       | Price + unit + qualifier                       | `--text-price`, `numeric`     |
| `PriceBreakdown`     | Disclosure: what is included                   | `Accordion`                   |
| `ReviewCard`         | Source mark, name, date, stars, body           | `Card` surface                |
| `ReviewSummary`      | Score, count, source, link out                 | New, small                    |
| `IntentTabs`         | Leisure / business / partner                   | New; `role="tablist"`         |
| `AvailabilityPill`   | "Nog X plaatsen" / "Beperkt beschikbaar"       | `Badge` + status colours      |
| `LocationMap`        | Static map + route + travel times              | New; static image, no JS map  |
| `UtilityBar`         | Phone, language, Mijn reservering              | Replaces `Marquee`            |
| `BookingSummaryBar`  | Sticky: dates, price, CTA                      | Extends `StickyBookingBar`    |
| `FieldError`         | Validation message + `aria-describedby`        | Extends `Field`               |

---

## 7. Page structure, section by section

Current order → proposed order:

```
CURRENT                          PROPOSED
──────────────────────────────   ────────────────────────────────────────────
                                 0.  Utility bar          ← replaces Marquee
Header                           1.  Header               ← + Mijn reservering
Hero                             2.  Hero + price ticket  ← CHANGED
TrustStrip                       3.  Trust board          ← + verified score
ServiceChooser                   4.  Intent row           ← NEW
WhyUs                            5.  Service chooser      ← + price-from
Security                         6.  Price transparency   ← NEW
HowItWorks                       7.  Safety (WhyUs+Security merged) ← MERGED
Testimonials                     8.  Process
Faq                              9.  Location & route     ← NEW
ClosingCta                       10. Verified reviews     ← REBUILT
Footer                           11. Business band        ← NEW
                                 12. FAQ
                                 13. Closing CTA
                                 14. Footer               ← + Mijn reservering
```

Surface alternation, kept from the current build's logic — nine surfaces never
read as one stack of cards:

```
navy → navy → cream → white → cream → navy → cream → white → cream → navy → cream → navy
```

Only navy adjacency is hero → trust board, which is one block because the ticket
overhangs the seam. Unchanged and correct.

---

### 0. Utility bar — *new, replaces the marquee*

**Purpose.** Give the three non-funnel audiences a permanent door without letting
them compete with the booking CTA.

**Layout.** 36px, `navy-950`, above the header. Left: phone number, `numeric`,
tappable. Right: `NL / EN` switcher, then **"Mijn reservering"** with a small
ticket glyph. Mobile: phone left, "Mijn reservering" right, language moves into
the mobile menu.

**UX reasoning.** The marquee occupies this space today and carries no
information (§3.2 ⑨). Same pixels, three real jobs. The phone number in
particular: a meaningful share of this audience is deciding on a phone whether a
parking website can be trusted with their car, and a visible tappable number is
the cheapest trust signal available — the hero already argues this in a comment.

**Hierarchy.** Deliberately the quietest band on the page. `text-xs`,
`navy-300`, hairline bottom border. It must be findable, never noticed.

**CTA.** None. This bar contains no primary action by design.

---

### 1. Header

**Purpose.** Orientation and a permanent route to booking.

**Layout.** Sticky, `h-20` shrinking to `4.5rem` on scroll (already built in
`HeaderShell` + `SiteHeader` — keep exactly). Logo left; nav centre-right; phone
+ primary CTA right. Transparent over the hero, `navy-950` with a hairline once
scrolled.

**Changes:** nav becomes **Onze services · Tarieven · Zo werkt het · Contact**.
"Reisbureaus" moves out of primary nav into the new business band and the footer
— it serves ~5% of visitors and currently takes 20% of the nav. The route
`/samenwerken/` and its label are unchanged (it ranks; `site.ts` is explicit
about not touching it).

**UX reasoning.** Four items is scannable in one fixation. Five with one that
most visitors cannot place ("Reisbureaus" — are they a travel agency?) makes the
whole set slower to read.

**Hierarchy.** Logo → CTA → nav → phone. The CTA is the only filled element in
the bar, which is what makes it read as the action.

**CTA.** `Reserveer nu` right-aligned, always visible. On scroll past the hero it
gains the current price context — *"Reserveer nu · vanaf €6,50"* — if a price is
available for the visitor's selected dates.

---

### 2. Hero — *the section that changes most*

**Purpose.** In five seconds: what this is, that it is safe, what it costs, and
where to start.

**Layout.** Unchanged structurally — `7fr / 5fr` at `lg`, photograph with
`scrim-hero` running right, headline column left, ticket right overhanging into
the band below. The load sequence, the line-by-line H1 mask, the 30s single-pass
photo drift: all keep.

**What changes — the ticket becomes a calculator.**

```
┌─────────────────────────────────────┐
│  ● RESERVEREN            [ VALET ▾ ]│  ← service toggle, valet default
│                                     │
│  Aankomst      ma 12 aug   09:30    │
│  Vertrek       di 20 aug   14:00    │
│  ╌╌╌╌╌╌╌╌╌ perforation ╌╌╌╌╌╌╌╌╌╌╌  │
│                                     │
│  8 dagen                            │
│  € 74,50            ← --text-price  │
│  incl. btw · geen boekingskosten    │
│  ▸ Wat zit erbij in?                │
│                                     │
│  [ Reserveer voor € 74,50      → ]  │
│  ✓ Gratis annuleren tot 24 uur      │
└─────────────────────────────────────┘
```

**UX reasoning.**

- The number appears **before** the commitment. This is the single highest-value
  change in the document, and it is why RP's "Bereken prijs" outperforms our
  "Reserveer nu" despite everything else about our page being better.
- The CTA label carries the price. *"Reserveer voor € 74,50"* has no ambiguity
  about what happens next; *"Reserveer nu"* leaves the visitor braced for a
  surprise.
- The service toggle lives here, not only in the chooser below, because a
  returning customer already knows which one they want.
- "Geen boekingskosten" pre-empts the most common conversion killer in Dutch
  e-commerce — an unexpected line item at checkout.
- **Before a price is available** (no dates yet) the card shows *"vanaf €6,50 per
  dag"* so the fold is never priceless.

**Fallback if MyParking.pro exposes no pricing API.** Per `HANDOVER.md` §5 this
is unresolved. Then: a static rate table drives a client-side estimate, labelled
**"Richtprijs — definitieve prijs in de volgende stap"**. An honest estimate beats
no number. What we must not do is show an estimate as if it were final.

**Hierarchy.** H1 → price → CTA → lead → proof row. Note the price outranks the
lead paragraph. Everything below the CTA in the left column stays as built.

**CTA.** Primary in the card. Secondary "Bekijk alle tarieven" as a `link`
variant beneath. The current `Bekijk tarieven` outline button is demoted: once
the price is on the card it is no longer a peer of the booking action.

---

### 3. Trust board

**Purpose.** Four posted facts, in the departure-board voice, immediately after
the hero.

**Layout.** Unchanged. `navy-950`, continuous with the hero, hairline dividers,
`CountUp` figures in mono with tabular numerals, `pt-32` clearance for the
ticket's overhang. The comment explaining why the padding is load-bearing is
correct — preserve it.

**One change to content:**

| Now                                    | Proposed                                       |
| -------------------------------------- | ---------------------------------------------- |
| `15+` jaar actief op Schiphol          | Keep                                            |
| `Duizenden` tevreden reizigers per jaar | **`4,7`** gemiddeld · *38 Google-reviews →*    |
| `24 uur` van tevoren gratis annuleren  | Keep                                            |
| `AMS` valet- en shuttleservice         | **`5–8 min`** naar de vertrekhal                |

**UX reasoning.** "Duizenden" is the least credible item on the board precisely
because it is the largest claim with the least support (§4.2). Replacing it with
a checkable score and a link out converts our weakest trust element into our
strongest. "AMS" is a nice piece of styling that communicates nothing a visitor
does not already know; a transfer time is a real answer to a real question.

**Hierarchy.** Figure → label. Unchanged.

**CTA.** One, tertiary: the review count links to the source.

---

### 4. Intent row — *new*

**Purpose.** Let each segment self-identify in one line, before the product
question.

**Layout.** A single hairline-separated row of three, directly under the trust
board on cream, `spacing="sm"`. Not tabs, not cards — three text links with a
one-line qualifier each:

```
Op vakantie            Zakelijk op reis           Reisbureau of partner
Reis met familie of    Factuur op bedrijfsnaam,   Vaste tarieven,
bagage? Kies valet.    voorrang bij drukte.       eigen contactpersoon.
→ Bekijk valet         → Zakelijk parkeren        → Word partner
```

**UX reasoning.** SPL's "Ik ga…" pattern, at our scale (§2.2 ①). SPL needs a tab
set because it has four intents and a portal behind each. We need one row,
because the row's job is not to filter content — it is to tell three different
people that this site was built with them in mind, in the four seconds before
they decide whether to keep scrolling. **Deliberately not tabs:** tabs hide
content behind interaction and require ARIA we would have to get right; three
links hide nothing.

**Hierarchy.** The quietest content section on the page. Small type, hairlines,
no cards, no icons. It is a signpost, not a destination.

**CTA.** Three tertiary links. Never buttons — a button here would compete with
the hero CTA still visible above.

---

### 5. Service chooser

**Purpose.** The fork: valet or shuttle.

**Layout.** Structurally unchanged, and it is the best-built section on the
current site: split header with the supporting line right-aligned, two editorial
photo cards with the title set *on* the image over `scrim-card`, badge top-left,
body and hairline bullet list below, CTA pinned to the card foot with `mt-auto`.

**Three changes:**

1. **A price on each card**, in the header area next to the badge:
   *"vanaf €8,50 p/d"* / *"vanaf €6,50 p/d"*. The chooser currently asks the
   visitor to pick between two options while withholding the main axis they
   differ on.
2. **A comparison line under the pair** — one row, four cells: *tijd naar de
   vertrekhal · sleutels · prijsniveau · beste voor*. Two cards side by side make
   the reader hold both in memory to compare; a table does the comparing for
   them.
3. **Availability, if the API supports it.** `AvailabilityPill` on the card:
   *"Nog 12 plaatsen op 12 aug"*. Honest scarcity, driven by real data or absent
   entirely. **Never a fabricated countdown.** A fake urgency device on a page
   whose entire argument is trustworthiness costs more than it earns.

**UX reasoning.** This is the decision the whole page exists to support, and it
is the one section where more information is better than less. The mixed u/jij
address inside the bullets (flagged in the component's own TODO) should be
resolved here — pick one and align every string.

**Hierarchy.** Photo + title → badge → price → body → bullets → CTA.

**CTA.** One per card, full-width on mobile. Both to `/reservering/`, with the
service preselected if a parameter exists (`booking.ts` correctly refuses to
invent one — that stands until MyParking.pro confirms).

---

### 6. Price transparency — *new*

**Purpose.** Answer "what does it actually cost" completely, so nobody leaves for
the tariff page and never comes back.

**Layout.** White surface, `spacing="md"`. Left: a compact rate table — 3 / 7 /
14 / 21 dagen × valet / shuttle, `numeric`, tabular, aligned. Right: an
inclusions list and, below it, an explicit exclusions list.

**UX reasoning.** Publishing what is *not* included is counter-intuitive and it
is the strongest trust move on the page. A visitor who has been burned by a
booking-fee surprise is scanning for the catch; a site that states the catch
before being asked has answered the objection permanently. Neither competitor
does this.

```
Inbegrepen                         Niet inbegrepen
✓ Parkeren voor de gereserveerde   – Extra dagen bij latere terugkomst
  periode                            (€X per dag, achteraf afgerekend)
✓ Overdracht bij de vertrekhal     – Annuleringsdekking (optioneel, €X)
✓ 24/7 bewaakte locatie            – Auto wassen (optioneel, €X)
✓ Btw
✓ Geen boekingskosten
```

**Hierarchy.** Table → inclusions → exclusions → CTA. The exclusions column is
set at the same weight as the inclusions, not smaller. Shrinking it would
undo the entire point.

**CTA.** One: *"Bereken uw prijs"*, scrolling back to the hero ticket with focus
moved to the first date field. Focus movement is required, not optional — a
scroll alone leaves keyboard users behind.

---

### 7. Safety — *`WhyUs` + `Security`, merged*

**Purpose.** Answer "is my car safe" once, thoroughly, with evidence.

**Layout.** Keep `Security`'s treatment — it is the stronger of the two.
Full-bleed amber deck photograph, `scrim-band`, `SectionTear` on the seam above,
four `glass-dark` measure panels. Into it fold the four `REASONS` from `WhyUs` as
an editorial hairline list in the left column, over the photograph.

**What is cut:** the four `USPS`. Every claim in that row already appears in the
`REASONS`, the hero proof row, or the FAQ (§3.2 ⑧). The `WhyUs` component comment
is right that eight boxes would have been worse than four — the conclusion is
that four of the eight were never needed.

**What is added:** one specific figure per measure (§4.4).
*"24/7 videobewaking"* → *"24/7 camerabewaking, opnames 30 dagen bewaard"*.
*"Afgesloten parkeerterreinen"* → *"Afgesloten terrein, 340 plaatsen, één
in- en uitgang"*. Subject to client confirmation of every number.

**UX reasoning.** This is the emotional low point of the page — the "my car is in
another country from me" moment — and the current build correctly gives it the
only full-width photograph. Merging removes a redundant section without removing
a single argument, and buys the vertical space that the three new sections need.

**Hierarchy.** Heading → lead → four reasons → four measures. One temperature,
one section, one argument.

**CTA.** None. This section deliberately asks for nothing; it exists to remove a
reason to say no. The next section's CTA is close enough.

---

### 8. Process

**Purpose.** Show that the handover is short and that nothing is required of the
visitor that they have not already thought of.

**Layout.** Unchanged. Four steps, horizontal timeline at `lg` / vertical below,
scroll-linked connector (`scaleX` / `scaleY` off one progress value), ticks
resolving as the line reaches them, `ghost-numeral` markers in `navy-300`. This
is the best-executed piece of motion on the site and the only scroll-linked
animation — keep the budget exactly.

**One change:** a time under each step — *"2 minuten" · "bij aankomst" · "5 min
overdracht" · "auto klaar binnen 5 min"*. The section claims speed and shows
sequence; adding duration makes it claim speed and *show* speed.

**UX reasoning.** The `<span className="sr-only">Stap {n}:</span>` pattern is
correct and stays: the numeral is decorative and `aria-hidden`, the order is
carried by the DOM and the heading.

**Hierarchy.** Numeral → title → body → duration.

**CTA.** One, after step 4: *"Reserveer nu"*. This is the first CTA since the
service chooser and it lands at the natural end of the explanation.

---

### 9. Location & route — *new*

**Purpose.** Answer "where do I actually drive to", which the site currently
never answers (§3.1 ⑤).

**Layout.** Cream, `spacing="sm"`. Left: a **static** map image — the terrain
relative to Schiphol, our marker, the A4, the terminals. Right: three blocks —
*Vanaf de A4* (exit, minutes), *Naar de vertrekhal* (5–8 min shuttle / direct
valet), *Bij terugkomst* (call on landing, wait time).

**UX reasoning.** Practical, and it is also proof: a business that shows exactly
where it is, is a business that exists. A static map, not an embedded interactive
one — an embedded map is ~300KB of third-party JavaScript, sets cookies before
consent, and nobody pans it. A crisp static image with a "Open in Google Maps"
link does the job at 40KB with no GDPR exposure. This is consistent with the
self-hosted-fonts decision in `HANDOVER.md` §6.

**This section is blocked** on the client deciding whether the terminal address
may be published (`HANDOVER.md` §2, question 2). If it may not, the section still
ships with route and travel times and without a pin.

**Hierarchy.** Map → route → times.

**CTA.** One tertiary: *"Route in Google Maps"*.

---

### 10. Reviews — *rebuilt*

**Purpose.** Proof from someone who is not us.

**Layout.** Keep the asymmetric structure — it is better than RP's carousel. Left
column, sticky: the score. Right column: reviews as hairline-separated entries,
not boxes.

**What changes — everything about the content:**

```
Left column                        Right column (per entry)
──────────────────                 ────────────────────────────
      4,7                          ★★★★★    ⌾ Google · 12 maart 2026
   ★★★★★                          "Top service! Auto netjes …"
Gebaseerd op 38                    Mark v.D. · Schiphol reiziger
Google-reviews
                                   ─────────────────────────────
[Lees alle reviews →]              ★★★★☆    ⌾ Google · 3 maart 2026
                                   …
```

Source mark, date, per-review star count, link out. Where a review is genuinely
4 stars, **show 4 stars** — an unbroken wall of five-star reviews is the single
most reliable signal that a review section is fabricated.

**On `AggregateRating`.** The decision in `site.ts` — plain text, no markup —
stays until reviews are verifiable at source. Once a real Google Business Profile
with a real count exists, revisit: the rating then becomes eligible, and the
manual-action risk that motivated the original decision goes away. Not before.

**UX reasoning.** §4.2. This is the largest credibility gap on the site and the
only section here whose fix is mostly a business action rather than a build.

**Hierarchy.** Score → count + source → individual reviews.

**CTA.** One tertiary: link to the source.

---

### 11. Business & partners — *new*

**Purpose.** Serve the ~25% of traffic that is business or trade, without letting
them dilute the consumer funnel.

**Layout.** `navy-950`, `spacing="sm"`, two columns. Left: heading, one
paragraph, three bullets — *factuur op bedrijfsnaam · voorrang bij drukte · vaste
tarieven per contract*. Right: a single surface card with a short contact form or
a direct line to the account contact.

**UX reasoning.** RP does this and it works (§2.1 ④). One band on the homepage
plus a footer link serves both segments; a nav slot for 5% of visitors does not
(§7.1). Placed after the reviews because a business buyer needs the same proof a
consumer does before caring about invoicing terms.

**Blocked** on client copy for `/samenwerken/` — `HANDOVER.md` §3 item 5
documents the copy-paste damage on that page. The band is short enough to ship
with three confirmed lines while the full page waits.

**Hierarchy.** Heading → bullets → contact card.

**CTA.** One: *"Neem contact op"* — deliberately not "Reserveer". This audience
converts through a conversation, and offering them the consumer CTA signals we
have not understood them.

---

### 12. FAQ

**Purpose.** Clear the last objections, and rank for the long-tail queries.

**Layout.** Unchanged, and the reasoning in the component is right: sticky left
column with the heading and a route to a human, accordion right, one array
driving both the UI and the `FAQPage` JSON-LD so the markup can never describe an
answer the page does not show.

**Two changes:**

1. **Reorder to match objection frequency** (§5.2 ③): price → safety →
   cancellation → timing → delays → keys → arrival time. Currently safety leads
   and there is no price question at all. Add one: *"Wat kost lang parkeren op
   Schiphol?"* — it is the highest-volume query in this market and we currently
   answer it nowhere on the homepage.
2. **First item open by default** stays (`defaultOpen={0}`); with the reorder,
   that means the price answer is visible without interaction.

**Hierarchy.** Heading → contact block → accordion.

**CTA.** The contact block. Not a booking CTA — someone reading an FAQ has an
unanswered question, and pushing them to book before it is answered is the
fastest way to lose them.

---

### 13. Closing CTA

**Purpose.** The ask, at the point of highest confidence.

**Layout.** Unchanged. Full-bleed deck-corridor photograph, `scrim-band`,
`SectionTear` above, centred heading, two buttons, three reassurances on a
hairline. It echoes the hero deliberately and it works.

**One change:** the primary button carries the price if dates have been selected
— *"Reserveer voor € 74,50"* — otherwise *"Bereken uw prijs"*. State carried from
the hero card. A visitor who reaches the bottom having chosen dates should not be
asked to enter them again.

**Hierarchy.** Heading → lead → CTAs → reassurances.

**CTA.** Two: book (primary) and phone (`onDark`). Correct as built — at the
close, the phone is not a competing action but an alternative for the segment
that will not transact online.

---

### 14. Footer

**Purpose.** Complete the trust picture and provide every remaining route.

**Layout.** Unchanged in structure. Logo + tagline, service links, company
links, NAP, payment marks, legal identity (KvK 74048856), copyright.

**Three additions:**

1. **"Mijn reservering"** in the company column, mirroring the utility bar.
2. **The review score with its source link**, once more.
3. **Opening hours** for the phone line. "24/7 service" is claimed on the site;
   the *office* hours are a different fact and visitors need both.

**UX reasoning.** The KvK number and the payment marks are already there and they
are doing more work than they appear to — RP publishes neither. Keep the legal
block visible rather than tucking it behind a link.

**Hierarchy.** Brand → links → NAP → legal.

**CTA.** None. The footer is a resource, not a funnel.

---

### 15. Sticky booking bar

**Purpose.** Keep the booking action within thumb reach for the whole scroll.

**Layout.** Currently `lg:hidden`, appears once `#hero-booking` leaves the
viewport, stands down at the footer. Keep that logic exactly — it is well
implemented.

**Two changes:**

1. **Show the selected state, not just a button:** `12–20 aug · 8 dagen ·
   €74,50` on the left, `Reserveer →` on the right. A bare button is a
   reminder; a summary is a receipt in progress.
2. **Desktop gets a slim version too**, appearing only after the process section
   — a 56px bar, not the full card. Desktop sessions are where comparison happens
   and where the visitor is most likely to be in another tab.

Uses `--shadow-sticky` (§6.6). Respects `env(safe-area-inset-bottom)`.

---

## 8. Motion system

The current budget is correct and rare: Framer for the hero sequence and the
process timeline; everything else on a ~400-byte IntersectionObserver hook; one
easing family; reduced motion honoured globally *and* in JS so those users get
final positions rather than 0ms animations. **Do not spend more than this.**

**The five principles, stated so they survive future contributors:**

1. **One easing family.** `--ease-settle`, everywhere. Everything decelerates the
   way a car comes to rest. No second curve. `--ease-out-expo` is currently an
   alias of the same cubic-bezier — either make it genuinely different or drop it,
   because a token that lies is worse than no token.
2. **Motion clarifies state or relationship, never decorates.** The perforation
   draws because the ticket is being issued. The timeline draws because the line
   is arriving at a stop. If an animation cannot be justified in one sentence
   like that, it is deleted.
3. **Nothing below the fold animates on load.** Already true.
4. **Reveals travel 14px and last 520ms.** One reveal per section, staggered
   80ms between siblings, never more than four in a chain. Already the case.
5. **Reduced motion returns content, not nothing.** The hero comment documents a
   real bug found here — `initial: false` left elements with no animate target
   and rendered the hero empty below the H1. That fix and its comment are load-
   bearing; do not simplify them.

**New motion this strategy introduces — three things, all functional:**

| Where             | What                                          | Why                                     |
| ----------------- | --------------------------------------------- | --------------------------------------- |
| Price update      | Number cross-fades + 4px rise, 240ms          | Marks that a value *changed*            |
| Sticky bar entry  | Slide from below, 280ms                       | It came from somewhere                  |
| Accordion         | Height + opacity, 220ms                       | Already correct; keep                   |

**What is forbidden:** parallax beyond the existing single-pass photo drift;
looping Ken Burns (the hero comment already argues this correctly); counters that
re-trigger on every scroll (`CountUp` fires once — keep); scroll-jacking; entrance
animations on anything the user is trying to interact with.

---

## 9. Responsive strategy

**Breakpoints.** Tailwind defaults, unchanged. Real layout shifts at `sm` (640),
`lg` (1024). Content-driven, not device-driven.

**Mobile is the primary design target** for this business: a large share of
sessions are people standing in a kitchen the night before a flight, or in a car
park having second thoughts.

### Mobile priorities

| Priority | Requirement                                                        |
| -------- | ------------------------------------------------------------------ |
| 1        | Price visible without scrolling past the hero                      |
| 2        | Sticky bar with dates + price, always in thumb reach                |
| 3        | Date fields open the native picker; no custom calendar on touch     |
| 4        | 48px minimum on every target, including utility-bar links           |
| 5        | Phone number tappable from any screen without opening a menu        |
| 6        | Hero H1 no more than three lines at 360px                          |

### Section-by-section mobile behaviour

| Section          | Mobile treatment                                            |
| ---------------- | ----------------------------------------------------------- |
| Utility bar      | Phone left, Mijn reservering right; language into menu       |
| Hero             | Photo behind flat heavy scrim (already built); ticket below headline, full width |
| Trust board      | 2×2 grid (already built)                                     |
| Intent row       | Stacked, hairline-separated                                  |
| Service chooser  | Stacked; comparison row becomes a two-column definition list |
| Price table      | Horizontal scroll **with a visible edge fade**, not clipped — the mistake SPL makes twice |
| Safety           | Photo as background, measures 2×2                            |
| Process          | Vertical timeline (already built)                            |
| Location         | Map full-bleed, route blocks stacked                         |
| Reviews          | Score first, then reviews stacked                            |
| FAQ              | Full-width accordion; sticky column becomes a static header  |

### Tablet (768–1023)

The weakest breakpoint on most sites because nobody looks at it. Rules: the
service chooser stays two-up (the cards are the comparison); the process timeline
stays vertical until `lg`; the FAQ two-column layout starts at `lg` only. Verify
the hero at 834×1194 portrait specifically — the `7fr/5fr` split at that width is
the most likely place for the ticket to become cramped.

---

## 10. Conversion optimisation

### 10.1 The friction inventory

Every point between arrival and booking where a visitor can stall, ordered by
estimated cost:

| #  | Friction                                        | Fix                                    | §    |
| -- | ----------------------------------------------- | -------------------------------------- | ---- |
| 1  | No price without navigating                     | Hero calculator                        | 7.2  |
| 2  | Proof is unverifiable                           | Sourced reviews                        | 7.10 |
| 3  | Dates may not carry into the iframe             | Confirm params, or own the first step  | 14   |
| 4  | Third-party iframe = visual + trust discontinuity | Frame it in our ticket; keep chrome  | —    |
| 5  | Booking-fee uncertainty                         | "Geen boekingskosten" on the card      | 7.2  |
| 6  | Unclear what happens on a delayed flight        | FAQ moved up + hero micro-copy         | 7.12 |
| 7  | No way to reach a human at the moment of doubt  | Phone in utility bar, hero, FAQ, footer | 7.0 |
| 8  | Returning customer has no door                  | Mijn reservering                       | 7.0  |
| 9  | Business buyer has no path                      | Business band                          | 7.11 |
| 10 | No idea where the terrain is                    | Location section                       | 7.9  |

### 10.2 Micro-copy that does measurable work

| Where               | Instead of        | Use                                        |
| ------------------- | ----------------- | ------------------------------------------ |
| Hero CTA            | Reserveer nu      | **Reserveer voor € 74,50**                 |
| Hero CTA (no dates) | Reserveer nu      | **Bereken uw prijs**                       |
| Under hero CTA      | —                 | Gratis annuleren tot 24 uur voor aankomst   |
| Price               | € 74,50           | **€ 74,50** · incl. btw · geen boekingskosten |
| Service CTA         | Reserveer Valet…  | **Kies valet — vanaf € 8,50 p/d**          |
| Business CTA        | Reserveer nu      | **Vraag zakelijke tarieven aan**           |
| Form errors         | Ongeldige datum   | **Kies een retourdatum na 12 augustus**    |

The pattern throughout: **state the outcome, not the mechanism.** "Reserveer voor
€74,50" describes what the visitor gets. "Reserveer nu" describes what they do.

### 10.3 Trust signals, and where each is placed

| Signal                    | Placement                                  |
| ------------------------- | ------------------------------------------ |
| Verified review score     | Trust board, reviews, footer               |
| 15+ jaar                  | Trust board, safety section                |
| Free cancellation         | Hero card, service cards, close, FAQ       |
| No booking fee            | Hero card, price section                   |
| KvK + legal entity        | Footer                                     |
| Payment marks             | Footer, and **beside the hero CTA**        |
| Phone number              | Utility bar, hero, FAQ, close, footer      |
| 24/7 camera surveillance  | Hero proof row, safety section             |

Payment marks moving next to the hero CTA is a small change with a
disproportionate effect: iDEAL beside a price is the strongest single "this is a
real Dutch business" signal available, and it currently only appears 5,000 pixels
below the decision.

### 10.4 What we will not do

- **No fabricated urgency.** No countdown timers, no "3 mensen bekijken dit nu",
  no invented scarcity. Real availability data or nothing. On a page whose entire
  argument is that we can be trusted with a car, a fake timer is self-defeating.
- **No exit-intent modal.**
- **No chat widget** until there is someone to answer it. An unattended bubble is
  worse than none.
- **No newsletter interstitial.**
- **No cookie wall.** Consent stays as built (`lib/consent.ts`), analytics gated.

### 10.5 Measurement

Instrument before changing, so the changes can be judged:

- Hero price calculated (rate, and time-to-first-calculation)
- Calculate → booking-start conversion
- Service chosen (valet / shuttle split)
- Sticky bar CTA rate vs hero CTA rate
- FAQ items opened, ranked (tells us the real objection order)
- Scroll depth at each section boundary
- Phone taps by placement
- Mijn reservering usage (and the support-call volume it displaces)

---

## 11. Accessibility

The current baseline is strong: verified contrast table, focus never removed only
restyled, reduced motion honoured in CSS and JS, `SkipLink`, `aria-labelledby` on
sections, decorative icons hidden, `sr-only` step numbers, no-JS reveals.

**Target: WCAG 2.2 AA, verified, with the AAA text contrast we already have.**

### What the new sections must get right

| Component        | Requirement                                                          |
| ---------------- | -------------------------------------------------------------------- |
| Price calculator | Result in `aria-live="polite"`; the price change must be announced    |
| Date fields      | Real `<label>`s, never placeholder-as-label (RP's mistake); `aria-describedby` for format; errors in `aria-live` |
| Loading button   | `aria-busy`, label change, width locked to prevent layout shift       |
| Availability     | Never colour alone — always an icon or a word alongside               |
| Intent row       | Plain links. Chosen over tabs partly to avoid `role="tablist"` complexity |
| Sticky bar       | Not a focus trap; reachable in DOM order; dismissible                 |
| Map              | Real `alt` describing the location; route also given as text          |
| Reviews          | `<blockquote>` + `<cite>`; star rows `aria-hidden` with the score in text |
| Utility bar      | First in DOM after skip link; 48px targets                            |

### Standing rules

- **Colour is never the only carrier of meaning.** The new status tokens (§6.2)
  always ship with an icon or a word.
- **Focus order follows visual order.** The sticky bar is the main risk: it is
  visually last and must not jump earlier in the tab order.
- **Every form error is programmatically associated** with its field via
  `aria-describedby` and announced.
- **Touch targets 48px minimum**, including the utility bar, which is the
  smallest bar on the page and therefore the one most likely to fail.
- **Test with keyboard only, then with VoiceOver, then at 200% zoom, then with
  `prefers-reduced-motion`.** All four, on the booking flow specifically.

---

## 12. SEO structure

### Heading outline (homepage)

```
h1   Zorgeloos lang parkeren op Schiphol.
h2   Kies uw parkeerwijze bij Schiphol
  h3   Valet Parkeren
  h3   Shuttle Parkeren
h2   Wat kost lang parkeren op Schiphol?
h2   Uw auto is veilig terwijl u zorgeloos reist
  h3   ×4 measures
h2   Geregeld in 4 eenvoudige stappen
  h3   ×4 steps
h2   Waar u ons vindt
h2   Wat onze klanten zeggen
h2   Zakelijk parkeren en reisbureaus
h2   Alles over onze dienstverlening
  h3   ×8 FAQ questions
h2   Begin uw reis ontspannen
```

One `h1`. No level skipped. Every `h2` contains a term someone actually searches.

### Structured data

| Schema           | Status   | Note                                                    |
| ---------------- | -------- | ------------------------------------------------------- |
| `FAQPage`        | Built    | One array → UI + JSON-LD. Keep this pattern.            |
| `BreadcrumbList` | Built    | Driven from `navigation`                                |
| `LocalBusiness` / `ParkingFacility` | Built | Service-area model, geo, no fabricated street address |
| `Service` ×2     | **Add**  | Valet and shuttle, each with `areaServed` + `provider`  |
| `Offer`          | **Add**  | Only once real prices are published — with `priceCurrency`, `validFrom` |
| `AggregateRating`| **Hold** | Revisit only when reviews are verifiable at source (§7.10) |

### Content SEO

- **"Wat kost lang parkeren op Schiphol"** is the highest-volume query in this
  market and the homepage currently answers it nowhere. §7.6 and the new FAQ
  entry fix that. This is as much an SEO change as a conversion one.
- Keep every existing URL. `trailingSlash: true` and the deliberate `#Shuttle`
  capitalisation in `footerNav` are load-bearing for indexed links — `site.ts` is
  explicit and correct about this.
- The `/samenwerken/` slug stays even though its nav label changes; it ranks.
- NAP consistency is already fixed and is the highest-value local-SEO work on the
  site. Do not let a new component hard-code a phone number.
- **If a language switcher ships**, `hreflang` on every page, `x-default` to NL.
  Do not ship the switcher before the EN pages exist — a flag that leads to a 404
  is worse than no flag.

---

## 13. Performance budget

Current decisions worth defending: self-hosted fonts (no `fonts.gstatic.com`
request, so no visitor IP to Google — a live GDPR exposure on an NL-only site,
and one fewer DNS + TLS handshake before first paint), IntersectionObserver
instead of an animation runtime for reveals, the iframe lazy-loaded and
sandboxed and only requested near the viewport.

| Metric              | Target   | Main risk                                  |
| ------------------- | -------- | ------------------------------------------ |
| LCP                 | < 2.0s   | The hero photograph                        |
| CLS                 | < 0.05   | Sticky bar entry; price text resizing      |
| INP                 | < 150ms  | Price calculation round-trip               |
| JS (homepage)       | < 120KB  | Framer is already hero-only; keep it there |
| Images (above fold) | < 200KB  | One AVIF hero frame, `priority`            |

**Rules:**

- One `priority` image per page. The hero. Nothing else.
- The price calculator must render its container at final size before the number
  arrives — reserve the space, or CLS moves the moment the price appears, which
  is the worst possible moment.
- Static map image, never an embedded map SDK (§7.9).
- The MyParking.pro iframe stays lazy and near-viewport-gated. It is a third
  party we do not control and it must never be able to block our own paint.
- Node 22 LTS on Vercel per `HANDOVER.md` §6 — local is on 23.11, which is not an
  LTS line.

---

## 14. Roadmap and open questions

### Sequenced by value per unit of effort

**Phase 1 — the price (highest value, blocked on one answer)**

1. Confirm whether MyParking.pro exposes a pricing/availability API
   (`HANDOVER.md` §2 question 4). Everything in this phase depends on it.
2. Hero ticket calculates and displays a price
3. CTA labels carry the price
4. "vanaf €X p/d" on both service cards
5. Price transparency section, including the exclusions column

**Phase 2 — proof**

6. Client collects Google reviews (business action; start now, it has the longest
   lead time of anything in this document)
7. Reviews section rebuilt with source, date and count
8. Trust board: "Duizenden" → verified score
9. Payment marks beside the hero CTA

**Phase 3 — the side doors**

10. Utility bar replaces the marquee
11. "Mijn reservering" — even if v1 is only a lookup form
12. Business band
13. Intent row

**Phase 4 — depth**

14. Location & route section
15. `WhyUs` + `Security` merged; `USPS` row cut
16. Section spacing scale applied
17. New photography commissioned (people, daylight, the location)
18. Desktop sticky bar

### Open questions — client

| #  | Question                                                                 | Blocks         |
| -- | ------------------------------------------------------------------------ | -------------- |
| 1  | Does MyParking.pro expose pricing and availability?                      | All of Phase 1 |
| 2  | Confirmed prices per day, valet and shuttle, per duration band           | 7.2, 7.5, 7.6  |
| 3  | Exact optional extras and their prices (annulering, wassen, extra dagen) | 7.6            |
| 4  | Is there a Google Business Profile? How many reviews today?              | All of Phase 2 |
| 5  | May the terminal address be published? *(carried from `HANDOVER.md` §2)* | 7.9            |
| 6  | Real figures: capacity, shuttle frequency, camera retention, driver tenure | 7.7, 4.4     |
| 7  | Business terms: invoicing, priority, contract rates                      | 7.11           |
| 8  | Is an English version wanted, and who writes it?                         | 7.0            |
| 9  | Office hours for the phone line, separate from "24/7 service"            | 7.14           |
| 10 | u or je — one form of address, site-wide *(carried from `ServiceChooser`)* | All copy     |
| 11 | Typeface decision *(carried from `HANDOVER.md` §2 question 3)*           | Nothing; Figtree holds |

Questions 1, 2 and 4 are the only genuine blockers. Everything else has a stated
assumption and can proceed.

---

## 15. Explicit non-goals

Stated so that neither this document nor a future contributor drifts into them.

- **We are not changing the brand.** Navy runway, hi-vis valet orange, the ticket,
  the departure-board voice. No third accent hue. No friendlier orange. The
  reasoning in `globals.css` stands.
- **We are not adopting RP's visual language.** Their conversion ideas are good.
  Their five accent colours, two-tone headlines and gradient bands are the exact
  patterns our design system was written to avoid.
- **We are not adopting SPL's scale.** Their intent model is good. Their IA is
  built for an airport, not for a business with two products.
- **We are not adding a carousel.** Both competitors have one; both clip content
  at the viewport edge with no indication of how much is hidden.
- **We are not increasing the motion budget.** Framer stays hero-and-timeline only.
- **We are not putting hex values in components.** Every colour goes through the
  semantic layer, including the new status tokens.
- **We are not fabricating anything** — not a review, not a rating, not a
  countdown, not a capacity figure, not a street address. Every number in the new
  sections is either confirmed by the client or absent. This is a site whose
  entire proposition is that it can be trusted with something valuable, and the
  design has to be able to survive being checked.

---

*Prepared as the pre-build proposal for the homepage, per `HANDOVER.md` §7.
No code has been changed.*
