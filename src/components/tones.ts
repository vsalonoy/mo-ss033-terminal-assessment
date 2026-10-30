/** Chip tone for a Determining Solution rating. Colour groups the wording; the word is always shown. */
export const ratingTone = (r: string): 'cyan' | 'amber' | 'rose' | 'neutral' => {
  if (r === 'Strongest' || r === 'High' || r === 'High in principle' || r === 'High as a design' || r === 'Moderate to high') return 'cyan';
  if (r === 'Not shown') return 'rose';
  if (r === 'Low' || r === 'Low to moderate') return 'amber';
  return 'neutral';
};
