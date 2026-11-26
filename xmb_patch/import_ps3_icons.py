#!/usr/bin/env python3
"""Optionally import the user's OWN PS3 theme icon PNGs, never download or bundle Sony assets.

Run AFTER make_xmb_icons.py (which makes clearly non-exact fallbacks).  Files
inside ps3_assets/icons have the names listed here.  A user may provide a
personal export of icons from an XMB theme which they have the right to use.
"""
from pathlib import Path
import argparse, shutil
from PIL import Image

NAMES = ('users','settings','photo','music','video','tv','game','network','psn','friends')
def main():
    p=argparse.ArgumentParser()
    p.add_argument('--directory',default='ps3_assets/icons')
    p.add_argument('--allow-empty',action='store_true')
    a=p.parse_args()
    root=Path(__file__).resolve().parents[1]
    src=root/a.directory
    dst=root/'theme/particles'
    dst.mkdir(parents=True,exist_ok=True)
    seen=[]
    # For late PS3 versions, TV/Video Services goes between Video and Game.
    # Until user provides the original TV icon, inherit the existing Video
    # icon instead of showing a broken glyph.
    tv=dst/'xmb_cat_tv.png'
    if not tv.exists():
        video=dst/'xmb_cat_video.png'
        if video.exists():shutil.copyfile(video,tv)
    for name in NAMES:
        img=src/(name+'.png')
        if not img.is_file():continue
        with Image.open(img) as im:
            if im.format != 'PNG' or im.width<24 or im.height<24 or im.width>2048 or im.height>2048:
                raise ValueError('Invalid icon '+str(img))
            # Preserve the supplied pixels and alpha. PS5 scales it at render.
            im.verify()
        shutil.copyfile(img,dst/('xmb_cat_'+name+'.png'))
        seen.append(name)
    if not seen and not a.allow_empty:
        raise SystemExit('No icons: put users.png, settings.png, photo.png etc in '+str(src))
    print('PS3 user-supplied category icons imported:', ', '.join(seen) or 'none (original fallback art retained)')
if __name__=='__main__': main()
