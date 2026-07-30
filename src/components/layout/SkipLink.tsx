/**
 * Bypass block (WCAG 2.4.1). Visually hidden until focused, then it lands as a
 * real, visible control in the top-left — a keyboard user's first Tab on any
 * page should be a way past the header and marquee.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-accent text-on-accent shadow-lifted sr-only rounded-full px-5 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
    >
      Direct naar de inhoud
    </a>
  );
}
