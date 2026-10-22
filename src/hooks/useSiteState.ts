import { useEffect, useState, createContext, useContext } from 'react';
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

export interface SiteState {
  index: number;            // section currently on screen
  go: (i: number) => void;  // scroll to a section
  reduced: boolean;
}

export const SiteCtx = createContext<SiteState | null>(null);
export const useSite = (): SiteState => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error('useSite must be used inside SiteCtx');
  return c;
};

/**
 * Tracks which section is on screen.
 * Measured from element positions rather than IntersectionObserver ratios:
 * sections here are far taller than any sensible observer band, so their
 * intersection ratios stay tiny and rank unreliably against each other.
 * Reads are batched into a rAF, so this costs one layout read per frame at most.
 */
export function useScrollSpy(onChange: (i: number) => void) {
  useEffect(() => {
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
  }, [onChange]);
}

/** Where a followed citation came from. Stored on the history entry it left. */
export interface CiteReturn { id: string; y: number }

/**
 * Fragment navigation that survives React rendering after the browser.
 *
 * On a cold load of a link such as "#ref-ra11962" the browser looks for the
 * target before React has rendered it, finds nothing, and stays at the top. The
 * target is scrolled to here instead, once the fonts have settled so the layout
 * it lands on is final, and focus moves with it.
 *
 * Back from a followed citation returns to the citation rather than wherever the
 * browser's own scroll restoration happens to put the reader.
 */
export function useHashNavigation() {
  useEffect(() => {
    let cancelled = false;
    const land = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      el.focus({ preventScroll: true });
    };
    const target = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      return id ? document.getElementById(id) : null;
    };

    if (location.hash) {
      document.fonts.ready.then(() => requestAnimationFrame(() => {
        const el = target();
        if (!cancelled && el) land(el);
      }));
    }

    const onPop = (e: PopStateEvent) => {
      const back = (e.state as { citeReturn?: CiteReturn } | null)?.citeReturn;
      if (back) {
        window.scrollTo({ top: back.y, behavior: 'instant' });
        document.getElementById(back.id)?.focus({ preventScroll: true });
        return;
      }
      const el = target();
      if (el) land(el);
    };
    window.addEventListener('popstate', onPop);
    return () => { cancelled = true; window.removeEventListener('popstate', onPop); };
  }, []);
}
