/**
 * The scenes. Figures, labels, verdicts and indicator targets are read from the
 * website's own data (src/data/research.ts and media.ts) rather than retyped, so
 * the video cannot drift from the site. The short on-screen phrasings that are
 * written here are condensed from the entry named in the comment beside them.
 */
import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CRITERIA, EXPOSURE_NOTES, GLOBAL_NETWORK, HEADLINE_STATS, IMPL_ACTORS, IMPL_STAGES, JOURNEY,
  PROJECT, PROPOSAL, PROPOSAL_CRITERIA, RANKED, SG_OUTCOMES, SOLUTIONS, SG_WAGE_TRAJECTORY, SMART,
  ASSESS_KIND_LABEL, shortCite, type AssessKind, type RefKey,
} from '../../src/data/research';
import { MEDIA, type Media } from '../../src/data/media';
import { C, F, TONE, type Tone } from './theme';
import { Banner, Card, Chip, Eyebrow, Frame, H, In, P } from './ui';
import { CHAPTERS } from './narration';
import { PHOTOS } from './photos';
import { ExposureGrids, FundingHorizon, RegionBars, StatuteSchedule, TargetDots, TargetRing } from './charts';
import { LICENCE_URI, SCRIPT_STATUS, SITE_URL, VIDEO_CHANGES, VIDEO_LICENCE, VIDEO_REFS } from './content';

const cite = (keys: RefKey[]) => [...new Set(keys)].map(shortCite).join('; ');
const smart = (id: string) => SMART.find(m => m.id === id)!;

function PhotoBg({ m, opacity = 0.32 }: { m: { src: string }; opacity?: number }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(f, [0, durationInFrames], [1, 1.04]);   // restrained: at most 4%
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={m.src} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${zoom})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.ink950} 0%, rgba(3,7,17,0.82) 45%, rgba(3,7,17,0.35) 100%)` }} />
    </AbsoluteFill>
  );
}
const photoCredit = (m: Media) => `Photograph (illustrative): ${m.creator}, ${m.license}${m.license.startsWith('CC BY') ? ', adapted' : ''}`;

/* ------------------------------------------------------------------ opening */
/** Discreet transparency notice: bottom-right of the title scene, on the photo-credit
 *  row (above the caption band), shown for about five seconds at the start. */
const AI_LABEL_IN = 10, AI_LABEL_OUT = 168;   // frames: 0.3 s to 5.6 s, fades included
const AiLabel = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [AI_LABEL_IN, AI_LABEL_IN + 10, AI_LABEL_OUT - 10, AI_LABEL_OUT], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (o === 0) return null;
  return (
    <div style={{ position: 'absolute', right: 0, bottom: -30, opacity: o,
      /* 32 px gives about 11.6 px on a phone in landscape fullscreen (693 px wide);
         regular weight keeps it secondary to the title and researcher line. */
      fontFamily: F.sans, fontSize: 32, fontWeight: 400, color: 'rgba(232,237,244,0.92)',
      background: 'rgba(3,7,17,0.62)', borderRadius: 8, padding: '5px 16px', letterSpacing: '0.01em' }}>
      AI-generated narration
    </div>
  );
};
const RESEARCHER = 'Vanessa R. A. Salonoy';
const INSTITUTION = 'Mapúa Malayan Digital College';
const vphotoCredit = (p: { creator: string; license: string; year: string }) => `Photograph (illustrative): ${p.creator}, ${p.year}, ${p.license}`;

export function OpenTitle() {
  return (
    <Frame bg={<PhotoBg m={MEDIA.hero} opacity={0.42} />} credit={`${photoCredit(MEDIA.hero)} · call centre, Manila`}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, maxWidth: 1450 }}>
        <In><Eyebrow>{PROJECT.course} · {PROJECT.assessment}</Eyebrow></In>
        <In at={10}><H size={88} style={{ marginTop: 30 }}>{PROJECT.title}:</H></In>
        <In at={22}><H size={56} style={{ color: C.cyan300, marginTop: 12, fontWeight: 600 }}>{PROJECT.titleSub}</H></In>
        <In at={40}><P size={34} style={{ marginTop: 34 }}>Research by {RESEARCHER}</P></In>
      </div>
      <AiLabel />
    </Frame>
  );
}

export function OpenResearcher() {
  return (
    <Frame bg={<PhotoBg m={PHOTOS.eastwood} opacity={0.45} />} credit={`${vphotoCredit(PHOTOS.eastwood)} · Eastwood City IT park, Quezon City`}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: 1100 }}>
        <In><Eyebrow>Research by</Eyebrow></In>
        <In at={6}><H size={92} style={{ marginTop: 22 }}>{RESEARCHER}</H></In>
        <In at={16}><div style={{ width: 120, height: 4, background: C.cyan400, margin: '34px 0 30px' }} /></In>
        <In at={22}><P size={36}>{PROJECT.course} · Section {PROJECT.section}</P></In>
        <In at={30}><P size={36} style={{ marginTop: 10 }}>{INSTITUTION}</P></In>
        <In at={38}><P size={32} color={C.mute} style={{ marginTop: 10 }}>Mentor: {PROJECT.mentor}</P></In>
      </div>
    </Frame>
  );
}

/** The five chapters ahead, revealed while the narration outlines them. */
export function OpenRoadmap({ dur }: { dur: number }) {
  return (
    <Frame>
      <In><Eyebrow>In this video</Eyebrow></In>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginTop: 40 }}>
        {CHAPTERS.map((c, i) => (
          <In key={c.n} at={Math.round(dur * (0.06 + i * 0.12))}>
            <Card tone={c.n === 4 ? 'cyan' : undefined} style={{ height: 320 }}>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 72, color: c.n === 4 ? C.cyan300 : C.mute }}>0{c.n}</div>
              <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.white, marginTop: 18, lineHeight: 1.15 }}>{c.title}</div>
            </Card>
          </In>
        ))}
      </div>
      <In at={Math.round(dur * 0.7)} style={{ marginTop: 36 }}><P size={30} color={C.mute}>Published evidence · a worked example · measurable criteria</P></In>
    </Frame>
  );
}

export function Chapter({ n }: { n: number }) {
  const ch = CHAPTERS.find(c => c.n === n)!;
  return (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <In><div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 220, lineHeight: 1, color: C.cyan300 }}>0{n}</div></In>
        <In at={6}><H size={96} style={{ marginTop: 24 }}>{ch.title}</H></In>
        <In at={12}><P size={30} color={C.mute} style={{ marginTop: 24, fontFamily: F.mono, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Chapter {n} of 5</P></In>
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- chapter 1 */
function Node({ title, at, x, y, w = 420, tone }: { title: string; at: number; x: number; y: number; w?: number; tone?: Tone }) {
  return (
    <In at={at} style={{ position: 'absolute', left: x, top: y, width: w }}>
      <Card tone={tone} style={{ padding: '26px 30px' }}><div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.white }}>{title}</div></Card>
    </In>
  );
}
function Arrow({ x1, y1, x2, y2, label, at, lx, ly }: { x1: number; y1: number; x2: number; y2: number; label: string; at: number; lx: number; ly: number }) {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <>
      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="100%" height="100%">
        <defs><marker id="ah" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill={C.cyan400} /></marker></defs>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cyan400} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - t)} markerEnd={t > 0.95 ? 'url(#ah)' : undefined} opacity={0.8} />
      </svg>
      <div style={{ position: 'absolute', left: lx, top: ly, opacity: t, fontFamily: F.sans, fontSize: 26, color: C.mute, width: 360 }}>{label}</div>
    </>
  );
}
export function Network({ dur }: { dur: number }) {
  const g = GLOBAL_NETWORK, s = (p: number) => Math.round(dur * p);
  const refs = [g.clients, g.competitors, g.hub, g.tech, g.workers, g.skills].flatMap(n => n.body.flatMap(b => b.refs ?? []));
  return (
    <Frame chapter={1} source={cite(refs)}>
      <Node title={g.clients.title} at={s(0.02)} x={0} y={20} />
      <Node title={g.competitors.title} at={s(0.05)} x={0} y={380} />
      <Node title={g.hub.title} at={s(0.25)} x={640} y={200} w={440} tone="cyan" />
      <Node title={g.tech.title} at={s(0.45)} x={640} y={560} w={440} />
      <Node title={g.workers.title} at={s(0.6)} x={1260} y={200} />
      <Node title={g.skills.title} at={s(0.75)} x={1260} y={560} />
      <Arrow x1={420} y1={70} x2={636} y2={230} label={g.edges.clientsToHub} at={s(0.28)} lx={430} ly={-20} />
      <Arrow x1={420} y1={430} x2={636} y2={290} label={g.edges.competitorsToHub} at={s(0.3)} lx={430} ly={420} />
      <Arrow x1={860} y1={556} x2={860} y2={300} label={g.edges.techToHub} at={s(0.48)} lx={880} ly={430} />
      <Arrow x1={1080} y1={250} x2={1256} y2={250} label={g.edges.hubToWorkers} at={s(0.62)} lx={1090} ly={120} />
      <Arrow x1={1470} y1={556} x2={1470} y2={300} label={g.edges.skillsToWorkers} at={s(0.78)} lx={1490} ly={430} />
    </Frame>
  );
}

export function Stats({ dur }: { dur: number }) {
  const [exposed] = HEADLINE_STATS;
  return (
    <Frame chapter={1} source={`${cite(exposed.ref)}, International Labour Organization`}>
      <ExposureGrids dur={dur} />
    </Frame>
  );
}

export function Uneven({ dur }: { dur: number }) {
  /* Condensed from EXPOSURE_NOTES (Gender, Age, Region). */
  const rows = [
    ['Gender', 'Women: roughly double the exposure of men'],
    ['Age', 'Young workers: more often in higher-risk occupations'],
  ];
  const refs = EXPOSURE_NOTES.slice(0, 3).flatMap(n => n.ref);
  return (
    <Frame chapter={1} source={cite(refs)}>
      <H size={64}>The change is uneven</H>
      <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div style={{ display: 'grid', gap: 22, alignContent: 'start' }}>
          {rows.map(([k, v], i) => (
            <In key={k} at={Math.round(dur * (0.06 + i * 0.12))}>
              <Card style={{ padding: '24px 30px' }}>
                <span style={{ fontFamily: F.mono, fontSize: 24, color: C.cyan300, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</span>
                <P size={34} style={{ marginTop: 8 }}>{v}</P>
              </Card>
            </In>
          ))}
        </div>
        <RegionBars at={Math.round(dur * 0.3)} />
      </div>
      {/* AUDIENCE.needed and PROPOSAL.gap.missing[2] */}
      <In at={Math.round(dur * 0.72)} style={{ marginTop: 30 }}><Banner tone="amber">Training is funded. No scheme found replaces mid-career income during retraining.</Banner></In>
    </Frame>
  );
}

export function Position() {
  return (
    <Frame chapter={1} bg={<PhotoBg m={MEDIA.itPark} />} credit={`${photoCredit(MEDIA.itPark)} · Cebu IT Park`}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: 1250 }}>
        <In><Eyebrow>My position</Eyebrow></In>
        {/* PROJECT.position, shortened */}
        <In at={8}><H size={72} style={{ marginTop: 32 }}>Automation should continue, paired with support built into the transition.</H></In>
        <In at={20}><P size={36} color={C.mute} style={{ marginTop: 28 }}>Not offered after workers have already lost ground.</P></In>
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- chapter 2 */
const DeterminingTag = () => <Chip tone="neutral">Determining Solution · four selected criteria</Chip>;

export function Five({ dur }: { dur: number }) {
  return (
    <Frame chapter={2} stage={<DeterminingTag />} source="Sections D and E">
      <In><div style={{ display: 'flex', gap: 14 }}>{CRITERIA.map(c => <Chip key={c.key}>{c.label}</Chip>)}</div></In>
      <In at={Math.round(dur * 0.4)}><P size={30} color={C.mute} style={{ marginTop: 18 }}>Qualitative judgements · greatest emphasis on effectiveness · no numerical weights or scores</P></In>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22, marginTop: 36 }}>
        {RANKED.map((s, i) => {
          const first = s.rank === 1;
          return (
            <In key={s.id} at={Math.round(dur * (0.06 + i * 0.07))}>
              <Card tone={first ? 'cyan' : undefined} style={{ height: 372, opacity: first ? 1 : 0.75 }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: first ? C.cyan300 : C.mute }}>{s.rank}</div>
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.white, marginTop: 24, lineHeight: 1.15 }}>{s.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, marginTop: 14, textTransform: 'uppercase' }}>{s.where}</div>
              </Card>
            </In>
          );
        })}
      </div>
      <In at={Math.round(dur * 0.7)} style={{ marginTop: 32 }}><Banner tone="neutral">Five alternatives compared. One selected. The others are not recommendations.</Banner></In>
    </Frame>
  );
}

function ThreeWay({ active, children, source }: { active: 0 | 1 | 2; children: ReactNode; source?: string }) {
  const heads = ['The program (Singapore)', 'The evidence (Singapore)', 'My proposal (Philippines)'];
  return (
    <Frame chapter={2} stage={<DeterminingTag />} source={source}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {heads.map((h, i) => (
          <div key={h} style={{ borderTop: `6px solid ${i === active ? (i === 2 ? C.amber : C.cyan400) : C.line}`, paddingTop: 16,
            fontFamily: F.display, fontWeight: 700, fontSize: 34, color: i === active ? C.white : C.mute, opacity: i === active ? 1 : 0.6 }}>{i + 1}. {h}</div>
        ))}
      </div>
      <div style={{ marginTop: 56 }}>{children}</div>
    </Frame>
  );
}

function ProgramStep({ n, t, d, at }: { n: number; t: string; d: string; at: number }) {
  return (
    <In at={at} style={{ flex: 1 }}><Card style={{ height: 260 }}>
      <div style={{ fontFamily: F.mono, fontSize: 26, color: C.cyan300 }}>STEP {n}</div>
      <H size={56} style={{ marginTop: 16 }}>{t}</H><P size={32} color={C.mute} style={{ marginTop: 14 }}>{d}</P>
    </Card></In>
  );
}

export function Program() {
  return (
    <ThreeWay active={0} source={cite(['mti2025'])}>
      <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        <ProgramStep n={1} t="Hired first" d="Into a new growth role, by a participating company" at={60} />
        <In at={80}><div style={{ fontSize: 80, color: C.cyan400 }}>→</div></In>
        <ProgramStep n={2} t="Then trained" d="On the job, or with industry-recognised training" at={90} />
      </div>
      <In at={120} style={{ marginTop: 48 }}><P size={34} color={C.mute}>{SOLUTIONS.find(x => x.id === 's3')!.status}</P></In>
    </ThreeWay>
  );
}

export function Evidence({ dur }: { dur: number }) {
  const T = SG_WAGE_TRAJECTORY;
  const retention = SG_OUTCOMES.find(o => o.unit === 'pp')!;
  const x = (v: number) => (v / T.axisMax) * 900;
  const f = useCurrentFrame();
  const grow = (at: number) => interpolate(f, [at, at + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a1 = Math.round(dur * 0.18), a2 = Math.round(dur * 0.35), a3 = Math.round(dur * 0.58);
  return (
    <ThreeWay active={1} source={`${cite(T.ref)}. The authors state the views are their own, not agency positions.`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 60 }}>
        <Card>
          <div style={{ fontFamily: F.mono, fontSize: 24, color: C.mute, textTransform: 'uppercase' }}>Wage effect against control groups</div>
          {[{ l: T.placement.label, lo: 0, hi: T.placement.value, txt: `${T.placement.value}%`, at: a1 },
            { l: T.after.label, lo: T.after.low, hi: T.after.high, txt: `${T.after.low}% to ${T.after.high}%`, at: a2 }].map(r => (
            <div key={r.l} style={{ marginTop: 40 }}>
              <P size={30} color={C.mute}>{r.l}</P>
              <div style={{ position: 'relative', height: 64, marginTop: 10, borderLeft: `2px solid ${C.line}` }}>
                {r.lo === 0
                  ? <div style={{ position: 'absolute', left: 0, top: 8, height: 48, width: x(r.hi) * grow(r.at), background: C.cyan400, borderRadius: 6 }} />
                  : <div style={{ position: 'absolute', left: x(r.lo), top: 8, height: 48, width: (x(r.hi) - x(r.lo)) * grow(r.at), background: 'rgba(34,211,238,0.45)', border: `2px solid ${C.cyan400}`, borderRadius: 6 }} />}
                <div style={{ position: 'absolute', left: x(r.hi) + 24, top: 4, opacity: grow(r.at), fontFamily: F.display, fontWeight: 800, fontSize: 48, color: C.cyan300 }}>{r.txt}</div>
              </div>
            </div>
          ))}
          <P size={24} color={C.mute} style={{ marginTop: 28 }}>Two measured states, not a yearly series. The second is a range.</P>
        </Card>
        <In at={a3}><Card tone="amber" style={{ height: '100%' }}>
          <div style={{ fontFamily: F.mono, fontSize: 24, color: C.amber, textTransform: 'uppercase' }}>{retention.name}</div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 132, color: C.amber, marginTop: 20, lineHeight: 1 }}>+{retention.value}</div>
          <P size={36} style={{ marginTop: 12 }}>percentage points</P>
        </Card></In>
      </div>
      <In at={Math.round(dur * 0.8)} style={{ marginTop: 36 }}><Banner tone="amber">Compared with control groups. Singapore only, not a Philippine result.</Banner></In>
    </ThreeWay>
  );
}

export function Proposal() {
  const [first, ...rest] = PROPOSAL.claim.split('. ');
  return (
    <ThreeWay active={2}>
      <In at={6}><Card tone="amber" style={{ borderStyle: 'dashed', maxWidth: 1300 }}>
        <H size={60}>{PROPOSAL.name}</H>
        <P size={38} style={{ marginTop: 24 }}>{first}.</P>
        <P size={32} color={C.mute} style={{ marginTop: 10 }}>{rest.join('. ')}</P>
      </Card></In>
    </ThreeWay>
  );
}

/** Tone of a qualitative rating, as section D colours it. */
const ratingTone = (r: string): Tone =>
  r === 'Not shown' ? 'rose' : /^(Low|Low to moderate)$/.test(r) ? 'amber' : /Strongest|High|Moderate to high/.test(r) ? 'cyan' : 'neutral';

/** How the five compared: the section D ratings, each row lit as the narration
 *  reaches its rank (sentences 1, 4, 5 and 6 of s25; the footnote at sentence 7). */
export function Why({ dur, marks }: { dur: number; marks: number[] }) {
  const f = useCurrentFrame();
  const m = (i: number, frac: number) => marks[i] ?? Math.round(dur * frac);
  const rowAt = [m(0, 0.02), m(3, 0.35), m(4, 0.5), m(5, 0.65), m(5, 0.65)];
  const lit = rowAt.filter(t => f >= t).length - 1;
  const cols = '70px 440px repeat(4, 1fr)';
  return (
    <Frame chapter={2} stage={<DeterminingTag />} source={`Sections D and E. ${cite(['mti2025', 'malaya2025', 'ra10869', 'wsg', 'moe2025'])}`}>
      <H size={54}>How the five compared</H>
      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: cols, columnGap: 14, rowGap: 10, alignItems: 'center' }}>
        <span />
        <span />
        {CRITERIA.map(c => (
          <span key={c.key} style={{ fontFamily: F.mono, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: c.key === 'effectiveness' ? C.cyan300 : C.mute }}>{c.label}{c.key === 'effectiveness' ? ' · emphasis' : ''}</span>
        ))}
        {RANKED.map((s, i) => {
          const on = i === lit || (lit >= 3 && i >= 3);
          return (
            <In key={s.id} at={rowAt[i]} style={{ display: 'contents' }}>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 44, color: on ? C.cyan300 : C.mute }}>{s.rank}</span>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, color: on ? C.white : C.mute, lineHeight: 1.15 }}>
                {s.short.replace(/ PH$/, '')}<span style={{ fontFamily: F.mono, fontSize: 18, color: C.mute, marginLeft: 12 }}>{s.where.toUpperCase()}</span>
              </span>
              {CRITERIA.map(c => (
                <span key={c.key} style={{ opacity: on ? 1 : 0.55 }}><Chip tone={ratingTone(s.criteria[c.key].r)} size={22}>{s.criteria[c.key].r}</Chip></span>
              ))}
            </In>
          );
        })}
      </div>
      <In at={m(6, 0.85)} style={{ marginTop: 26 }}><Banner tone="rose" style={{ fontSize: 26 }}>Not shown: no published outcome evaluation was found. It does not mean the programme failed.</Banner></In>
    </Frame>
  );
}

/* ---------------------------------------------------------------- chapter 3 */
const Hypothetical = () => <Chip tone="amber">Hypothetical illustration · not a real person</Chip>;

export function Maria() {
  const j = JOURNEY[0];
  return (
    <Frame chapter={3} stage={<Hypothetical />} source={cite(j.ref)}>
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 80, alignItems: 'center', height: '90%' }}>
        <In><svg viewBox="0 0 200 220" width={380} aria-hidden>
          <circle cx="100" cy="70" r="46" fill="none" stroke={C.mute} strokeWidth="4" />
          <path d="M20 215 C 20 150, 60 128, 100 128 C 140 128, 180 150, 180 215" fill="none" stroke={C.mute} strokeWidth="4" />
        </svg></In>
        <div>
          <In at={10}><H size={96}>Maria</H></In>
          <In at={18}><P size={38} color={C.mute} style={{ marginTop: 12 }}>{j.who.split(', ')[1]} · hypothetical</P></In>
          <In at={40}><Card style={{ marginTop: 40 }}>
            <div style={{ fontFamily: F.mono, fontSize: 24, color: C.cyan300, textTransform: 'uppercase' }}>Step 1 · {j.stage}</div>
            <H size={50} style={{ marginTop: 12 }}>{j.label}</H>
            <P size={34} style={{ marginTop: 12 }}>Parts of her role are automated. Her job is not removed.</P>
          </Card></In>
        </div>
      </div>
    </Frame>
  );
}

export function Journey({ dur, marks }: { dur: number; marks: number[] }) {
  const f = useCurrentFrame();
  /* Step 1 was the previous scene. The narration's three sentences cover step 2,
     steps 3 and 4 (hired, then trained), and steps 5 and 6 (allowance, then
     recording); each step lights when its part of the narration begins. */
  const [a = 0, b = dur * 0.25, c = dur * 0.65] = marks;
  const at = [a, b, b + (c - b) / 2, c, c + (dur - c) * 0.45];
  const active = 1 + Math.max(0, at.filter(t => f >= t).length - 1);
  const since = at[active - 1] ?? 0;
  const move = interpolate(f, [since, since + 14], [active - 1, active], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const col = (1680 - 5 * 18) / 6;
  const refs = JOURNEY.flatMap(j => j.ref);
  return (
    <Frame chapter={3} stage={<Hypothetical />} source={cite(refs)}>
      {/* Maria (hypothetical) moving through the steps */}
      <div style={{ position: 'relative', height: 64 }}>
        <svg viewBox="0 0 40 50" width={46} height={58} style={{ position: 'absolute', left: move * (col + 18) + col / 2 - 23, top: 0 }} aria-hidden>
          <circle cx="20" cy="13" r="10" fill="none" stroke={C.amber} strokeWidth="3" />
          <path d="M3 50 C 3 34, 11 28, 20 28 C 29 28, 37 34, 37 50" fill="none" stroke={C.amber} strokeWidth="3" />
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18, marginTop: 6 }}>
        {JOURNEY.map((j, i) => {
          const on = i === active, done = i < active, proposed = j.step === 5;
          return (
            <In key={j.step} at={Math.round(dur * 0.02) + i * 4}>
              <Card tone={on ? (proposed ? 'amber' : 'cyan') : undefined} style={{ height: 420, padding: '24px 22px', opacity: on ? 1 : done ? 0.75 : 0.45 }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 60, color: on ? (proposed ? C.amber : C.cyan300) : C.mute }}>{j.step}</div>
                <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase', marginTop: 10, minHeight: 56 }}>{j.stage}</div>
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 32, color: C.white, marginTop: 14, lineHeight: 1.15 }}>{j.label}</div>
                <P size={26} color={C.mute} style={{ marginTop: 14 }}>{j.who}</P>
                {proposed && <div style={{ marginTop: 18 }}><Chip tone="amber" size={22}>Proposed</Chip></div>}
              </Card>
            </In>
          );
        })}
      </div>
      <In at={Math.round(dur * 0.85)} style={{ marginTop: 26 }}><Banner tone="amber">No income-support rule exists for mid-career conversion trainees. The proposal would have to create one.</Banner></In>
    </Frame>
  );
}

export function Actors({ dur }: { dur: number }) {
  const actors = IMPL_ACTORS.filter(a => a.id !== 'worker');
  return (
    <Frame chapter={3} source={cite(actors.flatMap(a => a.ref))}>
      <div style={{ display: 'grid', gridTemplateColumns: '640px 1fr', gap: 60 }}>
        <In><div>
          <Img src={MEDIA.tesda.src} style={{ width: 640, height: 400, objectFit: 'cover', borderRadius: 20 }} />
          <div style={{ fontFamily: F.mono, fontSize: 20, color: C.mute, marginTop: 14 }}>{photoCredit(MEDIA.tesda)}. TESDA training centre, Taguig City.</div>
        </div></In>
        <div>
          <H size={56}>Proposed roles</H>
          <div style={{ marginTop: 20, display: 'grid', gap: 6 }}>
            {actors.map((a, i) => (
              <In key={a.id} at={Math.round(dur * 0.05) + i * 6}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${C.line}`, paddingBottom: 12 }}>
                <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 34 }}>{a.name}</span>
                <span style={{ display: 'flex', gap: 8 }}>{a.stages.map(s => <Chip key={s} size={20}>{IMPL_STAGES.find(x => x.key === s)!.label}</Chip>)}</span>
              </div></In>
            ))}
          </div>
        </div>
      </div>
      <In at={Math.round(dur * 0.7)} style={{ marginTop: 18 }}><Banner tone="rose">Proposed only. None approached or agreed. No budget allocated.</Banner></In>
    </Frame>
  );
}

/* ---------------------------------------------------------------- chapter 4 */
const SuccessTag = () => <Chip tone="cyan" filled>Evaluating Success · four required criteria</Chip>;
const PlanningBanner = () => <Banner tone="amber" style={{ fontSize: 26, padding: '10px 22px' }}>Planning targets, not results</Banner>;

export function SuccessIntro() {
  return (
    <Frame chapter={4} stage={<><SuccessTag /><PlanningBanner /></>} source="Section I; targets from section H">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 40 }}>
        {PROPOSAL_CRITERIA.map((c, i) => (
          <In key={c.label} at={10 + i * 8}><div style={{ background: C.cyan400, color: C.ink950, borderRadius: 20, padding: '60px 32px', fontFamily: F.display, fontWeight: 800, fontSize: 46, textAlign: 'center' }}>{c.label}</div></In>
        ))}
      </div>
      <In at={60} style={{ marginTop: 60 }}><P size={36} color={C.mute}>Separate from the four selected criteria used to compare the alternatives in chapter 2.</P></In>
    </Frame>
  );
}

/** What each criterion asks: the student's working explanations, not verbatim workbook wording (tracked in the QA report). */
const MEANING = [
  'Could it stay viable and keep benefiting workers?',
  'What would workers gain?',
  'What would implementation need in the Philippines?',
  'Would it achieve its intended outcomes?',
];
/** The evidence each verdict rests on, condensed from PROPOSAL_CRITERIA[i].body. */
const EVIDENCE_SHORT = [
  'RA 12063 framework · PESO delivery · ₱740M over three years only',
  'Keeps income during the transition · 12.7M in exposed occupations',
  'Employed workers eligible (RA 12063 s.6) · employer deduction (s.20)',
  'Singapore only: +2.5% · +5.8% to 6.5% · +3.9 pp retention',
];
/** On-screen rows, in the same order and kinds as PROPOSAL_CRITERIA[i].assess.
 *  `ring`/`dots` draw the SMART planning target beside the row (C8). */
const ROWS: { kind: AssessKind; t: string; ring?: string; dots?: number }[][] = [
  [{ kind: 'gap', t: 'No dedicated sustainability indicator' },
   { kind: 'proxy', t: `${smart('m2').name} at 12 months` },
   { kind: 'qualitative', t: 'Funding beyond three years · employer participation after a first cohort' }],
  [{ kind: 'indicator', t: `${smart('m3').name}: ${smart('m3').target.toLowerCase()}`, ring: '80%' },
   { kind: 'indicator', t: `${smart('m5').name}` },
   { kind: 'baseline', t: `${smart('m6').name}` },
   { kind: 'limitation', t: 'A first cohort reaches a small fraction of exposed workers' }],
  [{ kind: 'indicator', t: `${smart('m4').name}: ${smart('m4').target}`, dots: 30 },
   { kind: 'qualitative', t: 'Income-support rule and matching function in place' },
   { kind: 'limitation', t: smart('m4').assumption.replace(/\.$/, '') }],
  [{ kind: 'indicator', t: `${smart('m1').name}: ${smart('m1').target}`, ring: '75%' },
   { kind: 'indicator', t: `${smart('m2').name}: ${smart('m2').target}`, ring: '70%' },
   { kind: 'indicator', t: `${smart('m3').name}, against previous pay` },
   { kind: 'limitation', t: 'No Philippine baseline. A first cohort would set it' }],
];
const KIND_TONE: Record<AssessKind, Tone> = { indicator: 'cyan', baseline: 'neutral', proxy: 'neutral', qualitative: 'neutral', gap: 'rose', limitation: 'amber' };
const verdictTone = (v: string): Tone => v.startsWith('Not') ? 'rose' : v.startsWith('Moderate,') ? 'amber' : 'cyan';
const CRIT_REFS: RefKey[][] = [['ra12063', 'ra10869', 'malaya2025'], ['huynh2026'], ['ra12063'], ['mti2025']];

export function Criterion({ i, dur }: { i: number; dur: number }) {
  const c = PROPOSAL_CRITERIA[i];
  const rows = ROWS[i];
  return (
    <Frame chapter={4} stage={<><SuccessTag /><PlanningBanner /></>} source={`${cite(CRIT_REFS[i])}. Sections H, I and J`}>
      <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: 70 }}>
        <div>
          <In><div style={{ fontFamily: F.mono, fontSize: 24, color: C.mute }}>{i + 1} OF 4</div></In>
          <In at={4}><H size={88} style={{ marginTop: 12 }}>{c.label}</H></In>
          <In at={12}><P size={36} color={C.mute} style={{ marginTop: 18 }}>{MEANING[i]}</P></In>
          <In at={Math.round(dur * 0.12)} style={{ marginTop: 34 }}><Chip tone={verdictTone(c.verdict)} size={30}>{c.verdict}</Chip></In>
          <In at={Math.round(dur * 0.2)} style={{ marginTop: 34 }}>
            {i === 0 ? <FundingHorizon at={Math.round(dur * 0.22)} />
              : i === 2 ? <StatuteSchedule at={Math.round(dur * 0.22)} />
              : <>
                  <div style={{ fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase' }}>{i === 3 ? 'Published evidence · Singapore only' : 'Evidence'}</div>
                  <P size={32} style={{ marginTop: 10 }}>{EVIDENCE_SHORT[i]}</P>
                </>}
          </In>
        </div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 22, color: C.mute, textTransform: 'uppercase' }}><span>How success would be assessed</span>{rows.some(r => r.ring || r.dots) && <span style={{ color: C.amber }}>Dashed: Philippine planning target</span>}</div>
          <div style={{ marginTop: 22, display: 'grid', gap: 18 }}>
            {rows.map((r, k) => (
              <In key={r.t} at={Math.round(dur * (0.35 + k * 0.12))}>
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr auto', gap: 18, alignItems: 'center' }}>
                  <span><Chip tone={KIND_TONE[r.kind]} size={22}>{ASSESS_KIND_LABEL[r.kind]}</Chip></span>
                  <div>
                    <P size={30}>{r.t}</P>
                    {r.dots && <div style={{ marginTop: 8 }}><TargetDots n={r.dots} at={Math.round(dur * (0.4 + k * 0.12))} /></div>}
                  </div>
                  {r.ring ? <TargetRing value={r.ring} at={Math.round(dur * (0.38 + k * 0.12))} /> : <span />}
                </div>
              </In>
            ))}
          </div>
        </Card>
      </div>
    </Frame>
  );
}

export function SuccessSummary() {
  const cols: { k: AssessKind[]; l: string; tone: Tone }[] = [
    { k: ['indicator', 'baseline'], l: 'SMART indicators', tone: 'cyan' },
    { k: ['proxy'], l: 'Proxy', tone: 'neutral' },
    { k: ['qualitative'], l: 'Qualitative', tone: 'neutral' },
    { k: ['gap'], l: 'Measurement gap', tone: 'rose' },
  ];
  return (
    <Frame chapter={4} stage={<><SuccessTag /><PlanningBanner /></>} source="Section I, from the SMART indicators in section H">
      <div style={{ display: 'grid', gridTemplateColumns: '380px repeat(4, 1fr)', rowGap: 18, columnGap: 18, alignItems: 'center' }}>
        <span />
        {cols.map(c => <div key={c.l} style={{ fontFamily: F.mono, fontSize: 24, color: C.mute, textTransform: 'uppercase', textAlign: 'center' }}>{c.l}</div>)}
        {PROPOSAL_CRITERIA.map((pc, i) => (
          <In key={pc.label} at={6 + i * 8} style={{ display: 'contents' }}>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44, color: C.white }}>{pc.label}</div>
            {cols.map(c => {
              const n = pc.assess.filter(a => c.k.includes(a.kind)).length;
              const tone = TONE[c.tone];
              return <div key={c.l} style={{ height: 110, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${n ? tone.border : C.line}`, background: n ? tone.bg : 'transparent',
                fontFamily: F.display, fontWeight: 800, fontSize: 52, color: n ? tone.fg : 'rgba(143,166,191,0.35)' }}>{n || '–'}</div>;
            })}
          </In>
        ))}
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- chapter 5 */
/** The Makati skyline (a 3008×784 panorama) as a band across the lower frame. */
function MakatiBand() {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const x = interpolate(f, [0, durationInFrames], [0, -40]);
  return (
    <AbsoluteFill>
      <Img src={PHOTOS.makati.src} style={{ position: 'absolute', left: x, bottom: 0, width: 1960, height: 510, objectFit: 'cover', opacity: 0.55 }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink950} 0%, rgba(3,7,17,0.92) 45%, rgba(3,7,17,0.35) 75%, rgba(3,7,17,0.6) 100%)` }} />
    </AbsoluteFill>
  );
}
export function Conclusion({ dur }: { dur: number }) {
  const lines = [ // CONCLUSION[0][0], CONCLUSION[1][0..1], CONCLUSION[2][2..3] scoped as PROPOSAL.gap.missing
    'Automation is changing Filipino jobs more than removing them, but unevenly.',
    'Selected: a Philippine adaptation of Singapore’s place-and-train model.',
    'It builds on existing laws, incentives and offices, adding employer-linked conversion with income support.',
    'Judged against the four criteria and the SMART measures, not assumed.',
  ];
  return (
    <Frame chapter={5} bg={<MakatiBand />} source={cite(['huynh2026', 'mti2025', 'ra12063'])} credit={`${vphotoCredit(PHOTOS.makati)} · Makati at night`}>
      <div style={{ display: 'grid', gap: 30, maxWidth: 1450 }}>
        {lines.map((l, i) => (
          <In key={l} at={Math.round(dur * (0.02 + i * 0.2))}><div style={{ display: 'flex', gap: 30 }}>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 48, color: i === 2 ? C.amber : C.cyan300, width: 60 }}>{i + 1}</span>
            <H size={i === 0 ? 58 : 50} style={{ fontWeight: 600, color: i === 0 ? C.white : C.sand }}>{l}</H>
          </div></In>
        ))}
      </div>
    </Frame>
  );
}

export function Credits() {
  const site = [MEDIA.hero, MEDIA.itPark, MEDIA.tesda].map(m => ({ k: m.key, line: `${m.creator}, Wikimedia Commons. ${m.license}${LICENCE_URI[m.license] ? ` (${LICENCE_URI[m.license]})` : ''}. ${VIDEO_CHANGES[m.key]}` }));
  const extra = Object.values(PHOTOS).map(p => ({ k: p.key, line: `${p.creator} (${p.year}), Wikimedia Commons. ${p.license} (${p.licenseUrl}). ${p.changes}` }));
  return (
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <Eyebrow>Sources</Eyebrow>
          <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
            {VIDEO_REFS.map(k => <P key={k} size={28}>{shortCite(k)}</P>)}
          </div>
          <P size={26} color={C.mute} style={{ marginTop: 20 }}>Full APA references: section L of the website.</P>
        </div>
        <div>
          <Eyebrow>Photographs (illustrative only)</Eyebrow>
          <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
            {[...site, ...extra].map(x => <P key={x.k} size={20} color={C.sand}>{x.line}</P>)}
          </div>
          <Eyebrow color={C.amber}>{' '}</Eyebrow>
          <P size={20} color={C.mute} style={{ marginTop: 6 }}>Website photographs are also credited in section L.</P>
          <P size={21} style={{ marginTop: 12 }}>Narration: AI-generated voice (Kokoro af_heart, run locally), not the student’s real voice and not a clone of it. {SCRIPT_STATUS} The research and academic decisions remain the student’s responsibility.</P>
          <P size={22} color={C.cyan300} style={{ marginTop: 10 }}>{VIDEO_LICENCE}</P>
          <P size={26} color={C.mute} style={{ marginTop: 16 }}>Full research: {SITE_URL}</P>
        </div>
      </div>
    </Frame>
  );
}
