import localFont from 'next/font/local';

/**
 * Typeface candidates for the client's pending decision.
 *
 * These live HERE, in the design-system route, and not in src/lib/fonts.ts on
 * purpose. next/font emits an @font-face block for every localFont() call in a
 * module, and fonts.ts is imported by the root layout — so declaring the
 * candidates there put four unused @font-face rules into the CSS of every public
 * page. No font bytes were downloaded (an unused @font-face is lazy), but the
 * declarations do not belong on a page that will never use them.
 *
 * Keeping them in a module only this route imports means the candidate CSS ships
 * with /design-system/ and nowhere else.
 *
 * DELETE THIS FILE, the unused .woff2 files, and the design-system route once
 * the client has chosen a typeface.
 */

const interCandidate = localFont({
  src: '../../fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-candidate-inter',
  preload: false,
  adjustFontFallback: 'Arial',
});

const manropeCandidate = localFont({
  src: '../../fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-candidate-manrope',
  preload: false,
  adjustFontFallback: 'Arial',
});

const jakartaCandidate = localFont({
  src: '../../fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-candidate-jakarta',
  preload: false,
  adjustFontFallback: 'Arial',
});

const figtreeCandidate = localFont({
  src: '../../fonts/figtree-latin-wght-normal.woff2',
  weight: '300 900',
  display: 'swap',
  variable: '--font-candidate-figtree',
  preload: false,
  adjustFontFallback: 'Arial',
});

export type FontCandidate = {
  /** Stable key, also used to name the .woff2 file in the handover snippet. */
  id: string;
  name: string;
  /** One line on why this face is a plausible answer, in the client's terms. */
  note: string;
  /** Variable weight axis range, for copying into brandSans on selection. */
  axis: string;
  /** The CSS custom property this candidate's family is bound to. */
  cssVar: string;
  /** next/font class that declares the @font-face and the variable. */
  variableClass: string;
};

export const FONT_CANDIDATES: readonly FontCandidate[] = [
  {
    id: 'figtree',
    name: 'Figtree',
    note: 'Zacht humanistisch. Blijft goed leesbaar op kleine formaten zoals prijsregels en formulierlabels.',
    axis: '300 900',
    cssVar: '--font-candidate-figtree',
    variableClass: figtreeCandidate.variable,
  },
  {
    id: 'manrope',
    name: 'Manrope',
    note: 'Geometrisch met een warme inslag. Krachtig in grote koppen, iets eigenzinniger van karakter.',
    axis: '200 800',
    cssVar: '--font-candidate-manrope',
    variableClass: manropeCandidate.variable,
  },
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    note: 'Vriendelijk en open. Veel gebruikt op moderne Nederlandse sites, dus vertrouwd voor uw bezoeker.',
    axis: '200 800',
    cssVar: '--font-candidate-jakarta',
    variableClass: jakartaCandidate.variable,
  },
  {
    id: 'inter',
    name: 'Inter',
    note: 'De neutrale standaard. Verdwijnt naar de achtergrond — veilig, maar zonder eigen karakter.',
    axis: '100 900',
    cssVar: '--font-candidate-inter',
    variableClass: interCandidate.variable,
  },
] as const;

/** Every candidate variable class, applied once to the design-system wrapper. */
export const candidateVariables = FONT_CANDIDATES.map((f) => f.variableClass).join(' ');
