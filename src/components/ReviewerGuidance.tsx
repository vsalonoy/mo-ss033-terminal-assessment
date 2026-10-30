import { PROJECT } from '../data/research';

/**
 * Static guidance for reviewers, after section L (D-4). It replaces the Mentor
 * Feedback form, which sent submissions through a third-party service and was
 * never connected. Feedback.tsx stays in the repository, unused, so the form can
 * be switched back on if the mentor asks for on-site comments.
 */
export function ReviewerGuidance() {
  return (
    <section id="mentor-feedback" aria-labelledby="mentor-feedback-title" className="relative z-10 border-t border-line py-16">
      <div className="wrap">
        <div className="card p-6 sm:p-7 max-w-reading">
          <div className="eyebrow">For reviewers</div>
          <h2 id="mentor-feedback-title" className="t-sub mt-3">Reviewing this research?</h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-sand/90">
            This website cannot take comments. Mentor and MMDC reviewers: please send feedback
            through CAMU or the method {PROJECT.mentor} designated. Under the Terminal Assessment
            Guide, feedback on a medium that cannot accept comments is sent by email.
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-mute">
            Every section carries a letter from A to L, so a comment can point to one directly, for
            example &ldquo;section D, the comparison matrix&rdquo;.
          </p>
        </div>
      </div>
    </section>
  );
}
