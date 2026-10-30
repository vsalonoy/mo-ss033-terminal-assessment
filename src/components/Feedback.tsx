import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

/**
 * Mentor feedback, after section L. Not a research section, so it is not in the
 * section menu or the progress rail.
 *
 * Delivery goes through Web3Forms, a form-to-email service built for static sites
 * such as this one. The browser posts the form to the service, and the service
 * emails it to the address the access key was created for. Nothing is stored or
 * shown on this site. The key is a public form identifier, not a secret: it is
 * compiled into the page and only lets someone send mail to that address.
 *
 * The access key comes from the build environment (VITE_FEEDBACK_ACCESS_KEY,
 * kept in an uncommitted .env.local file or a repository variable). Without it
 * the form says plainly that it is not connected and cannot be submitted, so it
 * never looks operational when it is not.
 */
const ACCESS_KEY = (import.meta.env.VITE_FEEDBACK_ACCESS_KEY as string | undefined)?.trim() || '';
const ENDPOINT = 'https://api.web3forms.com/submit';

const SECTIONS = [
  'Overall research and website',
  'Section A: Introduction',
  'Section B: Challenge',
  'Section C: Stakeholders',
  'Section D: Solutions',
  'Section E: Policy Ranking',
  'Section F: Proposed Solution',
  'Section G: Worker Journey',
  'Section H: SMART Indicators',
  'Section I: Evaluating Success',
  'Section J: Risks',
  'Section K: Conclusion',
  'Section L: References',
];
const CATEGORIES = [
  'General feedback',
  'Content accuracy',
  'Research evidence',
  'Policy recommendations',
  'Website design and usability',
  'Suggested improvement',
  'Other',
];

const MIN_COMMENT = 10;
const MAX_COMMENT = 3000;
const MIN_FILL_MS = 3000;     // faster than any person can fill the form: treated as automated
const TIMEOUT_MS = 15000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Field = 'name' | 'email' | 'section' | 'category' | 'comments';
type Values = Record<Field, string>;
type Status =
  | { kind: 'idle' }
  | { kind: 'invalid'; count: number }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; message: string };

const EMPTY: Values = { name: '', email: '', section: '', category: '', comments: '' };

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) e.name = 'Enter your name.';
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address, or leave this field empty.';
  if (!v.section) e.section = 'Choose the section you are reviewing.';
  if (!v.category) e.category = 'Choose a feedback category.';
  if (v.comments.trim().length < MIN_COMMENT) e.comments = `Write at least ${MIN_COMMENT} characters.`;
  return e;
}

export function MentorFeedback() {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const configured = ACCESS_KEY.length > 0;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [trap, setTrap] = useState(false);
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  const set = (f: Field, v: string) => {
    const next = { ...values, [f]: v };
    setValues(next);
    if (tried) setErrors(validate(next));      // live correction once a submit has been attempted
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!configured || inFlight.current) return;   // no second request while one is in flight
    setTried(true);
    const e = validate(values);
    setErrors(e);
    const bad = (Object.keys(EMPTY) as Field[]).filter(f => e[f]);
    if (bad.length) {
      setStatus({ kind: 'invalid', count: bad.length });
      refs.current[bad[0]]?.focus();
      return;
    }
    /* Automated submissions: a filled honeypot, or a form completed impossibly fast.
       Neither is sent. A person never sees the honeypot. */
    if (trap || Date.now() - startedAt.current < MIN_FILL_MS) {
      setStatus({ kind: 'failed', message: 'Your feedback could not be sent. Please wait a moment and try again.' });
      return;
    }

    inFlight.current = true;
    setStatus({ kind: 'sending' });
    const data = new FormData();
    data.append('access_key', ACCESS_KEY);
    data.append('subject', `MO-SS033 mentor feedback: ${values.category} (${values.section})`);
    data.append('from_name', 'MO-SS033 research website');
    data.append('name', values.name.trim());
    if (values.email.trim()) data.append('email', values.email.trim());   // used as the reply-to address
    data.append('section', values.section);
    data.append('category', values.category);
    data.append('message', values.comments.trim());

    const ctl = new AbortController();
    const timer = window.setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, signal: ctl.signal });
      let body: { success?: boolean; message?: string } = {};
      try { body = await res.json(); } catch { /* non-JSON error page */ }
      /* Success is reported only when the service confirms it accepted the message. */
      if (res.ok && body.success === true) {
        setStatus({ kind: 'sent' });
        setValues(EMPTY); setErrors({}); setTried(false);
      } else if (res.status === 429) {
        setStatus({ kind: 'failed', message: 'Too many messages have been sent in a short time. Please try again later.' });
      } else {
        setStatus({ kind: 'failed', message: 'Your feedback could not be sent. Please try again later.' });
      }
    } catch {
      /* A timeout is not a connection failure: the service may still have received the message. */
      setStatus({ kind: 'failed', message: ctl.signal.aborted
        ? 'The delivery service did not respond in time, so your feedback may not have been sent. Please wait a few minutes before trying again.'
        : 'Your feedback could not be sent because the connection failed. Please check your connection and try again.' });
    } finally {
      window.clearTimeout(timer);
      inFlight.current = false;
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  const sending = status.kind === 'sending';
  const fieldClass = (f: Field) =>
    `mt-1.5 w-full rounded-lg border bg-ink-800/80 px-3.5 py-2.5 text-[0.95rem] text-sand placeholder:text-mute/70
     focus:outline-none focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2
     disabled:opacity-60 ${errors[f] ? 'border-rose/70' : 'border-edge'}`;
  const describe = (f: Field, hint?: string) => [errors[f] ? id(`${f}-err`) : '', hint ?? ''].filter(Boolean).join(' ') || undefined;
  const errorText = (f: Field) =>
    errors[f] ? <p id={id(`${f}-err`)} className="mt-1.5 text-[0.82rem] text-rose">{errors[f]}</p> : null;

  return (
    <section id="mentor-feedback" aria-labelledby={id('h')} className="relative z-10 scroll-mt-24 border-t border-line py-24 sm:py-28">
      <div className="wrap">
        <div className="eyebrow">Feedback</div>
        <h2 id={id('h')} className="t-sec mt-3">Mentor Feedback</h2>
        <p className="t-lede mt-5">
          Your feedback is valuable in improving this research. Please share your comments, questions,
          or recommendations using the form below.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-start">
          <form noValidate onSubmit={onSubmit} aria-describedby={configured ? undefined : id('offline')} className="card p-6 sm:p-8">
            {!configured && (
              <div id={id('offline')} className="mb-6 rounded-lg border-l-2 border-l-amber/70 bg-amber/[0.06] px-4 py-3 text-[0.9rem] leading-relaxed text-sand/90">
                <strong className="font-semibold text-amber">Not yet connected.</strong>{' '}
                This form is not linked to an email delivery service yet, so it cannot send feedback.
                It will be switched on once delivery has been set up and tested.
              </div>
            )}

            <fieldset disabled={!configured || sending} className="m-0 min-w-0 border-0 p-0 space-y-5">
              <legend className="sr-only">Feedback details</legend>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={id('name')} className="mlabel text-mute">Your name <span aria-hidden className="text-rose">*</span><span className="sr-only">(required)</span></label>
                  <input id={id('name')} name="name" type="text" autoComplete="name" maxLength={100} required
                    ref={el => { refs.current.name = el; }}
                    value={values.name} onChange={e => set('name', e.target.value)}
                    aria-invalid={!!errors.name} aria-describedby={describe('name')} className={fieldClass('name')} />
                  {errorText('name')}
                </div>
                <div>
                  <label htmlFor={id('email')} className="mlabel text-mute">Your email <span className="normal-case tracking-normal text-mute/90">(optional)</span></label>
                  <input id={id('email')} name="email" type="email" autoComplete="email" maxLength={254} inputMode="email"
                    ref={el => { refs.current.email = el; }}
                    value={values.email} onChange={e => set('email', e.target.value)}
                    aria-invalid={!!errors.email} aria-describedby={describe('email', id('email-hint'))} className={fieldClass('email')} />
                  <p id={id('email-hint')} className="mt-1.5 text-[0.78rem] text-mute">Only if you would like a reply.</p>
                  {errorText('email')}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={id('section')} className="mlabel text-mute">Section reviewed <span aria-hidden className="text-rose">*</span><span className="sr-only">(required)</span></label>
                  <select id={id('section')} name="section" required
                    ref={el => { refs.current.section = el; }}
                    value={values.section} onChange={e => set('section', e.target.value)}
                    aria-invalid={!!errors.section} aria-describedby={describe('section')} className={fieldClass('section')}>
                    <option value="">Choose a section</option>
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errorText('section')}
                </div>
                <div>
                  <label htmlFor={id('category')} className="mlabel text-mute">Feedback category <span aria-hidden className="text-rose">*</span><span className="sr-only">(required)</span></label>
                  <select id={id('category')} name="category" required
                    ref={el => { refs.current.category = el; }}
                    value={values.category} onChange={e => set('category', e.target.value)}
                    aria-invalid={!!errors.category} aria-describedby={describe('category')} className={fieldClass('category')}>
                    <option value="">Choose a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errorText('category')}
                </div>
              </div>

              <div>
                <label htmlFor={id('comments')} className="mlabel text-mute">Comments and recommendations <span aria-hidden className="text-rose">*</span><span className="sr-only">(required)</span></label>
                <textarea id={id('comments')} name="comments" rows={7} required maxLength={MAX_COMMENT}
                  ref={el => { refs.current.comments = el; }}
                  value={values.comments} onChange={e => set('comments', e.target.value)}
                  aria-invalid={!!errors.comments} aria-describedby={describe('comments', id('comments-count'))}
                  className={`${fieldClass('comments')} resize-y leading-relaxed`} />
                <p id={id('comments-count')} className="mt-1.5 text-[0.78rem] text-mute">{values.comments.length} of {MAX_COMMENT} characters</p>
                {errorText('comments')}
              </div>

              {/* Honeypot for automated submissions. Hidden from people and assistive technology. */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label>Leave this box unchecked<input type="checkbox" name="botcheck" tabIndex={-1} checked={trap} onChange={e => setTrap(e.target.checked)} /></label>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="submit" className="btn btn-p" aria-describedby={configured ? undefined : id('offline')}>
                  {sending ? 'Sending…' : 'Submit Feedback'}
                </button>
                <span className="text-[0.8rem] text-mute"><span aria-hidden className="text-rose">*</span> Required</span>
              </div>
            </fieldset>

            {/* One polite live region for every outcome, focused after a send so the result is heard. */}
            <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite"
              className={`mt-5 rounded-lg text-[0.92rem] leading-relaxed focus:outline-none ${status.kind === 'idle' ? '' : 'px-4 py-3'} ${
                status.kind === 'sent' ? 'border-l-2 border-l-cyan-400/70 bg-cyan-500/[0.07] text-sand'
                : status.kind === 'failed' || status.kind === 'invalid' ? 'border-l-2 border-l-rose/70 bg-rose/[0.06] text-sand' : 'text-mute'}`}>
              {status.kind === 'invalid' && `Please correct ${status.count === 1 ? 'the highlighted field' : `the ${status.count} highlighted fields`}.`}
              {status.kind === 'sending' && 'Sending your feedback…'}
              {status.kind === 'sent' && 'Thank you. Your feedback has been sent.'}
              {status.kind === 'failed' && status.message}
            </div>
          </form>

          <aside aria-label="About this form" className="space-y-5 text-[0.9rem] leading-relaxed text-sand/85">
            <div>
              <div className="mlabel text-mute">Privacy</div>
              <p className="mt-2">
                What you submit is used only to review and improve this assessment. It is sent by email
                to the student through a third-party form delivery service, Web3Forms, which handles it under
                its own privacy policy. It is never published on this website. Your email address is optional
                and is used only to reply to you. Please do not include sensitive personal information.
              </p>
            </div>
            <div>
              <div className="mlabel text-mute">Not official grading</div>
              <p className="mt-2">
                This form is for informal comments on the research and the website. It is not part of
                official university grading and does not replace feedback given through CAMU.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
