import { useCallback, useMemo, useState } from 'react';
import { SiteCtx, usePrefersReducedMotion, useScrollSpy, useHashNavigation, type SiteState } from './hooks/useSiteState';
import { TopBar, SectionRail, Footer } from './components/Chrome';
import { AmbientField, AmbientBlooms } from './components/Ambient';
import Hero from './components/Hero';
import { Intro, Challenge, Stakeholders, Solutions, Ranking } from './components/SectionsAE';
import { Proposal, Journey, Smart, Criteria, Risks, Conclusion, References } from './components/SectionsFL';
import { MentorFeedback } from './components/Feedback';
import { SECTIONS } from './data/research';

/**
 * The site is a single scrolling research document. Every section is rendered,
 * in order, from the content in src/data/research.ts.
 */
const SECTION_COMPONENTS = [
  Intro, Challenge, Stakeholders, Solutions, Ranking,
  Proposal, Journey, Smart, Criteria, Risks, Conclusion, References,
] as const;

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  /* The index follows the scroll, so jumping to a section means scrolling to it. */
  const go = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, i));
    setIndex(clamped);
    requestAnimationFrame(() => {
      document.getElementById(SECTIONS[clamped].id)
        ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  }, [reduced]);

  const state: SiteState = useMemo(() => ({ index, go, reduced }), [index, go, reduced]);

  useScrollSpy(setIndex);
  useHashNavigation();

  return (
    <SiteCtx.Provider value={state}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:btn focus:btn-p">
        Skip to content
      </a>

      {/* Background layer. Fixed, decorative, never catches a pointer. */}
      <AmbientBlooms />
      <AmbientField />

      <TopBar />
      <SectionRail />

      <main id="main" tabIndex={-1} className="relative z-10 pt-14 focus:outline-none">
        <Hero />
        {SECTION_COMPONENTS.map((C, i) => (
          <div key={SECTIONS[i].id}>
            <C />
            {i < SECTION_COMPONENTS.length - 1 && <div className="wrap"><div className="rule" /></div>}
          </div>
        ))}
      </main>

      {/* After section L, outside the research sections and the section menu. */}
      <MentorFeedback />

      <div className="relative z-10"><Footer /></div>
    </SiteCtx.Provider>
  );
}
