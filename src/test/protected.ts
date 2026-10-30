/**
 * Protected academic content: everything Stage B must not change.
 *
 * Two groups, both compared against a fixture captured from research.ts before
 * any Stage B edit (src/test/fixtures/protected-baseline.json):
 *
 * 1. Research decisions: the five solutions, the 20 ratings, the ranking, the six
 *    SMART indicators, every headline figure, the risks and the references.
 * 2. Every field the v4 video renders from research.ts and media.ts (see
 *    video/src/scenes.tsx and charts.tsx). The video is already rendered, so the
 *    site must keep saying exactly what the video says.
 *
 * Strings changed by an approved correction are deliberately left out, and each
 * omission names the correction: CC-1/CC-2 (RANKING_NOTE, rankWhy), CC-4 (blurbs),
 * CC-5/CC-6 (assessment row text), CC-6 (m5 target and baseline), CC-9 (stat 3
 * detail), CC-10 and the JobStart caution (criteria reasons). Ratings stay in.
 * Stage C's A-02 edits to three PROPOSAL passages are masked in protected.test.ts.
 */
import {
  CRITERIA, EBET_DEDUCTION, EXPOSURE_BY_REGION, EXPOSURE_NOTES, EXPOSURE_VS_ASEAN, GLOBAL_NETWORK,
  HEADLINE_STATS, IMPL_ACTORS, IMPL_STAGES, JOURNEY, PROJECT, PROPOSAL, PROPOSAL_CRITERIA, RANKED,
  REFERENCES, RISKS, SG_OUTCOMES, SG_WAGE_TRAJECTORY, SMART, SOLUTIONS, ASSESS_KIND_LABEL,
} from '../data/research';
import { MEDIA, type Media } from '../data/media';

const pick = <T extends object, K extends keyof T>(o: T, keys: K[]) =>
  Object.fromEntries(keys.map(k => [k, o[k]])) as Pick<T, K>;

export function protectedContent() {
  return {
    project: pick(PROJECT, ['course', 'assessment', 'title', 'titleSub', 'section', 'mentor', 'position']),
    criteria: CRITERIA.map(c => pick(c, ['key', 'label'])),
    solutions: SOLUTIONS.map(s => ({
      ...pick(s, ['id', 'rank', 'name', 'short', 'where', 'what', 'who', 'status', 'targetPopulation', 'detail', 'ref']),
      ratings: Object.fromEntries(CRITERIA.map(c => [c.key, s.criteria[c.key].r])),
    })),
    ranking: RANKED.map(s => s.id),
    smart: SMART.map(m => m.id === 'm5'
      ? (({ target: _t, baseline: _b, ...rest }) => rest)(m)
      : m),
    proposal: PROPOSAL,
    proposalCriteria: PROPOSAL_CRITERIA.map(c => ({
      ...pick(c, ['label', 'verdict', 'body']),
      kinds: c.assess.map(a => a.kind),
    })),
    assessKindLabel: ASSESS_KIND_LABEL,
    headlineStats: HEADLINE_STATS.map((s, i) => i === 2 ? (({ detail: _d, ...rest }) => rest)(s) : s),
    exposureByRegion: EXPOSURE_BY_REGION,
    exposureNotes: EXPOSURE_NOTES,
    exposureVsAsean: EXPOSURE_VS_ASEAN,
    globalNetwork: GLOBAL_NETWORK,
    sgOutcomes: SG_OUTCOMES,
    sgWageTrajectory: SG_WAGE_TRAJECTORY,
    ebet: EBET_DEDUCTION,
    journey: JOURNEY,
    implStages: IMPL_STAGES,
    implActors: IMPL_ACTORS,
    risks: RISKS,
    references: REFERENCES,
    /* The three site photographs the video also shows, with their credits. */
    media: Object.fromEntries((['hero', 'itPark', 'tesda', 'lab'] as const).map(k => [k,
      pick(MEDIA[k] as Media, ['title', 'creator', 'license', 'licenseUrl', 'source', 'adapted', 'width', 'height'])])),
  };
}
