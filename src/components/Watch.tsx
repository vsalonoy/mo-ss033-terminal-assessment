import { useEffect, useState } from 'react';
import { usePresentation } from '../hooks/usePresentation';
import { VIDEO_EXPLAINER as V, CHAPTERS, MAIN, chapterAt, clock } from '../data/video';
import { PROJECT } from '../data/research';
import { EXPLORE_CHAPTERS } from '../data/explore';
import { Disclosure } from './primitives';
import { PresentationPlayer } from './VideoExplainer';

/**
 * The Watch theatre: a dark room where the video is the only bright thing. One
 * player, the chapters beside it with a link from each to its evidence in Explore,
 * then the disclosures and the transcript. No research text runs under the player.
 */
export function WatchTheatre() {
  const { leave } = usePresentation();
  return (
    <main id="watch-main" tabIndex={-1} className="pt-16 pb-20 focus:outline-none">
      <div className="wrap max-w-[1320px]">
        <div className="py-5">
          <button type="button" onClick={leave} className="btn btn-g !px-4">
            <span aria-hidden>←</span> Back to the research
          </button>
        </div>

        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="min-w-0">
            <p className="eyebrow">Watch the Research · {V.duration}</p>
            <h1 id="watch-title" tabIndex={-1} className="mt-2 font-serif text-[clamp(1.25rem,1.8vw,1.55rem)] font-semibold leading-snug text-sand focus:outline-none">
              {PROJECT.title}: {PROJECT.titleSub}
            </h1>
            <p className="mt-2 text-[0.95rem] text-mute">
              {PROJECT.researcher} · {PROJECT.college} · {PROJECT.course}, Section {PROJECT.section} · Mentor: {PROJECT.mentor}
            </p>
            <div id={V.id} className="mt-6"><PresentationPlayer /></div>
            <PresentationNotes />
          </div>
          <ChapterRail />
        </div>
      </div>
    </main>
  );
}

/** Chapter buttons. Each one seeks the same video; none starts a second player. */
function ChapterRail() {
  const { watch } = usePresentation();
  const [now, setNow] = useState<number | null>(null);
  /* Follow the player's position for aria-current, without owning the element. */
  useEffect(() => {
    const v = document.querySelector<HTMLVideoElement>(`#${V.id} video`);
    if (!v) return;
    const on = () => setNow(v.currentTime);
    v.addEventListener('timeupdate', on);
    return () => v.removeEventListener('timeupdate', on);
  }, []);
  const current = now === null ? null : chapterAt(now);
  const subs = (n: number) => CHAPTERS.filter(c => c.sub && Math.floor(c.n) === n);

  return (
    <nav aria-labelledby="chapters-title" className="lg:sticky lg:top-24 lg:self-start">
      <h2 id="chapters-title" className="mlabel text-mute">Chapters · captions on</h2>
      <ol className="mt-3 divide-y divide-line border-y border-line">
        {MAIN.map(c => {
          const evidence = EXPLORE_CHAPTERS.find(e => e.video === c.n);
          const on = current?.n === c.n;
          return (
            <li key={c.n} className="py-2">
              <button type="button" onClick={() => watch(c.start)} aria-current={on ? 'true' : undefined}
                className={`flex min-h-[44px] w-full items-baseline gap-3 rounded-lg px-2 py-2 text-left text-[0.98rem] leading-snug transition-colors ${
                  on ? 'bg-ink-700 text-cyan-200' : 'text-sand hover:bg-ink-700'}`}>
                <span className="w-11 shrink-0 font-mono text-[0.85rem] tabular-nums text-cyan-300">{clock(c.start)}</span>
                <span>{c.n === 0 || c.n === 6 ? c.title : `${c.n}. ${c.title}`}</span>
              </button>
              {subs(c.n).length > 0 && (
                <ul className="ml-14 flex flex-wrap gap-x-1">
                  {subs(c.n).map(s => (
                    <li key={s.n}>
                      <button type="button" onClick={() => watch(s.start)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded px-2 text-[0.88rem] text-sand/85 hover:text-cyan-200">
                        <span className="font-mono text-[0.8rem] tabular-nums text-mute">{clock(s.start)}</span>{s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {evidence && (
                <a href={`#${evidence.id}`} className="ml-14 inline-flex min-h-[44px] items-center text-[0.9rem] font-semibold text-cyan-300 hover:text-cyan-200">
                  See the evidence: Explore chapter {evidence.n} <span aria-hidden className="ml-1">→</span>
                </a>
              )}
              {c.n === 6 && (
                <a href="#photo-credits" className="ml-14 inline-flex min-h-[44px] items-center text-[0.9rem] font-semibold text-cyan-300 hover:text-cyan-200">
                  Photograph credits <span aria-hidden className="ml-1">→</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Disclosures and the transcript, under the player. */
function PresentationNotes() {
  return (
    <div id="presentation-notes" className="mt-8">
      <h2 className="mlabel text-mute">About this video</h2>
      <div className="mt-3 max-w-reading space-y-2 text-[0.95rem] leading-relaxed text-sand/85">
        <p>
          The narration is an AI-generated voice. It is not my voice and is not modelled on it.
          Everything the video says is in the Explore chapters, with sources.
        </p>
        <p>
          Video licensed{' '}
          <a className="link" href={V.licenceUrl} target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0<span className="sr-only"> (opens in a new tab)</span>
          </a>
          . Photograph credits are in the video&rsquo;s end credits and in{' '}
          <a className="link" href="#photo-credits">Sources</a>.{' '}
          <a className="link" href={V.src} download>Download the video ({V.size})</a>
        </p>
      </div>
      <Disclosure summary="Read the transcript" hint="The full narration, by chapter">
        <div className="space-y-6 pt-3">
          {V.transcript.map(part => (
            <div key={part.title}>
              <h3 className="mlabel text-cyan-300">{part.title}</h3>
              {part.paragraphs.map(p => (
                <p key={p} className="mt-2 max-w-reading text-[1rem] leading-relaxed text-sand/90">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </Disclosure>
    </div>
  );
}

/**
 * #watch while the video is switched off (until D-3). Not an empty page and not a
 * player that cannot play: it says the video is not available and offers the same
 * research to read.
 */
export function WatchUnavailable() {
  const { leave } = usePresentation();
  return (
    <main id="watch-main" tabIndex={-1} className="pt-16 focus:outline-none">
      <div className="wrap py-16 sm:py-24">
        <p className="eyebrow">Watch the Research</p>
        <h1 id="watch-title" tabIndex={-1} className="t-sec mt-3 max-w-[24ch] focus:outline-none">
          The video presentation is not available on this site yet
        </h1>
        <p className="t-lede mt-5">
          Everything the presentation covers is here to read, with sources, in five chapters.
        </p>
        <ol className="mt-8 grid max-w-reading gap-2">
          {EXPLORE_CHAPTERS.map(ch => (
            <li key={ch.id}>
              <a href={`#${ch.id}`} className="link inline-flex min-h-[44px] items-center text-[1.02rem]">
                Chapter {ch.n}: {ch.title}
              </a>
            </li>
          ))}
        </ol>
        <button type="button" onClick={leave} className="btn btn-g mt-8">
          <span aria-hidden>←</span> Back to the research
        </button>
      </div>
    </main>
  );
}
