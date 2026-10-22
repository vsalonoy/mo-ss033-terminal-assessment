import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../hooks/useSiteState';
import { ScrollProgress } from './Ambient';
import { SECTIONS, PROJECT } from '../data/research';

/* Top bar: wordmark, section jump list, and the responsive Sections menu. */
export function TopBar() {
  const { index, go } = useSite();
  const [open, setOpen] = useState(false);

  /**
   * The section chosen from the responsive menu, navigated only once the menu's
   * exit animation has finished.
   *
   * Navigating while that animation runs does not work. The menu animates
   * `height: auto -> 0`, and that measurement saves and restores the document
   * scroll position, which was (0, 0) at the moment of the click. The restore
   * lands after go() has already scrolled, so the page snaps back to the top and
   * the selection appears to do nothing. Deferring to onExitComplete ties the
   * navigation to the animation lifecycle rather than to a guessed delay.
   */
  const [pending, setPending] = useState<number | null>(null);
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

  /* The menu is hidden from xl upwards. Closing it on the way past that breakpoint
     stops the trigger reporting aria-expanded="true" while invisible. */
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = () => { if (mq.matches) dismiss(); };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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
    const i = pending;
    setPending(null);
    go(i);
    /* Move focus to the destination so a keyboard reader lands on the new section.
       Polled rather than assumed, so focus still lands if the section renders late.
       preventScroll keeps focusing from fighting the scroll go() just started. */
    let tries = 48;
    const land = () => {
      const el = document.getElementById(SECTIONS[i].id);
      if (el) { el.focus({ preventScroll: true }); return; }
      if (tries-- > 0) requestAnimationFrame(land);
    };
    requestAnimationFrame(land);
  }, [pending, go]);

  return (
    <div className="fixed top-0 inset-x-0 z-40 border-b border-line bg-ink-900/85 backdrop-blur-md">
      <div className="wrap flex items-center gap-3 sm:gap-4 h-14">
        <a
          href="#top"
          className="min-w-0 font-display text-[0.88rem] sm:text-[0.95rem] font-bold text-sand truncate hover:text-cyan-300"
        >
          Automation <span className="text-mute">and Filipino workers</span>
        </a>

        <nav aria-label="Sections" className="hidden xl:flex items-center gap-1 ml-auto">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id} onClick={() => go(i)}
              aria-current={i === index ? 'true' : undefined}
              title={s.label}
              className={`px-2 py-1 rounded font-display text-[0.7rem] font-bold tracking-wide transition-colors ${
                i === index ? 'text-cyan-300 bg-cyan-500/10' : 'text-mute hover:text-sand'}`}
            >{s.letter}</button>
          ))}
        </nav>

        <div className="ml-auto xl:ml-0 flex items-center gap-2 shrink-0">
          <button
            ref={triggerRef}
            onClick={() => setOpen(o => {
              /* Reopening cancels a pending selection, so an interrupted exit
                 animation cannot navigate somewhere unexpected later. */
              if (!o) { setPending(null); returnFocus.current = false; }
              return !o;
            })}
            aria-expanded={open} aria-controls="section-menu" aria-label="Section list"
            className="xl:hidden btn btn-g !px-2.5 !py-1.5 !text-[0.7rem]"
          >Sections</button>
        </div>
      </div>

      <ScrollProgress />

      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <motion.div
            ref={menuRef}
            id="section-menu" className="xl:hidden border-t border-line bg-ink-800/95"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
          >
            <ul className="wrap py-3 max-h-[60vh] overflow-y-auto">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => { setPending(i); setOpen(false); }}
                    className={`w-full text-left py-2 flex gap-3 text-[0.9rem] ${
                      i === index ? 'text-cyan-300' : 'text-sand/90 hover:text-cyan-300'}`}
                  >
                    <span className="font-display text-[0.75rem] font-bold text-cyan-300/70 w-4">{s.letter}</span>{s.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Slim reading-progress rail down the left, on large screens. */
export function SectionRail() {
  const { index, go } = useSite();
  return (
    <nav aria-label="Section progress" className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id} onClick={() => go(i)} title={`${s.letter}. ${s.label}`}
          aria-current={i === index ? 'true' : undefined}
          className="group flex items-center gap-2"
        >
          <span className={`block h-px transition-all ${
            i === index ? 'w-7 bg-cyan-300' : 'w-3.5 bg-mute/40 group-hover:w-5 group-hover:bg-mute'}`} />
          <span className={`font-display text-[0.66rem] font-semibold transition-opacity ${
            i === index ? 'text-cyan-300 opacity-100' : 'text-mute opacity-0 group-hover:opacity-100'}`}>
            {s.letter}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="wrap text-[0.78rem] leading-relaxed text-mute/80">
        <p className="mlabel text-mute">{PROJECT.course}</p>
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
