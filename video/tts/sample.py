"""Voice test only: renders a few sentences in candidate voices to compare quality
and pronunciation. It does not produce the narration.

Usage: .venv/bin/python sample.py <out_dir>
"""
import sys
import time
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

VOICES = ['af_heart', 'af_bella', 'bf_emma']

# The hardest sentences in the draft script for a speech engine: acronyms,
# a statute number, a range and percentage points.
TEXT = (
    'For more than two decades, the IT-BPM industry has helped make the Philippines '
    'a global outsourcing hub. '
    'Her employer refers her to the local Public Employment Service Office, or PESO, '
    'and TESDA would register the training under Republic Act 12063. '
    'They earned 2.5 percent more in the placement year, and 5.8 to 6.5 percent more '
    'over the following four years. Retention was 3.9 percentage points higher.'
)

kokoro = Kokoro(str(HERE / 'models/kokoro-v1.0.onnx'), str(HERE / 'models/voices-v1.0.bin'))
for voice in VOICES:
    t0 = time.perf_counter()
    samples, rate = kokoro.create(TEXT, voice=voice, speed=1.0, lang='en-us')
    took = time.perf_counter() - t0
    secs = len(samples) / rate
    sf.write(OUT / f'sample-{voice}.wav', samples, rate)
    words = len(TEXT.split())
    print(f'{voice}: {secs:.1f}s audio, {words / secs * 60:.0f} wpm, '
          f'generated in {took:.1f}s ({secs / took:.1f}x real time)')
