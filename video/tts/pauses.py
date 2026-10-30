"""Find the short pauses inside each narrated sentence and add them to the manifest.

Captions split a long sentence into two or three cues. Without this, the split
time is estimated from character counts and can land a second away from the
words. The captioner breaks at commas and colons where it can, and the voice
pauses there, so timeline.ts moves each split onto the nearest real pause.

Run after narrate.py: .venv/bin/python pauses.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

AUDIO = Path(__file__).parent.parent / 'public/audio'
FRAME = 0.01                   # 10 ms analysis frames
QUIET = 10 ** (-40 / 20)       # below -40 dBFS counts as silence
MIN_PAUSE = 0.08               # pauses shorter than 80 ms are not breaks

manifest = json.loads((AUDIO / 'manifest.json').read_text())
pauses = {}
for sid in manifest['sentences']:
    a, r = sf.read(AUDIO / f'{sid}.wav')
    n = int(r * FRAME)
    quiet = [float(np.sqrt(np.mean(a[i:i + n] ** 2))) < QUIET for i in range(0, len(a) - n, n)]
    voiced = [i for i, q in enumerate(quiet) if not q]
    if not voiced:
        pauses[sid] = []
        continue
    found, run = [], 0
    for i in range(voiced[0], voiced[-1] + 1):        # inside the speech only
        if quiet[i]:
            run += 1
        else:
            if run * FRAME >= MIN_PAUSE:
                found.append(round((i - run / 2) * FRAME, 3))   # middle of the pause
            run = 0
    pauses[sid] = found

manifest['pauses'] = pauses
(AUDIO / 'manifest.json').write_text(json.dumps(manifest, indent=1))
print(f"{sum(len(v) for v in pauses.values())} pauses in {len(pauses)} sentences")
