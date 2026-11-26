#!/usr/bin/env python3
"""Verify v1.4 overwrite correctness without guessing hardware results.

These are source contracts; no claim of PS5 SDK compilation or real PS5 playback.
"""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip())==1,'Embedded theme and canonical XMB extension differ'
for n in ['xmb_research/linkev_source/LICENSE','xmb_research/linkev_source/ps3xmbwave/spline.js',
          'xmb_research/linkev_source/ps3xmbwave/spline-reverse.js',
          'xmb_research/linkev_source/ps3xmbwave/particles.js',
          'xmb_patch/render_linkev_frames.py','xmb_patch/configure_linkev_frames.py']:
 assert (R/n).exists(),n
assert 'var XMB_LINK_EV_AVAILABLE = ' in x
assert "waveMode: 'linkev'" in x
assert 'LINKEV_NATIVE_12_FRAMES_ACTIVE' in x
assert 'LINKEV_FALLBACK_VSH_NATIVE' in x
assert 'xmb_linkev_frame_' in x and 'motion.shaderFrame.interpolate' in x
assert 'A.loop(A.timing(motion.shaderFrame' in x
assert 'VideoWallpaper' not in x
assert 'PS3_XMB_Background_User.mp4' not in x
assert 'xmbBgmHook(sc)' in x and 'xmbBgmRequest(true)' in x
assert 'xmbPlaySfx(kind, direction)' in x
assert 'return folderLink(item.id);' in x
assert "xmbDeactivate('USER_BACK')" in x
assert "if (cat.id==='game') return cat.entries.concat(xmbGames()," in x
assert 'XMB_WEB_NATIVE_CATEGORIES' in x
assert 'WAVE_30_STRIP_NATIVE_DEFORMATION' in x
assert "kind:'wave-switch'" in x
from json import loads
mark_a='/* XMB_DESIGNER_BEGIN */';mark_b='/* XMB_DESIGNER_END */'
assert x.count(mark_a)==1 and x.count(mark_b)==1
obj=loads(x.split(mark_a,1)[1].split(mark_b,1)[0])
assert obj['categoryCenterX']==566 and obj['itemCenterX']==566
assert obj['itemFocusY']==425 and obj['gameFocusWidth']==180
assert obj['itemGap']==80 and obj['clockTop']==75
assert obj['gameFocusHeight']==180 and obj['gameIdleWidth']==78 and obj['gameIdleHeight']==78
assert 'var XMB_XMBWEB_CAPTURE_AVAILABLE' in x
assert 'XMB_WEB_CAT_MS = 250, XMB_WEB_ITEM_MS = 200' in x
# V33: geometry is drawn by the xmb-web-exact renderer (see test_v33_xmbweb_exact.py)
assert 'xmbPlayedLabel' in x

assert not re.search(r'fontSize\s*:\s*\d+',x)
pack=(R/'xmb_patch/embed_media.py').read_text()
assert 'PS3_XMB_Background_User.mp4' not in pack
assert "('tabs_pcm','PS3_ScrollTaps_PCM.s16le')" in pack
assert "('apps_pcm','PS3_ScrollApps_PCM.s16le')" in pack
asm=(R/'src/source/shellui/src/zt_xmb_embedded_media.s').read_text()
assert '.mp4' not in asm
# When flag true it MUST be backed by a verifiable 12-frame capture.
sys.path.insert(0,str(R/'xmb_patch'))
from render_linkev_frames import valid_manifest
if 'XMB_LINK_EV_AVAILABLE = true;' in x:
 assert valid_manifest(),'Renderer flag claims an absent/fake capture'
else:
 assert 'XMB_LINK_EV_AVAILABLE = false;' in x
print('PASS: V32 native xmb-web category/item motion, 180/78px app icons, wave-capture branch and recovery')
