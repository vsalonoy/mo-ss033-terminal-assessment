import { Composition, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { Explainer, type ExplainerProps } from './Explainer';
import { buildTimeline, type Manifest } from './timeline';
import { FPS, H, W } from './theme';

/* The website's own fonts, copied from its node_modules by `npm run assets`. */
loadFont({ family: 'Inter Variable', url: staticFile('fonts/inter-latin-wght-normal.woff2'), weight: '100 900' });
loadFont({ family: 'Space Grotesk Variable', url: staticFile('fonts/space-grotesk-latin-wght-normal.woff2'), weight: '300 700' });
loadFont({ family: 'IBM Plex Mono', url: staticFile('fonts/ibm-plex-mono-latin-500-normal.woff2'), weight: '500' });

/** Uses the voiced manifest when it exists; otherwise estimated timing, marked as a draft. */
async function loadManifest(): Promise<Manifest | null> {
  try {
    const r = await fetch(staticFile('audio/manifest.json'));
    return r.ok ? await r.json() as Manifest : null;
  } catch { return null; }
}

export function Root() {
  return (
    <Composition
      id="Explainer"
      component={Explainer}
      fps={FPS} width={W} height={H}
      durationInFrames={1}
      defaultProps={{ timeline: null, burnCaptions: false } satisfies ExplainerProps}
      calculateMetadata={async ({ props }) => {
        const timeline = buildTimeline(await loadManifest());
        return { durationInFrames: timeline.total, props: { ...props, timeline } };
      }}
    />
  );
}
