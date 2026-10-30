import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import type { SceneKey } from './narration';
import { cues, twoLines, type Timeline } from './timeline';
import { C, F } from './theme';
import * as S from './scenes';

export type ExplainerProps = {
  timeline: Timeline | null;
  /** Burn captions into the picture. Off for the website, which uses a WebVTT track. */
  burnCaptions: boolean;
};

function scene(key: SceneKey, props: Record<string, unknown> | undefined, dur: number, marks: number[]) {
  switch (key) {
    case 'openTitle': return <S.OpenTitle />;
    case 'openResearcher': return <S.OpenResearcher />;
    case 'openRoadmap': return <S.OpenRoadmap dur={dur} />;
    case 'chapter': return <S.Chapter n={props!.n as number} />;
    case 'network': return <S.Network dur={dur} />;
    case 'stats': return <S.Stats dur={dur} />;
    case 'uneven': return <S.Uneven dur={dur} />;
    case 'position': return <S.Position />;
    case 'five': return <S.Five dur={dur} />;
    case 'program': return <S.Program />;
    case 'evidence': return <S.Evidence dur={dur} />;
    case 'proposal': return <S.Proposal />;
    case 'why': return <S.Why dur={dur} marks={marks} />;
    case 'maria': return <S.Maria />;
    case 'journey': return <S.Journey dur={dur} marks={marks} />;
    case 'actors': return <S.Actors dur={dur} />;
    case 'successIntro': return <S.SuccessIntro />;
    case 'criterion': return <S.Criterion i={props!.i as number} dur={dur} />;
    case 'successSummary': return <S.SuccessSummary />;
    case 'conclusion': return <S.Conclusion dur={dur} />;
    case 'credits': return <S.Credits />;
  }
}

function Captions({ timeline }: { timeline: Timeline }) {
  const f = useCurrentFrame();
  const cue = cues(timeline).find(c => f >= c.start && f < c.end);
  if (!cue) return null;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54 }}>
      <div style={{ background: 'rgba(3,7,17,0.86)', color: C.white, fontFamily: F.sans, fontSize: 40, lineHeight: 1.3,
        padding: '10px 26px', borderRadius: 8, textAlign: 'center', whiteSpace: 'pre-line', maxWidth: 1400 }}>{twoLines(cue.text)}</div>
    </AbsoluteFill>
  );
}

export function Explainer({ timeline, burnCaptions }: ExplainerProps) {
  if (!timeline) return null;
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      {timeline.segments.map(s => (
        <Sequence key={s.seg.id} from={s.from} durationInFrames={s.frames} name={`${s.seg.id} ${s.seg.scene}`}>
          {scene(s.seg.scene, s.seg.props, s.frames, s.sentences.map(x => x.from))}
          {timeline.voiced && s.sentences.map(sen => (
            <Sequence key={sen.id} from={sen.from} durationInFrames={sen.frames + 2} layout="none">
              <Audio src={staticFile(`audio/${sen.id}.wav`)} />
            </Sequence>
          ))}
        </Sequence>
      ))}
      {burnCaptions && <Captions timeline={timeline} />}
      {!timeline.voiced && (
        <div style={{ position: 'absolute', top: 28, right: 36, fontFamily: F.mono, fontSize: 22, color: C.amber, letterSpacing: '0.08em' }}>
          DRAFT · NO NARRATION · ESTIMATED TIMING
        </div>
      )}
    </AbsoluteFill>
  );
}
