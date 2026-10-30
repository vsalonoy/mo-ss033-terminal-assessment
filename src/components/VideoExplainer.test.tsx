import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { VIDEO_EXPLAINER, CHAPTERS } from '../data/video';
import { placeCues } from './captions';
/* A tracked copy of the v4 captions, so the suite runs from a clean checkout:
   video/out/ is ignored by git. The drift test below compares the two locally. */
import vtt from '../test/fixtures/explainer.en.vtt?raw';

/*
 * The presentation player in the Watch theatre. It is on since the v4 video was
 * approved (D-3), and switching `ready` off must still remove it completely. When on
 * there must only ever be one video element: Watch, chapters and Start over all seek
 * that same element, and the element exists only while the theatre is open.
 */

const videos = () => document.querySelectorAll('video');

describe('presentation player: published state', () => {
  beforeEach(() => history.replaceState(null, '', '/'));

  it('is switched on for the approved v4 video, from relative paths', () => {
    expect(VIDEO_EXPLAINER.ready).toBe(true);
    expect([VIDEO_EXPLAINER.src, VIDEO_EXPLAINER.captions, VIDEO_EXPLAINER.poster])
      .toEqual(['video/explainer.mp4', 'video/explainer.en.vtt', 'video/explainer-poster.jpg']);
    render(<App />);
    /* Watch is offered, but no video element exists until a visitor chooses it. */
    expect(screen.getByRole('button', { name: /Watch the Research/ })).toBeInTheDocument();
    expect(videos()).toHaveLength(0);
  });
});

describe('presentation player: switched off (ready set back to false)', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/');
    VIDEO_EXPLAINER.ready = false;
  });
  afterEach(() => { VIDEO_EXPLAINER.ready = true; });

  it('renders no player, Watch button or chapter list', () => {
    render(<App />);
    expect(videos()).toHaveLength(0);
    expect(screen.queryByRole('button', { name: /Watch the Research/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^▶ Watch$/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Watch this chapter/ })).toBeNull();
    /* The photographs, Explore and the sources still work without it. */
    expect(screen.getByRole('region', { name: /Illustrative photographs/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore the Research/ })).toHaveAttribute('href', '#explore');
    const doors = screen.getByRole('navigation', { name: 'Two ways into the research' });
    expect(within(doors).getAllByRole('link').map(a => a.getAttribute('href'))).toEqual(['#sources', '#explore']);
  });

  it('answers #watch with a plain notice, never an empty page or a player', () => {
    history.replaceState(null, '', '/#watch');
    render(<App />);
    expect(videos()).toHaveLength(0);
    expect(screen.getByRole('heading', { level: 1, name: /not available on this site yet/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chapter 1: The issue/ })).toHaveAttribute('href', '#chapter-1');
  });
});

describe('presentation player: local preview', () => {
  let play: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    history.replaceState(null, '', '/');
    vi.stubEnv('VITE_VIDEO_PREVIEW', '1');
    play = vi.fn(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play as never);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });

  const loaded = (v: HTMLVideoElement) => {
    Object.defineProperty(v, 'readyState', { configurable: true, value: 1 });
    fireEvent(v, new Event('loadedmetadata'));
  };
  const openTheatre = () => fireEvent.click(screen.getByRole('button', { name: /Watch the Research/ }));

  it('creates no video until the visitor chooses to watch', () => {
    render(<App />);
    expect(videos()).toHaveLength(0);
    expect(play).not.toHaveBeenCalled();
  });

  it('Watch opens the theatre with exactly one player and plays from the start', () => {
    render(<App />);
    openTheatre();
    expect(location.hash).toBe('#watch');
    expect(videos()).toHaveLength(1);
    /* The research document is hidden behind the theatre, not shown under the player. */
    expect(document.getElementById('main')!.closest('[hidden]')).not.toBeNull();
    const v = videos()[0];
    loaded(v);
    expect(v.currentTime).toBe(0);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('uses native controls and captions, and never autoplays on its own', () => {
    render(<App />);
    openTheatre();
    const v = videos()[0];
    expect(v).toHaveAttribute('controls');
    expect(v).not.toHaveAttribute('autoplay');
    expect(v).toHaveAttribute('preload', 'metadata');
    expect(v).toHaveAttribute('playsinline');
    expect(v).toHaveAccessibleName(VIDEO_EXPLAINER.title);
    const track = v.querySelector('track')!;
    expect(track).toHaveAttribute('kind', 'captions');
    expect(track).toHaveAttribute('srclang', 'en');
    expect(track).toHaveAttribute('default');
  });

  it('chapter buttons, Explore chips and Start over seek the same element and never add a second one', () => {
    render(<App />);
    /* A chapter chip in Explore opens the theatre at that chapter. */
    fireEvent.click(within(document.getElementById('chapter-2')!).getByRole('button', { name: /Watch this chapter/ }));
    const v = videos()[0];
    loaded(v);
    expect(v.currentTime).toBeCloseTo(121.3);

    const nav = screen.getByRole('navigation', { name: /Chapters/ });
    fireEvent.click(within(nav).getByRole('button', { name: /Conclusion/ }));
    expect(videos()).toHaveLength(1);
    expect(videos()[0]).toBe(v);
    expect(v.currentTime).toBeCloseTo(450.7);

    fireEvent.click(screen.getByRole('button', { name: /Start over/ }));
    expect(videos()[0]).toBe(v);
    expect(v.currentTime).toBe(0);
    expect(play).toHaveBeenCalledTimes(3);
  });

  it('links each chapter to its evidence in Explore', () => {
    render(<App />);
    openTheatre();
    const nav = screen.getByRole('navigation', { name: /Chapters/ });
    const links = within(nav).getAllByRole('link', { name: /See the evidence/ });
    expect(links.map(l => l.getAttribute('href'))).toEqual(['#chapter-1', '#chapter-2', '#chapter-3', '#chapter-4', '#chapter-5']);
  });

  it('leaving the theatre removes the player', () => {
    render(<App />);
    openTheatre();
    expect(videos()).toHaveLength(1);
    history.replaceState(null, '', '/#explore');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(videos()).toHaveLength(0);
  });

  it('discloses the AI voice, states the licence and offers the transcript by chapter', () => {
    render(<App />);
    openTheatre();
    expect(screen.getByText(/AI-generated voice\. It is not my voice/)).toBeInTheDocument();
    const notes = document.getElementById('presentation-notes')!;
    expect(within(notes).getByRole('link', { name: /CC BY-SA 4\.0/ })).toHaveAttribute('href', VIDEO_EXPLAINER.licenceUrl);
    fireEvent.click(screen.getByRole('button', { name: /Read the transcript/ }));
    const titles = [...document.querySelectorAll('#presentation-notes h3')].map(h => h.textContent);
    expect(titles).toEqual(VIDEO_EXPLAINER.transcript.map(t => t.title));
  });

  it('falls back to the transcript and a download link when the video cannot load', () => {
    render(<App />);
    openTheatre();
    fireEvent.error(videos()[0]);
    expect(screen.getByRole('status')).toHaveTextContent(/could not be loaded/);
    expect(screen.getByRole('link', { name: 'download the video' })).toHaveAttribute('href', VIDEO_EXPLAINER.src);
  });
});

describe('presentation player: Home stage', () => {
  let play: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    history.replaceState(null, '', '/');
    vi.stubEnv('VITE_VIDEO_PREVIEW', '1');
    play = vi.fn(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play as never);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });
  const loaded = (v: HTMLVideoElement) => {
    Object.defineProperty(v, 'readyState', { configurable: true, value: 1 });
    fireEvent(v, new Event('loadedmetadata'));
  };
  const stage = () => document.getElementById('home-video')!;

  it('opens Home on the video: a poster and a play button, with no video element yet', () => {
    render(<App />);
    const button = within(stage()).getByRole('button', { name: /Play the video presentation, 8:14/ });
    expect(button.querySelector('img')).toHaveAttribute('src', VIDEO_EXPLAINER.poster);
    expect(videos()).toHaveLength(0);
  });

  it('counts the same five numbered chapters on the stage and on the Watch card', () => {
    render(<App />);
    const numbered = CHAPTERS.filter(c => !c.sub && c.n >= 1 && c.n <= 5).length;
    expect(numbered).toBe(5);
    expect(within(stage()).getByRole('button', { name: /Play the video presentation/ })).toHaveTextContent(`· Captions on · ${numbered} chapters`);
    expect(screen.getByRole('button', { name: /Watch the Research/ })).toHaveTextContent(`${numbered} chapters`);
  });

  it('plays in place on Home, without opening the theatre', () => {
    render(<App />);
    fireEvent.click(within(stage()).getByRole('button', { name: /Play the video presentation/ }));
    expect(location.hash).toBe('');
    expect(videos()).toHaveLength(1);
    const v = videos()[0];
    expect(stage()).toContainElement(v);
    expect(v).toHaveAttribute('controls');
    expect(v).toHaveAttribute('poster', VIDEO_EXPLAINER.poster);
    expect(v.querySelector('track')).toHaveAttribute('default');
    loaded(v);
    expect(v.currentTime).toBe(0);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('Home chapters seek the same element', () => {
    render(<App />);
    const nav = within(stage()).getByRole('navigation', { name: 'Video chapters' });
    fireEvent.click(within(nav).getByRole('button', { name: /Evaluating success/ }));
    const v = videos()[0];
    loaded(v);
    expect(v.currentTime).toBeCloseTo(296.6);
    fireEvent.click(within(nav).getByRole('button', { name: /Conclusion/ }));
    expect(videos()).toHaveLength(1);
    expect(videos()[0]).toBe(v);
    expect(v.currentTime).toBeCloseTo(450.7);
  });

  it('hands the position to the theatre, which then holds the only player', () => {
    render(<App />);
    fireEvent.click(within(stage()).getByRole('button', { name: /Play the video presentation/ }));
    const home = videos()[0];
    loaded(home);
    home.currentTime = 200;
    fireEvent.timeUpdate(home);
    fireEvent.click(screen.getByRole('button', { name: /Open the theatre/ }));
    expect(location.hash).toBe('#watch');
    expect(videos()).toHaveLength(1);
    const theatre = videos()[0];
    expect(document.getElementById(VIDEO_EXPLAINER.id)).toContainElement(theatre);
    loaded(theatre);
    expect(theatre.currentTime).toBe(200);
  });
});

describe('chapter times', () => {
  /* Cue start times from the captions rendered with the v4 master (read-only). */
  const cues = [...vtt.matchAll(/(\d\d):(\d\d):(\d\d\.\d+) -->/g)]
    .map(([, h, m, s]) => Number(h) * 3600 + Number(m) * 60 + Number(s));

  it('captions file is the 133-cue v4 file', () => expect(cues).toHaveLength(133));

  /* Empty on a clean checkout, where video/out/ does not exist. */
  const rendered = Object.values(import.meta.glob<string>('../../video/out/explainer.en.vtt', { query: '?raw', import: 'default', eager: true }));
  it.skipIf(rendered.length === 0)('fixture is identical to the rendered captions, where they exist', () => {
    expect(vtt).toBe(rendered[0]);
  });

  it('each chapter starts on its chapter card, within 2.5 s before its first caption', () => {
    for (const c of CHAPTERS) {
      const first = cues.find(t => t >= c.start)!;
      expect(first - c.start).toBeGreaterThanOrEqual(0);
      expect(first - c.start).toBeLessThanOrEqual(2.5);
    }
  });

  it('is in order and inside the 494.187 s master', () => {
    const starts = CHAPTERS.map(c => c.start);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
    expect(starts.at(-1)!).toBeLessThan(VIDEO_EXPLAINER.durationSeconds);
  });
});

describe('caption placement fallback', () => {
  /* A browser without WebVTT line alignment, as Chrome is. */
  class FakeCue { line: number | 'auto' = 96; snapToLines = false; }

  it('moves cues to the default bottom placement where line alignment is unsupported', () => {
    vi.stubGlobal('VTTCue', FakeCue);
    const cues = [new FakeCue(), new FakeCue()];
    const track = { cues, mode: 'showing' } as unknown as TextTrack;
    placeCues(track);
    expect(cues.every(c => c.line === 'auto' && c.snapToLines)).toBe(true);
    expect(track.mode).toBe('showing');
  });

  it('keeps the authored placement where line alignment is supported', () => {
    class AlignedCue extends FakeCue { lineAlign = 'end'; }
    Object.defineProperty(AlignedCue.prototype, 'lineAlign', { value: 'end' });
    vi.stubGlobal('VTTCue', AlignedCue);
    const cues = [new AlignedCue()];
    placeCues({ cues, mode: 'showing' } as unknown as TextTrack);
    expect(cues[0].line).toBe(96);
  });
});
