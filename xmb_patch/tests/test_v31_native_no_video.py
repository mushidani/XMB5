#!/usr/bin/env python3
from pathlib import Path
import re, json
from PIL import Image
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip())==1
for token in ('WAVE_30_STRIP_NATIVE_DEFORMATION', 'WAVE_NATIVE_DRIVER_UNAVAILABLE',
              'Array.from({length:30}', 'motion.warp[bi*10+k]',
              'xmb_vsh_month_', 'xmb_vsh_silk_', 'xmbBgmHook(sc)',
              'BGM_STOP_REQUESTED','BGM_REQUEST_SUPPRESSED','BGM_STOCK_RESTORED'):
    # Some tokens in the script are represented in object literals instead of direct expressions
    if token=='left:XMB_ANCHOR.labelX': token='titleLeft:XMB_ANCHOR.labelX'
    if token=='left:XMB_ANCHOR.centerX-w/2': token='left:XMB_ANCHOR.centerX-w/2'
    assert token in x or token in t,token
assert 'VideoWallpaper' not in x
assert 'PS3_XMB_Background_User.mp4' not in x
assert "kind:'wave-toggle'" not in x
assert 'return folderLink(item.id);' in x
assert 'xmbPlaySfx(kind, direction)' in x
assert "xmbDeactivate('USER_BACK')" in x
assert "if (cat.id==='game') return cat.entries.concat(xmbGames()," in x
assert 'XMB_WEB_NATIVE_CATEGORIES' in x
assert 'opacity:loaded?.53:0' in x
assert not re.search(r'fontSize\s*:\s*\d',x)
a=R/'xmb_patch/embed_media.py'
pack=a.read_text()
assert 'PS3_XMB_Background_User.mp4' not in pack and 'PS3_ScrollTaps_SFX.mp4' not in pack
assert "('tabs_pcm','PS3_ScrollTaps_PCM.s16le')" in pack
assert "('apps_pcm','PS3_ScrollApps_PCM.s16le')" in pack
for name in ['PS3_ScrollTaps_PCM.s16le','PS3_ScrollApps_PCM.s16le']:
    p=R/'ps3_assets'/name
    assert p.stat().st_size>2000
cpp=(R/'src/source/shellui/src/zt_xmb_media.cpp').read_text()
assert 'AUDIO_ONLY_NO_MP4_INSTALLED' in cpp and 'zt_xmb_sfx_play' in cpp
assert 'PS3_XMB_Background_User.mp4' not in cpp
asm=(R/'src/source/shellui/src/zt_xmb_embedded_media.s').read_text()
assert 'tabs_pcm_start' in asm and 'apps_pcm_start' in asm
assert '.mp4' not in asm
for i in range(1,13):
 for period in ('day','night'):
  with Image.open(R/'theme/particles'/f'xmb_vsh_month_{i:02d}_{period}.png') as im:
   im.load();assert im.size==(64,32)
assert (R/'src/source/shellui/src/theme_web.cpp').read_text().find('xmb-sfx')>=0
print('PASS: VSH palette + 30 independent strips; no MP4; guarded BGM mute; one-axis geometry; PCM/launch/recovery')
