# Claude Code Prompt — Homepage build (round 2)

> Paste everything below the line into Claude Code in the existing repo.
> `PROJECT-BRIEF.md` still applies — this does not replace it, it corrects and extends it.

---

The foundation is in place and the header, ticket card and footer are working. But the
current homepage is roughly 15% of a homepage, it has no motion at all, and the hero has
drifted away from the direction the client already signed off on. Fix that, then build
the page out in full.

Read this whole brief before writing code. Post your section plan first, then build.

## Part 1 — Regressions and bugs to fix first

### 1.1 The hero is on the wrong background

The client approved a **dark navy hero**. The current hero sits on the cream canvas,
which throws away the entire premium feel of the direction and makes the page look like
a default template.

Correct it: the hero is a full-bleed `navy-950` block. The cream canvas resumes below
it. The booking ticket card **overlaps the boundary** between the navy hero and the
cream section beneath — bottom third of the card hanging into the light area. That
overlap is what creates depth and it's the shape the client already said yes to.

Inside the navy hero:

- H1 and lead in white / `navy-100`
- Eyebrow and rating in `valet-400`
- Orange primary CTA reads correctly on navy — this is what the accent is for
- A very subtle radial gradient or a 2% white noise texture, nothing more. No mesh
  gradients, no glow orbs, no animated blobs.

### 1.2 The date inputs are in US format on a Dutch site

The booking card currently shows `mm/dd/yyyy` and `08:00 AM`. Dutch users write
`dd-mm-jjjj` and read 24-hour time. This is the single most trust-destroying detail on
the page — it says "this site was not built for you."

Native `<input type="date">` renders in the *browser's* locale, not the `lang`
attribute, so you cannot fix this with markup. Build a real component:

- `<DateField>` — a text input masked to `dd-mm-jjjj` with a calendar popover. Dutch
  month and day names, **Monday-first week**, past dates disabled, return date
  constrained to be after the arrival date.
- `<TimeField>` — 24-hour, 15-minute increments, `00:00`–`23:45`, rendered in the mono
  face so the digits align.
- Both fully keyboard operable: arrows to move, `Enter` to select, `Escape` to close,
  focus returned to the trigger on close.

Do not reach for a date-picker library. This is four fields; a dependency here costs
more bundle than it saves.

### 1.3 Placeholder copy is still shipping

`FUNDAMENT GEREED · VOORBEELDPAGINA` and `Bekijk het design system` are scaffolding
text sitting in the client-facing hero. Replace with the real content in Part 3. The
`/design-system/` route stays, but it is linked from nowhere on the public site.

### 1.4 Two issues in the Next.js dev overlay

Clear them. The build must be clean before anything else lands.

### 1.5 Hero vertical rhythm

There is a large dead band above and below the hero content and the left column ends
well short of the card. Set the hero to `min-h-[min(88vh,900px)]` with content
vertically centred, and let the two columns share a baseline. Right now the page reads
as unfinished because the whitespace is accidental rather than composed.

### 1.6 Ticket notches

The notch cutouts are rendering as visible pale circles because `--notch-color` is not
being set to the surface behind them. Every use of `ticket-notch` must set
`--notch-color` to the actual background it sits on. Where the card straddles two
backgrounds, the notches sit in the upper (navy) portion — set it accordingly.

### 1.7 Radius discipline

Every button is a full pill and every card is heavily rounded. That combination is the
house style of every AI-generated landing page. Tighten it:

- Buttons: `--radius-md` (0.75rem)
- Cards and panels: `--radius-xl` (1.25rem)
- The ticket card keeps `--radius-2xl` — it is the one element allowed to be softer,
  because it's the signature

Pills stay only on small status badges ("Snelste optie", "Meest betaalbare keuze").

## Part 2 — The motion system

There is currently zero animation. Build this as a **system** in
`src/components/motion/`, not as one-off `motion.div`s scattered through sections.

### 2.1 Primitives

```tsx
<Reveal>            // y: 16 → 0, opacity 0 → 1, 520ms, ease-out-expo, once, -80px margin
<Stagger delay={}>  // parent orchestrator, 80ms between children
<CountUp to={4.7} decimals={1} />   // fires on enter viewport
<Marquee pauseOnHover />
```

All of them read `useReducedMotion()` and, when it's true, render children in their
final state with no transform and no transition. Never leave a reduced-motion user
looking at invisible content.

### 2.2 The hero load sequence — one orchestrated moment

This is where the boldness goes. On mount, in order, 70ms apart:

1. Eyebrow + rating fade in
2. H1 reveals **line by line** — wrap each line in a span with `overflow: hidden` and
   translate the inner span from `y: 100%` to `0`, 600ms. Three lines, 90ms apart.
3. Lead paragraph fades up
4. CTA pair fades up
5. Ticket card enters from `x: 32, rotate: -2deg, opacity: 0` → `x: 0, rotate: 0`,
   700ms, `ease-out-expo` — it settles like a card being laid on a desk
6. The dashed perforation line on the card draws left-to-right over 400ms
   (`scaleX: 0 → 1`, `transform-origin: left`)

Total under 1.4s. Nothing below the fold animates on load.

### 2.3 Scroll behaviour

- Section headings and body: `<Reveal>`
- Card grids: `<Stagger>` with 80ms between cards
- The 4-step "Zo werkt het" timeline: the connecting line **draws** as it scrolls into
  view (`useScroll` + `scaleY`, `transform-origin: top`), and each step's number badge
  pops (`scale: 0.8 → 1`) as the line reaches it. This is the second-most memorable
  moment on the page; give it real attention.
- Stats count up once: `4.7`, `15+`, `5–8`

### 2.4 Micro-interactions

| Element | Behaviour |
| --- | --- |
| Cards | `y: -4`, shadow `md → lg`, 200ms |
| Service cards | image `scale: 1 → 1.04` over 600ms, `overflow: hidden` on the frame |
| Buttons | arrow icon `translateX: 0 → 4px`, background darkens to `valet-700` |
| Nav links | orange underline wipes in from left, 200ms |
| Header | transparent over the navy hero → solid white with hairline border and reduced height once scrolled past 80px |
| Accordion | height animates, chevron rotates 180°, 260ms |
| Marquee | continuous, pauses on hover, `aria-hidden` (it is decorative) |

### 2.5 Page transitions

`template.tsx` in the `(site)` group: fade + 8px rise, 300ms. Must not delay LCP —
opacity only on the initial paint of the hero.

### 2.6 Mobile sticky booking bar

Below `lg`, once the hero booking card scrolls out of view, slide up a fixed bottom bar:
price-free, just `Reserveer nu` plus "Gratis annuleren tot 24 uur". This is the highest
-value conversion element on a mobile parking site and the current site has nothing like
it.

**Restraint check:** if a section has more than two things moving at once, cut one.
Over-animation is the clearest signal of generated work, and the client is paying for
the opposite.

## Part 3 — The full homepage

Currently the page is hero → footer. Build every section below. Copy is Dutch and is
taken from the live site — use it verbatim.

### Section order — improved, and here is why

The live site buries the valet-vs-shuttle choice at position five. That choice is the
first question every visitor actually has, and it's the fork that leads to a booking.
Move it up. Proposed order:

1. Hero (navy)
2. Trust strip
3. **Service chooser** ← moved up from #5
4. Why us
5. Security
6. How it works
7. Testimonials
8. FAQ
9. Closing CTA

Rationale to give the client: decision first, reassurance second, objections handled
last, CTA at the point of highest confidence.

### 3.1 Hero

- Eyebrow: `4.7/5 · Duizenden reizigers elk jaar` with a small star row
- H1: `Zorgeloos lang parkeren op Schiphol.`
- Lead: `Binnen 2 minuten geregeld. Kies voor valet of shuttle parkeren — veilig, snel en professioneel.`
- Three checkmark bullets: `Boek direct via de website` · `24/7 camerabewaking en monitoring` · `De meest gekozen parkeerservice`
- CTAs: **`Reserveer nu`** (primary, → `/reservering/`) and `Bekijk tarieven` (ghost, → `/tarieven/`)
- Ticket card: heading `Reserveer uw parkeerplaats`, eyebrow `PARKEERPERIODE`,
  fields `Aankomstdatum` + `Tijd`, `Retourdatum` + `Tijd`, button `Reserveer nu`,
  then below the perforation: `UW VOORDEEL` / `Gratis annuleren tot 24 uur` / `AMS · 24/7`

### 3.2 Trust strip

Four items on a `navy-900` band directly under the hero, mono numerals:
`Meer dan 15 jaar actief op Schiphol` · `Duizenden tevreden reizigers per jaar` ·
`Tot 24 uur van tevoren gratis annuleren` · `Valet- en shuttleservice`

### 3.3 Service chooser

Eyebrow `Welke parkeeroptie past bij u?` / H2 `Kies uw parkeerwijze bij Schiphol`

Two large cards, side by side on desktop, stacked on mobile. Each: image, badge, title,
description, three bullets, CTA.

**Valet Parkeren** — badge `Snelste optie`
> Rijd rechtstreeks naar de vertrekhal van Schiphol. Onze chauffeur staat klaar, controleert uw auto en rijdt deze naar onze veilige parkeerlocatie.

- Stap direct uit bij de vertrekhal
- Check direct in voor je vlucht
- Ideaal voor zakenreizen en vakanties

CTA: `Reserveer Valet Parkeren`

**Shuttle Parkeren** — badge `Meest betaalbare keuze`
> Parkeer uw auto op ons terrein. Onze shuttlebus brengt u comfortabel binnen 5 tot 8 minuten naar de vertrekhal van Schiphol.

- Autosleutels blijven bij jou
- Snelle transferservice
- Korte wachttijden

CTA: `Reserveer Shuttle Parkeren`

Images exist on the live site at
`/wp-content/uploads/2026/06/image-2-3.webp` (valet) and
`/wp-content/uploads/2026/07/Shuttle-Parking-1.webp` (shuttle). Pull them into
`public/images/`, convert to AVIF + WebP, and serve through `next/image` with
`sizes` set. Do not hotlink the WordPress uploads directory.

### 3.4 Why us

Eyebrow `Waarom Lang Parkeren bij Schiphol?` / H2 `Al meer dan 15 jaar de vertrouwde keuze rond Schiphol`

Two paragraphs:
> We weten precies wat reizigers nodig hebben: snelheid, zekerheid en gemak. Of u nu kiest voor valet of shuttle parkeren, we zorgen ervoor dat uw reis ontspannen begint vanaf het moment dat u aankomt.

> Uw auto is bij ons in betrouwbare handen. Professionele chauffeurs, veilige parkeerplaatsen en slimme tracking bieden maximale controle en veiligheid.

CTAs: `Bekijk tarieven` · `Hoe het werkt`

Four supporting cards: **Super snel en probleemloos** / **24/7 Zorg voor uw auto** /
**Altijd inzicht en controle** / **Meest populaire service** — with the live site's
sub-copy for each.

Fold the old "USP quad" (Direct via onze site / Veilig en professioneel / Digitale
ritcontroles / Snel Geregeld) into this section rather than shipping two near-identical
four-card grids back to back. The live site repeats itself here; we shouldn't.

### 3.5 Security

Eyebrow `Maximale beveiliging` / H2 `Uw auto is veilig terwijl u zorgeloos reist`

> Bij Lang Parkeren Schiphol staat veiligheid voorop. Vanaf het moment van inleveren tot uw terugkeer, houden we volledige controle.

Four items with icons: `24/7 videobewaking` · `Afgesloten parkeerterreinen` ·
`Overdekte parkeergarage` · `Vakbekwame chauffeurs`

Image: `/wp-content/uploads/2026/06/Container-2026-06-16T012048.794.webp`

Set this section on `navy-950` — it's the emotional low point of the page (the "is my
car safe" worry) and the dark treatment carries it. It also breaks up a long run of
cream.

### 3.6 How it works

Eyebrow `Zo werkt het` / H2 `Geregeld in 4 eenvoudige stappen`

1. **Reserveer direct.** — In slechts 2 minuten kunt u uw parkeerplaats bij Lang Parkeren Schiphol veiligstellen.
2. **Wij staan klaar.** — Bij aankomst op Schiphol of in onze garage staan we voor u klaar.
3. **Vertrek ontspannen.** — Wij zorgen voor de rest terwijl u met een gerust hart incheckt.
4. **Auto klaar bij terugkomst.** — Wanneer u terugkomt, staat uw auto netjes voor u klaar.

Numbered markers are justified here — this is a genuine sequence. Horizontal timeline on
desktop, vertical on mobile, with the drawing connector line from §2.3.

### 3.7 Testimonials

H2 `Wat onze klanten zeggen` — three cards. **Render each testimonial once.** The
current build duplicates them to fill a carousel; that reads as padding and undermines
the proof. Three real quotes, three cards, no loop.

- Mark v.D. — *Schiphol reiziger*
- Sandra & Peter — *Vakantiegangers*
- K. de Jong — *Zakelijke reiziger*

Quotes are on the live homepage.

### 3.8 FAQ

Eyebrow `Veelgestelde vragen` / H2 `Alles over onze dienstverlening`

Accordion, first item open by default, single-open behaviour. Real `<button>` +
`aria-expanded` + `aria-controls`. Also emit `FAQPage` JSON-LD from this same data —
one source, two outputs.

1. **Wat is het verschil tussen valet en shuttle parkeren?**
   Bij valet parkeren rijdt u rechtstreeks naar de vertrekhal en parkeert onze chauffeur uw auto. Bij shuttle parkeren parkeert u uw eigen auto op onze locatie en brengt onze shuttlebus u binnen 5 tot 8 minuten naar de vertrekhal.

2. **Hoe veilig is mijn auto geparkeerd?**
   Uw auto staat geparkeerd op een professioneel parkeerterrein dat 24 uur per dag wordt bewaakt en gemonitord. Alle ritten worden digitaal geregistreerd, zodat er altijd inzicht is in de verplaatsingen van uw voertuig. Zo kunt u met een gerust gevoel op reis, terwijl uw auto veilig achterblijft.

3. **Kan ik mijn reservering kosteloos annuleren?**
   Ja, met een annuleringsdekking kunt u uw reservering tot 24 uur voor aanvang geheel kosteloos annuleren. Binnen 24 uur voor uw reis annuleren niet. Daarvoor dient u uw eigen reisverzekering in te schakelen.

4. **Hoe ver van tevoren moet ik een reservering maken?**
   Wij adviseren om uw parkeerplaats zo vroeg mogelijk te reserveren voor de beste beschikbaarheid en tarieven. Lastminute reserveringen zijn vaak ook mogelijk, mits er nog plaatsen beschikbaar zijn. Houd er rekening mee dat voor reserveringen op korte termijn extra kosten in rekening kunnen worden gebracht.

5. **Worden mijn autosleutels veilig opgeborgen?**
   Ja, uw autosleutels worden met de grootste zorg behandeld. Bij onze shuttle service kunt u ervoor kiezen om uw autosleutels zelf mee op reis te nemen. Maakt u gebruik van valet parking, dan worden uw sleutels veilig opgeborgen in een brandwerende kluis op ons kantoor, dat is voorzien van camerabewaking.

6. **Wat gebeurt er als mijn vlucht vertraagd is?**
   Geen zorgen. Wij volgen de actuele vluchtinformatie en passen de ophaaltijd indien nodig aan. Bij een vertraging of vervroegde landing zorgen wij ervoor dat uw auto weer op het afgesproken moment beschikbaar is. Vergeet niet direct te bellen na uw landing op Schiphol.

7. **Hoe laat moet ik aanwezig zijn voor mijn vlucht?**
   Wij adviseren om bij shuttle parkeren minimaal 3 uur voor vertrek aanwezig te zijn. Bij valet parkeren adviseren wij minimaal 2,5 uur voor vertrek aanwezig te zijn. Zo heeft u voldoende tijd voor de overdracht en het inchecken op Schiphol.

*(Note: the live site has a typo — "Wat gebeurd er" should be "Wat gebeurt er". Fixed above.)*

### 3.9 Closing CTA

Navy band, ticket-perforation divider above it.
H2 `Begin uw reis ontspannen` /
`Kies zekerheid, snelheid en gemak. Reserveer vandaag nog uw parkeerplaats op Schiphol.`
CTAs: `Reserveer nu` · `Hoe het werkt`

## Part 4 — Rhythm and composition

The page is nine sections long. Without deliberate rhythm it will read as a stack of
cards, which is exactly what generic sites look like.

- **Alternate surfaces:** cream → navy strip → cream → cream(tinted) → **navy** →
  cream → cream(tinted) → cream → **navy**. Never two full-navy sections adjacent.
- **Vary the grid:** do not ship five consecutive 4-column card grids. Section 3 is a
  2-up, section 4 is asymmetric 5/7 text+cards, section 5 is image-left/list-right,
  section 6 is a timeline, section 7 is 3-up, section 8 is a centred single column.
- **Vertical spacing:** one scale — `py-20` mobile, `py-28` desktop, with `py-32` only
  on the hero and closing CTA. Use the `<Section>` primitive; never hand-tune padding
  inside a section component.
- **Use the perforation as the divider** between two or three of the section joins —
  a dashed hairline with a notch at each end. This ties the whole page back to the
  signature element without adding a new idea.

## Definition of done

- [ ] All nine sections built, real Dutch copy, no placeholder text anywhere
- [ ] Hero is navy; ticket card overlaps the section boundary
- [ ] Dates read `dd-mm-jjjj`, times are 24-hour, Monday-first calendar
- [ ] Motion primitives exist in `components/motion/` and every section uses them
- [ ] Hero load sequence completes under 1.4s
- [ ] `prefers-reduced-motion` verified by actually toggling it in DevTools
- [ ] Full keyboard pass: tab through the entire page, operate the accordion, open and
      close the date picker, no focus traps, focus always visible
- [ ] Images self-hosted, `next/image`, explicit dimensions, hero `priority`
- [ ] `FAQPage` + `LocalBusiness` + `BreadcrumbList` JSON-LD emitted and validated
- [ ] 360px / 768px / 1440px / 1920px all checked
- [ ] `npm run typecheck && npm run lint && npm run build` — zero errors, zero warnings
- [ ] Dev overlay clean
- [ ] Lighthouse mobile ≥ 95 across all four categories

Post the section plan before you start. Build the hero correction first and stop so it
can be reviewed, then continue through the remaining sections without pausing.
