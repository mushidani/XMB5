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
assert 'case 6: return xmbGames();' in x
assert 'WAVE_30_STRIP_NATIVE_DEFORMATION' in x
assert "kind:'wave-switch'" in x
from json import loads
mark_a='/* XMB_DESIGNER_BEGIN */';mark_b='/* XMB_DESIGNER_END */'
assert x.count(mark_a)==1 and x.count(mark_b)==1
obj=loads(x.split(mark_a,1)[1].split(mark_b,1)[0])
assert obj['categoryCenterX']==557 and obj['itemCenterX']==557
assert obj['itemFocusY']==419 and obj['gameFocusWidth']==315
assert obj['itemGap']==80 and obj['clockTop']==62
for field in ('categoryCenterX','itemCenterX','itemFocusY','itemGap',
    'gameFocusWidth','gameFocusHeight','gameIdleWidth','gameIdleHeight',
    'gameLabelX','otherLabelX','clockRight','clockTop','gameThumbFit'):
 assert 'XMB_DESIGNER.'+field in x,field
assert 'XMB_DESIGNER.itemCenterX-w/2' in x
assert 'XMB_DESIGNER.itemBelowY + (delta-1) * XMB_DESIGNER.itemGap' in x
assert "backgroundColor:'transparent'" in x
assert "backgroundColor:game?'rgba(3,7,15,.28)':'transparent'" not in x
assert 'xmbPlayedLabel(item)' in x
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
print('PASS: XMB Designer-configurable geometry, transparent artwork, no MP4, native frames, PCM and recovery')
