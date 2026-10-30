import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../hooks/useSiteState';
import { ScrollProgress } from './Ambient';
import { SECTIONS, PROJECT } from '../data/research';
import { EXPLORE_CHAPTERS } from '../data/explore';
import { usePresentation } from '../hooks/usePresentation';

type Region = 'home' | 'explore' | 'sources';
/* Which room of the document is under the top bar. */
function useRegion(): Region {
  const [r, setR] = useState<Region>('home');
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const past = (id: string) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 96;
      setR(past('sources') ? 'sources' : past('explore') ? 'explore' : 'home');
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
  }, []);
  return r;
}

/* Top bar: the title, the three places in the document, Watch, and the Contents menu. */
export function TopBar() {
  const { go } = useSite();
  const { enabled, watch, view } = usePresentation();
  const region = useRegion();
  const theatre = view === 'watch';
  const [open, setOpen] = useState(false);

  /**
   * The destination chosen from the Contents menu (an element id), navigated only
   * once the menu's exit animation has finished.
   *
   * Navigating while that animation runs does not work. The menu animates
   * `height: auto -> 0`, and that measurement saves and restores the document
   * scroll position, which was (0, 0) at the moment of the click. The restore
   * lands after the scroll has started, so the page snaps back to the top and
   * the selection appears to do nothing. Deferring to onExitComplete ties the
   * navigation to the animation lifecycle rather than to a guessed delay.
   */
  const [pending, setPending] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  /* Dismissal sends focus back to the trigger; selection sends it forward to the
     destination. The exit handler needs to know which happened. */
  const returnFocus = useRef(false);

  const dismiss = useCallback(() => {
    returnFocus.current = true;
    setPending(null);
    setOpen(false);
  }, []);

  /* Escape closes the menu. Captured on the way down so nothing else on the page
     acts on the same keypress. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopPropagation();
      dismiss();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, dismiss]);

  /* Click outside closes the menu. pointerdown fires before the menu unmounts, and
     clicks on the trigger are left alone so it keeps working as a toggle. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      dismiss();
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open, dismiss]);

  /**
   * Runs after the menu has finished animating out, so the scroll restore
   * described above has already happened and cannot undo the navigation.
   */
  const onExitComplete = useCallback(() => {
    if (returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
      return;
    }
    if (pending === null) return;
    const id = pending;
    setPending(null);
    /* From the theatre, a destination is a change of room: the address carries it. */
    if (theatre) { location.hash = id; return; }
    const i = SECTIONS.findIndex(s => s.id === id);
    if (i >= 0) go(i);
    else document.getElementById(id)?.scrollIntoView({ block: 'start' });
    /* Move focus to the destination so a keyboard reader lands on it. Polled rather
       than assumed, so focus still lands if it renders late. preventScroll keeps
       focusing from fighting the scroll that has just started. */
    let tries = 48;
    const land = () => {
      const el = document.getElementById(id);
      if (el) { el.focus({ preventScroll: true }); return; }
      if (tries-- > 0) requestAnimationFrame(land);
    };
    requestAnimationFrame(land);
  }, [pending, go, theatre]);

  const choose = (id: string) => { setPending(id); setOpen(false); };
  const place = (id: Region, label: string, href: string) => (
    <a href={href} aria-current={!theatre && region === id ? 'location' : undefined}
      className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.92rem] font-semibold transition-colors ${
        !theatre && region === id ? 'bg-ink-700 text-sand shadow-[inset_0_0_0_1px_rgb(var(--line))]' : 'text-mute hover:text-sand'}`}>
      {label}
    </a>
  );

  return (
    <div className="no-print fixed top-0 inset-x-0 z-40 border-b border-line bg-ink-900/90 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-3 sm:gap-4">
        <a href="#top" className="flex min-h-[44px] min-w-0 flex-col justify-center leading-tight text-sand hover:text-cyan-200">
          <span className="block truncate font-serif text-[0.98rem] font-semibold sm:text-[1.05rem]">{PROJECT.title}</span>
          <span className="hidden truncate text-[0.78rem] text-mute sm:block">{PROJECT.course} · {PROJECT.assessment}</span>
        </a>

        <nav aria-label="Site" className="ml-auto hidden items-center gap-1 lg:flex">
          {place('home', 'Home', '#top')}
          {place('explore', 'Explore', '#explore')}
          {place('sources', 'Sources', '#sources')}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          {enabled && !theatre && (
            <button type="button" onClick={() => watch(0)} className="btn btn-p !px-4 !py-1.5 !text-[0.9rem]">
              <span aria-hidden>▶</span> Watch
            </button>
          )}
          <button
            ref={triggerRef}
            onClick={() => setOpen(o => {
              /* Reopening cancels a pending selection, so an interrupted exit
                 animation cannot navigate somewhere unexpected later. */
              if (!o) { setPending(null); returnFocus.current = false; }
              return !o;
            })}
            aria-expanded={open} aria-controls="section-menu"
            className="btn btn-g !px-4 !py-1.5 !text-[0.9rem]"
          >Contents</button>
        </div>
      </div>

      {!theatre && <ScrollProgress />}

      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <motion.div
            ref={menuRef}
            id="section-menu" className="border-t border-line bg-ink-900"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
          >
            <nav aria-label="Contents" className="wrap grid max-h-[80vh] gap-x-8 gap-y-5 overflow-y-auto py-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="lg:hidden">
                <ul>
                  {([['top', 'Home'], ['explore', 'Explore: all chapters']] as const).map(([id, label]) => (
                    <li key={id}>
                      <button onClick={() => choose(id)} className="min-h-[44px] w-full py-2 text-left text-[1rem] font-semibold text-sand hover:text-cyan-200">{label}</button>
                    </li>
                  ))}
                </ul>
              </div>
              {EXPLORE_CHAPTERS.map(ch => (
                <div key={ch.id}>
                  <button onClick={() => choose(ch.id)}
                    className="min-h-[44px] w-full py-2 text-left font-serif text-[1.05rem] font-semibold text-sand hover:text-cyan-200">
                    <span className="mlabel mr-2 text-mute">Chapter {ch.n}</span>{ch.title}
                  </button>
                  <ul>
                    {SECTIONS.filter(s => ch.letters.includes(s.letter)).map(s => (
                      <li key={s.id}>
                        <button onClick={() => choose(s.id)}
                          className="flex min-h-[44px] w-full items-baseline gap-3 py-2 text-left text-[0.95rem] text-sand/90 hover:text-cyan-200">
                          <span className="w-4 font-semibold text-cyan-300">{s.letter}</span>{s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <button onClick={() => choose('sources')}
                  className="min-h-[44px] w-full py-2 text-left font-serif text-[1.05rem] font-semibold text-sand hover:text-cyan-200">
                  Sources and method
                </button>
                <ul>
                  <li>
                    <button onClick={() => choose('references')}
                      className="flex min-h-[44px] w-full items-baseline gap-3 py-2 text-left text-[0.95rem] text-sand/90 hover:text-cyan-200">
                      <span className="w-4 font-semibold text-cyan-300">L</span>References
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-800 py-12">
      <div className="wrap text-[0.9rem] leading-relaxed text-mute">
        <p className="font-serif text-[1.05rem] font-semibold text-sand">{PROJECT.title}</p>
        <p className="mt-1">{PROJECT.course}</p>
        <p className="mt-2">
          {PROJECT.assessment} &nbsp;&middot;&nbsp; {PROJECT.student} &nbsp;&middot;&nbsp;
          Section {PROJECT.section} &nbsp;&middot;&nbsp; Mentor {PROJECT.mentor} &nbsp;&middot;&nbsp;
          {PROJECT.arrangement}
        </p>
        <p className="mt-2">
          {PROJECT.version} &nbsp;&middot;&nbsp; Draft due {PROJECT.draftDue}
          &nbsp;&middot;&nbsp; Final submission due {PROJECT.finalDue}
        </p>
        <p className="mt-4 max-w-reading">
          Student coursework. The Philippine career conversion track described here is a proposal
          developed for this assessment. It has not been submitted to, reviewed by, or approved by
          any government agency or employer.
        </p>
      </div>
    </footer>
  );
}
