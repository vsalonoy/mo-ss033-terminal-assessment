import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

/*
 * The Mentor Feedback form. Every request is mocked: these tests never contact
 * Web3Forms, and the key they use is a fake one, never the key in .env.local.
 */

const FAKE_KEY = 'test-access-key-not-real';
const ENDPOINT = 'https://api.web3forms.com/submit';

/* The access key is read when the module loads, so each test loads a fresh copy. */
async function renderForm(key = FAKE_KEY) {
  vi.stubEnv('VITE_FEEDBACK_ACCESS_KEY', key);
  vi.resetModules();
  const { MentorFeedback } = await import('./Feedback');
  const view = render(<MentorFeedback />);
  return { ...view, form: view.container.querySelector('form')! };
}

const field = {
  name: () => screen.getByLabelText(/your name/i),
  email: () => screen.getByLabelText(/your email/i),
  section: () => screen.getByLabelText(/section reviewed/i),
  category: () => screen.getByLabelText(/feedback category/i),
  comments: () => screen.getByLabelText(/comments and recommendations/i),
};
const submit = () => screen.getByRole('button', { name: /submit feedback|sending/i });
const status = () => screen.getByRole('status');

function fillValid({ email = '' } = {}) {
  fireEvent.change(field.name(), { target: { value: '  Test Mentor  ' } });
  fireEvent.change(field.email(), { target: { value: email } });
  fireEvent.change(field.section(), { target: { value: 'Section F: Proposed Solution' } });
  fireEvent.change(field.category(), { target: { value: 'Research evidence' } });
  fireEvent.change(field.comments(), { target: { value: '  The evidence in section F is clear.  ' } });
}

/* The form refuses anything filled in under three seconds, so move the clock on. */
const afterThinking = () => vi.setSystemTime(Date.now() + 5000);

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

function mockFetch(impl: (url: string, init: RequestInit) => Promise<Response>) {
  const fn = vi.fn(impl);
  vi.stubGlobal('fetch', fn);
  return fn as Mock<(url: string, init: RequestInit) => Promise<Response>>;
}

beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); });
afterEach(() => { vi.useRealTimers(); });

it('never sees the real access key from .env.local', () => {
  expect(import.meta.env.VITE_FEEDBACK_ACCESS_KEY).toBeUndefined();
});

describe('when no access key is configured', () => {
  it('says plainly that it is not connected and disables every field', async () => {
    await renderForm('');
    expect(screen.getByText(/not yet connected/i)).toBeInTheDocument();
    for (const get of Object.values(field)) expect(get()).toBeDisabled();
    expect(submit()).toBeDisabled();
  });

  it('never sends a request, even if the form is submitted programmatically', async () => {
    const { form } = await renderForm('');
    afterThinking();
    fireEvent.submit(form);
    expect(fetch).not.toHaveBeenCalled();
    expect(status()).toBeEmptyDOMElement();
  });

  it('treats a key of only whitespace as missing', async () => {
    await renderForm('   ');
    expect(screen.getByText(/not yet connected/i)).toBeInTheDocument();
    expect(submit()).toBeDisabled();
  });
});

describe('when an access key is configured', () => {
  it('is enabled and shows no "not connected" notice', async () => {
    await renderForm();
    expect(screen.queryByText(/not yet connected/i)).not.toBeInTheDocument();
    for (const get of Object.values(field)) expect(get()).toBeEnabled();
    expect(submit()).toBeEnabled();
  });

  it('marks name, section, category and comments as required, and email as optional', async () => {
    await renderForm();
    for (const f of ['name', 'section', 'category', 'comments'] as const) expect(field[f]()).toBeRequired();
    expect(field.email()).not.toBeRequired();
    expect(screen.getByText(/only if you would like a reply/i)).toBeInTheDocument();
  });

  it('offers the overall option and sections A to L, in order', async () => {
    await renderForm();
    const options = within(field.section()).getAllByRole('option').map(o => o.textContent);
    expect(options[0]).toBe('Choose a section');
    expect(options[1]).toBe('Overall research and website');
    expect(options.slice(2).map(o => o!.slice(0, 10))).toEqual(
      'ABCDEFGHIJKL'.split('').map(l => `Section ${l}:`));
  });

  it('offers the seven feedback categories', async () => {
    await renderForm();
    const options = within(field.category()).getAllByRole('option').map(o => o.textContent);
    expect(options).toEqual([
      'Choose a category', 'General feedback', 'Content accuracy', 'Research evidence',
      'Policy recommendations', 'Website design and usability', 'Suggested improvement', 'Other',
    ]);
  });

  it('counts comment characters and caps comments at 3000', async () => {
    await renderForm();
    expect(screen.getByText('0 of 3000 characters')).toBeInTheDocument();
    fireEvent.change(field.comments(), { target: { value: 'Twelve chars' } });
    expect(screen.getByText('12 of 3000 characters')).toBeInTheDocument();
    expect(field.comments()).toHaveAttribute('maxLength', '3000');
  });
});

describe('validation', () => {
  it('reports every missing required field, focuses the first, and sends nothing', async () => {
    const { form } = await renderForm();
    afterThinking();
    fireEvent.submit(form);
    expect(status()).toHaveTextContent('Please correct the 4 highlighted fields.');
    expect(screen.getByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Choose the section you are reviewing.')).toBeInTheDocument();
    expect(screen.getByText('Choose a feedback category.')).toBeInTheDocument();
    expect(screen.getByText('Write at least 10 characters.')).toBeInTheDocument();
    expect(field.name()).toHaveAttribute('aria-invalid', 'true');
    expect(field.name()).toHaveAccessibleDescription('Enter your name.');
    expect(field.name()).toHaveFocus();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a malformed email but accepts an empty one', async () => {
    const { form } = await renderForm();
    afterThinking();
    fillValid({ email: 'mentor@example' });
    fireEvent.submit(form);
    expect(status()).toHaveTextContent('Please correct the highlighted field.');
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(field.email()).toHaveFocus();

    fireEvent.change(field.email(), { target: { value: '' } });
    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument();
  });

  it('does not count surrounding spaces towards the 10-character minimum', async () => {
    const { form } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.change(field.comments(), { target: { value: '   short    ' } });
    fireEvent.submit(form);
    expect(screen.getByText('Write at least 10 characters.')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('clears an error as soon as it is corrected, once a submit has been tried', async () => {
    const { form } = await renderForm();
    afterThinking();
    fireEvent.submit(form);
    fireEvent.change(field.name(), { target: { value: 'Test Mentor' } });
    expect(screen.queryByText('Enter your name.')).not.toBeInTheDocument();
    expect(field.name()).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('submission', () => {
  it('posts the trimmed fields with the access key and reports success only when the service confirms', async () => {
    const fetchMock = mockFetch(() => Promise.resolve(json({ success: true })));
    const { form } = await renderForm();
    afterThinking();
    fillValid({ email: ' mentor@example.com ' });
    fireEvent.submit(form);

    expect(await screen.findByText('Thank you. Your feedback has been sent.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe('POST');
    const body = Object.fromEntries(init.body as FormData);
    expect(body).toEqual({
      access_key: FAKE_KEY,
      subject: 'MO-SS033 mentor feedback: Research evidence (Section F: Proposed Solution)',
      from_name: 'MO-SS033 research website',
      name: 'Test Mentor',
      email: 'mentor@example.com',
      section: 'Section F: Proposed Solution',
      category: 'Research evidence',
      message: 'The evidence in section F is clear.',
    });
    /* The form is cleared after a confirmed send. */
    expect(field.name()).toHaveValue('');
    expect(field.comments()).toHaveValue('');
  });

  it('leaves out the email field when no email is given', async () => {
    const fetchMock = mockFetch(() => Promise.resolve(json({ success: true })));
    const { form } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.submit(form);
    await screen.findByText(/your feedback has been sent/i);
    expect((fetchMock.mock.calls[0][1].body as FormData).has('email')).toBe(false);
  });

  it('shows a sending state, disables the form, and sends only one request while in flight', async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = mockFetch(() => new Promise<Response>(r => { resolve = r; }));
    const { form } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.submit(form);

    expect(status()).toHaveTextContent('Sending your feedback…');
    expect(submit()).toHaveTextContent('Sending…');
    expect(submit()).toBeDisabled();
    expect(field.name()).toBeDisabled();
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => { resolve(json({ success: true })); });
    expect(status()).toHaveTextContent('Thank you. Your feedback has been sent.');
    expect(submit()).toBeEnabled();
  });

  it('moves focus to the result so it is announced', async () => {
    mockFetch(() => Promise.resolve(json({ success: true })));
    const { form } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.submit(form);
    await screen.findByText(/your feedback has been sent/i);
    await act(() => new Promise(r => requestAnimationFrame(() => r(undefined))));
    expect(status()).toHaveFocus();
    expect(status()).toHaveAttribute('aria-live', 'polite');
  });
});

describe('failure handling', () => {
  async function submitWith(impl: (url: string, init: RequestInit) => Promise<Response>) {
    mockFetch(impl);
    const { form } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.submit(form);
  }

  it('does not claim success when the service answers 200 without success: true', async () => {
    await submitWith(() => Promise.resolve(json({ success: false, message: 'Invalid access key' })));
    expect(await screen.findByText('Your feedback could not be sent. Please try again later.')).toBeInTheDocument();
    expect(screen.queryByText(/has been sent/i)).not.toBeInTheDocument();
    /* What the mentor typed is kept, so it can be sent again. */
    expect(field.name()).toHaveValue('  Test Mentor  ');
  });

  it('explains a rate limit (429)', async () => {
    await submitWith(() => Promise.resolve(json({ success: false }, { status: 429 })));
    expect(await screen.findByText(/too many messages have been sent/i)).toBeInTheDocument();
  });

  it('copes with a server error page that is not JSON', async () => {
    await submitWith(() => Promise.resolve(new Response('<h1>502 Bad Gateway</h1>', { status: 502 })));
    expect(await screen.findByText('Your feedback could not be sent. Please try again later.')).toBeInTheDocument();
  });

  it('reports a connection failure', async () => {
    await submitWith(() => Promise.reject(new TypeError('Failed to fetch')));
    expect(await screen.findByText(/because the connection failed/i)).toBeInTheDocument();
  });

  it('after 15 seconds, gives up and warns the message may not have been sent', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    await submitWith((_url, init) => new Promise<Response>((_res, rej) => {
      init.signal!.addEventListener('abort', () => rej(new DOMException('Aborted', 'AbortError')));
    }));
    expect(status()).toHaveTextContent('Sending your feedback…');
    await act(() => vi.advanceTimersByTimeAsync(14_000));
    expect(status()).toHaveTextContent('Sending your feedback…');
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    expect(status()).toHaveTextContent(/did not respond in time, so your feedback may not have been sent/i);
    expect(submit()).toBeEnabled();
  });
});

describe('automated submissions', () => {
  it('does not send when the hidden honeypot is ticked', async () => {
    const { form, container } = await renderForm();
    afterThinking();
    fillValid();
    fireEvent.click(container.querySelector('input[name="botcheck"]')!);
    fireEvent.submit(form);
    expect(fetch).not.toHaveBeenCalled();
    expect(status()).toHaveTextContent(/could not be sent/i);
  });

  it('does not send a form completed in under three seconds', async () => {
    const { form } = await renderForm();
    fillValid();
    fireEvent.submit(form);
    expect(fetch).not.toHaveBeenCalled();
    expect(status()).toHaveTextContent(/please wait a moment and try again/i);
  });

  it('hides the honeypot from people and assistive technology', async () => {
    const { container } = await renderForm();
    const trap = container.querySelector('input[name="botcheck"]')!;
    expect(trap).not.toBeVisible();
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(trap).toHaveAttribute('tabindex', '-1');
  });
});

describe('privacy and scope notices', () => {
  it('states how feedback is handled', async () => {
    await renderForm();
    const aside = screen.getByRole('complementary', { name: 'About this form' });
    const text = aside.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('used only to review and improve this assessment');
    expect(text).toContain('third-party form delivery service, Web3Forms');
    expect(text).toContain('It is never published on this website.');
    expect(text).toContain('Your email address is optional and is used only to reply to you.');
    expect(text).toContain('Please do not include sensitive personal information.');
  });

  it('says it is not part of official grading', async () => {
    await renderForm();
    expect(screen.getByText('Not official grading')).toBeInTheDocument();
    expect(screen.getByText(/does not replace feedback given through CAMU/)).toBeInTheDocument();
  });
});
