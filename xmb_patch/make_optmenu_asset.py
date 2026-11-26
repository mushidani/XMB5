#!/usr/bin/env python3
"""V62: the PS3 Triangle options panel, from the PS3 4.93 system_plugin.rco textures (decoded GIM, RGBA):
    tex_optionmenu_bg.png    536 x 216, white, alpha 52 at the edge -> 206 at x 48 -> 0 by x ~450 (the soft grey band)
    tex_optionmenu_line.png    4 x 216, white, the vertical edge line (alpha 91 in the middle, fading to the top / bottom)
Fitted to a 1080p RPCS3 frame of the open panel: the band is drawn 1:1 wide (536 px from x 1320) and stretched to the screen height,
in grey (79, 79, 84) at 0.88 x the texture alpha; the line is white at 0.72 x its alpha, 4 px wide at x 1320.
    python3 make_optmenu_asset.py <folder with the two decoded textures>  ->  native_assets/optmenu/optmenu_bg.png, optmenu_line.png"""
import sys
from pathlib import Path
from PIL import Image
R = Path(__file__).resolve().parents[1]
OUT = R / 'xmb_patch/native_assets/optmenu'; OUT.mkdir(parents=True, exist_ok=True)
src = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
bg = Image.open(src / 'tex_optionmenu_bg.png').convert('RGBA')
a = bg.getchannel('A').point(lambda v: min(255, round(v * 0.88)))
out = Image.new('RGBA', bg.size, (79, 79, 84, 0)); out.putalpha(a); out.save(OUT / 'optmenu_bg.png', optimize=True)
ln = Image.open(src / 'tex_optionmenu_line.png').convert('RGBA')
a = ln.getchannel('A').point(lambda v: min(255, round(v * 0.72)))
out = Image.new('RGBA', ln.size, (255, 255, 255, 0)); out.putalpha(a); out.save(OUT / 'optmenu_line.png', optimize=True)
print('optmenu_bg.png', bg.size, 'optmenu_line.png', ln.size)
# the small right arrow of an option with options of its own: the PS3 submenu arrow (make_arrow_asset.py), mirrored
arr = R / 'xmb_patch/native_assets/arrow/arrow_sub.png'
if arr.exists():
    Image.open(arr).convert('RGBA').transpose(Image.Transpose.FLIP_LEFT_RIGHT).save(OUT / 'optmenu_arrow_r.png', optimize=True)
    print('optmenu_arrow_r.png')
# V63: the PS3 sort-order mark after the active sort ("Creation Date v"): a solid white triangle pointing down, 22 x 15 (RPCS3 1080p frame:
# x 1501..1523, y 223..237), 8x supersampled
W, H, SS = 22, 15, 8
m = Image.new('L', (W, H), 0); px = m.load()
for y in range(H):
    for x in range(W):
        acc = 0
        for sy in range(SS):
            for sx in range(SS):
                fx, fy = x + (sx + 0.5) / SS, y + (sy + 0.5) / SS
                if fy <= 14.5 and abs(fx - 11) <= 11 * (1 - fy / 14.5): acc += 1
        px[x, y] = round(255 * acc / (SS * SS))
d = Image.new('RGBA', (W, H), (255, 255, 255, 0)); d.putalpha(m); d.save(OUT / 'optmenu_arrow_d.png', optimize=True)
print('optmenu_arrow_d.png', W, 'x', H)
