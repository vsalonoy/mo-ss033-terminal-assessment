/**
 * Copies the website's bundled fonts into public/fonts so the video uses the same
 * typefaces. Nothing is downloaded. Usage: node scripts/assets.ts
 */
import { copyFileSync, mkdirSync } from 'node:fs';

const root = new URL('../../node_modules/', import.meta.url);
const out = new URL('../public/fonts/', import.meta.url);
mkdirSync(out, { recursive: true });
for (const f of [
  '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
]) {
  copyFileSync(new URL(f, root), new URL(f.split('/').pop()!, out));
  console.log('copied', f.split('/').pop());
}
