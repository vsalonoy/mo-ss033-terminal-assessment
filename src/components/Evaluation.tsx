import { useId, useState } from 'react';
import { Chip, Cite, Disclosure } from './primitives';
import {
  SMART, PROPOSAL_CRITERIA, ASSESS_KIND_LABEL, IMPACT_NEGATIVES, type AssessKind, type Smart,
} from '../data/research';

/**
 * Sections H and I as one evaluation interface.
 *
 * Which indicator serves which Evaluating Success criterion is not a new mapping:
 * it is read from the assessment rows in PROPOSAL_CRITERIA, where each row that
 * uses an indicator starts with that indicator's name. Nothing is scored, no
 * progress is shown, and every target is labelled as proposed.
 */
type Use = { criterion: string; kind: AssessKind };
const usesOf = (m: Smart): Use[] => PROPOSAL_CRITERIA.flatMap(c =>
  c.assess.filter(a => a.t.startsWith(m.name)).map(a => ({ criterion: c.label, kind: a.kind })));
const indicatorOf = (t: string) => SMART.find(m => t.startsWith(m.name));
const code = (m: Smart) => `M${SMART.indexOf(m) + 1}`;

const ASSESS_TONE: Record<AssessKind, 'neutral' | 'cyan' | 'amber' | 'rose'> = {
  indicator: 'cyan', baseline: 'neutral', proxy: 'neutral', qualitative: 'neutral', gap: 'rose', limitation: 'amber',
};
const verdictTone = (v: string): 'cyan' | 'amber' | 'rose' =>
  v.startsWith('Not') ? 'rose' : v.startsWith('Moderate,') ? 'amber' : 'cyan';

/* ------------------------------------------------------------- H: scorecard */

function Indicator({ m, hidden }: { m: Smart; hidden: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li id={`smart-${m.id}`} hidden={hidden} data-print-open className="card flex scroll-mt-24 flex-col p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[1.2rem] font-semibold leading-snug text-sand">{m.name}</h3>
        <span className="mlabel shrink-0 text-mute">{code(m)}</span>
      </div>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-sand/85">{m.definition}</p>

      <div className="mt-4 rounded-lg bg-amber/[0.08] px-4 py-3">
        <p className="mlabel text-amber">{m.measureOnly ? 'Proposed measure' : 'Proposed target'}</p>
        <p className="mt-1 font-serif text-[1.08rem] font-semibold leading-snug text-sand">{m.target}</p>
      </div>

      <dl className="mt-4 space-y-2 text-[0.93rem]">
        {([['When', m.timeframe], ['Responsible (proposed)', m.owner]] as const).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2">
            <dt className="text-mute">{k}</dt><dd className="leading-snug text-sand/90">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 border-l-2 border-rose pl-3 text-[0.93rem] leading-relaxed text-sand/90">
        <span className="font-semibold text-rose">What it cannot tell you: </span>{m.assumption}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {usesOf(m).map(u => (
          <Chip key={u.criterion + u.kind} tone={u.kind === 'indicator' ? 'cyan' : 'neutral'}>
            {u.criterion}{u.kind !== 'indicator' ? ` · ${ASSESS_KIND_LABEL[u.kind].toLowerCase()}` : ''}
          </Chip>
        ))}
      </div>

      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={id}
        className="mt-auto self-start pt-3 text-left text-[0.9rem] font-semibold text-cyan-300 hover:text-cyan-200">
        <span className="inline-flex min-h-[44px] items-center gap-1.5">
          <span aria-hidden className={`inline-block transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
          {open ? 'Hide the full indicator' : 'Full indicator'}
        </span>
      </button>
      <dl id={id} hidden={!open} data-print-open className="mt-2 space-y-3 border-t border-line pt-4">
        {([['Measured by', m.method], ['Data source', m.source], ['Objective', m.objective], ['Target group', m.targetGroup], ['Baseline', m.baseline]] as const).map(([k, v]) => (
          <div key={k}>
            <dt className="mlabel text-mute">{k}</dt>
            <dd className="mt-1 text-[0.93rem] leading-relaxed text-sand/90">{v}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export function SmartScorecard() {
  const [filter, setFilter] = useState<string | null>(null);
  const shown = (m: Smart) => filter === null || usesOf(m).some(u => u.criterion === filter);
  const count = SMART.filter(shown).length;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Show indicators by Evaluating Success criterion">
        <span className="mr-1 text-[0.92rem] text-mute">Evaluating Success criterion:</span>
        {[null, ...PROPOSAL_CRITERIA.map(c => c.label)].map(f => (
          <button key={f ?? 'all'} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`min-h-[44px] rounded-full border px-4 text-[0.9rem] font-semibold transition-colors ${
              filter === f ? 'border-sand bg-sand text-ink-700' : 'border-line bg-ink-700 text-sand/85 hover:border-cyan-500/70'}`}>
            {f ?? 'All six'}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.9rem] text-mute" aria-live="polite">
        {filter === null ? 'Showing all six indicators.'
          : count === 0 ? `No SMART indicator measures ${filter.toLowerCase()} directly; see section I for how it would be judged.`
          : `Showing ${count} of 6 indicators used to judge ${filter.toLowerCase()}.`}
      </p>
      <ol className="mt-5 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SMART.map(m => <Indicator key={m.id} m={m} hidden={!shown(m)} />)}
      </ol>
    </div>
  );
}

/* --------------------------------------------------------------- I: grid */

const COLUMNS: { head: string; kinds: AssessKind[] }[] = [
  { head: 'SMART indicators', kinds: ['indicator'] },
  { head: 'Baseline, proxy or qualitative check', kinds: ['baseline', 'proxy', 'qualitative'] },
  { head: 'Gaps and limitations', kinds: ['gap', 'limitation'] },
];

/** The pattern at a glance: what each criterion would be judged on, and what is missing. */
export function CriteriaGrid() {
  return (
    <div>
      <div className="overflow-x-auto card" tabIndex={0} role="region" aria-label="Evaluation summary table, scrolls sideways on small screens">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">
            The four Evaluating Success criteria, each with its qualitative verdict and what success would be judged on.
          </caption>
          <thead>
            <tr className="border-b border-line bg-ink-800">
              <th scope="col" className="px-5 py-3.5 mlabel text-mute">Criterion and verdict</th>
              {COLUMNS.map(c => <th key={c.head} scope="col" className="px-5 py-3.5 mlabel text-mute">{c.head}</th>)}
            </tr>
          </thead>
          <tbody>
            {PROPOSAL_CRITERIA.map(c => (
              <tr key={c.label} className="border-b border-line align-top last:border-0">
                <th scope="row" className="px-5 py-4 font-normal">
                  <span className="block font-serif text-[1.1rem] font-semibold text-sand">{c.label}</span>
                  <span className="mt-1.5 inline-block"><Chip tone={verdictTone(c.verdict)}>{c.verdict}</Chip></span>
                </th>
                {COLUMNS.map(col => {
                  const rows = c.assess.filter(a => col.kinds.includes(a.kind));
                  return (
                    <td key={col.head} className="px-5 py-4 text-[0.92rem] leading-relaxed text-sand/90">
                      {rows.length === 0 ? <span className="text-mute">None</span> : (
                        <ul className="space-y-2">
                          {rows.map(a => {
                            const m = a.kind === 'indicator' || a.kind === 'baseline' || a.kind === 'proxy' ? indicatorOf(a.t) : undefined;
                            return (
                              <li key={a.t}>
                                {m ? (
                                  <a href={`#smart-${m.id}`} className="link inline-flex min-h-[32px] items-center">{code(m)} {m.name}</a>
                                ) : a.kind === 'gap' || a.kind === 'limitation' ? a.t
                                  : <span>{ASSESS_KIND_LABEL[a.kind]} check, set out below</span>}
                                {m && a.kind !== 'indicator' && <span className="text-mute"> ({ASSESS_KIND_LABEL[a.kind].toLowerCase()})</span>}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {PROPOSAL_CRITERIA.map(c => (
          <div key={c.label} className="card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-[1.3rem] font-semibold text-sand">{c.label}</h3>
              <Chip tone={verdictTone(c.verdict)}>{c.verdict}</Chip>
            </div>
            <p className="mt-3 text-[1rem] leading-relaxed text-sand/90">{c.body}</p>
            <Disclosure summary={`How success would be assessed (${c.assess.length})`}>
              <h4 className="sr-only">How success would be assessed</h4>
              <ul className="space-y-3">
                {c.assess.map(a => (
                  <li key={a.t} className="flex flex-col gap-1.5">
                    <span><Chip tone={ASSESS_TONE[a.kind]}>{ASSESS_KIND_LABEL[a.kind]}</Chip></span>
                    <span className="text-[0.95rem] leading-relaxed text-sand/90">{a.t}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
            {c.label === 'Impact' && <ImpactNegatives />}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Impact's negative changes: each names the indicator that would show it, or says none would. */
function ImpactNegatives() {
  const { lead, items } = IMPACT_NEGATIVES;
  return (
    <Disclosure summary={`Negative changes to watch for (${items.length})`}>
      <h4 className="sr-only">Negative changes to watch for</h4>
      <p className="text-[0.95rem] leading-relaxed text-mute">{lead}</p>
      <ul className="mt-4 space-y-3">
        {items.map(n => {
          const m = SMART.find(s => s.id === n.watch);
          return (
            <li key={n.risk} className="flex flex-col gap-1.5">
              <span className="text-[0.95rem] font-semibold text-sand">{n.risk}</span>
              <span>{m ? <Chip tone="cyan">Shown by {code(m)} {m.name}</Chip> : <Chip tone="amber">No indicator</Chip>}</span>
              <span className="text-[0.95rem] leading-relaxed text-sand/90">
                {n.how}{n.refs && <> <Cite keys={n.refs} /></>}
              </span>
            </li>
          );
        })}
      </ul>
    </Disclosure>
  );
}
