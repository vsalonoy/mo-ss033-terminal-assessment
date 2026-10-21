import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, animate } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { refMap, type RefKey } from '../data/research';

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

/* A citation that links to its reference entry on this page. */
export function Cite({ keys }: { keys: RefKey[] }) {
  return (
    <span className="cite">
      {keys.map((k, i) => {
        const r = refMap[k];
        const y = r.year.split(',')[0];
        const name = k.startsWith('ra') ? r.author.split(',')[0] : r.author.replace(/,.*$/, '');
        return (
          <span key={k}>
            {i > 0 && '; '}
            <a href={`#ref-${k}`} className="hover:text-cyan-300 underline decoration-dotted decoration-line/60 underline-offset-2">
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
