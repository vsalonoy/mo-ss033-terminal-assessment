import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths. The site is served from a GitHub Pages project
  // subpath (/mo-ss033-terminal-assessment/), and './' works there and from a
  // domain root without the base needing to change if the repository is ever
  // renamed. It still has to be served over http: the bundle is an ES module,
  // which browsers refuse to load over file://.
  base: './',
  plugins: [react()],
})
