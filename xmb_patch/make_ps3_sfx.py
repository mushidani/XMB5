#!/usr/bin/env python3
"""V36: convert the owner-supplied original PS3 XMB wavs (48 kHz stereo S16) to the raw PCM that is embedded in the ELF.
The extracted originals are very quiet (peaks around -20 dB), so each one is lifted to a peak of ~10000 (-10 dBFS). Usage:
  make_ps3_sfx.py <dir with snd_*.wav>   (file names may carry a hash prefix)"""
import sys, wave, glob, os
import numpy as np
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
KINDS = ('cursor', 'category_decide', 'decide', 'cancel', 'system_ok', 'system_ng')
TARGET = 10000.0
def main(src):
    for k in KINDS:
        hits = glob.glob(os.path.join(src, '*snd_%s.wav' % k))
        if len(hits) != 1: raise SystemExit('need exactly one snd_%s.wav in %s' % (k, src))
        w = wave.open(hits[0], 'rb')
        if (w.getframerate(), w.getnchannels(), w.getsampwidth()) != (48000, 2, 2): raise SystemExit('%s: expected 48 kHz stereo S16' % k)
        a = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64)
        peak = max(1.0, abs(a).max())
        a = np.clip(np.round(a * (TARGET / peak)), -32768, 32767).astype('<i2')
        out = os.path.join(R, 'ps3_assets', 'PS3_snd_%s.s16le' % k)
        a.tofile(out); print(k, len(a) * 2, 'bytes, gain x%.2f' % (TARGET / peak))
if __name__ == '__main__': main(sys.argv[1])
