import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../hooks/useSiteState';
import { ScrollProgress } from './Ambient';
import { SECTIONS, PROJECT } from '../data/research';

/* Top bar: section jump list, mode switch. Present in both modes. */
export function TopBar() {
  const { mode, setMode, index, go } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 inset-x-0 z-40 border-b border-line bg-ink-900/85 backdrop-blur-md">
      <div className="wrap flex items-center gap-3 sm:gap-4 h-14">
        {/* "#top" is the hero, which only Explore Mode renders. In Presentation
            Mode the wordmark returns to the first slide instead of doing nothing. */}
        <a
          href="#top"
          onClick={e => {
            if (mode !== 'presentation') return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            go(0);
          }}
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
            onClick={() => setOpen(o => !o)}
            aria-expanded={open} aria-controls="section-menu" aria-label="Section list"
            className="xl:hidden btn btn-g !px-2.5 !py-1.5 !text-[0.7rem]"
          >Sections</button>

          <div role="group" aria-label="Interaction mode" className="flex rounded-full border border-line p-0.5">
            {(['explore', 'presentation'] as const).map(m => (
              <button
                key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
                aria-label={m === 'explore' ? 'Explore mode' : 'Presentation mode'}
                className={`px-2.5 sm:px-3.5 py-1 rounded-full font-display text-[0.66rem] sm:text-[0.69rem] font-bold uppercase tracking-[0.1em] transition-colors ${
                  mode === m ? 'bg-cyan-500/15 text-cyan-300' : 'text-mute hover:text-sand'}`}
              >{m === 'explore' ? 'Explore' : 'Present'}</button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'explore' && <ScrollProgress />}

      <AnimatePresence>
        {open && (
          <motion.div
            id="section-menu" className="xl:hidden border-t border-line bg-ink-800/95"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
          >
            <ul className="wrap py-3 max-h-[60vh] overflow-y-auto">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => { go(i); setOpen(false); }}
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

/* Explore Mode only: slim reading-progress rail down the left. */
export function SectionRail() {
  const { index, go, mode } = useSite();
  if (mode !== 'explore') return null;
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

/* Presentation Mode only: guided Prev/Next with a position indicator. */
export function PresentationControls() {
  const { mode, index, next, prev, go, setMode } = useSite();
  if (mode !== 'presentation') return null;
  const cur = SECTIONS[index];
  const first = index === 0, last = index === SECTIONS.length - 1;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-ink-900/92 backdrop-blur-md">
      <div className="h-0.5 bg-line">
        <motion.div
          className="h-full bg-cyan-400"
          animate={{ width: `${((index + 1) / SECTIONS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="wrap flex items-center gap-3 py-3">
        <div className="min-w-0">
          <div className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cyan-300">
            {cur.letter} &nbsp;/&nbsp; {index + 1} of {SECTIONS.length}
          </div>
          <div className="truncate text-[0.9rem] text-sand">{cur.label}</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="btn btn-g !px-3 !py-1.5" onClick={prev} disabled={first}
            aria-label="Previous section">&larr;<span className="hidden sm:inline ml-1.5">Prev</span></button>
          <button className="btn btn-p !px-3 !py-1.5" onClick={next} disabled={last}
            aria-label="Next section"><span className="hidden sm:inline mr-1.5">Next</span>&rarr;</button>
          <button className="btn btn-g !px-3 !py-1.5 hidden sm:inline-flex"
            onClick={() => { setMode('explore'); go(index); }}>Exit</button>
        </div>
      </div>
      <div className="wrap pb-2 text-[0.72rem] text-mute/80 hidden sm:block">
        Arrow keys or space to move. P switches mode. Esc exits.
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="wrap text-[0.78rem] leading-relaxed text-mute/80">
        <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-mute">{PROJECT.course}</p>
        <p className="mt-2">
          {PROJECT.assessment} &nbsp;&middot;&nbsp; {PROJECT.student} &nbsp;&middot;&nbsp;
          Section {PROJECT.section} &nbsp;&middot;&nbsp; Mentor {PROJECT.mentor} &nbsp;&middot;&nbsp;
          {PROJECT.arrangement}
        </p>
        <p className="mt-2">
          {PROJECT.version} &nbsp;&middot;&nbsp; Internal completion target {PROJECT.draftTarget}
          &nbsp;&middot;&nbsp; Submission deadline {PROJECT.finalDeadline}
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
