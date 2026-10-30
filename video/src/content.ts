import type { RefKey } from '../../src/data/research';

export const SITE_URL = 'https://vsalonoy.github.io/mo-ss033-terminal-assessment/';

/**
 * How the script's status is described on screen. The student approved the
 * script on 27 October 2026 (narration/APPROVALS.md), so it now says so. Whether
 * this wording satisfies CAMU's AI-use rules is unverified and tracked in the QA
 * report, not shown in the video.
 */
export const SCRIPT_STATUS = 'The script was prepared with AI assistance and reviewed and approved by the student.';

/** Every reference the video shows or speaks from, listed in the credits. */
export const VIDEO_REFS: RefKey[] = ['khan2026', 'malaya2025', 'dagooc2026', 'huynh2026', 'mti2025', 'wsg', 'moe2025', 'ra10869', 'ra12063', 'dole'];

/** Licence notices: CC BY-SA 4.0 s.3(a)(1) asks for a URI to the licence where practicable. */
export const LICENCE_URI: Record<string, string> = {
  'CC BY-SA 4.0': 'creativecommons.org/licenses/by-sa/4.0',
  'CC0 1.0': 'creativecommons.org/publicdomain/zero/1.0',
};

/** What the video itself does to each photograph, on top of the website's crop (media.ts `adapted`). */
export const VIDEO_CHANGES: Record<string, string> = {
  hero: 'Cropped and tinted for the website; darkened, with a gradient and title text added in the video.',
  itPark: 'Cropped for the website; darkened, with a gradient and text added in the video.',
  tesda: 'Cropped and resized; shown unaltered beside text.',
  lab: 'Cropped and resized; shown faintly behind text.',
};

/** The video's own licence (approved 27 Oct): CC BY-SA 4.0, because two adapted CC BY-SA photographs appear in it. */
export const VIDEO_LICENCE = 'This video is licensed CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0).';
