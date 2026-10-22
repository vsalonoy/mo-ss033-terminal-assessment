import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Reveal, Cite, Chip, Caveat, Sentences } from './primitives';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import { BarsH, WageTrajectory, ProportionRing } from './viz';
import { EvidenceCards } from './Evidence';
import { GlobalNetwork, TransitionStages, AutomationMechanism, PhotoBand } from './Visuals';
import { MEDIA } from '../data/media';
import {
  PROJECT, AUDIENCE, EXPOSURE_BY_REGION, EXPOSURE_NOTES, EXPOSURE_VS_ASEAN, STAKEHOLDERS, STAKEHOLDER_LIMIT,
  SOLUTIONS, RANKED, CRITERIA, CRITERIA_PROVENANCE, RANKING_NOTE, SG_OUTCOMES, SG_CAVEAT,
  SG_WAGE_TRAJECTORY, SKILLSFUTURE_TAKEUP, GLOBALIZATION, ADOPTION_CAUSES,
} from '../data/research';

/* ------------------------------------------------------------------ A */
export function Intro() {
  return (
    <Section id="intro" letter="A" label="Introduction"
      title="The issue, the driver, and where I stand"
      lede={PROJECT.focusIssue}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-10">
        <Reveal>
          <div className="card p-7">
            <div className="eyebrow">My position</div>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-sand/95">{PROJECT.position}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <dl className="space-y-5">
            {[
              ['Globalization driver', PROJECT.driver],
              ['Title', `${PROJECT.title}: ${PROJECT.titleSub}`],
              ['Scope', PROJECT.subtitle],
              ['Arrangement', `${PROJECT.arrangement}, Section ${PROJECT.section}`],
            ].map(([k, v]) => (
              <div key={k} className="border-l border-line pl-5">
                <dt className="mlabel text-cyan-300">{k}</dt>
                <dd className="mt-1.5 text-[0.94rem] leading-relaxed text-sand/90">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <Reveal>
        <div className="mt-12">
          <div className="eyebrow">{GLOBALIZATION.heading}</div>
          <p className="mt-4 prose-r">
            <Sentences items={GLOBALIZATION.sentences} />
          </p>
        </div>
      </Reveal>
      <GlobalNetwork />
      <TransitionStages />
      <Reveal>
        <div className="mt-12">
          <div className="eyebrow">Who this is written for</div>
          <div className="mt-5 grid lg:grid-cols-2 gap-x-10 gap-y-6">
            <div className="lg:col-span-2 card p-6 border-cyan-500/25">
              <div className="mlabel text-cyan-300">
                Intended audience
              </div>
              <p className="mt-2 text-[1rem] leading-relaxed text-sand">{AUDIENCE.who}</p>
            </div>
            {([
              ['What they already understand', AUDIENCE.known],
              ['What this adds', AUDIENCE.needed],
            ] as const).map(([k, v]) => (
              <div key={k} className="border-l border-line pl-5">
                <div className="mlabel text-mute">{k}</div>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-sand/88">{v}</p>
              </div>
            ))}
            <div className="lg:col-span-2 border-l border-cyan-500/50 pl-5">
              <div className="mlabel text-cyan-300">
                What they should be able to do after reading
              </div>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-sand/88">
                {AUDIENCE.consider} <Cite keys={AUDIENCE.ref} />
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Caveat>
        This website is the Terminal Assessment deliverable. It carries the full research narrative,
        the five-solution evaluation, the selected solution, the Philippine contextualisation, the
        SMART indicators and the references. Worksheet 8, the individual timeline, the AI Use
        Statement and the reflection records are tracked as separate deliverables, because the
        website does not replace those activities.
      </Caveat>
    </Section>
  );
}

/* ------------------------------------------------------------------ B */
export function Challenge() {
  return (
    <Section id="challenge" letter="B" label="The Philippine automation challenge"
      title="Exposure is high, disruption so far is not"
      lede="Exposure means tasks inside an occupation can be automated. It is not the same as a job being removed. Holding those two apart is the whole basis of my position.">
      <PhotoBand m={MEDIA.itPark} />
      <div className="mt-12">
        <div className="eyebrow">From adoption to outcomes</div>
        <h3 className="mt-3 mb-6 font-display text-sub text-sand">How automation reaches workers</h3>
        <AutomationMechanism />
      </div>
      <div className="mt-14 grid lg:grid-cols-2 gap-10 items-start">
        <Reveal>
          <div className="space-y-5 prose-r">
            <p>
              <strong className="font-semibold text-sand">{ADOPTION_CAUSES.heading}.</strong>{' '}
              <Sentences items={ADOPTION_CAUSES.sentences} />
            </p>
            <p>
              The ILO estimates that 12.7 million Filipino workers, more than one quarter of
              employment, are in occupations exposed to generative AI. That is the highest exposure
              rate among the ASEAN countries with recent comparable data. Only 3.6 percent of jobs
              fall into the highest displacement risk category. <Cite keys={['huynh2026']} />
            </p>
            <p>
              Across ASEAN the same body estimates 22.9 percent of employment in 2025, nearly 80
              million workers, has more than minimal exposure, while finding little widespread
              disruption so far and uneven national preparedness. <Cite keys={['ilo2026a', 'ilo2026b']} />
            </p>
            <p>
              The Philippine contact centre sector is the clearest test case. It grew by about 4
              percent to 1.68 million workers even as more than two thirds of industry member firms
              ran AI pilots, and reporting describes firms using AI to augment staff and creating
              roles such as AI trainers and prompt engineers. <Cite keys={['dagooc2026', 'khan2026']} />
            </p>
            <p>
              Asian Development Bank work on Philippine readiness is where the training-quality
              problem shows up: the most availed technical and vocational courses often lead to
              low-productivity occupations, which is a different problem from training volume.{' '}
              <Cite keys={['adb2021', 'adb2020']} />
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card p-6">
            <div className="eyebrow">Where exposure concentrates</div>
            <h3 className="t-sub mt-3">Share of jobs exposed, by region</h3>
            <p className="t-micro mt-2">Hover, tap or tab a bar for how precise each figure is.</p>
            <div className="mt-5">
              <BarsH data={EXPOSURE_BY_REGION.map((r, i) => ({
                name: r.name, value: r.value, note: r.note,
                floor: i > 0, tone: i === 0 ? 'cyan' : 'iris',
              }))} max={50} unit="%" />
            </div>
            <p className="t-micro mt-1">
              The NCR figure is reported as around two in five jobs. Central Luzon and Calabarzon are
              reported as exceeding 30 percent, so both are drawn at that floor rather than at a
              precise value. <Cite keys={['huynh2026']} />
            </p>
          </div>

          <div className="mt-5 card p-6">
            <div className="eyebrow">Against the region</div>
            <h3 className="t-sub mt-3">Philippine exposure and the ASEAN average</h3>
            <div className="mt-5">
              <BarsH data={EXPOSURE_VS_ASEAN.map((d, i) => ({
                name: d.name, value: d.value, note: d.note,
                floor: d.floor, tone: i === 0 ? 'cyan' : 'iris',
              }))} max={30} unit="%" />
            </div>
            <p className="t-micro mt-1">
              The ASEAN figure is an exact published percentage. The Philippine figure is reported
              only as more than one quarter, so it is drawn at that floor and marked with a greater
              than sign. <Cite keys={['huynh2026', 'ilo2026b']} />
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {EXPOSURE_NOTES.map(n => (
              <div key={n.k} className="border-l border-line pl-5">
                <div className="mlabel text-cyan-300">{n.k}</div>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-sand/88">{n.v} <Cite keys={n.ref} /></p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <EvidenceCards section="challenge" />
    </Section>
  );
}

/* ------------------------------------------------------------------ C */
export function Stakeholders() {
  const [open, setOpen] = useState<string | null>(STAKEHOLDERS[0].name);
  return (
    <Section id="stakeholders" letter="C" label="Affected workers and stakeholders"
      title="Who is affected, and what each of them wants"
      lede="Seven groups carry some part of this. The first group is the one the proposal is for, and the one whose view is least documented in anything I could find.">
      <div className="space-y-3">
        {STAKEHOLDERS.map((s, i) => {
          const isOpen = open === s.name;
          return (
            <Reveal key={s.name} delay={i * 0.04}>
              <div className={`card card-toggle overflow-hidden ${isOpen ? 'border-cyan-500/30' : ''}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : s.name)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-start gap-4"
                >
                  <span className="font-mono text-[0.72rem] font-medium text-cyan-300/80 pt-1 w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.02rem] text-sand">{s.name}</span>
                    <span className="block mt-1 text-[0.84rem] text-mute">{s.role}</span>
                  </span>
                  <span className={`text-cyan-300 text-lg leading-none pt-1 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26, ease: 'easeOut' }}
                    >
                      <dl className="px-6 pb-6 pt-1 grid sm:grid-cols-3 gap-5 border-t border-line/60 mt-1">
                        {[['How they are affected', s.affected], ['What they want', s.interest],
                          ['What they would contribute', s.contribution]].map(([k, v]) => (
                          <div key={k}>
                            <dt className="mlabel text-mute">{k}</dt>
                            <dd className="mt-1.5 text-[0.86rem] leading-relaxed text-sand/88">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="px-6 pb-5"><Cite keys={s.ref} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Caveat tone="rose">{STAKEHOLDER_LIMIT}</Caveat>
    </Section>
  );
}

/* ------------------------------------------------------------------ D */
const ratingTone = (r: string): 'cyan' | 'amber' | 'rose' | 'neutral' => {
  if (r === 'Strongest' || r === 'High' || r === 'High in principle' || r === 'High as a design' || r === 'Moderate to high') return 'cyan';
  if (r === 'Not shown') return 'rose';
  if (r === 'Low' || r === 'Low to moderate') return 'amber';
  return 'neutral';
};

type CriterionKey = typeof CRITERIA[number]['key'];

export function Solutions() {
  const [active, setActive] = useState(SOLUTIONS[2].id); // place-and-train opens first
  const [focusKey, setFocusKey] = useState<CriterionKey | null>(null);
  const [cellOn, setCellOn] = useState<string | null>(null);
  const reducedMatrix = usePrefersReducedMotion();
  const sol = SOLUTIONS.find(s => s.id === active)!;

  /* Resolve the hovered or focused matrix cell back to its solution and reasoning. */
  const activeCell = (() => {
    if (!cellOn) return null;
    const [sid, ckey] = cellOn.split('-') as [string, CriterionKey];
    const solution = SOLUTIONS.find(x => x.id === sid);
    const crit = CRITERIA.find(c => c.key === ckey);
    if (!solution || !crit) return null;
    return { solution, label: crit.label, cell: solution.criteria[ckey] };
  })();

  return (
    <Section id="solutions" letter="D" label="Five solutions"
      title="Five solutions, evaluated against the class criteria"
      lede="Two are Philippine programmes, three are Singapore programmes. Each was chosen because it exists and is documented, not to reach a required number.">

      {/* criteria definitions */}
      <Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRITERIA.map(c => (
            <div key={c.key} className="card p-5">
              <div className="font-display text-[1.02rem] font-bold text-cyan-300">{c.label}</div>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-mute">{c.blurb}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Caveat>{CRITERIA_PROVENANCE}</Caveat>

      {/* cards */}
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.05}>
            <button
              onClick={() => setActive(s.id)} aria-pressed={active === s.id}
              /* flex-col stops the browser vertically centring button content,
                 which would otherwise start each card's text at a different height. */
              className={`w-full h-full text-left card card-action p-5 flex flex-col items-stretch ${
                active === s.id ? 'border-cyan-500/50 bg-cyan-500/[0.05]' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="mlabel text-mute">{s.where}</span>
                <span className={`font-display text-[1.35rem] font-extrabold leading-none ${
                  s.rank === 1 ? 'text-cyan-300' : 'text-mute/80'}`}>#{s.rank}</span>
              </div>
              <div className="mt-3 text-[0.98rem] leading-snug text-sand">{s.short}</div>
              <div className="mt-3 text-[0.8rem] leading-relaxed text-mute">{s.what}</div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* detail panel, shared data */}
      <Reveal>
        <div className="mt-8 card p-7" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h3 className="font-display text-sub text-sand">{sol.name}</h3>
            <Chip tone={sol.rank === 1 ? 'cyan' : 'neutral'}>Rank {sol.rank} of 5</Chip>
            <Chip>{sol.where}</Chip>
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-8">
            <div>
              <div className="eyebrow">What it is</div>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-sand/92">{sol.what}</p>
              <div className="eyebrow mt-6">Who runs it</div>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-sand/92">{sol.who}</p>
              <div className="eyebrow mt-6">Who it is for</div>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-sand/92">{sol.targetPopulation}</p>
              <div className="eyebrow mt-6">Status</div>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-sand/92">{sol.status}</p>
              <div className="eyebrow mt-6">Detail</div>
              <ul className="mt-2 space-y-2">
                {sol.detail.map((d, i) => (
                  <li key={i} className="flex gap-3 text-[0.9rem] leading-relaxed text-sand/88">
                    <span className="text-cyan-300/60 shrink-0" aria-hidden>&middot;</span>{d}
                  </li>
                ))}
              </ul>
              {sol.id === 's5' && (
                <div className="mt-7 rounded-lg border border-line bg-ink-600/40 p-5">
                  <div className="t-label mb-4">Reported take-up</div>
                  <ProportionRing
                    value={SKILLSFUTURE_TAKEUP.used}
                    caption={SKILLSFUTURE_TAKEUP.label}
                    sub={SKILLSFUTURE_TAKEUP.detail}
                  />
                  <p className="t-micro mt-4 border-l border-amber/50 pl-3">{SKILLSFUTURE_TAKEUP.caveat}</p>
                </div>
              )}
              <div className="mt-6"><Cite keys={sol.ref} /></div>
            </div>

            <div>
              <div className="eyebrow">Evaluation matrix</div>
              <div className="mt-3 space-y-3">
                {CRITERIA.map(c => {
                  const cell = sol.criteria[c.key];
                  return (
                    <div key={c.key} className="border-l border-line pl-5 py-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="mlabel text-mute">{c.label}</span>
                        <Chip tone={ratingTone(cell.r)}>{cell.r}</Chip>
                      </div>
                      <p className="mt-1.5 text-[0.86rem] leading-relaxed text-sand/85">{cell.why}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 border border-cyan-500/25 bg-cyan-500/[0.05] rounded-lg p-5">
                <div className="eyebrow">Why it ranks {sol.rank}</div>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-sand/92">{sol.rankWhy}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* full matrix, so a mentor can read all five at once */}
      <Reveal>
        <div className="mt-10">
          <div className="eyebrow">All five at once</div>
          <h3 className="t-sub mt-3">Compare by criterion</h3>
          <p className="t-micro mt-2 max-w-reading">
            Pick a criterion to focus the column, or hover a rating to read the reasoning behind it.
            The ratings are qualitative. The class agreed no scoring scale, so none of these is a
            number and nothing here is added up.
          </p>

          {/* criterion selector */}
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Focus a criterion">
            <button
              onClick={() => setFocusKey(null)} aria-pressed={focusKey === null}
              className={`chip transition-colors ${focusKey === null
                ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200' : 'border-line text-mute hover:text-sand'}`}
            >All four</button>
            {CRITERIA.map(c => (
              <button
                key={c.key} onClick={() => setFocusKey(focusKey === c.key ? null : c.key)}
                aria-pressed={focusKey === c.key}
                className={`chip transition-colors ${focusKey === c.key
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200' : 'border-line text-mute hover:text-sand'}`}
              >{c.label}</button>
            ))}
          </div>

          <p className="md:hidden mt-4 t-micro">Scroll the table sideways to see all four criteria.</p>
          <div className="mt-4 overflow-x-auto card" tabIndex={0} role="region" aria-label="Comparison table, scrollable sideways">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <caption className="sr-only">
                Five solutions rated against sustainability, impact, feasibility and effectiveness.
                Ratings are qualitative. No numerical scores or weights were agreed by the class.
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3.5 mlabel text-mute">Solution</th>
                  {CRITERIA.map(c => {
                    const dim = focusKey !== null && focusKey !== c.key;
                    return (
                      <th key={c.key} scope="col"
                        /* The de-emphasised column still has to clear WCAG AA. text-mute/45
                           measured 2.45:1 against the card; /75 measures 4.64:1. */
                        className={`px-5 py-3.5 mlabel transition-colors ${
                          focusKey === c.key ? 'text-cyan-200' : dim ? 'text-mute/75' : 'text-mute'}`}>
                        {c.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {RANKED.map(s => (
                  <tr key={s.id} className="border-b border-line/50 last:border-0 hover:bg-ink-600/40 transition-colors">
                    <th scope="row" className="px-5 py-4 font-normal align-top">
                      <span className="font-sans text-[0.74rem] font-semibold tabular-nums text-cyan-300/80 mr-2">#{s.rank}</span>
                      <span className="text-[0.9rem] text-sand">{s.short}</span>
                      <span className="block mt-0.5 text-[0.74rem] text-mute">{s.where}</span>
                    </th>
                    {CRITERIA.map(c => {
                      const dim = focusKey !== null && focusKey !== c.key;
                      const id = `${s.id}-${c.key}`;
                      const on = cellOn === id;
                      return (
                        <td key={c.key} className="px-5 py-4 align-top">
                          <button
                            type="button"
                            onMouseEnter={() => setCellOn(id)} onMouseLeave={() => setCellOn(null)}
                            onFocus={() => setCellOn(id)} onBlur={() => setCellOn(null)}
                            onClick={() => setCellOn(on ? null : id)}
                            aria-expanded={on}
                            aria-label={`${s.short}, ${c.label}: ${s.criteria[c.key].r}. Show reasoning`}
                            /* De-emphasis is carried by dropping the rating colour, not by
                               fading the text out. opacity-40 put the rose tone at 1.96:1
                               against the card; a neutral chip at opacity-75 measures
                               4.64:1. The rating is always spelled out in words, so losing
                               the colour loses no information. */
                            className={`text-left transition-opacity duration-300 ${dim ? 'opacity-75' : 'opacity-100'}`}
                          >
                            <Chip tone={dim ? 'neutral' : ratingTone(s.criteria[c.key].r)}>
                              {s.criteria[c.key].r}
                            </Chip>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* reasoning for whichever rating is hovered or focused */}
          <div aria-live="polite" className="mt-4 min-h-[4.2rem]">
            {activeCell && (
              <motion.div
                key={cellOn ?? 'none'}
                initial={reducedMatrix ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                className="card p-5 border-cyan-500/30"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="t-label">{activeCell.solution.short}</span>
                  <span className="text-mute/60" aria-hidden>/</span>
                  <span className="mlabel text-mute">{activeCell.label}</span>
                  <Chip tone={ratingTone(activeCell.cell.r)}>{activeCell.cell.r}</Chip>
                </div>
                <p className="t-small mt-2.5 max-w-reading">{activeCell.cell.why}</p>
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>

      <EvidenceCards section="solutions" />
    </Section>
  );
}

/* ------------------------------------------------------------------ E */
export function Ranking() {
  return (
    <Section id="ranking" letter="E" label="Solution ranking"
      title="The ranking, and why effectiveness decided it"
      lede="I weighted effectiveness most heavily, because my research question is whether workers are actually supported, not whether a programme exists on paper.">
      <ol className="space-y-3">
        {RANKED.map((s, i) => (
          <Reveal key={s.id} as="li" delay={i * 0.06}
            className={`card p-6 flex gap-5 ${s.rank === 1 ? 'border-cyan-500/35 bg-cyan-500/[0.04]' : ''}`}>
            <span className={`font-display text-[2.3rem] font-extrabold leading-none shrink-0 ${
              s.rank === 1 ? 'text-cyan-300' : 'text-mute/80'}`}>{s.rank}</span>
            <div className="min-w-0">
              <h3 className="text-[1.06rem] text-sand">{s.name}</h3>
              <div className="mt-1 mlabel text-mute">{s.where}</div>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-sand/88">{s.rankWhy}</p>
              <div className="mt-3"><Cite keys={s.ref} /></div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Caveat>{RANKING_NOTE}</Caveat>

      <Reveal>
        <div className="mt-12 card p-7">
          <div className="eyebrow">Why rank one has the strongest evidence</div>
          <h3 className="mt-2 font-display text-sub text-sand">
            Singapore place-and-train, measured against control groups
          </h3>
          <div className="mt-7 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-9 items-start">
            <div>
              <div className="t-label mb-3">Wage effect over time</div>
              <WageTrajectory
                placement={SG_WAGE_TRAJECTORY.placement}
                after={SG_WAGE_TRAJECTORY.after}
                axisMax={SG_WAGE_TRAJECTORY.axisMax}
                unit={SG_WAGE_TRAJECTORY.unit}
              />
              <p className="t-micro mt-2">{SG_WAGE_TRAJECTORY.note}</p>
            </div>
            <div>
              <div className="t-label mb-3">All measured effects</div>
              <BarsH
                data={SG_OUTCOMES.map(o => ({
                  name: o.name, value: o.value, unit: o.unit,
                  tone: (o.tone === 'amber' ? 'amber' : 'cyan') as 'amber' | 'cyan',
                  note: o.unit === 'pp'
                    ? 'Percentage points more likely to still be in the job than the control group.'
                    : 'Percent higher earnings than the control group over this period.',
                }))}
                max={8} unit="%"
              />
              <p className="t-micro mt-1">
                Wage effects are percentages. Retention is in percentage points, which is why it
                carries a different unit and a different colour. <Cite keys={['mti2025']} />
              </p>
            </div>
          </div>
          <Caveat tone="rose">{SG_CAVEAT}</Caveat>
        </div>
      </Reveal>

      <EvidenceCards section="ranking" />
    </Section>
  );
}
