import { createContext, useContext } from 'react';

/**
 * The two rooms of the site and the one presentation video.
 *
 * `view` is the research document (Home, Explore and Sources, one scrolling page) or
 * the Watch theatre (#watch). The video plays in one of two places: on the Home
 * stage, or in the theatre. Only one of them holds a video element at a time, so
 * there is never more than one player. `play` starts it on the Home stage; `watch`
 * opens the theatre and seeks there. Moving between the two carries the position.
 */
export type View = 'document' | 'watch';
export type Surface = 'home' | 'theatre';

export interface PresentationState {
  /** False on the published site until the video is approved (VIDEO_EXPLAINER.ready). */
  enabled: boolean;
  view: View;
  /** Play on the Home stage from `start` seconds (default: the beginning). */
  play: (start?: number) => void;
  /** Open the theatre and play from `start` seconds (default: the beginning). */
  watch: (start?: number) => void;
  /** Leave the theatre, back to where the visitor was in the document. */
  leave: () => void;
  /** True once the visitor has started the video on the Home stage. */
  homeLive: boolean;
  /** The latest request, for the player on that surface to act on. `id` changes on every request. */
  request: { start: number; id: number; surface: Surface } | null;
}

export const PresentationCtx = createContext<PresentationState>({
  enabled: false, view: 'document', play: () => {}, watch: () => {}, leave: () => {},
  homeLive: false, request: null,
});

export const usePresentation = () => useContext(PresentationCtx);
