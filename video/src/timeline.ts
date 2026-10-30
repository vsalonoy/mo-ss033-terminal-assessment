/**
 * Turns the narration into frame timings. With a voiced manifest (public/audio/
 * manifest.json, written by tts/narrate.py) every sentence uses its measured
 * duration. Without one, durations are estimated at 155 words a minute, the rate
 * measured for the candidate voices, and the result is a draft.
 *
 * Captions come from the same sentences, so they always match the narration.
 */
import { FPS } from './theme.ts';
import { SEGMENTS, sentences, wordCount, type Segment } from './narration.ts';

export interface Manifest {
  voice: string;
  sentences: Record<string, number>;
  /** Seconds into each sentence where the voice pauses (tts/pauses.py). Used only to check caption splits. */
  pauses?: Record<string, number[]>;
  /** Recognised words and their start times within each sentence (tts/verify_speech.py). */
  words?: Record<string, [string, number][]>;
}

export interface TimedSentence { id: string; text: string; from: number; frames: number; pauses: number[]; words: [string, number][] }
export interface TimedSegment { seg: Segment; from: number; frames: number; sentences: TimedSentence[] }
export interface Timeline { segments: TimedSegment[]; total: number; voiced: boolean; voice: string | null }

const LEAD = 0.5;   // seconds before the first sentence of a scene
const GAP = 0.25;   // between sentences
const TAIL = 0.4;   // after the last sentence, before the cross-fade (approved 27 Oct)
export const EST_WPM = 155;

export const sentenceId = (segId: string, i: number) => `${segId}-${String(i + 1).padStart(2, '0')}`;

export function buildTimeline(manifest: Manifest | null): Timeline {
  let at = 0;
  const segments: TimedSegment[] = SEGMENTS.map(seg => {
    const from = at;
    const out: TimedSentence[] = [];
    let t = seg.text ? LEAD : 0;
    sentences(seg.text).forEach((text, i) => {
      const id = sentenceId(seg.id, i);
      const secs = manifest?.sentences[id] ?? wordCount(text) / EST_WPM * 60;
      const pauses = (manifest?.pauses?.[id] ?? []).map(x => Math.round(x * FPS));
      const words = (manifest?.words?.[id] ?? []).map(([w, x]) => [w, Math.round(x * FPS)] as [string, number]);
      out.push({ id, text, from: Math.round(t * FPS), frames: Math.round(secs * FPS), pauses, words });
      t += secs + GAP;
    });
    const spoken = seg.text ? t - GAP + TAIL : 0;
    const frames = Math.round(Math.max(spoken, seg.hold ?? 0) * FPS);
    at += frames;
    return { seg, from, frames, sentences: out };
  });
  return { segments, total: at, voiced: !!manifest, voice: manifest?.voice ?? null };
}

/** Caption cues: at most two lines of 42 characters. A sentence's first cue starts
 *  with its audio. A later cue in the same sentence starts when its first word is
 *  spoken, from the recognised word timings; without them, in proportion to length. */
export interface Cue { start: number; end: number; text: string }
const MAX = 76;
const MIN_CUE = Math.round(1.2 * FPS); // shortest readable cue

function chunk(sentence: string): string[] {
  if (sentence.length <= MAX) return [sentence];
  const words = sentence.split(' ');
  const parts = Math.ceil(sentence.length / MAX);
  const target = sentence.length / parts;
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    /* Aim for equal parts, so no cue is a two-word remainder. Prefer to break
       after punctuation once a part is long enough, and never exceed MAX. */
    const full = next.length > MAX || next.length > target * 1.1 || (cur.length >= target * 0.7 && /[,:;]$/.test(cur));
    if (cur && full && out.length < parts - 1) { out.push(cur); cur = w; }
    else cur = next;
  }
  if (cur) out.push(cur);
  /* A last part that still ran over MAX is split once more at its middle space. */
  const last = out[out.length - 1];
  if (last.length > MAX) out.splice(-1, 1, ...twoLines(last).split('\n'));
  return out;
}

export function cues(tl: Timeline): Cue[] {
  const list: Cue[] = [];
  for (const s of tl.segments) {
    for (const sen of s.sentences) {
      const parts = chunk(sen.text);
      const total = parts.reduce((a, p) => a + p.length, 0);
      const bounds = [0];
      let chars = 0, wordsBefore = 0;
      const scriptWords = sen.text.split(' ').length;
      parts.slice(0, -1).forEach((p, k) => {
        chars += p.length;
        wordsBefore += p.split(' ').length;
        let b = Math.round(sen.frames * chars / total);
        /* Find the next part's first word among the recognised words, near where
           its position in the sentence says it should be. */
        const first = parts[k + 1].split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const guess = Math.round(wordsBefore * sen.words.length / scriptWords);
        const hit = sen.words
          .map((w, i) => ({ w, i }))
          .filter(({ w, i }) => w[0] === first && Math.abs(i - guess) <= 3)
          .sort((x, y) => Math.abs(x.i - guess) - Math.abs(y.i - guess))[0];
        if (hit && hit.w[1] - bounds[k] >= MIN_CUE && sen.frames - hit.w[1] >= MIN_CUE * (parts.length - 1 - k)) b = hit.w[1];
        bounds.push(b);
      });
      bounds.push(sen.frames);
      parts.forEach((p, k) => list.push({ start: s.from + sen.from + bounds[k], end: s.from + sen.from + bounds[k + 1], text: p }));
    }
  }
  return list;
}

/** Break a cue into two balanced lines for display. */
export function twoLines(text: string): string {
  if (text.length <= 42) return text;
  const mid = text.length / 2;
  let best = -1;
  for (let i = 0; i < text.length; i++) if (text[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return best < 0 ? text : `${text.slice(0, best)}\n${text.slice(best + 1)}`;
}
