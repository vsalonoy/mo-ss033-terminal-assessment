import { Fragment, useCallback, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { useInView, useMotionValue, animate } from 'motion/react';
import { usePrefersReducedMotion, type CiteReturn } from '../hooks/useSiteState';
import { refMap, type RefKey, type Sentence } from '../data/research';

/**
 * A block that used to fade in on scroll. The editorial design keeps the page still:
 * content is simply there, which also suits reduced motion, print and screenshots.
 * `as` keeps list semantics valid: inside an ol or ul it must render an li.
 */
export function Reveal({ children, className = '', as = 'div' }:
  { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' }) {
  const Plain = as;
  return <Plain className={className}>{children}</Plain>;
}

/* Counts a figure up once on screen. Shows the final value immediately when motion is reduced. */
export function Counter({ to, decimals = 0, suffix = '', prefix = '', immediate = false, delay = 0 }:
  { to: number; decimals?: number; suffix?: string; prefix?: string; immediate?: boolean; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const mv = useMotionValue(0);
  const [shown, setShown] = useState(reduced ? to : 0);
  /* `immediate` is for figures that sit on screen at page load, where waiting
     for an intersection would leave them stuck at zero. */
  const play = immediate || inView;

  useEffect(() => {
    if (reduced) { setShown(to); return; }
    if (!play) return;
    const c = animate(mv, to, { duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] });
    const un = mv.on('change', v => setShown(v));
    return () => { c.stop(); un(); };
  }, [play, reduced, to, mv, delay]);

  return <span ref={ref} className="tabular-nums">{prefix}{shown.toFixed(decimals)}{suffix}</span>;
}

/** Announced when a citation is followed, so the reference entry can offer a way back. */
export const REF_FOLLOWED = 'ref-followed';
export interface RefFollowed { key: RefKey }

/* The name a citation shows: the first author's surname or the group author.
   Acts are cited by their number, since that is how the reference list opens them. */
const citeName = (k: RefKey) => {
  const a = refMap[k].author;
  return k.startsWith('ra') ? a.split(',')[0] : a.replace(/,.*$/, '');
};

/**
 * An APA 7 parenthetical citation that resolves to its entry in section L.
 *
 * Works are listed alphabetically inside the parentheses, and works by the same
 * author share one name with their years listed after it, as in
 * (International Labour Organization, 2026a, 2026b).
 *
 * Each year stays an anchor with a real href, which keeps it focusable,
 * Enter-activatable and open-in-new-tab friendly. A plain click is handled here
 * so that Back returns to this citation: the entry being left records where the
 * reader was, and the jump to the reference is pushed as a new entry.
 */
export function Cite({ keys }: { keys: RefKey[] }) {
  const reduced = usePrefersReducedMotion();
  const base = useId();

  const follow = useCallback((e: MouseEvent<HTMLAnchorElement>, k: RefKey) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const target = document.getElementById(`ref-${k}`);
    if (!target) return;                       // let the browser handle it
    e.preventDefault();
    const back: CiteReturn = { id: e.currentTarget.id, y: Math.round(window.scrollY) };
    history.replaceState({ ...(history.state ?? {}), citeReturn: back }, '');
    history.pushState({ refFrom: back.id }, '', `#ref-${k}`);
    /* Announced first: section L clears its source-type filter on it, so the entry
       is showing before it is scrolled to. */
    window.dispatchEvent(new CustomEvent<RefFollowed>(REF_FOLLOWED, { detail: { key: k } }));
    target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  }, [reduced]);

  /* Group by displayed name, then order the groups alphabetically. */
  const groups = new Map<string, RefKey[]>();
  for (const k of keys) groups.set(citeName(k), [...(groups.get(citeName(k)) ?? []), k]);
  const ordered = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));

  const link = (k: RefKey, label: string) => (
    <a
      id={`cite-${base}-${k}`}
      href={`#ref-${k}`}
      onClick={e => follow(e, k)}
      className="underline decoration-cyan-300/35 underline-offset-2 hover:decoration-cyan-300"
    >{label}</a>
  );

  return (
    <span className="cite">
      (
      {ordered.map(([name, ks], gi) => (
        <span key={name}>
          {gi > 0 && '; '}
          {ks.map((k, i) => {
            const y = refMap[k].year.split(',')[0];
            return (
              <span key={k}>
                {i > 0 && ', '}
                {link(k, i === 0 ? `${name}, ${y}` : y)}
              </span>
            );
          })}
        </span>
      ))}
      )
    </span>
  );
}

/* Sentences in order, each with its citation placed before the full stop, as APA 7 sets it. */
export function Sentences({ items }: { items: Sentence[] }) {
  return (
    <>
      {items.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          {s.t}{s.refs && <> <Cite keys={s.refs} /></>}.
        </Fragment>
      ))}
    </>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

/* Section shell. id is the scroll target for the contents menu and every citation. */
export function Section({ id, letter, label, title, lede, children }:
  { id: string; letter: string; label: string; title: string; lede?: string; children: ReactNode }) {
  return (
    /* tabIndex -1 makes the section a programmatic focus target, so choosing it
       from the Contents menu lands keyboard focus on the destination rather than
       leaving it on a control that has just unmounted. */
    <section id={id} aria-label={`${letter}. ${label}`} tabIndex={-1}
      className="scroll-mt-20 py-12 sm:py-16 focus:outline-none focus-visible:outline-2 focus-visible:outline-cyan-400">
      <div className="wrap">
        <Eyebrow>Section {letter} · {label}</Eyebrow>
        <h2 className="t-sec mt-3 max-w-[30ch]">{title}</h2>
        {lede && <p className="t-lede mt-5">{lede}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function Chip({ children, tone = 'neutral' }:
  { children: ReactNode; tone?: 'neutral' | 'cyan' | 'amber' | 'rose' }) {
  const tones = {
    neutral: 'border-line text-sand/80 bg-ink-700',
    cyan: 'border-cyan-500/40 text-cyan-200 bg-cyan-500/[0.08]',
    amber: 'border-amber/45 text-amber bg-amber/[0.08]',
    rose: 'border-rose/45 text-rose bg-rose/[0.08]',
  };
  return <span className={`chip ${tones[tone]}`}>{children}</span>;
}

/**
 * A folded block, used in section F where the proposal runs long enough that
 * the supporting detail would otherwise push the argument's conclusion a long
 * way down the page.
 *
 * Nothing is removed and nothing moves section: the content stays where it was
 * and starts folded. The panel element is always rendered so `aria-controls`
 * always resolves, and the `hidden` attribute is what takes it out of the
 * accessibility tree when closed.
 */
export function Disclosure({ summary, hint, children, defaultOpen = false }:
  { summary: string; hint?: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className={`mt-6 card card-toggle ${open ? 'border-cyan-500/50' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-[44px] w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span aria-hidden
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-[1rem] leading-none text-cyan-300 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1rem] font-semibold leading-snug text-sand">{summary}</span>
          {hint && <span className="mt-0.5 block text-[0.9rem] leading-snug text-mute">{hint}</span>}
        </span>
        <span className="shrink-0 text-[0.85rem] font-semibold text-cyan-300">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      <div id={panelId} hidden={!open} data-print-open className="border-t border-line px-5 pb-6 pt-3 sm:px-6">
        {children}
      </div>
    </div>
  );
}

/* Used wherever the site must say plainly that something is proposed, not measured. */
export function Caveat({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'rose' }) {
  const c = tone === 'rose'
    ? 'border-l-rose bg-rose/[0.06]'
    : 'border-l-amber bg-amber/[0.07]';
  return (
    <div className={`mt-8 max-w-reading rounded-r-lg border-l-[3px] ${c} px-5 py-4 text-[0.98rem] leading-relaxed text-sand/90`}>
      {children}
    </div>
  );
}
