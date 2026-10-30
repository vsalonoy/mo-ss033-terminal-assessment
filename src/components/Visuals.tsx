import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { Reveal, Sentences, Cite } from './primitives';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { useTabs } from '../hooks/useTabs';
import {
  STAGES, STAGE_DIMENSIONS, GLOBAL_NETWORK, AUTOMATION_FLOW, AUTOMATION_OUTCOMES, PATHWAY,
  type Stage,
} from '../data/research';
import type { Media } from '../data/media';

/* ------------------------------------------------------------- photographs */

/**
 * A photograph with its credit. Width and height reserve the space before the
 * image arrives, so nothing moves when it loads. Below-the-fold images load lazily.
 *
 * The image is a button that opens it enlarged, uncropped, with its full credit.
 * The enlarged copy is only requested when it is opened.
 */
export function Photo({ m, sizes, className = '', imgClassName = '', style }:
  { m: Media; sizes: string; className?: string; imgClassName?: string; style?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <figure className={`m-0 ${className}`} style={style}>
      <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
        aria-label={`Enlarge photograph: ${m.alt}`}
        className="group relative block w-full overflow-hidden rounded-[14px] border border-line bg-ink-800 text-left
                   cursor-zoom-in focus-visible:outline-offset-4">
        <img
          src={m.src} srcSet={m.srcSet} sizes={sizes} width={m.width} height={m.height}
          alt={m.alt} loading="lazy" decoding="async"
          className={`block h-auto w-full object-cover ${imgClassName}`}
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/25
                         bg-[rgb(11_15_20/0.78)] px-3 py-1.5 text-[0.875rem] font-medium text-white transition-colors
                         group-hover:border-white/60 group-focus-visible:border-white/60">
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
          </svg>
          Enlarge
        </span>
      </button>
      <figcaption className="mt-2.5 text-[0.875rem] leading-snug text-mute">
        {m.caption} <span>Illustrative photograph: {m.creator}, {m.license}. Full credit in Sources.</span>
      </figcaption>
      <Lightbox m={m} open={open} onClose={() => { setOpen(false); trigger.current?.focus(); }} />
    </figure>
  );
}

/**
 * The enlarged view: the whole photograph, uncropped, fitted to the screen, with
 * its full credit. A native modal dialog, so Escape closes it, focus stays inside,
 * and the page behind cannot be reached. Clicking outside the photograph closes it.
 */
function Lightbox({ m, open, onClose }: { m: Media; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const cap = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); close.current?.focus(); }
    else if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={cap} className="lightbox" onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {open && (
        <div className="flex min-h-full items-center justify-center p-4 sm:p-8"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <figure className="m-0 flex max-w-[min(100%,1600px)] flex-col items-center">
            <img src={m.src} width={m.width} height={m.height} alt={m.alt} decoding="async"
              className="block h-auto max-h-[calc(100dvh-13rem)] w-auto max-w-full rounded-lg object-contain" />
            <figcaption id={cap} className="mt-4 max-w-reading self-stretch text-[0.875rem] leading-relaxed text-white/90 sm:self-auto">
              {m.caption}
              <span className="mt-1.5 block text-[0.875rem] text-white/75">
                Illustrative photograph. “{m.title}” by {m.creator},{' '}
                {m.licenseUrl
                  ? <a href={m.licenseUrl} className="underline decoration-dotted underline-offset-2 hover:text-cyan-200">{m.license}</a>
                  : m.license}
                , via <a href={m.source} className="underline decoration-dotted underline-offset-2 hover:text-cyan-200">Wikimedia Commons</a>. {m.adapted}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
      <button ref={close} type="button" onClick={onClose} aria-label="Close enlarged photograph"
        className="btn fixed right-4 top-4 z-10 border border-white/30 bg-[rgb(11_15_20/0.8)] text-white hover:border-white/70 sm:right-6 sm:top-6">
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
        Close
      </button>
    </dialog>
  );
}

/**
 * A wide photographic band that breaks the rhythm between text-heavy blocks.
 * On large monitors it widens past the reading column, but never beyond the
 * image's own width, so it is not upscaled.
 */
export function PhotoBand({ m, className = '' }: { m: Media; className?: string }) {
  return (
    <Photo m={m} className={`bleed ${className}`} style={{ '--bleed-max': `${Math.min(1520, m.width)}px` } as React.CSSProperties}
      sizes={`(min-width: 1280px) min(calc(100vw - 4rem), ${Math.min(1520, m.width)}px), calc(100vw - 2.5rem)`}
      imgClassName="aspect-[21/8] sm:aspect-[21/7]" />
  );
}

/* ---------------------------------------------------------- shared pieces */

type Emphasis = 'normal' | 'on' | 'off';

/* An arrow that draws itself in when it enters view. Horizontal on wide screens.
   'on' marks a connection of the selected item; 'off' recedes the rest. */
function Connector({ dir, label, emphasis = 'normal', className = '' }:
  { dir: 'right' | 'down' | 'up'; label?: string; emphasis?: Emphasis; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const horizontal = dir === 'right';
  const stroke = emphasis === 'on' ? 'rgb(var(--cyan-500))' : emphasis === 'off' ? 'rgb(var(--cyan-500) / 0.25)' : 'rgb(var(--cyan-500) / 0.7)';
  return (
    <div ref={ref} aria-hidden className={`flex ${horizontal ? 'flex-col items-center justify-center' : 'flex-row items-center justify-center gap-3'} ${className}`}>
      <svg viewBox={horizontal ? '0 0 64 12' : '0 0 12 40'}
        className={horizontal ? 'h-3 w-full max-w-[72px]' : 'h-9 w-3'}>
        <motion.path
          d={horizontal ? 'M0 6 H58' : dir === 'down' ? 'M6 0 V34' : 'M6 40 V6'}
          stroke={stroke} strokeWidth={emphasis === 'on' ? 2.2 : 1.5} fill="none"
          initial={reduced ? false : { pathLength: 0 }}
          animate={reduced || inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <path d={horizontal ? 'M56 1 L63 6 L56 11' : dir === 'down' ? 'M1 32 L6 39 L11 32' : 'M1 8 L6 1 L11 8'}
          stroke={stroke} strokeWidth={emphasis === 'on' ? 2.2 : 1.5} fill="none" />
      </svg>
      {label && (
        <span className={`mlabel text-center leading-snug max-w-[11rem] transition-colors ${
          emphasis === 'on' ? 'text-cyan-200' : emphasis === 'off' ? 'text-mute' : 'text-cyan-300/90'}`}>{label}</span>
      )}
    </div>
  );
}

/* ---------------------------------------------- globalization network (A) */

type NetKey = 'clients' | 'competitors' | 'tech' | 'hub' | 'workers' | 'skills';
type EdgeKey = keyof typeof GLOBAL_NETWORK.edges;

/* The relationships the diagram already draws, as data: who acts on whom. */
const NET_EDGES: { key: EdgeKey; from: NetKey; to: NetKey }[] = [
  { key: 'clientsToHub', from: 'clients', to: 'hub' },
  { key: 'competitorsToHub', from: 'competitors', to: 'hub' },
  { key: 'techToHub', from: 'tech', to: 'hub' },
  { key: 'hubToWorkers', from: 'hub', to: 'workers' },
  { key: 'skillsToWorkers', from: 'skills', to: 'workers' },
];

/* Where each part sits in the diagram. A label for reading the layout, not a claim. */
const NET_ROLE: Record<NetKey, 'input' | 'hub' | 'worker'> = {
  clients: 'input', competitors: 'input', tech: 'input', hub: 'hub', workers: 'worker', skills: 'worker',
};
const ROLE_LABEL = { input: 'Acts on the industry', hub: 'The industry', worker: 'The worker side' } as const;
const ROLE_STYLE = {
  input:  { idle: 'border-edge bg-ink-700/70', on: 'border-cyan-300/80 bg-cyan-500/[0.08]', label: 'text-mute' },
  hub:    { idle: 'border-accent-bright/40 bg-cyan-500/[0.06]', on: 'border-cyan-300/80 bg-cyan-500/[0.12]', label: 'text-cyan-300' },
  worker: { idle: 'border-iris-400/35 bg-iris-500/[0.06]', on: 'border-cyan-300/80 bg-iris-500/[0.12]', label: 'text-iris-300' },
} as const;

const title = (k: NetKey) => GLOBAL_NETWORK[k].title;

function NetNode({ k, selected, related, onToggle, className = '' }:
  { k: NetKey; selected: NetKey | null; related: boolean; onToggle: (k: NetKey) => void; className?: string }) {
  const n = GLOBAL_NETWORK[k];
  const role = NET_ROLE[k];
  const on = selected === k;
  const style = ROLE_STYLE[role];
  return (
    <div className={`h-full rounded-xl border p-4 transition-[border-color,background-color,opacity] duration-200 ${
      on ? `${style.on} ring-1 ring-cyan-300/50` : related ? style.on : style.idle} ${className}`}>
      {/* On phones the group headings carry this, so it is not repeated on every card. */}
      <div className={`mlabel hidden lg:block ${style.label}`}>{ROLE_LABEL[role]}</div>
      {/* Only the title is the button: the citations below stay ordinary links. */}
      <button type="button" aria-pressed={on} onClick={() => onToggle(k)}
        className={`group/t -mx-1 inline-flex min-h-[44px] items-center gap-2 rounded px-1 text-left font-display text-[0.98rem] font-semibold leading-snug
                    transition-colors lg:mt-1 ${on ? 'text-cyan-200' : role === 'input' ? 'text-sand hover:text-cyan-200' : 'text-cyan-200 hover:text-cyan-300'}`}>
        <span className={`underline decoration-dotted decoration-1 underline-offset-4 ${on ? 'decoration-cyan-300' : 'decoration-cyan-300/45 group-hover/t:decoration-cyan-300'}`}>{n.title}</span>
        {/* a selection marker, so selection does not rely on colour alone */}
        <span aria-hidden className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
          on ? 'border-cyan-300 bg-cyan-300' : 'border-cyan-300/50'}`}>
          {on && <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />}
        </span>
      </button>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand/80"><Sentences items={n.body} /></p>
    </div>
  );
}

/* What the selected part connects to, in words. With nothing selected, every relationship. */
function NetDetails({ selected, onClear }: { selected: NetKey | null; onClear: () => void }) {
  const edges = selected ? NET_EDGES.filter(e => e.from === selected || e.to === selected) : NET_EDGES;
  const edgeItem = (e: typeof NET_EDGES[number]) => (
    <li key={e.key} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-sand/90">
      <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-cyan-300/70" />
      <span>
        <span className="font-semibold text-sand">{title(e.from)}</span>
        <span aria-hidden className="text-cyan-300"> → </span><span className="sr-only"> acts on </span>
        <span className="font-semibold text-sand">{title(e.to)}</span>: {GLOBAL_NETWORK.edges[e.key]}
      </span>
    </li>
  );
  return (
    <div aria-live="polite" className="rounded-xl border border-edge bg-ink-800/80 p-5">
      {selected ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className={`mlabel ${ROLE_STYLE[NET_ROLE[selected]].label}`}>{ROLE_LABEL[NET_ROLE[selected]]}</div>
              <div className="mt-1 font-display text-[1.05rem] font-semibold text-cyan-200">{title(selected)}</div>
            </div>
            <button type="button" onClick={onClear} className="btn btn-g px-4 py-1.5 text-[0.875rem]">Show every relationship</button>
          </div>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-sand/85"><Sentences items={GLOBAL_NETWORK[selected].body} /></p>
          <div className="mlabel mt-4 text-mute">Its connections in the diagram</div>
          <ul className="mt-2 space-y-1.5">{edges.map(edgeItem)}</ul>
        </>
      ) : (
        <>
          <div className="mlabel text-mute">Every relationship in the diagram</div>
          <ul className="mt-2 space-y-1.5">{edges.map(edgeItem)}</ul>
          <p className="t-micro mt-3">Select a name in the diagram to highlight it and its connections.</p>
        </>
      )}
    </div>
  );
}

/**
 * Who influences whom. The paragraph above the diagram is its full text
 * equivalent, so the diagram adds structure rather than new claims.
 *
 * Selecting a part highlights it, the parts it connects to and the arrows
 * between them, and the panel below states those connections in words. Every
 * description and citation stays visible whether or not anything is selected.
 * Wide screens get the network; phones and tablets get the same parts in three
 * groups, in the order influence runs, rather than a squeezed network.
 */
export function GlobalNetwork() {
  const [selected, setSelected] = useState<NetKey | null>(null);
  const toggle = (k: NetKey) => setSelected(s => (s === k ? null : k));
  const n = GLOBAL_NETWORK.edges;
  const touches = (e: EdgeKey) => {
    const edge = NET_EDGES.find(x => x.key === e)!;
    return edge.from === selected || edge.to === selected;
  };
  const emph = (e: EdgeKey): Emphasis => (selected ? (touches(e) ? 'on' : 'off') : 'normal');
  const related = (k: NetKey) => !!selected && selected !== k &&
    NET_EDGES.some(e => (e.from === selected && e.to === k) || (e.to === selected && e.from === k));
  const node = (k: NetKey, className = '') =>
    <NetNode k={k} selected={selected} related={related(k)} onToggle={toggle} className={className} />;

  return (
    <figure className="m-0 mt-8" aria-labelledby="globalnet-cap"
      onKeyDown={e => { if (e.key === 'Escape' && selected) setSelected(null); }}>
      {/* wide screens: clients and workers either side of the providers, pressures above and below */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1.15fr_auto_1fr] grid-rows-[auto_auto_auto_auto_auto] gap-x-3 items-stretch">
        <div className="col-start-3 row-start-1"><Reveal className="h-full">{node('competitors')}</Reveal></div>
        <div className="col-start-5 row-start-1"><Reveal delay={0.1} className="h-full">{node('skills')}</Reveal></div>
        <Connector dir="down" label={n.competitorsToHub} emphasis={emph('competitorsToHub')} className="col-start-3 row-start-2 py-2" />
        <Connector dir="down" label={n.skillsToWorkers} emphasis={emph('skillsToWorkers')} className="col-start-5 row-start-2 py-2" />
        <div className="col-start-1 row-start-3 self-center"><Reveal>{node('clients')}</Reveal></div>
        <Connector dir="right" label={n.clientsToHub} emphasis={emph('clientsToHub')} className="col-start-2 row-start-3 w-[8.5rem]" />
        <div className="col-start-3 row-start-3"><Reveal delay={0.05} className="h-full">{node('hub')}</Reveal></div>
        <Connector dir="right" label={n.hubToWorkers} emphasis={emph('hubToWorkers')} className="col-start-4 row-start-3 w-[8.5rem]" />
        <div className="col-start-5 row-start-3 self-center"><Reveal delay={0.1}>{node('workers')}</Reveal></div>
        <Connector dir="up" label={n.techToHub} emphasis={emph('techToHub')} className="col-start-3 row-start-4 py-2" />
        <div className="col-start-3 row-start-5"><Reveal delay={0.15} className="h-full">{node('tech')}</Reveal></div>
      </div>

      {/* phones and tablets: three groups in the order influence runs */}
      <div className="lg:hidden">
        <div className="mlabel mb-2 text-mute">Acting on the industry</div>
        <ul className="grid gap-2 sm:grid-cols-3">
          {(['clients', 'competitors', 'tech'] as const).map(k => <li key={k}>{node(k)}</li>)}
        </ul>
        <Connector dir="down" emphasis={selected && ['clients', 'competitors', 'tech', 'hub'].includes(selected) ? 'on' : selected ? 'off' : 'normal'} className="py-1.5" />
        {node('hub')}
        <Connector dir="down" emphasis={selected && ['hub', 'workers'].includes(selected) ? 'on' : selected ? 'off' : 'normal'} className="py-1.5" />
        <div className="mlabel mb-2 text-mute">The worker side</div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {(['workers', 'skills'] as const).map(k => <li key={k}>{node(k)}</li>)}
        </ul>
      </div>

      <div className="mt-5"><NetDetails selected={selected} onClear={() => setSelected(null)} /></div>

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

const OUTCOME_TONE = {
  cyan:    { border: 'border-l-cyan-400/80', text: 'text-cyan-200' },
  neutral: { border: 'border-l-sand/50', text: 'text-sand' },
  amber:   { border: 'border-l-amber/80', text: 'text-amber' },
} as const;

/**
 * How automation reaches workers, as four steps you can move through. The four
 * steps stay visible as a row (a column on phones); the selected one is explained
 * below, with Previous and Next. Step 4 opens onto its three outcomes, which can
 * be explored one at a time. Every sentence and citation is the approved content.
 */
export function AutomationMechanism() {
  const steps = [...AUTOMATION_FLOW.map(s => s.title), 'Possible outcomes for workers'];
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const { tab, panel } = useTabs(steps.length, step, setStep);
  const out = useTabs(AUTOMATION_OUTCOMES.length, outcome, setOutcome);
  const last = steps.length - 1;
  const o = AUTOMATION_OUTCOMES[outcome];

  return (
    <figure className="m-0" aria-labelledby="mech-cap">
      <div role="tablist" aria-label="How automation reaches workers, in four steps"
        className="flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((t, i) => {
          const on = i === step;
          const done = i < step;
          return (
            <div key={t} className="contents">
              <button {...tab(i)}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors lg:flex-1 lg:flex-col lg:items-start lg:gap-1.5 ${
                  on ? 'border-cyan-300/70 bg-cyan-500/[0.09]'
                     : 'border-edge bg-ink-700/70 hover:border-accent-bright/40'}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[0.875rem] ${
                  on ? 'border-cyan-500 bg-cyan-500 text-[rgb(var(--on-accent))]'
                     : done ? 'border-cyan-400/60 text-cyan-200' : 'border-edge text-mute'}`}>{i + 1}</span>
                <span className="min-w-0">
                  <span className="mlabel block text-mute">Step {i + 1}</span>
                  <span className={`block font-display text-[0.95rem] font-semibold leading-snug ${
                    on ? 'text-cyan-200' : i === last ? 'text-cyan-200/90' : 'text-sand'}`}>{t}</span>
                </span>
              </button>
              {i < last && <>
                <Connector dir="right" emphasis={i < step ? 'on' : 'normal'} className="hidden w-9 shrink-0 lg:flex" />
                <Connector dir="down" emphasis={i < step ? 'on' : 'normal'} className="lg:hidden [&_svg]:h-4" />
              </>}
            </div>
          );
        })}
      </div>

      <div {...panel()} className="mt-4 rounded-xl border border-edge bg-ink-800/80 p-5 sm:p-6 focus-visible:outline-offset-2">
        <div className="mlabel text-mute">Step {step + 1} of {steps.length}</div>
        <div className="mt-1 font-display text-[1.1rem] font-semibold text-cyan-200">{steps[step]}</div>

        {step < last ? (
          <p className="mt-2 max-w-reading text-[0.95rem] leading-relaxed text-sand/90">
            <Sentences items={AUTOMATION_FLOW[step].body} />
          </p>
        ) : (
          <div className="mt-3">
            <p className="text-[0.9rem] text-sand/85">Three outcomes the sources describe. Choose one to read about it.</p>
            <div role="tablist" aria-label="Possible outcomes for workers" className="mt-3 flex flex-wrap gap-2">
              {AUTOMATION_OUTCOMES.map((x, i) => (
                <button key={x.label} {...out.tab(i)}
                  className={`rounded-full border px-4 py-1.5 text-[0.875rem] transition-colors ${
                    i === outcome ? 'border-cyan-500/70 bg-cyan-500/10 text-cyan-200' : 'border-edge text-sand/85 hover:text-cyan-200'}`}>
                  {x.label}
                </button>
              ))}
            </div>
            <div {...out.panel()} className={`mt-3 border-l-2 pl-4 ${OUTCOME_TONE[o.tone].border} focus-visible:outline-offset-2`}>
              <div className={`text-[0.95rem] font-semibold ${OUTCOME_TONE[o.tone].text}`}>{o.label}</div>
              <p className="mt-1 max-w-reading text-[0.92rem] leading-relaxed text-sand/90"><Sentences items={o.body} /></p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" className="btn btn-g px-4 py-2" disabled={step === 0} onClick={() => setStep(step - 1)}>
            <span aria-hidden>←</span> Previous<span className="sr-only">: {step > 0 ? steps[step - 1] : ''}</span>
          </button>
          <button type="button" className="btn btn-g px-4 py-2" disabled={step === last} onClick={() => setStep(step + 1)}>
            Next<span className="sr-only">: {step < last ? steps[step + 1] : ''}</span> <span aria-hidden>→</span>
          </button>
        </div>
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
                <span className="grid h-7 w-7 place-items-center rounded-full border border-accent-bright/50 bg-cyan-500/10 font-mono text-[0.875rem] text-cyan-200">{p.part}</span>
                <a href="#journey" className="mlabel text-cyan-300/90 underline decoration-dotted underline-offset-2 hover:text-cyan-200">
                  {p.steps.length > 1 ? `Steps ${p.steps.join(' and ')}` : `Step ${p.steps[0]}`}
                </a>
              </div>
              <div className="mt-3 font-display text-[0.95rem] font-semibold leading-snug text-sand">{p.title}</div>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand/80"><Sentences items={p.body} /></p>
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
      <h3 className="mt-3 font-serif text-sub text-sand">How the work has changed, and how workers could adapt</h3>
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
              <span className="relative font-mono text-[0.75rem] uppercase tracking-[0.08em]">{s.label}</span>
              <span className="relative hidden sm:inline text-[0.875rem]">{s.title}</span>
            </button>
          );
        })}
        <button type="button" onClick={() => setShowAll(v => !v)} aria-expanded={showAll}
          className="lg:hidden rounded-full border border-edge px-4 py-2 text-[0.875rem] text-sand hover:text-cyan-200">
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
                  <div className={`font-mono text-[0.75rem] uppercase tracking-[0.08em] ${s.key === 'future' ? 'text-amber' : 'text-cyan-300'}`}>
                    {s.label}{s.key === 'future' && ' · proposed'}
                  </div>
                  <h4 id={`stage-${s.key}-h`} className="mt-1 font-serif text-[1.05rem] font-semibold text-sand">{s.title}</h4>
                  <p className="mt-1 text-[0.875rem] leading-snug text-mute">{s.note}</p>
                </div>
                <span className={on ? 'text-cyan-300' : 'text-mute/80'}>{STAGE_ART[s.key]}</span>
              </header>
              {STAGE_DIMENSIONS.map(d => (
                <div key={d.key} className="border-t border-line/70 py-3">
                  <div className="mlabel text-mute">{d.label}</div>
                  <p className="mt-1 text-[0.875rem] leading-relaxed text-sand/90"><Sentences items={s.cells[d.key]} /></p>
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
