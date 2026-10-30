import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AutomationMechanism, GlobalNetwork, PhotoBand } from './Visuals';
import { Ranking } from './SectionsAE';
import { MEDIA } from '../data/media';
import { AUTOMATION_FLOW, AUTOMATION_OUTCOMES, GLOBAL_NETWORK } from '../data/research';

/*
 * The interactive visuals. These check behaviour and that the approved content
 * is all still there; how they look is checked in a browser.
 */

const relationships = () =>
  within(screen.getByText(/^(Every relationship in the diagram|Its connections in the diagram)$/).parentElement!).getAllByRole('listitem');

describe('globalization network', () => {
  const pick = (name: string) => screen.getAllByRole('button', { name: new RegExp(`^${name}$`) })[0];

  it('shows every description and every relationship before anything is selected', () => {
    render(<GlobalNetwork />);
    for (const k of ['clients', 'competitors', 'hub', 'tech', 'workers', 'skills'] as const) {
      expect(screen.getAllByText(GLOBAL_NETWORK[k].body[0].t, { exact: false }).length).toBeGreaterThan(0);
    }
    expect(relationships()).toHaveLength(5);
    for (const label of Object.values(GLOBAL_NETWORK.edges)) {
      expect(screen.getByText(`: ${label}`, { exact: false })).toBeInTheDocument();
    }
  });

  it('selecting a part lists only its connections, and selecting it again clears it', () => {
    render(<GlobalNetwork />);
    fireEvent.click(pick('International clients'));
    expect(pick('International clients')).toHaveAttribute('aria-pressed', 'true');
    expect(relationships()).toHaveLength(1);
    expect(relationships()[0]).toHaveTextContent('International clients → acts on Philippine IT-BPM providers: outsourced work, and pressure to adopt AI');

    fireEvent.click(pick('Philippine IT-BPM providers'));
    expect(relationships()).toHaveLength(4);
    expect(pick('International clients')).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pick('Philippine IT-BPM providers'));
    expect(relationships()).toHaveLength(5);
  });

  it('Escape and "Show every relationship" both return to the full view', () => {
    const { container } = render(<GlobalNetwork />);
    fireEvent.click(pick('Filipino workers'));
    expect(relationships()).toHaveLength(2);
    fireEvent.keyDown(container.querySelector('figure')!, { key: 'Escape' });
    expect(relationships()).toHaveLength(5);

    fireEvent.click(pick('Changing skills demand'));
    fireEvent.click(screen.getByRole('button', { name: 'Show every relationship' }));
    expect(relationships()).toHaveLength(5);
  });

  it('keeps citations as links, never inside the selectable buttons', () => {
    render(<GlobalNetwork />);
    for (const b of screen.getAllByRole('button', { pressed: false })) {
      expect(b.querySelector('a')).toBeNull();
    }
    expect(screen.getAllByRole('link', { name: /Khan, 2026/ }).length).toBeGreaterThan(0);
  });
});

describe('how automation reaches workers', () => {
  const tabs = () => within(screen.getByRole('tablist', { name: /four steps/ })).getAllByRole('tab');
  const panel = () => screen.getAllByRole('tabpanel')[0];

  it('keeps all four steps visible, in order, with the first selected', () => {
    render(<AutomationMechanism />);
    expect(tabs().map(t => t.textContent)).toEqual([
      '1Step 1Why firms adopt AI', '2Step 2Tasks change', '3Step 3Skills change', '4Step 4Possible outcomes for workers',
    ]);
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true');
    expect(panel()).toHaveTextContent(AUTOMATION_FLOW[0].body[0].t);
  });

  it('moves with the arrow keys, Home and End, and only the selected step is in the Tab order', () => {
    render(<AutomationMechanism />);
    tabs()[0].focus();
    fireEvent.keyDown(tabs()[0], { key: 'ArrowRight' });
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs()[1]).toHaveFocus();
    expect(tabs().map(t => t.tabIndex)).toEqual([-1, 0, -1, -1]);
    expect(panel()).toHaveTextContent(AUTOMATION_FLOW[1].body[0].t);
    fireEvent.keyDown(tabs()[1], { key: 'End' });
    expect(tabs()[3]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs()[3], { key: 'ArrowRight' });
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs()[0], { key: 'Home' });
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('Previous and Next step through, and are disabled at the ends', () => {
    render(<AutomationMechanism />);
    const prev = screen.getByRole('button', { name: /^Previous/ });
    const next = screen.getByRole('button', { name: /^Next/ });
    expect(prev).toBeDisabled();
    expect(next).toHaveAccessibleName('Next: Tasks change');
    fireEvent.click(next); fireEvent.click(next); fireEvent.click(next);
    expect(tabs()[3]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /^Next/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /^Previous/ }));
    expect(tabs()[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('step 4 lets each of the three outcomes be explored', () => {
    render(<AutomationMechanism />);
    fireEvent.click(tabs()[3]);
    const outcomes = within(screen.getByRole('tablist', { name: 'Possible outcomes for workers' })).getAllByRole('tab');
    expect(outcomes.map(o => o.textContent)).toEqual(AUTOMATION_OUTCOMES.map(o => o.label));
    for (const [i, o] of AUTOMATION_OUTCOMES.entries()) {
      fireEvent.click(outcomes[i]);
      expect(outcomes[i]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getAllByRole('tabpanel').at(-1)).toHaveTextContent(o.body[0].t);
    }
  });

  it('always says that task exposure is not job loss', () => {
    render(<AutomationMechanism />);
    expect(screen.getByText('Task exposure is not job loss.')).toBeInTheDocument();
    fireEvent.click(tabs()[3]);
    expect(screen.getByText('Task exposure is not job loss.')).toBeInTheDocument();
  });
});

describe('Singapore evidence explorer', () => {
  const measures = () => within(screen.getByRole('tablist', { name: 'Measured effects' })).getAllByRole('tab');
  const panel = () => screen.getByText('Selected measure').parentElement!;

  it('offers the three measures with their reported values, as text', () => {
    render(<Ranking />);
    expect(measures()).toHaveLength(3);
    expect(measures()[0]).toHaveTextContent('Wages, placement year2.5%');
    expect(measures()[1]).toHaveTextContent('Wages, next four years5.8% to 6.5%');
    expect(measures()[2]).toHaveTextContent('Retention3.9 pp');
    expect(measures()[1]).toHaveAccessibleName(/between 5\.8 and 6\.5 percent above the control group/);
    expect(measures()[2]).toHaveAccessibleName(/3\.9 percentage points above the control group/);
  });

  it('explains the selected measure, keeping percent and percentage points apart', () => {
    render(<Ranking />);
    expect(panel()).toHaveTextContent('A single reported figure, in percent, above the control group');
    fireEvent.click(measures()[1]);
    expect(panel()).toHaveTextContent('A reported range, not a single figure, in percent');
    expect(panel()).toHaveTextContent('The source gives a range, not a figure per year.');
    fireEvent.click(measures()[2]);
    expect(panel()).toHaveTextContent('3.9 pp');
    expect(panel()).toHaveTextContent('in percentage points, above the control group');
    expect(panel()).toHaveTextContent('Percentage points more likely to still be in the job than the control group.');
  });

  it('shows no figures other than the three reported measures', () => {
    const { container } = render(<Ranking />);
    const explorer = screen.getByRole('tablist', { name: 'Measured effects' }).parentElement!;
    const numbers = explorer.textContent!.match(/\d+(\.\d+)?/g)!.filter(n => n.includes('.'));
    expect(new Set(numbers)).toEqual(new Set(['2.5', '5.8', '6.5', '3.9']));
    expect(container).toHaveTextContent('These are Singapore results measured against control groups.');
    expect(within(explorer).getAllByRole('link', { name: /Ministry of Trade and Industry Singapore, 2025/ }).length).toBeGreaterThan(0);
  });
});

describe('photographs', () => {
  it('open enlarged with the full credit, and close again', () => {
    render(<PhotoBand m={MEDIA.itPark} />);
    const trigger = screen.getByRole('button', { name: `Enlarge photograph: ${MEDIA.itPark.alt}` });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
    /* The enlarged copy is not requested until it is opened. */
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(1);

    fireEvent.click(trigger);
    const dialog = document.querySelector('dialog')!;
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveTextContent(MEDIA.itPark.title);
    expect(dialog).toHaveTextContent(MEDIA.itPark.creator);
    expect(within(dialog).getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute('href', MEDIA.itPark.licenseUrl);
    expect(within(dialog).getByRole('link', { name: 'Wikimedia Commons' })).toHaveAttribute('href', MEDIA.itPark.source);
    expect(within(dialog).getByRole('img', { hidden: true })).toHaveAttribute('alt', MEDIA.itPark.alt);

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close enlarged photograph', hidden: true }));
    expect(dialog).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();
  });

  it('keep the short credit under the photograph', () => {
    render(<PhotoBand m={MEDIA.lab} />);
    expect(screen.getByText(/Illustrative photograph: UndueMarmot, CC0 1\.0\. Full credit in Sources\./)).toBeInTheDocument();
  });
});
