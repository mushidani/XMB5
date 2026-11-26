#!/usr/bin/env python3
"""V37: the soft white halo behind the focused title, as three PNGs (left cap / stretchable middle / right cap) in native_assets/glow/.
The PS5 engine ignores textShadow, and 30 text copies per focused row were slow to mount and stepped. Three static images are free:
the middle slice is uniform along x, so it can be stretched to any text width without distorting the falloff.
Canvas 256 x 110: a band 30 px tall spanning x 48..208, blurred twice (wide sigma 9 = xmb-web's 15 px halo, narrow sigma 3.8 = its 5 px
inner halo), white with alpha. Caps = columns 0..80 and 176..256, middle = columns 80..176 (identical along x)."""
from pathlib import Path
import numpy as np
from PIL import Image
R = Path(__file__).resolve().parents[1]
OUT = R / 'xmb_patch/native_assets/glow'; OUT.mkdir(parents=True, exist_ok=True)
W, H, BAND, X0, X1 = 256, 110, 30, 48, 208
def gauss1d(s):
    r = int(s * 4); x = np.arange(-r, r + 1); k = np.exp(-x * x / (2 * s * s)); return k / k.sum()
def blur(a, s):
    k = gauss1d(s)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, mode='same'), 0, a)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode='same'), 1, a)
band = np.zeros((H, W)); y0 = (H - BAND) // 2; band[y0:y0 + BAND, X0:X1] = 1.0
alpha = np.clip(0.30 * blur(band, 9.0) + 0.14 * blur(band, 3.8), 0, 1)
rgba = np.zeros((H, W, 4), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = np.round(alpha * 255).astype(np.uint8)
img = Image.fromarray(rgba, 'RGBA')
img.crop((0, 0, 80, H)).save(OUT / 'glow_l.png')
img.crop((120, 0, 124, H)).save(OUT / 'glow_m.png')      # 4 px wide, uniform along x
img.crop((176, 0, 256, H)).save(OUT / 'glow_r.png')
print('glow caps 80x%d, middle 4x%d; centre alpha %.2f' % (H, H, alpha[H // 2, W // 2]))
