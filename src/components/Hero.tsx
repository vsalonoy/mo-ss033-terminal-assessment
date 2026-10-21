import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import ParticleField from './ParticleField';
import { usePrefersReducedMotion, useSite } from '../hooks/useSiteState';
import { PROJECT, HEADLINE_STATS } from '../data/research';
import { Counter, Cite } from './primitives';

const WORDS = PROJECT.headline.split(' ');

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const { setMode, go } = useSite();
  const [skipped, setSkipped] = useState(reduced);
  const wrapRef = useRef<HTMLElement>(null);

  /* Parallax: the headline drifts up slower than the page and fades out, so
     leaving the hero feels like moving through it rather than past it. */
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const fieldFade = useTransform(scrollYProgress, [0, 0.9], [0.7, 0]);

  /* Skip Intro lands the reader at the first academic section. */
  const skip = () => {
    setSkipped(true);
    const el = document.getElementById('intro');
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  useEffect(() => { if (reduced) setSkipped(true); }, [reduced]);

  const d = (n: number) => (reduced || skipped ? 0 : n);

  return (
    <header ref={wrapRef} id="top" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      <motion.div
        aria-hidden className="absolute inset-0 inert"
        style={reduced ? undefined : { y: fieldY, opacity: fieldFade }}
      >
        <ParticleField className="absolute inset-0 h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 inert bg-[radial-gradient(90%_70%_at_50%_0%,rgba(6,182,212,0.11),transparent_62%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 inert bg-gradient-to-t from-ink-900 to-transparent" />

      <div className="relative flex-1 flex items-center">
        <motion.div
          className="wrap w-full py-28"
          style={reduced ? undefined : { y: copyY, opacity: copyFade }}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: d(0.1) }}
          >
            <div className="eyebrow">{PROJECT.course} &nbsp;/&nbsp; {PROJECT.assessment}</div>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.98] tracking-[-0.02em] text-sand">
            {/* A real space between words, so the headline reads as a sentence to a screen reader. */}
            {WORDS.map((word, i) => (
              <Fragment key={i}>
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { opacity: 0, y: '0.42em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: d(0.3 + i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                >
                  {word === 'changing.'
                    ? <span className="text-cyan-300 italic">{word}</span>
                    : word}
                </motion.span>
                {i < WORDS.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[58ch] text-[1.05rem] sm:text-[1.15rem] leading-relaxed text-mute"
            initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: d(0.3 + WORDS.length * 0.1 + 0.1) }}
          >
            More than a quarter of Philippine employment sits in occupations exposed to generative
            AI, the highest share in ASEAN. This is a study of what is actually being done for the
            workers in those roles, and what is still missing. <Cite keys={['huynh2026']} />
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: d(0.3 + WORDS.length * 0.1 + 0.35) }}
          >
            <button className="btn btn-p" onClick={skip}>Skip intro</button>
            <button className="btn btn-g" onClick={() => { setMode('presentation'); go(0); }}>
              Presentation mode
            </button>
          </motion.div>

          <motion.div
            className="mt-6 text-[0.8rem] text-mute"
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: d(0.3 + WORDS.length * 0.1 + 0.5) }}
          >
            {PROJECT.student} &nbsp;&middot;&nbsp; Section {PROJECT.section} &nbsp;&middot;&nbsp;
            Mentor {PROJECT.mentor} &nbsp;&middot;&nbsp; {PROJECT.version}
          </motion.div>
        </motion.div>
      </div>

      {/* Four headline figures, animated once, each carrying its source. */}
      <motion.div
        className="relative border-t border-line bg-ink-900/60 backdrop-blur-sm"
        initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: d(0.3 + WORDS.length * 0.1 + 0.6) }}
      >
        <div className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 py-9">
          {HEADLINE_STATS.map(s => (
            <div key={s.label}>
              <div className={`t-stat leading-none ${
                s.accent === 'amber' ? 'text-amber' : 'text-cyan-300'}`}>
                {s.countTo !== undefined
                  ? <Counter to={s.countTo} decimals={s.decimals ?? 0} suffix={s.suffix ?? ''}
                      immediate delay={reduced || skipped ? 0 : 1.1} />
                  : s.value}
              </div>
              <div className="mt-2 text-[0.82rem] leading-snug text-sand/90">{s.label}</div>
              <div className="mt-1.5 text-[0.76rem] leading-snug text-mute/80">{s.detail}</div>
              <div className="mt-1.5"><Cite keys={s.ref} /></div>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
