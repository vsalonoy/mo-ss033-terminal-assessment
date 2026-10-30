import { useId, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { useTabs } from '../hooks/useTabs';

/**
 * Hand-built SVG visualisations.
 *
 * Why not a charting library: every figure here needs to grow from zero when it
 * scrolls into view, respond to hover, click and keyboard focus, and carry an
 * honest label about how precise the underlying number actually is. Doing that
 * through a general-purpose library meant fighting it and shipping 350 kB for
 * four small charts. These are a few hundred lines and weigh nothing.
 *
 * Every value is passed in from src/data/research.ts. Nothing is computed into
 * a score, and no qualitative rating is ever turned into a number.
 */

/**
 * Shared trigger: has this element been scrolled into view yet?
 * The ref belongs on the component's outermost element. Attaching it to
 * something lower down means the visible part can sit on screen un-animated
 * while the watched element is still below the fold.
 */
function useEnter<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const reduced = usePrefersReducedMotion();
  return { ref, play: reduced || inView, reduced };
}

export function VizFrame({ title, note, children, label }:
  { title?: string; note?: ReactNode; children: ReactNode; label?: string }) {
  return (
    <figure className="m-0">
      {title && <figcaption className="t-sub mb-1">{title}</figcaption>}
      {label && <p className="t-micro mb-4">{label}</p>}
      {children}
      {note && <figcaption className="t-micro mt-3">{note}</figcaption>}
    </figure>
  );
}

/* ------------------------------------------------------------------ bars */
export interface BarDatum {
  name: string; value: number; note?: string; floor?: boolean;
  tone?: 'cyan' | 'iris' | 'amber';
  /** Overrides the chart-level unit, for a chart that mixes percent and percentage points. */
  unit?: string;
}

/**
 * Horizontal bars that grow from zero on entry, staggered.
 * Each bar is a button: hover, click or tab to it and the note appears below.
 */
export function BarsH({ data, max, unit = '%', activeIndex, onActive }:
  { data: BarDatum[]; max: number; unit?: string; activeIndex?: number | null;
    onActive?: (i: number | null) => void }) {
  const { ref, play, reduced } = useEnter<HTMLDivElement>();
  const [internal, setInternal] = useState<number | null>(null);
  const active = activeIndex !== undefined ? activeIndex : internal;
  const setActive = onActive ?? setInternal;
  const uid = useId();

  const W = 100; // viewBox units; the labels live in HTML, not in the SVG
  const ticks = [0, max / 2, max];

  return (
    <div ref={ref}>
      <div className="space-y-2.5">
        {data.map((d, i) => {
          const pct = Math.min(100, (d.value / max) * 100);
          const on = active === i;
          const tone = d.tone ?? (i === 0 ? 'cyan' : 'iris');
          return (
            <button
              key={d.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(on ? null : i)}
              aria-pressed={on}
              className="group block w-full text-left rounded-lg px-1 py-1 -mx-1 transition-colors hover:bg-ink-600/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-small transition-colors ${on ? 'text-cyan-200' : 'text-sand/90'}`}>
                  {d.name}
                </span>
                <span className={`font-sans text-[0.98rem] font-semibold tabular-nums transition-colors ${
                  on ? 'text-cyan-200' : tone === 'amber' ? 'text-amber' : 'text-cyan-300'}`}>
                  {d.floor ? '>' : ''}{d.value}{d.unit ?? unit}
                </span>
              </span>
              <span className="mt-1.5 block h-2.5 w-full rounded-full bg-ink-600 overflow-hidden">
                <motion.span
                  className={`block h-full rounded-full ${
                    tone === 'amber' ? 'bg-amber' : tone === 'iris' ? 'bg-iris-400' : 'bg-cyan-400'}`}
                  style={{ width: `${pct}%`, transformOrigin: 'left center' }}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: play ? 1 : 0, opacity: on ? 1 : 0.85 }}
                  transition={{
                    scaleX: { duration: reduced ? 0 : 1.05, delay: reduced ? 0 : 0.1 + i * 0.13, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.2 },
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* axis */}
      <svg viewBox={`0 0 ${W} 6`} className="mt-2 w-full h-4 inert" aria-hidden="true">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={(t / max) * W} x2={(t / max) * W} y1="0" y2="2"
              stroke="rgb(var(--line))" strokeWidth="0.3" />
            <text x={(t / max) * W} y="5.6" fontSize="3.4" fill="rgb(var(--mute))"
              textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}>
              {t}{unit}
            </text>
          </g>
        ))}
        <title id={uid}>Axis from 0 to {max}{unit}</title>
      </svg>

      <div aria-live="polite" className="mt-3 min-h-[2.6rem]">
        {active !== null && data[active]?.note && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="t-micro border-l border-cyan-500/40 pl-3"
          >
            {data[active].note}
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- evidence explorer */
/** One measured effect against a control group: a single figure or a reported range. */
export interface Measure {
  key: string;
  label: string;
  /** The period measured, as the source reports it. Left out where the source data gives none. */
  period?: string;
  unit: '%' | 'pp';
  value?: number;
  low?: number; high?: number;
  /** The plain reading of the figure. */
  meaning: string;
  /** A caution about how the figure may be read, if any. */
  caution?: string;
}

const unitWord = (u: Measure['unit']) => (u === 'pp' ? 'percentage points' : 'percent');
const shown = (m: Measure) => m.value !== undefined
  ? `${m.value}${m.unit === 'pp' ? ' pp' : m.unit}`
  : `${m.low}${m.unit} to ${m.high}${m.unit}`;
const spoken = (m: Measure) => m.value !== undefined
  ? `${m.value} ${unitWord(m.unit)}`
  : `between ${m.low} and ${m.high} ${unitWord(m.unit)}`;

/**
 * Measured effects, each selectable, with the selected one explained beside them.
 *
 * Each effect is drawn from a zero line that stands for the control group, so
 * every mark reads as "this much above the comparison". A single figure is a
 * dot; a reported range is a bracketed band with both ends labelled, never a
 * line, so nothing is implied between or beyond what was measured. Measures in
 * percentage points sit on their own scale under their own heading, so they are
 * never read against the percentages. Every value is printed as text, so none
 * of this depends on colour, hover or animation.
 */
export function EvidenceExplorer({ groups, max, children }:
  { groups: { heading: string; unit: Measure['unit']; measures: Measure[] }[]; max: number; children?: ReactNode }) {
  const all = groups.flatMap(g => g.measures);
  const [active, setActive] = useState(0);
  const { tab, panel } = useTabs(all.length, active, setActive);
  const sel = all[active];
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const x = (v: number) => `${(v / max) * 100}%`;
  /* each group's first position in the single list of tabs */
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.measures.length, 0));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8 items-start">
      <div role="tablist" aria-label="Measured effects" aria-orientation="vertical" className="space-y-6">
        {groups.map((g, gi) => (
          <div key={g.heading}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="t-label">{g.heading}</div>
              <div className="mlabel text-mute">Scale in {unitWord(g.unit)}</div>
            </div>
            <p className="t-micro mt-1">Zero is the control group. Each mark is the difference from it.</p>
            <div className="mt-2 space-y-2">
              {g.measures.map((m, mi) => {
                const i = starts[gi] + mi;
                const on = i === active;
                const amber = m.unit === 'pp';
                const mark = amber ? 'bg-amber' : 'bg-cyan-300';
                return (
                  <button key={m.key} {...tab(i)}
                    className={`block w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      on ? 'border-cyan-300/70 bg-cyan-500/[0.08] shadow-[inset_3px_0_0_rgb(var(--cyan-500))]'
                         : 'border-edge bg-ink-700/60 hover:border-accent-bright/40'}`}>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <span className={`text-[0.9rem] ${on ? 'text-cyan-200 font-semibold' : 'text-sand/90'}`}>{m.label}</span>
                      <span className={`font-sans text-[1.02rem] font-semibold tabular-nums ${amber ? 'text-amber' : 'text-cyan-300'}`}>
                        {shown(m)}
                      </span>
                    </span>
                    {/* the mark, on the group's scale; zero is the control group */}
                    <span aria-hidden className="relative mt-3 block h-5">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                      <span className="absolute left-0 top-0 h-full w-px bg-sand/50" />
                      {m.value !== undefined ? (
                        <>
                          <span className={`absolute top-1/2 h-0.5 -translate-y-1/2 ${amber ? 'bg-amber/60' : 'bg-cyan-300/60'}`}
                            style={{ left: 0, width: x(m.value) }} />
                          <span className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 ${mark}`}
                            style={{ left: x(m.value) }} />
                        </>
                      ) : (
                        <>
                          <span className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-cyan-300/40"
                            style={{ left: 0, width: x(m.low!) }} />
                          <span className="absolute top-0 h-full rounded-[3px] border-x-2 border-cyan-200 bg-cyan-300/45"
                            style={{ left: x(m.low!), width: `calc(${x(m.high! - m.low!)} + 2px)` }} />
                        </>
                      )}
                    </span>
                    <span aria-hidden className="relative mt-1 block h-4 text-[0.75rem] text-mute tabular-nums">
                      {ticks.map((t, k) => (
                        <span key={t} className="absolute"
                          style={{ left: x(t), transform: k === 0 ? 'none' : k === ticks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
                          {k === 0 ? '0' : `${t}${g.unit === 'pp' ? '' : '%'}`}
                        </span>
                      ))}
                    </span>
                    <span className="sr-only">: {spoken(m)} above the control group{m.period ? `, ${m.period.toLowerCase()}` : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div {...panel()} aria-live="polite"
        className="rounded-xl border border-edge bg-ink-800/80 p-5 sm:p-6 lg:sticky lg:top-24 focus-visible:outline-offset-2">
        <div className="mlabel text-mute">Selected measure</div>
        <div className="mt-1 font-display text-[1.05rem] font-semibold text-sand">{sel.label}</div>
        <div className={`mt-3 font-display text-[2rem] font-bold leading-none tabular-nums ${sel.unit === 'pp' ? 'text-amber' : 'text-cyan-300'}`}>
          {shown(sel)}
        </div>
        <div className="mt-1.5 text-[0.875rem] text-mute">
          {sel.value !== undefined ? 'A single reported figure' : 'A reported range, not a single figure'}, in {unitWord(sel.unit)}, above the control group
        </div>
        <dl className="mt-4 space-y-3 text-[0.9rem] leading-relaxed">
          {sel.period && <div><dt className="mlabel text-mute">Period</dt><dd className="mt-0.5 text-sand/90">{sel.period}</dd></div>}
          <div><dt className="mlabel text-mute">What it means</dt><dd className="mt-0.5 text-sand/90">{sel.meaning}</dd></div>
          {sel.caution && <div><dt className="mlabel text-mute">Read with care</dt><dd className="mt-0.5 text-sand/90">{sel.caution}</dd></div>}
        </dl>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- proportion dial */
/** A ring showing one reported proportion. Sweeps in on entry. */
export function ProportionRing({ value, caption, sub }:
  { value: number; caption: string; sub?: string }) {
  const { ref, play, reduced } = useEnter<SVGSVGElement>();
  const R = 46, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-5">
      <svg ref={ref} viewBox="0 0 110 110" className="h-28 w-28 shrink-0 -rotate-90" role="img"
        aria-label={`${value} percent. ${caption}`}>
        <circle cx="55" cy="55" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="9" />
        <motion.circle
          cx="55" cy="55" r={R} fill="none" stroke="rgb(var(--cyan-500))" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C}
          initial={reduced ? false : { strokeDashoffset: C }}
          animate={{ strokeDashoffset: play ? C * (1 - value / 100) : C }}
          transition={{ duration: reduced ? 0 : 1.25, delay: reduced ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div>
        <div className="t-stat text-cyan-300">{value}%</div>
        <p className="t-small mt-1.5 max-w-[32ch]">{caption}</p>
        {sub && <p className="t-micro mt-1.5 max-w-[36ch]">{sub}</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- step up */
/** Two fixed statutory rates with a step between them. Rises in on entry. */
export function StepRates({ steps, unit }:
  { steps: { period: string; value: number }[]; unit: string }) {
  const { ref, play, reduced } = useEnter<SVGSVGElement>();
  const [on, setOn] = useState<number | null>(null);
  const max = Math.max(...steps.map(s => s.value)) * 1.2;
  const W = 220, H = 178, PB = 34, PT = 16;
  const ih = H - PT - PB, bw = 54, gap = 44;

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[260px]" role="img"
        aria-label={steps.map(s => `${s.period}: ${s.value} ${unit}`).join('. ')}>
        {steps.map((s, i) => {
          const h = (s.value / max) * ih;
          const x = 30 + i * (bw + gap);
          return (
            <g key={s.period}
              onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}
              onFocus={() => setOn(i)} onBlur={() => setOn(null)}
              tabIndex={0} role="button" aria-label={`${s.period}: ${s.value} ${unit} of actual training expenses`}
              className="cursor-pointer outline-none">
              <rect x={x - 6} y={PT} width={bw + 12} height={ih + 4} fill={on === i ? 'rgb(var(--cyan-500) / 0.06)' : 'transparent'} rx="4" />
              <motion.rect
                x={x} width={bw} rx="3"
                fill={i === steps.length - 1 ? 'rgb(var(--cyan-500))' : 'rgb(var(--cyan-500) / 0.45)'}
                initial={reduced ? false : { height: 0, y: PT + ih }}
                animate={{ height: play ? h : 0, y: play ? PT + ih - h : PT + ih, opacity: on === null || on === i ? 1 : 0.55 }}
                transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : 0.15 + i * 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.text
                x={x + bw / 2} y={PT + ih - h - 7} fontSize="15" fontWeight="700" fill="rgb(var(--sand))" textAnchor="middle"
                initial={reduced ? false : { opacity: 0 }} animate={{ opacity: play ? 1 : 0 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.7 + i * 0.22 }}>
                {s.value}{unit}
              </motion.text>
              <text x={x + bw / 2} y={H - 10} fontSize="9.5" fill={on === i ? 'rgb(var(--cyan-200))' : 'rgb(var(--mute))'} textAnchor="middle">
                {s.period}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
