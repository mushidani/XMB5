#!/usr/bin/env python3
"""Original transparent silk overlays for the native RN XMB.

These are independently drawn assets (not PS3 firmware textures). RN Animated
can drift them horizontally; no WebGL or JavaScript frame loop runs in ShellUI.
"""
from pathlib import Path
from math import sin, pi
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parents[1] / 'theme/particles'
W, H = 1920, 1080

def make_wave(name, mid, period, phase, width, rgb):
    im = Image.new('RGBA', (W,H), (0,0,0,0))
    d = ImageDraw.Draw(im,'RGBA')
    for offset in range(-width//2, width//2, 3):
        envelope = max(0.0, 1-abs(offset)/(width/2))
        opacity = max(1, int(10 * envelope**2))
        points=[]
        for x in range(-15,W+16,7):
            y = mid + 30*sin((x/W)*2*pi*period+phase) + 26*sin((x/W)*2*pi*0.58+phase*0.6) + offset
            points.append((x,round(y)))
        d.line(points, fill=rgb+(opacity,), width=3)
    bloom = im.filter(ImageFilter.GaussianBlur(17))
    im = Image.alpha_composite(bloom,im)
    for offset in (-6,0,8):
        p=[(x, round(mid+30*sin((x/W)*2*pi*period+phase)+26*sin((x/W)*2*pi*.58+phase*.6)+offset)) for x in range(-15,W+16,6)]
        ImageDraw.Draw(im,'RGBA').line(p,fill=rgb+(24,),width=2)
    path=OUT/name
    im.save(path,optimize=True)
    print('Created', path, path.stat().st_size)

if __name__=='__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    make_wave('ps5xmb_wave_far.png', 510, .84, .36, 160, (108,178,249))
    make_wave('ps5xmb_wave_near.png', 575, .78, 2.55, 135, (77,141,225))
