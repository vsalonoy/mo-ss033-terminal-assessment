/**
 * Storyboard stills: one frame from each scene, taken late enough that its
 * reveals have finished. For review before any narration is generated.
 * Usage: node scripts/storyboard.ts <out_dir> [--captions]
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { buildTimeline } from '../src/timeline.ts';

const out = path.resolve(process.argv[2] ?? 'out/storyboard');
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const inputProps = { timeline: null, burnCaptions: process.argv.includes('--captions') };
const composition = await selectComposition({ serveUrl, id: 'Explainer', inputProps });
/* Sample from the voiced timeline when the narration exists, so stills match the real video. */
const manifestPath = path.resolve('public/audio/manifest.json');
const tl = buildTimeline(existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null);
for (const s of tl.segments) {
  const frame = s.from + Math.floor(s.frames * (s.seg.scene === 'journey' ? 0.6 : 0.88));
  const file = path.join(out, `${s.seg.id}-${s.seg.scene}.png`);
  await renderStill({ composition, serveUrl, frame, output: file, inputProps, imageFormat: 'png' });
  console.log(`${s.seg.id.padEnd(4)} ${s.seg.scene.padEnd(15)} frame ${frame}`);
}
console.log(`total ${tl.total} frames = ${(tl.total / 30 / 60).toFixed(2)} min (${tl.voiced ? 'voiced' : 'estimated'})`);
