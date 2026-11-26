#!/usr/bin/env python3
"""V54: the PS3 submenu arrow as a PNG (the PS5 renderer does not draw border triangles).
Measured on a 1080p RPCS3 frame: tip at (432.5, 504.5), base ~23.5 px to the right, 23 px high at the base, white; full brightness
for the first 8 px from the tip, then fading toward the base (0.8 at 12, 0.6 at 14, 0.4 at 16, 0.25 at 18, 0.15 at 20, 0.08 at 23).
Output 28 x 24, tip at x 2.5 / y 11.5 -> native_assets/arrow/arrow_sub.png. 8x supersampled, Pillow only."""
from pathlib import Path
from PIL import Image
R = Path(__file__).resolve().parents[1]
OUT = R / 'xmb_patch/native_assets/arrow'; OUT.mkdir(parents=True, exist_ok=True)
W, H, SS = 28, 24, 8
TX, TY, L, HH = 2.5, 11.5, 23.5, 11.5
PROF = [(0, 1.0), (8, 1.0), (12, 0.8), (14, 0.6), (16, 0.4), (18, 0.25), (20, 0.15), (23.5, 0.08)]
def prof(d):
    for (a, va), (b, vb) in zip(PROF, PROF[1:]):
        if d <= b: return va + (vb - va) * (d - a) / (b - a)
    return PROF[-1][1]
im = Image.new('L', (W, H), 0); px = im.load()
for y in range(H):
    for x in range(W):
        acc = 0.0
        for sy in range(SS):
            for sx in range(SS):
                fx, fy = x + (sx + 0.5) / SS, y + (sy + 0.5) / SS
                d = fx - TX
                if 0 <= d <= L and abs(fy - TY) <= HH * d / L: acc += prof(d)
        px[x, y] = int(round(255 * acc / (SS * SS)))
out = Image.new('RGBA', (W, H), (255, 255, 255, 0)); out.putalpha(im)
out.save(OUT / 'arrow_sub.png', optimize=True)
print('arrow_sub.png', W, 'x', H)
