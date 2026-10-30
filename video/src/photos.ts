/**
 * Photographs used only in the video, with their licence records. Verified on
 * Wikimedia Commons on 27 October 2026 (file page, licence template, author,
 * no restriction or freedom-of-panorama tags). The website's own photographs
 * stay in src/data/media.ts.
 *
 * Rejected during verification: TESDA frames (07) and (05) from the same public
 * domain set, because the President or officials could not be cropped out
 * without leaving a crop dominated by branding or officials.
 */
import { staticFile } from 'remotion';

export interface VideoPhoto {
  key: string; src: string; title: string; creator: string; year: string;
  license: string; licenseUrl: string; source: string; changes: string;
}

export const PHOTOS = {
  eastwood: {
    key: 'eastwood', src: staticFile('photos/eastwood-1920.webp'),
    title: 'Eastwood City from Ortigas Center, Oct 2025', creator: 'Ralff Nestor Nacor', year: '2025',
    license: 'CC BY-SA 4.0', licenseUrl: 'creativecommons.org/licenses/by-sa/4.0',
    source: 'commons.wikimedia.org/wiki/File:Eastwood_City_from_Ortigas_Center,_Oct_2025.jpg',
    changes: 'Resized; darkened, with a gradient and text added in the video.',
  },
  makati: {
    key: 'makati', src: staticFile('photos/makati-night-1920.webp'),
    title: 'Skyline of Makati at night', creator: 'Red marquis', year: '2011',
    license: 'CC0 1.0', licenseUrl: 'creativecommons.org/publicdomain/zero/1.0',
    source: 'commons.wikimedia.org/wiki/File:Skyline_of_Makati_at_night.jpg',
    changes: 'Resized; shown as a band with text above it.',
  },
} satisfies Record<string, VideoPhoto>;
