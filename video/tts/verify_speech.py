"""Check that the generated narration says the approved words.

Transcribes each sentence's WAV with a local Whisper model (faster-whisper,
runs offline after the model download) and compares the result with the
written sentence. Formatting differences (digits against number words, case,
punctuation) are normalised away; what is left is reported as word errors.

Usage: .venv/bin/python verify_speech.py [model]   (default: base.en)
"""
import json
import re
import sys
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).parent.parent
NUM = {'zero': '0', 'oh': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6',
       'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10', 'twelve': '12', 'eighteen': '18', 'twenty': '20',
       'thirty': '30', 'forty': '40', 'seventy': '70', 'eighty': '80', 'hundred': '00', 'point': '.'}
# Spellings Whisper may choose for words the narration respells or abbreviates.
ALIAS = {'tesda': 'tesda', 'tessda': 'tesda', 'pesos': 'pesos', 'pesos.': 'pesos', 'peso': 'peso',
         'maria': 'maria', 'mareya': 'maria', 'mariya': 'maria', 'itbpm': 'itbpm', 'programme': 'program',
         'programmes': 'programs', 'judgement': 'judgment', 'centre': 'center', 'per': 'percent', '%': 'percent'}


def norm(text: str) -> list[str]:
    t = text.lower().replace('%', ' percent').replace('’', "'")
    t = re.sub(r'(?<=\d),(?=\d)', '', t)                 # 12,063 -> 12063
    t = re.sub(r'\bit[- ]?bpm\b', 'itbpm', t)
    t = re.sub(r'[^a-z0-9.\s]', ' ', t)
    out = []
    for w in t.split():
        w = w.strip('.')
        if not w:
            continue
        out.append(ALIAS.get(w, NUM.get(w, w)))
    # collapse digit sequences said one by one ("1 2 0 6 3" -> "12063"; "12 . 7" -> "12.7")
    joined = ' '.join(out)
    joined = re.sub(r'(?<=\d) (?=\d)', '', joined)
    joined = re.sub(r'(\d) \. (\d)', r'\1.\2', joined)
    return joined.split()


def wer(ref: list[str], hyp: list[str]) -> tuple[int, int]:
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
            prev, d[j] = d[j], cur
    return d[len(hyp)], len(ref)


model = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else 'base.en', device='cpu', compute_type='int8')
sentences = json.loads((ROOT / 'narration/sentences.json').read_text())
errors = words = 0
report = []
timings = {}
for s in sentences:
    segs = list(model.transcribe(str(ROOT / f"public/audio/{s['id']}.wav"), language='en', beam_size=5,
                                 word_timestamps=True)[0])
    heard = ' '.join(x.text.strip() for x in segs)
    # Word start times within the sentence, for placing caption splits (timeline.ts).
    timings[s['id']] = [[re.sub(r'[^a-z0-9]', '', w.word.lower()), round(w.start, 3)] for x in segs for w in x.words]
    e, n = wer(norm(s['text']), norm(heard))
    errors += e; words += n
    report.append({'id': s['id'], 'errors': e, 'words': n, 'script': s['text'], 'heard': heard})
    if e:
        print(f"{s['id']}  {e}/{n} word differences\n   script: {s['text']}\n   heard:  {heard}")
(ROOT / 'out').mkdir(exist_ok=True)
(ROOT / 'out/speech-verification.json').write_text(json.dumps(report, indent=1))
manifest_path = ROOT / 'public/audio/manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['words'] = timings
manifest_path.write_text(json.dumps(manifest, indent=1))
print(f'\n{len(sentences)} sentences, {words} words, {errors} word differences ({100 * errors / words:.1f}%); '
      f'{sum(1 for r in report if r["errors"] == 0)} sentences matched exactly after normalisation')
