import { useCallback, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, animate } from 'motion/react';
import { usePrefersReducedMotion, useSite } from '../hooks/useSiteState';
import { refMap, SECTIONS, type RefKey } from '../data/research';

/**
 * Scroll-triggered entrance. Collapses to a plain element when motion is reduced.
 * `as` keeps list semantics valid: inside an ol or ul it must render an li,
 * because a wrapper div between the list and its items breaks the list for screen readers.
 */
export function Reveal({ children, delay = 0, y = 18, className = '', as = 'div' }:
  { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const Plain = as;
  const M = as === 'li' ? motion.li : motion.div;
  if (reduced) return <Plain className={className}>{children}</Plain>;
  return (
    <M
      ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.62, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >{children}</M>
  );
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

const REFERENCES_INDEX = SECTIONS.findIndex(s => s.id === 'references');

/**
 * Scrolls to a reference entry once it is actually in the document.
 *
 * Presentation Mode mounts only the active section, and AnimatePresence runs in
 * `mode="wait"`, so section L does not exist for several frames after it is
 * selected. A single requestAnimationFrame lands too early and the jump is lost,
 * which is why this polls for the element instead of assuming it is there.
 */
function revealReference(key: RefKey, smooth: boolean) {
  let tries = 48; // ~0.8s at 60fps; the exit transition is 0.14s
  const tick = () => {
    const el = document.getElementById(`ref-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      /* Move focus with the eye, so a keyboard reader lands on the entry rather
         than keeping focus on a citation that is now off screen. */
      el.focus({ preventScroll: true });
      return;
    }
    if (tries-- > 0) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * A citation that resolves to its reference entry in section L.
 *
 * Explore Mode renders every section, so the plain fragment link is left to do
 * its own work: the URL updates and Back behaves as a reader expects.
 * Presentation Mode has to activate section L first, so there the anchor is
 * intercepted. It stays an anchor with a real href either way, which is what
 * keeps it focusable, Enter-activatable and open-in-new-tab friendly.
 */
export function Cite({ keys }: { keys: RefKey[] }) {
  const { mode, go } = useSite();
  const reduced = usePrefersReducedMotion();

  const jump = useCallback((e: MouseEvent<HTMLAnchorElement>, k: RefKey) => {
    if (mode !== 'presentation') return;      // native anchor is correct here
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(REFERENCES_INDEX);
    /* replaceState rather than pushState: the slide change is the navigation, and
       a pushed hash would leave a Back step that cannot restore the slide. */
    history.replaceState(null, '', `#ref-${k}`);
    revealReference(k, !reduced);
  }, [mode, go, reduced]);

  return (
    <span className="cite">
      {keys.map((k, i) => {
        const r = refMap[k];
        const y = r.year.split(',')[0];
        const name = k.startsWith('ra') ? r.author.split(',')[0] : r.author.replace(/,.*$/, '');
        return (
          <span key={k}>
            {i > 0 && '; '}
            <a
              href={`#ref-${k}`}
              onClick={e => jump(e, k)}
              className="hover:text-cyan-300 underline decoration-dotted decoration-line/60 underline-offset-2"
            >
              {name}, {y}
            </a>
          </span>
        );
      })}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

/* Section shell. id is the scroll target and the Presentation Mode anchor. */
export function Section({ id, letter, label, title, lede, children }:
  { id: string; letter: string; label: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={`${letter}. ${label}`} className="scroll-mt-24 py-24 sm:py-28">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{letter} &nbsp;/&nbsp; {label}</Eyebrow>
          <h2 className="t-sec mt-3">{title}</h2>
          {lede && <p className="t-lede mt-5">{lede}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Chip({ children, tone = 'neutral' }:
  { children: ReactNode; tone?: 'neutral' | 'cyan' | 'amber' | 'rose' }) {
  const tones = {
    neutral: 'border-line text-mute',
    cyan: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/[0.07]',
    amber: 'border-amber/40 text-amber bg-amber/[0.07]',
    rose: 'border-rose/40 text-rose bg-rose/[0.07]',
  };
  return <span className={`chip ${tones[tone]}`}>{children}</span>;
}

/**
 * A folded block, used in section F where the proposal runs long enough that
 * presenting it as a single slide means scrolling past the argument to reach the
 * supporting detail.
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
    <div className={`mt-6 card ${open ? 'border-cyan-500/30' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left px-6 py-5 flex items-center gap-4"
      >
        <span aria-hidden
          className={`shrink-0 text-lg leading-none text-cyan-300 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.98rem] font-bold leading-snug text-sand">{summary}</span>
          {hint && <span className="mt-0.5 block text-[0.8rem] leading-snug text-mute">{hint}</span>}
        </span>
        <span className="shrink-0 font-display text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-mute">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      <div id={panelId} hidden={!open} className="border-t border-line/60 px-6 pb-6 pt-2">
        {children}
      </div>
    </div>
  );
}

/* Used wherever the site must say plainly that something is proposed, not measured. */
export function Caveat({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'rose' }) {
  const c = tone === 'rose'
    ? 'border-l-rose/60 bg-rose/[0.05]'
    : 'border-l-amber/60 bg-amber/[0.05]';
  return (
    <div className={`mt-8 border-l-2 ${c} px-5 py-4 text-[0.92rem] leading-relaxed text-sand/85 prose-r rounded-r`}>
      {children}
    </div>
  );
}
