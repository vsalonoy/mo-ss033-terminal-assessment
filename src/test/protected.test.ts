import { describe, expect, it } from 'vitest';
import baseline from './fixtures/protected-baseline.json';
import { protectedContent } from './protected';
import { CRITERIA, RANKED, REFERENCES, RISKS, SMART, SOLUTIONS, refMap } from '../data/research';

/* The fixture was written once, from research.ts as it stood before Stage B
   (28 October 2026, SHA-256 abfb32db...). It is never regenerated to make a test
   pass: a difference here means protected content changed. */
/* Stage C correction A-02 (approved): three section F passages now refer back to the
   legal basis instead of restating RA 12063. None is rendered by the video. They are
   left out on both sides of the comparison; everything else in PROPOSAL still has to
   match the baseline exactly. */
type Content = ReturnType<typeof protectedContent>;
const withoutApprovedEdits = (c: Content): Content => ({
  ...c,
  proposal: {
    ...c.proposal,
    adaptation: c.proposal.adaptation.map(a =>
      a.k === 'Who it is for' || a.k === 'Employer incentive' ? { ...a, v: '[A-02]' } : a),
    financial: c.proposal.financial.map((f, i) => (i === 1 ? '[A-02]' : f)),
  },
});

describe('protected academic content', () => {
  it('matches the pre-Stage B baseline, including every field the v4 video renders', () => {
    const now = JSON.parse(JSON.stringify(protectedContent())) as Content;
    expect(withoutApprovedEdits(now)).toEqual(withoutApprovedEdits(baseline as unknown as Content));
  });

  it('keeps five solutions, 20 ratings and place-and-train ranked first', () => {
    expect(SOLUTIONS).toHaveLength(5);
    expect(CRITERIA.map(c => c.label)).toEqual(['Sustainability', 'Impact', 'Feasibility', 'Effectiveness']);
    const ratings = SOLUTIONS.flatMap(s => CRITERIA.map(c => s.criteria[c.key].r));
    expect(ratings).toHaveLength(20);
    expect(ratings.every(Boolean)).toBe(true);
    expect(RANKED.map(s => s.short)).toEqual(
      ['Place-and-train', 'National reskilling', 'JobStart PH', 'Job redesign', 'Training credit']);
    expect(RANKED[0].name).toBe('Place-and-train career conversion');
  });

  it('keeps six SMART indicators, six risks and 18 references', () => {
    expect(SMART.map(m => m.id)).toEqual(['m1', 'm2', 'm3', 'm4', 'm5', 'm6']);
    expect(RISKS).toHaveLength(6);
    expect(REFERENCES).toHaveLength(18);
    expect(Object.keys(refMap)).toHaveLength(18);
  });
});
