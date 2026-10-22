import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Section, Reveal, Cite, Chip, Caveat, Disclosure, Sentences, REF_FOLLOWED, type RefFollowed } from './primitives';
import { StepRates } from './viz';
import { EvidenceCards, ImplementationMap } from './Evidence';
import { usePrefersReducedMotion } from '../hooks/useSiteState';
import {
  PROPOSAL, JOURNEY, JOURNEY_CAVEAT, JOURNEY_STAGES, SMART, SMART_CAVEAT, EBET_DEDUCTION,
  PROPOSAL_CRITERIA, RISKS, CONCLUSION, REFERENCES, PROJECT, RECOMMENDATIONS, RECOMMENDATIONS_INTRO, type RefKey,
} from '../data/research';

/* ------------------------------------------------------------------ F */
export function Proposal() {
  return (
    <Section id="proposal" letter="F" label="Philippine career conversion proposal"
      title={PROPOSAL.name}
      lede="The selected solution, adapted for the Philippines using programmes and legislation that already exist here.">

      <Caveat tone="rose">{PROPOSAL.claim}</Caveat>

      {/* mechanism */}
      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {PROPOSAL.mechanism.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.08}>
            <div className="card p-6 h-full">
              <div className="font-display text-[1.9rem] font-extrabold leading-none text-cyan-300/55">{m.n}</div>
              <h3 className="mt-3 text-[1.02rem] text-sand">{m.t}</h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-mute">{m.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* the gap */}
      <Reveal>
        <div className="mt-14">
          <div className="eyebrow">What is already here, and what is not</div>
          <h3 className="mt-2 font-display text-sub text-sand">
            The Philippines has more of the pieces than I first credited
          </h3>
          <div className="mt-8 grid lg:grid-cols-3 gap-5">
            <div className="card p-6 border-l-2 border-l-rose/60">
              <div className="eyebrow">Still missing</div>
              <ul className="mt-3 space-y-3">
                {PROPOSAL.gap.missing.map((x, i) => (
                  <li key={i} className="text-[0.88rem] leading-relaxed text-sand/88">{x}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6 border-l-2 border-l-cyan-500/60">
              <div className="eyebrow">Legal basis in place</div>
              <ul className="mt-3 space-y-4">
                {PROPOSAL.gap.haveLegal.map(x => (
                  <li key={x.t}>
                    <div className="text-[0.9rem] text-sand">{x.t}</div>
                    <p className="mt-1 text-[0.84rem] leading-relaxed text-mute">{x.d}</p>
                    <div className="mt-1.5"><Cite keys={x.ref} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 border-l-2 border-l-cyan-500/60">
              <div className="eyebrow">Machinery in place</div>
              <ul className="mt-3 space-y-4">
                {PROPOSAL.gap.haveOps.map(x => (
                  <li key={x.t}>
                    <div className="text-[0.9rem] text-sand">{x.t}</div>
                    <p className="mt-1 text-[0.84rem] leading-relaxed text-mute">{x.d}</p>
                    <div className="mt-1.5"><Cite keys={x.ref} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 card p-6 lg:p-7">
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
        </div>
      </Reveal>

      {/* adaptation table */}
      <Reveal>
        <div className="mt-14">
          <div className="eyebrow">How the design would work here</div>
          <dl className="mt-5 space-y-5">
            {PROPOSAL.adaptation.map(a => (
              <div key={a.k} className="grid sm:grid-cols-[14rem_minmax(0,1fr)] gap-x-6 gap-y-1.5 border-t border-line pt-5">
                <dt className="mlabel text-cyan-300">{a.k}</dt>
                <dd className="text-[0.92rem] leading-relaxed text-sand/92">
                  {a.v} <Cite keys={a.ref} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/*
        Everything above stays open: the claim, the mechanism, what is and is not
        already here, and how the design would work. That is the argument.

        The three blocks below are the supporting detail. They are folded rather
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
                    <li key={i} className="flex gap-3 text-[0.87rem] leading-relaxed text-sand/88">
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
                  <li key={i} className="text-[0.87rem] leading-relaxed text-sand/88">{x}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6 border-amber/30">
              <div className="flex items-center gap-3">
                <Chip tone="amber">Proposed by me, not established</Chip>
              </div>
              <ul className="mt-4 space-y-2.5">
                {PROPOSAL.proposed.map((x, i) => (
                  <li key={i} className="text-[0.87rem] leading-relaxed text-sand/88">{x}</li>
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
                    <span className={`block font-display text-[0.88rem] font-bold leading-snug ${
                      on ? 'text-cyan-200' : 'text-sand'}`}>{st.stage}</span>
                    <span className="mt-1 block text-[0.74rem] text-mute">Step {st.step}</span>
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
        <div className="relative">
          <div aria-hidden className="absolute left-[1.42rem] top-4 bottom-4 w-px bg-line inert" />
          <motion.div
            aria-hidden
            className="absolute left-[1.42rem] top-4 w-px bg-gradient-to-b from-cyan-400 to-iris-400 origin-top inert"
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
                      i === step ? 'bg-cyan-500/[0.08] border border-cyan-500/30' : 'border border-transparent hover:bg-ink-600/50'}`}
                  >
                    <motion.span
                      aria-hidden
                      className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem] font-bold tabular-nums ${
                        i === step ? 'border-cyan-300 bg-cyan-400 text-ink-950'
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
                      <span className="block mt-0.5 text-[0.76rem] text-mute">{j.who}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
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
            <h3 className="mt-3 font-display text-sub leading-tight text-sand">
              {JOURNEY[step].label}
            </h3>
            <div className="mt-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cyan-300">
              {JOURNEY[step].who}
            </div>
            <p className="mt-5 text-[1rem] leading-relaxed text-sand/92">{JOURNEY[step].body}</p>
            <div className="mt-5"><Cite keys={JOURNEY[step].ref} /></div>
          </motion.div>

          {/* progress dots */}
          <div className="mt-8 flex items-center gap-2" role="group" aria-label="Journey progress">
            {JOURNEY.map((j, i) => (
              <button
                key={j.step} onClick={() => pickStep(i)}
                aria-label={`Step ${j.step}: ${j.label}`}
                /* The step rail above already carries aria-current, so these
                   shortcut dots only announce which step they jump to. */
                aria-pressed={i === step}
                /* The dot stays small; the padding gives it a 24px tap target. */
                className="group grid h-6 place-items-center px-1"
              >
                <span className={`block h-1 rounded-full transition-all ${
                  i === step ? 'w-8 bg-cyan-400' : 'w-4 bg-line group-hover:bg-mute/60'}`} />
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button className="btn btn-g !px-3 !py-1.5" aria-label="Previous step"
                onClick={() => pickStep(Math.max(0, step - 1))}
                disabled={step === 0}>&larr;</button>
              <button className="btn btn-g !px-3 !py-1.5" aria-label="Next step"
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
  const [open, setOpen] = useState<string | null>(SMART[0].id);
  return (
    <Section id="smart" letter="H" label="SMART success dashboard"
      title="How success would be measured"
      lede="Six indicators. Each one names the target, how it would be measured, where the data would come from, who would be responsible, and what it cannot tell you.">

      <Caveat>{SMART_CAVEAT}</Caveat>

      <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {SMART.map((m, i) => {
          const isOpen = open === m.id;
          return (
            <Reveal key={m.id} delay={i * 0.05}>
              <div className={`card p-6 flex flex-col transition-colors ${isOpen ? 'border-cyan-500/35' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1rem] leading-snug text-sand">{m.name}</h3>
                  <span className="font-mono text-[0.68rem] font-medium text-mute/80 pt-1 shrink-0">
                    M{i + 1}
                  </span>
                </div>

                <div className="mt-4 border-l-2 border-l-cyan-500/50 pl-4">
                  <div className="mlabel text-mute">Proposed target</div>
                  <div className="mt-1 font-display text-[1.08rem] font-bold leading-snug text-cyan-300">{m.target}</div>
                </div>

                <p className="mt-4 text-[0.85rem] leading-relaxed text-sand/85">{m.definition}</p>

                <button
                  onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen}
                  className="mt-4 self-start inline-flex min-h-[26px] items-center gap-1.5 rounded
                             mlabel
                             text-cyan-300 hover:text-cyan-200"
                >
                  <span aria-hidden className={`inline-block transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  {isOpen ? 'Hide detail' : 'Measurement detail'}
                </button>

                {isOpen && (
                  <dl className="mt-4 space-y-3 border-t border-line/60 pt-4">
                    {[['Objective', m.objective], ['Target group', m.targetGroup],
                      ['Baseline', m.baseline], ['Measurement tool', m.method],
                      ['Data source', m.source], ['Time point', m.timeframe],
                      ['Responsible', m.owner], ['What it cannot tell you', m.assumption]].map(([k, v]) => (
                      <div key={k}>
                        <dt className="mlabel text-mute">{k}</dt>
                        <dd className={`mt-0.5 text-[0.82rem] leading-relaxed ${
                          k === 'What it cannot tell you' ? 'text-amber/90'
                          : k === 'Baseline' ? 'text-sand/75' : 'text-sand/85'}`}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ I */
export function Criteria() {
  return (
    <Section id="criteria" letter="I" label="Class criteria assessment"
      title="The proposal against the class-approved criteria"
      lede="This is a separate assessment from the SMART indicators. The SMART indicators are how the proposal would be measured if it ran. This is how the proposal itself holds up against the four criteria the class agreed.">
      <div className="space-y-4">
        {PROPOSAL_CRITERIA.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <div className="card p-7 grid sm:grid-cols-[13rem_minmax(0,1fr)] gap-x-7 gap-y-3">
              <div>
                <h3 className="font-display text-sub text-sand">{c.label}</h3>
                <div className="mt-2"><Chip tone={
                  c.verdict.startsWith('Not') ? 'rose' : c.verdict.startsWith('Moderate,') ? 'amber' : 'cyan'
                }>{c.verdict}</Chip></div>
              </div>
              <p className="text-[0.95rem] leading-relaxed text-sand/92">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Caveat>
        The four criteria come from the Week 8 class session. The wording of the third still needs
        confirming against the class-approved criteria sheet. No numerical scores or weights were
        agreed by the class, so the verdicts here are qualitative and none is presented as a score.
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
      <div className="overflow-x-auto card">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <caption className="sr-only">Six risks with the reason each matters and a proposed mitigation.</caption>
          <thead>
            <tr className="border-b border-line">
              {['Area', 'Risk', 'Why it matters', 'Proposed mitigation'].map(h => (
                <th key={h} scope="col" className="px-5 py-3.5 mlabel text-mute">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RISKS.map(r => (
              <tr key={r.risk} className="border-b border-line/50 last:border-0 hover:bg-ink-600/40 align-top">
                <th scope="row" className="px-5 py-4 font-normal">
                  <Chip>{r.cat}</Chip>
                </th>
                <td className="px-5 py-4 text-[0.88rem] leading-relaxed text-sand">{r.risk}</td>
                <td className="px-5 py-4 text-[0.86rem] leading-relaxed text-mute">{r.why}</td>
                <td className="px-5 py-4 text-[0.86rem] leading-relaxed text-sand/88">
                  {r.mit} <Cite keys={r.ref} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal>
        <div className="mt-10 card p-7 border-rose/30">
          <div className="eyebrow">Limitations of this research</div>
          <ul className="mt-4 space-y-3 prose-r">
            {[
              'The strongest effectiveness evidence is from Singapore. It shows what the model did there, not what it would do in the Philippines.',
              'The 740 million peso reskilling commitment had no published outcome data at the time of writing, because it was only set to start in the second half of 2025.',
              'I found no published impact evaluation of JobStart. The Asian Development Bank evaluation did not rate the JobStart rollout assistance, which was still ongoing.',
              'Worker acceptance is unmeasured in every source I reviewed. That is why one SMART indicator sets a baseline rather than a pass mark.',
              'No stakeholder named on this site has been approached about this proposal, and none has endorsed it.',
              'Exposure figures describe occupations, not individual workers, and exposure is not displacement.',
            ].map((x, i) => (
              <li key={i} className="flex gap-3 text-[0.9rem] leading-relaxed text-sand/88">
                <span className="text-rose/60 shrink-0" aria-hidden>&middot;</span>{x}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ K */
export function Conclusion() {
  return (
    <Section id="conclusion" letter="K" label="Conclusion"
      title="Automation should be paired with support, built into the transition"
      lede="">
      <div className="prose-r space-y-6">
        {CONCLUSION.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className={i === 0 ? 'text-[1.1rem] leading-relaxed text-sand' : 'text-[1rem] leading-relaxed text-sand/90'}>
              <Sentences items={p} />
            </p>
          </Reveal>
        ))}
      </div>

      {/* Recommendations: every stakeholder named is a proposed implementer only. */}
      <div className="mt-14">
        <Reveal>
          <div className="eyebrow">Recommendations</div>
          <p className="t-lede mt-4">{RECOMMENDATIONS_INTRO}</p>
        </Reveal>
        <ol className="mt-8 space-y-4">
          {RECOMMENDATIONS.map((r, i) => (
            <Reveal key={r.action} as="li" delay={i * 0.04}>
              <div className="card p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span aria-hidden className="font-mono text-[0.78rem] font-medium text-cyan-300/80 pt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[1.08rem] font-semibold leading-snug text-sand">{r.action}</h3>
                    <dl className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
                      {([
                        ['Responsible', r.who],
                        ['Expected benefit', r.benefit],
                        ['Evidence', <Sentences key="e" items={r.evidence} />],
                        ['Consideration', r.consideration],
                      ] as const).map(([k, v]) => (
                        <div key={k}>
                          <dt className="mlabel text-mute">{k}</dt>
                          <dd className="mt-1 text-[0.9rem] leading-relaxed text-sand/90">{v}</dd>
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

      <Reveal>
        <div className="mt-12 card p-7 border-cyan-500/30 bg-cyan-500/[0.04]">
          <div className="eyebrow">Position restated</div>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-sand prose-r">{PROJECT.position}</p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ L */
export function References() {
  /* The entry the reader has just jumped to from a citation, if any. A cold load
     of a reference link has nowhere to go back to, so it offers no button. */
  const [back, setBack] = useState<RefKey | null>(null);
  useEffect(() => {
    const onFollow = (e: Event) => setBack((e as CustomEvent<RefFollowed>).detail.key);
    const onPop = () => setBack(k => (k && location.hash === `#ref-${k}` ? k : null));
    window.addEventListener(REF_FOLLOWED, onFollow);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener(REF_FOLLOWED, onFollow);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return (
    <Section id="references" letter="L" label="References"
      title="References"
      lede={`${REFERENCES.length} sources, APA 7. Every URL was opened and checked against the claim it supports. Primary sources are used wherever one exists.`}>
      <p className="t-micro mb-8 max-w-reading">
        Sections B, D, E and F also carry evidence cards beside the claims themselves, showing what
        each source reports and the area it covers. Those are a shortcut for checking a figure. This
        list is the formal citation record.
      </p>
      {/* APA 7 list: unnumbered, alphabetical, hanging indent. The order is
          derived here rather than trusted to the data, so it cannot drift when an
          entry's author changes. [overflow-wrap:anywhere] stops an unbroken URL
          from pushing the page sideways on a phone. tabIndex -1 makes each entry a
          focus target, so a followed citation lands focus here, not at the top. */}
      <ul className="space-y-5 max-w-reading">
        {[...REFERENCES]
          .sort((a, b) => a.author.localeCompare(b.author) || a.year.localeCompare(b.year))
          .map(r => (
          <li key={r.key} id={`ref-${r.key}`} tabIndex={-1}
            className="scroll-mt-28 rounded focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
            <p className="pl-8 -indent-8 text-[0.92rem] leading-relaxed text-sand/92">
              {/* APA 7 closes the author element with a period; initials already supply one. */}
              {r.author.endsWith('.') ? r.author : `${r.author}.`} ({r.year}).{' '}
              {r.part ? r.title : <em className="text-sand">{r.title}</em>}
              {r.container && <>. {r.part ? <em className="text-sand">{r.container}</em> : r.container}</>}.{' '}
              {r.retrieved && <>Retrieved {r.retrieved}, from </>}
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                className="[overflow-wrap:anywhere] text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-300">
                {r.url}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            {r.note && <p className="mt-2 pl-8 text-[0.8rem] leading-relaxed text-mute">{r.note}</p>}
            {back === r.key && (
              <button type="button" onClick={() => history.back()}
                className="mt-2 ml-8 btn btn-g !px-3 !py-1 !text-[0.78rem]">
                Back to the citation
              </button>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
