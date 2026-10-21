import { useId, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';

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
                <span className={`font-display text-[0.95rem] font-bold tabular-nums transition-colors ${
                  on ? 'text-cyan-200' : tone === 'amber' ? 'text-amber' : 'text-cyan-300'}`}>
                  {d.floor ? '>' : ''}{d.value}{d.unit ?? unit}
                </span>
              </span>
              <span className="mt-1.5 block h-2.5 w-full rounded-full bg-ink-600/70 overflow-hidden">
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
              stroke="rgba(148,180,210,0.25)" strokeWidth="0.3" />
            <text x={(t / max) * W} y="5.6" fontSize="3.4" fill="#8FA6BF"
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

/* --------------------------------------------------- progressive line draw */
/**
 * The Singapore wage effect. A flat segment for the placement year, then a
 * shaded band for the four years after it, because the source reports a range
 * for that period rather than a yearly series. The path draws itself in.
 */
export function WageTrajectory({ placement, after, axisMax, unit }:
  { placement: { label: string; value: number }; after: { label: string; low: number; high: number };
    axisMax: number; unit: string }) {
  const { ref, play, reduced } = useEnter<SVGSVGElement>();
  const [hover, setHover] = useState<'p' | 'a' | null>(null);

  const W = 320, H = 170, PL = 40, PR = 14, PT = 14, PB = 32;
  const iw = W - PL - PR, ih = H - PT - PB;
  const y = (v: number) => PT + ih - (v / axisMax) * ih;
  const xA = PL, xB = PL + iw * 0.38, xC = PL + iw;

  const bandTop = y(after.high), bandBot = y(after.low);
  /* A 0.7 point range is only a few pixels tall, so the drawn band is padded to stay
     legible as a band. The edge labels carry the actual reported numbers. */
  const step = `M ${xA} ${y(placement.value)} L ${xB} ${y(placement.value)}`;
  const riser = `M ${xB} ${y(placement.value)} L ${xB} ${(bandTop + bandBot) / 2}`;
  const mid = `M ${xB} ${(bandTop + bandBot) / 2} L ${xC} ${(bandTop + bandBot) / 2}`;
  const gridVals = [0, 2, 4, 6, 8].filter(v => v <= axisMax);

  const dash = { strokeDasharray: 1, strokeDashoffset: 1, pathLength: 1 } as const;

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={`Wage effect against control groups. In the placement year, ${placement.value} percent. Over the next four years, between ${after.low} and ${after.high} percent, shown as a band because the source reports a range.`}>
        <defs>
          <linearGradient id="bandFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {gridVals.map(v => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="rgba(148,180,210,0.12)" strokeWidth="1" />
            <text x={PL - 8} y={y(v) + 4} fontSize="10" fill="#8FA6BF" textAnchor="end">{v}{unit}</text>
          </g>
        ))}

        {/* the range band for the later period */}
        <motion.rect
          x={xB} y={bandTop} width={xC - xB} height={Math.max(9, bandBot - bandTop)}
          fill="url(#bandFill)" stroke="rgba(34,211,238,0.45)" strokeWidth="1" rx="2"
          initial={reduced ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: play ? (hover === 'a' ? 1 : 0.9) : 0, scaleX: play ? 1 : 0 }}
          style={{ transformOrigin: `${xB}px center` }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 1.05, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* the measured step, drawn progressively */}
        {[step, riser, mid].map((d, i) => (
          <motion.path
            key={i} d={d} fill="none" stroke="#67E8F9" strokeWidth="2.4"
            strokeLinecap="round" strokeDasharray={i === 1 ? '4 4' : undefined}
            initial={reduced ? false : dash}
            animate={play ? { pathLength: 1, strokeDashoffset: 0, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.25 + i * 0.35, ease: 'easeInOut' }}
          />
        ))}

        {/* measured points */}
        <motion.circle cx={xA + 1} cy={y(placement.value)} r={hover === 'p' ? 6 : 4.5}
          fill="#050B16" stroke="#67E8F9" strokeWidth="2.4"
          initial={reduced ? false : { opacity: 0 }} animate={{ opacity: play ? 1 : 0 }}
          transition={{ duration: 0.3, delay: reduced ? 0 : 0.5 }} />

        {/* hit areas: hover, and tab order via tabIndex */}
        <rect x={PL} y={PT} width={xB - PL} height={ih} fill="transparent"
          tabIndex={0} role="button" aria-label={`${placement.label}: ${placement.value}${unit} above control groups`}
          onMouseEnter={() => setHover('p')} onMouseLeave={() => setHover(null)}
          onFocus={() => setHover('p')} onBlur={() => setHover(null)}
          className="cursor-pointer outline-none" />
        <rect x={xB} y={PT} width={xC - xB} height={ih} fill="transparent"
          tabIndex={0} role="button" aria-label={`${after.label}: between ${after.low} and ${after.high}${unit} above control groups`}
          onMouseEnter={() => setHover('a')} onMouseLeave={() => setHover(null)}
          onFocus={() => setHover('a')} onBlur={() => setHover(null)}
          className="cursor-pointer outline-none" />
        {hover && (
          <rect x={hover === 'p' ? PL : xB} y={PT} width={hover === 'p' ? xB - PL : xC - xB} height={ih}
            fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.35)" strokeWidth="1" rx="3" className="inert" />
        )}

        {/* The band's edges are the two reported numbers, so label them. */}
        {([['high', after.high, bandTop - 4], ['low', after.low, bandBot + 10]] as const).map(([k, v, yy]) => (
          <motion.text
            key={k} x={xC - 4} y={yy} fontSize="10" fontWeight="600" fill="#A5F3FC" textAnchor="end"
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: play ? 0.95 : 0 }}
            transition={{ duration: 0.35, delay: reduced ? 0 : 1.5 }}
          >{v}{unit}</motion.text>
        ))}
        <motion.text
          x={xA + 7} y={y(placement.value) - 9} fontSize="10" fontWeight="600" fill="#A5F3FC" textAnchor="start"
          initial={reduced ? false : { opacity: 0 }} animate={{ opacity: play ? 0.95 : 0 }}
          transition={{ duration: 0.35, delay: reduced ? 0 : 0.75 }}
        >{placement.value}{unit}</motion.text>

        <text x={(PL + xB) / 2} y={H - 10} fontSize="10" fill={hover === 'p' ? '#A5F3FC' : '#8FA6BF'} textAnchor="middle">
          {placement.label}
        </text>
        <text x={(xB + xC) / 2} y={H - 10} fontSize="10" fill={hover === 'a' ? '#A5F3FC' : '#8FA6BF'} textAnchor="middle">
          {after.label}
        </text>
      </svg>

      <div aria-live="polite" className="mt-2 min-h-[1.6rem]">
        {hover === 'p' && <p className="t-micro">Placement year: {placement.value}{unit} above the control group.</p>}
        {hover === 'a' && <p className="t-micro">The four years after: between {after.low}{unit} and {after.high}{unit}. The source gives a range, not a figure per year.</p>}
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
        <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(148,180,210,0.16)" strokeWidth="9" />
        <motion.circle
          cx="55" cy="55" r={R} fill="none" stroke="#22D3EE" strokeWidth="9" strokeLinecap="round"
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
              <rect x={x - 6} y={PT} width={bw + 12} height={ih + 4} fill={on === i ? 'rgba(34,211,238,0.06)' : 'transparent'} rx="4" />
              <motion.rect
                x={x} width={bw} rx="3"
                fill={i === steps.length - 1 ? '#22D3EE' : '#0891B2'}
                initial={reduced ? false : { height: 0, y: PT + ih }}
                animate={{ height: play ? h : 0, y: play ? PT + ih - h : PT + ih, opacity: on === null || on === i ? 1 : 0.55 }}
                transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : 0.15 + i * 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.text
                x={x + bw / 2} y={PT + ih - h - 7} fontSize="15" fontWeight="700" fill="#A5F3FC" textAnchor="middle"
                initial={reduced ? false : { opacity: 0 }} animate={{ opacity: play ? 1 : 0 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.7 + i * 0.22 }}>
                {s.value}{unit}
              </motion.text>
              <text x={x + bw / 2} y={H - 10} fontSize="9.5" fill={on === i ? '#A5F3FC' : '#8FA6BF'} textAnchor="middle">
                {s.period}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
