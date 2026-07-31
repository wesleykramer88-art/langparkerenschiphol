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
 * ── EVERY PHOTOGRAPH HERE IS THE CLIENT'S OWN, WITH ONE EXCEPTION ────────────
 * The exception is `terminalDepartures3` / `terminalDepartures3Portrait`, the
 * current hero, which is AI-generated and was supplied and requested as such by
 * the client on 31 July 2026. It is marked with a ⚠ at its entry and the reasons
 * to be careful with it are listed there. Everything below is his camera, and
 * the rest of this note applies to those.
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
   * THE HERO. The branded van at the kerb under Schiphol's own "Vertrek 2 /
   * Departures 2" sign.
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
    alt: 'Shuttlebus van Lang Parkeren Schiphol bij de ingang Vertrek 2 van de vertrekhal op Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoMAAcAAsBIJZQCdAEfbLPZCIsAAP6mzonKXr8HEcWHLK9TYQkMPs6VJnKsLoCnIcUqAeI3oD2ty4sQGkAAAA==',
  },

  /**
   * THE HERO, PORTRAIT. The same frame, cropped 3:4 around the van.
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
    alt: 'Shuttlebus van Lang Parkeren Schiphol bij de ingang Vertrek 2 van de vertrekhal op Schiphol.',
    blurDataURL:
      'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoJAAwAAsBIJQBOgB5wa12cAAD+5TpQ5LC6FUYks7ERV3gZuPfnbCDYFa6FEp1pdEhEErt+vIodSNjLasAj6lfICgITXGaEXAA=',
  },

  /**
   * ⚠ THE CURRENT HERO, AND THE ONLY GENERATED IMAGE IN THIS MANIFEST.
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
    alt: 'Bus van Lang Parkeren Schiphol bij de ingang Vertrek 3 van de vertrekhal op Schiphol, met een medewerker in oranje jas.',
    blurDataURL:
      'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAQCdASoMAAcAA4BaJQBOgB5vxedgAP7aoWnGCkvDyS2Zi2hrxC8dmCVc/+zWmR1F71DuzU3X34SbHLCi10VmPkFBpQAA',
  },

  /**
   * THE CURRENT HERO, PORTRAIT. Same generated frame, cropped 3:4 around the van.
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
    alt: 'Bus van Lang Parkeren Schiphol bij de ingang Vertrek 3 van de vertrekhal op Schiphol.',
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
    alt: 'Chauffeur van Lang Parkeren Schiphol in oranje bedrijfsjas voor de vertrekhal Vertrek 2 op Schiphol.',
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
    alt: 'Medewerker van Lang Parkeren Schiphol tilt een koffer uit de kofferbak terwijl de reiziger toekijkt bij de vertrekhal.',
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
} as const satisfies Record<string, SitePhoto>;

export type PhotoName = keyof typeof photos;
