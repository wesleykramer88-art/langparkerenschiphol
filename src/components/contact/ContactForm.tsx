'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Mail, Phone, TriangleAlert } from 'lucide-react';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { sendContactMessage, type ContactResult } from '@/app/(site)/contact/actions';
import { siteConfig } from '@/config/site';

/**
 * The contact form.
 *
 * Validation runs on the client for the visitor's benefit and again in the
 * server action as the actual control — the schema below mirrors the one in
 * actions.ts, which is the price of keeping the action's input typed without
 * shipping the server module's dependencies to the browser.
 *
 * ── The four states, and why the third one exists ───────────────────────────
 *   idle          the form
 *   sent          a confirmation, replacing the form
 *   unconfigured  the message could not be forwarded because no destination is
 *                 configured yet — so the visitor is handed a prefilled e-mail
 *                 link containing everything they just typed, plus the phone
 *                 number. Nothing they wrote is lost, and nothing is claimed.
 *   error         the destination exists but did not accept it. Same fallback.
 *
 * That third state is the whole reason this component is not thirty lines
 * shorter. See the note at the top of actions.ts: a form that swallows messages
 * is worse than no form, and this site currently has nowhere to deliver them.
 *
 * `mailto:` is built from the visitor's own input, so the fallback is one tap
 * rather than "sorry, try again somewhere else".
 */

const schema = z.object({
  name: z.string().trim().min(2, 'Vul uw naam in.').max(120, 'Deze naam is te lang.'),
  email: z.email('Vul een geldig e-mailadres in.').max(180),
  phone: z.string().trim().max(40, 'Dit telefoonnummer is te lang.').optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Vertel ons kort waar het over gaat (minimaal 10 tekens).')
    .max(4000, 'Dit bericht is te lang. Mail ons gerust rechtstreeks.'),
  company: z.string().max(0).optional(),
});

type Values = z.infer<typeof schema>;

function mailtoHref(values: Values) {
  const body = [
    values.message,
    '',
    '—',
    values.name,
    values.phone ? `Telefoon: ${values.phone}` : null,
    values.email,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const params = new URLSearchParams({
    subject: `Vraag via de website — ${values.name}`,
    body,
  });

  return `mailto:${siteConfig.email}?${params.toString()}`;
}

export function ContactForm() {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [submitted, setSubmitted] = useState<Values | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    // Validate on blur rather than on every keystroke: an error appearing under
    // a field the visitor is still typing into reads as being told off.
    mode: 'onBlur',
  });

  const onSubmit = (values: Values) => {
    setSubmitted(values);
    startTransition(async () => {
      setResult(await sendContactMessage(values));
    });
  };

  if (result?.status === 'sent') {
    return (
      <div
        // Focusable and announced, so a keyboard or screen-reader user is told
        // the form is gone and what replaced it.
        role="status"
        tabIndex={-1}
        className="border-line bg-surface rounded-xl border p-7 sm:p-9"
      >
        <span className="bg-accent-wash text-accent-hover grid size-11 place-items-center rounded-full">
          <Check className="size-5" strokeWidth={2.5} aria-hidden />
        </span>
        <h3 className="text-display-sm text-heading mt-5">Bedankt voor uw bericht</h3>
        <p className="text-muted mt-3 max-w-[42ch] leading-relaxed">
          Wij hebben uw bericht ontvangen en reageren doorgaans binnen 1 uur. Is het dringend? Bel
          ons gerust op{' '}
          <a
            href={siteConfig.phone.href}
            className="numeric text-brand decoration-navy-300 hover:decoration-navy-600 underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const failed = result?.status === 'unconfigured' || result?.status === 'error';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {failed && submitted ? (
        <div
          role="alert"
          className="border-valet-300 bg-valet-50 text-body flex flex-col gap-3 rounded-xl border p-5"
        >
          <p className="text-heading flex items-center gap-2.5 text-sm font-semibold">
            <TriangleAlert className="text-accent-hover size-4 shrink-0" aria-hidden />
            Versturen is niet gelukt
          </p>
          <p className="text-sm leading-relaxed">
            Uw bericht is niet verzonden. Wij hebben het niet ontvangen — stuur het rechtstreeks per
            e-mail of bel ons. Uw tekst staat al klaar in de e-mail.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Button href={mailtoHref(submitted)} variant="outline" size="sm">
              <Mail className="size-4" aria-hidden />
              Mail uw bericht
            </Button>
            <Button href={siteConfig.phone.href} variant="outline" size="sm">
              <Phone className="size-4" aria-hidden />
              <span className="sr-only">Bel ons: </span>
              <span className="numeric">{siteConfig.phone.display}</span>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Naam" error={errors.name?.message} required>
          {(props) => <Input {...props} {...register('name')} autoComplete="name" />}
        </Field>

        <Field label="E-mail" error={errors.email?.message} required>
          {(props) => <Input {...props} {...register('email')} type="email" autoComplete="email" />}
        </Field>
      </div>

      <Field
        label="Telefoonnummer"
        hint="Optioneel — handig als wij u liever even bellen."
        error={errors.phone?.message}
      >
        {(props) => <Input {...props} {...register('phone')} type="tel" autoComplete="tel" />}
      </Field>

      <Field label="Bericht" error={errors.message?.message} required>
        {(props) => (
          <Textarea
            {...props}
            {...register('message')}
            placeholder="Waar kunnen wij u mee helpen? Vermeld bij een bestaande reservering uw reserveringsnummer."
          />
        )}
      </Field>

      {/* Honeypot. Not `display: none` — some bots skip hidden fields, and some
          browsers refuse to focus them, which would break the tab order in a
          way that is hard to see. Positioned off-screen, aria-hidden, and
          tabIndex -1 so it is unreachable by keyboard. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-company">Bedrijf</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Bezig met versturen…' : 'Stuur bericht'}
        </Button>
        <p className="text-muted text-sm">Doorgaans reageren wij binnen 1 uur.</p>
      </div>
    </form>
  );
}
