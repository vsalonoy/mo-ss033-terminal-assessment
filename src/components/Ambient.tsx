import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useSiteState';

/**
 * Continuous background motion for the whole page.
 *
 * One fixed canvas behind everything, rather than a field per section: a single
 * animation loop is far cheaper than twelve, and because it is fixed it never
 * re-lays-out while the page scrolls. The loop stops when the tab is hidden and
 * draws a single still frame when the reader prefers reduced motion.
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0, w = 0, h = 0, dpr = 1, running = true;
    type P = { x: number; y: number; vx: number; vy: number; r: number; tw: number };
    let pts: P[] = [];

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* Deliberately sparse. This sits under text, so it has to stay quiet. */
      const n = Math.round(Math.min(42, Math.max(14, (w * h) / 42000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
        r: 0.7 + Math.random() * 1.2,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const LINK = 165, LINK2 = LINK * LINK, BUCKETS = 4;
    const draw = (t: number) => {
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
      ctx.lineWidth = 0.5;
      for (let k = 0; k < BUCKETS; k++) {
        const lane = lanes[k];
        if (!lane.length) continue;
        ctx.strokeStyle = `rgba(103,232,249,${(((k + 0.5) / BUCKETS) * 0.085).toFixed(3)})`;
        ctx.beginPath();
        for (let m = 0; m < lane.length; m += 4) {
          ctx.moveTo(lane[m], lane[m + 1]); ctx.lineTo(lane[m + 2], lane[m + 3]);
        }
        ctx.stroke();
      }
      for (const p of pts) {
        /* A slow twinkle keeps it feeling alive without any of them moving far. */
        const a = 0.18 + 0.14 * Math.sin(t * 0.0009 + p.tw);
        ctx.fillStyle = `rgba(165,180,252,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };

    const step = (t: number) => {
      if (!running) return;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -30) p.x = w + 30; else if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30; else if (p.y > h + 30) p.y = -30;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };

    build();
    if (reduced) { draw(0); return () => cancelAnimationFrame(raf); }

    const vis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { running = true; raf = requestAnimationFrame(step); }
    };
    document.addEventListener('visibilitychange', vis);

    let t = 0;
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(() => { build(); draw(performance.now()); }, 160); };
    window.addEventListener('resize', onResize);

    raf = requestAnimationFrame(step);
    return () => {
      running = false; cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener('resize', onResize); window.clearTimeout(t);
    };
  }, [reduced]);

  return (
    <canvas ref={ref} aria-hidden="true"
      className="fixed inset-0 z-0 inert opacity-70" />
  );
}

/**
 * Two slow colour blooms that drift as the page scrolls.
 *
 * These are radial gradients, not blurred elements. A `filter: blur(100px)` on
 * something this large has to be re-rasterised whenever it moves, which cost
 * about 70ms per frame while scrolling. A radial gradient paints for free and
 * looks the same, and `will-change: transform` keeps each one on its own
 * compositor layer so scrolling only moves it rather than repainting it.
 */
export function AmbientBlooms() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 42, damping: 22, restDelta: 0.0005 });

  const yA = useTransform(p, [0, 1], ['0vh', '30vh']);
  const yB = useTransform(p, [0, 1], ['0vh', '-24vh']);

  const cyan = 'radial-gradient(closest-side, rgba(34,211,238,0.16), rgba(34,211,238,0.05) 55%, transparent 78%)';
  const iris = 'radial-gradient(closest-side, rgba(99,102,241,0.14), rgba(99,102,241,0.045) 55%, transparent 78%)';

  if (reduced) {
    return (
      <div aria-hidden className="fixed inset-0 z-0 inert">
        <div className="absolute left-[2%] top-[4%] h-[62vh] w-[62vh]" style={{ backgroundImage: cyan }} />
        <div className="absolute right-[0%] top-[54%] h-[56vh] w-[56vh]" style={{ backgroundImage: iris }} />
      </div>
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 z-0 inert overflow-hidden">
      <motion.div
        style={{ y: yA, backgroundImage: cyan, willChange: 'transform' }}
        className="absolute left-[2%] top-[2%] h-[64vh] w-[64vh] animate-drift"
      />
      <motion.div
        style={{ y: yB, backgroundImage: iris, willChange: 'transform' }}
        className="absolute right-[0%] top-[56%] h-[58vh] w-[58vh] animate-drift"
      />
    </div>
  );
}

/** Reading progress for the whole document, shown under the top bar. */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="progress-line"
      style={{ scaleX: reduced ? scrollYProgress : x }}
    />
  );
}
