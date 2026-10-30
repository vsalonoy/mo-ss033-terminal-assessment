import { useId, useState } from 'react';
import { Chip, Cite } from './primitives';
import { ProportionRing } from './viz';
import { SOLUTIONS, RANKED, CRITERIA, SKILLSFUTURE_TAKEUP, type Solution } from '../data/research';
import { ratingTone } from './tones';

/**
 * Section D's comparison: all five alternatives against the four Determining
 * Solution criteria, the 20 approved ratings exactly as worded in research.ts.
 *
 * The ratings are qualitative words, never numbers: nothing is scored, weighted
 * or added up here. Colour groups the wording and is always backed by the word.
 * Choosing a rating shows the reason for it; choosing a solution shows everything
 * recorded about it. Why each one sits where it does in the order is section E's
 * job, and is linked rather than repeated.
 */
type CriterionKey = typeof CRITERIA[number]['key'];


function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.88rem] text-mute">
      <span className="font-semibold text-sand/85">Colour groups the wording:</span>
      <Chip tone="cyan">Moderate to high, high or strongest</Chip>
      <Chip>Moderate</Chip>
      <Chip tone="amber">Low to moderate or low</Chip>
      <Chip tone="rose">Not shown</Chip>
    </div>
  );
}

/** Everything recorded about one alternative. */
function SolutionDetail({ s }: { s: Solution }) {
  return (
    <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
      <dl className="space-y-4">
        {([['What it is', s.what], ['Who runs it', s.who], ['Who it is for', s.targetPopulation], ['Status', s.status]] as const).map(([k, v]) => (
          <div key={k}>
            <dt className="mlabel text-mute">{k}</dt>
            <dd className="mt-1 text-[0.95rem] leading-relaxed text-sand/90">{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="mlabel text-mute">Detail</p>
        <ul className="mt-2 space-y-2">
          {s.detail.map((d, i) => (
            <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-sand/90">
              <span className="shrink-0 text-cyan-300" aria-hidden>·</span>{d}
            </li>
          ))}
        </ul>
        {s.id === 's5' && (
          <div className="mt-6 rounded-xl border border-line bg-ink-800 p-5">
            <p className="mlabel mb-4 text-mute">Reported take-up</p>
            <ProportionRing value={SKILLSFUTURE_TAKEUP.used} caption={SKILLSFUTURE_TAKEUP.label} sub={SKILLSFUTURE_TAKEUP.detail} />
            <p className="t-micro mt-4 border-l-2 border-amber pl-3">{SKILLSFUTURE_TAKEUP.caveat}</p>
          </div>
        )}
        <p className="mt-5 text-[0.95rem] text-sand/85">
          Sources: <Cite keys={s.ref} />. Ranked {s.rank} of 5: <a href="#ranking" className="link">why, in section E</a>.
        </p>
      </div>
    </div>
  );
}

export function Comparison() {
  const top = RANKED[0];
  const [cell, setCell] = useState<{ sid: string; key: CriterionKey }>({ sid: top.id, key: 'effectiveness' });
  const [openSol, setOpenSol] = useState<string | null>(null);
  const detailId = useId();
  const sol = SOLUTIONS.find(s => s.id === cell.sid)!;
  const crit = CRITERIA.find(c => c.key === cell.key)!;
  const shownSol = openSol ? SOLUTIONS.find(s => s.id === openSol)! : null;

  return (
    <div>
      <Legend />

      {/* Wide screens: one table, every rating visible at once. */}
      <div className="mt-5 hidden md:block">
        <div className="card overflow-hidden">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Five alternatives rated against sustainability, impact, feasibility and effectiveness, in rank order.
              Ratings are qualitative. Choose a rating for the reason behind it, or a solution for its full record.
            </caption>
            <thead>
              <tr className="border-b border-line bg-ink-800">
                <th scope="col" className="px-5 py-3.5 mlabel text-mute">Alternative, in rank order</th>
                {CRITERIA.map(c => (
                  <th key={c.key} scope="col" className="px-4 py-3.5 align-bottom">
                    <span className="mlabel text-sand">{c.label}</span>
                    {c.key === 'effectiveness' && <span className="mt-0.5 block text-[0.8rem] font-normal text-mute">Weighted most (section E)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RANKED.map(s => (
                <tr key={s.id} className={`border-b border-line last:border-0 ${s.rank === 1 ? 'bg-cyan-500/[0.05]' : ''}`}>
                  <th scope="row" className="px-5 py-3 align-middle font-normal">
                    <button type="button" onClick={() => setOpenSol(openSol === s.id ? null : s.id)}
                      aria-expanded={openSol === s.id} aria-controls={detailId}
                      className="group flex min-h-[44px] items-center gap-3 text-left">
                      <span className={`font-serif text-[1.3rem] font-semibold tabular-nums ${s.rank === 1 ? 'text-cyan-300' : 'text-mute'}`}>{s.rank}</span>
                      <span>
                        <span className="block text-[0.98rem] font-semibold text-sand underline decoration-line underline-offset-4 group-hover:decoration-cyan-300">{s.short}</span>
                        <span className="block text-[0.82rem] text-mute">{s.where}{s.rank === 1 ? ' · recommended' : ''}</span>
                      </span>
                    </button>
                  </th>
                  {CRITERIA.map(c => {
                    const on = cell.sid === s.id && cell.key === c.key;
                    return (
                      <td key={c.key} className="px-3 py-2 align-middle">
                        <button type="button" onClick={() => setCell({ sid: s.id, key: c.key })}
                          aria-pressed={on}
                          aria-label={`${s.short}, ${c.label}: ${s.criteria[c.key].r}. Show the reason`}
                          className={`flex min-h-[44px] w-full items-center rounded-lg px-2 transition-colors ${
                            on ? 'bg-ink-600 ring-2 ring-cyan-500' : 'hover:bg-ink-600'}`}>
                          <Chip tone={ratingTone(s.criteria[c.key].r)}>{s.criteria[c.key].r}</Chip>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The reason for the chosen rating. */}
        <div aria-live="polite" className="mt-4 rounded-xl border border-cyan-500/50 bg-ink-700 p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-serif text-[1.15rem] font-semibold text-sand">{sol.short}</span>
            <span className="text-mute" aria-hidden>·</span>
            <span className="mlabel text-mute">{crit.label}</span>
            <Chip tone={ratingTone(sol.criteria[cell.key].r)}>{sol.criteria[cell.key].r}</Chip>
          </div>
          <p className="mt-1 text-[0.9rem] italic text-mute">{crit.blurb}</p>
          <p className="mt-3 max-w-reading text-[1rem] leading-relaxed text-sand/90">{sol.criteria[cell.key].why}</p>
          <p className="mt-3 text-[0.9rem] text-mute">Sources for this alternative: <Cite keys={sol.ref} /></p>
        </div>

        <div id={detailId} hidden={!shownSol} data-print-open className="mt-4 card p-6 sm:p-7">
          {shownSol && (
            <>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h3 className="font-serif text-[1.35rem] font-semibold text-sand">{shownSol.name}</h3>
                <Chip tone={shownSol.rank === 1 ? 'cyan' : 'neutral'}>Rank {shownSol.rank} of 5</Chip>
                <Chip>{shownSol.where}</Chip>
                <button type="button" onClick={() => setOpenSol(null)} className="btn btn-g ml-auto !px-4 !text-[0.85rem]">Close</button>
              </div>
              <SolutionDetail s={shownSol} />
            </>
          )}
        </div>
      </div>

      {/* Narrow screens: one card per alternative, ratings stacked, reasons one tap away. */}
      <ol className="mt-5 space-y-4 md:hidden">
        {RANKED.map(s => <MobileCard key={s.id} s={s} />)}
      </ol>
    </div>
  );
}

function MobileCard({ s }: { s: Solution }) {
  const [open, setOpen] = useState<'reasons' | 'record' | null>(null);
  const id = useId();
  return (
    <li className={`card p-5 ${s.rank === 1 ? 'border-cyan-500/60' : ''}`}>
      <div className="flex items-baseline gap-3">
        <span className={`font-serif text-[1.5rem] font-semibold ${s.rank === 1 ? 'text-cyan-300' : 'text-mute'}`}>{s.rank}</span>
        <div>
          <h3 className="font-serif text-[1.15rem] font-semibold leading-snug text-sand">{s.short}</h3>
          <p className="text-[0.85rem] text-mute">{s.where}{s.rank === 1 ? ' · recommended' : ''}</p>
        </div>
      </div>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        {CRITERIA.map(c => (
          <div key={c.key} className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-2.5">
            <dt className="text-[0.92rem] text-sand/85">{c.label}{c.key === 'effectiveness' ? ' (weighted most)' : ''}</dt>
            <dd><Chip tone={ratingTone(s.criteria[c.key].r)}>{s.criteria[c.key].r}</Chip></dd>
            <dd hidden={open !== 'reasons'} data-print-open className="col-span-2 mt-1.5 text-[0.92rem] leading-relaxed text-sand/85">{s.criteria[c.key].why}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen(open === 'reasons' ? null : 'reasons')} aria-expanded={open === 'reasons'}
          className="btn btn-g !px-4 !text-[0.85rem]">{open === 'reasons' ? 'Hide the reasons' : 'Show the reasons'}</button>
        <button type="button" onClick={() => setOpen(open === 'record' ? null : 'record')} aria-expanded={open === 'record'} aria-controls={id}
          className="btn btn-g !px-4 !text-[0.85rem]">{open === 'record' ? 'Hide the full record' : 'Full record'}</button>
      </div>
      <div id={id} hidden={open !== 'record'} data-print-open className="mt-4 border-t border-line pt-4">
        <SolutionDetail s={s} />
      </div>
    </li>
  );
}
