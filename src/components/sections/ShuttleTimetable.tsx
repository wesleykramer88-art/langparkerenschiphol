import { BusFront, CarFront, Plane } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

type DepartureGroup = {
  hour: string;
  times: readonly string[];
};

const TO_SCHIPHOL: readonly DepartureGroup[] = [
  { hour: '03:00', times: ['03:45'] },
  { hour: '04:00', times: ['04:05', '04:25', '04:45'] },
  { hour: '05:00', times: ['05:05', '05:25', '05:45'] },
  { hour: '06:00', times: ['06:05', '06:25', '06:45'] },
  { hour: '07:00', times: ['07:05', '07:25', '07:45'] },
  { hour: '08:00', times: ['08:05', '08:25', '08:45'] },
  { hour: '09:00', times: ['09:05', '09:25', '09:45'] },
  { hour: '10:00', times: ['10:05', '10:25', '10:45'] },
  { hour: '11:00', times: ['11:05', '11:25'] },
  { hour: '17:00', times: ['17:50'] },
  { hour: '18:00', times: ['18:20'] },
  { hour: '19:00', times: ['19:00', '19:45'] },
  { hour: '20:00', times: ['20:20'] },
  { hour: '21:00', times: ['21:00', '21:35'] },
];

const TO_PARKING: readonly DepartureGroup[] = [
  { hour: '00:00', times: ['00:22'] },
  { hour: '04:00', times: ['04:02', '04:42'] },
  { hour: '05:00', times: ['05:22'] },
  { hour: '06:00', times: ['06:02', '06:42'] },
  { hour: '07:00', times: ['07:22'] },
  { hour: '08:00', times: ['08:02'] },
  { hour: '11:00', times: ['11:42'] },
  { hour: '12:00', times: ['12:22'] },
  { hour: '13:00', times: ['13:02', '13:42'] },
  { hour: '14:00', times: ['14:22'] },
  { hour: '15:00', times: ['15:02', '15:42'] },
  { hour: '16:00', times: ['16:22'] },
  { hour: '17:00', times: ['17:02', '17:42'] },
  { hour: '18:00', times: ['18:07', '18:22', '18:37'] },
  { hour: '19:00', times: ['19:02', '19:17', '19:42'] },
  { hour: '20:00', times: ['20:02', '20:22', '20:37'] },
  { hour: '21:00', times: ['21:02', '21:17', '21:42', '21:52'] },
  { hour: '22:00', times: ['22:22'] },
  { hour: '23:00', times: ['23:02', '23:42'] },
];

function DepartureTable({
  caption,
  groups,
}: {
  caption: string;
  groups: readonly DepartureGroup[];
}) {
  return (
    <table className="w-full border-separate border-spacing-y-1.5 text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="text-muted text-xs">
          <th scope="col" className="px-3 pb-1 font-medium">
            Uur
          </th>
          <th scope="col" className="px-3 pb-1 font-medium">
            Vertrektijden
          </th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => (
          <tr key={group.hour}>
            <th
              scope="row"
              className="numeric rounded-l-md bg-accent-wash px-3 py-2 text-sm font-semibold text-accent-hover"
            >
              {group.hour}
            </th>
            <td className="rounded-r-md bg-surface-sunken px-3 py-2">
              <ul
                aria-label={`Vertrektijden in het uur vanaf ${group.hour}`}
                className="flex flex-wrap gap-x-4 gap-y-1"
              >
                {group.times.map((time) => (
                  <li
                    key={time}
                    className="numeric text-sm font-semibold text-heading"
                  >
                    {time}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ShuttleTimetable() {
  return (
    <Section
      id="dienstregeling"
      tone="surface"
      spacing="md"
      aria-labelledby="dienstregeling-heading"
    >
      <Container>
        <div className="max-w-[48rem]">
          <Eyebrow rule>Shuttlebus</Eyebrow>
          <h2 id="dienstregeling-heading" className="text-display-md mt-5">
            Bekijk de dienstregeling
          </h2>
          <p className="text-muted mt-5 max-w-[62ch] leading-relaxed">
            Kies vooraf een vertrektijd die aansluit op uw vlucht. De shuttlerit
            duurt ongeveer 8 minuten; houd daarnaast rekening met eventuele
            wachttijd.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="shuttle-naar-heading"
            className="border-line bg-surface shadow-card rounded-xl border p-4 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="bg-accent-wash text-accent grid size-11 shrink-0 place-items-center rounded-full">
                <Plane className="size-5" aria-hidden />
              </span>
              <div>
                <h3
                  id="shuttle-naar-heading"
                  className="text-heading text-lg font-semibold"
                >
                  Naar Schiphol
                </h3>
                <p className="text-muted text-sm">
                  Vertrek vanaf het parkeerterrein
                </p>
              </div>
            </div>
            <DepartureTable
              caption="Vertrektijden van het parkeerterrein naar Schiphol"
              groups={TO_SCHIPHOL}
            />
          </section>

          <section
            aria-labelledby="shuttle-terug-heading"
            className="border-line bg-surface shadow-card rounded-xl border p-4 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="bg-accent-wash text-accent grid size-11 shrink-0 place-items-center rounded-full">
                <CarFront className="size-5" aria-hidden />
              </span>
              <div>
                <h3
                  id="shuttle-terug-heading"
                  className="text-heading text-lg font-semibold"
                >
                  Terug naar het parkeerterrein
                </h3>
                <p className="text-muted text-sm">
                  Vertrek vanaf de shuttlehalte op Schiphol
                </p>
              </div>
            </div>
            <DepartureTable
              caption="Vertrektijden vanaf Schiphol naar het parkeerterrein"
              groups={TO_PARKING}
            />
          </section>
        </div>

        <div className="border-line bg-surface-sunken mt-6 flex items-start gap-3 rounded-lg border p-4 sm:p-5">
          <BusFront
            className="text-accent mt-0.5 size-5 shrink-0"
            aria-hidden
          />
          <p className="text-body text-sm leading-relaxed">
            <strong className="text-heading">Belangrijk:</strong> de tijden
            hierboven zijn de vertrektijden voor uw boeking. Kies vooraf een
            shuttle die aansluit op uw vlucht en houd rekening met eventuele
            wachttijd.
          </p>
        </div>
      </Container>
    </Section>
  );
}
