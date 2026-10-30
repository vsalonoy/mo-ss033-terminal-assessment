/**
 * Pronunciation fixes. They change only what the voice is given to say; captions
 * and the transcript always show the written form. Each entry was chosen by
 * inspecting the phonemes Kokoro produces (en-us), and each reflects a preference
 * the student stated. All still need confirming by ear before the final narration.
 *
 * Order matters: longer forms first, so "PESOs" is not caught by a "PESO" rule.
 */
export interface LexEntry { written: string; say: string; pending: boolean; note: string }

export const LEXICON: LexEntry[] = [
  { written: 'Salonoy', say: 'Sa-lo-noy', pending: false,
    note: 'The default stressed the first syllable ("SAL-uh-noy"). Even, syllable-timed stress is used instead; the student should confirm by ear (pronunciation/name-*.wav).' },
  { written: 'Republic Act 12063', say: 'Republic Act one two zero six three', pending: false,
    note: 'Digit by digit, as requested. The default was "twelve thousand sixty-three".' },
  { written: 'Maria', say: 'Mah-reeya', pending: false,
    note: 'Filipino ma-REE-ah, stress on the second syllable. The default was the US "mer-EE-uh".' },
  { written: 'TESDA', say: 'Tessda', pending: false,
    note: 'TES-da, as requested. The default voiced the s as z ("TEZ-da").' },
  { written: 'completers', say: 'compleeters', pending: false,
    note: 'Found by transcription check: the default "com-PLEH-ters" was heard as "competitors". Spoken form only; captions keep "completers".' },
  { written: 'PESOs', say: 'pesos', pending: false,
    note: 'Plural. The default dropped the s. "PESO" alone already reads as "peso", the usual Philippine reading.' },
];

/** Words the narration avoids or spells out because the engine misreads them. */
export const AVOIDED = [
  'DICT (read as "dikt"): narration says "the ICT department"; the name stays on screen',
  'ILO (read as "eye-low"): narration says "International Labour Organization"',
  'IBPAP (uncertain reading): narration says "the IT-BPM industry association"',
];

export function spoken(text: string): string {
  return LEXICON.filter(e => !e.pending).reduce((t, e) => t.split(e.written).join(e.say), text);
}
