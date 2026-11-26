#!/usr/bin/env python3
"""V79: the PS3-style format badges (PS5 / PS4 / PS3) for the Game rows, from the badge pictures in badge_src/ (ps5.jpg, ps4.jpg,
ps3.jpg: a light rounded rectangle with dark letters). The letters become see-through (the wave shows inside them), the rectangle
is redrawn clean (rounded, smooth edge) in white (day) and black (night):
  native_assets/extra/badge_ps5_d.png, badge_ps5_n.png, ... (264 x 60; drawn at 132 x 30)  ->  theme/particles/xmbweb_badge_*.png"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
R = Path(__file__).resolve().parents[1]
SRC, OUT = R / 'xmb_patch/badge_src', R / 'xmb_patch/native_assets/extra'
OUT.mkdir(parents=True, exist_ok=True)
X0, Y0, X1, Y1, RAD = 120, 339, 1081, 557, 30     # the rectangle in the 1200 x 896 pictures
W, H = 264, 60
for name in ('ps5', 'ps4', 'ps3'):
    a = np.asarray(Image.open(SRC / (name + '.jpg')).convert('RGB')).astype(np.float32)[Y0:Y1, X0:X1]
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    inner = lum[30:-30, 40:-40]
    bg, ink = np.percentile(inner, 70), np.percentile(inner, 0.5)
    cov = np.clip((bg - lum) / max(1.0, bg - ink), 0, 1)
    cov[cov < 0.12] = 0
    cov = np.clip((cov - 0.12) / 0.76, 0, 1)
    h, w = lum.shape
    S = 4   # rounded rectangle, supersampled
    m = Image.new('L', (w * S, h * S), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * S - 1, h * S - 1], radius=RAD * S, fill=255)
    rect = np.asarray(m.resize((w, h), Image.Resampling.LANCZOS)).astype(np.float32) / 255
    alpha = Image.fromarray((np.clip(rect * (1 - cov), 0, 1) * 255).astype(np.uint8)).resize((W, H), Image.Resampling.LANCZOS)
    for mode, rgb in (('d', (255, 255, 255)), ('n', (0, 0, 0))):
        im = Image.new('RGBA', (W, H), rgb + (0,))
        im.putalpha(alpha)
        im.save(OUT / f'badge_{name}_{mode}.png', optimize=True)
        print(f'badge_{name}_{mode}.png')
