#!/usr/bin/env python3
"""V69: two small pictures for the XMB.
  folder_ps3.png    the PS3's own folder icon: explore_plugin_full.rco 'item_tex_plain_folder' (GIM RGBA8888 314x178, rows padded to
                    316 px), decoded with ps3clean/gimdec + rcoimg, trimmed to the folder and centred on a square canvas (the XMB's icon box)
  triangle_hint.png the green triangle button of the PS3's "Triangle: Options" hint (drawn, 40x40, 8x supersampled)
  cross_hint.png    V77: the blue cross button, same style (the Move hint's "X Done")
    python3 make_extra_assets.py <decoded item_tex_plain_folder.png>  ->  native_assets/extra/"""
import sys, math
from pathlib import Path
from PIL import Image, ImageDraw
R = Path(__file__).resolve().parents[1]
OUT = R / 'xmb_patch/native_assets/extra'; OUT.mkdir(parents=True, exist_ok=True)
if len(sys.argv) > 1:
    im = Image.open(sys.argv[1]).convert('RGBA')
    box = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    f = im.crop(box)
    side = int(max(f.size) / 0.86)   # V70: a little smaller in the icon box (it filled the whole box)
    sq = Image.new('RGBA', (side, side), (0, 0, 0, 0)); sq.paste(f, ((side - f.size[0]) // 2, (side - f.size[1]) // 2))
    sq.resize((256, 256), Image.Resampling.LANCZOS).save(OUT / 'folder_ps3.png', optimize=True)
    print('folder_ps3.png from', f.size)
S, N = 8, 40
big = Image.new('RGBA', (N * S, N * S), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
c = N * S / 2
d.ellipse([S * 1, S * 1, N * S - S * 1, N * S - S * 1], fill=(28, 30, 30, 255), outline=(70, 74, 74, 255), width=S * 1)
r = N * S * 0.27
pts = [(c + r * math.cos(math.radians(a)), c + 1.2 * S + r * math.sin(math.radians(a))) for a in (-90, 30, 150)]
d.line(pts + [pts[0]], fill=(48, 196, 140, 255), width=int(S * 2.6), joint='curve')
big.resize((N, N), Image.Resampling.LANCZOS).save(OUT / 'triangle_hint.png', optimize=True)
print('triangle_hint.png')
# V77: the cross button (Move: X Done)
big = Image.new('RGBA', (N * S, N * S), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
d.ellipse([S * 1, S * 1, N * S - S * 1, N * S - S * 1], fill=(28, 30, 30, 255), outline=(70, 74, 74, 255), width=S * 1)
r = N * S * 0.22
for a, b in (((c - r, c - r), (c + r, c + r)), ((c - r, c + r), (c + r, c - r))):
    d.line([a, b], fill=(124, 170, 236, 255), width=int(S * 2.6))
big.resize((N, N), Image.Resampling.LANCZOS).save(OUT / 'cross_hint.png', optimize=True)
print('cross_hint.png')
