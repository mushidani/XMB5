#!/usr/bin/env python3
"""PS5 XMB 1.1 asset checks. No PS5 SDK or hardware required."""
from pathlib import Path
from PIL import Image
R = Path(__file__).resolve().parents[2]
P = R / 'theme' / 'particles'
needed = {
    'ps5xmb_bg_classic.png': (1920, 1080),
    'ps5xmb_silk_back.png': (1920, 1080),
    'ps5xmb_silk_front.png': (1920, 1080),
    'ps5xmb_sparkles.png': (1920, 1080),
    'ps5xmb_focus_halo.png': (200, 200),
}
for month in range(1, 13):
    for when in ('day', 'night'):
        needed[f'ps5xmb_month_{month:02d}_{when}.png'] = (128, 64)
for name, dims in needed.items():
    with Image.open(P/name) as im:
        im.load()
        assert im.format == 'PNG' and im.size == dims, (name, im.size)
for key in ('users','settings','photo','music','video','game','network','psn','friends'):
    with Image.open(P/f'xmb_cat_{key}.png') as im:
        im.load()
        assert im.format == 'PNG' and 24<=im.width<=2048 and 24<=im.height<=2048, (key,im.size)
assert Image.open(P/'ps5xmb_silk_front.png').getextrema()[-1][0] == 0
assert Image.open(P/'ps5xmb_silk_front.png').getextrema()[-1][1] > 0
assert Image.open(P/'ps5xmb_focus_halo.png').getextrema()[-1][1] > 0
print(f'PASS: {len(needed)} new original PNG assets + nine icons')
