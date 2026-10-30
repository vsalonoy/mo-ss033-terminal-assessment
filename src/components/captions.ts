/**
 * The captions place each cue with `line:96%,end`: the cue's bottom edge at 96
 * percent of the frame. A browser without WebVTT line alignment (Chrome) reads that
 * as the cue's top edge, so a two-line caption runs off the bottom and only its
 * first line shows. There, fall back to the default bottom placement. The caption
 * file and its text and timing are unchanged.
 */
export function placeCues(track: TextTrack | null) {
  if (!track?.cues || typeof VTTCue === 'undefined' || 'lineAlign' in VTTCue.prototype) return;
  /* snapToLines must come back on as well: an auto line without it sits at 100%, below the frame. */
  for (const cue of track.cues) if (cue instanceof VTTCue && cue.line !== 'auto') { cue.snapToLines = true; cue.line = 'auto'; }
  /* A showing track redraws its cues only when its mode changes. */
  const mode = track.mode;
  track.mode = 'hidden';
  track.mode = mode;
}
