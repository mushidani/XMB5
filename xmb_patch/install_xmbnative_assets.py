#!/usr/bin/env python3
"""V33: install the xmb-web-exact icon set and the content-info hover pictures into theme/particles/ (which the build embeds
in the ELF and ZhiThemes writes to /data/ZhiThemes/Assets/particles/ at start).

 * icons: xmb-web's own renderNormalMapIcon() output (static Phong render), gain-matched to the page, so they are the same
   translucent glass icons xmb-web shows over the wave (not flat white). xmb_icon_NNN.png -> xmbweb_xmb_icon_NNN.png.
 * hover pictures: the six cinfo backgrounds xmb-web fades in behind PSN / Photo Gallery items, 960x540 PNG (embedding is PNG-only).
Idempotent; Pillow only.
"""
from pathlib import Path
from PIL import Image
R = Path(__file__).resolve().parents[1]
S = R / 'xmb_patch/native_assets'
D = R / 'theme/particles'
D.mkdir(parents=True, exist_ok=True)
n = 0
for f in sorted((S / 'icons').glob('*.png')):
    name = f.stem
    dst = 'xmbweb_' + name + '.png'            # xmb_icon_000 -> xmbweb_xmb_icon_000 ; playstation_store -> xmbweb_playstation_store
    with Image.open(f) as im:
        im = im.convert('RGBA'); im.save(D / dst, optimize=True)
        # V35 hand-made mip levels: the PS5 samples bilinearly without mipmaps, so a 256 px icon shown at 78 / 117 px aliases.
        # _s (96 px) serves the 78 px list rows, _m (136 px) the 117 px inactive category icons; LANCZOS = proper minification.
        if im.width >= 128:
            for suf, px in (('_s', 96), ('_m', 136)):
                im.resize((px, px), Image.Resampling.LANCZOS).save(D / ('xmbweb_' + name + suf + '.png'), optimize=True)
    n += 1
h = 0
for f in sorted((S / 'backgrounds').glob('cinfo-bg-*.jpg')):
    name = 'xmbweb_cinfo_' + f.stem.replace('cinfo-', '').replace('-', '_')          # cinfo-bg-storemain -> xmbweb_cinfo_bg_storemain
    with Image.open(f) as im:
        im = im.convert('RGB').resize((960, 540), Image.Resampling.LANCZOS); im.save(D / (name + '.png'), optimize=True)
    h += 1
for f in sorted((S / 'clock').glob('clock_*.png')):
    with Image.open(f) as im:
        im.convert('RGBA').save(D / ('xmbweb_' + f.stem + '.png'), optimize=True)
for f in sorted((S / 'arrow').glob('arrow_*.png')):                     # V54: the PS3 submenu arrow (make_arrow_asset.py)
    with Image.open(f) as im:
        im.convert('RGBA').save(D / ('xmbweb_' + f.stem + '.png'), optimize=True)
for f in sorted((S / 'optmenu').glob('optmenu_*.png')):               # V62: the PS3 Triangle options panel (make_optmenu_asset.py)
    with Image.open(f) as im:
        im.convert('RGBA').save(D / ('xmbweb_' + f.stem + '.png'), optimize=True)
for f in sorted((S / 'extra').glob('*.png')):                         # V69: PS3 folder icon, Triangle hint button (make_extra_assets.py)
    with Image.open(f) as im:
        im.convert('RGBA').save(D / ('xmbweb_' + f.stem + '.png'), optimize=True)
for f in sorted((S / 'glow').glob('glow_*.png')):                       # V37: the soft halo behind the focused title (3 slices)
    with Image.open(f) as im:
        im.convert('RGBA').save(D / ('xmbweb_' + f.stem + '.png'), optimize=True)
print('installed %d icons and %d hover pictures into theme/particles' % (n, h))
