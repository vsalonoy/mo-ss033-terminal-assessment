import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { PhotoCarousel, SLIDE_MS } from './PhotoCarousel';
import { CAROUSEL } from '../data/media';

const current = () => screen.getAllByRole('button', { name: /^Photograph \d+ of/ })
  .findIndex(b => b.getAttribute('aria-current') === 'true');

describe('photo carousel', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

  it('advances every seven seconds and stops after one full cycle, on the first photograph', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced={false} label="Photos" />);
    expect(current()).toBe(0);
    tick(SLIDE_MS);
    expect(current()).toBe(1);
    for (let i = 1; i < CAROUSEL.length; i++) tick(SLIDE_MS);
    expect(current()).toBe(0);
    tick(SLIDE_MS * 3);
    expect(current()).toBe(0);
    expect(screen.getByRole('button', { name: 'Play the photographs' })).toBeInTheDocument();
  });

  it('never advances on its own under reduced motion', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced label="Photos" />);
    tick(SLIDE_MS * 4);
    expect(current()).toBe(0);
    expect(screen.getByRole('button', { name: 'Play the photographs' })).toBeInTheDocument();
  });

  it('has a visible pause control that holds it still', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced={false} label="Photos" />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause the photographs' }));
    tick(SLIDE_MS * 3);
    expect(current()).toBe(0);
  });

  it('holds still while the pointer is over it', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced={false} label="Photos" />);
    fireEvent.mouseEnter(screen.getByRole('region', { name: 'Photos' }));
    tick(SLIDE_MS * 2);
    expect(current()).toBe(0);
  });

  it('is operable by buttons and arrow keys, and announces manual changes', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced label="Photos" />);
    fireEvent.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(current()).toBe(1);
    fireEvent.keyDown(screen.getByRole('region', { name: 'Photos' }), { key: 'ArrowLeft' });
    expect(current()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(current()).toBe(CAROUSEL.length - 1);
    fireEvent.click(screen.getByRole('button', { name: `Photograph 3 of ${CAROUSEL.length}: ${CAROUSEL[2].caption}` }));
    expect(current()).toBe(2);
    expect(screen.getByText(`Photograph 3 of ${CAROUSEL.length}: ${CAROUSEL[2].caption}`, { selector: '[aria-live]' })).toBeInTheDocument();
  });

  it('gives the shown photograph its alt text and a visible credit', () => {
    render(<PhotoCarousel slides={CAROUSEL} reduced label="Photos" />);
    expect(screen.getByAltText(CAROUSEL[0].alt)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Photograph: ${CAROUSEL[0].creator}`))).toBeInTheDocument();
  });
});

describe('carousel photographs: licensing', () => {
  it('every photograph has a creator, licence, Commons source and a statement of changes', () => {
    for (const m of CAROUSEL) {
      expect(m.alt.length).toBeGreaterThan(20);
      expect(m.creator).toBeTruthy();
      expect(m.license).toMatch(/^(CC BY-SA 4\.0|CC0 1\.0|Public domain)$/);
      if (m.license.startsWith('CC')) expect(m.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
      if (m.license === 'CC BY-SA 4.0') expect(m.adapted).toMatch(/shared under CC BY-SA 4\.0/);
      expect(m.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(m.adapted).toBeTruthy();
    }
  });

  it('every carousel photograph is credited in section L', () => {
    render(<App />);
    const refs = document.getElementById('references')!;
    for (const m of CAROUSEL) {
      expect(within(refs).getByText(new RegExp(`photograph by ${m.creator}`))).toBeInTheDocument();
    }
  });
});
