import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/* Browser APIs that jsdom does not provide. Reduced motion is reported as on, so
   animations resolve immediately, the way the site already handles it. */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent: () => false,
  }),
});
class NoopObserver {
  observe() {} unobserve() {} disconnect() {}
  takeRecords() { return []; }
}
Object.assign(window, { IntersectionObserver: NoopObserver, ResizeObserver: NoopObserver });
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

/* No test may reach the network. A test that submits the form stubs fetch itself. */
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Unexpected network request in a test'))));
});
afterEach(cleanup);
