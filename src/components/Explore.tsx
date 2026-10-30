import { usePresentation } from '../hooks/usePresentation';
import { SECTIONS, REFERENCES } from '../data/research';
import { EXPLORE_CHAPTERS, type ExploreChapter } from '../data/explore';
import { clock, videoSpan } from '../data/video';
import { Sentences } from './primitives';
import { Photo } from './Visuals';

const sectionsOf = (letters: string) => SECTIONS.filter(s => letters.includes(s.letter));
const range = (letters: string) => (letters.length > 1 ? `${letters[0]}–${letters.at(-1)}` : letters);

/**
 * Seeks the one video to a chapter and opens the theatre. Rendered only while the
 * video is switched on, so the published site never shows a control that does nothing.
 */
export function WatchChip({ n, className = '' }: { n: number; className?: string }) {
  const { enabled, watch } = usePresentation();
  if (!enabled) return null;
  const { start, end } = videoSpan(n);
  return (
    <button type="button" onClick={() => watch(start)}
      className={`btn btn-g !min-h-[44px] !px-4 !text-[0.88rem] ${className}`}>
      <span aria-hidden>▶</span> Watch this chapter
      <span className="font-mono text-[0.82rem] font-medium tabular-nums text-mute">{clock(start)}–{clock(end)}</span>
    </button>
  );
}

/* --------------------------------------------------------------- index */

export function ExploreIndex() {
  return (
    <section id="explore" aria-labelledby="explore-title" tabIndex={-1}
      className="scroll-mt-16 border-t border-line bg-ink-800 py-14 focus:outline-none sm:py-20">
      <div className="wrap">
        <p className="eyebrow">Explore the Research</p>
        <h2 id="explore-title" className="t-sec mt-3 max-w-[22ch]">Five chapters, in the same order as the video</h2>
        <p className="t-lede mt-5">
          Each chapter opens with one finding, then the evidence behind it: charts you can inspect,
          the ratings side by side, the proposed pathway and the indicators. Sections keep their letters,
          A to L, so a comment can point to one directly.
        </p>
        <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {EXPLORE_CHAPTERS.map(ch => (
            <li key={ch.id}>
              <a href={`#${ch.id}`}
                className="card card-action flex h-full flex-col p-5 text-sand sm:p-6">
                <span className="mlabel text-mute">Chapter {ch.n} · Sections {range(ch.letters)}</span>
                <span className="mt-2 font-serif text-[1.35rem] font-semibold leading-snug">{ch.title}</span>
                <span className="mt-2 hidden text-[0.95rem] leading-relaxed text-sand/85 sm:block">{ch.question}</span>
                <span className="mt-auto pt-3 text-[0.88rem] leading-snug text-mute">
                  {sectionsOf(ch.letters).map(s => `${s.letter}. ${s.label}`).join(' · ')}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a href="#sources" className="card card-action flex h-full flex-col border-dashed p-6 text-sand">
              <span className="mlabel text-mute">Sources and method · Section L</span>
              <span className="mt-2 font-serif text-[1.35rem] font-semibold leading-snug">Sources and method</span>
              <span className="mt-2 text-[0.95rem] leading-relaxed text-sand/85">
                All {REFERENCES.length} references, how each was evaluated, and where each is cited.
              </span>
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- openers */

/** A chapter's opening: what it asks, what it found, and where to watch it. */
export function ChapterOpener({ chapter: ch }: { chapter: ExploreChapter }) {
  const titleId = `${ch.id}-title`;
  return (
    <section id={ch.id} aria-labelledby={titleId} tabIndex={-1}
      className="scroll-mt-16 border-t border-line bg-ink-800 focus:outline-none">
      <div className="wrap grid gap-x-12 gap-y-6 py-10 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
        <div>
          <p className="eyebrow">Chapter {ch.n} of {EXPLORE_CHAPTERS.length} · Sections {range(ch.letters)}</p>
          <h2 id={titleId} className="t-sec mt-3">{ch.title}</h2>
          <p className="mt-4 max-w-[48ch] font-serif text-[1.2rem] italic leading-relaxed text-mute">{ch.question}</p>
          <div className="mt-7 border-l-2 border-cyan-500 pl-5">
            <p className="mlabel text-cyan-300">Key finding</p>
            <p className="mt-2 max-w-[62ch] text-[1.08rem] leading-relaxed text-sand"><Sentences items={ch.finding} /></p>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <WatchChip n={ch.video} />
            <nav aria-label={`Sections in chapter ${ch.n}`} className="hidden sm:block">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.92rem]">
                {sectionsOf(ch.letters).map(s => (
                  <li key={s.id}><a href={`#${s.id}`} className="link inline-flex min-h-[32px] items-center">{s.letter}. {s.label}</a></li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <Photo m={ch.photo} sizes="(min-width: 1024px) 460px, 100vw" className="order-first lg:order-none" imgClassName="aspect-[16/9] lg:aspect-[4/3]" />
      </div>
    </section>
  );
}

/** The opening of Sources and method: where each kind of criterion is applied, then section L. */
export function SourcesOpener() {
  return (
    <section id="sources" aria-labelledby="sources-title" tabIndex={-1}
      className="scroll-mt-16 border-t border-line bg-ink-800 focus:outline-none">
      <div className="wrap py-14 sm:py-16">
        <p className="eyebrow">Sources and method</p>
        <h2 id="sources-title" className="t-sec mt-3">Sources and method</h2>
        <p className="t-lede mt-4">
          Where the evidence comes from, how it was judged, and which criteria were used at each stage of the research.
        </p>
        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          {([
            ['Determining Solution', 'Four of the five class criteria, used to compare the five alternatives, with the reason acceptability was not used.', '#solutions', 'Section D'],
            ['Evaluating Success', 'The same four names, applied separately to the selected proposal, each with how success would be assessed.', '#criteria', 'Section I'],
            ['Evaluating Information', 'Authority, accuracy, relevance and purpose, applied to every source in the list below.', '#source-evaluation', 'Section L'],
          ] as const).map(([k, v, href, where]) => (
            <div key={k} className="card p-5">
              <dt className="font-serif text-[1.1rem] font-semibold text-sand">{k}</dt>
              <dd className="mt-2 text-[0.95rem] leading-relaxed text-sand/85">
                {v} <a href={href} className="link whitespace-nowrap">{where} <span aria-hidden>→</span></a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
