import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { EVIDENCE, refMap, IMPL_ACTORS, IMPL_STAGES, IMPL_CAVEAT, type Evidence } from '../data/research';
import { Cite, Chip } from './primitives';

/* ------------------------------------------------------------- W7: evidence */

/**
 * An expandable card for one claim: what the source actually found, what area it
 * covers, and a direct link. These sit beside the claims they support. They do
 * not replace the APA reference list in section L, which stays the formal citation.
 */
function Card({ e }: { e: Evidence }) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const r = refMap[e.ref];
  const sgOnly = /^Singapore/.test(e.scope);

  return (
    <div className={`card transition-colors ${open ? 'border-cyan-500/35' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span aria-hidden className={`mt-1 shrink-0 text-cyan-300 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.92rem] leading-snug text-sand">{e.claim}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            <Chip tone={sgOnly ? 'amber' : 'neutral'}>{e.scope}</Chip>
            <span className="text-[0.76rem] text-mute">{r.author.replace(/,.*$/, '')}, {r.year.split(',')[0]}</span>
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <dl className="px-5 pb-5 pt-1 space-y-3 border-t border-line/60">
              <div>
                <dt className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-mute">What the source says</dt>
                <dd className="mt-1 text-[0.86rem] leading-relaxed text-sand/90">{e.finding}</dd>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <dt className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-mute">Published by</dt>
                  <dd className="mt-1 text-[0.84rem] leading-snug text-sand/90">{r.author}</dd>
                </div>
                <div>
                  <dt className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-mute">Date</dt>
                  <dd className="mt-1 text-[0.84rem] leading-snug text-sand/90">{r.year}</dd>
                </div>
              </div>
              <div>
                <dt className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-mute">Source</dt>
                <dd className="mt-1">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-[0.84rem] leading-snug text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 [overflow-wrap:anywhere] hover:decoration-cyan-300">
                    {r.title}
                  </a>
                </dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** All evidence cards belonging to one section. */
export function EvidenceCards({ section, title = 'Check the evidence' }:
  { section: Evidence['section']; title?: string }) {
  const items = EVIDENCE.filter(e => e.section === section);
  if (!items.length) return null;
  return (
    <div className="mt-12">
      <div className="eyebrow">{title}</div>
      <p className="t-micro mt-2 max-w-reading">
        Open a card to see what the source actually reports, the area it covers and a direct link.
        The full APA reference list is in section L.
      </p>
      {/* Sections D and E carry a single card each. A one-item two-column grid
          leaves a conspicuous empty half, so the grid only splits when there is
          something to put in the second column. */}
      <div className={`mt-5 grid gap-3 ${items.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {items.map(e => <Card key={e.id} e={e} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------- W4: implementation responsibilities */

/**
 * Who would do what across the three mechanism stages.
 *
 * Deliberately built from HTML rather than a drawn SVG graph: it has to stay
 * readable at 390px, be reachable by keyboard, and make sense with no animation
 * at all. A node-and-edge diagram satisfies none of those on a phone.
 */
export function ImplementationMap({ heading = true }: { heading?: boolean } = {}) {
  const [active, setActive] = useState<string | null>('employer');
  const reduced = usePrefersReducedMotion();
  const actor = IMPL_ACTORS.find(a => a.id === active) ?? null;

  return (
    /* `heading` is dropped when a Disclosure wraps this and already names it, so
       the title is not announced twice. The content itself is unchanged. */
    <div className={heading ? 'mt-12' : ''}>
      {heading && <>
        <div className="eyebrow">Who would do what</div>
        <h3 className="t-sub mt-3">Responsibilities across the three stages</h3>
      </>}
      <p className="t-micro mt-2 max-w-reading">
        Select an organisation to see what it already does by law, and what this proposal
        would additionally ask of it. The two are kept apart on purpose.
      </p>

      {/* stage columns, each listing the actors that touch it */}
      <div className="mt-6 grid md:grid-cols-3 gap-3">
        {IMPL_STAGES.map((st, si) => (
          <div key={st.key} className="card p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[1.1rem] font-extrabold text-cyan-300/55">{si + 1}</span>
              <span className="font-display text-[0.95rem] font-bold text-sand">{st.label}</span>
            </div>
            <p className="mt-1.5 text-[0.78rem] leading-snug text-mute">{st.note}</p>
            <ul className="mt-4 space-y-1.5">
              {IMPL_ACTORS.filter(a => (a.stages as readonly string[]).includes(st.key)).map(a => {
                const on = active === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setActive(on ? null : a.id)}
                      aria-pressed={on}
                      className={`w-full text-left rounded px-2.5 py-1.5 text-[0.82rem] leading-snug transition-colors ${
                        on ? 'bg-cyan-500/15 text-cyan-200' : 'text-sand/85 hover:bg-ink-600/60 hover:text-sand'}`}
                    >
                      {a.short}
                      {a.statutory === null && (
                        <span className="ml-1.5 text-[0.68rem] text-amber/90">proposed role only</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* detail for the selected actor */}
      <div aria-live="polite" className="mt-4">
        {actor && (
          <motion.div
            key={actor.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="card p-6 border-cyan-500/30"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="font-display text-[1.02rem] font-bold text-sand">{actor.name}</h4>
              {actor.stages.map(st => (
                <Chip key={st} tone="cyan">
                  {IMPL_STAGES.find(x => x.key === st)?.label}
                </Chip>
              ))}
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-6">
              <div className="border-l-2 border-l-cyan-500/60 pl-4">
                <div className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                  Already does this, by law or by programme
                </div>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-sand/90">
                  {actor.statutory ?? 'No existing statutory duty applies to this group under the proposal.'}
                </p>
              </div>
              <div className="border-l-2 border-l-amber/60 pl-4">
                <div className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-amber">
                  Would be asked to do this, proposed
                </div>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-sand/90">{actor.proposed}</p>
              </div>
            </div>

            <div className="mt-5"><Cite keys={actor.ref} /></div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 border-l-2 border-l-rose/60 bg-rose/[0.05] px-5 py-4 rounded-r">
        <p className="text-[0.88rem] leading-relaxed text-sand/88 prose-r">{IMPL_CAVEAT}</p>
      </div>
    </div>
  );
}
