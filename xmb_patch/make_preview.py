#!/usr/bin/env python3
"""Off-console compositor for visual QA only; NOT a captured PS5 screenshot."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=R/'theme/particles'
im=Image.open(P/'ps5xmb_bg_classic.png').convert('RGBA')
for nm in ('ps5xmb_silk_back.png','ps5xmb_silk_front.png','ps5xmb_sparkles.png'):
    im=Image.alpha_composite(im,Image.open(P/nm).convert('RGBA'))
d=ImageDraw.Draw(im,'RGBA')
try: font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
except: font='DejaVuSans.ttf'
get=lambda size: ImageFont.truetype(font,size)
colors={'normal':(210,225,247,146),'active':(250,252,255,255)}
categories=['users','settings','photo','music','video','game','network','psn','friends']
for i,k in enumerate(categories):
    x=448+(i-5)*146;y=222
    if x<-110 or x>1920:continue
    icon=Image.open(P/f'xmb_cat_{k}.png').convert('RGBA').resize((82 if i==5 else 57,)*2)
    icon.putalpha(icon.getchannel('A').point(lambda v:round(v*(1 if i==5 else .55))))
    im.alpha_composite(icon,(x+(146-icon.width)//2,y+(5 if i==5 else 18)))
    if i==5:
        d.text((x+73,y+109),'Game',font=get(24),anchor='mm',fill='white')
item_names=['Game Library','CheatRunner','Emulators','Grand Theft Auto V','Homebrews','Itemzflow','Lineup','Overcooked! 2']
for j,nm in enumerate(item_names):
    x=484;y=441+(j-2)*78
    if y<350 or y>985: continue
    chosen=(j==2)
    cat=Image.open(P/('xmb_cat_game.png' if j==0 else 'xmb_cat_settings.png')).convert('RGBA').resize((61 if chosen else 45,)*2)
    cat.putalpha(cat.getchannel('A').point(lambda v:round(v*(1 if chosen else .60))))
    im.alpha_composite(cat,(x,y+6))
    d.text((x+(82 if chosen else 66),y+34),nm,font=get(27 if chosen else 21),anchor='lm',fill=(255,255,255,255) if chosen else (197,215,239,143))
d.text((1840,48),'11/13/2026   2:05 PM',font=get(20),anchor='ra',fill=(241,245,255,205))
d.text((1840,1030),'X Enter      Triangle Options      O Back',font=get(18),anchor='rb',fill=(221,231,246,140))
preview=R/'docs/PS5_XMB_v11_preview.png';preview.parent.mkdir(exist_ok=True)
im.convert('RGB').resize((1440,810),Image.Resampling.LANCZOS).save(preview)
print(preview)
