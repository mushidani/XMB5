#!/usr/bin/env python3
"""Original translucent XMB-style wave artwork. No Sony-owned assets used."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
from math import sin, pi

OUT = Path(__file__).resolve().parents[1] / 'theme/particles/ps5xmb_wave.png'
W,H=1920,1080
bg=Image.new('RGB',(W,H))
d=ImageDraw.Draw(bg)
for y in range(H):
    t=y/H
    # The dark, luminous indigo gradient recalls late PS3 XMB backgrounds.
    r=round(6+13*(1-t)**1.2)
    g=round(22+33*(1-t)**1.7)
    b=round(58+67*(1-t)**1.5)
    d.line((0,y,W,y), fill=(r,g,b))
base=bg.convert('RGBA')
# Smooth silk ribbons, not a dense bundle of straight hairlines.
wave=Image.new('RGBA',(W,H),(0,0,0,0))
w=ImageDraw.Draw(wave,'RGBA')

def curve(x, center, amp, phase):
    t=x/W
    return center+amp*sin(2*pi*(.88*t+phase))+20*sin(2*pi*(1.5*t+.2))*(.6+.4*t)

ribbons=[
    (525,58,.02,63,(90,159,223)),
    (560,65,.27,84,(75,170,235)),
    (585,47,.53,74,(121,198,244)),
    (625,61,.78,55,(49,112,205)),
]
for center,amp,phase,thickness,color in ribbons:
    for j in range(thickness,0,-2):
        shade=abs(j-thickness/2)/(thickness/2)
        opacity=max(1,round(7*(1-shade)**1.2))
        pts=[(x,curve(x,center,amp,phase)+j-thickness/2) for x in range(-20,W+40,8)]
        w.line(pts, fill=(*color,opacity), width=4)
    pts=[(x,curve(x,center,amp,phase)-thickness*.27) for x in range(-20,W+40,5)]
    w.line(pts,fill=(*color,44),width=2)
# Soft broadband aura.
aura=wave.filter(ImageFilter.GaussianBlur(36))
base=Image.alpha_composite(base,aura)
base=Image.alpha_composite(base,wave)
OUT.parent.mkdir(parents=True,exist_ok=True)
base.save(OUT,optimize=True)
print('Created',OUT,OUT.stat().st_size)
