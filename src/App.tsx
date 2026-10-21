import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteCtx, usePrefersReducedMotion, useScrollSpy, useKeyboardNav, type Mode, type SiteState } from './hooks/useSiteState';
import { TopBar, SectionRail, PresentationControls, Footer } from './components/Chrome';
import { AmbientField, AmbientBlooms } from './components/Ambient';
import Hero from './components/Hero';
import { Intro, Challenge, Stakeholders, Solutions, Ranking } from './components/SectionsAE';
import { Proposal, Journey, Smart, Criteria, Risks, Conclusion, References } from './components/SectionsFL';
import { SECTIONS } from './data/research';

/**
 * One set of section components, rendered by both modes.
 * Explore Mode renders them all in a scrolling document.
 * Presentation Mode renders one at a time. The research lives in src/data/research.ts,
 * so neither mode maintains its own copy of the content.
 */
const SECTION_COMPONENTS = [
  Intro, Challenge, Stakeholders, Solutions, Ranking,
  Proposal, Journey, Smart, Criteria, Risks, Conclusion, References,
] as const;

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [mode, setModeRaw] = useState<Mode>('explore');
  const [index, setIndex] = useState(0);

  const go = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, i));
    setIndex(clamped);
    /* In Explore Mode the index follows the scroll, so jumping means scrolling. */
    if (mode === 'explore') {
      requestAnimationFrame(() => {
        document.getElementById(SECTIONS[clamped].id)
          ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [mode, reduced]);

  const setMode = useCallback((m: Mode) => {
    setModeRaw(prev => {
      if (prev === m) return prev;
      if (m === 'presentation') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        /* Leaving Presentation Mode lands on the section the reader was on. */
        requestAnimationFrame(() => {
          document.getElementById(SECTIONS[index].id)
            ?.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      }
      return m;
    });
  }, [index]);

  const next = useCallback(() => setIndex(i => Math.min(SECTIONS.length - 1, i + 1)), []);
  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);

  const state: SiteState = useMemo(
    () => ({ mode, setMode, index, go, next, prev, reduced }),
    [mode, setMode, index, go, next, prev, reduced]
  );

  useScrollSpy(mode === 'explore', setIndex);
  useKeyboardNav(state);

  /* Presentation Mode scrolls to top on every section change. */
  useEffect(() => {
    if (mode === 'presentation') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [index, mode]);

  const Current = SECTION_COMPONENTS[index];

  return (
    <SiteCtx.Provider value={state}>
      {/* Targets <main>, not a section id. Presentation Mode mounts only the active
          section, so "#intro" was a dead target on every slide but the first. */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:btn focus:btn-p">
        Skip to content
      </a>

      {/* Background layer. Fixed, decorative, never catches a pointer. */}
      <AmbientBlooms />
      <AmbientField />

      <TopBar />
      <SectionRail />

      <main id="main" tabIndex={-1}
        className={`relative z-10 focus:outline-none ${mode === 'presentation' ? 'pt-14 pb-36' : 'pt-14'}`}>
        {mode === 'explore' ? (
          <>
            <Hero />
            {SECTION_COMPONENTS.map((C, i) => (
              <div key={SECTIONS[i].id}>
                <C />
                {i < SECTION_COMPONENTS.length - 1 && <div className="wrap"><div className="rule" /></div>}
              </div>
            ))}
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={SECTIONS[index].id}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] } }}
              exit={reduced ? undefined : { opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' } }}
            >
              <Current />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <PresentationControls />
      {mode === 'explore' && <div className="relative z-10"><Footer /></div>}
    </SiteCtx.Provider>
  );
}
