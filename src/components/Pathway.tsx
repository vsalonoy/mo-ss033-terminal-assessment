import { Sentences } from './primitives';
import { PATHWAY } from '../data/research';
import { PATHWAY_STATUS, PATHWAY_FUNDING } from '../data/explore';

/**
 * The proposed track in five parts. Each part says plainly what already exists in
 * law or in a running programme and what this proposal would add, so an existing
 * provision is never read as funding or approving the new track.
 */
export function Pathway() {
  return (
    <figure className="m-0" aria-labelledby="pathway-cap">
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem] text-mute">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-cyan-500" aria-hidden />In place today: in law or a running programme</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber" aria-hidden />Proposed: what this track would add</span>
      </div>
      <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[1.2rem] before:top-6 before:w-px before:bg-line sm:before:left-[1.45rem]">
        {PATHWAY.map(p => {
          const st = PATHWAY_STATUS[p.part];
          return (
            <li key={p.part} className="relative grid grid-cols-[2.4rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-4">
              <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-sand bg-ink-900 font-serif text-[1.1rem] font-semibold text-sand sm:h-12 sm:w-12">
                {p.part}
              </span>
              <div className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-serif text-[1.2rem] font-semibold text-sand">{p.title}</h4>
                  <a href="#journey" className="link text-[0.88rem]">
                    Maria, {p.steps.length > 1 ? `steps ${p.steps.join(' and ')}` : `step ${p.steps[0]}`}
                  </a>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border-l-[3px] border-cyan-500 bg-cyan-500/[0.06] px-4 py-3">
                    <p className="mlabel text-cyan-300">In place today</p>
                    {st.inPlace.length
                      ? <p className="mt-1.5 text-[0.95rem] leading-relaxed text-sand/90"><Sentences items={st.inPlace} /></p>
                      : <p className="mt-1.5 text-[0.95rem] leading-relaxed text-sand/85">{st.none ?? 'Nothing found in the sources reviewed.'}</p>}
                  </div>
                  <div className="rounded-lg border-l-[3px] border-amber bg-amber/[0.07] px-4 py-3">
                    <p className="mlabel text-amber">Proposed</p>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-sand/90"><Sentences items={st.proposed} /></p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 max-w-reading rounded-lg border border-line bg-ink-800 px-5 py-4 text-[0.95rem] leading-relaxed text-sand/90">
        <Sentences items={PATHWAY_FUNDING} />
      </p>
      <figcaption id="pathway-cap" className="t-micro mt-3 max-w-reading">
        The proposed track in five parts. A proposal: no agency or employer has agreed to it. Each part links
        to the matching steps of Maria&rsquo;s illustrative journey in section G.
      </figcaption>
    </figure>
  );
}
