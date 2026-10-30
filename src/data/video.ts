/**
 * The presentation video: the centrepiece of Home and the subject of the Watch theatre.
 *
 * `ready` is true because the student approved the v4 video (D-3, 30 October 2026;
 * video/narration/APPROVALS.md) and the video, captions and poster are in
 * public/video/. Setting it back to false removes the player, the Watch buttons and
 * the chapter list, so a build carries no video. A local preview shows them with
 * VITE_VIDEO_PREVIEW=1, which .env.development.local sets for `npm run dev` only; a
 * build refuses it. See vite.config.ts for how the local copy is served.
 *
 * The transcript is generated from the narration source by video/scripts/captions.ts,
 * so it always matches the captions and the voice.
 */
import transcript from './video-transcript.json';

export const VIDEO_EXPLAINER = {
  ready: true,
  id: 'presentation',
  title: 'Video presentation: Workplace Automation and Filipino Workers',
  /* Relative to the page, like every other asset (vite.config.ts uses base './'). */
  src: 'video/explainer.mp4',
  captions: 'video/explainer.en.vtt',
  /* A still of the opening photograph, with its credit, at 0.2 s of the master. */
  poster: 'video/explainer-poster.jpg',
  /* The v4 master: 494.187 seconds. */
  duration: '8:14',
  durationSeconds: 494.187,
  /* Approved 27 October 2026: the video carries adapted CC BY-SA 4.0 photographs. */
  licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  size: '27.6 MB',
  transcript: transcript as { title: string; paragraphs: string[] }[],
};

/**
 * Chapter seek points, in seconds, at each chapter card of the v4 master. Taken from
 * the video timeline (video/src/timeline.ts) and checked against the first caption
 * cue of each chapter in a test. Each chapter is a seek on the one video element,
 * never a separate file.
 */
export interface Chapter { n: number; title: string; start: number; sub?: boolean }
export const CHAPTERS: Chapter[] = [
  { n: 0, title: 'Introduction', start: 0 },
  { n: 1, title: 'Globalization and the problem', start: 42.0 },
  { n: 2, title: 'Determining the solution', start: 121.3 },
  { n: 3, title: 'How the proposed solution works', start: 237.4 },
  { n: 4, title: 'Evaluating success', start: 296.6 },
  { n: 4.1, title: 'Sustainability', start: 315.1, sub: true },
  { n: 4.2, title: 'Impact', start: 351.5, sub: true },
  { n: 4.3, title: 'Feasibility', start: 378.7, sub: true },
  { n: 4.4, title: 'Effectiveness', start: 411.5, sub: true },
  { n: 5, title: 'Conclusion', start: 450.7 },
  { n: 6, title: 'Credits and licence', start: 487.2 },
];

/** The main chapters, without the four sub-chapters of chapter 4. */
export const MAIN = CHAPTERS.filter(c => !c.sub);
export const chapterAt = (t: number) => [...MAIN].reverse().find(c => t >= c.start - 0.05) ?? MAIN[0];
export const chapterName = (c: Chapter) => (c.n === 0 || c.n === 6 ? c.title : `Chapter ${c.n}: ${c.title}`);

/** Start and end of a main chapter, for "Watch 2:01–3:57". */
export const videoSpan = (n: number) => {
  const i = MAIN.findIndex(c => c.n === n);
  return { start: MAIN[i].start, end: MAIN[i + 1]?.start ?? MAIN[i].start };
};

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const videoExplainerEnabled = () =>
  VIDEO_EXPLAINER.ready || import.meta.env.VITE_VIDEO_PREVIEW === '1';
