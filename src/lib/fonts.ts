import localFont from 'next/font/local';

/**
 * Typography loading.
 *
 * Fonts are SELF-HOSTED, not loaded from next/font/google. Requesting from
 * fonts.gstatic.com transmits every Dutch visitor's IP address to Google on page
 * load, which EU courts have treated as a GDPR violation (LG München, 3 O
 * 17493/20). This is a purely NL-facing site, so there is no upside to accepting
 * that exposure. Self-hosting also removes a third-party DNS lookup and TLS
 * handshake from the LCP critical path.
 *
 * The .woff2 files in src/fonts/ were extracted from the @fontsource-variable/*
 * npm packages (all OFL-1.1 licensed — see src/fonts/README.md for provenance).
 * The packages themselves are no longer dependencies; only the vendored files
 * remain, so nothing is fetched at runtime.
 *
 * ---------------------------------------------------------------------------
 * TO CHANGE THE SITE'S TYPEFACE: edit the `src` on ONE line in `brandSans`
 * below. Nothing else in the app — no component, no CSS — names a typeface.
 * ---------------------------------------------------------------------------
 */

/* ==========================================================================
   ACTIVE FACES
   These ship on every route and are the only ones preloaded.
   ========================================================================== */

/**
 * The active body + display face.
 *
 * Currently: Figtree. Chosen as the starting point because the client has
 * rejected Space Grotesk (geometric, quirky), IBM Plex Sans (technical) and
 * Roboto (the Android system default) — a pattern that reads as "warmer, less
 * engineered". Figtree is humanist and stays legible at the small sizes this
 * site leans on (price rows, form labels, the reassurance strip).
 *
 * This is a starting point, not a decision. See /design-system/, which renders
 * the client's own Dutch copy in all four candidates with a live switcher.
 * The candidate faces are declared in src/app/design-system/candidates.ts, so
 * their @font-face rules never reach a public page.
 *
 * ONE-LINE SWITCH: change `src` to any file in src/fonts/ and update `weight`
 * to that face's variable axis range. /design-system/ prints the exact two
 * values to paste for whichever face is selected.
 */
export const brandSans = localFont({
  src: '../fonts/figtree-latin-wght-normal.woff2',
  weight: '300 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-brand-sans',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
  // Generates a size-adjusted @font-face for the fallback so the swap from
  // fallback to webfont does not shift layout. This is what keeps CLS < 0.05.
  adjustFontFallback: 'Arial',
});

/**
 * Times, prices, durations and booking references only — never body copy.
 * Tabular figures make a price column align like a departure board, which is the
 * whole reason this face is here.
 */
export const brandMono = localFont({
  src: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-brand-mono',
  preload: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  adjustFontFallback: false,
});

/** Applied to <html> in the root layout. */
export const fontVariables = `${brandSans.variable} ${brandMono.variable}`;
