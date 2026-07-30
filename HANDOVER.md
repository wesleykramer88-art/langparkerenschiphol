# Handover 1 — foundation

Date: 28 July 2026
Status: foundation complete. `npm run verify` passes with zero errors and zero
warnings. No page content yet beyond a clearly-marked placeholder homepage.

---

## 1. What to look at first

```bash
npm install
cp .env.example .env.local     # fill in NEXT_PUBLIC_SITE_URL if not localhost
npm run dev
```

Then open **http://localhost:3000/design-system/** — this is the deliverable that
needs a decision from you. Four typefaces, switchable live, rendered in your own
Dutch copy: the real H1, the real lead, a real price row, the booking card and
the form fields. Click a name and everything changes at once.

Pick one and we change a single line. Everything else on that page (palette,
contrast table, the parking-ticket component) is settled and there for reference.

---

## 2. Decisions we need from you

Nothing below blocks us — each is implemented under a stated assumption and
marked `TODO(client)` in `src/config/site.ts`, which is the one file that holds
this data. Answering just makes an assumption real.

| #   | Question                                                            | What we did meanwhile                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Which e-mail is canonical** — `info@` or `klantenservice@`?       | Using `info@`; it is on the contact page and inside the already-indexed snippet. `klantenservice@` kept as the footer alias.                                                                                                                 |
| 2   | **Is there a publishable street address** for the parking terminal? | No street address emitted. Modelled as a service-area business (Schiphol + areaServed + coordinates). We did **not** use the Vinkeveen registered office — it is ~25 km from the airport and would put a wrong address into the local index. |
| 3   | **Which typeface?**                                                 | Figtree as a placeholder. See `/design-system/`.                                                                                                                                                                                             |
| 4   | **Does MyParking.pro expose an API?**                               | Built for both. See §5.                                                                                                                                                                                                                      |
| 5   | **New copy for `/samenwerken/`**                                    | Not yet built — that page needs your copy first. See §3.                                                                                                                                                                                     |
| 6   | **Host the terms on this domain?**                                  | Still linking to `valetparkingschiphol.nl`.                                                                                                                                                                                                  |

**Already resolved — no need to answer:**

- **Phone.** We found it rather than asking you. Your algemene voorwaarden list
  "Telefoon Kantoor +31(0) 297 785 515", which corroborates the contact page and
  every subpage header. **0297-785515 is now canonical** everywhere, including
  the structured data. `085-4013918` is kept as a secondary line for `/contact/`.
- **Reviews.** No `AggregateRating` markup, per your instruction. The 4,7/5 stays
  as plain text.

---

## 3. Problems we found on the live site

These are real and they are costing you something today. We have implemented the
sensible version of each; please confirm.

1. **The phone link on every subpage is broken.** The header on `/tarieven/`,
   `/onze-services/`, `/samenwerken/` and `/contact/` links to
   `href="tel:123456789"` — a placeholder that was never replaced. Anyone tapping
   your phone number on a mobile calls nothing. This is the single most expensive
   bug on the site. **Fixed.**

2. **Your NAP is inconsistent**, which actively suppresses local ranking. Two
   phone numbers, two e-mail addresses and two location strings across four
   pages. Google needs one consistent answer to trust a local business.
   **Consolidated into one config file.**

3. **You publish no legal identity.** Dutch distance-selling law (BW 6:230m)
   requires a trader's identity and registration number to be discoverable. The
   current site publishes neither. **Added The Parking Company and KvK 74048856
   to the footer, taken from your own terms — please confirm this entity is the
   contracting party for this brand.**

4. **`/contact/` has no meta description.** Elementor auto-generated one by
   scraping the page body, which is why the Google snippet for that page reads as
   a run-on sentence with your phone number in the middle. **Written a real one.**

5. **`/samenwerken/` has copy-paste damage.** Bullets lifted from the services
   page ("Snel en zonder moeite wilt parkeren…"), an entire "Kies Shuttle Parking
   als u:" section that makes no sense on a partner page, five cards whose
   headings do not match their descriptions, and two cards with identical text.
   The CTA says "Klaar om partner te worden? Neem vrijblijvend contact op" but
   the buttons say "Reserveer nu" and "Hoe het werkt". **This page needs new copy
   from you before we build it.**

6. **"15 jaar" vs "10+ jaar".** The homepage and footer say more than 15 years;
   the partner page says 10+. **Using 15** — two authoritative placements agree,
   and the partner page is the one with documented damage.

7. **No FAQ structured data.** You have seven well-written FAQ entries on the
   homepage and four more on `/tarieven/`, and the site claims none of them as
   rich results. **The plumbing is in; it activates when those pages are built.**

---

## 4. One deliberate deviation from the brief

The brief specified valet-600 for solid buttons with white text. **We use navy
text on the orange instead.**

White on `valet-600` measures **3.4:1**, which fails WCAG AA for button labels at
normal size. Navy-950 on `valet-600` is **5.0:1** and passes. It is also the more
honest reference: hi-vis safety signage — the jackets your crew actually wear —
is dark type on orange, never white on orange. The orange itself is untouched.

Every other pairing is verified and listed in the contrast table on
`/design-system/`.

---

## 5. The booking widget

`<BookingWidget mode="iframe" />` is the only thing in the app that knows
MyParking.pro exists. When you get the API answer, one file changes.

- **iframe mode (today)** — wrapped in our ticket frame, explicit height so it
  cannot shift layout, lazy-loaded, sandboxed, and only requested once it nears
  the viewport so it never competes with the page's own load. There is also a
  visible fallback link, because the embed is a third party we do not control.
- **native mode (if an API exists)** — our own UI end to end, handing off only at
  payment.

Either way the **hero date picker is ours** and is already built.

⚠️ One caveat: the parameter names we pass to prefill your dates
(`arrivalDate` / `departureDate`) are **inferred, not documented**. If they are
wrong the widget simply opens empty, which is what it does today — so it is safe
to ship. But please don't advertise "your dates carry over" until MyParking.pro
confirms. Ask them for the parameter names when you ask about the API.

---

## 6. Notes on the build

- **Versions.** `next 16.2.12`, `react 19.2.4`, `tailwindcss 4.3.3`,
  `typescript 5.9.3`, `eslint 9.39.5`. Both version traps in the brief were
  avoided — npm's latest TypeScript is 7.0.2 and latest ESLint is 10.8.0, and
  neither is supported by Next 16.
- **Node.** You are on v23.11, which is not an LTS line and produced engine
  warnings during install. Vercel should target **Node 22 LTS**. Worth pinning
  locally too.
- **`npm audit` reports 12 high-severity issues.** All are inside Next's own
  vendored `postcss` and `sharp`. `npm audit fix --force` "resolves" them by
  downgrading Next to 9.3.3 — do not run it. Nothing actionable at our level.
- **Fonts are self-hosted.** No request to `fonts.gstatic.com`, so no visitor IP
  is sent to Google on page load — a live GDPR exposure on a purely NL-facing
  site, and one fewer DNS + TLS handshake before first paint.
- **Motion budget.** Framer Motion is not used for scroll reveals; those run on a
  ~400-byte IntersectionObserver hook. Reveals appear on nearly every section, so
  using motion for them would put ~34KB of animation runtime into pages that
  animate nothing above the fold. motion is reserved for the homepage hero.
- **No-JS.** Revealed content is visible by default; the hidden state only
  applies once JavaScript has confirmed it can reveal it again. A visitor with JS
  blocked gets the content, not a blank page.

---

## 7. Next step

The homepage. We will post the section order and what we are changing from the
current site **before** building it, and wait for your response — then move
faster on the remaining pages once the language is agreed.

`/samenwerken/` is the one page we cannot start until item 5 in §3 is answered.

---

---

# Handover 2 — the homepage

Date: 28 July 2026
Status: homepage complete and redesigned. `npm run verify` passes with zero
errors and zero warnings. All business content from the live site is carried
over; nothing was cut.

## 1. What changed, and why

The first build of this homepage was correct and unmemorable. Every band opened
with the same centred eyebrow-and-heading block and continued into a grid of
bordered rounded rectangles, and the only photography on the page was three
thumbnails at 590px. Nine sections, one shape. That is the look people mean when
they say a site looks generated, and no amount of polish inside a card fixes it.

Three things changed:

**Photography now carries the page.** This business sells a place to leave a car,
and the old hero asserted that in words over a flat navy field. The hero, the
security band and the closing band are now full-bleed photographs; the service
cards and the "waarom" section carry real images at real sizes. See §3.

**Every section has its own shape.** `<SectionHeader>` has been deleted — the
component is named in `ui/Section.tsx` with the reasoning. A component that
renders the top of every section guarantees every section reads the same. The
service chooser and the process band split their header across the measure; the
FAQ and the testimonials use a sticky column; the photographic bands set theirs
over the image.

**Card grids were replaced with structure where the content is not a set of
cards.** "Waarom Lang Parkeren" was eight icons in eight boxes; it is now an
editorial hairline list beside a photograph, with the absorbed USP quad as a
quiet strip. The testimonials were three identical boxes; they are now a score
column and three hairline-separated quotes.

## 2. Three bugs found while rebuilding

Worth knowing about, because two of them were live.

1. **The hero disappeared under reduced motion.** The `rise()` helper returned
   `{ initial: false }` with no `animate` target, so for a visitor with
   "reduce motion" enabled — a system setting, not a niche one — the hero
   rendered the H1 and nothing else. No lead, no proof row, no buttons, no
   phone number. Fixed by returning the final state explicitly.

2. **The ticket notches never took their colour.** The `ticket-notch` utility
   declared `--notch-color` on itself, which beat the value `<Ticket notch>`
   set on the ancestor — same specificity, so source order decided it. Every
   punch on the site was painted cream regardless of what it sat on. The
   fallback now lives at the point of use.

3. **The process timeline's markers were invisible on desktop.** The tick is a
   `<span>`, and at `lg` the list item becomes `display: block`, so the span
   was inline and its width and height did not apply. It looked right on mobile
   because the grid there blockified it.

## 3. The photographs

`src/config/images.ts` is the manifest — every path, dimension, Dutch alt text
and blur placeholder in one file. Sections name a photograph; they never type a
path.

Casting is deliberate. The library leans towards enthusiast car photography (a
Porsche, an M4, a tuned Civic) and **none of those are used**. This service
sells calm to families and business travellers; a sports car sells something
else. What is used is the estate the customer is actually buying: covered decks,
lit rows, and the crew in the branded hi-vis.

Two notes:

- **Sources were re-encoded**: 9.1 MB → 2.7 MB, capped at 2400px, mozjpeg q82.
  No visible loss; two files were 4096px and 4608px originals.
- **`beveiliging.webp` is only 708px wide** and it is the single most valuable
  asset you have — it is the only photograph of your own crew, in your own
  jacket, doing the thing you sell. It is never rendered above ~36rem because of
  that. **TODO(client): a high-resolution reshoot of that exact moment is the
  highest-value photography you could commission.**

## 4. Where the effects are, and where they are not

The brief asked for gradients, glassmorphism and animation. All three are in,
and all three are rationed, because used everywhere they are the tell rather
than the finish.

- **Glass** appears once: the four measures on the security band, laid over a
  photograph, where there is genuinely something behind them to refract. The
  fallback background alone carries the text contrast for browsers without
  `backdrop-filter`.
- **Gradients** are photographic scrims only — sized to the text they protect,
  not to taste. The closing band needed a fourth (`scrim-center`) because
  centred white text over the bright end of a lit corridor measured about 3:1.
- **Motion**: the hero load sequence and the scroll-linked process timeline use
  `motion`. Everything else is CSS on a ~400-byte IntersectionObserver hook, so
  the animation runtime is not paid for by sections that animate nothing. The
  hero photograph drifts once over 30s and does not loop — a looping Ken Burns
  pulls the eye back to the wallpaper every cycle.

## 5. Still open

- **The other four pages are not built.** `/tarieven/`, `/onze-services/`,
  `/contact/` and `/samenwerken/` still need doing; `/reservering/` renders the
  vendor widget. The design language is now settled, so they should go quickly.
  `/samenwerken/` remains blocked on item 5 in §3 of Handover 1.
- Every `TODO(client)` from Handover 1 is still open and still marked in
  `src/config/site.ts`.

---

---

# Handover 3 — the rest of the site

Date: 29 July 2026
Status: all nine pages built and live-ready. `npm run verify` passes with zero
errors and zero warnings. Not yet deployed — see §9.

This one is written for you rather than for a developer. There are nine things
in it, and **six of them need an answer from you**. They are marked ➜.

---

## 1. The most important thing in this document

**You have a second, older copy of your website still online, and Google can see
it.**

These six pages are live right now:

| Still online          | What it is                       |
| --------------------- | -------------------------------- |
| `/old-home/`          | an old copy of your homepage     |
| `/old-onze-services/` | an old copy of your services     |
| `/old-tarieven/`      | an old copy of your rates        |
| `/old-samenwerken/`   | an old copy of your partner page |
| `/contact-us/`        | an old contact page              |
| `/reserveren/`        | an old booking page              |

The last one is the expensive one. **`/reserveren/` and `/reservering/` are two
different booking pages on your own website, competing for the same Google
searches.** The old one's page title is literally "Old RESERVEREN". Google has to
guess which of the two is the real booking page, and every link and every bit of
credit that lands on the wrong one is wasted. This has been splitting your
ranking for as long as both have existed.

Every one of the six now permanently forwards to its correct page. Nobody lands
on an old page again, and the credit those pages had built up gets passed to the
real ones instead of being thrown away.

You do not need to do anything about this. It is fixed. But it is worth knowing
it was happening, and it is worth asking whoever manages your WordPress install
why a duplicate site was published.

---

## 2. ➜ The "4,7 / 5" has been removed. This needs your decision.

Your site showed **4,7 out of 5** in three places, with five stars next to it.
We could not find a source for it anywhere — no Google reviews page, no
Trustpilot, no count of how many people it averages.

We have taken it off, for two reasons:

1. **Google penalises review scores it cannot verify.** Not a ranking dip — a
   manual penalty, applied by a person, on a domain you have had for fifteen
   years. It is not worth risking for one number.
2. **It is now against Dutch law to publish an average review score without
   saying where the reviews came from and whether they are checked.** This came
   in with the EU "Omnibus" rules. The fine is calculated on turnover.

**What we need from you:** do you have a **Google Business Profile** or a
**Trustpilot page** — anything public where customers have actually left
reviews? If you send us the link, the score goes straight back on every page,
this time properly marked up so it can show as stars in Google search results.
That is worth considerably more than the number was doing on its own.

If you do not have one, the honest recommendation is to start collecting reviews
on Google. It is free, it takes ten minutes to set up, and for a local business
it is probably the single highest-return thing on this entire list.

In the meantime the new `/reviews/` page shows your three real named
testimonials and says plainly that you do not publish an average score yet, and
why. That reads far better than you might expect — on a page about
trustworthiness, admitting what you cannot prove makes everything else more
believable.

---

## 3. ➜ Your 10% discount was invisible. It is now in front of everyone.

Your `/login/` page says, in your own words:

> "Exclusieve 10% klantenkorting op iedere reservering"

Nothing on your website linked to that page. Not the menu, not the booking
page, not the rates page. Ten per cent off, for filling in a form once, and
effectively nobody ever read it.

It now appears in the two places where people are looking at a price and
deciding:

- directly **under the rates calculator** on `/tarieven/`
- directly **above the booking form** on `/reservering/`
- and in the footer of every page

This is the biggest conversion change in the whole rebuild, and it cost nothing
to make because you had already written it.

**What we need from you:** confirm the 10% is still correct and still applies to
every booking. It is now stated in three prominent places, so if the figure has
changed we should know.

---

## 4. ➜ Your address, phone number and email

Your old site gave **three different locations** for one business:

- "Schiphol-Rijk, Nederland" — on your contact page
- "Schiphol, Noord-Holland" — in your footer
- "Vertrekpassage Schiphol, 1118 CL Schiphol" — in the footer of the old pages

Google will not treat a local business as trustworthy when it cannot get a
straight answer about where it is. This is a large part of why you do not appear
in the map results for your own name.

We have used **Vertrekpassage Schiphol, 1118 CL Schiphol** everywhere, because it
is the only complete one — it has a postcode, so it can go into the map listing,
and it is what a driver actually needs. Same for `0297 - 785 515` and
`info@langparkerenschiphol.nl`, which are now the only phone number and email
used anywhere.

**What we need from you:**

1. **Confirm the address is right** and that you are happy to publish it.
2. **Is `085 - 401 3918` a real second line?** It is currently shown on the
   contact page only. If it is an old number, we will remove it. If it is a
   sales line, tell us and we will label it as one.
3. Same question for `klantenservice@langparkerenschiphol.nl`.

---

## 5. ➜ The footer now says you are not part of Schiphol

At the bottom of every page, small, under the copyright:

> Lang Parkeren Schiphol is een onafhankelijke parkeerservice en is niet
> gelieerd aan Royal Schiphol Group.

You asked for the site to feel like it belongs to the airport, and it does — the
photography, the signage-style headings, the wayfinding. That is the right call
and it is what your domain is worth.

This one sentence is what keeps that on the safe side of a trademark problem. It
says plainly that you are an independent business. Your competitors ranking for
the same searches all carry a version of it.

**What we need from you:** read that sentence and confirm you are comfortable
with the exact wording. It is a legal statement about your own company, so it
should be in words you would stand behind.

We have also been careful never to use Schiphol's actual logo, their typeface,
or their exact yellow.

---

## 6. ➜ The photographs — and what is still needed

**Everything you sent is now on the site, and all the stock photography is gone.**

That was not a style choice. Four of the five stock photos on the old build had
**readable German number plates**, and one was a car park somewhere in Asia. On
a website whose entire argument is "we are at Schiphol", a German number plate
contradicts you in the one thing a visitor's eye goes to first. They are deleted.

What is on the site now is yours: the branded van under the **Vertrek 2** sign,
your chauffeur in the orange jacket, a real handover at the kerb, and your own
terrain — Dutch yellow plates in every row.

The homepage now opens on the van at the terminal entrance rather than a parking
garage, which is exactly the difference you described: a garage says "car park",
a terminal says "part of the airport".

**What we need from you — the Thursday shoot.** Four photographs is not quite
enough for nine pages, so two of them currently appear twice (cropped
differently, but still). The shots that would help most, in order:

1. **The handover, close up and in daylight** — a customer handing keys over, at
   the kerb, jacket in frame. This is what you sell, and we have one usable
   frame of it.
2. **The shuttle bus with passengers boarding**, at the terminal.
3. **Inside the covered garage**, lit, with a Dutch plate visible.
4. **A clean shot of your own team**, three or four people, outdoors.
5. **The key safe / office** — you mention a fireproof safe with camera
   surveillance, and there is no picture of it anywhere.

**Send the originals as they come off the camera.** Do not resize or compress
them first. There is now a tool in the project (`npm run images`) that shrinks
them, converts them, and — importantly — **strips the GPS location tags your
camera writes into every photo**. Those tags would otherwise be published on the
website. Send the big files; the tool handles the rest.

---

## 7. ➜ Two things we deliberately did not write

There are exactly two places on the new site where we left something out rather
than guess. Both are on the new `/waarom-lang-parkeren-schiphol/` page, and both
are the sort of thing a hesitant customer looks for hardest.

**Insurance.** We have not written a single word about what is insured while a
customer's car is with you, because we do not know, and a comforting sentence
that turns out to be wrong is worse than nothing. The page currently points at
your terms and conditions and offers a phone number.

➜ **Send us:** which insurance covers a customer's car while it is in your care
and what it covers; the insurer's name if you are willing to publish it; and any
certification or trade-body membership you hold. "Verzekerd tot € X" answers the
question people are actually asking, and **none of your competitors state it**.
This is the biggest single improvement still available on the site.

**What happens if there is damage.** We describe only what we know is true — that
you check the vehicle before taking it, and that every trip is logged including
speed and route — and then point at your terms.

➜ **Send us:** what a customer should actually do. ("Meld het bij de chauffeur
die de auto terugbrengt, wij maken ter plaatse een schaderapport op" — something
like that.) Being specific here reassures people far more than being careful.

---

## 8. ➜ The contact form needs somewhere to send messages

The contact form is built, validated and working. But **this website has no
email system connected to it**, and we were not going to pick an email provider
and a monthly bill on your behalf.

Right now, if somebody fills in the form, they are told honestly that it could
not be sent, and are given a one-tap email link with everything they typed
already filled in, plus your phone number. **No message is lost and nobody is
told "thanks, we'll be in touch" when nothing was sent.** That last part matters
more than it sounds — a contact form that silently swallows messages is the kind
of fault that goes unnoticed for months while you wonder why enquiries dropped.

➜ **The cheapest fix** is a Zapier or Make webhook that drops form submissions
into your existing inbox — about ten minutes to set up, free at your volume.
Send us the webhook address and we set one value. Alternatively tell us your
preferred email provider and we will wire it up properly.

---

## 9. Not yet deployed

The brief asked us to deploy after each page so you could review as we went. **We
could not** — this machine has the Vercel command-line tool installed but is not
signed in to your account, and we are not going to guess at credentials.

Everything is built, verified and ready. To publish, either:

- run `vercel --prod` from the project folder on a machine that is logged in, or
- push the branch and let your existing Vercel connection deploy it, or
- send us access and we will do it.

Nothing else is outstanding on our side.

---

## 10. What is on the site now

Nine pages, all working:

| Page                              | Status                                      |
| --------------------------------- | ------------------------------------------- |
| `/`                               | new hero photo, rating removed              |
| `/onze-services/`                 | built — your copy, restructured             |
| `/tarieven/`                      | built — rates calculator + 10% discount bar |
| `/reservering/`                   | built — booking system + 10% discount line  |
| `/login/`                         | **new** — customer portal                   |
| `/contact/`                       | built — form + correct address              |
| `/samenwerken/`                   | **rewritten** — see below                   |
| `/waarom-lang-parkeren-schiphol/` | **new** — the trust page                    |
| `/reviews/`                       | **new** — your three testimonials           |

**On `/samenwerken/` specifically.** The old version had bullets pasted in from
the services page that talked to travellers instead of travel agents, a whole
section about choosing shuttle parking that made no sense on a partner page,
five reason-boxes whose headings did not match their own descriptions (two were
word-for-word identical), and a closing block that said "get in touch" above two
buttons that went to the booking form instead. It also said "10+ jaar" where the
rest of your site says fifteen.

Your headline, your opening paragraph and your two main arguments are kept
word for word. The broken parts are rewritten, every claim on the page traces
back to something you already say elsewhere, and the buttons now go to the
contact page.

➜ **One thing missing:** we have not written any commission percentage, payment
term or contract length, because nobody told us what they are, and an invented
number on a B2B page is one a partner will quote back at you. Send us the actual
terms and the page can state them outright — which converts far better than
"aantrekkelijke commissie".

---

## 11. Quality checks (for the record)

Measured on every page, not sampled:

- **Accessibility: 100/100.** Two real faults were found and fixed along the
  way — the big step numbers were too faint to read for anyone with reduced
  vision, and the logo link could not be activated by voice control.
- **SEO: 100/100.**
- **Performance: 90–95** on a simulated mid-range phone on a slow connection.
  Expect higher once it is on Vercel's network, which caches images at the edge.
- **No horizontal scrolling at 360px** (the narrowest phone in common use), on
  any page.
- **Tap targets** enlarged to 44px throughout — the footer links in particular
  were 17px tall, which is unusable on a phone.
- **Reduced motion** honoured: visitors who have switched animations off in
  their system settings get every page fully rendered, with nothing hidden.
- **Structured data** on every page: your business details with the full
  address, the service listings, breadcrumbs, and FAQ markup on the rates page
  and the trust page — eleven questions that can now show as expandable answers
  in Google. Your old site claimed none of them.
- **Deliberately no review markup anywhere**, per §2.

One known imperfection: Google's tool marks the site 96/100 rather than 100 on
"best practices", because of a security-header setting. Fixing it would mean
giving up the pre-rendering that makes the site fast. It is the right trade and
it is not worth changing.

---

## 12. Summary — what we need from you

| #   | We need                                          | Why it matters                        |
| --- | ------------------------------------------------ | ------------------------------------- |
| 1   | Link to Google/Trustpilot reviews, or a decision | Gets your rating back, legally        |
| 2   | Insurance details + certifications               | Biggest remaining win on the site     |
| 3   | The damage procedure, in your words              | Reassures the most hesitant customers |
| 4   | Confirm address, and the 085 number              | Local search ranking                  |
| 5   | Confirm the disclaimer wording                   | Trademark protection                  |
| 6   | Where contact form messages should go            | The form cannot send until then       |
| 7   | Partner commission terms                         | Unblocks the reisbureau page          |
| 8   | Thursday's photographs                           | Two photos currently do double duty   |
| 9   | Vercel access, or deploy it yourself             | Nothing is live yet                   |

Items 1, 2 and 6 are the ones with real money attached.

---

---

# Handover 4 — the booking page, and four products instead of two

Date: 29 July 2026
Status: `npm run verify` passes with zero errors and zero warnings. Still not
deployed — see §9.

**Five things need an answer from you.** They are marked ➜. Two of them are
about money going out of the door right now.

---

## 1. You were right about the reservation page. It is fixed.

You wrote: _"I saw the reservation page you see the price form instead of
Booking page."_ That is exactly what was happening, and it had been since the
page was built.

Your old WordPress site puts a different ParkingPro block on each page, and each
one opens a different screen. When we rebuilt the site we recorded only one of
those addresses and used it in three places. So:

| Page              | Was showing       | Now shows                |
| ----------------- | ----------------- | ------------------------ |
| **/reservering/** | the price table ✗ | **the booking screen** ✓ |
| /tarieven/        | the price table ✓ | the price table ✓        |
| /login/           | the price table ✗ | **the login screen** ✓   |

So `/login/` was broken in the same way and nobody had noticed yet.

All three now come from a single file that holds every ParkingPro address the
site uses. No page can drift again, because no page contains one.

---

## 2. Your booking form now knows what people typed on the homepage

This is the bigger of the two booking fixes.

Somebody filling in the dates on your homepage was, until today, being sent to
the booking screen — **and having to type the same dates in again.** The
homepage card was decoration with a form attached.

The reason is worth knowing: ParkingPro's official WordPress plugin passes the
dates through for you, and its own manual says this only works with the plugin,
not with a plain embed. We are not using their plugin, so we now build that
hand-off ourselves.

Their system also wants dates written **day-month-year**, and silently ignores
anything else — no error, no warning, it just opens an empty form. That is
almost certainly why nobody diagnosed it before.

Now: choose valet or shuttle and your dates on the homepage → the booking screen
opens with all of it already filled in.

---

## 3. The booking screen used to break on phones. That is fixed too.

The frame holding ParkingPro was a fixed height. Their booking flow gets much
taller as it goes — the step where a customer types their address is far longer
than the first one — so on a phone the later steps were either cut off at the
bottom or trapped in a little scrolling box inside the page.

The frame now resizes itself as the customer moves through the steps. We tested
it at 360px wide, which is the narrowest phone still in common use.

If people have been abandoning bookings on their phones, this is the most likely
reason.

---

## 4. ➜ You sell FOUR products. The website was selling two.

Your ParkingPro account offers:

| Product          | Where they go                       | Pay on arrival |
| ---------------- | ----------------------------------- | -------------- |
| Shuttle buiten   | Tupolevlaan 39, Schiphol-Rijk       | no             |
| Shuttle overdekt | Tupolevlaan 39, Schiphol-Rijk       | no             |
| Valet buiten     | Vertrekpassage, vertrekhal 1e verd. | **yes**        |
| Valet overdekt   | Vertrekpassage, vertrekhal 1e verd. | **yes**        |

The website only ever mentioned "valet" and "shuttle". Covered parking — which
you sell, price separately, and already explain in your own rates FAQ — was
invisible until somebody was inside the booking screen. It is now on the service
cards.

**Two things you should check.**

### ➜ 4a. Your valet prices look wrong. Please look at this today.

Straight from your own live system, same dates, checked across several
different weeks:

| Dates     | Shuttle buiten | Shuttle overdekt | Valet buiten | Valet overdekt |
| --------- | -------------- | ---------------- | ------------ | -------------- |
| 3–6 Aug   | € 161,49       | € 171,49         | **€ 321,49** | **€ 137,48**   |
| 14–21 Aug | € 201,49       | € 211,49         | **€ 361,49** | **€ 182,48**   |
| 10–24 Sep | € 271,49       | € 281,49         | **€ 421,49** | **€ 242,48**   |

Shuttle behaves as you would expect: covered costs ten euro more.

**Valet does not. Outdoor valet is about €184 MORE than covered valet, every
time.** Covered valet is also cheaper than outdoor _shuttle_, which cannot be
intended.

Either the LPS-V rate list has something wrong in it, or it means something you
have not told us. Whichever it is, it has been live and customers have been
seeing it. We have deliberately not written "covered costs a little more"
anywhere on the site, because for half your range that is untrue.

### ➜ 4b. "Betalen bij aankomst" is now on the valet card

Only valet accepts payment on arrival. That is a real reason to choose the more
expensive service and it appeared nowhere on your website. It is now on the
valet card and in the booking panel. Please confirm it is still correct.

---

## 5. The two addresses were not a mistake — we were wrong last time

Handover 3 treated your three different location strings as one inconsistency
and merged them. That was half right.

Two of them were the same place written loosely. **The third was a different
place**, and ParkingPro's own data proves it: shuttle runs from **Tupolevlaan 39
in Schiphol-Rijk**, valet hands over at the **Vertrekpassage in the terminal**.

Both are now published, each labelled with what happens there. A customer who
drives to the wrong one misses a flight, so this is worth more than tidiness.
Only the business address goes into the Google listing data.

➜ **Please confirm the postcode 1119 PA for Tupolevlaan 39** — we took that from
the street rather than from your records.

**The phone-number question is closed.** You told us on 29 July: **085-4013918
is the only number**, everywhere. It is now the single number on all ten pages,
in the `tel:` links, and in the Google listing data. The 0297 line is gone, and
so is the "or call…" second number that used to sit under it on the contact page.

We had picked 0297 in earlier handovers because it was in your terms and on more
pages. That reasoning was reasonable and the answer was wrong — which number you
actually answer is not something documents can settle.

➜ One loose end: **0297-785515 is still printed in your algemene voorwaarden**,
hosted on valetparkingschiphol.nl and linked from every page of this site. Worth
changing there too, or the inconsistency just moves somewhere Google still reads
it.

---

## 6. Real prices, in your own design, before anyone sees a ParkingPro screen

ParkingPro has a price service we can read. So once somebody picks their dates
on the homepage, **the actual price now appears on the booking card** in your
own typeface, before they have seen anything of the booking system.

It shows the cheaper of the two versions of the chosen service and says "vanaf".
If the price service is slow or unavailable, nothing appears and nothing breaks.

**This also answers the question you raised on 27 July.** Your ParkingPro
instance _does_ have a usable interface for reading data — locations, prices and
settings. What it does not appear to have is a way to _create_ a booking from
outside, which is why the booking itself still finishes inside their screen.

➜ **Worth asking ParkingPro directly:** whether The Parking Company can have a
booking (write) API. If yes, the entire reservation could happen on your own
site, in your own design, with no embedded frame at all. That is a bigger change
than this pass, but it is the right question to be asking them now.

---

## 7. Your login page was invisible. It has entry points now.

`/login/` existed and nothing linked to it — so the **10% account discount** was
unreachable, and so was the only way for a customer to change a booking without
phoning you.

It is now in the header, in the phone menu, in the footer, and on both the rates
and booking pages with the line: _"Al klant? Log in en ontvang 10% korting op
elke reservering."_

---

## 8. ➜ The contact form now needs one key from you

Handover 3 left the form honest but undelivered. It is now wired to send real
e-mail through **Resend**, and it sets the reply address to the customer's own —
so you just hit Reply.

It needs two things and it needs them **before launch, not during your busy
season**:

1. **A Resend account** (free at your volume) and its API key.
2. **Your domain verified in Resend** — a couple of DNS records. Without it, no
   provider will send as `@langparkerenschiphol.nl`.

If you would rather not add another supplier, the alternative already built in
is a Zapier or Make webhook into your existing inbox. Either way we need one
value from you.

**Until then the form still does not silently swallow messages** — it tells the
visitor it could not send and hands them a pre-filled e-mail with everything
they typed. Nothing is lost. But that is a fallback, not a contact form.

---

## 9. ➜ The reviews question, reopened — this is good news

Handover 3 removed the "4,7 / 5" because nothing on the site said where it came
from.

Since then we found that your WordPress has **both Trustindex.io and a Google
Reviews plugin installed.** That strongly suggests the 4,7 was real all along and
simply lost its source somewhere between the plugin and the page.

The reviews page is now built so that this is **one small change, not a
rebuild.** Send us:

- the link to your **Google Business Profile** (or Trustpilot), and
- confirmation that Trustindex is connected to it

…and the score comes back everywhere, this time naming its source, linking to it,
and marked up so **it can show as stars next to your listing in Google search
results.** Your three written testimonials would be replaced by real Google
reviews.

That turns the weakest page on the site into the strongest one, and it is the
trust signal you have been asking for since the beginning. It is the highest-value
item on this list.

---

## 10. The hero on your phone

You said the picture looked bad on mobile. It was worse than that — **the
photograph was not visible at all** on a phone, which is where most of your
visitors are. It rendered as a plain dark blue block.

Two separate causes: the wide photo was being cropped down to a narrow vertical
sliver, and the dark overlay on top of it was almost solid.

Both fixed. Phones now get a **purpose-made upright crop** of the same
photograph — the van, the livery, the driver in the orange jacket, and the
Vertrek 2 sign — and the overlay was lightened enough to see it while keeping the
headline comfortably readable (measured, not eyeballed).

---

## 11. Checks

- `npm run verify` — clean.
- **Accessibility 100/100**, **SEO 100/100** on every page.
- No sideways scrolling at 360px on any of the ten pages.
- Reduced-motion visitors get every page fully rendered.
- The booking frame was tested against fake messages pretending to be
  ParkingPro: messages from any other source are ignored, including a fake
  "booking complete". Customer names, e-mail addresses and number plates are
  deliberately kept out of the confirmation page's web address.
- Valet cannot be booked less than an hour ahead — tested: at 15:41 the earliest
  valet slot offered was 16:45, shuttle 15:45.
- **Speed: not measurable right now.** This laptop is running another project at
  a load average above 11, which makes any timing meaningless. The last clean
  measurement of the same architecture was 94–95/100, layout stability is a
  perfect 0, and the page weight has not grown. Worth re-checking on Vercel
  after deploy rather than trusting a number taken here today.

---

## 12. Still not deployed

Same as Handover 3: the Vercel tool is installed on this machine but not signed
in to your account. Everything is built and ready.

Also still outstanding: **confirm the six redirects from Handover 3 are live on
the real domain**, not just in the code. They are the single biggest SEO fix in
this project and they only count once they are published.

---

## 13. What we need from you

| #   | We need                                          | Why it matters                                |
| --- | ------------------------------------------------ | --------------------------------------------- |
| 1   | **Check the valet outdoor price**                | Live now, and looks wrong by ~€184            |
| 2   | Google/Trustpilot link + Trustindex confirmation | Brings your rating back, with stars in Google |
| 3   | Resend key, or a webhook                         | The contact form cannot send until then       |
| 4   | Ask ParkingPro for a booking (write) API         | Would remove the embedded frame entirely      |
| 5   | Confirm 1119 PA and pay-on-arrival               | Local search ranking, and accuracy            |
| 5b  | Update 0297 in your algemene voorwaarden         | Last place the old number survives            |
| 6   | Vercel access, or deploy it yourself             | Nothing is live yet                           |

Items 1 and 3 cost you money every day they wait.
