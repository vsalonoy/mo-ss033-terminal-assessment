import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Reveal, Cite, Chip, Caveat, Sentences, Disclosure } from './primitives';
import { EvidenceExplorer, type Measure } from './viz';
import { EvidenceCards } from './Evidence';
import { GlobalNetwork, TransitionStages, AutomationMechanism } from './Visuals';
import { ExposureExplorer } from './ExposureExplorer';
import { Comparison } from './Comparison';
import { ratingTone } from './tones';
import {
  PROJECT, AUDIENCE, STAKEHOLDERS, STAKEHOLDER_LIMIT,
  RANKED, CRITERIA, CRITERIA_PROVENANCE, RANKING_NOTE, SG_OUTCOMES, SG_CAVEAT,
  SG_WAGE_TRAJECTORY, GLOBALIZATION, ADOPTION_CAUSES,
} from '../data/research';

/* ------------------------------------------------------------------ A */
export function Intro() {
  return (
    <Section id="intro" letter="A" label="Introduction"
      title="The issue, the driver, and where I stand"
      lede={PROJECT.focusIssue}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-10">
        <Reveal>
          <div id="position" className="scroll-mt-24 rounded-[14px] border-l-[3px] border-cyan-500 bg-ink-700 p-7 shadow-[0_1px_2px_rgb(21_25_31/0.04)]">
            <h3 className="mlabel text-cyan-300">My position</h3>
            <p className="mt-4 font-serif text-[1.18rem] leading-relaxed text-sand">{PROJECT.position}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <dl className="space-y-5">
            {[
              ['Globalization driver', PROJECT.driver],
              ['Scope', PROJECT.subtitle],
              ['Arrangement', `${PROJECT.arrangement}, Section ${PROJECT.section}`],
            ].map(([k, v]) => (
              <div key={k} className="border-l-2 border-line pl-5">
                <dt className="mlabel text-mute">{k}</dt>
                <dd className="mt-1.5 text-[1rem] leading-relaxed text-sand/90">{v}</dd>
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
      <Disclosure summary="Before, present and future: how the work has changed"
        hint="A visual summary of findings from sections B to H, with the proposed response labelled as proposed">
        <TransitionStages />
      </Disclosure>
      <Reveal>
        <div className="mt-12">
          <div className="eyebrow">Who this is written for</div>
          <div className="mt-5 grid lg:grid-cols-2 gap-x-10 gap-y-6">
            <div className="lg:col-span-2 card p-6">
              <div className="mlabel text-cyan-300">
                Intended audience
              </div>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-sand">{AUDIENCE.who}</p>
            </div>
            {([
              ['What they already understand', AUDIENCE.known],
              ['What this adds', AUDIENCE.needed],
            ] as const).map(([k, v]) => (
              <div key={k} className="border-l-2 border-line pl-5">
                <div className="mlabel text-mute">{k}</div>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-sand/90">
                  {v}{k === 'What this adds' && <> The figures are in <a href="#challenge" className="link">section B</a>.</>}
                </p>
              </div>
            ))}
            <div className="lg:col-span-2 border-l-2 border-cyan-500 pl-5">
              <div className="mlabel text-cyan-300">
                What they should be able to do after reading
              </div>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-sand/90">
                {AUDIENCE.consider} <Cite keys={AUDIENCE.ref} />
              </p>
            </div>
          </div>
        </div>
      </Reveal>

    </Section>
  );
}

/* ------------------------------------------------------------------ B */
export function Challenge() {
  return (
    <Section id="challenge" letter="B" label="The Philippine automation challenge"
      title="Exposure is high, disruption so far is not"
      lede="Exposure means tasks inside an occupation can be automated. It is not the same as a job being removed. Holding those two apart is the whole basis of my position.">
      <div>
        <div className="eyebrow">From adoption to outcomes</div>
        <h3 className="t-sub mt-2 mb-6">How automation reaches workers</h3>
        <AutomationMechanism />
      </div>
      <div className="mt-14 max-w-reading">
        <h3 className="t-sub">{ADOPTION_CAUSES.heading}</h3>
        <p className="mt-3 prose-r"><Sentences items={ADOPTION_CAUSES.sentences} /></p>
      </div>

      <div className="mt-14">
        <div className="eyebrow">The evidence</div>
        <h3 className="t-sub mt-2">Exposure, employment and displacement risk, one figure at a time</h3>
        <p className="t-micro mt-2 max-w-reading">
          Each tab keeps one kind of figure apart from the others and says where it comes from, the period
          it covers and what it cannot be used for.
        </p>
        <div className="mt-5"><ExposureExplorer /></div>
      </div>

      <p className="mt-10 prose-r">
        Asian Development Bank work on Philippine readiness is where the training-quality
        problem shows up: the most availed technical and vocational courses often lead to
        low-productivity occupations, which is a different problem from training volume.{' '}
        <Cite keys={['adb2020', 'adb2021']} />
      </p>

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
                  <span className="w-6 shrink-0 pt-0.5 font-serif text-[1rem] font-semibold tabular-nums text-cyan-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.05rem] font-semibold text-sand">{s.name}</span>
                    <span className="block mt-1 text-[0.92rem] text-mute">{s.role}</span>
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
                      <dl className="mt-1 grid gap-5 border-t border-line px-6 pb-6 pt-4 sm:grid-cols-3">
                        {[['How they are affected', s.affected], ['What they want', s.interest],
                          ['What they would contribute', s.contribution]].map(([k, v]) => (
                          <div key={k}>
                            <dt className="mlabel text-mute">{k}</dt>
                            <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-sand/90">{v}</dd>
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
      <p className="mt-6 max-w-reading text-[0.98rem] text-sand/85">
        This section is about who is affected and what each group wants. What each would do in the
        proposed track is set out in{' '}
        <a href="#proposal" className="link">section F</a>.
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------------ D */
export function Solutions() {
  return (
    <Section id="solutions" letter="D" label="Five solutions"
      title="Five solutions, compared against four selected criteria"
      lede="Two are Philippine programmes, three are Singapore programmes. Each was chosen because it exists and is documented, not to reach a required number.">

      {/* The four criteria and why these four, before any rating. */}
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CRITERIA.map(c => (
          <div key={c.key} className="border-t-2 border-sand pt-3">
            <dt className="font-serif text-[1.15rem] font-semibold text-sand">{c.label}</dt>
            <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-sand/85">{c.blurb}</dd>
          </div>
        ))}
      </dl>
      <Caveat>{CRITERIA_PROVENANCE}</Caveat>

      <div className="mt-12">
        <div className="eyebrow">All five at once</div>
        <h3 className="t-sub mt-2">The 20 ratings, side by side</h3>
        <p className="t-micro mt-2 max-w-reading">
          Choose a rating to read the reason for it, or an alternative for its full record. The ratings are
          qualitative judgements on the evidence, not scores, so none of these is a number and nothing here
          is added up.
        </p>
        <div className="mt-5"><Comparison /></div>
      </div>

      <div className="hidden md:block">
        <Disclosure summary="Every rating with its reason (20)" hint="The full record of the comparison, for reading or printing in one place">
          <div className="grid gap-8 pt-2 lg:grid-cols-2">
            {RANKED.map(s => (
              <div key={s.id}>
                <h4 className="font-serif text-[1.1rem] font-semibold text-sand">{s.rank}. {s.name}</h4>
                <dl className="mt-3 space-y-3">
                  {CRITERIA.map(c => (
                    <div key={c.key}>
                      <dt className="flex flex-wrap items-center gap-2"><span className="mlabel text-mute">{c.label}</span><Chip tone={ratingTone(s.criteria[c.key].r)}>{s.criteria[c.key].r}</Chip></dt>
                      <dd className="mt-1 text-[0.95rem] leading-relaxed text-sand/88">{s.criteria[c.key].why}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2"><Cite keys={s.ref} /></p>
              </div>
            ))}
          </div>
        </Disclosure>
      </div>

      <EvidenceCards section="solutions" />
    </Section>
  );
}

/* The Singapore effects for the explorer. Values come from the research data;
   the wording is what the previous charts said about each figure. */
const SG_RETENTION = SG_OUTCOMES.find(o => o.unit === 'pp')!;
const SG_GROUPS: { heading: string; unit: Measure['unit']; measures: Measure[] }[] = [
  { heading: 'Wage effect', unit: '%', measures: [
    { key: 'placement', label: 'Wages, placement year', unit: '%', value: SG_WAGE_TRAJECTORY.placement.value,
      period: SG_WAGE_TRAJECTORY.placement.label,
      meaning: 'Percent higher earnings than the control group over this period.' },
    { key: 'after', label: 'Wages, next four years', unit: '%',
      low: SG_WAGE_TRAJECTORY.after.low, high: SG_WAGE_TRAJECTORY.after.high,
      period: SG_WAGE_TRAJECTORY.after.label,
      meaning: 'Percent higher earnings than the control group over this period.',
      caution: 'The source gives a range, not a figure per year. It is a separate measurement from the placement year, not a continuation of it.' },
  ] },
  { heading: 'Retention effect', unit: 'pp', measures: [
    { key: 'retention', label: SG_RETENTION.name, unit: 'pp', value: SG_RETENTION.value,
      meaning: 'Percentage points more likely to still be in the job than the control group.',
      caution: 'Percentage points, not percent: the difference between two retention rates. It is not comparable with the wage percentages.' },
  ] },
];

/* ------------------------------------------------------------------ E */
export function Ranking() {
  return (
    <Section id="ranking" letter="E" label="Solution ranking"
      title="The ranking, and why effectiveness decided it"
      lede="I weighted effectiveness most heavily, because my research question is whether workers are actually supported, not whether a programme exists on paper.">
      <ol className="space-y-3">
        {RANKED.map(s => (
          <Reveal key={s.id} as="li"
            className={`card flex gap-5 p-6 ${s.rank === 1 ? 'border-l-[3px] border-l-cyan-500' : ''}`}>
            <span className={`w-8 shrink-0 font-serif text-[2.2rem] font-semibold leading-none ${
              s.rank === 1 ? 'text-cyan-300' : 'text-mute'}`}>{s.rank}</span>
            <div className="min-w-0">
              <h3 className="font-serif text-[1.2rem] font-semibold text-sand">{s.name}</h3>
              <div className="mt-1 text-[0.88rem] text-mute">{s.where}{s.rank === 1 ? ' · the recommended basis for the proposal' : ''}</div>
              <p className="mt-3 max-w-reading text-[1rem] leading-relaxed text-sand/90">{s.rankWhy}</p>
              <div className="mt-3"><Cite keys={s.ref} /></div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Caveat>{RANKING_NOTE}</Caveat>

      <Reveal>
        <div className="mt-12 card p-7">
          <div className="eyebrow">Why rank one has the strongest evidence</div>
          <h3 className="t-sub mt-2">
            Singapore place-and-train, measured against control groups
          </h3>
          <div className="mt-7">
            <EvidenceExplorer max={SG_WAGE_TRAJECTORY.axisMax} groups={SG_GROUPS}>
              <p className="t-micro mt-4 border-t border-line pt-3">Source: <Cite keys={SG_WAGE_TRAJECTORY.ref} /></p>
            </EvidenceExplorer>
            <p className="t-micro mt-4 max-w-reading">{SG_WAGE_TRAJECTORY.note}</p>
            <p className="t-micro mt-1 max-w-reading">
              Wage effects are percentages. Retention is in percentage points, which is why it
              carries a different unit and a different colour. <Cite keys={['mti2025']} />
            </p>
          </div>
          <Caveat tone="rose">{SG_CAVEAT}</Caveat>
        </div>
      </Reveal>

      <EvidenceCards section="ranking" />
    </Section>
  );
}
