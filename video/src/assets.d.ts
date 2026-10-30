/* The website's media.ts imports photographs as modules; the bundler resolves them to URLs. */
declare module '*.webp' { const src: string; export default src; }
