import { useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { Reveal, Sentences, Cite } from './primitives';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import {
  STAGES, STAGE_DIMENSIONS, GLOBAL_NETWORK, AUTOMATION_FLOW, AUTOMATION_OUTCOMES, PATHWAY,
  type Stage, type Sentence,
} from '../data/research';
import type { Media } from '../data/media';

/* ------------------------------------------------------------- photographs */

/**
 * A photograph with its credit. Width and height reserve the space before the
 * image arrives, so nothing moves when it loads. Below-the-fold images load lazily.
 */
export function Photo({ m, sizes, className = '', imgClassName = '' }:
  { m: Media; sizes: string; className?: string; imgClassName?: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <figure ref={ref} className={`m-0 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-edge bg-ink-800">
        <motion.img
          src={m.src} srcSet={m.srcSet} sizes={sizes} width={m.width} height={m.height}
          alt={m.alt} loading="lazy" decoding="async"
          className={`block h-auto w-full object-cover ${imgClassName}`}
          initial={reduced ? false : { opacity: 0, scale: 1.04 }}
          animate={reduced || inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
      <figcaption className="mt-2.5 text-[0.78rem] leading-snug text-mute">
        {m.caption} <span className="text-mute/90">Illustrative photograph: {m.creator}, {m.license}. Full credit in section L.</span>
      </figcaption>
    </figure>
  );
}

/* A wide photographic band that breaks the rhythm between text-heavy blocks. */
export function PhotoBand({ m, className = '' }: { m: Media; className?: string }) {
  return (
    <Photo m={m} className={className} sizes="(min-width: 1200px) 1136px, 100vw"
      imgClassName="aspect-[21/8] sm:aspect-[21/7]" />
  );
}

/* ---------------------------------------------------------- shared pieces */

/* An arrow that draws itself in when it enters view. Horizontal on wide screens. */
function Connector({ dir, label, className = '' }: { dir: 'right' | 'down' | 'up'; label?: string; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const horizontal = dir === 'right';
  return (
    <div ref={ref} className={`flex ${horizontal ? 'flex-col items-center justify-center' : 'flex-row items-center justify-center gap-3'} ${className}`}>
      <svg aria-hidden viewBox={horizontal ? '0 0 64 12' : '0 0 12 40'}
        className={horizontal ? 'h-3 w-full max-w-[72px]' : 'h-9 w-3'}>
        <motion.path
          d={horizontal ? 'M0 6 H58' : dir === 'down' ? 'M6 0 V34' : 'M6 40 V6'}
          stroke="rgba(52,209,212,0.7)" strokeWidth="1.5" fill="none"
          initial={reduced ? false : { pathLength: 0 }}
          animate={reduced || inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <path d={horizontal ? 'M56 1 L63 6 L56 11' : dir === 'down' ? 'M1 32 L6 39 L11 32' : 'M1 8 L6 1 L11 8'}
          stroke="rgba(52,209,212,0.9)" strokeWidth="1.5" fill="none" />
      </svg>
      {label && <span className="mlabel text-cyan-300/90 text-center leading-snug max-w-[11rem]">{label}</span>}
    </div>
  );
}

function Node({ title, body, accent = false, className = '' }:
  { title: string; body: Sentence[]; accent?: boolean; className?: string }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-accent-bright/40 bg-cyan-500/[0.06]' : 'border-edge bg-ink-700/70'} ${className}`}>
      <div className={`font-display text-[0.98rem] font-semibold leading-snug ${accent ? 'text-cyan-200' : 'text-sand'}`}>{title}</div>
      <p className="mt-1.5 text-[0.82rem] leading-relaxed text-sand/80"><Sentences items={body} /></p>
    </div>
  );
}

/* ---------------------------------------------- globalization network (A) */

/**
 * Who influences whom. The paragraph above the diagram is its full text
 * equivalent, so the diagram adds structure rather than new claims.
 * Two layouts of the same nodes: a network on wide screens, a sequence on phones.
 */
export function GlobalNetwork() {
  const n = GLOBAL_NETWORK;
  return (
    <figure className="m-0 mt-8" aria-labelledby="globalnet-cap">
      {/* wide screens: clients and workers either side of the providers, pressures above and below */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1.15fr_auto_1fr] grid-rows-[auto_auto_auto_auto_auto] gap-x-3 items-stretch">
        <div className="col-start-3 row-start-1"><Reveal><Node {...n.competitors} /></Reveal></div>
        <div className="col-start-5 row-start-1"><Reveal delay={0.1}><Node {...n.skills} /></Reveal></div>
        <Connector dir="down" label={n.edges.competitorsToHub} className="col-start-3 row-start-2 py-2" />
        <Connector dir="down" label={n.edges.skillsToWorkers} className="col-start-5 row-start-2 py-2" />
        <div className="col-start-1 row-start-3 self-center"><Reveal><Node {...n.clients} /></Reveal></div>
        <Connector dir="right" label={n.edges.clientsToHub} className="col-start-2 row-start-3 w-[8.5rem]" />
        <div className="col-start-3 row-start-3"><Reveal delay={0.05}><Node {...n.hub} accent className="h-full" /></Reveal></div>
        <Connector dir="right" label={n.edges.hubToWorkers} className="col-start-4 row-start-3 w-[8.5rem]" />
        <div className="col-start-5 row-start-3 self-center"><Reveal delay={0.1}><Node {...n.workers} accent /></Reveal></div>
        <Connector dir="up" label={n.edges.techToHub} className="col-start-3 row-start-4 py-2" />
        <div className="col-start-3 row-start-5"><Reveal delay={0.15}><Node {...n.tech} /></Reveal></div>
      </div>

      {/* phones and tablets: the same relationships as a sequence */}
      <ol className="lg:hidden space-y-2" aria-label="Globalization relationships, in order">
        <li><Node {...n.clients} /></li>
        <li><Connector dir="down" label={n.edges.clientsToHub} /></li>
        <li><Node {...n.hub} accent /></li>
        <li className="grid sm:grid-cols-2 gap-2" aria-label="Also acting on the providers">
          <div><Connector dir="up" label={n.edges.competitorsToHub} /><Node {...n.competitors} /></div>
          <div><Connector dir="up" label={n.edges.techToHub} /><Node {...n.tech} /></div>
        </li>
        <li><Connector dir="down" label={n.edges.hubToWorkers} /></li>
        <li><Node {...n.workers} accent /></li>
        <li><Connector dir="up" label={n.edges.skillsToWorkers} /></li>
        <li><Node {...n.skills} /></li>
      </ol>

      <figcaption id="globalnet-cap" className="t-micro mt-4 max-w-reading">
        Diagram. International clients and global competition shape what Philippine IT-BPM providers do,
        technology adoption changes the work inside them, and the skills demanded of Filipino workers
        shift with it. Arrows show the direction of influence described in the sources cited; the
        paragraph above gives the full explanation.
      </figcaption>
    </figure>
  );
}

/* ----------------------------------------------- automation mechanism (B) */

export function AutomationMechanism() {
  return (
    <figure className="m-0" aria-labelledby="mech-cap">
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-1 lg:gap-2">
        {AUTOMATION_FLOW.map((step, i) => (
          <div key={step.title} className="contents">
            <Reveal delay={i * 0.08} className="lg:flex-1">
              <div className="h-full rounded-xl border border-edge bg-ink-700/70 p-4">
                <div className="mlabel text-mute">Step {i + 1}</div>
                <div className="mt-1 font-display text-[0.98rem] font-semibold text-sand">{step.title}</div>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-sand/80"><Sentences items={step.body} /></p>
              </div>
            </Reveal>
            <Connector dir="right" className="hidden lg:flex w-10 shrink-0" />
            <Connector dir="down" className="lg:hidden" />
          </div>
        ))}
        <Reveal delay={0.3} className="lg:flex-[1.35]">
          <div className="h-full rounded-xl border border-accent-bright/35 bg-cyan-500/[0.05] p-4">
            <div className="mlabel text-mute">Step 4</div>
            <div className="mt-1 font-display text-[0.98rem] font-semibold text-cyan-200">Possible outcomes for workers</div>
            <ul className="mt-2 space-y-2.5">
              {AUTOMATION_OUTCOMES.map(o => (
                <li key={o.label} className={`border-l-2 pl-3 ${
                  o.tone === 'cyan' ? 'border-l-cyan-400/70' : o.tone === 'amber' ? 'border-l-amber/70' : 'border-l-line'}`}>
                  <div className={`text-[0.86rem] font-semibold ${o.tone === 'amber' ? 'text-amber' : 'text-sand'}`}>{o.label}</div>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed text-sand/80"><Sentences items={o.body} /></p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <p className="mt-4 rounded-lg border-l-2 border-l-cyan-400/70 bg-cyan-500/[0.05] px-4 py-3 text-[0.9rem] leading-relaxed text-sand">
        <strong className="font-semibold">Task exposure is not job loss.</strong> An exposed occupation is one in which some tasks
        can be automated. Whether a worker’s job changes, grows or is lost depends on what employers and
        policy do next <Cite keys={['ilo2026a']} />, which is the question the rest of this research takes up.
      </p>
      <figcaption id="mech-cap" className="t-micro mt-3 max-w-reading">
        Diagram. How adoption leads, through changing tasks and skills, to a range of possible outcomes.
        It assigns no probabilities beyond the figures cited.
      </figcaption>
    </figure>
  );
}

/* ----------------------------------------------- proposed pathway (F to G) */

export function ProposedPathway() {
  return (
    <figure className="m-0" aria-labelledby="pathway-cap">
      <ol className="grid gap-2 lg:grid-cols-[repeat(5,minmax(0,1fr))] lg:gap-3">
        {PATHWAY.map((p, i) => (
          <Reveal key={p.part} as="li" delay={i * 0.07}>
            <div className="relative h-full rounded-xl border border-edge bg-ink-700/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full border border-accent-bright/50 bg-cyan-500/10 font-mono text-[0.78rem] text-cyan-200">{p.part}</span>
                <a href="#journey" className="mlabel text-cyan-300/90 underline decoration-dotted underline-offset-2 hover:text-cyan-200">
                  {p.steps.length > 1 ? `Steps ${p.steps.join(' and ')}` : `Step ${p.steps[0]}`}
                </a>
              </div>
              <div className="mt-3 font-display text-[0.95rem] font-semibold leading-snug text-sand">{p.title}</div>
              <p className="mt-1.5 text-[0.82rem] leading-relaxed text-sand/80"><Sentences items={p.body} /></p>
            </div>
          </Reveal>
        ))}
      </ol>
      <figcaption id="pathway-cap" className="t-micro mt-3 max-w-reading">
        The proposed track in five parts. Each part links to the matching steps of the illustrative
        worker journey in section G. A proposal: no agency has agreed to it.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------- before, present, future (A) */

/* Schematic illustrations. Decorative: the text beside them carries the meaning. */
const STAGE_ART: Record<Stage['key'], ReactNode> = {
  before: (
    <svg viewBox="0 0 64 40" aria-hidden className="h-10 w-16">
      <rect x="6" y="8" width="20" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 15h12M10 20h12M10 25h8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M40 22a8 8 0 0 1 16 0v6M38 26h4v6h-4zM54 26h4v6h-4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  present: (
    <svg viewBox="0 0 64 40" aria-hidden className="h-10 w-16">
      <path d="M8 22a8 8 0 0 1 16 0v6M6 26h4v6H6zM22 26h4v6h-4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M28 21h8" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
      <rect x="38" y="11" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M47 15v10M42 20h10M43.5 16.5l7 7M50.5 16.5l-7 7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  future: (
    <svg viewBox="0 0 64 40" aria-hidden className="h-10 w-16">
      <path d="M6 32h12V24h12V16h12V8h14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M52 4l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="28" r="2" fill="currentColor" />
    </svg>
  ),
};

/**
 * Three stages compared on the same five dimensions. On wide screens all three
 * are visible together and the controls only change which one is emphasised.
 * On narrow screens one stage shows at a time, and "Show all three stages"
 * gives the complete comparison, so nothing is reachable only by switching.
 */
export function TransitionStages() {
  const [active, setActive] = useState<Stage['key']>('present');
  const [showAll, setShowAll] = useState(false);
  const reduced = usePrefersReducedMotion();
  return (
    <div className="mt-12">
      <div className="eyebrow">Before, present and future</div>
      <h3 className="mt-3 font-display text-sub text-sand">How the work has changed, and how workers could adapt</h3>
      <p className="t-lede mt-3">
        A summary of findings from sections B to H. The first two stages describe what the sources
        report. The third is the proposed response and is not a forecast.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a stage to emphasise">
        {STAGES.map(s => {
          const on = active === s.key;
          return (
            <button key={s.key} type="button" aria-pressed={on} aria-controls={`stage-${s.key}`}
              onClick={() => setActive(s.key)}
              className={`relative flex items-center gap-3 rounded-full border px-4 py-2 transition-colors ${
                on ? 'border-accent-bright/60 text-cyan-200' : 'border-edge text-mute hover:text-sand'}`}>
              {on && !reduced && (
                <motion.span layoutId="stage-pill" className="absolute inset-0 rounded-full bg-cyan-500/10"
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} />
              )}
              {on && reduced && <span className="absolute inset-0 rounded-full bg-cyan-500/10" />}
              <span className="relative font-mono text-[0.72rem] uppercase tracking-[0.08em]">{s.label}</span>
              <span className="relative hidden sm:inline text-[0.84rem]">{s.title}</span>
            </button>
          );
        })}
        <button type="button" onClick={() => setShowAll(v => !v)} aria-expanded={showAll}
          className="lg:hidden rounded-full border border-edge px-4 py-2 text-[0.84rem] text-sand hover:text-cyan-200">
          {showAll ? 'Show one stage at a time' : 'Show all three stages'}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_repeat(5,auto)] lg:gap-x-4 lg:gap-y-0">
        {STAGES.map(s => {
          const on = active === s.key;
          return (
            /* A labelled group, not a <section>: three extra landmarks would clutter
               screen-reader navigation for what is one comparison. */
            <div key={s.key} id={`stage-${s.key}`} role="group" aria-labelledby={`stage-${s.key}-h`}
              className={`${on || showAll ? '' : 'hidden lg:grid'} rounded-xl border p-5 transition-colors lg:row-span-6 lg:grid lg:grid-rows-subgrid ${
                on ? 'border-accent-bright/50 bg-cyan-500/[0.05]' : 'border-edge bg-ink-700/60'}`}>
              <header className="flex items-start justify-between gap-3 pb-3">
                <div>
                  <div className={`font-mono text-[0.72rem] uppercase tracking-[0.08em] ${s.key === 'future' ? 'text-amber' : 'text-cyan-300'}`}>
                    {s.label}{s.key === 'future' && ' · proposed'}
                  </div>
                  <h4 id={`stage-${s.key}-h`} className="mt-1 font-display text-[1.05rem] font-semibold text-sand">{s.title}</h4>
                  <p className="mt-1 text-[0.78rem] leading-snug text-mute">{s.note}</p>
                </div>
                <span className={on ? 'text-cyan-300' : 'text-mute/80'}>{STAGE_ART[s.key]}</span>
              </header>
              {STAGE_DIMENSIONS.map(d => (
                <div key={d.key} className="border-t border-line/70 py-3">
                  <div className="mlabel text-mute">{d.label}</div>
                  <p className="mt-1 text-[0.86rem] leading-relaxed text-sand/90"><Sentences items={s.cells[d.key]} /></p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <p className="t-micro mt-3">Icons are schematic illustrations, not depictions of real workplaces.</p>
    </div>
  );
}
