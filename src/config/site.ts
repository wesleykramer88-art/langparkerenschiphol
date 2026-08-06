/**
 * Single source of truth for NAP (name, address, phone), navigation and legal
 * identity. Nothing in the app hard-codes a phone number, e-mail or URL —
 * everything reads from here, so a change lands everywhere at once.
 *
 * Why this file exists: the WordPress site it replaces showed 085-4013918 in the
 * homepage header and footer, 0297-785515 on every other page's header and on
 * /contact/, and mixed klantenservice@ with info@. Inconsistent NAP actively
 * suppresses local-SEO ranking, so it is consolidated here.
 *
 * The phone half of that is now settled: 085-4013918 is the only number on the
 * site. See `phone` below.
 */

/**
 * THE phone number. Singular — see the note on `phone` below.
 *
 * Kept in E.164 here and expanded into display and `tel:` forms once, so the
 * site cannot end up showing one number and dialling another.
 */
const PHONE_E164 = '+31854013918';

export const siteConfig = {
  name: 'Lang Parkeren Schiphol',
  /** Used as the OpenGraph site_name and in the <title> template. */
  shortName: 'Lang Parkeren Schiphol',
  locale: 'nl-NL',
  lang: 'nl',
  tagline: 'Zorgeloos parkeren, ontspannen reizen.',

  /**
   * THE phone number, and the only one. Client decision, 29 July 2026.
   *
   * ── This closes the last open NAP question ─────────────────────────────────
   * The old site ran two numbers: 085-4013918 in the homepage header and the
   * site-wide footer, 0297-785515 on every other page's header and on
   * /contact/. Earlier handovers picked 0297 as canonical — it was corroborated
   * by the algemene voorwaarden ("Telefoon Kantoor +31(0) 297 785 515") and it
   * appeared in more places — and kept 085 as a secondary line on /contact/.
   *
   * That reasoning was sound and the conclusion was wrong. Which number the
   * business actually answers is not something documents can settle, and the
   * client has now said plainly: 085-4013918, everywhere, and nothing else.
   *
   * `phoneSecondary` is gone rather than left unused. Two numbers in a config
   * file is how two numbers end up back on a page, and one consistent number is
   * the entire point of this file — Google will not trust a local business that
   * cannot state its own.
   *
   * TODO(client): 0297-785515 is still printed in your algemene voorwaarden,
   * which are hosted on valetparkingschiphol.nl and linked from every page of
   * this site. Worth updating there too, or the inconsistency simply moves.
   */
  phone: {
    /** Human-readable, as it should be rendered on screen. */
    display: '085 - 401 3918',
    /** E.164, for tel: hrefs and schema.org. Replaces the live site's broken
     *  placeholder `tel:123456789`, which called nothing when tapped. */
    href: `tel:${PHONE_E164}`,
    e164: PHONE_E164,
  },

  /**
   * CANONICAL e-mail. Chosen because /contact/ uses it and it appears inside the
   * already-indexed og:description for that page.
   * TODO(client): confirm. Footer of the live site uses klantenservice@ instead.
   */
  email: 'klantenservice@langparkerenschiphol.nl',
  /** Alias shown on /contact/ alongside the canonical address. */
  emailSecondary: 'klantenservice@langparkerenschiphol.nl',

  /**
   * ── THERE ARE TWO ADDRESSES, AND THAT IS CORRECT ───────────────────────────
   *
   * Handover 3 recorded the site's three different location strings as a NAP
   * consistency problem and collapsed them onto one. That was half right. Two
   * of the three are the same place written badly; the third is a different
   * place entirely, and merging it away lost real information.
   *
   * ParkingPro's own location data settles it. The four products carry two
   * addresses between them:
   *
   *   shuttle (LPS-S, LPS-SO)   Tupolevlaan 39, Schiphol-Rijk
   *   valet   (LPS-V, LPS-VO)   Vertrekpassage, Schiphol — Vertrekhal, 1e verd.
   *
   * They are not in conflict. The terrain, the office and the shuttle depot are
   * at Tupolevlaan; the valet handover happens kerbside at the terminal,
   * because that is the entire point of valet. A customer who drives to the
   * wrong one of those misses their flight.
   *
   * So both are published, each labelled with what happens there. `address`
   * below is the BUSINESS address — it is what goes in the LocalBusiness
   * markup, the footer and the KvK-facing identity. `valetHandover` is an
   * operational instruction, shown on the valet service and on /contact/, and
   * deliberately absent from the structured data: two PostalAddress values on
   * one LocalBusiness node is the inconsistency this was meant to fix.
   */
  address: {
    street: 'Tupolevlaan 39',
    postalCode: '1119 PA',
    locality: 'Schiphol-Rijk',
    region: 'Noord-Holland',
    country: 'NL',
    countryName: 'Nederland',
    /** One-line form, for the footer and the contact card. */
    display: 'Tupolevlaan 39, Schiphol-Rijk',
  },

  /**
   * Where a VALET customer actually drives to. Not the business address.
   *
   * TODO(client): confirm the postcode for Tupolevlaan 39 above — 1119 PA is
   * the postcode for that street, but we have it from the address rather than
   * from you, and it is the one part of the NAP that is inferred rather than
   * read off your own systems.
   */
  valetHandover: {
    street: 'Vertrekpassage',
    detail: 'Vertrekhal, 1e verdieping',
    locality: 'Schiphol',
    display: 'Vertrekpassage, Schiphol — Vertrekhal, 1e verdieping',
  },

  /** Amsterdam Airport Schiphol. Used for geo in ParkingFacility schema. */
  geo: { latitude: 52.3105, longitude: 4.7683 },

  /**
   * Legal identity. The site this replaces published none of it; Dutch
   * distance-selling law (BW 6:230m) requires a trader to state its identity,
   * geographic address and KvK number.
   *
   * ── There is deliberately no street address here ────────────────────────────
   * There was one — the KvK registered office — and it was the client's own
   * HOME address. He asked for it to be taken off the site on 31 July 2026, and
   * he is right to: a sole trader's registered office is very often his front
   * door, and publishing it on a consumer website puts it in front of an
   * audience that has no business needing it.
   *
   * So the field is REMOVED rather than blanked. An empty string would render
   * an empty row on /algemene-voorwaarden/ and would invite somebody to helpfully
   * fill it back in from the KvK register.
   *
   * What still satisfies BW 6:230m in the meantime is the KvK number below: it
   * resolves to the trader's registered address in a public register, which is
   * the identification the rule is actually after. That is an interim position,
   * not a permanent one.
   *
   * TODO(client): send the new business address as soon as the company is
   * re-registered, and it goes back into the identity block on
   * /algemene-voorwaarden/ and into article 1 of the terms. Until then, do not
   * put the Vinkeveen address back — it is a private home.
   * TODO(client): confirm this entity is the contracting party for THIS brand.
   */
  legal: {
    entity: 'The Parking Company',
    kvk: '74048856',
  },

  /** Years in business. The live site says "meer dan 15 jaar" on the homepage and
   *  footer, but "10+ jaar" on /samenwerken/. We use 15 — two authoritative
   *  placements agree, and the partner page has documented copy-paste damage.
   *  TODO(client): confirm 15. */
  yearsActive: 15,
} as const;

/**
 * Primary navigation. Also the source for sitemap.ts and BreadcrumbList schema,
 * so routes are never listed twice.
 *
 * Trailing slashes are deliberate and must not be removed: these exact URLs are
 * indexed and carry backlinks. next.config.ts sets trailingSlash: true so they
 * resolve 200 rather than 301.
 */
export const navigation = [
  { href: '/', label: 'Home', inNav: false, inSitemap: true, priority: 1.0 },
  { href: '/onze-services/', label: 'Onze Services', inNav: true, inSitemap: true, priority: 0.9 },
  { href: '/tarieven/', label: 'Tarieven', inNav: true, inSitemap: true, priority: 0.9 },
  // The trust page. In the nav under a short label — the slug is the long-tail
  // query ("waarom lang parkeren schiphol") and the label is what fits a header.
  {
    href: '/waarom-lang-parkeren-schiphol/',
    label: 'Waarom ons',
    inNav: true,
    inSitemap: true,
    priority: 0.8,
  },
  // Slug and label deliberately differ: /samenwerken/ ranks, "Reisbureaus" is
  // what the audience calls itself. Do not "fix" this to match.
  { href: '/samenwerken/', label: 'Reisbureaus', inNav: true, inSitemap: true, priority: 0.6 },
  { href: '/contact/', label: 'Contact', inNav: true, inSitemap: true, priority: 0.7 },
  { href: '/reservering/', label: 'Reserveren', inNav: false, inSitemap: true, priority: 0.8 },
  // Kept OUT of the main nav on purpose. Six items plus a phone number plus the
  // booking button is already the most a header can carry before it stops being
  // scannable; these two are reached from the footer, from the testimonials
  // block and from the trust page, which is enough for both crawlers and
  // customers.
  { href: '/reviews/', label: 'Reviews', inNav: false, inSitemap: true, priority: 0.6 },
  { href: '/login/', label: 'Inloggen', inNav: false, inSitemap: true, priority: 0.5 },
  // Footer-only, and the lowest priority in the sitemap: it must be indexable —
  // a trader's terms that a search engine cannot find are not "readily
  // available" in the sense the distance-selling rules mean — but it should
  // never outrank a page that sells something.
  {
    href: '/algemene-voorwaarden/',
    label: 'Algemene voorwaarden',
    inNav: false,
    inSitemap: true,
    priority: 0.3,
  },
] as const;

export type NavItem = (typeof navigation)[number];

/** Nav items rendered in the header/mobile menu. */
export const mainNav = navigation.filter((item) => item.inNav);

/**
 * Footer link groups. The service anchors point at /onze-services/#valet and
 * #Shuttle — the capital S is intentional and matches the live anchor, so
 * existing footer backlinks keep resolving.
 */
export const footerNav = {
  diensten: [
    { href: '/onze-services/#valet', label: 'Valet Parkeren' },
    { href: '/onze-services/#Shuttle', label: 'Shuttle Parkeren' },
    { href: '/tarieven/', label: 'Tarieven' },
    { href: '/reservering/', label: 'Reserveren' },
  ],
  bedrijf: [
    { href: '/waarom-lang-parkeren-schiphol/', label: 'Waarom ons' },
    { href: '/reviews/', label: 'Ervaringen' },
    { href: '/samenwerken/', label: 'Reisbureaus' },
    { href: '/contact/', label: 'Contact' },
  ],
  account: [{ href: '/login/', label: 'Klantenportaal' }],
} as const;

/**
 * Every payment method the checkout accepts. Client's own list, 31 July 2026.
 *
 * ── Why this is here and not in the footer ──────────────────────────────────
 * It was in three places and all three disagreed: the footer advertised "iDEAL,
 * Visa, Mastercard, Bancontact", the LocalBusiness schema claimed "iDEAL,
 * Creditcard, Bancontact", and /reservering/ told the visitor they could pay by
 * "iDEAL, creditcard of Bancontact". None of them mentioned Apple Pay, Google
 * Pay, Klarna, PayPal or the two Belgian bank buttons, and the footer named two
 * card schemes the client does not list separately. Every one of those is a
 * promise made at the point a visitor decides whether to start a booking, so
 * they now read from one array.
 *
 * Names are as the schemes themselves write them, Dutch where the scheme has a
 * Dutch name. Order is the client's, which runs roughly by how Dutch and Belgian
 * customers actually pay rather than alphabetically.
 *
 * TODO(client): the checkout is ParkingPro's, so what a customer is actually
 * offered is whatever your PSP has switched on in THEIR back office. If any of
 * these is off there, the footer is promising something the payment screen will
 * not show, which is the worst place to be caught out. Worth one test booking.
 */
export const paymentMethods = [
  'iDEAL',
  'Creditcard',
  'Apple Pay',
  'Google Pay',
  'PayPal',
  'Klarna',
  'Bancontact',
  'KBC/CBC-betaalknop',
  'Belfius-betaalknop',
] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

/**
 * The terms. Now hosted here rather than on valetparkingschiphol.nl.
 *
 * They used to be a cross-domain link, which cost a little trust at exactly the
 * moment a visitor is checking whether the company is real, and leaked the link
 * equity of the one page every other page links to. The client supplied the
 * document, so it lives on this domain — see src/content/algemene-voorwaarden.ts.
 *
 * Still exported as a constant rather than inlined at each call site: this is
 * the single place to change if the terms ever move again, and every link to
 * them already reads from here.
 *
 * TODO(client): 301 the old valetparkingschiphol.nl/algemene-voorwaarden/ to
 * this URL. Same slug, so it is a one-line redirect, and it keeps whatever
 * inbound links the old page has.
 */
export const termsUrl = '/algemene-voorwaarden/';

/**
 * ── THE 4,7/5 IS GONE, AND THAT IS DELIBERATE ────────────────────────────────
 *
 * The live site publishes "4,7 / 5" in the hero, in the footer and above the
 * testimonials, and there is no source for it anywhere: no Google Business
 * Profile, no Trustpilot, no review platform, no count of what it averages.
 *
 * Handover 1 kept it as plain text on the reasoning that unmarked-up text is not
 * a rich-result risk. That reasoning was too narrow. Google's spam policies do
 * not only cover structured data — an unverifiable rating shown as a fact is a
 * misleading-content problem in its own right, and under the EU Omnibus
 * directive (implemented in Dutch law since 2022) publishing an average review
 * score without stating whether and how the reviews are verified is an unfair
 * commercial practice. The fine is calculated on turnover.
 *
 * So it is removed sitewide until there is a source. What replaces it in each
 * place is a claim that is true and checkable: fifteen years, thousands of
 * travellers, and three named testimonials on /reviews/ presented as what they
 * are.
 *
 * TODO(client): his WordPress has Trustindex.io AND a Google Reviews plugin
 * installed, which suggests the 4,7 was real and simply lost its provenance.
 * If Trustindex is connected to a live Google Business Profile, the score goes
 * back everywhere — with AggregateRating markup and a link to the reviews it
 * averages, which is worth considerably more than the bare number was.
 *
 * The switch itself lives in src/content/reviews.ts, next to the reviews it
 * governs, so turning the score back on is one edit in one file rather than a
 * flag here and a list there that can disagree.
 */

/**
 * The klantenportaal discount, stated once so the pages that surface it cannot
 * disagree about the figure. Taken verbatim from the live /login/ copy:
 * "Exclusieve 10% klantenkorting op iedere reservering".
 */
export const accountDiscount = { percentage: 10 } as const;

/**
 * The seasonal promotion, client's brief of 2026-08-06: August is a weak month
 * and he wants a reason to decide now rather than later.
 *
 * ── The end date is enforced, not just printed ──────────────────────────────
 * `endsAt` is the first instant the code is NO LONGER valid, written with an
 * explicit +02:00 because that is what the Netherlands is on in August. A
 * server rendering in UTC would otherwise keep the coupon up for two hours into
 * 1 September — small, but the failure mode is a customer typing a dead code at
 * the payment step and calling to complain, which costs more than the booking.
 *
 * The homepage is statically rendered with `revalidate: 3600`, so the coupon
 * disappears within an hour of expiry without a deploy. If it ever needs to go
 * sooner than that, change the date here and redeploy.
 *
 * ── Spelling ────────────────────────────────────────────────────────────────
 * "kortingscode", with the s. The client corrected this himself on 2026-08-06
 * and the mock-up he sent has it wrong, so it is stated once here rather than
 * retyped per component.
 */
export const promo = {
  /** Displayed uppercase; ParkingPro should be configured case-insensitively. */
  code: 'ZOMER10',
  percentage: 10,
  /** Exclusive upper bound. Europe/Amsterdam is UTC+2 in August. */
  endsAt: '2026-09-01T00:00:00+02:00',
  /** Human form of the same date, for the deadline line. */
  validUntil: 't/m 31 augustus',
} as const;

/**
 * Whether the promotion is still running.
 *
 * Call this on the SERVER and pass the result down. Evaluating it inside a
 * client component would compare the visitor's own clock against the one the
 * HTML was built with, and React would flag the mismatch on the last day —
 * exactly when the coupon matters most.
 */
export function isPromoActive(now: number = Date.now()): boolean {
  return now < Date.parse(promo.endsAt);
}

/**
 * Independence disclaimer.
 *
 * The whole design resolves ambiguity towards "airport infrastructure" because
 * that is what the client asked for and what his domain is worth. This line is
 * the counterweight, and it is not optional: it states plainly that the business
 * is not part of Royal Schiphol Group, which is what keeps evoking the category
 * on the right side of a trademark challenge. Competitors on this keyword carry
 * the same sentence.
 *
 * TODO(client): confirm this exact wording — it is a legal statement about your
 * own business and you should be comfortable with every word of it.
 */
export const independenceDisclaimer =
  'Lang Parkeren Schiphol is een onafhankelijke parkeerservice en is niet gelieerd aan Royal Schiphol Group.';
