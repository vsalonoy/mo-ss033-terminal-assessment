/**
 * Evidence charts. Every figure is read from src/data/research.ts, and each chart
 * states what its number is a share of, so it cannot be misread:
 *  - exposure and highest-risk are both shares of ALL Philippine jobs (ILO brief),
 *    drawn on identical grids side by side, never nested;
 *  - floors ("more than", "exceeds") are drawn at the floor and marked open-ended;
 *  - legal provisions are a dated schedule, not a trend;
 *  - SMART targets are dashed outlines, never filled progress.
 */
import { interpolate, useCurrentFrame } from 'remotion';
import { EBET_DEDUCTION, EXPOSURE_BY_REGION, EXPOSURE_VS_ASEAN, HEADLINE_STATS } from '../../src/data/research';
import { C, F } from './theme';
import { In, P } from './ui';

const ease = (f: number, at: number, len = 24) =>
  interpolate(f, [at, at + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** A 1,000-cell grid: 40 columns by 25 rows, filled in reading order. */
function Grid({ filled, color, at }: { filled: number; color: string; at: number }) {
  const f = useCurrentFrame();
  const shown = Math.round(filled * ease(f, at, 36));
  return (
    <svg viewBox="0 0 400 250" width={720} height={450} aria-hidden>
      {Array.from({ length: 1000 }, (_, i) => (
        <rect key={i} x={(i % 40) * 10 + 1} y={Math.floor(i / 40) * 10 + 1} width={8} height={8} rx={1.5}
          fill={i < shown ? color : 'rgba(148,180,210,0.13)'} />
      ))}
    </svg>
  );
}

/** C1 and C2: exposure and highest displacement risk, both as shares of all jobs. */
export function ExposureGrids({ dur }: { dur: number }) {
  const [exposed, risk] = HEADLINE_STATS;
  const floor = EXPOSURE_VS_ASEAN.find(x => x.floor)!;   // 25: "more than one quarter"
  const a2 = Math.round(dur * 0.55);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
      <In>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase' }}>Each square: 0.1% of all jobs in the Philippines</div>
        <div style={{ marginTop: 12 }}><Grid filled={floor.value * 10} color={C.cyan400} at={6} /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6 }}>
          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.cyan300 }}>{exposed.value}</span>
          <P size={27}>workers, more than a quarter of all jobs, are in occupations exposed to generative AI</P>
        </div>
        <P size={22} color={C.mute} style={{ marginTop: 4 }}>Drawn at 25%, the floor of “more than a quarter”. Exposed means some tasks could be automated.</P>
      </In>
      <In at={a2}>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase' }}>Same scale: all jobs in the Philippines</div>
        <div style={{ marginTop: 12 }}><Grid filled={36} color={C.amber} at={a2 + 6} /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6 }}>
          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.amber }}>{risk.value}</span>
          <P size={27}>of all jobs are in the highest exposure category, with elevated displacement risk</P>
        </div>
        <P size={22} color={C.mute} style={{ marginTop: 4 }}>A share of all jobs, not of the 12.7 million.</P>
      </In>
    </div>
  );
}

/** C3: exposure by region. Values reported only as floors are marked open-ended. */
export function RegionBars({ at }: { at: number }) {
  const f = useCurrentFrame();
  const max = 50, w = 560;
  return (
    <div>
      <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase' }}>Share of jobs exposed, by region</div>
      <div style={{ marginTop: 18, display: 'grid', gap: 18 }}>
        {EXPOSURE_BY_REGION.map((r, i) => {
          const t = ease(f, at + i * 10);
          const open = /Exceeds/.test(r.note);
          const x = (r.value / max) * w;
          return (
            <div key={r.name}>
              <P size={27}>{r.name}</P>
              <div style={{ position: 'relative', height: 38, marginTop: 6, width: w + 220 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: 38, width: w, background: 'rgba(148,180,210,0.10)', borderRadius: 6 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, height: 38, width: x * t, background: C.cyan400, borderRadius: 6 }} />
                {open && <div style={{ position: 'absolute', left: x, top: 0, height: 32, width: 56 * t,
                  borderTop: `3px dashed ${C.cyan400}`, borderBottom: `3px dashed ${C.cyan400}` }} />}
                <span style={{ position: 'absolute', left: x + (open ? 70 : 14), top: 1, opacity: t,
                  fontFamily: F.display, fontWeight: 700, fontSize: 28, color: C.cyan300, whiteSpace: 'nowrap' }}>{open ? `more than ${r.value}%` : `about ${r.value}%`}</span>
              </div>
            </div>
          );
        })}
      </div>
      <P size={21} color={C.mute} style={{ marginTop: 12 }}>NCR: “around two in five” jobs. Dashed ends: reported only as “exceeds 30 percent”.</P>
    </div>
  );
}

/** C6: the existing IT-BPM funding commitment. Sector context, not a budget for the proposal. */
export function FundingHorizon({ at }: { at: number }) {
  const f = useCurrentFrame();
  const t = ease(f, at, 30);
  const w = 560;
  return (
    <div>
      <div style={{ fontFamily: F.mono, fontSize: 20, color: C.mute, textTransform: 'uppercase' }}>Existing sector funding · context only</div>
      <div style={{ position: 'relative', height: 60, width: w, marginTop: 10 }}>
        <div style={{ position: 'absolute', left: 0, top: 8, height: 44, width: w * 0.72 * t, background: 'rgba(34,211,238,0.22)', border: `2px solid ${C.cyan400}`, borderRadius: 6 }} />
        <div style={{ position: 'absolute', left: w * 0.72, top: 8, height: 38, width: w * 0.28, borderTop: `3px dashed ${C.rose}`, borderBottom: `3px dashed ${C.rose}`, opacity: t }} />
        <span style={{ position: 'absolute', left: 14, top: 16, fontFamily: F.display, fontWeight: 700, fontSize: 23, color: C.white, opacity: t }}>₱740M · from H2 2025 · three years</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: w, fontFamily: F.mono, fontSize: 18, color: C.mute, marginTop: 4 }}>
        <span>2025</span><span style={{ color: C.rose }}>then: no standing line found</span>
      </div>
      <P size={21} color={C.amber} style={{ marginTop: 8 }}>Government upskilling commitment for the IT-BPM sector. Not a budget for the proposed track.</P>
    </div>
  );
}

/** C7: RA 12063 Section 20 as a dated legal schedule, not a trend. */
export function StatuteSchedule({ at }: { at: number }) {
  const [now, later] = EBET_DEDUCTION.steps;
  const rows = [
    { when: `Until 31 Dec 2027`, v: now.value },
    { when: `From 1 Jan 2028`, v: later.value },
  ];
  return (
    <div>
      <div style={{ fontFamily: F.mono, fontSize: 20, color: C.mute, textTransform: 'uppercase' }}>RA 12063, Section 20 · what the law provides</div>
      <In at={at} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
        {rows.map(s => (
          <div key={s.when} style={{ border: `2px solid ${C.edge}`, borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ fontFamily: F.mono, fontSize: 18, color: C.mute }}>{s.when.toUpperCase()}</div>
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 38, color: C.sand, marginTop: 2 }}>{s.v}%</div>
            <div style={{ fontSize: 19, color: C.mute }}>of actual training expenses</div>
          </div>
        ))}
      </In>
      <P size={20} color={C.mute} style={{ marginTop: 8 }}>An additional tax deduction for enterprises running a registered, TESDA-certified EBET programme. Capped at the lower of 5% of total direct labour expenses or ₱25 million a year.</P>
    </div>
  );
}

/** C8: a planning target, drawn as a dashed outline so it never reads as progress. */
export function TargetRing({ value, at }: { value: string; at: number }) {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 100 100" width={80} height={80} style={{ opacity: ease(f, at, 18), flexShrink: 0 }} aria-hidden>
      <circle cx="50" cy="50" r="44" fill="none" stroke={C.amber} strokeWidth="5" strokeDasharray="10 7" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Space Grotesk Variable" fontWeight="800" fontSize="27" fill={C.amber}>{value}</text>
    </svg>
  );
}

/** C8: thirty participating firms as thirty empty outlines (none has agreed). */
export function TargetDots({ n, at }: { n: number; at: number }) {
  const f = useCurrentFrame();
  const shown = Math.round(n * ease(f, at, 30));
  return (
    <svg viewBox="0 0 240 34" width={336} height={48} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={(i % 15) * 16 + 8} cy={Math.floor(i / 15) * 17 + 8} r={6} fill="none"
          stroke={C.amber} strokeWidth={2} strokeDasharray="3 2" opacity={i < shown ? 1 : 0} />
      ))}
    </svg>
  );
}
