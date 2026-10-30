import react from '@vitejs/plugin-react'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Local review of the presentation player, development server only.
 *
 * Since D-3 (30 October 2026) the approved v4 video, its captions and poster are in
 * public/video/, which is what a build publishes. This preview predates that and is
 * no longer needed; if it is switched on, the dev server serves the files below
 * instead of the copies in public/video/. To use it, put these two lines in
 * .env.development.local (ignored by git, and read only by `npm run dev`):
 *   VITE_VIDEO_PREVIEW=1
 *   VIDEO_PREVIEW_FILE=/path/to/explainer.mp4
 * The server then streams that file, unchanged, at video/explainer.mp4, with the
 * existing captions (video/out/explainer.en.vtt) and the poster frame
 * (video/out/explainer-poster.jpg), both read-only and both ignored by git. The
 * poster is one still taken from the master, which itself is never written to:
 *   ffmpeg -ss 0.2 -i "$VIDEO_PREVIEW_FILE" -frames:v 1 -vf scale=1600:-2 -q:v 3 video/out/explainer-poster.jpg
 * (the ffmpeg in video/node_modules/@remotion/compositor-darwin-arm64 works).
 *
 * `apply: 'serve'` keeps this out of `vite build` entirely. VIDEO_PREVIEW_FILE has no
 * VITE_ prefix, so the path is never exposed to page code.
 */
function localVideoPreview(file: string | undefined): Plugin {
  const files: Record<string, { path: string | undefined; type: string }> = {
    '/video/explainer.mp4': { path: file, type: 'video/mp4' },
    '/video/explainer.en.vtt': { path: 'video/out/explainer.en.vtt', type: 'text/vtt' },
    '/video/explainer-poster.jpg': { path: 'video/out/explainer-poster.jpg', type: 'image/jpeg' },
  }
  return {
    name: 'local-video-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const entry = files[(req.url ?? '').split('?')[0]]
        if (!entry?.path || !existsSync(entry.path)) return next()
        const size = statSync(entry.path).size
        const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '')
        res.setHeader('Content-Type', entry.type)
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Cache-Control', 'no-store')
        /* Seeking needs range requests: the browser fetches only the part it plays. */
        if (range) {
          const start = range[1] ? Number(range[1]) : 0
          const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
          res.statusCode = 206
          res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
          res.setHeader('Content-Length', end - start + 1)
          createReadStream(entry.path, { start, end }).pipe(res)
          return
        }
        res.setHeader('Content-Length', size)
        createReadStream(entry.path).pipe(res)
      })
    },
  }
}

/**
 * The publication gate. The video reaches a build only by setting `ready` in
 * src/data/video.ts after approval (D-3), never through the preview switch, so a
 * build with the switch set stops here.
 */
function previewNeverBuilt(on: boolean): Plugin {
  return {
    name: 'video-preview-never-built',
    apply: 'build',
    buildStart() {
      if (on) this.error('VITE_VIDEO_PREVIEW is for the local dev server only. Unset it before building.')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* '' loads every variable, not only VITE_ ones, so the config can read the path.
     Tests read no .env file (vitest.config.ts). */
  const env = { ...(mode === 'test' ? {} : loadEnv(mode, process.cwd(), '')), ...process.env }
  return {
    // Relative asset paths. The site is served from a GitHub Pages project
    // subpath (/mo-ss033-terminal-assessment/), and './' works there and from a
    // domain root without the base needing to change if the repository is ever
    // renamed. It still has to be served over http: the bundle is an ES module,
    // which browsers refuse to load over file://.
    base: './',
    plugins: [
      react(),
      localVideoPreview(env.VIDEO_PREVIEW_FILE),
      previewNeverBuilt(env.VITE_VIDEO_PREVIEW === '1'),
    ],
  }
})
