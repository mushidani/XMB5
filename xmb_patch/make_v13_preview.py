#!/usr/bin/env python3
"""Off-console QA preview of user-supplied PS3 theme and XMB positions.
This image is not captured from ShellUI and not a substitute for hardware QA.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess, io
R=Path(__file__).resolve().parents[1]
vid=R/'ps3_assets/PS3_XMB_Background_User.mp4'
frame=subprocess.check_output(['ffmpeg','-v','error','-ss','3','-i',str(vid),'-frames:v','1','-f','image2pipe','-vcodec','png','-'])
im=Image.open(io.BytesIO(frame)).convert('RGBA').resize((1920,1080),Image.Resampling.BICUBIC)
P=R/'theme/particles'
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def ff(z):return ImageFont.truetype(font,z)
cat=('users','settings','photo','music','video','tv','game','network','psn','friends')
chosen=6
D=ImageDraw.Draw(im)
for k,name in enumerate(cat):
    x=329+(k-chosen)*154
    if x < -200 or x > 1920:continue
    focus=(k==chosen)
    size=100 if focus else 70
    icon=Image.open(P/f'xmb_cat_{name}.png').convert('RGBA').resize((size,size),Image.Resampling.LANCZOS)
    if not focus:icon.putalpha(icon.getchannel('A').point(lambda a:int(a*.63)))
    im.alpha_composite(icon,(int(x+(154-size)/2),int(309+(1 if focus else 16))))
    if focus:
        d=ImageDraw.Draw(im)
        d.text((x+77,438),'Game',font=ff(25),fill='white',anchor='mm')
rows=[('Game Data Utility','xmb_item_gamedata',-2,''),
      ('Memory Card Utility (PS/PS2)','xmb_item_vmc',-1,''),
      ('Saved Data Utility','xmb_item_savedata',0,'User 1'),
      ('Trophy Collection','xmb_item_trophy',1,'User 1'),
      ('Game Library','xmb_item_game',2,'Game Library')]
for name,ico,delta,sub in rows:
    top=155+(delta+1)*112 if delta<0 else (574 if delta==0 else 792+(delta-1)*116)
    focus=delta==0
    size=116 if focus else 72
    image=Image.open(P/f'{ico}.png').convert('RGBA').resize((size,size),Image.Resampling.LANCZOS)
    if not focus:image.putalpha(image.getchannel('A').point(lambda a:int(a*.57)))
    im.alpha_composite(image,(316,int(top+8)))
    xx=316+size+(30 if focus else 28);yy=int(top+(size-18)/2)
    d=ImageDraw.Draw(im)
    if focus:
        bloom=Image.new('RGBA',im.size);b=ImageDraw.Draw(bloom)
        b.text((xx,yy),name,font=ff(34),fill=(255,255,255,255),anchor='lm')
        bloom=bloom.filter(ImageFilter.GaussianBlur(10))
        im=Image.alpha_composite(im,bloom);d=ImageDraw.Draw(im)
        d.text((xx,yy),name,font=ff(34),fill='white',anchor='lm')
        if sub:d.text((xx,yy+36),sub,font=ff(23),fill=(240,240,247,230),anchor='lm')
    else:d.text((xx,yy),name,font=ff(25),fill=(197,199,206,130),anchor='lm')
D=ImageDraw.Draw(im)
D.text((1855,43),'11/13/2026     2:05 PM',font=ff(20),fill=(222,225,234,195),anchor='ra')
D.text((1853,1031),'X Enter     Triangle Options     O Back',font=ff(18),fill=(214,215,224,170),anchor='ra')
out=R/'docs/PS5_XMB_v13_OFFLINE_PREVIEW.png';out.parent.mkdir(exist_ok=True)
im.convert('RGB').resize((1440,810),Image.Resampling.LANCZOS).save(out,optimize=True)
print(out,out.stat().st_size)
