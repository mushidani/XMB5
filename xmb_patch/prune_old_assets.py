#!/usr/bin/env python3
"""V34: remove the artwork of the OLD hand-made backgrounds and old category art from theme/particles.

The background is now xmb-web's own wave (two H.264 loops embedded by embed_media.py); the 16 captured wave frames, the
VSH month gradients, the silk strips and the pre-V33 category / item art are not referenced by any code any more, and every
PNG left in theme/particles is embedded in the ELF. Explicit patterns only; anything else is left alone. Safe to run twice.
"""
from pathlib import Path
import re
R = Path(__file__).resolve().parents[1]
P = R / 'theme/particles'
PATTERNS = [
    r'xmbweb_wave_frame_\d+\.png', r'xmb_linkev_frame_\d+\.png',
    r'xmb_vsh_.*\.png', r'ps5xmb_.*\.png', r'xmb_native_.*\.png',
    r'xmb_cat_.*\.png', r'xmb_clock_ps3\.png',
    r'xmb_item_(?!game\.png$).*\.png',          # xmb_item_game.png is still the "Loading installed games..." icon
]
rx = [re.compile('^' + p + '$') for p in PATTERNS]
gone = []; freed = 0
for f in sorted(P.glob('*.png')):
    if any(r.match(f.name) for r in rx):
        freed += f.stat().st_size; f.unlink(); gone.append(f.name)
print('pruned %d obsolete background / category images (%d bytes of PNG no longer embedded)' % (len(gone), freed))
