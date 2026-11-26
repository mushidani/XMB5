#!/usr/bin/env python3
"""Original PS3-inspired XMB silk/gradient artwork, not extracted Sony assets.
Image composition is deterministic and dependency-light (Pillow+numpy).
The native PS5 React Native renderer slowly translates two independent sheets.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from math import sin, pi

O=Path(__file__).resolve().parents[1]/'theme/particles'
O.mkdir(parents=True,exist_ok=True)
W,H=1920,1080
x=np.arange(W,dtype=np.float32)[None,:]
y=np.arange(H,dtype=np.float32)[:,None]

def save_rgba(arr,name):
    im=Image.fromarray(np.clip(arr,0,255).astype('uint8'),'RGBA')
    im.save(O/name,optimize=True)
    print(name,(O/name).stat().st_size)

# Signature PS3 cool blue atmospheric gradient. No hard stripes or vector lines.
yy=np.arange(H,dtype=np.float32)[:,None]
xx=np.arange(W,dtype=np.float32)[None,:]
t=np.clip(yy/(H-1),0,1)
# top navy to ocean-blue center, fading to deep cobalt beneath
stops=[(0.,(8,23,57)),(.42,(12,47,106)),(.64,(17,53,126)),(1.,(7,26,64))]
flat=np.empty((H,3),dtype=np.float32)
for a,b in zip(stops,stops[1:]):
    ya,ca=a; yb,cb=b
    mask=(t[:,0]>=ya)&(t[:,0]<=yb)
    mu=((t[mask,0]-ya)/(yb-ya))[:,None]
    flat[mask,:]=np.asarray(ca)[None,:]*(1-mu)+np.asarray(cb)[None,:]*mu
base=np.repeat(flat[:,None,:],W,axis=1)
# Slight radial light around crest; darker vignette edges
ell=((xx-W*.56)/(W*.75))**2+((yy-H*.54)/(H*.83))**2
light=np.exp(-ell*3.0)[:,:,None]*np.array([5,13,30],dtype=np.float32)[None,None,:]
base=np.clip(base+light,0,255)
base=np.concatenate([base,np.full((H,W,1),255,dtype=np.float32)],axis=2)
save_rgba(base,'ps5xmb_bg_classic.png')

def sheet(name, seed, mid, width, amp, base_col, phase, transparency):
    # Wave ribbon is a filled translucent sheet with changing surface normal.
    X=x/W
    curve=(mid + amp*np.sin(2*np.pi*(X*.80)+phase)
        +27*np.sin(2*np.pi*(X*.37)+phase*.71)
        +12*np.sin(2*np.pi*(X*1.63)+phase*1.13))
    curve2=curve+width*(.52+.16*np.sin(2*np.pi*(X*.64)+phase*.82))
    thick=np.maximum(18.,curve2-curve)
    offset=(y-curve)/thick
    # diffuse surface light across the wide silk ribbon
    inside=np.clip(np.minimum(offset*9, (1-offset)*11),0,1)
    satin=np.clip(.46+.20*np.sin(2*np.pi*(X*1.12)+phase*.44+offset*6),.25,.75)
    surface=inside*satin*transparency
    # bright curled edge with soft bloom and refractive fringe
    edge=np.exp(-((y-curve-5)/5.)**2)*58
    bloom=np.exp(-((y-curve)/28.)**2)*24
    seam2=np.exp(-((y-curve2)/9.)**2)*27
    ridge=np.exp(-((offset-.38)/.06)**2)*10*inside
    alpha=np.clip(surface+edge+bloom+seam2+ridge,0,145)
    # varied color across sheet to simulate white-blue volumetric reflection
    RGB=np.empty((H,W,3),dtype=np.float32)
    for i in range(3):
        RGB[:,:,i]=np.clip(base_col[i]+(24 if i==2 else 10)*np.sin(X*8+phase)+30*np.exp(-((offset-.03)/.13)**2),0,255)
    arr=np.concatenate([RGB,alpha[:,:,None]],axis=2)
    save_rgba(arr,name)

sheet('ps5xmb_silk_back.png',101,459,169,31,(80,158,245),.46,34)
sheet('ps5xmb_silk_front.png',310,528,191,36,(101,186,253),2.17,47)

# The faint dust of a PS3 XMB's backlighting, not a huge starfield.
rng=np.random.default_rng(1203)
sparks=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(sparks,'RGBA')
for _ in range(133):
    xx=float(rng.uniform(0,W)); yy=float(rng.uniform(225,895))
    brightness=int(rng.uniform(24,92))
    radius=float(rng.uniform(.65,1.8))
    d.ellipse((xx-radius,yy-radius,xx+radius,yy+radius),fill=(191,228,255,brightness))
sparks=sparks.filter(ImageFilter.GaussianBlur(.55))
sparks.save(O/'ps5xmb_sparkles.png', optimize=True)
print('ps5xmb_sparkles.png',(O/'ps5xmb_sparkles.png').stat().st_size)

# Selected category soft halo. Alpha bump, not stock PS5 focus frame.
S=200
arr=np.zeros((S,S,4),dtype=np.uint8)
y2,x2=np.mgrid[:S,:S].astype(np.float32)
r=np.hypot((x2-100)/95,(y2-93)/95)
arr[:,:,0]=185;arr[:,:,1]=229;arr[:,:,2]=255
arr[:,:,3]=np.clip(60*np.exp(-r*r*4.4),0,80).astype('uint8')
Image.fromarray(arr,'RGBA').save(O/'ps5xmb_focus_halo.png',optimize=True)
print('ps5xmb_focus_halo.png',(O/'ps5xmb_focus_halo.png').stat().st_size)

# Original approximations of the PS3's automatic calendar colors. Images are
# 128x64 and stretched, matching the PS3's low-frequency gradient design.
# These colors are informed by the PSDevWiki XMB color table, not extracted DDS.
from colorsys import rgb_to_hsv, hsv_to_rgb
months=['D8BF1A','6DB217','E17E9A','178816','9A61C8','02CDC7',
        '0C76C0','B444C0','E5A708','875B1E','E3412A','277BC4']
for num, tint in enumerate(months,1):
    tint_rgb=tuple(int(tint[k:k+2],16) for k in (0,2,4))
    for which in ('day','night'):
        result=Image.new('RGB',(128,64));pix=result.load()
        for py in range(64):
            f=py/63
            for px in range(128):
                light=(.64+.26*np.exp(-((f-.55)/.37)**2))*(.84 if which=='day' else .48)
                lateral=(.90+.10*np.sin(px/128*2*pi*.55))
                pix[px,py]=tuple(int(np.clip((tint_rgb[k]*.45+[8,20,49][k]) * light*lateral,0,255)) for k in range(3))
        path=O/f'ps5xmb_month_{num:02d}_{which}.png'
        result.save(path,optimize=True)
print('Created 24 optional seasonal/month-time backgrounds')
