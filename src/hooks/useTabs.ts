import { useId, useRef, type KeyboardEvent } from 'react';

/**
 * WAI-ARIA tabs: one tab in the Tab order at a time, arrow keys move between
 * tabs and select them, Home and End jump to the ends. Both arrow pairs work,
 * because the same tab list runs across on wide screens and down on phones.
 *
 * Returns props for each tab and for the panel it controls.
 */
export function useTabs(count: number, active: number, setActive: (i: number) => void) {
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in step) next = (active + step[e.key] + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const tab = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => { refs.current[i] = el; },
    id: `${base}-tab-${i}`,
    type: 'button' as const,
    role: 'tab',
    'aria-selected': i === active,
    'aria-controls': `${base}-panel`,
    tabIndex: i === active ? 0 : -1,
    onKeyDown,
    onClick: () => setActive(i),
  });

  const panel = () => ({
    id: `${base}-panel`,
    role: 'tabpanel',
    'aria-labelledby': `${base}-tab-${active}`,
    tabIndex: 0,
  });

  return { tab, panel };
}
