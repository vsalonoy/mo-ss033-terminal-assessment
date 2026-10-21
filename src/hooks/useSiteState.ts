import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { SECTIONS } from '../data/research';

/* Reduced motion, live-updating. Every animated component reads this. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export type Mode = 'explore' | 'presentation';

export interface SiteState {
  mode: Mode;
  setMode: (m: Mode) => void;
  index: number;            // current section index, used by both modes
  go: (i: number) => void;
  next: () => void;
  prev: () => void;
  reduced: boolean;
}

export const SiteCtx = createContext<SiteState | null>(null);
export const useSite = (): SiteState => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error('useSite must be used inside SiteCtx');
  return c;
};

/**
 * Tracks which section is on screen in Explore Mode.
 * Measured from element positions rather than IntersectionObserver ratios:
 * sections here are far taller than any sensible observer band, so their
 * intersection ratios stay tiny and rank unreliably against each other.
 * Reads are batched into a rAF, so this costs one layout read per frame at most.
 */
export function useScrollSpy(enabled: boolean, onChange: (i: number) => void) {
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      /* The section whose top has most recently passed the reference line wins,
         so the indicator changes exactly when a new section heading reaches it. */
      const line = window.innerHeight * 0.32;
      let best = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) best = i;
      }
      /* At the very bottom the last section may never reach the line. */
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        best = SECTIONS.length - 1;
      }
      onChange(best);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled, onChange]);
}

/* Keyboard navigation. Active in both modes; arrows only drive Presentation Mode. */
export function useKeyboardNav(s: SiteState) {
  const handler = useCallback((e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      s.setMode(s.mode === 'presentation' ? 'explore' : 'presentation');
      return;
    }
    if (s.mode !== 'presentation') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); s.next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); s.prev(); }
    else if (e.key === 'Home') { e.preventDefault(); s.go(0); }
    else if (e.key === 'End') { e.preventDefault(); s.go(SECTIONS.length - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); s.setMode('explore'); }
  }, [s]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}
