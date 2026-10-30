import { useState, type ReactNode } from 'react';
import { useTabs } from '../hooks/useTabs';
import { BarsH } from './viz';
import { Cite } from './primitives';
import {
  HEADLINE_STATS, EXPOSURE_BY_REGION, EXPOSURE_NOTES, EXPOSURE_VS_ASEAN, EVIDENCE, type RefKey,
} from '../data/research';

/**
 * Section B's evidence explorer. One tab per kind of figure, so exposure rates,
 * employment counts and displacement risk are never drawn on one chart as if they
 * measured the same thing. Every tab says where its figure comes from, the period
 * it covers, what it measures and what it cannot be used for.
 *
 * All five panels stay in the page; only the selected one is shown. Print shows all.
 * The paragraphs are the section's original wording, moved here unchanged.
 */
const [EXPOSED, HIGHEST, EMPLOYED, CONTACT] = HEADLINE_STATS;
const E4 = EVIDENCE.find(e => e.id === 'e4')!;
const note = (k: string) => EXPOSURE_NOTES.find(n => n.k === k)!;

function About({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <div className="rounded-xl border border-line bg-ink-800 p-5">
      <p className="mlabel text-mute">About this figure</p>
      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className={k === 'Caution' ? 'sm:col-span-2' : ''}>
            <dt className={`mlabel ${k === 'Caution' ? 'text-rose' : 'text-mute'}`}>{k}</dt>
            <dd className="mt-1 text-[0.95rem] leading-relaxed text-sand/90">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Figure({ value, label, children }: { value: string; label: string; children?: ReactNode }) {
  return (
    <div className="border-t-2 border-sand pt-4">
      <div className="t-stat text-sand">{value}</div>
      <div className="mt-2 text-[1rem] font-medium leading-snug text-sand">{label}</div>
      {children && <p className="mt-1.5 text-[0.9rem] leading-relaxed text-mute">{children}</p>}
    </div>
  );
}

/** Two shares of the same total, on one 0 to 100 percent scale, drawn as separate bars. */
function ShareBars({ rows }: { rows: { label: string; value: number; tone: string }[] }) {
  return (
    <figure className="m-0">
      <div className="space-y-4">
        {rows.map(r => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between gap-3 text-[0.95rem]">
              <span className="text-sand/90">{r.label}</span>
              <span className="font-semibold tabular-nums text-sand">{r.value}%</span>
            </div>
            <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-ink-600" aria-hidden>
              <div className={`h-full rounded-full ${r.tone}`} style={{ width: `${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.8rem] text-mute" aria-hidden><span>0%</span><span>100% of employment</span></div>
      <figcaption className="t-micro mt-3">
        Two separate measures from the same brief, each a share of employment. They are drawn side by
        side, not one inside the other.
      </figcaption>
    </figure>
  );
}

const TABS: { label: string; panel: ReactNode }[] = [
  { label: 'Philippines', panel: (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Figure value={EXPOSED.value} label={EXPOSED.label} />
          <Figure value={HIGHEST.value} label={HIGHEST.label} />
        </div>
        <ShareBars rows={[
          { label: 'Employment in exposed occupations', value: 27.7, tone: 'bg-cyan-500' },
          { label: 'Jobs in the highest displacement risk category', value: 3.6, tone: 'bg-amber' },
        ]} />
      </div>
      <div className="space-y-5">
        <p className="prose-r">
          The ILO estimates that 12.7 million Filipino workers, more than one quarter of
          employment, are in occupations exposed to generative AI. That is the highest exposure
          rate among the ASEAN countries with recent comparable data. Only 3.6 percent of jobs
          fall into the highest displacement risk category. <Cite keys={['huynh2026']} />
        </p>
        <About rows={[
          ['Source', <Cite key="s" keys={['huynh2026']} />],
          ['Period', 'Labour Force Survey data for the first quarter of 2024'],
          ['What it measures', <span key="m">{HIGHEST.detail}</span>],
          ['Caution', 'Exposure is not displacement. These figures describe occupations, not individual workers.'],
        ]} />
      </div>
    </div>
  ) },
  { label: 'By group', panel: (
    <div className="grid gap-8 lg:grid-cols-2">
      {(['Gender', 'Age'] as const).map(k => (
        <div key={k} className="border-t-2 border-sand pt-4">
          <h4 className="font-serif text-[1.2rem] font-semibold text-sand">{k}</h4>
          <p className="mt-2 prose-r">{note(k).v} <Cite keys={note(k).ref} /></p>
        </div>
      ))}
      <div className="lg:col-span-2">
        <About rows={[
          ['Source', <Cite key="s" keys={['huynh2026']} />],
          ['Period', 'Labour Force Survey data for the first quarter of 2024'],
          ['What it measures', 'Exposure rates within each group, not each group’s share of exposed workers.'],
          ['Caution', 'The brief describes these as differences in exposure, not as numbers of jobs lost.'],
        ]} />
      </div>
    </div>
  ) },
  { label: 'By region', panel: (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <h4 className="font-serif text-[1.2rem] font-semibold text-sand">Share of jobs exposed, by region</h4>
        <div className="mt-4">
          <BarsH data={EXPOSURE_BY_REGION.map((r, i) => ({
            name: r.name, value: r.value, note: r.note, floor: i > 0, tone: i === 0 ? 'cyan' : 'iris',
          }))} max={50} unit="%" />
        </div>
        <ul className="mt-1 space-y-1 text-[0.9rem] text-mute">
          {EXPOSURE_BY_REGION.map(r => <li key={r.name}>{r.name}: {r.note.toLowerCase()}.</li>)}
        </ul>
      </div>
      <div className="space-y-5">
        <p className="prose-r">{note('Region').v} <Cite keys={note('Region').ref} /></p>
        <p className="t-micro">
          The NCR figure is reported as around two in five jobs. Central Luzon and Calabarzon are
          reported as exceeding 30 percent, so both are drawn at that floor rather than at a
          precise value. <Cite keys={['huynh2026']} />
        </p>
        <About rows={[
          ['Source', <Cite key="s" keys={['huynh2026']} />],
          ['Period', 'Labour Force Survey data for the first quarter of 2024'],
          ['What it measures', 'The share of jobs in each region that are in exposed occupations.'],
          ['Caution', 'Two of the three bars are floors, marked with a greater than sign, not precise values.'],
        ]} />
      </div>
    </div>
  ) },
  { label: 'Against ASEAN', panel: (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <h4 className="font-serif text-[1.2rem] font-semibold text-sand">Philippine exposure and the ASEAN average</h4>
        <div className="mt-4">
          <BarsH data={EXPOSURE_VS_ASEAN.map((d, i) => ({
            name: d.name, value: d.value, note: d.note, floor: d.floor, tone: i === 0 ? 'cyan' : 'iris',
          }))} max={30} unit="%" />
        </div>
        <p className="t-micro">
          The two figures come from different ILO studies and periods: 22.9 percent for ASEAN in
          2025, and for the Philippines 27.7 percent of employment in the first quarter of 2024.
          The Philippine bar is drawn at the one-quarter floor stated in the brief&rsquo;s key
          points, marked with a greater than sign, so it understates rather than overstates the
          estimate. <Cite keys={['huynh2026', 'ilo2026b']} />
        </p>
      </div>
      <div className="space-y-5">
        <p className="prose-r">
          Across ASEAN the same body estimates 22.9 percent of employment in 2025, nearly 80
          million workers, has more than minimal exposure, while finding little widespread
          disruption so far and uneven national preparedness. <Cite keys={['ilo2026a', 'ilo2026b']} />
        </p>
        <About rows={[
          ['Source', <Cite key="s" keys={['huynh2026', 'ilo2026a', 'ilo2026b']} />],
          ['Period', 'ASEAN: 2025. Philippines: first quarter of 2024.'],
          ['What it measures', 'The share of employment with more than minimal exposure to generative AI.'],
          ['Caution', 'Different studies and periods. The comparison holds only among ASEAN countries with recent comparable data.'],
        ]} />
      </div>
    </div>
  ) },
  { label: 'Employment and sector', panel: (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Figure value={EMPLOYED.value} label={EMPLOYED.label}>{EMPLOYED.detail} <Cite keys={EMPLOYED.ref} /></Figure>
        <About rows={[
          ['Source', <Cite key="s" keys={['psa2026']} />],
          ['Period', 'July 2026 Labour Force Survey'],
          ['What it measures', 'A count of employed people, not exposure.'],
          ['Caution', <span key="c">{E4.note!.t} <Cite keys={E4.note!.refs!} /></span>],
        ]} />
      </div>
      <div className="space-y-4">
        <Figure value={CONTACT.value} label={CONTACT.label}>{CONTACT.detail} <Cite keys={CONTACT.ref as RefKey[]} /></Figure>
        <p className="prose-r">
          The Philippine contact centre sector is the clearest test case. It grew by about 4
          percent to 1.68 million workers even as more than two thirds of industry member firms
          ran AI pilots, and reporting describes firms using AI to augment staff and creating
          roles such as AI trainers and prompt engineers. <Cite keys={['dagooc2026', 'khan2026']} />
        </p>
        <About rows={[
          ['Source', <Cite key="s" keys={['dagooc2026', 'khan2026']} />],
          ['Period', '2025, against a year earlier'],
          ['What it measures', 'A count of workers in one sector, from news and industry reporting.'],
          ['Caution', 'A headcount for one sector. It does not show what happened to individual tasks or workers.'],
        ]} />
      </div>
    </div>
  ) },
];

export function ExposureExplorer() {
  const [active, setActive] = useState(0);
  const { tab, panel } = useTabs(TABS.length, active, setActive);
  const p = panel();
  return (
    <div className="card p-5 sm:p-7">
      <div role="tablist" aria-label="Evidence on exposure and employment" className="flex flex-wrap gap-2 border-b border-line pb-4">
        {TABS.map((t, i) => (
          <button key={t.label} {...tab(i)}
            className={`min-h-[44px] rounded-full border px-4 text-[0.92rem] font-semibold transition-colors ${
              i === active ? 'border-sand bg-sand text-ink-700' : 'border-line bg-ink-700 text-sand/85 hover:border-cyan-500/70'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {/* One panel element per tab, so each stays in the page for print and search. */}
      {TABS.map((t, i) => (
        <div key={t.label} {...(i === active ? p : {})} hidden={i !== active} data-print-open className="pt-6">
          <h3 className="sr-only">{t.label}</h3>
          {t.panel}
        </div>
      ))}
    </div>
  );
}
