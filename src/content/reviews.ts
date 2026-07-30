/**
 * Reviews — the one module to edit when the rating question is answered.
 *
 * ── The question ───────────────────────────────────────────────────────────
 * The old site published "4,7 / 5" in three places with no source. Handover 3
 * removed it, because an average score nobody can check is a Google
 * manual-action risk and, since the EU Omnibus rules, an unfair commercial
 * practice under Dutch law with a turnover-based fine.
 *
 * That removal now looks likely to be reversible. The client's WordPress has
 * BOTH Trustindex.io and a Google Reviews plugin installed, which strongly
 * suggests the 4,7 was pulled from a real Google Business Profile and simply
 * lost its provenance somewhere between the plugin and the page.
 *
 * If it is real, it should go back — with its source named, with proper
 * AggregateRating markup, and with the actual Google reviews replacing the
 * three unattributed testimonials. That turns the weakest page on the site into
 * the strongest, and it is the trust signal the client keeps asking for.
 *
 * ── How to turn it back on ─────────────────────────────────────────────────
 * Everything hangs off `reviewSource` below. Set `verified: true`, fill in the
 * platform, the public URL, the score and the count, paste the real reviews
 * into `reviews`, and the site does the rest:
 *
 *   · /reviews/ shows the score, names the platform and links to it
 *   · AggregateRating is emitted — legitimately, because it is now verifiable
 *   · the homepage testimonials block shows the score again
 *
 * Nothing else needs editing. Until then every one of those is off, and the
 * pages read as though the score never existed rather than as though something
 * is missing.
 *
 * DO NOT set `verified: true` against a score that cannot be reached by
 * clicking `url` in a logged-out browser. That is the whole point of the flag.
 */

export type ReviewPlatform = 'google' | 'trustpilot' | 'trustindex';

export type ReviewSource =
  | { verified: false }
  | {
      verified: true;
      platform: ReviewPlatform;
      /** Public, logged-out-readable page listing the reviews being averaged. */
      url: string;
      /** e.g. 4.7 — a number, not a string, so the schema can emit it as one. */
      score: number;
      best: number;
      /** How many reviews the score averages. Required by AggregateRating. */
      count: number;
      /** Shown to the reader: "Google Bedrijfsprofiel", "Trustpilot". */
      label: string;
    };

/**
 * TODO(client): see the handover. If Trustindex is connected to a live Google
 * Business Profile, send the link and this becomes:
 *
 *   export const reviewSource: ReviewSource = {
 *     verified: true,
 *     platform: 'google',
 *     url: 'https://www.google.com/maps/place/…',
 *     score: 4.7,
 *     best: 5,
 *     count: 214,
 *     label: 'Google Bedrijfsprofiel',
 *   };
 */
export const reviewSource: ReviewSource = { verified: false };

export type Review = {
  quote: string;
  name: string;
  /** Where the reviewer is coming from, in our own words. */
  role: string;
  /** Set only for reviews carried over from a real platform. */
  rating?: number;
  /** ISO date, when the platform gives one. */
  date?: string;
};

/**
 * The three testimonials carried over verbatim from the live site.
 *
 * They are first-party and unattributed beyond a first name, which is exactly
 * how both pages present them: three named people, no score, no count, no claim
 * about how many others there are.
 *
 * What is NOT emitted for these, on any page:
 *   · AggregateRating — nothing verifiable to average
 *   · Review markup   — Google does not grant review rich results for reviews a
 *                       business publishes about itself, and asking anyway is
 *                       how domains collect manual actions
 *   · star rows       — five stars beside a quote is a per-review score, and no
 *                       per-review score was ever collected
 *
 * When `reviewSource.verified` flips, replace these with the real ones and set
 * `rating` and `date` from the platform.
 */
export const reviews: readonly Review[] = [
  {
    quote:
      'Top service! Auto netjes afgegeven en bij terugkomst stond hij binnen 5 minuten weer klaar voor de vertrekhal. Vriendelijk personeel en heel snel geregeld.',
    name: 'Mark v.D.',
    role: 'Schiphol reiziger',
  },
  {
    quote:
      'Eerste keer valet parkeren via deze dienst en het is uitstekend bevallen. Duidelijke communicatie vooraf en geen gedoe met pendelbussen. Zeker voor herhaling vatbaar!',
    name: 'Sandra & Peter',
    role: 'Vakantiegangers',
  },
  {
    quote:
      'Snel, betrouwbaar en scherp geprijsd. Auto stond veilig geparkeerd en de sleuteloverdracht verliep heel soepel. Aanrader voor wie zorgeloos wil reizen.',
    name: 'K. de Jong',
    role: 'Zakelijke reiziger',
  },
];

/** Dutch decimal comma — "4,7", never "4.7". */
export function formatScore(score: number): string {
  return score.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
