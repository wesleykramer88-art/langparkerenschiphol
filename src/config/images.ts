/**
 * Photography manifest.
 *
 * Every photograph the site uses is declared here once, with its intrinsic
 * dimensions, its Dutch alt text and a 12px LQIP. Sections import a named
 * entry rather than typing a path, so a re-crop or a replacement asset is a
 * one-line change and no component can drift out of sync with the file it
 * points at.
 *
 * Why the dimensions live here: next/image needs width and height to reserve
 * the box before the bytes arrive. Hard-coding them at each call site is how a
 * replaced asset silently starts stretching.
 *
 * Why the blur strings live here: `placeholder="blur"` needs a `blurDataURL`
 * for any image that is not a static import. These are 12px WebP thumbnails,
 * ~100 bytes each, emitted by `npm run images` from the asset itself — so the
 * reveal resolves out of the photograph's own colours instead of a grey box.
 *
 * ── EVERY PHOTOGRAPH HERE IS THE CLIENT'S OWN, WITH TWO EXCEPTIONS ───────────
 * The exceptions are the two generated hero frames kept below for revert only:
 * `vitoDepartures3` / `vitoDepartures3Portrait` (hero from 2 to 3 August 2026)
 * and `terminalDepartures3` / `terminalDepartures3Portrait` (the one that
 * replaced). Both are AI-generated and both were supplied and requested as such
 * by the client. They are marked with a ⚠ at their entries and the reasons to be
 * careful with them are listed there. NOTHING RENDERS EITHER PAIR since
 * 3 August 2026 — the hero is a real photograph again. Everything else below is
 * his camera, and the rest of this note applies to those.
 *
 * The library this replaces was five pieces of stock garage photography, and
 * four of them showed READABLE FOREIGN NUMBER PLATES: German plates in the
 * covered decks (they carried the hero and the security band), and a lot of
 * white-plated pickups under tropical trees in the aerial. A garage shot with
 * German plates on a site whose entire proposition is "we are at Schiphol"
 * contradicts the proposition in the one element a visitor reads fastest.
 *
 * They are gone. What is here instead is his own estate, shot at the airport:
 * the branded van under the Vertrek 2 sign, his crew in the orange jacket, a
 * real kerbside handover, and his own lot — Dutch yellow plates throughout.
 *
 * The standing rule for any future asset, stock or shot: DUTCH YELLOW PLATES,
 * or no vehicle in frame. There is no third option.
 *
 * ── RETOUCHED IS NOT THE SAME AS GENERATED ──────────────────────────────────
 * Added August 2026, because the distinction now decides where a frame may be
 * used and a filename is not enough to settle it.
 *
 *   GENERATED — the scene never happened. Never on /digitale-ritregistratie/,
 *   which argues for verifiable honesty and would be undermined by a synthetic
 *   frame; general ambiance only, and marked with a ⚠ at its entry.
 *
 *   RETOUCHED — the client's own photograph, corrected. `crewPaperwork` below
 *   is his frame with the crew jacket recoloured from blue to the correct
 *   hi-vis orange. Usable anywhere a photograph is usable.
 *
 * A `ChatGPT Image …` filename tells you a tool touched the file. It does not
 * tell you which of the two happened, and the two are not interchangeable. Ask
 * the client which it is, inspect the frame before shipping it — wordmarks,
 * plates, signage, bokeh — and record the answer at the entry.
 *
 * Originals live in `photos-source/` (gitignored) and are processed by
 * `npm run images` — see scripts/images.mjs.
 */

export type SitePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
};

export const photos = {
  /**
   * THE HERO. A real photograph again, supplied 3 August 2026 as
   * `busjeschiphollangparkeren.png` (1678 × 937).
   *
   * The handover at the kerb: a crew member in the orange jacket walking a
   * customer to the black Vito with its side door already open, Schiphol's blue
   * wayfinding signs behind them and the terminal deck on the right. She is
   * turned back over her shoulder, smiling — which is the single thing neither
   * generated frame it replaces could produce, because both of those had no
   * customer in them at all.
   *
   * Everything the two AI frames were reaching for is here and is true: the
   * "Lang Parkeren Schiphol" wordmark at full width across the jacket, the van,
   * the airport, the kerb. And nothing has to be apologised for — no mangled
   * flight board, no invented carriers, no illegible plate legend. The van's
   * plate is not in frame at all, so the standing rule at the top of this file
   * is met by omission rather than by inspection.
   *
   * Measured under the existing `scrim-hero` at a 1440 × 800 desktop section,
   * sampling the brightest pixel inside the copy column (x 80–600) at each
   * element's own band: the lead in navy-100 is 6.65:1 (5.53:1 for the frame it
   * replaces), the H1 in white 8.20:1, the micro-line in navy-300 6.97:1
   * (6.89:1). Brighter frame, better numbers — the 93% navy at the left of the
   * scrim does the work — so `scrim-hero` was left exactly as it was. Re-measure
   * if this image is replaced; see the note on that utility in globals.css.
   *
   * ⚠ RESOLUTION. The supplied file is 1678px wide, against 2400px for
   * everything else in this manifest. `allowedWidthsUpTo` therefore caps the
   * landscape srcset at 1200w — see config/image-sizes.ts, which refuses to
   * offer widths that would upscale — so above ~1200px CSS the desktop hero is
   * being stretched, and this is the LCP element on the busiest page of the
   * site. It is soft rather than broken, and a real photograph at 1678px is
   * worth more than a generated one at 2400px.
   * TODO(client): send the original camera file. Drop it in `photos-source/`
   * and re-run `npm run images`; nothing else here has to change.
   */
  crewShuttleTerminal: {
    src: '/images/chauffeur-shuttle-vertrekhal.webp',
    width: 1678,
    height: 937,
    alt: 'Parkeren Schiphol met chauffeur van Lang Parkeren Schiphol bij de vertrekhal.',
    blurDataURL:
      'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAwAgCdASoMAAcAAsBIJbACdDBAAalJOmb9XAD+8E12fgRV3CFuU41G3kqWYZY1LmnZ3GmbgsFweo9MwlO2zKyCKlgifSQ8vWVm3A4OO3uuMB5lGgOEqrXx/my8AA==',
  },

  /**
   * THE HERO, PORTRAIT. Same frame, cropped 3:4 around the jacket.
   *
   * Taken from x = 390…1093 of the 1678-wide original, full height. That window
   * is chosen so the wordmark clears both edges after `object-cover` trims the
   * crop's 0.75:1 down to the phone band's 0.70:1 — the lettering ends at about
   * 92% across, and anything further right starts to clip "Lang".
   *
   * What it costs is the customer: she sits at x ≈ 120–400 and no 3:4 window can
   * hold both her and the full wordmark out of a 1.79:1 source. On a phone the
   * brand name is the thing worth keeping. She is in the sm and desktop crops.
   *
   * Served below 640px through a real <picture> element — see <HeroPhoto>. Only
   * one of the two is ever downloaded.
   *
   * ⚠ Same resolution caveat as above, and sharper here: at 703px wide the
   * portrait srcset tops out at 640w, so a 360px phone at DPR 3 is upscaling
   * from 1.78× rather than 3×. The frame it replaces was 1150px and reached
   * 1080w. The original camera file fixes this too.
   */
  crewShuttleTerminalPortrait: {
    src: '/images/chauffeur-shuttle-vertrekhal-portret.webp',
    width: 703,
    height: 937,
    alt: 'Valet parkeren bij Schiphol met chauffeur en shuttlebus van Lang Parkeren Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAQCdASoJAAwAAsBIJbACdAEONNiYEAD+919tNwUJ9k6m1E4pc98fy5PAAgOQjN+FyJ5VvY8fTcLLqtYYuAGrWFzLY3tfQrdwUJ7d/5rfz7I3rUzhIBTwVTmv9K2FQAA=',
  },

  /**
   * An earlier real hero. The branded van at the kerb under Schiphol's own
   * "Vertrek 2 / Departures 2" sign. Nothing renders it; kept for revert.
   *
   * This is the photograph the whole brand argument rests on. A covered deck
   * says "car park operator"; a terminal frontage says "part of the airport",
   * which is the feeling the client asked for in as many words. The wayfinding
   * sign does the work — it places the business at the airport without
   * reproducing anybody's logo or mark.
   *
   * Wide and already dark along the top, so the hero scrim grades into it
   * rather than fighting it.
   */
  terminalDeparture: {
    src: '/images/terminal-vertrekhal.webp',
    width: 2400,
    height: 1340,
    alt: 'Shuttle parkeren bij Schiphol met de shuttlebus van Lang Parkeren Schiphol bij Vertrek 2.',
    blurDataURL:
      'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoMAAcAAsBIJZQCdAEfbLPZCIsAAP6mzonKXr8HEcWHLK9TYQkMPs6VJnKsLoCnIcUqAeI3oD2ty4sQGkAAAA==',
  },

  /**
   * That earlier hero, PORTRAIT. The same frame, cropped 3:4 around the van.
   *
   * Art direction, not a duplicate. The landscape original is 1.79:1; a phone
   * viewport is about 0.46:1. Filling one with the other crops away three
   * quarters of the width, and what survived was a vertical strip of tinted
   * glass — the client's report that the hero "looks bad on a phone" was
   * exactly right, and the photograph might as well not have been there.
   *
   * This crop keeps everything the argument needs: the full "Lang Parkeren
   * Schiphol" livery, the driver in the orange jacket, the "2" of the
   * Departures sign, and the zebra crossing at the terminal kerb.
   *
   * Served below 640px via a real <picture> element — see <HeroPhoto>. Only one
   * of the two is ever downloaded.
   */
  terminalDeparturePortrait: {
    src: '/images/terminal-vertrekhal-portret.webp',
    width: 1005,
    height: 1340,
    alt: 'Veilig parkeren Schiphol met shuttlebus bij de vertrekhal van Amsterdam Airport Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoJAAwAAsBIJQBOgB5wa12cAAD+5TpQ5LC6FUYks7ERV3gZuPfnbCDYFa6FEp1pdEhEErt+vIodSNjLasAj6lfICgITXGaEXAA=',
  },

  /**
   * ⚠ THE PREVIOUS HERO. GENERATED, NOT PHOTOGRAPHED. Kept for revert only —
   * nothing renders it since 3 August 2026, when `crewShuttleTerminal` above
   * took the slot.
   *
   * Supplied on 2 August 2026 (`PicjamDownloa.jpg`, 2752 × 1536) and set as the
   * hero on request. It replaced `terminalDepartures3` below, which is kept so
   * that is a one-line revert too.
   *
   * What it gains over the frame it replaces: the livery is a full-height
   * "Lang Parkeren Schiphol" on the flank of a black Vito rather than a small
   * mark, the plate is legible and yellow ("VLG-01-L", a real Dutch sidecode),
   * the crew jacket carries the same wordmark, and the terminal's own
   * "Vertrek / Departures 3" lettering, the canopy and the trolley rank all
   * read. The wet red bus lane in the foreground is the strongest thing in the
   * frame for placing this at an airport kerb.
   *
   * Measured under the existing `scrim-hero` at a 1440 × 800 desktop section:
   * the lead in navy-100 is 4.64:1 against the copy column's brightest pixel
   * (4.57:1 for the frame it replaced), the H1 7.5:1, the micro-line in
   * navy-300 6.6:1. So the scrim was left exactly as it was. Re-measure if this
   * image is replaced — see the note on that utility in globals.css.
   *
   * ⚠ WHAT IS WRONG WITH IT, AND IT IS THE SAME FLAW AS LAST TIME: the blue
   * flight board at the upper right IS IN THIS CROP, and its carrier list is
   * mangled — "AIR BRADIA", "AIR TRANEST", "BULDARIA AIR", "CRGATIAN AIRLINES",
   * "ETMAD AIRWAYS", "CZEEH AIRLINES", "YUEUNIE", "AIR MACTA", under a header
   * whose second line is gibberish. The previous generated hero had the same
   * board and it was deliberately cropped out; here it cannot be, because the
   * board and the crew member in the orange jacket share the right-hand quarter
   * of the frame — cropping past x≈2100 of 2752 removes both.
   * It is legible at desktop widths. The portrait crop below does not contain
   * it, so phones are unaffected.
   * TODO(client): either accept it, or say the word and this ships as a 2.38:1
   * crop from y=380 down, which loses the board and the sky and keeps the van,
   * the sign and the crew — at the cost of roughly a quarter of the width at
   * desktop. A real photograph at the kerb ends the question entirely.
   */
  vitoDepartures3: {
    src: '/images/terminal-vertrek3-vito.webp',
    width: 2400,
    height: 1340,
    alt: 'Auto parkeren bij Schiphol met de bus van Lang Parkeren Schiphol bij Vertrek 3.',
    blurDataURL:
      'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoMAAcAAsBIJQBOgCLs4munfMAA/u9cbf6BfnJ0MOqWHrcC8fhsCzJM6zaC6tlG1u1WIiE2XHOiZ2enAAA=',
  },

  /**
   * THE PREVIOUS HERO, PORTRAIT. Same generated frame, cropped 3:4 around the
   * van. Kept for revert; nothing renders it.
   *
   * Same art-direction reason as the pair below: a 1.79:1 frame in a phone
   * viewport crops away most of its width. Served below 640px through a real
   * <picture> element — see <HeroPhoto>. Only one of the two is downloaded.
   *
   * Taken from x=900…2050 of the 2752-wide original, which is what puts the
   * plate, the wheels, the orange "Schiphol" and the canopy in frame — and
   * which is also why the mangled flight board (x≈2100 onward) is not in it.
   *
   * The source is 1.79:1, so this crop can hold the full width of the terminal
   * sign OR the full width of the livery, not both: the two span 0.84:1
   * together and the phone band is 0.70:1. The livery won. "Vertrek /
   * Departures 3" therefore runs off the left edge and "Lang Parkeren" off the
   * right, which reads as a frame edge rather than as a mistake.
   */
  vitoDepartures3Portrait: {
    src: '/images/terminal-vertrek3-vito-portret.webp',
    width: 1150,
    height: 1536,
    alt: 'Parkeerplaats bij Schiphol met Lang Parkeren Schiphol vervoer voor de vertrekhal.',
    blurDataURL:
      'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoJAAwAAsBIJYwCdAD5+xCHCgAA9qjI5gv+G/hK1upqe2/KJnG1DXW64sTw7nWMZM+bukqSpOFqiH5AAAA=',
  },

  /**
   * ⚠ THE PREVIOUS HERO. GENERATED, NOT PHOTOGRAPHED. Kept for revert only —
   * nothing renders it since 2 August 2026.
   *
   * Supplied by the client on 31 July 2026 and set as the hero at his request.
   * The source filename was `PicjamDownload-Picsart-AiImageEnhancer.jpg` and the
   * frame is AI-generated, not photographed. Everything else in this file is his
   * own camera. Read the note at the top of this manifest before you reach for
   * this entry for anything else.
   *
   * It composes well — the Departures sign, the branded van, the crew jacket and
   * a yellow plate are all where the argument needs them — and it measured 4.57:1
   * for the hero lead under the existing scrim, against 4.60:1 for the
   * photograph it replaced, so no contrast work was needed.
   *
   * The number plate survives inspection: "VLG-01-L" is a real Dutch sidecode
   * (XXX-99-X) on a correctly yellow plate, so the standing rule at the top of
   * this file is met. Only the tiny legend along the plate's bottom edge and the
   * EU band are mush, and neither is legible at any size the site renders.
   *
   * What IS wrong, and why the crop is what it is:
   *   • The flight board that stood at the upper right listed "AIR ARARIA",
   *     "AIR TRAUSAT", "BULIEARIA AIR" and "AIR MACTA" — mangled real carriers,
   *     under a header of pure gibberish. It was the one flaw a traveller would
   *     read instantly, so the landscape crop starts BELOW it (top=1180 of the
   *     4096 square, which clears the board and still opens above the Departures
   *     sign at ~1250). The portrait crop never contained it. Do not re-crop
   *     upward without checking this.
   *   • The crew jacket's own lettering is illegible mush. It is small, and it
   *     reads as an out-of-focus logo rather than as an error.
   *   • It says Vertrek 3. The client's real photography says Vertrek 2 and
   *     article 6 of his terms puts the handover between halls 2 and 3.
   *
   * TODO(client): a real photograph at the kerb replaces this. See the note in
   * HeroSection.
   */
  terminalDepartures3: {
    src: '/images/terminal-vertrek3.webp',
    width: 2400,
    height: 1341,
    alt: 'Lang parkeren bij Schiphol met shuttlebus en medewerker van Lang Parkeren Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAQCdASoMAAcAA4BaJQBOgB5vxedgAP7aoWnGCkvDyS2Zi2hrxC8dmCVc/+zWmR1F71DuzU3X34SbHLCi10VmPkFBpQAA',
  },

  /**
   * AN EARLIER HERO, PORTRAIT. Same generated frame, cropped 3:4 around the van.
   * Kept for revert; nothing renders it.
   *
   * Same art-direction reason as terminalDeparturePortrait: a 1.79:1 frame in a
   * phone viewport crops away most of its width. This crop holds the sign, the
   * full livery and the plate.
   *
   * Taken from the left 3072px of the square, which is also why it never
   * contained the mangled flight board — that sat past x=3650. It needs no
   * equivalent of the landscape crop's top offset.
   */
  terminalDepartures3Portrait: {
    src: '/images/terminal-vertrek3-portret.webp',
    width: 1800,
    height: 2400,
    alt: 'Schiphol parkeerplaats met shuttlebus van Lang Parkeren Schiphol bij Vertrek 3.',
    blurDataURL:
      'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoMABAAA4BaJQBOgCHgvfMQ3BAzAAD+ibx+xyaVv38FkuDGvt9DQ1CFQggHsosI9oX2OdTK9UOBn2Rm+g/fxv3Bct5MuZKAOFEUQDctzFqAAA==',
  },

  /**
   * The chauffeur in the branded orange jacket, facing the Vertrek 2 entrance.
   * The jacket is the same hi-vis tone the palette is built from, which is why
   * valet-600 is what it is — screen and kerbside match on purpose.
   *
   * Square, and the figure sits dead centre, so it crops well to almost any
   * ratio from either side.
   */
  crewTerminal: {
    src: '/images/chauffeur-vertrekhal.webp',
    width: 2048,
    height: 2048,
    alt: 'Valet parking Schiphol met chauffeur van Lang Parkeren Schiphol bij de vertrekhal.',
    blurDataURL:
      'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoMAAwAAsBIJZgCdAEPDTwrHB6YAAD+2+vxyrrDZaUTg0mcvM2Hlm2NudetvcIaKCRtIzB8k1P3cA8XXWPZl5JxK2h+f6NS1UYUZDGVtkIr9VKhmXZ3msHXlygAAA==',
  },

  /**
   * The handover itself: crew taking a case out of the boot at the kerb, with
   * the customer standing beside them. The single most valuable frame in the
   * library — it is the only one showing the actual transaction being performed
   * on a real customer's car.
   *
   * This supersedes the 708px `beveiliging.webp` crop the site shipped with,
   * which was too small to render above ~36rem. Same moment, 2048px.
   */
  crewHandover: {
    src: '/images/bagage-overdracht.webp',
    width: 2048,
    height: 2048,
    alt: 'Parkeren Schiphol bij de luchthaven met bagageservice van Lang Parkeren Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwAgCdASoMAAwAAsBIJZACdAEfn6bmXw16AAD5agaH0X9fw5H1Rxz2Rzs8b/5OWX4p7NK3XwZLnHQWSdruqVNtERPsUkIQoYPcxKIlu/p/8Z2qjNEZiUjOzSK4/aJv/+2ygvpVpANxcmbh3l6BOQn1t3BRBgAA',
  },

  /**
   * His own parking terrain, with the orange shuttle bus running along the top
   * of the frame. Rows of Dutch yellow plates, unmistakable at a glance — which
   * is exactly the job this photograph does. It is the proof shot for the
   * shuttle product and for the security band.
   */
  lotShuttle: {
    src: '/images/parkeerterrein-shuttlebus.webp',
    width: 2048,
    height: 2048,
    alt: 'Parkeerterrein van Lang Parkeren Schiphol met rijen geparkeerde auto’s met Nederlandse gele kentekenplaten en de oranje shuttlebus.',
    blurDataURL:
      'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABQAgCdASoMAAwAAsBIJZQC7AYsFqy3Fv/7alAA/p8DIy+jG9fV+OWCA8mPk9edkG+ozFf2ZUsQTos6B46J4oHc6CWJLSM6+iiZFhwnfnl0FAAA',
  },

  /**
   * The digital check-in on the clipboard, in the covered garage — with a Dutch
   * yellow plate in shot. The evidence behind "digitale ritregistratie".
   *
   * Only 590px wide, so it is used as a small detail inset and never as a band.
   * TODO(client): reshoot at full resolution in the Thursday batch — a
   * legible tablet or checklist in the crew's hands is worth more than this
   * crop can carry.
   */
  crewCheck: {
    src: '/images/valet-parkeren.webp',
    width: 590,
    height: 224,
    alt: 'Chauffeur van Lang Parkeren Schiphol legt de staat van een auto vast op de parkeerlocatie.',
    blurDataURL:
      'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoMAAUAA8BgJYgCdAEec8/agADeN7DvV/xZZPTfXAeVN/gjst76C7EDcX/Pq1lkw9h4PUz6iSzxltFLjbkDgUAA',
  },
  /**
   * The chauffeur on his own terrain, paperwork in hand, with the orange
   * shuttle behind him and a Dutch yellow plate on the car at the left.
   * Supplied 14 August 2026.
   *
   * This is the frame the manifest has been asking for since the first pass —
   * `crewCheck` below carries the same idea at 590px and has a TODO on it
   * begging for exactly this. It is the only photograph in the library that
   * shows a named human doing the administrative half of the job, which is why
   * it carries /digitale-ritregistratie/.
   *
   * ── ON THE FILENAME, AND WHY THIS IS NOT AN AI FRAME ───────────────────────
   * It arrived as `ChatGPT Image 14 aug 2026_ 11_55_52.png`, which under the
   * standing rule at the top of this file would disqualify it from that page
   * outright. The client has confirmed it is his own photograph: the crew jacket
   * was the wrong colour in the original (blue), and ChatGPT was used to
   * recolour it to the correct hi-vis orange. The subject, the location, the
   * people and the vehicles are all real and all his.
   *
   * That distinction matters and is worth stating plainly, because
   * /digitale-ritregistratie/ is a page about verifiable honesty and a
   * synthetic frame on it would undermine the argument it is making. A colour
   * correction is retouching. A generated scene is not. This is the former.
   *
   * Inspected before use, as any retouched frame should be: the wordmark reads
   * correctly, the yellow plate is intact and Dutch, the bokeh is optically
   * consistent, and there is no mangled signage. Nothing here has to be cropped
   * around.
   *
   * ⚠ Two SIBLING files came with it and are NOT in this manifest:
   *   · `…11_58_36.png` — the same frame with the left 55% outpainted to white
   *     for a banner crop. The fill is visibly generated; the original below is
   *     better and needs no apology.
   *   · `…12_17_21.png` — a car at a garage entrance. Not requested for any
   *     placement in this pass, and it is the one the earlier brief flagged as
   *     general ambiance only.
   * Neither is used anywhere. Do not add them to a trust page without asking.
   */
  crewPaperwork: {
    src: '/images/chauffeur-terrein-papieren.webp',
    width: 1536,
    height: 1024,
    alt: 'Chauffeur van Lang Parkeren Schiphol in oranje bedrijfsjas met de papieren van een reservering in zijn hand, op het parkeerterrein met de shuttlebus op de achtergrond.',
    blurDataURL:
      'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoMAAgAAsBIJQBOgCHb5WLXAAD9U5uxAmz74RwiqOeW7H67DHMNrHlv5JNJhKfJQ/S9QX/v7vRBTRG8Z2PdjOPd7aQ5s95UuSkbIsAA',
  },

  /**
   * Elektrisch opladen in de overdekte garage. Supplied 14 August 2026.
   *
   * The same crew member in the branded jacket, plugging a connector into a
   * white car under the deck lighting, with the charge point's status ring lit
   * green. His own garage, his own charger, his own staff.
   *
   * The EV proposition was surfaced in copy in the previous pass with nothing
   * to show for it; this is the evidence. It renders in three places — the
   * homepage security band, /veilig-parkeren-schiphol/ and the shuttle page —
   * at three different crops, because it is a 3:2 frame and those slots are
   * 4:3, 16:10 and 3:2 respectively. See each call site for its object-position.
   *
   * ⚠ The charge point's indicator is green, a hue this palette excludes. It is
   * a lit LED on a real object rather than a brand surface, and the `photo`
   * grade's desaturation pulls it most of the way onto the house line. It is
   * never placed adjacent to the accent.
   */
  evCharging: {
    src: '/images/elektrisch-opladen-garage.webp',
    width: 1536,
    height: 1024,
    alt: 'Medewerker van Lang Parkeren Schiphol sluit een laadkabel aan op een elektrische auto bij een laadpunt in de overdekte parkeergarage.',
    blurDataURL:
      'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoMAAgAAsBIJZgCdADbmHT+QAD+7S0btSImf1+6R4SnNxx6oTJBUHwvr/n3sSkkjvSG2VwgsPEd7ZFg7rNh/zg7bwuz9cF0mNJU5RAWyTZ4SGKAAAA=',
  },

  /**
   * ── THE TWO APP SCREENSHOTS ARE NOT PHOTOGRAPHS ────────────────────────────
   *
   * Client-supplied, August 2026, for /digitale-ritregistratie/. They are
   * screen captures of the driver app his crew actually runs, in a rendered
   * iPhone frame on a near-white ground.
   *
   * ⚠ THEY MUST NOT BE RENDERED THROUGH <Photo>. That component applies the
   * house grade — saturate(0.82), contrast(1.06) and an 8% navy veil — which
   * exists to drag photographs shot under different light onto one hue line.
   * Applied to a UI capture it desaturates the interface and lays a blue cast
   * over white cards, which does not read as "graded", it reads as a broken
   * screenshot. They are rendered with next/image directly. See
   * <AppScreenshot> on the ritregistratie page.
   *
   * ⚠ THE APP UI IS TEAL-GREEN, which is a hue this palette does not contain
   * and deliberately excludes. That is acceptable here and only here: it is
   * evidence of a third-party tool rather than a brand surface. Both are
   * presented on a paper panel and never placed next to the accent, so the
   * green never sits beside the orange.
   *
   * ⚠ THE DATA IN THEM IS FABRICATED. "John de Vries", 0612345678,
   * john.devries@mail.com, plate 7-xgf-98, booking #J4G7A. Plainly test data,
   * but it will be on a public page.
   * TODO(client): confirm you are happy for these to be published as-is. If
   * not, send captures with those rows blanked — a crop here would cut the
   * layout that makes the point.
   */
  appReservation: {
    src: '/images/app-reservering.webp',
    width: 1007,
    height: 1561,
    alt: 'Schermafbeelding van de chauffeursapp met de gegevens van een reservering: naam, voertuig, parkeer- en retourdatum en de vluchtinformatie.',
    blurDataURL:
      'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAACwAQCdASoIAAwAAsBIJYwCw7DdDFk0AP7uZll7IrPc2Yg4hrICVbqmi+XxPY8XgIYXPItI+mUP+HYUpE2g12W2wpN6aGK/PzdNIz6zc+Tdt0Q0/84zLmUFeAAAAA==',
  },

  appRideRegistration: {
    src: '/images/app-ritregistratie.webp',
    width: 899,
    height: 1750,
    alt: 'Schermafbeelding van de chauffeursapp tijdens een rit, met de huidige snelheid in km per uur, de starttijd van de rit en de status van de GPS-verbinding.',
    blurDataURL:
      'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwAgCdASoGAAwAAsBIJZQAD4lw5Q0yHf7OAAD+6G4ttIsjLtk+/cRvKAPzXWR1Q2vqzOJ3sEYvS/F9iigbPvOJTz661P4PhQoXiCOAAAA=',
  },
} as const satisfies Record<string, SitePhoto>;

export type PhotoName = keyof typeof photos;
