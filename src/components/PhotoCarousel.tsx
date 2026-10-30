import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Media } from '../data/media';

export const SLIDE_MS = 7000;

/**
 * Illustrative photographs in the opening stage.
 *
 * It advances every seven seconds and stops after one full cycle, back on the first
 * photograph, so nothing keeps moving beside the text (WCAG 2.2.2). It also holds
 * still while the pointer or keyboard focus is inside it, while the tab is hidden and
 * while it is off screen. Under reduced motion it never advances on its own.
 *
 * The parent unmounts it when the presentation starts, so the photographs and the
 * video can never both be active.
 */
export function PhotoCarousel({ slides, reduced, label }: { slides: Media[]; reduced: boolean; label: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [held, setHeld] = useState({ hover: false, focus: false, hidden: false, offscreen: false });
  const [announce, setAnnounce] = useState('');
  const advanced = useRef(0);          // automatic steps taken in the current cycle
  const rootRef = useRef<HTMLDivElement>(null);
  const swipeX = useRef<number | null>(null);
  const captionId = useId();
  const n = slides.length;

  useEffect(() => {
    const onVis = () => setHeld(h => ({ ...h, hidden: document.visibilityState === 'hidden' }));
    document.addEventListener('visibilitychange', onVis);
    const el = rootRef.current;
    const io = el && 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => setHeld(h => ({ ...h, offscreen: !e.isIntersecting })), { threshold: 0.25 })
      : null;
    if (el && io) io.observe(el);
    return () => { document.removeEventListener('visibilitychange', onVis); io?.disconnect(); };
  }, []);

  /* Under reduced motion it moves only if the visitor presses Play. */
  const paused = !playing || held.hover || held.focus || held.hidden || held.offscreen;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = window.setTimeout(() => {
      advanced.current += 1;
      setIndex(i => (i + 1) % n);
      /* One full cycle ends back on the first photograph, then stops. */
      if (advanced.current >= n) { advanced.current = 0; setPlaying(false); }
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [paused, index, n]);

  /* Manual navigation is announced; automatic changes are not. */
  const goTo = useCallback((i: number) => {
    const next = (i + n) % n;
    setIndex(next);
    setAnnounce(`Photograph ${next + 1} of ${n}: ${slides[next].caption}`);
  }, [n, slides]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  };
  const onPointerDown = (e: PointerEvent) => { swipeX.current = e.clientX; };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 48) goTo(index + (dx < 0 ? 1 : -1));
  };

  const s = slides[index];
  /* Only the current photograph, the one leaving and the next are in the DOM: the
     next one is preloaded so the cross-fade never waits on the network. */
  const near = (i: number) => i === index || i === (index + 1) % n || i === (index - 1 + n) % n;

  return (
    <div
      ref={rootRef}
      role="region" aria-roledescription="carousel" aria-label={label}
      onKeyDown={onKey}
      onMouseEnter={() => setHeld(h => ({ ...h, hover: true }))}
      onMouseLeave={() => setHeld(h => ({ ...h, hover: false }))}
      onFocus={() => setHeld(h => ({ ...h, focus: true }))}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(h => ({ ...h, focus: false })); }}
      className="flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden bg-ink-950 touch-pan-y"
        onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {slides.map((m, i) => near(i) && (
          <div key={m.key} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}
            aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-[600ms] ease-soft ${
              i === index ? 'opacity-100' : 'opacity-0'}`}>
            <img src={m.src} srcSet={m.srcSet} sizes="(min-width: 1024px) 680px, 100vw"
              width={m.width} height={m.height} alt={m.alt}
              loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} decoding="async"
              aria-describedby={i === index ? captionId : undefined}
              className="h-full w-full object-cover saturate-[0.95]" draggable={false} />
          </div>
        ))}

        <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous photograph"
          className="carousel-btn left-2"><span aria-hidden>‹</span></button>
        <button type="button" onClick={() => goTo(index + 1)} aria-label="Next photograph"
          className="carousel-btn right-2"><span aria-hidden>›</span></button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line bg-ink-900/95 px-3 py-2">
        <button type="button" onClick={() => {
            if (!playing) advanced.current = 0;
            setPlaying(p => !p);
          }}
          aria-label={playing ? 'Pause the photographs' : 'Play the photographs'}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-sand hover:border-cyan-500/45 hover:text-cyan-200">
          {playing
            ? <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 fill-current"><rect x="2" y="1.5" width="2.6" height="9" rx=".6" /><rect x="7.4" y="1.5" width="2.6" height="9" rx=".6" /></svg>
            : <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 fill-current"><path d="M3 1.5v9l7-4.5z" /></svg>}
        </button>
        <div className="flex items-center" role="group" aria-label="Choose a photograph">
          {slides.map((m, i) => (
            <button key={m.key} type="button" onClick={() => goTo(i)}
              aria-label={`Photograph ${i + 1} of ${n}: ${m.caption}`} aria-current={i === index ? 'true' : undefined}
              className="grid h-11 w-7 place-items-center">
              <span aria-hidden className={`block h-2 rounded-full transition-all ${
                i === index ? 'w-5 bg-cyan-300' : 'w-2 bg-mute/50 hover:bg-mute'}`} />
            </button>
          ))}
        </div>
        <span className="ml-auto text-[0.875rem] tabular-nums text-mute" aria-hidden>{index + 1} / {n}</span>
      </div>

      <p id={captionId} className="px-3 pt-1 pb-3 text-[0.875rem] leading-snug text-sand/90">
        {s.caption}{' '}
        <span className="text-mute">
          Photograph: {s.creator}, {s.licenseUrl
            ? <a href={s.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-mute/50 underline-offset-2 hover:text-cyan-200">{s.license}<span className="sr-only"> (opens in a new tab)</span></a>
            : s.license}{s.adapted ? ', adapted' : ''}. Credits in section L.
        </span>
      </p>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
