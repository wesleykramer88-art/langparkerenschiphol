/**
 * The contact form's subject list.
 *
 * ── Why this is its own file ────────────────────────────────────────────────
 * It is needed in two places that cannot share a module: the zod schema in
 * app/(site)/contact/actions.ts, which is `'use server'` and may therefore only
 * export async functions, and <ContactForm>, which is `'use client'`. Declaring
 * it in either one would mean retyping it in the other, and a select whose
 * options do not match the enum that validates them fails on submit for exactly
 * one option — the kind of bug that ships.
 *
 * The nine values are the client's own, from his contact document (August 2026),
 * in his order. They are stored as the Dutch strings rather than as slugs
 * because they are what lands in the e-mail subject line in his inbox; a slug
 * would need a lookup table on the server to become readable again, and the
 * lookup table is this array.
 */
export const CONTACT_SUBJECTS = [
  'Bestaande reservering',
  'Reservering wijzigen',
  'Annuleren',
  'Betaling of factuur',
  'Valet parking',
  'Shuttle parkeren',
  'Schade of melding',
  'Zakelijk / samenwerken',
  'Overige vraag',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
