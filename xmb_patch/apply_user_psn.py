#!/usr/bin/env python3
"""Use the clean transparent PSN orb from the user's supplied image."""
from pathlib import Path
from PIL import Image
import shutil
R=Path(__file__).resolve().parents[1]
p=R/'ps3_assets/PSN_USER_ORB.png'
with Image.open(p) as im:
    im.verify()
with Image.open(p) as im:
    assert im.mode=='RGBA' and im.size==(384,384),('Unexpected PSN orb image',im.mode,im.size)
shutil.copyfile(p,R/'theme/particles/xmb_cat_psn.png')
print('Installed user PSN orb icon (transparent 384px)')
