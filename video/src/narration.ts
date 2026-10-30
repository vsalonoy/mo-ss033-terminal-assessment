/**
 * The narration script. This one file is the source for the voice, the captions,
 * the transcript and the scene timing, so the four cannot disagree.
 *
 * Every factual sentence traces to src/data/research.ts (see `trace`). Nothing here
 * adds evidence the website does not already contain.
 *
 * STATUS: approved by the student on 27 October 2026 (1,072 words); opening revised and approved
 * the same day (Stage A), see narration/APPROVALS.md. All other segments unchanged.
 */

export type SceneKey =
  | 'openTitle' | 'openResearcher' | 'openRoadmap' | 'chapter'
  | 'network' | 'stats' | 'uneven' | 'position'
  | 'five' | 'program' | 'evidence' | 'proposal' | 'why'
  | 'maria' | 'journey' | 'actors'
  | 'successIntro' | 'criterion' | 'successSummary'
  | 'conclusion' | 'credits';

export interface Segment {
  id: string;
  chapter: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  scene: SceneKey;
  /** Passed to the scene, for scenes used more than once. */
  props?: Record<string, unknown>;
  /** What is said. Empty for silent cards. */
  text: string;
  /** Silent scenes only: how long to hold, in seconds. */
  hold?: number;
  /** Where each claim comes from on the website. For the evidence map, not shown. */
  trace?: string;
}

export const CHAPTERS = [
  { n: 1, title: 'Globalization and the problem' },
  { n: 2, title: 'Determining the solution' },
  { n: 3, title: 'How the proposed solution works' },
  { n: 4, title: 'Evaluating success' },
  { n: 5, title: 'Conclusion' },
] as const;

export const SEGMENTS: Segment[] = [
  /* Opening, approved 27 Oct 2026 (Stage A): replaces the former title card and
     full-screen AI disclosure. The AI-narration label is shown on screen in o1-o2
     and the full acknowledgment is in the credits. */
  { id: 'o1', chapter: 0, scene: 'openTitle',
    text: 'Technology is changing the way people work around the world, and the Philippines is no exception. As automation and artificial intelligence become more common, Filipino workers face both new opportunities and challenges.',
    trace: 'Framing; A: GLOBALIZATION, PROJECT.position (opportunities and challenges)' },
  { id: 'o2', chapter: 0, scene: 'openResearcher',
    text: 'I\u2019m Vanessa Salonoy, and this research examines how workplace automation affects Filipino workers, compares five possible responses, and evaluates one proposed solution to help workers transition into new roles.',
    trace: 'Structure of the research: B, D, E, F' },
  { id: 'o3', chapter: 0, scene: 'openRoadmap',
    text: 'Through published evidence, a worked example and measurable criteria, I\u2019ll explain why career conversion deserves consideration and how its success could be evaluated in the Philippines.',
    trace: 'Structure: E (evidence), G (Maria, hypothetical), H and I (criteria)' },

  { id: 'c1', chapter: 1, scene: 'chapter', props: { n: 1 }, text: '', hold: 1.5 },
  { id: 's11', chapter: 1, scene: 'network',
    text: 'My research looks at technology as a driver of globalization, reaching Filipino workers through the global trade in services. The IT and business process management industry, or IT-BPM, has helped make the Philippines a global outsourcing hub, and international clients increasingly expect providers to use AI to cut costs and raise productivity.',
    trace: 'A: GLOBALIZATION[0,1,2], GLOBAL_NETWORK (khan2026, malaya2025)' },
  { id: 's12', chapter: 1, scene: 'stats',
    text: 'An International Labour Organization study estimates that 12.7 million Filipino workers, more than a quarter of employment, are in occupations exposed to generative AI. Exposure means some tasks could be automated, not that the job is lost. Only 3.6 percent of jobs fall in the highest displacement risk category.',
    trace: 'B: EVIDENCE.e1, HEADLINE_STATS[0,1], GLOBALIZATION[5] (huynh2026)' },
  { id: 's13', chapter: 1, scene: 'uneven',
    text: 'The change is also uneven. Women face roughly double the exposure of men, young workers are more often in occupations at greater displacement risk, and around two in five jobs in the National Capital Region are exposed. And while training is funded, I found no scheme that replaces a mid-career worker’s income while they retrain.',
    trace: 'B: EXPOSURE_NOTES (huynh2026); F: PROPOSAL.gap.missing[2] ("No existing scheme replaces income during a mid-career transition")' },
  { id: 's14', chapter: 1, scene: 'position',
    text: 'So my position is that automation should continue, but with support built into the transition, not offered after workers have already lost ground.',
    trace: 'A: PROJECT.position (shortened)' },

  { id: 'c2', chapter: 2, scene: 'chapter', props: { n: 2 }, text: '', hold: 1.5 },
  { id: 's21', chapter: 2, scene: 'five',
    text: 'To find a response, I compared five alternatives: two Philippine programmes, national reskilling and JobStart, and three from Singapore: job redesign, training credits and place-and-train career conversion. At this Determining Solution stage, I judged each one on four criteria I selected: sustainability, impact, feasibility and effectiveness. I placed the greatest emphasis on effectiveness in my final judgement, because my question is whether workers are actually supported, although I did not assign numerical weights or scores.',
    trace: 'D: SOLUTIONS, CRITERIA, CRITERIA_PROVENANCE; E: section lede (effectiveness weighted most)' },
  { id: 's25', chapter: 2, scene: 'why',
    text: 'Place-and-train career conversion ranked first. It is the only alternative with a published control-group evaluation, and the only one that keeps workers earning while their role changes. Its limitation here is feasibility, because I found no Philippine funding line for conversion. National reskilling ranked second: the most feasible starting point, but with no published results yet. JobStart ranked third because it only serves 18 to 24 year olds with less than a year of work experience. Job redesign and training credits ranked lower, mainly on feasibility. For these four, effectiveness is not shown, which means I found no published outcome evaluation, not that they failed.',
    trace: 'D, E: SOLUTIONS[*].criteria, rankWhy; RANKING_NOTE; K: CONCLUSION[1] (mti2025, malaya2025, ra11962, ra10869, wsg, moe2025)' },
  { id: 's22', chapter: 2, scene: 'program',
    text: 'Three things must stay separate. Singapore’s existing programme hires a jobseeker into a new growth role first, then trains them on the job or through industry-recognised training.',
    trace: 'D: SOLUTIONS[s3].what (mti2025)' },
  { id: 's23', chapter: 2, scene: 'evidence',
    text: 'Its published evaluation found that, compared with control groups, participants earned 2.5 percent more in the placement year and 5.8 to 6.5 percent more over the next four years, with retention 3.9 percentage points higher. These are Singapore results only.',
    trace: 'E: EVIDENCE.e6, SG_WAGE_TRAJECTORY, SG_OUTCOMES, SG_CAVEAT (mti2025)' },
  { id: 's24', chapter: 2, scene: 'proposal',
    text: 'My proposal is a Philippine adaptation of that model, which does not exist yet.',
    trace: 'F: PROPOSAL.claim' },


  { id: 'c3', chapter: 3, scene: 'chapter', props: { n: 3 }, text: '', hold: 1.5 },
  { id: 's31', chapter: 3, scene: 'maria',
    text: 'Here is how it would work for Maria, a hypothetical contact centre agent. Parts of her role are automated, but her job is not removed.',
    trace: 'G: JOURNEY[0], JOURNEY_CAVEAT (huynh2026)' },
  { id: 's32', chapter: 3, scene: 'journey',
    text: 'Her employer refers her to the local Public Employment Service Office, or PESO, which assesses her against roles in demand. A participating employer then hires her into a new role before she is fully trained, and trains her, alone or with a training provider, under Republic Act 12063, the enterprise-based training law, which already covers employed workers. A proposed training allowance would keep her earning, and her completion, retention and wage change would be recorded.',
    trace: 'G: JOURNEY[1..5] (dole, mti2025, ra12063, ra10869); F: PATHWAY' },
  { id: 's33', chapter: 3, scene: 'actors',
    text: 'The Department of Labor and Employment and the PESOs would deliver the track, TESDA would register the training, and the ICT department and the IT-BPM industry association would identify growth roles. None of them has been approached, and no budget has been allocated.',
    trace: 'F: PROPOSAL.adaptation[6], PROPOSAL.proposed[4], IMPL_ACTORS, IMPL_CAVEAT' },

  { id: 'c4', chapter: 4, scene: 'chapter', props: { n: 4 }, text: '', hold: 1.5 },
  { id: 's40', chapter: 4, scene: 'successIntro',
    text: 'Now the most important question: how success would be evaluated. The four Evaluating Success criteria share their names with my comparison criteria, but here they test my own proposal. Every target I mention is a planning target I set, not a result.',
    trace: 'I: lede, caveat; H: SMART_CAVEAT' },
  { id: 's41', chapter: 4, scene: 'criterion', props: { i: 0 },
    text: 'Sustainability asks whether the solution could stay viable and keep benefiting workers. I rate it moderate to high, because it would run on existing systems: the enterprise-based training law and the PESOs that deliver JobStart. The weakness is funding, as the 740 million peso IT-BPM commitment covers only three years. My SMART indicators do not include a dedicated sustainability measure. Retention at twelve months is only a proxy for lasting outcomes, so continued funding and employer participation would be judged qualitatively.',
    trace: 'I: PROPOSAL_CRITERIA[0] incl. assess (ra12063, ra10869, malaya2025); J: RISKS Funding' },
  { id: 's42', chapter: 4, scene: 'criterion', props: { i: 1 },
    text: 'Impact asks what workers would gain. I rate it high in principle, but narrow at first: workers keep an income while they convert. It would be assessed by wage change, with no real wage decrease for at least 80 percent of completers, by whether places reach the most exposed groups, and by a worker survey setting a first baseline. But a first cohort would reach only a small fraction of the 12.7 million exposed workers.',
    trace: 'I: PROPOSAL_CRITERIA[1] incl. assess; H: SMART m3, m5, m6 (huynh2026)' },
  { id: 's43', chapter: 4, scene: 'criterion', props: { i: 2 },
    text: 'Feasibility asks what implementation would need in the Philippines. I rate it moderate. Employed workers are already eligible for enterprise-based training, and employers with registered programmes can claim an additional tax deduction. Still missing are an income-support rule for mid-career trainees and a way to match displaced workers to new roles. Employer participation would be the test, with a target of 30 firms in the first year, because the model depends on employers hiring first, and none has agreed to that yet.',
    trace: 'I: PROPOSAL_CRITERIA[2] incl. assess; F: EVIDENCE.e8, e9 (ra12063); H: SMART m4' },
  { id: 's44', chapter: 4, scene: 'criterion', props: { i: 3 },
    text: 'Effectiveness asks whether the programme would achieve its intended outcomes. It is not yet shown here, because the gains so far are Singapore results. A Philippine pilot would be judged against its own targets: 75 percent of a first cohort completing the cycle, 70 percent still in the new role six months after completing it, and wage change against previous pay. Completion is not employment, and with no Philippine baseline, the first cohort would set one.',
    trace: 'I: PROPOSAL_CRITERIA[3] incl. assess; H: SMART m1, m2, m3 (mti2025)' },
  { id: 's45', chapter: 4, scene: 'successSummary',
    text: 'In short, effectiveness and impact have direct indicators, feasibility has one, and sustainability is assessed qualitatively, with one proxy.',
    trace: 'I: PROPOSAL_CRITERIA[*].assess kinds' },

  { id: 'c5', chapter: 5, scene: 'chapter', props: { n: 5 }, text: '', hold: 1.5 },
  { id: 's51', chapter: 5, scene: 'conclusion',
    text: 'To conclude, automation is changing Filipino jobs more than removing them, but unevenly. I selected a Philippine adaptation of Singapore’s place-and-train model because it has the strongest evidence of the five and keeps workers earning while they retrain. It would build on the training laws, employer incentives and employment offices the Philippines already has, adding what I did not find: employer-linked career conversion with income support for mid-career workers. Its success would be judged against the four criteria and the SMART measures, not assumed.',
    trace: 'K: CONCLUSION[0..2] (huynh2026, mti2025, ra12063); E: RANKED; F: PROPOSAL.gap (missing, haveLegal, haveOps)' },
  { id: 's60', chapter: 6, scene: 'credits',
    text: 'The full research, its sources and its limitations are on the website.', hold: 7 },
];

/**
 * Split a segment into sentences. A full stop inside a number (2.5) or after a
 * single capital (an initial) is not a sentence end.
 */
export function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
}

export const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;
