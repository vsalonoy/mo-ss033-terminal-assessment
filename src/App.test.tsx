import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import * as research from './data/research';
import { PROJECT, REFERENCES, SECTIONS, refMap } from './data/research';

/*
 * Regression checks on the approved academic content: the twelve sections, the
 * research identity, and the reference list. They guard against content being
 * lost or reordered by later changes. They do not judge the content itself.
 */

const SECTION_IDS = [
  'intro', 'challenge', 'stakeholders', 'solutions', 'ranking', 'proposal',
  'journey', 'smart', 'criteria', 'risks', 'conclusion', 'references',
];

/* Every RefKey cited anywhere in the research data, from `ref` and `refs` arrays. */
function citedKeys(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach(v => citedKeys(v, found));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if ((k === 'ref' || k === 'refs') && Array.isArray(v)) v.forEach(x => found.add(String(x)));
      else citedKeys(v, found);
    }
  }
  return found;
}

describe('research data', () => {
  it('has the twelve sections A to L, in order', () => {
    expect(SECTIONS.map(s => s.letter)).toEqual('ABCDEFGHIJKL'.split(''));
    expect(SECTIONS.map(s => s.id)).toEqual(SECTION_IDS);
  });

  it('keeps the research identity', () => {
    expect(PROJECT).toMatchObject({
      course: 'MO-SS033 The Contemporary World',
      assessment: 'Terminal Assessment',
      student: 'Vanessa Rose A. Salonoy',
      section: 'H1103',
      mentor: 'Ms. Bella Joy Bardolas',
      title: 'Workplace Automation and Filipino Workers',
      titleSub: 'Evaluating Reskilling, Job Redesign, and Career Conversion',
    });
  });

  it('has a complete, unique reference list', () => {
    const keys = REFERENCES.map(r => r.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const r of REFERENCES) {
      expect(r.author.trim(), r.key).not.toBe('');
      expect(r.year.trim(), r.key).not.toBe('');
      expect(r.title.trim(), r.key).not.toBe('');
      expect(r.url, r.key).toMatch(/^https?:\/\//);
    }
  });

  it('cites only sources that are in the reference list', () => {
    const cited = [...citedKeys(research)];
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.filter(k => !(k in refMap))).toEqual([]);
  });
});

describe('rendered site', () => {
  it('renders the twelve sections in order, then the reviewer panel after section L', () => {
    render(<App />);
    const sections = SECTIONS.map(s => document.getElementById(s.id));
    sections.forEach((el, i) => {
      expect(el, SECTIONS[i].id).not.toBeNull();
      expect(el).toHaveAttribute('aria-label', `${SECTIONS[i].letter}. ${SECTIONS[i].label}`);
      if (i > 0) expect(sections[i - 1]!.compareDocumentPosition(el!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    const feedback = document.getElementById('mentor-feedback')!;
    expect(feedback).not.toBeNull();
    expect(sections[11]!.compareDocumentPosition(feedback) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    /* It is not a research section: outside <main>, and not in the section menu or rail. */
    expect(document.getElementById('main')!.contains(feedback)).toBe(false);
    expect(document.querySelector('a[href="#mentor-feedback"]')).toBeNull();
  });

  /* Regression guard for the 320px overflow in section G (QA-2026-10-24-01). The six
     dots and two arrows need about 295px on one line, more than the panel has on the
     narrowest phones, and a row that cannot wrap widened the whole page by 53px.
     jsdom does no layout, so this checks the row can wrap; the widths themselves are
     checked in a browser. */
  it('lets the section G journey controls wrap on narrow screens', () => {
    render(<App />);
    const row = document.querySelector('#journey [role="group"][aria-label="Journey progress"]');
    expect(row).not.toBeNull();
    expect(row).toHaveClass('flex-wrap');
  });

  /* The four criteria names are used at two stages. Section D compares the
     alternatives (Determining Solution); section I evaluates the selected proposal
     (Evaluating Success). These guard the wording that keeps the two apart. */
  it('labels section D as Determining Solution, not Evaluating Success', () => {
    render(<App />);
    const d = document.getElementById('solutions')!;
    expect(d.textContent).toMatch(/class Determining Solution criteria/);
    expect(d.textContent).not.toMatch(/criteria for evaluating success/i);
    expect(d.textContent).not.toMatch(/needs confirming/i);
  });

  it('evaluates success in section I on exactly the four criteria, each with how it would be assessed', () => {
    render(<App />);
    const i = document.getElementById('criteria')!;
    expect([...i.querySelectorAll('h3')].map(h => h.textContent))
      .toEqual(['Sustainability', 'Impact', 'Feasibility', 'Effectiveness']);
    expect([...i.querySelectorAll('h4')].filter(h => h.textContent === 'How success would be assessed')).toHaveLength(4);
    expect(i.textContent).not.toMatch(/needs confirming|acceptability/i);
    /* Sustainability has no SMART indicator, and says so rather than inventing one. */
    expect(research.PROPOSAL_CRITERIA[0].assess.some(a => a.kind === 'gap')).toBe(true);
    expect(research.PROPOSAL_CRITERIA[0].assess.some(a => a.kind === 'indicator')).toBe(false);
  });

  /* The source ranks the Philippines highest only among ASEAN countries with recent
     comparable data, so the comparison is never stated without that qualifier. */
  it('qualifies every ASEAN exposure comparison', () => {
    render(<App />);
    const text = document.body.textContent!;
    expect(text).not.toMatch(/highest (share|rate) in ASEAN/i);
    expect(text).toMatch(/highest share among ASEAN countries with recent comparable data/);
  });

  it('renders every reference entry in section L', () => {
    render(<App />);
    const list = document.getElementById('references')!;
    for (const r of REFERENCES) expect(list.querySelector(`#ref-${r.key}`), r.key).not.toBeNull();
  });
});
