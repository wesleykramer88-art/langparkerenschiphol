import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

/**
 * The public site shell: header, footer and the main landmark.
 *
 * /design-system/ sits outside this group deliberately — it is an internal tool
 * and should not carry the marketing chrome.
 *
 * `#main` is the skip link's target. tabIndex={-1} makes it focusable
 * programmatically so the skip actually moves focus, not just the scroll
 * position — without it, the next Tab returns to the header and the link does
 * nothing for keyboard users.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
