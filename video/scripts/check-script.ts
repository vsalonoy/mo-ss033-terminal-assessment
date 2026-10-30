/**
 * Academic consistency check for the narration. Fails if the script says a number
 * the website does not, uses the wrong unit for a Singapore figure, or uses
 * wording that would overstate the proposal.
 *
 * Usage: node scripts/check-script.ts
 */
import { readFileSync } from 'node:fs';
import { SEGMENTS, sentences } from '../src/narration.ts';

const research = readFileSync(new URL('../../src/data/research.ts', import.meta.url), 'utf8');
const problems: string[] = [];
const text = SEGMENTS.map(s => s.text).join(' ');

/* 1. Every number spoken must appear in research.ts as written. */
for (const n of new Set(text.match(/\d+(?:\.\d+)?/g) ?? [])) {
  if (!new RegExp(`(^|[^\\d.])${n.replace('.', '\\.')}(?![\\d])`).test(research)) {
    problems.push(`Number not on the website: ${n}`);
  }
}

/* 2. Units. Retention is a percentage-point effect; wage effects are percentages. */
if (!/3\.9 percentage points/.test(text)) problems.push('3.9 must be stated as percentage points');
if (/3\.9 percent(?! ?age)/.test(text)) problems.push('3.9 stated as percent');
for (const w of ['2.5 percent', '6.5 percent']) if (!text.includes(w)) problems.push(`Missing unit: ${w}`);

/* 3. Wording that would overstate the proposal or the evidence. */
const banned: [RegExp, string][] = [
  [/\b(approved|endorsed|adopted|funded) (the|this|my) (proposal|track)\b/i, 'claims approval or funding'],
  [/\b(will|would) (reduce|eliminate|solve|guarantee)/i, 'promises an outcome'],
  [/\bproven\b|\bguarantee/i, 'claims proof'],
  [/\bcaus(e|ed|es)\b/i, 'causal wording'],
  [/\bacceptability\b/i, 'acceptability is not an Evaluating Success criterion'],
  [/\bjobs will disappear|replace all\b/i, 'exaggerates displacement'],
  [/\bmost weight\b|\bweighted\b|\bscored\b|\bpoints? for\b/i, 'implies a numerical scoring model'],
  [/real-world examples?/i, 'Maria is hypothetical, not a real-world example'],
  [/industry bodies/i, 'DICT is a government department, not an industry body'],
  [/approved by me/i, 'script approval must not be claimed before the student approves it'],
  [/income during a mid-career transition is not\b/i, 'income-support gap must be scoped to the proposed pathway'],
  [/highest (share|rate) in ASEAN/i, 'ASEAN comparison must be qualified (countries with comparable data)'],
];
for (const [re, why] of banned) if (re.test(text)) problems.push(`Wording (${why}): ${text.match(re)![0]}`);

/* 4. Guards that must be said aloud. (The AI-narration notice is on screen and in the credits; see scripts/check-screen.ts.) */
const required: [RegExp, string][] = [
  [/hypothetical/, 'Maria labelled hypothetical'],
  [/Singapore results only/, 'Singapore evidence limited to Singapore'],
  [/does not exist yet/, 'proposal is not an existing programme'],
  [/None (of them )?has been approached/, 'no stakeholder approached'],
  [/no budget has been allocated/, 'no budget allocated'],
  [/planning target I set, not a result/, 'targets are not results'],
  [/do not include a dedicated sustainability measure/, 'sustainability gap stated'],
  [/proxy/, 'sustainability proxy named as a proxy'],
  [/Public Employment Service Office, or PESO/, 'PESO introduced by its full name'],
  [/a Philippine adaptation of/, 'one Philippine adaptation, distinct from the Singapore model'],
  [/four criteria I selected/, 'Determining Solution criteria described as selected'],
  [/did not assign numerical weights or scores/, 'no numerical weights or scores claimed'],
  [/greatest emphasis on effectiveness/, 'qualitative emphasis on effectiveness stated'],
  [/not that they failed/, 'not shown is not ineffective'],
  [/compares five possible responses/, 'opening: five responses (approved wording)'],
  [/published evidence, a worked example/, 'opening: Maria is a worked example, not a real-world case'],
  [/Determining Solution/, 'Determining Solution named'],
  [/Evaluating Success/, 'Evaluating Success named'],
];
for (const [re, why] of required) if (!re.test(text)) problems.push(`Missing: ${why}`);

/* 5. The four criteria, in order, in chapter 4. */
const ch4 = SEGMENTS.filter(s => s.scene === 'criterion').map(s => s.text.split(' ')[0]);
if (ch4.join() !== 'Sustainability,Impact,Feasibility,Effectiveness') problems.push(`Chapter 4 order: ${ch4}`);

const n = SEGMENTS.reduce((a, s) => a + sentences(s.text).length, 0);
if (problems.length) {
  console.error(`FAIL: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`PASS: ${SEGMENTS.length} segments, ${n} sentences checked against src/data/research.ts`);
