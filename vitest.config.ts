import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  // No .env files in tests. The real Web3Forms key in .env.local must never reach
  // a test run; tests that need a key stub a fake one.
  envDir: false,
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
}))
