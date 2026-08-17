'use server';

import { z } from 'zod';
import { siteConfig } from '@/config/site';
import { CONTACT_SUBJECTS } from '@/config/contact';

/**
 * The contact form's submit seam.
 *
 * ── Three delivery paths, tried in order ───────────────────────────────────
 *
 *  1. RESEND_API_KEY set    → the message is e-mailed to the canonical address
 *                             via Resend's REST API. This is the intended
 *                             production path.
 *  2. CONTACT_FORWARD_URL   → POSTed as JSON to any endpoint that accepts one:
 *                             a Zapier or Make webhook, a Formspree endpoint, a
 *                             script on the client's own hosting. Kept because
 *                             it needs no domain verification and no account.
 *  3. neither set           → `unconfigured`. The form then shows the visitor a
 *                             prefilled e-mail link containing everything they
 *                             typed, plus the phone number.
 *
 * ── What must NEVER happen ─────────────────────────────────────────────────
 * Accepting the submission, returning "bedankt, wij nemen contact op" and
 * dropping it. A contact form that silently discards messages is worse than no
 * contact form: the visitor believes they have reached somebody and stops
 * trying, the business never learns it lost the booking, and the failure is
 * invisible for months. Path 3 exists so that the honest outcome is also the
 * default outcome.
 *
 * ── Why the SDK is not installed ───────────────────────────────────────────
 * Resend's API is one POST with a JSON body. The official SDK adds a dependency
 * and a version to keep current in exchange for wrapping `fetch`. If a second
 * provider is ever needed, `sendViaResend` is the only function to duplicate.
 *
 * ── Environment ────────────────────────────────────────────────────────────
 *   RESEND_API_KEY        server-only. NEVER NEXT_PUBLIC_ — an e-mail API key in
 *                         the client bundle is an open relay for anyone who
 *                         views source, and the bill and the domain reputation
 *                         are the client's.
 *   CONTACT_FROM          the From address. Its DOMAIN must be verified in
 *                         Resend or the API rejects the send. Defaults to
 *                         website@<the site's own domain>.
 *   CONTACT_TO            where messages land. Defaults to the canonical
 *                         address in config/site.ts.
 *   CONTACT_FORWARD_URL   the webhook alternative to Resend.
 */

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Vul uw naam in.').max(120, 'Deze naam is te lang.'),
  email: z.email('Vul een geldig e-mailadres in.').max(180),
  /**
   * ── The phone field became the reservation number, August 2026 ─────────────
   * The client's contact document replaces it, and the reasoning is his own
   * page: the phone line is now stated to be for the day of arrival and
   * departure only, so a form that asks for a number nobody will ring is asking
   * the visitor for data to no purpose. What his page asks for instead, four
   * separate times, is the reserveringsnummer — because that is what lets him
   * find the booking before he replies.
   *
   * Optional, like the phone field it replaces: somebody asking a question
   * before they book has no number to give.
   */
  reservationNumber: z
    .string()
    .trim()
    .max(60, 'Dit reserveringsnummer is te lang.')
    .optional()
    .or(z.literal('')),
  /**
   * Required, and validated against the list rather than as free text: it goes
   * into the subject line of the e-mail, and an arbitrary string there is a
   * header-injection surface as well as a triage problem.
   */
  subject: z.enum(CONTACT_SUBJECTS, { message: 'Kies een onderwerp.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Vertel ons kort waar het over gaat (minimaal 10 tekens).')
    .max(4000, 'Dit bericht is te lang. Mail ons gerust rechtstreeks.'),
  /**
   * Honeypot. Hidden from sight and from assistive technology, and never
   * focusable — a real visitor cannot fill it in, so anything that arrives with
   * it filled is a bot. Silently accepted rather than rejected, because an
   * error message tells the bot what to change.
   */
  company: z.string().max(0).optional().or(z.literal('')),
});

export type ContactValues = z.infer<typeof contactSchema>;

export type ContactResult =
  | { status: 'sent' }
  | { status: 'unconfigured' }
  | { status: 'invalid'; errors: Partial<Record<keyof ContactValues, string>> }
  | { status: 'error' };

type Payload = {
  name: string;
  email: string;
  reservationNumber: string | null;
  subject: string;
  message: string;
};

/** Escape anything the visitor typed before it goes into an HTML e-mail body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendViaResend(apiKey: string, payload: Payload): Promise<boolean> {
  const siteDomain = siteConfig.email.split('@')[1];
  const from = process.env.CONTACT_FROM ?? `website@${siteDomain}`;
  const to = process.env.CONTACT_TO ?? siteConfig.email;

  const lines = [
    `Naam: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Onderwerp: ${payload.subject}`,
    payload.reservationNumber ? `Reserveringsnummer: ${payload.reservationNumber}` : null,
    '',
    payload.message,
  ].filter((line) => line !== null);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Lang Parkeren Schiphol <${from}>`,
        to: [to],
        // The single most useful line in this file: hitting Reply in the
        // client's inbox answers the customer directly, rather than answering
        // the website. Without it every reply has to be copy-pasted.
        reply_to: payload.email,
        // The chosen subject leads, so the inbox sorts by what the message is
        // about rather than by who sent it. Safe to interpolate into a header:
        // it is one of nine fixed strings from the enum, not visitor text.
        subject: `Websiteformulier: ${payload.subject} — ${payload.name}`,
        text: lines.join('\n'),
        html: `<pre style="font:14px/1.6 -apple-system,system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(
          lines.join('\n'),
        )}</pre>`,
      }),
      // A hanging provider must not hold the request open until the platform
      // kills it; the visitor gets the fallback instead, which still works.
      signal: AbortSignal.timeout(8000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function sendViaWebhook(endpoint: string, payload: Payload): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        source: 'langparkerenschiphol.nl/contact/',
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function sendContactMessage(values: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    // Re-validated on the server even though the client validates with the same
    // schema: the client check is a courtesy to the visitor, not a control.
    const errors: Partial<Record<keyof ContactValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactValues | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { status: 'invalid', errors };
  }

  // Bot. Report success so it does not retry with a different shape.
  if (parsed.data.company) return { status: 'sent' };

  const payload: Payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    reservationNumber: parsed.data.reservationNumber || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    return (await sendViaResend(apiKey, payload)) ? { status: 'sent' } : { status: 'error' };
  }

  const endpoint = process.env.CONTACT_FORWARD_URL;
  if (endpoint) {
    return (await sendViaWebhook(endpoint, payload)) ? { status: 'sent' } : { status: 'error' };
  }

  return { status: 'unconfigured' };
}
