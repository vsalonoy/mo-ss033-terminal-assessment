/**
 * Presentation data for the Stage E redesign: how the twelve research sections are
 * grouped into the five Explore chapters, the Home highlights, and the pathway's
 * split between what is already in place and what is proposed.
 *
 * Nothing here is new research. Every sentence restates a claim already made in
 * research.ts, with the same sources, and docs/STAGE-E-CONTENT-REGISTER.md records
 * which field each one comes from. The protected content in research.ts is not
 * touched.
 */
import type { RefKey, Sentence } from './research';
import { MEDIA, type Media } from './media';

export interface ExploreChapter {
  n: number;
  id: string;
  title: string;
  /** The question the chapter answers, as a visitor would ask it. */
  question: string;
  /** One finding, in a sentence or two, with its sources. */
  finding: Sentence[];
  /** Research sections in the chapter, by letter. Anchors are unchanged. */
  letters: string;
  /** The matching chapter of the video (src/data/video.ts). */
  video: number;
  photo: Media;
}

export const EXPLORE_CHAPTERS: ExploreChapter[] = [
  { n: 1, id: 'chapter-1', title: 'The issue', letters: 'ABC', video: 1, photo: MEDIA.itPark,
    question: 'How is automation reaching Filipino workers, and who is affected?',
    /* PROJECT.position; CONCLUSION paragraph 1. */
    finding: [{ t: 'Automation is changing Filipino jobs more than it is removing them, but the change is not landing evenly: exposure is concentrated in IT-BPM, in roles held by women and young workers, and in NCR and nearby regions', refs: ['huynh2026'] }] },
  { n: 2, id: 'chapter-2', title: 'Determining the solution', letters: 'DE', video: 2, photo: MEDIA.lab,
    question: 'Which of five existing programmes best supports workers whose roles are changing?',
    /* CONCLUSION paragraph 2. */
    finding: [{ t: 'Place-and-train career conversion ranks first of the five: it is the only one with a published control-group evaluation, and the only one that keeps a worker earning while the role changes', refs: ['mti2025'] }] },
  { n: 3, id: 'chapter-3', title: 'The proposal', letters: 'FG', video: 3, photo: MEDIA.tesda,
    question: 'What would a Philippine version look like, and what is already here?',
    /* CONCLUSION paragraph 3; PROPOSAL.claim. */
    finding: [
      { t: 'RA 12063 already makes employed workers eligible for enterprise-based training and gives employers a legislated deduction for the cost', refs: ['ra12063'] },
      { t: 'What is still missing is income support during a mid-career transition and a matching function for displaced workers, and that is the gap the proposed track tries to close' },
    ] },
  { n: 4, id: 'chapter-4', title: 'Evaluating success', letters: 'HI', video: 4, photo: MEDIA.peso,
    question: 'How would anyone know whether the track worked?',
    /* SMART_CAVEAT; PROPOSAL_CRITERIA (sustainability gap). */
    finding: [{ t: 'Six proposed SMART indicators would judge the track against the four Evaluating Success criteria. Every target is a planning target, not a measured result, and sustainability has no dedicated indicator' }] },
  { n: 5, id: 'chapter-5', title: 'Limits and conclusion', letters: 'JK', video: 5, photo: MEDIA.eastwood,
    question: 'What could stop it, and what follows from the evidence?',
    /* Limitations list (J); RISKS evidence transfer. */
    finding: [{ t: 'The strongest effectiveness evidence is from Singapore, so the Philippine version should be treated as a pilot to be measured, not a promise', refs: ['mti2025'] }] },
];

/** The chapter a section letter belongs to. L (references) belongs to none: it is Sources. */
export const chapterOf = (letter: string) => EXPLORE_CHAPTERS.find(c => c.letters.includes(letter));

/* ---------------------------------------------------------------- Home */

/** The recommendation, stated on arrival. CONCLUSION paragraph 2; PROPOSAL.claim. */
export const HOME_RECOMMENDATION = {
  lead: 'Recommended: a Philippine place-and-train career conversion track.',
  body: [
    { t: 'Place-and-train ranked first of five alternatives because it is the only one with a published control-group evaluation, carried out in Singapore, and the only one that keeps a worker earning while the role changes', refs: ['mti2025'] as RefKey[] },
    { t: 'The Philippine track is a proposal: no agency or employer has agreed to it' },
  ] as Sentence[],
};

/**
 * Two of the Home highlights restate HEADLINE_STATS 0 and 1, which stay unchanged;
 * this adds the reference period the ILO estimate rests on (EVIDENCE e4 note, CC-9).
 */
export const EXPOSURE_PERIOD: Sentence = {
  t: 'ILO estimate, 27.7 percent of employment, calculated on Labour Force Survey data for the first quarter of 2024', refs: ['huynh2026'],
};

/** The third highlight: the comparative evidence advantage of the recommended option. */
export const EVIDENCE_HIGHLIGHT = {
  value: '1 of 5',
  label: 'alternatives with a published control-group evaluation',
  detail: 'Place-and-train career conversion, evaluated in Singapore. It shows what the model did there, not what it would do here.',
  ref: ['mti2025'] as RefKey[],
};

/* ------------------------------------------------------------ pathway (F) */

/**
 * For each of the five parts of the proposed track (PATHWAY in research.ts): what
 * already exists in law or in a running programme, and what this proposal would
 * add. Drawn from PROPOSAL.gap, PROPOSAL.adaptation, IMPL_ACTORS, EVIDENCE e11 and
 * the recommendations. An empty `inPlace` says so plainly rather than stretching an
 * existing provision to fit.
 */
export const PATHWAY_STATUS: Record<number, { inPlace: Sentence[]; none?: string; proposed: Sentence[] }> = {
  1: {
    inPlace: [],
    /* PROPOSAL.gap.missing. */
    none: 'I found no agency that matches an automation-displaced worker to a conversion role.',
    proposed: [
      { t: 'Employers automating roles would refer the workers affected' },
    ] },
  2: {
    inPlace: [
      { t: 'PESOs already run JobStart intake, assessment and monthly monitoring at local level', refs: ['dole', 'ra10869'] },
      { t: 'JobStart eligibility is restricted to ages 18 to 24 with under a year of work experience', refs: ['ra10869'] },
    ],
    proposed: [
      { t: 'PESOs would assess workers referred by automating employers and match them to conversion roles' },
    ] },
  3: {
    inPlace: [
      { t: 'Under RA 12063 an employer may deliver enterprise-based training alone or with a technical-vocational institution', refs: ['ra12063'] },
    ],
    proposed: [
      { t: 'A participating employer hires into the converted role before training is complete, as in Singapore’s place-and-train model', refs: ['mti2025'] },
      { t: 'No employer has agreed to this' },
    ] },
  4: {
    inPlace: [
      { t: 'Section 6 makes employed workers eligible for enterprise-based training, and Section 20 gives employers an additional deduction on training expenses', refs: ['ra12063'] },
    ],
    proposed: [
      { t: 'A training allowance and stipend on the JobStart pattern, set for this group', refs: ['dole'] },
      { t: 'No existing scheme replaces income during a mid-career transition, and the deduction covers training expenses, not wages during conversion' },
    ] },
  5: {
    inPlace: [
      { t: 'JobStart already requires PESO monthly monitoring reports', refs: ['dole', 'ra10869'] },
    ],
    proposed: [
      { t: 'Completion, six-month retention and wage change, recorded against the six proposed SMART indicators in section H' },
    ] },
};

/** Funding, stated once beside the pathway. PROPOSAL.adaptation (Funding source); PROPOSAL.proposed; PROPOSAL.gap.missing. */
export const PATHWAY_FUNDING: Sentence[] = [
  { t: 'Proposed funding: the existing IT-BPM reskilling commitment, at least for a first cohort', refs: ['malaya2025'] },
  { t: 'I found no Philippine funding line for career conversion itself, and no budget is allocated to this track' },
];
