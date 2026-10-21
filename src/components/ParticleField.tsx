import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';

/**
 * Animated digital network: drifting nodes joined by lines when they come close.
 * Canvas, no library. Renders a single still frame when motion is reduced,
 * and stops entirely when the tab is hidden or the field scrolls off screen.
 */
export default function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let raf = 0, w = 0, h = 0, dpr = 1, running = true;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];

    const build = () => {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* Node count scales with area but is capped: the link pass is O(n^2),
         so the cap is what keeps a large monitor from costing more than a phone. */
      const target = Math.round(Math.min(68, Math.max(24, (w * h) / 21000)));
      pts = Array.from({ length: target }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: 0.8 + Math.random() * 1.5,
      }));
    };

    const LINK = 140, LINK2 = LINK * LINK, BUCKETS = 5;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      /* Links are grouped into a few opacity buckets and each bucket is stroked
         as one path. One stroke() per bucket instead of one per link turns
         thousands of draw calls a frame into a handful. */
      const lanes: number[][] = Array.from({ length: BUCKETS }, () => []);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          const closeness = 1 - Math.sqrt(d2) / LINK;
          const k = Math.min(BUCKETS - 1, (closeness * BUCKETS) | 0);
          lanes[k].push(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
        }
      }
      ctx.lineWidth = 0.6;
      for (let k = 0; k < BUCKETS; k++) {
        const lane = lanes[k];
        if (!lane.length) continue;
        ctx.strokeStyle = `rgba(34,211,238,${(((k + 0.5) / BUCKETS) * 0.3).toFixed(3)})`;
        ctx.beginPath();
        for (let m = 0; m < lane.length; m += 4) {
          ctx.moveTo(lane[m], lane[m + 1]); ctx.lineTo(lane[m + 2], lane[m + 3]);
        }
        ctx.stroke();
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(103,232,249,0.62)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };

    const step = () => {
      if (!running) return;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    build();
    if (reduced) { draw(); return () => { cancelAnimationFrame(raf); }; }

    const io = new IntersectionObserver(es => {
      const vis = es[0]?.isIntersecting ?? true;
      if (vis && !raf) { running = true; raf = requestAnimationFrame(step); }
      if (!vis) { running = false; cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0 });
    io.observe(cv);

    const vis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { running = true; raf = requestAnimationFrame(step); }
    };
    document.addEventListener('visibilitychange', vis);

    let t = 0;
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(() => { build(); draw(); }, 140); };
    window.addEventListener('resize', onResize);

    raf = requestAnimationFrame(step);
    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect();
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener('resize', onResize); window.clearTimeout(t);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
