#!/usr/bin/env python3
"""Create original PS3-XMB-like category pictograms (NOT Sony-extracted assets).

Only Pillow is required. Antialiased 4x drawing; files are installed to
/user/data/ZhiThemes/Assets/particles/ by existing ZhiThemes asset pipeline.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from math import pi, sin, cos

OUT = Path(__file__).resolve().parents[1] / 'theme' / 'particles'
OUT.mkdir(parents=True, exist_ok=True)
S = 4
C = (231, 241, 255, 231)
LIGHT = (248, 253, 255, 245)
DARK = (135, 164, 191, 200)

def xy(v): return int(round(v*S))
def pts(v): return [(xy(x),xy(y)) for x,y in v]
def line(d, p, w=5, col=C, joint='curve'):
    d.line(pts(p),fill=col,width=xy(w),joint=joint)
def ell(d,b,fill=C,outline=None,width=2):
    d.ellipse(tuple(xy(x) for x in b),fill=fill,outline=outline,width=xy(width))
def rect(d,b,fill=C,outline=None,width=2,radius=0):
    bb=tuple(xy(x) for x in b)
    if radius:d.rounded_rectangle(bb,radius=xy(radius),fill=fill,outline=outline,width=xy(width))
    else:d.rectangle(bb,fill=fill,outline=outline,width=xy(width))
def poly(d,p,fill=C):d.polygon(pts(p),fill=fill)
def icon(name,draw):
    im=Image.new('RGBA',(128*S,128*S),(0,0,0,0)); d=ImageDraw.Draw(im)
    draw(d)
    im=im.resize((128,128),Image.Resampling.LANCZOS)
    im.save(OUT/f'xmb_cat_{name}.png',optimize=True)

def users(d):
    ell(d,(49,21,79,51),LIGHT); ell(d,(24,42,45,63),DARK);ell(d,(83,42,104,63),DARK)
    ell(d,(38,57,90,106),C);ell(d,(11,71,43,105),DARK);ell(d,(85,71,117,105),DARK)

def settings(d):
    # Gear teeth centered on ring, with 12 evenly distributed teeth.
    cx=64;cy=64; teeth=[]
    for k in range(12):
        a=k*2*pi/12
        for da,r in [(-.115,47),(-.105,55),(.105,55),(.115,47)]:
            aa=a+da;teeth.append((cx+cos(aa)*r,cy+sin(aa)*r))
    poly(d,teeth,fill=C)
    ell(d,(32,32,96,96),C)
    ell(d,(48,48,80,80),fill=(0,0,0,0),outline=(34,62,92,245),width=10)

def photo(d):
    rect(d,(14,30,114,103),C,radius=9)
    rect(d,(43,20,85,34),LIGHT,radius=5)
    ell(d,(45,46,84,85),fill=(40,78,117,205))
    ell(d,(52,53,77,78),LIGHT)
    ell(d,(92,43,104,55),fill=(40,78,117,205))

def music(d):
    # Paired quavers with recognizable heads.
    poly(d,[(54,31),(102,19),(102,32),(54,44)],fill=LIGHT)
    rect(d,(52,33,60,92),LIGHT)
    rect(d,(95,26,103,78),LIGHT)
    ell(d,(29,84,60,108),C)
    ell(d,(73,70,104,95),C)

def video(d):
    rect(d,(22,18,106,110),C,radius=5)
    for y in range(27,100,24):
        rect(d,(26,y,40,y+12),(33,62,96,225),radius=2)
        rect(d,(88,y,102,y+12),(33,62,96,225),radius=2)
    rect(d,(46,23,81,104),(33,62,96,225))

def game(d):
    # Six-button game controller silhouette, PS3 category recognizable at a glance.
    ell(d,(13,43,115,101),C)
    poly(d,[(20,64),(16,105),(37,106),(51,92),(77,92),(92,106),(112,104),(106,57)],C)
    rect(d,(32,61,40,85),(31,57,91,255),radius=2)
    rect(d,(24,69,48,77),(31,57,91,255),radius=2)
    for x,y in [(83,64),(97,73),(82,85),(69,73)]:ell(d,(x-4,y-4,x+4,y+4),fill=(37,65,94,250))

def network(d):
    ell(d,(20,20,108,108),fill=None,outline=C,width=7)
    ell(d,(43,20,85,108),fill=None,outline=C,width=5)
    line(d,[(22,64),(106,64)],5)
    d.arc((xy(23),xy(35),xy(105),xy(91)),start=0,end=180,fill=C,width=xy(4))
    d.arc((xy(23),xy(35),xy(105),xy(91)),start=180,end=360,fill=C,width=xy(4))

def psn(d):
    # Abstract connected constellation for the PlayStation Network section.
    for x,y,r in [(39,36,13),(90,42,13),(65,91,13)]:ell(d,(x-r,y-r,x+r,y+r),C)
    line(d,[(45,49),(58,75)],6,col=LIGHT);line(d,[(80,52),(71,75)],6,col=LIGHT)
    line(d,[(53,39),(76,42)],6,col=LIGHT)

def friends(d):
    ell(d,(25,27,63,65),LIGHT);ell(d,(66,34,105,73),C)
    ell(d,(15,71,71,105),LIGHT);ell(d,(61,75,118,111),C)

actions={'users':users,'settings':settings,'photo':photo,'music':music,'video':video,
         'game':game,'network':network,'psn':psn,'friends':friends}
for name,draw in actions.items(): icon(name,draw)
print('Generated',len(actions),'original category icons in',OUT)
