/**
 * On-screen safeguards that the narration no longer speaks (approved 27 Oct):
 * the AI-narration label must appear while the voice introduces the student by
 * name, and the end credits must carry the full acknowledgment and the licence.
 * Usage: node scripts/check-screen.ts
 */
import { readFileSync } from 'node:fs';

const scenes = readFileSync(new URL('../src/scenes.tsx', import.meta.url), 'utf8');
const content = readFileSync(new URL('../src/content.ts', import.meta.url), 'utf8');
const body = (name: string) => { const i = scenes.indexOf(`export function ${name}(`); return scenes.slice(i, scenes.indexOf('\nexport function', i + 10)); };
const problems: string[] = [];
const need = (ok: boolean, why: string) => { if (!ok) problems.push(why); };

need(/AI-generated narration/.test(scenes), 'AI label text');
need(body('OpenTitle').includes('<AiLabel />'), 'AI label shown in the title scene');
need(/AI_LABEL_OUT - AI_LABEL_IN|AI_LABEL_IN = \d+, AI_LABEL_OUT = \d+/.test(scenes) && (() => { const m = scenes.match(/AI_LABEL_IN = (\d+), AI_LABEL_OUT = (\d+)/); return !!m && (+m[2] - +m[1]) / 30 >= 4 && (+m[2] - +m[1]) / 30 <= 6; })(), 'AI label on screen for 4 to 6 seconds');
const credits = body('Credits');
need(/AI-generated voice/.test(credits) && /not the student’s real voice and not a clone/.test(credits), 'credits: AI voice, not real or cloned');
need(credits.includes('{SCRIPT_STATUS}') && /prepared with AI assistance/.test(content), 'credits: AI-assisted script');
need(/remain the student’s responsibility/.test(credits), 'credits: student responsibility');
need(credits.includes('{VIDEO_LICENCE}') && /CC BY-SA 4\.0/.test(content), 'credits: video licence');
need(!/Provisional|PENDING|DRAFT/.test(scenes.replace(/DRAFT · NO NARRATION/g, '')), 'no internal compliance notes on screen');

if (problems.length) { console.error(`FAIL\n- ${problems.join('\n- ')}`); process.exit(1); }
console.log('PASS: AI-narration label in the opening; full acknowledgment and licence in the credits');
