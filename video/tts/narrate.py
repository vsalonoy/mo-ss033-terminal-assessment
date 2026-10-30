"""Generate the narration: one WAV per sentence, plus a manifest of measured
durations that the video timeline and captions are built from.

Runs entirely on this machine. Nothing is sent to any external service.
Do not run until the script has been approved.

Usage: .venv/bin/python narrate.py [--voice af_heart] [--speed 1.0]
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
ROOT = HERE.parent

ap = argparse.ArgumentParser()
ap.add_argument('--voice', default='af_heart')
ap.add_argument('--speed', type=float, default=1.0)
ap.add_argument('--only', default='', help='comma-separated sentence-id prefixes to voice; other sentences keep their existing audio')
args = ap.parse_args()

sentences = json.loads((ROOT / 'narration/sentences.json').read_text())
out = ROOT / 'public/audio'
out.mkdir(parents=True, exist_ok=True)

TARGET_RMS = 10 ** (-20 / 20)    # every sentence at the same loudness
PEAK_CEILING = 10 ** (-1.5 / 20)  # never closer than 1.5 dB to clipping


KNEE = 10 ** (-6 / 20)            # soft limiting starts 6 dB below full scale


def level(samples):
    """Raw Kokoro sentences peak as high as +0.1 dBFS and vary in loudness. Scale
    every sentence to the same RMS, then round off the rare peaks above the knee
    so they approach, but never pass, the ceiling. Scaling alone to the ceiling
    left a 4 dB loudness spread between sentences; this keeps them even."""
    rms = float(np.sqrt(np.mean(samples ** 2)))
    if rms == 0:
        return samples
    x = samples * (TARGET_RMS / rms)
    over = np.abs(x) > KNEE
    span = PEAK_CEILING - KNEE
    x[over] = np.sign(x[over]) * (KNEE + span * np.tanh((np.abs(x[over]) - KNEE) / span))
    return x


kokoro = Kokoro(str(HERE / 'models/kokoro-v1.0.onnx'), str(HERE / 'models/voices-v1.0.bin'))
only = tuple(x for x in args.only.split(',') if x)
durations = {}
for s in sentences:
    wav = out / f"{s['id']}.wav"
    if only and not s['id'].startswith(only) and wav.exists():
        info = sf.info(wav)                       # approved audio, kept as it is
        durations[s['id']] = round(info.frames / info.samplerate, 3)
        continue
    samples, rate = kokoro.create(s['say'], voice=args.voice, speed=args.speed, lang='en-us')
    sf.write(wav, level(samples), rate)
    durations[s['id']] = round(len(samples) / rate, 3)
    print(f"{s['id']}  {durations[s['id']]:6.2f}s  {s['text'][:60]}")
# Audio for sentences no longer in the script is removed, so nothing stale is rendered.
for f in out.glob('*.wav'):
    if f.stem not in durations:
        f.unlink(); print('removed stale', f.name)

(out / 'manifest.json').write_text(json.dumps({'voice': f'kokoro-v1.0 {args.voice} x{args.speed}', 'sentences': durations}, indent=1))
print(f'{len(durations)} sentences, {sum(durations.values()) / 60:.2f} min of speech')
