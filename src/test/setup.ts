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
/* jsdom has <dialog> but not its methods. Enough to open and close it; focus
   trapping and Escape are the browser's job and are checked in a real browser. */
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

/* No test may reach the network. A test that submits the form stubs fetch itself. */
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Unexpected network request in a test'))));
});
afterEach(cleanup);
