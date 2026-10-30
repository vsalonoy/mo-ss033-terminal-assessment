/**
 * The website's design tokens (tailwind.config.js), restated for the video.
 * Cyan carries anything measured, amber anything proposed, rose a hard limit.
 */
export const C = {
  ink950: '#030711', ink900: '#050B16', ink800: '#07101F', ink700: '#0A1628', ink600: '#0F1E33', ink500: '#16293F',
  line: 'rgba(148,180,210,0.14)', edge: 'rgba(255,255,255,0.10)',
  cyan200: '#A5F3FC', cyan300: '#67E8F9', cyan400: '#22D3EE', cyan500: '#06B6D4',
  sand: '#E8EDF4', mute: '#8FA6BF', amber: '#E6A94C', rose: '#E07A6B', white: '#FFFFFF',
} as const;

export const F = {
  display: '"Space Grotesk Variable", system-ui, sans-serif',
  sans: '"Inter Variable", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
/** Side and top margin. Keeps text inside the title-safe area. */
export const PAD = 120;

export type Tone = 'neutral' | 'cyan' | 'amber' | 'rose';
export const TONE: Record<Tone, { fg: string; border: string; bg: string }> = {
  neutral: { fg: C.mute, border: C.line, bg: 'transparent' },
  cyan: { fg: C.cyan300, border: 'rgba(6,182,212,0.45)', bg: 'rgba(6,182,212,0.08)' },
  amber: { fg: C.amber, border: 'rgba(230,169,76,0.45)', bg: 'rgba(230,169,76,0.08)' },
  rose: { fg: C.rose, border: 'rgba(224,122,107,0.45)', bg: 'rgba(224,122,107,0.08)' },
};
