import { useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { usePresentation } from '../hooks/usePresentation';
import { PROJECT, HEADLINE_STATS, REFERENCES } from '../data/research';
import { EXPLORE_CHAPTERS, HOME_RECOMMENDATION, EXPOSURE_PERIOD, EVIDENCE_HIGHLIGHT } from '../data/explore';
import { CAROUSEL } from '../data/media';
import { VIDEO_EXPLAINER as V, MAIN, chapterAt, clock } from '../data/video';
import { Cite, Sentences } from './primitives';
import { PhotoCarousel } from './PhotoCarousel';
import { PresentationPlayer } from './VideoExplainer';

/**
 * Home: the research on one screen. The title, why it matters (the approved opening
 * sentence, o1), who did it (the researcher card with the approved introduction,
 * o2), the recommendation, and the two ways in. Three highlights follow.
 *
 * With the video on, Home opens on the presentation: a dark stage with the video
 * as its centrepiece, playable in place, and its chapters beneath it. The
 * researcher card and the photographs follow.
 *
 * With the video switched off (until D-3) there is nothing to watch, so the hero is
 * the title beside the photographs, and the second door leads to the sources
 * instead of showing a control that does nothing.
 */
export default function Home() {
  const reduced = usePrefersReducedMotion();
  const { enabled, watch } = usePresentation();
  const [o1, o2] = PROJECT.introduction;
  const [exposed, highest] = HEADLINE_STATS;

  const researcher = (
    <section aria-labelledby="researcher-name" className="border-l-2 border-cyan-500 pl-5">
      <h2 id="researcher-name" className="font-sans text-[1.05rem] font-semibold text-sand">
        <span className="eyebrow block">Research by</span>{' '}
        <span className="mt-1 block">{PROJECT.researcher}</span>
      </h2>
      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[0.92rem] text-mute">
        <div><dt className="sr-only">College</dt><dd>{PROJECT.college}</dd></div>
        <div><dt className="sr-only">Course</dt><dd>{PROJECT.course} · Section {PROJECT.section}</dd></div>
        <div><dt className="inline">Mentor: </dt><dd className="inline">{PROJECT.mentor}</dd></div>
      </dl>
      {/* o2: the researcher's introduction, word for word. */}
      <p className="mt-3 max-w-[56ch] text-[1rem] leading-relaxed text-sand/90">{o2}</p>
    </section>
  );
  const photos = (
    <div className="overflow-hidden rounded-[14px] border border-line bg-ink-700">
      <PhotoCarousel slides={CAROUSEL} reduced={reduced}
        label="Illustrative photographs of Philippine workplaces and training" />
    </div>
  );
  /* o1: why the issue matters. */
  const why = <p className="max-w-[44ch] font-serif text-[clamp(1.12rem,1.5vw,1.3rem)] leading-relaxed text-sand/90">{o1}</p>;

  return (
    <header id="top" className="scroll-mt-16">
      {enabled ? (
        <>
          <VideoStage />
          <div className="wrap grid gap-x-14 gap-y-8 pt-12 pb-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:pb-16">
            <div className="space-y-7">{why}{researcher}</div>
            {photos}
          </div>
        </>
      ) : (
        <div className="wrap grid gap-x-14 gap-y-8 pt-10 pb-12 sm:pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:pb-16">
          <div>
            <p className="eyebrow">{PROJECT.course} · {PROJECT.assessment}</p>
            {/* The formal research title is the page's only h1. */}
            <h1 className="mt-4 text-sand">
              <span className="block text-hero">{PROJECT.title}:</span>{' '}
              <span className="mt-3 block font-serif text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug text-mute">
                {PROJECT.titleSub}
              </span>
            </h1>
            <div className="mt-6">{why}</div>
            <div className="mt-7">{researcher}</div>
          </div>
          {photos}
        </div>
      )}

      {/* The answer, then the two ways in. */}
      <div className="wrap">
        <div className="rounded-[14px] border border-line bg-ink-700 p-6 sm:p-8">
          <p className="font-serif text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug text-sand">{HOME_RECOMMENDATION.lead}</p>
          <p className="mt-3 max-w-[72ch] text-[1rem] leading-relaxed text-sand/85"><Sentences items={HOME_RECOMMENDATION.body} /></p>
        </div>

        <nav aria-label="Two ways into the research" className="mt-5 grid gap-5 md:grid-cols-2">
          {enabled ? (
            <button type="button" onClick={() => watch(0)}
              className="group theme-stage flex min-h-[13rem] flex-col rounded-[14px] bg-ink-900 p-7 text-left text-sand
                         ring-cyan-300 transition-shadow hover:ring-2 focus-visible:outline-offset-4">
              <span className="eyebrow">Watch the Research</span>
              <span className="mt-3 font-serif text-[1.65rem] font-semibold leading-tight">The research in {V.duration}</span>
              <span className="mt-3 max-w-[42ch] text-[0.98rem] leading-relaxed text-sand/85">
                A narrated presentation: the issue, the five alternatives compared, the proposal, and how its success would be judged.
              </span>
              <span className="mt-auto pt-6 text-[0.92rem] font-semibold text-cyan-300">
                <span aria-hidden>▶ </span>Play · {EXPLORE_CHAPTERS.length} chapters · captions and transcript
              </span>
            </button>
          ) : (
            <a href="#sources"
              className="group flex min-h-[13rem] flex-col rounded-[14px] border border-line bg-ink-700 p-7 text-sand
                         transition-colors hover:border-cyan-500/70">
              <span className="eyebrow">Sources and method</span>
              <span className="mt-3 font-serif text-[1.65rem] font-semibold leading-tight">How the evidence was chosen</span>
              <span className="mt-3 max-w-[42ch] text-[0.98rem] leading-relaxed text-sand/85">
                {REFERENCES.length} references, how each was evaluated, and the criteria used at each stage.
              </span>
              <span className="mt-auto pt-6 text-[0.92rem] font-semibold text-cyan-300">Open the sources <span aria-hidden>→</span></span>
            </a>
          )}
          <a href="#explore"
            className="group flex min-h-[13rem] flex-col rounded-[14px] border border-line bg-ink-700 p-7 text-sand
                       transition-colors hover:border-cyan-500/70">
            <span className="eyebrow">Explore the Research</span>
            <span className="mt-3 font-serif text-[1.65rem] font-semibold leading-tight">The evidence behind it</span>
            <span className="mt-3 max-w-[42ch] text-[0.98rem] leading-relaxed text-sand/85">
              Interactive evidence, the 20 ratings side by side, the proposed pathway, six SMART indicators and every source.
            </span>
            <span className="mt-auto pt-6 text-[0.92rem] font-semibold text-cyan-300">
              {EXPLORE_CHAPTERS.length} chapters · {REFERENCES.length} sources <span aria-hidden>→</span>
            </span>
          </a>
        </nav>

        {/* Three highlights, each with its source and reference period. */}
        <section aria-labelledby="highlights-title" className="mt-14 border-t-2 border-sand pb-6">
          <h2 id="highlights-title" className="sr-only">Research highlights</h2>
          <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            <Highlight value={exposed.value} label={exposed.label}>
              <Sentences items={[EXPOSURE_PERIOD]} />
            </Highlight>
            <Highlight value={highest.value} label={highest.label}>
              {highest.detail} <Cite keys={highest.ref} />
            </Highlight>
            <Highlight value={EVIDENCE_HIGHLIGHT.value} label={EVIDENCE_HIGHLIGHT.label}>
              {EVIDENCE_HIGHLIGHT.detail} <Cite keys={EVIDENCE_HIGHLIGHT.ref} />
            </Highlight>
          </div>
          <p className="mt-2 text-[0.92rem] text-mute">
            Every figure, with its date and scope, is in <a href="#challenge" className="link">section B, the evidence</a>.
          </p>
        </section>
      </div>
    </header>
  );
}

function Highlight({ value, label, children }: { value: string; label: string; children: React.ReactNode }) {
  return (
    <div className="py-6 md:px-6 md:first:pl-0">
      <div className="t-stat text-sand">{value}</div>
      <div className="mt-3 text-[1rem] font-medium leading-snug text-sand">{label}</div>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-mute">{children}</p>
    </div>
  );
}

/**
 * The opening stage: the title, then the video as the page's centrepiece. Until the
 * visitor presses play it is the poster frame and a play button, so no video
 * element exists and nothing downloads; pressing play puts the one player here and
 * starts it. The chapters beneath seek that same player. "Chapters and transcript"
 * carries the position into the theatre, which then holds the player instead.
 */
function VideoStage() {
  const { play, watch, homeLive } = usePresentation();
  const [now, setNow] = useState(0);
  const current = homeLive ? chapterAt(now) : null;

  return (
    <div className="theme-stage relative isolate overflow-hidden bg-ink-900 text-sand">
      {/* Ambient light from the poster, behind everything. */}
      <img src={V.poster} alt="" aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgb(11_15_20/0.35),rgb(11_15_20/0.92)_70%)]" />

      <div className="wrap max-w-[1180px] pt-9 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-[60rem] text-center">
          <p className="eyebrow">{PROJECT.course} · {PROJECT.assessment}</p>
          {/* The formal research title is the page's only h1. */}
          <h1 className="mt-4 text-sand">
            <span className="block text-hero">{PROJECT.title}:</span>{' '}
            <span className="mt-3 block font-serif text-[clamp(1.1rem,1.9vw,1.45rem)] font-medium leading-snug text-mute">
              {PROJECT.titleSub}
            </span>
          </h1>
        </div>

        <section id="home-video" aria-labelledby="home-video-title" className="mt-8 sm:mt-10">
          <h2 id="home-video-title" className="sr-only">Video presentation</h2>
          <div className="rounded-[16px] shadow-[0_30px_90px_-30px_rgb(111_208_200/0.35),0_0_0_1px_rgb(255_255_255/0.06)]">
            {homeLive ? (
              <PresentationPlayer surface="home" onTime={setNow} />
            ) : (
              <button type="button" onClick={() => play(0)}
                aria-label={`Play the video presentation, ${V.duration}, captions on`}
                className="group relative block aspect-video w-full overflow-hidden rounded-[16px] border border-line bg-ink-950 text-left focus-visible:outline-offset-4">
                <img src={V.poster} alt="" width={1600} height={900}
                  className="h-full w-full object-cover transition-transform duration-700 ease-soft motion-safe:group-hover:scale-[1.015]" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgb(3_7_12/0.75)] via-transparent to-transparent" />
                <span aria-hidden className="absolute left-1/2 top-1/2 flex h-[clamp(4rem,9vw,6rem)] w-[clamp(4rem,9vw,6rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-300 text-ink-950 shadow-[0_0_0_10px_rgb(111_208_200/0.18)] transition-transform duration-300 ease-soft motion-safe:group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="ml-1 h-[42%] w-[42%]" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" /></svg>
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-3 text-[0.85rem] text-sand/90 sm:px-6 sm:pb-5 sm:text-[0.95rem]">
                  <span className="font-semibold text-sand">Play the presentation</span>
                  <span className="font-mono tabular-nums">{V.duration}</span>
                  {/* The numbered chapters, as on the Watch card: not the introduction or credits. */}
                  <span className="hidden sm:inline">· Captions on · {EXPLORE_CHAPTERS.length} chapters</span>
                </span>
              </button>
            )}
          </div>

          <nav aria-label="Video chapters" className="mt-5">
            <ol className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
              {MAIN.map(c => {
                const on = current?.n === c.n;
                return (
                  <li key={c.n} className="snap-start">
                    <button type="button" onClick={() => play(c.start)} aria-current={on ? 'true' : undefined}
                      className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[0.9rem] transition-colors ${
                        on ? 'border-cyan-300 bg-cyan-300/10 text-cyan-200' : 'border-line bg-ink-800/70 text-sand/90 hover:border-cyan-300/70 hover:text-cyan-200'}`}>
                      <span className="font-mono text-[0.8rem] tabular-nums text-cyan-300">{clock(c.start)}</span>
                      {c.n === 0 || c.n === 6 ? c.title : `${c.n}. ${c.title}`}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-4 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-5">
            <button type="button" onClick={() => watch(homeLive ? now : 0)} className="btn btn-g">
              Open the theatre: chapters and transcript <span aria-hidden>→</span>
            </button>
            <p className="text-[0.88rem] text-mute">AI-generated narration · captions and full transcript</p>
          </div>
        </section>
      </div>
    </div>
  );
}
