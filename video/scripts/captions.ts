/**
 * Captions and transcript, both from the narration source.
 *  - out/explainer.en.vtt: WebVTT captions, timed from the voiced manifest when it
 *    exists, otherwise from estimates (and marked as a draft in the file).
 *  - ../src/data/video-transcript.json: the transcript the website shows beside
 *    the player, by chapter. Timing does not affect it.
 * Usage: node scripts/captions.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CHAPTERS, SEGMENTS, sentences } from '../src/narration.ts';
import { buildTimeline, cues, twoLines, type Manifest } from '../src/timeline.ts';
import { FPS } from '../src/theme.ts';

const manifestUrl = new URL('../public/audio/manifest.json', import.meta.url);
const manifest: Manifest | null = existsSync(manifestUrl) ? JSON.parse(readFileSync(manifestUrl, 'utf8')) : null;
const tl = buildTimeline(manifest);

/* Anchor every cue to the bottom edge, inside the 190 px band the scenes keep
   clear. Without it the browser may draw captions over source lines and titles. */
const CUE_SETTINGS = 'line:96%,end align:center';

const ts = (f: number) => {
  const ms = Math.round(f / FPS * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
const vtt = ['WEBVTT', '',
  manifest ? `NOTE Timed from the narration (${manifest.voice}).` : 'NOTE DRAFT. Timing is estimated; regenerate after the narration is voiced.', '',
  ...cues(tl).flatMap((c, i) => [String(i + 1), `${ts(c.start)} --> ${ts(c.end)} ${CUE_SETTINGS}`, twoLines(c.text), ''])].join('\n');
mkdirSync(new URL('../out/', import.meta.url), { recursive: true });
writeFileSync(new URL('../out/explainer.en.vtt', import.meta.url), vtt);

const transcript = [
  { title: 'Introduction', paragraphs: SEGMENTS.filter(s => s.chapter === 0 && s.text).map(s => s.text) },
  ...CHAPTERS.map(c => ({ title: `${c.n}. ${c.title}`, paragraphs: SEGMENTS.filter(s => s.chapter === c.n && s.text).map(s => s.text) })),
  { title: 'Closing', paragraphs: SEGMENTS.filter(s => s.chapter === 6 && s.text).map(s => s.text) },
];
writeFileSync(new URL('../../src/data/video-transcript.json', import.meta.url), JSON.stringify(transcript, null, 1) + '\n');
console.log(`${cues(tl).length} caption cues (${manifest ? 'voiced' : 'estimated'} timing), ${transcript.length} transcript sections, ${(tl.total / FPS / 60).toFixed(2)} min`);

/* Quality gate: fail rather than publish captions that drift from the narration or break caption standards. */
const list = cues(tl);
const problems: string[] = [];
list.forEach((c, i) => {
  const lines = twoLines(c.text).split('\n');
  if (i && c.start < list[i - 1].end) problems.push(`cue ${i + 1} overlaps the previous one`);
  if ((c.end - c.start) / FPS < 1.2) problems.push(`cue ${i + 1} is shorter than 1.2 s`);
  if (lines.length > 2 || lines.some(l => l.length > 42)) problems.push(`cue ${i + 1} exceeds two lines of 42 characters`);
});
const norm = (t: string) => t.replace(/\s+/g, ' ').trim();
if (norm(list.map(c => c.text).join(' ')) !== norm(SEGMENTS.flatMap(s => sentences(s.text)).join(' '))) problems.push('captions do not match the narration word for word');
if (norm(transcript.flatMap(t => t.paragraphs).join(' ')) !== norm(SEGMENTS.filter(s => s.text).map(s => s.text).join(' '))) problems.push('transcript does not match the narration');
if (problems.length) { console.error(`FAIL\n- ${problems.join('\n- ')}`); process.exit(1); }
console.log('PASS: captions and transcript match the narration and meet caption standards');
