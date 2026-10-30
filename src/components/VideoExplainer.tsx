import { useEffect, useRef, useState } from 'react';
import { VIDEO_EXPLAINER as V, chapterAt, chapterName } from '../data/video';
import { usePresentation, type Surface } from '../hooks/usePresentation';
import { placeCues } from './captions';

/**
 * The presentation player: the single video element on the site. It exists on the
 * Home stage once the visitor presses play there, or in the Watch theatre, never in
 * both. Nothing autoplays on arrival: playback starts from a Play, Watch or chapter
 * button, captions are on by default, and the transcript carries everything the
 * narration says.
 */
export function PresentationPlayer({ surface = 'theatre', onTime }: { surface?: Surface; onTime?: (t: number) => void }) {
  const { request, play, watch } = usePresentation();
  const restart = surface === 'home' ? play : watch;
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);
  const [announce, setAnnounce] = useState('');
  const handled = useRef<number | null>(null);
  const trackRef = useRef<HTMLTrackElement>(null);

  /* Native listener: the track's load event is not one React attaches. */
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const apply = () => placeCues(t.track);
    if (t.readyState === 2) apply();
    t.addEventListener('load', apply);
    return () => t.removeEventListener('load', apply);
  }, [failed]);

  /* Act on each watch request once: seek the same element, then play. A seek made
     before the metadata has loaded is applied as soon as it has. */
  useEffect(() => {
    const v = ref.current;
    if (!v || !request || request.surface !== surface || handled.current === request.id) return;
    handled.current = request.id;
    const go = () => {
      v.currentTime = request.start;
      const p = v.play();
      /* A browser may still refuse to start; the native play button remains. */
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    if (v.readyState >= 1) go();
    else v.addEventListener('loadedmetadata', go, { once: true });
    setAnnounce(`Now playing: ${chapterName(chapterAt(request.start))}`);
  }, [request, surface]);

  const current = chapterAt(now);

  return (
    <div>
      <div className="overflow-hidden rounded-t-[14px] border border-b-0 border-line bg-ink-950 aspect-video">
        {failed ? (
          <div role="status" className="h-full flex items-center justify-center p-6 text-center text-[0.95rem] leading-relaxed text-sand/85">
            <p>
              The video could not be loaded. The transcript below has the full narration,
              or you can <a className="link" href={V.src} download>download the video</a>.
            </p>
          </div>
        ) : (
          <video
            ref={ref}
            className="h-full w-full"
            controls playsInline preload="metadata" poster={V.poster}
            aria-label={V.title}
            onTimeUpdate={e => { setNow(e.currentTarget.currentTime); onTime?.(e.currentTarget.currentTime); }}
            onError={() => setFailed(true)}
          >
            <source src={V.src} type="video/mp4" onError={() => setFailed(true)} />
            <track ref={trackRef} kind="captions" srcLang="en" label="English" src={V.captions} default />
            Your browser cannot play this video. The transcript below has the full narration.
          </video>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-b-[14px] border border-t-0 border-line bg-ink-800 px-4 py-2 text-[0.9rem] text-mute">
        <span className="text-sand/90">Now showing: {chapterName(current)}</span>
        <button type="button" onClick={() => restart(0)} className="ml-auto btn btn-g !px-4 !py-1.5 !text-[0.875rem]">
          <span aria-hidden>⟲</span> Start over
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}

