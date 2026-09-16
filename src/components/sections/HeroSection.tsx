'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroPhoto } from '@/components/ui/HeroPhoto';
import { BookingPicker } from '@/components/booking/BookingPicker';
import { PromoCoupon } from '@/components/sections/PromoCoupon';
import type { PickerBounds } from '@/lib/parkingpro-config';

const EASE = [0.16, 1, 0.3, 1] as const;
const HEADLINE_LINES = ['Lang Parkeren', 'op Schiphol'] as const;
const PROOF = [
  'Op 5 tot 8 minuten van Schiphol',
  'Sleutels mee op reis bij Shuttle',
  '24/7 camerabewaking en monitoring',
] as const;

/**
 * One semantic hero for every screen size.
 *
 * The booking form and sales copy are each rendered exactly once. CSS changes
 * their order and proportions between mobile and desktop; search engines and
 * assistive technology no longer receive two competing versions of the hero.
 */
export function HeroSection({
  bounds,
  showPromo = false,
}: {
  bounds?: PickerBounds;
  showPromo?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  const rise = (delay: number) =>
    prefersReduced
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <section className="bg-surface relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <HeroPhoto
          name="crewShuttleTerminal"
          portraitName="crewShuttleTerminalPortrait"
          className="absolute inset-0 h-full w-full"
          imageClassName="photo-drift object-cover object-[center_52%] opacity-75 md:object-[center_55%] md:opacity-70 lg:object-[center_45%] lg:opacity-100"
        />
        {/* On mobile the booking card stays visually white, while the middle of
            the hero reveals the Schiphol photograph. The stronger white at the
            top and bottom protects form and text contrast and creates a smooth
            transition back into the page. */}
        <div className="absolute inset-0 bg-linear-to-b from-white/98 via-white/35 to-white/90 lg:hidden" />
        <div className="absolute inset-0 bg-linear-to-r from-white/65 via-white/15 to-white/45 lg:hidden" />
        <div className="scrim-hero absolute inset-0 hidden lg:block" />
      </div>

      <Container className="relative">
        <div className="grid gap-12 pt-3 pb-16 md:gap-16 md:py-16 lg:min-h-[min(80vh,800px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:py-20">
          <motion.div
            initial={
              prefersReduced
                ? { opacity: 1, x: 0, y: 0, rotate: 0 }
                : { opacity: 0, x: 18, y: 14, rotate: -1 }
            }
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={
              prefersReduced ? { duration: 0 } : { duration: 0.7, delay: 0.45, ease: EASE }
            }
            id="hero-booking"
            className="relative z-10 order-1 w-full lg:order-2 lg:-mb-32"
          >
            <BookingPicker notch="surface" bounds={bounds} headingLevel="h2" />
          </motion.div>

          <div className="relative z-10 order-2 flex flex-col items-start lg:order-1">
            <motion.div {...rise(0)} className="hidden items-center gap-3 md:flex">
              <span aria-hidden className="bg-valet-400 size-2 shrink-0 rotate-45 rounded-xs" />
              <p className="eyebrow text-brand">Premium shuttle- en valetparkeren bij Schiphol</p>
            </motion.div>

            <h1 className="text-display-xl text-heading md:text-display-2xl md:mt-7">
              {HEADLINE_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={prefersReduced ? { y: '0%' } : { y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.6, delay: 0.07 + index * 0.09, ease: EASE }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p {...rise(0.3)} className="text-display-sm text-brand mt-3 md:text-display-md md:mt-4">
              Uw auto veilig. U zorgeloos op reis.
            </motion.p>

            <motion.p
              {...rise(0.38)}
              className="text-body mt-5 max-w-[46ch] text-base leading-relaxed md:mt-7 md:text-lg"
            >
              Kies Shuttle als u zelf parkeert en uw sleutels meeneemt, of Valet voor een snelle
              overdracht direct bij de vertrekhal. Beide opties bieden een bewaakte parkeerlocatie
              en een duidelijke reservering vooraf.
            </motion.p>

            <motion.ul
              {...rise(0.46)}
              className="border-line mt-6 grid w-full max-w-lg gap-3 border-t pt-5 md:mt-9 md:grid-cols-3 md:gap-x-5 md:pt-6"
            >
              {PROOF.map((item) => (
                <li key={item} className="text-body flex items-start gap-2.5">
                  <Check
                    className="text-valet-400 mt-0.5 size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span className="text-sm leading-snug">{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              {...rise(0.54)}
              className="mt-7 flex w-full flex-wrap items-center gap-3 md:mt-9"
            >
              <Button href="/reservering/" size="lg" className="w-full sm:w-auto">
                Reserveer nu
                <ArrowRight data-arrow className="size-4" aria-hidden />
              </Button>
              <Button href="#diensten" variant="outline" size="lg" className="w-full sm:w-auto">
                Vergelijk Shuttle en Valet
              </Button>
            </motion.div>

            <motion.p {...rise(0.62)} className="text-muted mt-5 text-sm">
              Online reserveren met directe bevestiging
            </motion.p>

            {showPromo ? (
              <motion.div {...rise(0.7)} className="mt-6">
                <PromoCoupon />
              </motion.div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
