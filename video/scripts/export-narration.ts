/**
 * Writes narration/sentences.json, the input to tts/narrate.py: one entry per
 * sentence with its id, the written text, and the text the voice is given.
 * Usage: node scripts/export-narration.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { SEGMENTS, sentences } from '../src/narration.ts';
import { sentenceId } from '../src/timeline.ts';
import { spoken } from '../src/lexicon.ts';

const out = SEGMENTS.flatMap(seg => sentences(seg.text).map((text, i) => ({ id: sentenceId(seg.id, i), text, say: spoken(text) })));
mkdirSync(new URL('../narration/', import.meta.url), { recursive: true });
writeFileSync(new URL('../narration/sentences.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(`${out.length} sentences, ${out.filter(s => s.say !== s.text).length} with a pronunciation fix`);
