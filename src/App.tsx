import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { PresentationCtx, type PresentationState, type View } from './hooks/usePresentation';
import { videoExplainerEnabled } from './data/video';
import { SiteCtx, usePrefersReducedMotion, useScrollSpy, useHashNavigation, type SiteState } from './hooks/useSiteState';
import { TopBar, Footer } from './components/Chrome';
import Home from './components/Home';
import { ExploreIndex, ChapterOpener, SourcesOpener } from './components/Explore';
import { WatchTheatre, WatchUnavailable } from './components/Watch';
import { Intro, Challenge, Stakeholders, Solutions, Ranking } from './components/SectionsAE';
import { Proposal, Journey, Smart, Criteria, Risks, Conclusion, References } from './components/SectionsFL';
import { ReviewerGuidance } from './components/ReviewerGuidance';
import { SECTIONS } from './data/research';
import { EXPLORE_CHAPTERS } from './data/explore';

/**
 * Two rooms in one site.
 *
 * The research document is one scrolling page: Home, then Explore in five chapters
 * that follow the video's chapters (sections A to K, anchors unchanged), then
 * Sources (section L). The Watch theatre (#watch) replaces it on screen while it is
 * open; the document stays mounted underneath, hidden, so leaving the theatre
 * returns the visitor to where they were.
 */
const SECTION_COMPONENTS: Record<string, () => React.JSX.Element> = {
  A: Intro, B: Challenge, C: Stakeholders, D: Solutions, E: Ranking,
  F: Proposal, G: Journey, H: Smart, I: Criteria, J: Risks, K: Conclusion,
};

const atWatch = () => typeof location !== 'undefined' && location.hash === '#watch';

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

  /* ---------------------------------------------------------- the theatre */
  /* Off on the published site until the video is approved (D-3). */
  const enabled = videoExplainerEnabled();
  const [view, setView] = useState<View>(() => (atWatch() ? 'watch' : 'document'));
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);
  const returnY = useRef(0);
  const [request, setRequest] = useState<PresentationState['request']>(null);

  /* The Home stage holds the video only until the theatre opens, so one element at most. */
  const [homeLive, setHomeLive] = useState(false);

  const watch = useCallback((start = 0) => {
    if (!enabled) return;
    if (viewRef.current !== 'watch') {
      returnY.current = window.scrollY;
      history.pushState({ watch: true }, '', '#watch');
      setView('watch');
    }
    setHomeLive(false);
    setRequest(r => ({ start, id: (r?.id ?? 0) + 1, surface: 'theatre' }));
  }, [enabled]);

  const play = useCallback((start = 0) => {
    if (!enabled) return;
    setHomeLive(true);
    setRequest(r => ({ start, id: (r?.id ?? 0) + 1, surface: 'home' }));
  }, [enabled]);

  const leave = useCallback(() => {
    if ((history.state as { watch?: boolean } | null)?.watch) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    setView('document');
    requestAnimationFrame(() => window.scrollTo(0, returnY.current));
  }, []);

  /* Back, Forward and in-page links move between the rooms. A link out of the theatre
     (for example "See the evidence") shows the document first, then lands on its target. */
  useEffect(() => {
    const sync = () => {
      const w = atWatch();
      if (w && viewRef.current !== 'watch') { returnY.current = window.scrollY; setHomeLive(false); setView('watch'); }
      if (!w && viewRef.current === 'watch') {
        setView('document');
        const id = decodeURIComponent(location.hash.slice(1));
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const el = id ? document.getElementById(id) : null;
          if (el) { el.scrollIntoView({ block: 'start' }); el.focus({ preventScroll: true }); }
          else window.scrollTo(0, returnY.current);
        }));
      }
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);

  /* Entering the theatre starts at its top, with focus on its heading. */
  useEffect(() => {
    if (view !== 'watch') return;
    window.scrollTo(0, 0);
    document.getElementById('watch-title')?.focus({ preventScroll: true });
  }, [view]);

  const presentation: PresentationState = useMemo(
    () => ({ enabled, view, play, watch, leave, homeLive, request }),
    [enabled, view, play, watch, leave, homeLive, request]);

  useScrollSpy(setIndex);
  useHashNavigation();

  const theatre = view === 'watch';
  /* The skip link moves focus without touching the address, which would leave the theatre. */
  const skip = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(theatre ? 'watch-main' : 'main');
    if (!el) return;
    e.preventDefault();
    el.focus();
  };

  return (
    <SiteCtx.Provider value={state}>
    <PresentationCtx.Provider value={presentation}>
    <div className={theatre && enabled ? 'theme-stage stage-room min-h-screen bg-ink-900 text-sand' : ''}>
      <a href={theatre ? '#watch-main' : '#main'} onClick={skip}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:btn focus:btn-p">
        Skip to content
      </a>

      <TopBar />

      {theatre && (enabled ? <WatchTheatre /> : <WatchUnavailable />)}

      <div hidden={theatre}>
        <main id="main" tabIndex={-1} className="pt-16 focus:outline-none">
          <Home />
          <ExploreIndex />
          {EXPLORE_CHAPTERS.map(ch => (
            <div key={ch.id}>
              <ChapterOpener chapter={ch} />
              {ch.letters.split('').map(l => {
                const C = SECTION_COMPONENTS[l];
                return <C key={l} />;
              })}
            </div>
          ))}
          <SourcesOpener />
          <References />
        </main>

        {/* After section L, outside the research sections and the contents menu. */}
        <ReviewerGuidance />

        <Footer />
      </div>
    </div>
    </PresentationCtx.Provider>
    </SiteCtx.Provider>
  );
}
