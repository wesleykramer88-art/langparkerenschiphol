# Claude Code Prompt — Phase 2: complete the LangparkerenSchiphol.nl build

> Paste below the rule into Claude Code. Keep `PROJECT-BRIEF.md` (phase 1) in the repo —
> everything there still applies: palette, tokens, motion rules, architecture, quality floor.
> This document only covers what is **new or changed** since the homepage was deployed.

---

The homepage is live at `langparkeren-schiphol-lilac.vercel.app` and the client has
approved the direction. Design system, tokens and primitives are in place. Now build out
the rest of the site.

Everything in `PROJECT-BRIEF.md` still governs: navy + valet orange, semantic tokens
only, self-hosted fonts, ticket signature, restrained motion, Server Components by
default, content-as-data, WCAG AA, Lighthouse ≥ 95.

## 1. The brand instruction that overrides ambiguity

The client's words: *"I want to give the customers the feeling I am Lang Parkeren
Schiphol — people have the feeling I am from the airport itself. That is the power of my
domain."*

When a design decision is ambiguous, resolve it toward **airport infrastructure**, not
**parking vendor**. Wayfinding clarity, terminal signage vocabulary, departure-board
data type, calm institutional confidence. That is why he rejected the parking-garage
hero: a garage says "car park operator", a terminal says "part of the airport".

**Required counterweight:** add a footer disclaimer line —
`Lang Parkeren Schiphol is een onafhankelijke parkeerservice en is niet gelieerd aan
Royal Schiphol Group.` — in `ink-500`, small, below the copyright. This protects the
client's 15-year-old domain from a trademark challenge and is standard practice among
his competitors. Flag it in the handover so he confirms the wording.

Do **not** reproduce Schiphol's actual logo, their custom typeface, or their exact
signage yellow. Evoke the category, never copy the mark.

## 2. Route map — final

Preserve trailing slashes. `trailingSlash: true` stays.

| Route | Status | Notes |
| --- | --- | --- |
| `/` | done | header photo to be replaced, §5 |
| `/onze-services/` | build | |
| `/tarieven/` | build | MyParking.pro rates iframe |
| `/samenwerken/` | build | content is broken, §6 |
| `/contact/` | build | form + NAP |
| `/reservering/` | build | MyParking.pro booking iframe |
| `/login/` | **new** | customer portal, iframe — §4 |
| `/waarom-lang-parkeren-schiphol/` | **new** | trust page — §3 |
| `/reviews/` | **new** | reviews page — §3 |

## 3. Two new pages — client pre-approved

He said: *"If you think we need 1–2 extra pages for trustworthiness or to improve
bookings, we should do it."* Both were proposed and accepted. Build them.

### `/waarom-lang-parkeren-schiphol/` — the trust page

The conversion page for hesitant visitors. Sections:

1. Hero — eyebrow `WAAROM ONS`, H1 on 15+ years at Schiphol.
2. **The process, end to end** — expand the homepage's 4 steps into a proper timeline
   with what happens to the car at each stage. This is a genuine sequence, so numbered
   markers are justified here (they are not on the homepage USP grid).
3. **Security & insurance** — 24/7 camerabewaking, afgesloten terreinen, overdekte
   garage, digitale ritregistratie including speed and route, brandwerende kluis for
   valet keys, gescreende chauffeurs. Ask the client for insurance specifics and
   certifications; leave a clearly-marked placeholder rather than inventing any.
4. **The team and the cars** — real photos, §5.
5. **What happens if…** — flight delayed, early landing, late return, damage. Reuse and
   expand the homepage FAQ answers. This is the highest-value block on the page.
6. CTA to `/reservering/`.

### `/reviews/`

Do **not** ship fabricated ratings. The current site claims 4.7/5 with no source.

- If the client supplies a verifiable source (Google Business Profile, Trustpilot),
  build the page around real reviews and emit `AggregateRating` schema.
- If he cannot, build the page with the three existing named testimonials only, emit
  **no** `AggregateRating`, and remove the unsourced "4.7/5" from the homepage.

Invented review schema is a Google manual-action risk on a domain worth far more than
the page. Put this decision in the handover as a question, not a silent choice.

## 4. `/login/` — customer portal

Client: *"There definitely needs to be a login page. That also works via iframe."*
Same `<BookingWidget />` pattern — a thin `<PortalFrame />` wrapper, origin from env,
explicit aspect ratio, lazy, `title` attribute, sandboxed.

**Content extracted from the live page — use verbatim:**

- H1: `Klantenportaal Lang Parkeren Schiphol`
- Intro: `Wist u dat u met een persoonlijk account nog sneller en voordeliger kunt
  reserveren? Met uw eigen klantenportaal beheert u eenvoudig al uw reserveringen op één
  centrale plek én profiteert u van exclusieve voordelen.`
- **De voordelen van een account:**
  - Sneller reserveren dankzij automatisch ingevulde gegevens zoals naam, contactgegevens en kenteken
  - Al uw reserveringen overzichtelijk op één plek terugvinden
  - Facturen direct bekijken, downloaden en eenvoudig betalen
  - Zelf uw reservering wijzigen zonder te hoeven bellen of e-mailen
  - **Exclusieve 10% klantenkorting op iedere reservering**
  - Sneller boeken bij toekomstige reizen vanaf Schiphol
- **Zakelijk parkeren?** `Voor bedrijven, reisorganisaties en frequente reizigers bieden
  wij ook bedrijfsaccounts aan. Hiermee kunt u meerdere voertuigen, bestuurders en
  medewerkers beheren binnen één account. Zo reserveert u eenvoudig parkeerplaatsen voor
  collega's of klanten en behoudt u altijd een duidelijk overzicht van alle boekingen en
  facturen.`
- Closing: `Maak vandaag nog een account aan en profiteer direct van extra gemak én
  korting bij uw volgende parkeerreservering.`

**That 10% discount is buried on a page nobody visits.** Surface it: a slim bar on
`/tarieven/` and a line in the booking card on `/reservering/`. It is the strongest
conversion lever already written and currently unused. Note this in the handover.

The `Zakelijk parkeren` block also overlaps `/samenwerken/` — cross-link them.

## 5. Images — real photos, and a real pipeline

The client is emphatic: *"I don't want stock, I want to use as many real photos as
possible. And if you use stock for the garage we need to be sure we use DUTCH yellow
number plates for trust."*

Rules:

- **Dutch yellow plates or no vehicle in frame.** A garage shot with German or US plates
  destroys the "we are at Schiphol" premise instantly. This is non-negotiable for any
  fallback stock image.
- **The hero must read as Schiphol, not as a car park.** Terminal exterior, Vertrekpassage,
  departures kerbside, the shuttle bus at the terminal. He is shooting real photos
  Thursday — build the hero so swapping the source is one line, and use his
  `busjelangparkerenschiphol.webp` shuttle photo as the interim hero.
- **Process his uploads before they enter the repo.** He sent 6–9 MB PNG/JPGs
  (`PicjamDownload (53–58).png`, `KC4A9373/9386/9559.JPG`). Do not commit those.
  Convert to AVIF + WebP, max 2400px on the long edge, target under 300 KB each,
  strip EXIF (his camera files carry GPS). Add an `npm run images` script using `sharp`
  so this is repeatable when he sends the Thursday batch.
- Every image through `next/image` with explicit width/height. Hero `priority`,
  everything else lazy. Descriptive Dutch `alt` text — it is both accessibility and
  image-search traffic.

## 6. Content problems — carry forward, and two new ones

Still open from phase 1: NAP inconsistency, the broken `tel:123456789`,
`/samenwerken/` copy-paste damage, "15 jaar" vs "10+ jaar", the wrong partner-page CTA,
cross-domain terms, unsourced 4.7/5.

**Resolved:** the old footer and the contact page agree on the canonical NAP —

```
Vertrekpassage Schiphol
1118 CL Schiphol
klantenservice@langparkerenschiphol.nl
0297-785515
```

Use this in `config/site.ts` and in `LocalBusiness` schema. The new footer's
`klantenservice@langparkerenschiphol.nl` / `085-4013918` are the outliers — ask the
client whether `085` is a second sales line before dropping it.

**New — critical.** A shadow set of old pages is still live and `index, follow`:

```
/old-home/            /old-onze-services/     /old-tarieven/
/old-samenwerken/     /contact-us/            /reserveren/   ← titled "Old RESERVEREN"
```

`/reserveren/` and `/reservering/` are **two indexable booking pages competing for the
same queries**. This has been splitting his ranking signals. Redirect map for
`next.config.ts`, all permanent:

| From | To |
| --- | --- |
| `/old-home/` | `/` |
| `/old-onze-services/` | `/onze-services/` |
| `/old-tarieven/` | `/tarieven/` |
| `/old-samenwerken/` | `/samenwerken/` |
| `/contact-us/` | `/contact/` |
| `/reserveren/` | `/reservering/` |

Also: the old footer's `Disclaimer` link points at `#`. Either build the page or remove
the link — a dead legal link is worse than none.

## 7. Definition of done, per page

Before marking any page complete:

1. `npm run typecheck && npm run lint && npm run build` — zero errors, zero warnings.
2. Keyboard-only pass: every interactive element reachable, visible focus, no traps.
3. 360px viewport check — no horizontal scroll, tap targets ≥ 44px.
4. `prefers-reduced-motion` on — content appears in final position, nothing animates.
5. Metadata, canonical, OG image, and the right JSON-LD type present.
6. No hex value anywhere outside `globals.css`.
7. Real Dutch copy — no lorem, no English placeholders shipped.

Deploy after each page so the client can review incrementally. He checks the preview URL
often and responds fast; short feedback loops are working well on this project.

## 8. Handover note to write for the client

After the build, produce a short plain-English summary covering: the redirect map and
why the old pages were hurting him; the NAP question; the reviews-schema decision; the
10% discount now being surfaced; the disclaimer line; and what photos are still needed.
Keep it non-technical — he is a parking operator, not a developer, and this list is a
large part of what he is actually paying for.
