import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { Section, Reveal, Cite, Chip, Caveat, Disclosure, Sentences, REF_FOLLOWED, type RefFollowed } from './primitives';
import { StepRates } from './viz';
import { EvidenceCards, ImplementationMap } from './Evidence';
import { Pathway } from './Pathway';
import { SmartScorecard, CriteriaGrid } from './Evaluation';
import { MEDIA, type Media } from '../data/media';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import {
  PROPOSAL, JOURNEY, JOURNEY_CAVEAT, JOURNEY_STAGES, SMART_CAVEAT, EBET_DEDUCTION,
  RISKS, CONCLUSION, REFERENCES, RECOMMENDATIONS, RECOMMENDATIONS_INTRO, PART_FOR_STEP, type RefKey,
  SOURCE_EVALUATION, SOURCE_EVALUATION_INTRO, SOURCE_TYPE, SECTIONS,
} from '../data/research';

/* ------------------------------------------------------------------ F */
export function Proposal() {
  return (
    <Section id="proposal" letter="F" label="Philippine career conversion proposal"
      title={PROPOSAL.name}
      lede="The selected solution, adapted for the Philippines using programmes and legislation that already exist here.">

      <Caveat tone="rose">{PROPOSAL.claim}</Caveat>

      {/* mechanism */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PROPOSAL.mechanism.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.08}>
            <div className="h-full border-t-2 border-sand pt-4">
              <div className="font-serif text-[1.6rem] font-semibold leading-none text-cyan-300">{m.n}</div>
              <h3 className="mt-3 font-serif text-[1.2rem] font-semibold text-sand">{m.t}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-sand/85">{m.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* how it would run, in five parts that map onto the section G journey */}
      <div className="mt-14">
        <div className="eyebrow">How the track would run</div>
        <h3 className="t-sub mt-2">Five parts, from an affected role to measured outcomes</h3>
        <p className="t-lede mt-3">
          The three mechanisms above become five practical parts once intake and monitoring are
          included. The worker journey in section G follows the same parts, step by step.
        </p>
        <div className="mt-8"><Pathway /></div>
      </div>

      {/* the gap */}
      <Reveal>
        <div className="mt-14">
          <div className="eyebrow">What is already here, and what is not</div>
          <h3 className="t-sub mt-2">
            The Philippines has more of the pieces than I first credited
          </h3>
          <div className="mt-6 card border-l-[3px] border-l-rose p-6">
            <div className="eyebrow">Still missing</div>
            <ul className="mt-3 grid gap-3 md:grid-cols-3">
              {PROPOSAL.gap.missing.map((x, i) => (
                <li key={i} className="text-[1rem] leading-relaxed text-sand/90">{x}</li>
              ))}
            </ul>
          </div>
          <Disclosure
            summary="Legal basis in place and machinery in place (6), with the employer deduction"
            hint="RA 11962, RA 12063, the 740 million peso commitment, the Section 20 deduction, JobStart's delivery machinery and TESDA's training supply">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="border-l-[3px] border-cyan-500 pl-5">
              <div className="eyebrow">Legal basis in place</div>
              <ul className="mt-3 space-y-4">
                {PROPOSAL.gap.haveLegal.map(x => (
                  <li key={x.t}>
                    <div className="text-[0.98rem] font-semibold text-sand">{x.t}</div>
                    <p className="mt-1 text-[0.93rem] leading-relaxed text-sand/85">{x.d}</p>
                    <div className="mt-1.5"><Cite keys={x.ref} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-[3px] border-cyan-500 pl-5">
              <div className="eyebrow">Machinery in place</div>
              <ul className="mt-3 space-y-4">
                {PROPOSAL.gap.haveOps.map(x => (
                  <li key={x.t}>
                    <div className="text-[0.98rem] font-semibold text-sand">{x.t}</div>
                    <p className="mt-1 text-[0.93rem] leading-relaxed text-sand/85">{x.d}</p>
                    <div className="mt-1.5"><Cite keys={x.ref} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-ink-800 p-6 lg:p-7">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-8 items-center">
              <div>
                <div className="eyebrow">The employer incentive, already in law</div>
                <h4 className="t-sub mt-3">Additional deduction on training expenses</h4>
                <p className="t-small mt-3">{EBET_DEDUCTION.note}</p>
                <p className="t-micro mt-3">{EBET_DEDUCTION.cap}</p>
                <div className="mt-4"><Cite keys={EBET_DEDUCTION.ref} /></div>
              </div>
              <div className="lg:justify-self-end">
                <StepRates steps={EBET_DEDUCTION.steps} unit={EBET_DEDUCTION.unit} />
                <p className="t-micro mt-2">Hover or tab a bar for the period it covers.</p>
              </div>
            </div>
          </div>
          </Disclosure>
        </div>
      </Reveal>

      {/* adaptation table: the same design, element by element, one labelled click away */}
      <Disclosure
        summary="How the design would work here, element by element (7)"
        hint="Who it is for, entry, training, income, the employer incentive, funding and the proposed lead agencies">
        <dl className="space-y-5">
          {PROPOSAL.adaptation.map(a => (
            <div key={a.k} className="grid gap-x-6 gap-y-1.5 border-t border-line pt-5 first:border-0 first:pt-0 sm:grid-cols-[14rem_minmax(0,1fr)]">
              <dt className="font-serif text-[1.05rem] font-semibold text-sand">{a.k}</dt>
              <dd className="text-[0.98rem] leading-relaxed text-sand/90">
                {a.v} <Cite keys={a.ref} />
              </dd>
            </div>
          ))}
        </dl>
      </Disclosure>

      {/*
        Everything above stays open: the claim, the mechanism, what is and is not
        already here, and how the design would work. That is the argument.

        The blocks below are the supporting detail. They are folded rather
        than cut, because section F ran to roughly twice the length of any other
        section. Nothing has been removed and nothing has changed section.
        Reveal is deliberately not used inside them: a scroll-triggered entrance
        cannot fire reliably on content that was display:none a moment earlier.
      */}
      <div className="mt-14">
        <Disclosure
          summary="Resources, funding and what it depends on"
          hint="What the track would need to run, and the assumptions it rests on">
          <div className="grid md:grid-cols-3 gap-5">
            {([
              ['Resources needed', PROPOSAL.resources, 'neutral'],
              ['Financial requirements', PROPOSAL.financial, 'neutral'],
              ['What it depends on', PROPOSAL.depends, 'amber'],
            ] as const).map(([t, items, tone]) => (
              <div key={t}>
                <div className="eyebrow">{t}</div>
                <ul className="mt-3 space-y-2.5">
                  {items.map((x, i) => (
                    <li key={i} className="flex gap-3 text-[0.875rem] leading-relaxed text-sand/88">
                      <span className={tone === 'amber' ? 'text-amber shrink-0' : 'text-cyan-300/60 shrink-0'} aria-hidden>&middot;</span>{x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-line pt-6">
            <div className="eyebrow">Expected benefits</div>
            <ul className="mt-3 grid sm:grid-cols-3 gap-5">
              {PROPOSAL.benefits.map((b, i) => (
                <li key={i} className="text-[0.89rem] leading-relaxed text-sand/90">{b}</li>
              ))}
            </ul>
          </div>
        </Disclosure>

        {/* verified vs proposed, the §9 requirement */}
        <Disclosure
          summary="What is verified against what I am proposing"
          hint="The line between evidence I checked and design decisions that are mine">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card p-6 border-cyan-500/30">
              <div className="flex items-center gap-3">
                <Chip tone="cyan">Verified evidence</Chip>
              </div>
              <ul className="mt-4 space-y-2.5">
                {PROPOSAL.verified.map((x, i) => (
                  <li key={i} className="text-[0.875rem] leading-relaxed text-sand/88">{x}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6 border-amber/30">
              <div className="flex items-center gap-3">
                <Chip tone="amber">Proposed by me, not established</Chip>
              </div>
              <ul className="mt-4 space-y-2.5">
                {PROPOSAL.proposed.map((x, i) => (
                  <li key={i} className="text-[0.875rem] leading-relaxed text-sand/88">{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Disclosure>

        <Disclosure
          summary="Who would do what across the three stages"
          hint="Each organisation's existing statutory duty, against what this proposal would ask of it">
          <ImplementationMap heading={false} />
        </Disclosure>
      </div>

      <EvidenceCards section="proposal" />
    </Section>
  );
}

/* ------------------------------------------------------------------ G */
export function Journey() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  /**
   * Which of the five named stages is selected, tracked separately from the step.
   *
   * "Employer participation" and "Placement" are both carried by journey step 3,
   * so a selection derived from the step number alone marked both cards active at
   * once. The stage is the thing the reader clicked, so it is the thing stored.
   * Null is correct for steps 1 and 5, which are not among the five named stages.
   */
  const [stage, setStage] = useState<string | null>(null);

  /* Picking a stage card: remember the stage, move the step to match. */
  const pickStage = (st: { stage: string; step: number }) => {
    setStage(st.stage);
    setStep(JOURNEY.findIndex(j => j.step === st.step));
  };

  /* Picking a step from the rail or the dots: move the step, and resolve the stage
     to the first one that step carries, so exactly one card is ever marked active. */
  const pickStep = (i: number) => {
    setStep(i);
    setStage(JOURNEY_STAGES.find(x => x.step === JOURNEY[i].step)?.stage ?? null);
  };

  return (
    <Section id="journey" letter="G" label="A worker journey"
      title="What the track would look like for one worker"
      lede="A hypothetical walkthrough, used to show how the parts connect. Every step is grounded in a real programme feature or a real legal provision.">

      <Caveat tone="rose">{JOURNEY_CAVEAT}</Caveat>

      {/* The five stages the Assessment Guide names, mapped onto the six steps. */}
      <Reveal>
        <div className="mt-12">
          <div className="eyebrow">The five stages, and where each one sits</div>
          <ol className="mt-5 grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {JOURNEY_STAGES.map(st => {
              const on = stage === st.stage;
              return (
                <li key={st.stage}>
                  <button
                    type="button"
                    onClick={() => pickStage(st)}
                    aria-pressed={on}
                    className={`w-full h-full text-left card card-action px-4 py-3.5 ${
                      on ? 'border-cyan-500/50 bg-cyan-500/[0.07]' : ''}`}
                  >
                    <span className={`block text-[0.95rem] font-semibold leading-snug ${
                      on ? 'text-cyan-200' : 'text-sand'}`}>{st.stage}</span>
                    <span className="mt-1 block text-[0.85rem] text-mute">Step {st.step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="t-micro mt-3 max-w-reading">
            Steps 1 and 5 are not among the five named stages but are kept because they carry
            what the stages do not: what triggers the conversion, and what keeps the worker
            solvent while it happens.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-[22rem_minmax(0,1fr)] gap-8 items-start">
        {/* step rail, with a spine that fills as the reader moves down it */}
        <div>
            <p className="t-micro mb-3 max-w-reading">
              These six steps follow the five parts of the proposed track in{' '}
              <a href="#proposal" className="link">section F</a>.
            </p>
        <div className="relative">
          <div aria-hidden className="absolute left-[1.42rem] top-4 bottom-4 w-px bg-line inert" />
          <motion.div
            aria-hidden
            className="absolute left-[1.42rem] top-4 w-px bg-cyan-500 origin-top inert"
            style={{ bottom: '1rem' }}
            initial={false}
            animate={{ scaleY: (step + 1) / JOURNEY.length }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          />
          <ol className="relative space-y-1" aria-label="Journey steps">
            {JOURNEY.map((j, i) => {
              const done = i <= step;
              return (
                <li key={j.step}>
                  <button
                    onClick={() => pickStep(i)} aria-current={i === step ? 'step' : undefined}
                    className={`w-full text-left pl-4 pr-4 py-3.5 rounded-lg flex gap-3.5 items-start transition-colors ${
                      i === step ? 'bg-ink-700 border border-cyan-500/60 shadow-[0_1px_2px_rgb(21_25_31/0.05)]' : 'border border-transparent hover:bg-ink-700'}`}
                  >
                    <motion.span
                      aria-hidden
                      className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-bold tabular-nums ${
                        i === step ? 'border-cyan-500 bg-cyan-500 text-[rgb(var(--on-accent))]'
                        : done ? 'border-cyan-500/60 bg-ink-900 text-cyan-300'
                        : 'border-line bg-ink-900 text-mute/80'}`}
                      animate={{ scale: i === step ? 1.12 : 1 }}
                      transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                      {j.step}
                    </motion.span>
                    <span className="min-w-0">
                      <span className={`block text-[0.94rem] leading-snug ${i === step ? 'text-sand' : 'text-sand/75'}`}>
                        {j.label}
                      </span>
                      <span className="block mt-0.5 text-[0.875rem] text-mute">{j.who}</span>
                      <span className="mt-1 block text-[0.82rem] font-semibold text-cyan-300">Part {PART_FOR_STEP[j.step]} of the proposed track</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        </div>

        {/* panel */}
        <div className="card p-7 lg:sticky lg:top-24" aria-live="polite">
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="eyebrow">Step {JOURNEY[step].step} of {JOURNEY.length}</div>
              <Chip tone={JOURNEY[step].stage === 'Context' || JOURNEY[step].stage === 'Income support' ? 'neutral' : 'cyan'}>
                {JOURNEY[step].stage}
              </Chip>
            </div>
            <h3 className="t-sub mt-3 leading-tight">
              {JOURNEY[step].label}
            </h3>
            <div className="mt-2 mlabel text-cyan-300">
              {JOURNEY[step].who}
            </div>
            <p className="mt-5 text-[1rem] leading-relaxed text-sand/92">{JOURNEY[step].body}</p>
            <div className="mt-5"><Cite keys={JOURNEY[step].ref} /></div>
          </motion.div>

          {/* progress dots. Wraps on the narrowest phones, where the six dots and the
              two arrows do not fit on one line and would otherwise widen the page. */}
          <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Journey progress">
            {JOURNEY.map((j, i) => (
              <button
                key={j.step} onClick={() => pickStep(i)}
                aria-label={`Step ${j.step}: ${j.label}`}
                /* The step rail above already carries aria-current, so these
                   shortcut dots only announce which step they jump to. */
                aria-pressed={i === step}
                /* The dot stays small; the padding gives it a 24px tap target. */
                className="group grid h-11 place-items-center px-1"
              >
                <span className={`block h-1 rounded-full transition-all ${
                  i === step ? 'w-8 bg-cyan-500' : 'w-4 bg-mute/40 group-hover:bg-mute/70'}`} />
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button className="btn btn-g !w-11 !px-0" aria-label="Previous step"
                onClick={() => pickStep(Math.max(0, step - 1))}
                disabled={step === 0}>&larr;</button>
              <button className="btn btn-g !w-11 !px-0" aria-label="Next step"
                onClick={() => pickStep(Math.min(JOURNEY.length - 1, step + 1))}
                disabled={step === JOURNEY.length - 1}>&rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ H */
export function Smart() {
  return (
    <Section id="smart" letter="H" label="SMART success dashboard"
      title="How success would be measured"
      lede="Six indicators. Each one names the target, how it would be measured, where the data would come from, who would be responsible, and what it cannot tell you.">

      <Caveat>{SMART_CAVEAT}</Caveat>

      <div className="mt-10"><SmartScorecard /></div>
    </Section>
  );
}

/* ------------------------------------------------------------------ I */
export function Criteria() {
  return (
    <Section id="criteria" letter="I" label="Evaluating success"
      title="Evaluating success: the proposal against the four required criteria"
      lede="These are the four Evaluating Success criteria: sustainability, impact, feasibility and effectiveness. They are separate from the criteria used to compare the alternatives in section D. For each one I give my judgement, the evidence for it, and how success would be assessed, using the SMART indicators in section H where one applies and saying so where none does.">
      <CriteriaGrid />
      <Caveat>
        The verdicts here are qualitative and none is presented as a score. Every target mentioned is a
        proposed planning target from section H, not a measured result.
      </Caveat>
    </Section>
  );
}

/* ------------------------------------------------------------------ J */
export function Risks() {
  return (
    <Section id="risks" letter="J" label="Risks and limitations"
      title="What could stop this, and what my research cannot tell you"
      lede="Listing these is part of the argument, not a disclaimer attached to it.">
      {/* Below 760 px the table scrolls sideways. The scroll box takes keyboard focus
          so arrow keys can scroll it, and the hint says it scrolls. */}
      <p className="mb-2 text-[0.875rem] text-mute md:hidden" aria-hidden>Scroll the table sideways to see every column.</p>
      <div className="overflow-x-auto card" tabIndex={0} role="region" aria-label="Risks table, scrolls sideways on small screens">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <caption className="sr-only">Six risks with the reason each matters and a proposed mitigation.</caption>
          <thead>
            <tr className="border-b border-line bg-ink-800">
              {['Area', 'Risk', 'Why it matters', 'Proposed mitigation'].map(h => (
                <th key={h} scope="col" className="px-5 py-3.5 mlabel text-mute">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RISKS.map(r => (
              <tr key={r.risk} className="border-b border-line last:border-0 align-top">
                <th scope="row" className="px-5 py-4 font-normal">
                  <Chip>{r.cat}</Chip>
                </th>
                <td className="px-5 py-4 text-[0.95rem] font-medium leading-relaxed text-sand">{r.risk}</td>
                <td className="px-5 py-4 text-[0.93rem] leading-relaxed text-sand/85">{r.why}</td>
                <td className="px-5 py-4 text-[0.93rem] leading-relaxed text-sand/90">
                  {r.mit} <Cite keys={r.ref} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal>
        <div className="mt-10 card border-l-[3px] border-l-rose p-7">
          <h3 className="t-sub">Limitations of this research</h3>
          <ul className="mt-4 space-y-3 prose-r">
            {[
              'The strongest effectiveness evidence is from Singapore. It shows what the model did there, not what it would do in the Philippines.',
              'The 740 million peso reskilling commitment had no published outcome data at the time of writing, because it was only set to start in the second half of 2025.',
              'I found no published impact evaluation of JobStart. The Asian Development Bank evaluation did not rate the JobStart rollout assistance, which was still ongoing.',
              'Worker acceptance is unmeasured in every source I reviewed. That is why one SMART indicator sets a baseline rather than a pass mark.',
              'No stakeholder named on this site has been approached about this proposal, and none has endorsed it.',
              'Exposure figures describe occupations, not individual workers, and exposure is not displacement.',
            ].map((x, i) => (
              <li key={i} className="flex gap-3 text-[1rem] leading-relaxed text-sand/90">
                <span className="text-rose shrink-0" aria-hidden>&middot;</span>{x}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ K */
/* The three conclusion paragraphs, each with a heading and a way back to its evidence.
   The paragraphs are unchanged; the headings are signposts only. */
const FINDINGS: { heading: string; links: [string, string][] }[] = [
  { heading: 'Change more than removal, landing unevenly', links: [['#challenge', 'The evidence, section B']] },
  { heading: 'One alternative stands out on the evidence', links: [['#solutions', 'The comparison, section D'], ['#ranking', 'The ranking, section E']] },
  { heading: 'The gap is income support and matching', links: [['#proposal', 'The proposal, section F'], ['#smart', 'The indicators, section H']] },
];

export function Conclusion() {
  return (
    <Section id="conclusion" letter="K" label="Conclusion"
      title="Automation should be paired with support, built into the transition"
      lede="">
      <ol className="grid gap-5 lg:grid-cols-3">
        {CONCLUSION.map((p, i) => (
          <li key={i} className="flex flex-col border-t-2 border-sand pt-4">
            <span className="font-serif text-[1.6rem] font-semibold leading-none text-cyan-300">{i + 1}</span>
            <h3 className="mt-3 font-serif text-[1.25rem] font-semibold leading-snug text-sand">{FINDINGS[i].heading}</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-sand/90"><Sentences items={p} /></p>
            <ul className="mt-auto flex flex-wrap gap-x-4 pt-3 text-[0.92rem]">
              {FINDINGS[i].links.map(([href, label]) => (
                <li key={href}><a href={href} className="link inline-flex min-h-[44px] items-center">{label} <span aria-hidden className="ml-1">→</span></a></li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-reading text-[1rem] text-sand/85">
        My position on the issue is set out in full at the start, in <a href="#position" className="link">section A</a>.
      </p>

      {/* Recommendations: every stakeholder named is a proposed implementer only. */}
      <div className="mt-14">
        <h3 className="t-sub">Recommendations</h3>
        <p className="t-lede mt-3">{RECOMMENDATIONS_INTRO}</p>
        <ol className="mt-8 space-y-4">
          {RECOMMENDATIONS.map((r, i) => (
            <Reveal key={r.action} as="li">
              <div className="card p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span aria-hidden className="shrink-0 pt-0.5 font-serif text-[1.3rem] font-semibold leading-none text-cyan-300">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-[1.2rem] font-semibold leading-snug text-sand">{r.action}</h4>
                    <dl className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
                      {([
                        ['Responsible', r.who],
                        ['Expected benefit', r.benefit],
                        ['Evidence', <Sentences key="e" items={r.evidence} />],
                        ['Consideration', r.consideration],
                      ] as const).map(([k, v]) => (
                        <div key={k}>
                          <dt className="mlabel text-mute">{k}</dt>
                          <dd className="mt-1 text-[0.95rem] leading-relaxed text-sand/90">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ L */
export function References() {
  /* The entry the reader has just jumped to from a citation, if any. A cold load
     of a reference link has nowhere to go back to, so it offers no button. */
  const [back, setBack] = useState<RefKey | null>(null);
  const [type, setType] = useState<string | null>(null);
  useEffect(() => {
    /* A followed citation must land on its entry even if a filter hides it, so the
       filter clears synchronously, before the citation scrolls. */
    const onFollow = (e: Event) => flushSync(() => {
      setBack((e as CustomEvent<RefFollowed>).detail.key);
      setType(null);
    });
    const onPop = () => setBack(k => (k && location.hash === `#ref-${k}` ? k : null));
    window.addEventListener(REF_FOLLOWED, onFollow);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener(REF_FOLLOWED, onFollow);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const cited = useCitedIn();
  const types = [...new Set(REFERENCES.map(r => SOURCE_TYPE[r.key]))].sort();

  return (
    <Section id="references" letter="L" label="References"
      title="References"
      lede={`${REFERENCES.length} sources, APA 7. Each was checked against the claim it supports in October 2026. Where an original page has since been removed, the entry links to an archived copy. Primary sources are used wherever one exists.`}>
      <p className="t-micro mb-8 max-w-reading">
        Sections B, D, E and F also carry evidence cards beside the claims themselves, showing what
        each source reports and the area it covers. Those are a shortcut for checking a figure. This
        list is the formal citation record.
      </p>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
      <div className="min-w-0 lg:order-1 order-2">
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Show references by source type">
        <span className="mr-1 text-[0.92rem] text-mute">Source type:</span>
        {[null, ...types].map(t => (
          <button key={t ?? 'all'} type="button" onClick={() => setType(t)} aria-pressed={type === t}
            className={`min-h-[44px] rounded-full border px-4 text-[0.88rem] font-semibold transition-colors ${
              type === t ? 'border-sand bg-sand text-ink-700' : 'border-line bg-ink-700 text-sand/85 hover:border-cyan-500/70'}`}>
            {t ?? `All ${REFERENCES.length}`}
            {t && <span className="ml-1.5 font-normal opacity-75">{REFERENCES.filter(r => SOURCE_TYPE[r.key] === t).length}</span>}
          </button>
        ))}
      </div>
      <ul className="space-y-6">
        {[...REFERENCES]
          .sort((a, b) => a.author.localeCompare(b.author) || a.year.localeCompare(b.year))
          .map(r => (
          <li key={r.key} id={`ref-${r.key}`} tabIndex={-1} hidden={type !== null && SOURCE_TYPE[r.key] !== type}
            className="scroll-mt-28 rounded focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
            <p className="pl-8 -indent-8 text-[0.98rem] leading-relaxed text-sand/90">
              {/* APA 7 closes the author element with a period; initials already supply one. */}
              {r.author.endsWith('.') ? r.author : `${r.author}.`} ({r.year}).{' '}
              {r.part ? r.title : <em className="text-sand">{r.title}</em>}
              {r.container && <>. {r.part ? <em className="text-sand">{r.container}</em> : r.container}</>}.{' '}
              {r.retrieved && <>Retrieved {r.retrieved}, from </>}
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                className="link [overflow-wrap:anywhere]">
                {r.url}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <p className="mt-1.5 pl-8 text-[0.88rem] text-mute">
              <span className="font-semibold">{SOURCE_TYPE[r.key]}</span>
              {cited[r.key]?.length ? (
                <> · Cited in{' '}
                  {cited[r.key].map((c, i) => (
                    <span key={c.href}>{i > 0 && ', '}<a href={c.href} className="link">{c.label}</a></span>
                  ))}
                </>
              ) : null}
            </p>
            {r.note && <p className="mt-2 pl-8 text-[0.92rem] leading-relaxed text-mute">{r.note}</p>}
            {back === r.key && (
              <button type="button" onClick={() => history.back()}
                className="mt-2 ml-8 btn btn-g !px-4 !text-[0.875rem]">
                Back to the citation
              </button>
            )}
          </li>
        ))}
      </ul>
      </div>
      <div className="order-1 lg:order-2">
      {/* CC-3: the class Evaluating Information criteria, named and applied. */}
      <aside id="source-evaluation" className="card scroll-mt-24 p-6 lg:sticky lg:top-24" aria-labelledby="source-evaluation-title">
        <div className="eyebrow">Evaluating information</div>
        <h3 id="source-evaluation-title" className="t-sub mt-3">How I evaluated my sources</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-sand/90">{SOURCE_EVALUATION_INTRO}</p>
        <dl className="mt-4 space-y-3">
          {SOURCE_EVALUATION.map(c => (
            <div key={c.criterion} className="border-l-2 border-line pl-4">
              <dt className="font-serif text-[1.05rem] font-semibold text-sand">{c.criterion}</dt>
              <dd className="mt-1 text-[0.95rem] leading-relaxed text-sand/90">{c.t}</dd>
            </div>
          ))}
        </dl>
      </aside>
      {/* APA 7 list: unnumbered, alphabetical, hanging indent. The order is
          derived here rather than trusted to the data, so it cannot drift when an
          entry's author changes. [overflow-wrap:anywhere] stops an unbroken URL
          from pushing the page sideways on a phone. tabIndex -1 makes each entry a
          focus target, so a followed citation lands focus here, not at the top. */}
      </div>
      </div>

      {/* Credits for every photograph on the site, as each licence requires. */}
      <div id="photo-credits" className="mt-14 max-w-reading scroll-mt-24">
        <h3 className="t-sub">Photographs</h3>
        <p className="t-micro mt-3">
          All photographs are illustrative. None documents a finding of this research or shows a
          participant. Each was cropped, resized and converted for the web; the CC BY-SA adaptations
          are shared under the same licence.
        </p>
        <ul className="mt-5 space-y-4">
          {(Object.values(MEDIA) as Media[]).map(m => (
            <li key={m.key} className="pl-8 -indent-8 text-[0.92rem] leading-relaxed text-sand/90">
              {m.caption} “{m.title}”, photograph by {m.creator}.{' '}
              {m.licenseUrl
                ? <a href={m.licenseUrl} target="_blank" rel="noopener noreferrer" className="link">{m.license}<span className="sr-only"> (opens in a new tab)</span></a>
                : m.license}
              . {m.adapted}{' '}
              <a href={m.source} target="_blank" rel="noopener noreferrer"
                className="link [overflow-wrap:anywhere]">
                Source on Wikimedia Commons<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-14 max-w-reading">
        <h3 className="t-sub">About this submission</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-sand/90">
          This website is the Terminal Assessment deliverable. It carries the full research narrative,
          the five-solution evaluation, the selected solution, the Philippine contextualisation, the
          SMART indicators and the references. Worksheet 8, the individual timeline, the AI Use
          Statement and the reflection records are tracked as separate deliverables, because the
          website does not replace those activities.
        </p>
      </div>
    </Section>
  );
}

/**
 * Where each reference is cited, read from the rendered page rather than kept by
 * hand, so the list cannot drift from the citations. Every citation link outside
 * section L is traced to the section or opening it sits in.
 */
function useCitedIn() {
  const [map, setMap] = useState<Record<string, { href: string; label: string }[]>>({});
  useEffect(() => {
    const out: Record<string, { href: string; label: string }[]> = {};
    document.querySelectorAll<HTMLAnchorElement>('main a[href^="#ref-"]').forEach(a => {
      if (a.closest('#references')) return;
      const key = a.getAttribute('href')!.slice(5);
      const home = a.closest('#top');
      const sec = a.closest<HTMLElement>('section[id]');
      const def = sec ? SECTIONS.find(x => x.id === sec.id) : undefined;
      const place = home ? { href: '#top', label: 'Home' }
        : def ? { href: `#${def.id}`, label: def.letter }
        : sec?.id.startsWith('chapter-') ? { href: `#${sec.id}`, label: `Chapter ${sec.id.slice(8)} opening` }
        : null;
      if (!place) return;
      const list = (out[key] ??= []);
      if (!list.some(p => p.href === place.href)) list.push(place);
    });
    /* After the first paint, when every section has rendered its citations. */
    const f = requestAnimationFrame(() => setMap(out));
    return () => cancelAnimationFrame(f);
  }, []);
  return map;
}
