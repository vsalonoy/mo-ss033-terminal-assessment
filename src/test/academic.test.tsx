import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';
import {
  CRITERIA, CRITERIA_PROVENANCE, EVIDENCE, HEADLINE_STATS, IMPACT_NEGATIVES, PROJECT, PROPOSAL, PROPOSAL_CRITERIA, RANKING_NOTE,
  REFERENCES, SMART, SOLUTIONS, SOURCE_EVALUATION, SOURCE_TYPE,
} from '../data/research';
import { SEGMENTS } from '../../video/src/narration';

/*
 * Stage B academic corrections (CC-1 to CC-6, CC-9, CC-10, the JobStart caution)
 * and the researcher introduction (D-1). Each correction is checked in both
 * directions: the approved wording is present and the wording it replaced is gone.
 */

const page = () => { render(<App />); return document.body.textContent ?? ''; };
const sol = (id: string) => SOLUTIONS.find(s => s.id === id)!;
const m5 = SMART.find(m => m.id === 'm5')!;

describe('ILO evidence (CC-9)', () => {
  it('never presents the July 2026 employment figure as the base of the ILO estimate', () => {
    const text = page();
    expect(text).not.toMatch(/base the exposure share/);
    expect(text).not.toMatch(/employment base the exposure figure/);
    expect(text).not.toMatch(/reported only as more than one quarter/);
  });

  it('states the Q1 2024 Labour Force Survey basis of the 12.7 million and 27.7 percent estimate', () => {
    const e4 = EVIDENCE.find(e => e.id === 'e4')!;
    expect(e4.finding).toBe('Employment rose to 49.21 million as underemployment declined.');
    expect(e4.note?.t).toMatch(/27\.7 percent of employment or 12\.7 million workers, was calculated on Labour Force Survey data for the first quarter of 2024, so 12\.7 million should not be divided by 49\.21 million/);
    expect(e4.note?.refs).toEqual(['huynh2026']);
    expect(HEADLINE_STATS[2].detail).toMatch(/first-quarter 2024 data, so the two figures are not directly comparable/);
  });

  it('explains the chart: different studies and periods, and a floor that understates', () => {
    const text = page();
    expect(text).toMatch(/The two figures come from different ILO studies and periods: 22\.9 percent for ASEAN in\s+2025, and for the Philippines 27\.7 percent of employment in the first quarter of 2024\./);
    expect(text).toMatch(/so it understates rather than overstates the\s+estimate/);
  });

  it('keeps exposure distinct from displacement and the 3.6 percent category intact', () => {
    expect(HEADLINE_STATS[1].label).toBe('of jobs fall in the highest displacement risk category');
    expect(HEADLINE_STATS[1].detail).toMatch(/It is not the same as a job being replaced/);
  });
});

describe('Determining Solution criteria (CC-1, CC-2, CC-4)', () => {
  it('explains why sustainability replaced acceptability, without claiming mentor approval', () => {
    expect(CRITERIA_PROVENANCE).toMatch(/^These are four of the five class Determining Solution criteria/);
    expect(CRITERIA_PROVENANCE).toMatch(/I did not rank on the fifth, acceptability, because worker acceptance is unmeasured/);
    expect(CRITERIA_PROVENANCE).toMatch(/I used sustainability in its place because some of the alternatives rest on time-bounded funding/);
    expect(`${CRITERIA_PROVENANCE} ${RANKING_NOTE}`).not.toMatch(/mentor|Ms\. Bella|approved/i);
  });

  it('records the Milestone 2 history correctly', () => {
    expect(RANKING_NOTE).toMatch(/^Milestone 2 compared three of these alternatives \(place-and-train conversion, national reskilling and job redesign\)/);
    expect(RANKING_NOTE).toMatch(/JobStart and the portable training credit were added for this assessment\./);
    expect(RANKING_NOTE).not.toMatch(/two added solutions/);
    expect(RANKING_NOTE).not.toMatch(/Terminal Assessment criteria/);
  });

  it('explains rank 2 against rank 3 by reach, and no longer claims two "highest" ratings', () => {
    expect(RANKING_NOTE).toMatch(/I ranked reskilling above it because of who each can reach/);
    expect(sol('s1').rankWhy).toMatch(/^It is joint highest of the five on feasibility, with JobStart,/);
    expect(sol('s4').rankWhy).toMatch(/^Rates high on sustainability and feasibility/);
  });

  it('uses the class workbook definitions', () => {
    expect(CRITERIA.map(c => c.blurb)).toEqual([
      'Can it keep working over time without exhausting resources or creating new problems, and who would maintain it?',
      'What difference could it make for the people affected: who, how many, and is anyone harmed or left out?',
      'Could it realistically be carried out here, with the time, people, skills, resources and permissions available in the Philippines?',
      'Do studies or real examples show it has addressed a similar problem, and does it target the main cause?',
    ]);
  });
});

describe('evidence statements (CC-10, JobStart)', () => {
  it('does not claim the Singapore evaluation measured moves out of service, sales and clerical roles', () => {
    const why = sol('s3').criteria.impact.why;
    expect(why).not.toMatch(/designed to move people out of/);
    expect(why).toMatch(/stronger effects for non-PMET and mature workers/);
    expect(sol('s3').criteria.impact.r).toBe('High');
  });

  it('does not assert an unverified standing appropriation for JobStart', () => {
    expect(JSON.stringify(SOLUTIONS)).not.toMatch(/standing appropriation/);
    expect(sol('s4').criteria.sustainability.r).toBe('High');
  });
});

describe('Evaluating Success (CC-5, CC-6)', () => {
  it('adds a sustainability review point as a proposal, not a new indicator', () => {
    const q = PROPOSAL_CRITERIA[0].assess.find(a => a.kind === 'qualitative')!;
    expect(q.t).toMatch(/Proposed review point: at the end of the second year of the commitment, the Bureau of Local Employment would record/);
    expect(SMART).toHaveLength(6);
  });

  it('reports reach beside within-group exposure rates instead of equating the two', () => {
    expect(m5.target).not.toMatch(/at least match/);
    expect(m5.target).toMatch(/set beside that group’s exposure rate in the ILO brief/);
    expect(m5.baseline).toMatch(/rates within each group, not each group’s share of exposed workers/);
    const row = PROPOSAL_CRITERIA[1].assess.find(a => a.t.startsWith('Reach into exposed groups'))!;
    expect(row.kind).toBe('indicator');
    expect(row.t).not.toMatch(/at least matching/);
  });
});

describe('Evaluating Information (CC-3)', () => {
  it('names the four class criteria in section L', () => {
    render(<App />);
    const l = document.getElementById('references')!;
    expect(within(l).getByRole('heading', { name: 'How I evaluated my sources' })).toBeInTheDocument();
    expect(SOURCE_EVALUATION.map(c => c.criterion)).toEqual(['Authority', 'Accuracy', 'Relevance', 'Purpose']);
    for (const c of SOURCE_EVALUATION) expect(l.textContent).toContain(c.t);
  });

  it('gives every reference a source type', () => {
    for (const r of REFERENCES) expect(SOURCE_TYPE[r.key]).toBeTruthy();
    expect(Object.keys(SOURCE_TYPE)).toHaveLength(REFERENCES.length);
  });
});

describe('researcher introduction (D-1, D-2)', () => {
  const narration = (id: string) => SEGMENTS.find(s => s.id === id)!.text;

  it('is the approved narration, o1 then o2, word for word', () => {
    expect(PROJECT.introduction).toEqual([narration('o1'), narration('o2')]);
  });

  it('appears once, in the researcher card, with the identity block', () => {
    render(<App />);
    const card = document.getElementById('researcher-name')!.closest('section')!;
    for (const t of ['Vanessa R. A. Salonoy', 'MO-SS033 The Contemporary World', 'Section H1103', 'Mapúa Malayan Digital College', 'Ms. Bella Joy Bardolas'])
      expect(card.textContent).toContain(t);
    const text = document.body.textContent!;
    expect(text.split(narration('o2')).length - 1).toBe(1);
    expect(text).not.toMatch(/I chose this issue because/);
  });

  it('keeps one h1, the research title', () => {
    render(<App />);
    const h1 = document.querySelectorAll('h1');
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toContain(`${PROJECT.title}: ${PROJECT.titleSub}`);
  });
});

describe('Stage C corrections A-01 and A-02', () => {
  it('A-01: the Impact limitation speaks of ILO exposure rates, not shares', () => {
    const row = PROPOSAL_CRITERIA[1].assess.find(a => a.kind === 'limitation')!;
    expect(row.t).toBe('ILO exposure rates are a reference point, not demand for places, and a first cohort would reach only a small fraction of exposed workers.');
    expect(JSON.stringify(PROPOSAL_CRITERIA)).not.toMatch(/[Ee]xposure shares/);
  });

  it('A-02: section F states the RA 12063 provisions once and refers back, keeping every citation', () => {
    const who = PROPOSAL.adaptation.find(a => a.k === 'Who it is for')!;
    const inc = PROPOSAL.adaptation.find(a => a.k === 'Employer incentive')!;
    expect(who.v).toMatch(/\(see Legal basis in place, above\)/);
    expect(inc.v).toMatch(/^The Section 20 training-expense deduction \(see Machinery in place, above\)/);
    expect(who.ref).toEqual(['ra12063', 'ra10869']);
    expect(inc.ref).toEqual(['ra12063', 'dole']);
    /* The full provisions stay at their home. */
    expect(PROPOSAL.gap.haveLegal.find(x => x.t === 'RA 12063, EBET Framework Act')!.d).toMatch(/Section 6 makes both new labour force entrants and employed workers eligible/);
    expect(PROPOSAL.gap.haveOps.find(x => x.t === 'Employer incentive already legislated')!.d).toMatch(/^RA 12063 Section 20 gives an additional deduction of 50 percent .* 31 December 2027, rising to 75 percent from 1 January 2028, capped/);
    /* No suggestion that the Act funds the proposed track. */
    const sentences = JSON.stringify(PROPOSAL).split(/"|\.\s/);
    expect(sentences.filter(t => /RA 12063|Section 20|EBET/.test(t) && /\bfunds?\b|funding the|pays? for/i.test(t))).toEqual([]);
  });
});

describe('reviewer guidance (D-4)', () => {
  it('replaces the feedback form with static guidance and sends nothing anywhere', () => {
    render(<App />);
    const panel = document.getElementById('mentor-feedback')!;
    expect(panel).toHaveTextContent(/through CAMU or the method Ms\. Bella Joy Bardolas designated/);
    expect(panel.querySelector('form, input, textarea, button')).toBeNull();
    expect(document.querySelector('form')).toBeNull();
  });
});

describe('30 October corrections 1, 3 and 4', () => {
  it('1: lists the Asian Development Bank years in date order in section B', () => {
    render(<App />);
    const b = document.getElementById('challenge')!.textContent!;
    expect(b).toContain('(Asian Development Bank, 2020, 2021)');
    expect(b).not.toContain('2021, 2020');
  });

  it('3: the researcher card reads "Research by" and keeps the identity block', () => {
    render(<App />);
    const name = document.getElementById('researcher-name')!;
    expect(name).toHaveTextContent(/^Research by Vanessa R\. A\. Salonoy$/);
    expect(name.closest('section')).toHaveAccessibleName('Research by Vanessa R. A. Salonoy');
  });

  it('4: Impact names the negative changes as prospective risks, outside the rows the video shows', () => {
    expect(IMPACT_NEGATIVES.lead).toMatch(/None has been observed, because the track has not run/);
    expect(IMPACT_NEGATIVES.lead).toMatch(/prospective risks to monitor, not findings/);
    /* Each points at an existing indicator, or at none; no new figure is introduced. */
    for (const n of IMPACT_NEGATIVES.items) if (n.watch) expect(SMART.map(m => m.id)).toContain(n.watch);
    expect(IMPACT_NEGATIVES.items.map(n => n.watch)).toEqual(['m1', 'm3', 'm5', undefined, undefined]);
    const prose = [IMPACT_NEGATIVES.lead, ...IMPACT_NEGATIVES.items.flatMap(n => [n.risk, n.how])].join(' ');
    expect(prose.match(/\d+/g)).toEqual(['12063']);
    /* The protected Impact rows are untouched. */
    expect(PROPOSAL_CRITERIA[1].assess.map(a => a.kind)).toEqual(['indicator', 'indicator', 'baseline', 'limitation']);
    expect(SMART).toHaveLength(6);
    expect(SMART.map(m => m.target)).toEqual([
      '75 percent of a first cohort', '70 percent at six months',
      'No real wage decrease for at least 80 percent of completers', '30 participating firms in a first cohort',
      m5.target, 'Establish a baseline in the first cohort rather than set a pass mark',
    ]);
  });

  it('4: section I shows the list in the Impact card only', () => {
    render(<App />);
    const toggles = screen.getAllByRole('button', { name: /Negative changes to watch for \(5\)/ });
    expect(toggles).toHaveLength(1);
    fireEvent.click(toggles[0]);
    const card = toggles[0].closest('.card')!.parentElement!;
    expect(within(card).getByRole('heading', { level: 3 })).toHaveTextContent('Impact');
    expect(card).toHaveTextContent(/Shown by M1 Conversion completion/);
    expect(card).toHaveTextContent(/No indicator/);
  });
});
