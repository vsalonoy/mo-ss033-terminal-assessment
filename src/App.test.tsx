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
  it('renders the twelve sections in order, then the feedback form after section L', () => {
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

  it('renders every reference entry in section L', () => {
    render(<App />);
    const list = document.getElementById('references')!;
    for (const r of REFERENCES) expect(list.querySelector(`#ref-${r.key}`), r.key).not.toBeNull();
  });
});
