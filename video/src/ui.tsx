import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, F, PAD, TONE, type Tone } from './theme';
import { CHAPTERS } from './narration';

/** Keeps small source and credit lines readable over photographs. */
const LEGIBLE = '0 0 6px rgba(3,7,17,0.95), 0 0 2px rgba(3,7,17,0.95)';

/** Fade and lift in, once. Restrained on purpose: no zooms, no bounces. */
export function In({ at = 0, children, style, dy = 14 }:
  { at?: number; children: ReactNode; style?: CSSProperties; dy?: number }) {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * dy}px)`, ...style }}>{children}</div>;
}

/** Every scene sits in this frame: background, chapter tag, optional stage tag and source line. */
/* The bottom 190px stay empty: captions, burned in or from the website's caption
   track, are drawn there, so nothing a viewer needs may sit underneath them. */
export function Frame({ chapter, stage, source, credit, children, bg }:
  { chapter?: number; stage?: ReactNode; source?: string; credit?: string; children: ReactNode; bg?: ReactNode }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  /* Cross-fade at both ends so cuts between scenes are never hard. */
  const o = interpolate(f, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ch = CHAPTERS.find(c => c.n === chapter);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 85% 0%, ${C.ink700} 0%, ${C.ink900} 55%, ${C.ink950} 100%)`, color: C.sand, fontFamily: F.sans }}>
      {bg}
      <AbsoluteFill style={{ opacity: o, padding: PAD, paddingTop: 96, paddingBottom: 190 }}>
        {(ch || stage) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 44 }}>
            {ch && <Eyebrow>{ch.n} · {ch.title}</Eyebrow>}
            {stage}
          </div>
        )}
        <div style={{ flex: 1, position: 'relative' }}>{children}</div>
        {source && <Source>{source}</Source>}
        {credit && <div style={{ fontFamily: F.mono, fontSize: 20, color: C.mute, marginTop: 6, textShadow: LEGIBLE }}>{credit}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function Eyebrow({ children, color = C.cyan300 }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.mono, fontSize: 24, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color }}>
      <span style={{ width: 40, height: 2, background: color, opacity: 0.6 }} />{children}
    </div>
  );
}

export function Chip({ tone = 'neutral', children, filled, size = 24 }:
  { tone?: Tone; children: ReactNode; filled?: boolean; size?: number }) {
  const t = TONE[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: `2px solid ${t.border}`,
      background: filled ? t.border : t.bg, color: filled ? C.ink950 : t.fg, padding: '6px 20px',
      fontFamily: F.display, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap' }}>{children}</span>
  );
}

/** Small source line, bottom left. Every scene that shows evidence carries one. */
export function Source({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, letterSpacing: '0.02em', textShadow: LEGIBLE }}>Source: {children}</div>;
}

export function H({ children, size = 76, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.025em', color: C.white, ...style }}>{children}</div>;
}

export function P({ children, size = 38, color = C.sand, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  return <div style={{ fontSize: size, lineHeight: 1.4, color, ...style }}>{children}</div>;
}

export function Card({ children, style, tone }: { children: ReactNode; style?: CSSProperties; tone?: Tone }) {
  const t = tone ? TONE[tone] : null;
  return (
    <div style={{ background: t ? t.bg : 'rgba(15,30,51,0.72)', border: `2px solid ${t ? t.border : C.edge}`, borderRadius: 20, padding: '32px 36px', ...style }}>
      {children}
    </div>
  );
}

/** A persistent caution, used for anything a viewer must not miss (hypothetical, proposed, not a result). */
export function Banner({ tone = 'amber', children, style }: { tone?: Tone; children: ReactNode; style?: CSSProperties }) {
  const t = TONE[tone];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, borderLeft: `6px solid ${t.fg}`, background: t.bg,
      padding: '14px 26px', fontFamily: F.display, fontWeight: 600, fontSize: 30, color: t.fg, ...style }}>{children}</div>
  );
}
