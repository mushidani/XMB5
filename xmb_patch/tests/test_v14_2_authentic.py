#!/usr/bin/env python3
"""PS5 XMB overwrite patch regression: video, BGM, layout, timestamps.
Host-side source/integrity checks, not PS5 hardware proof.
"""
from pathlib import Path
import re, json, subprocess
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip()) == 1, 'Embedded XMB differs from canonical extension'
# No per-focused-game video teardown or uncovered native PS5 home backdrop.
assert "backgroundColor:xmbHome.active ? '#07152e' : 'transparent'" in x
assert 'nativeBgId' not in x and 'GAME_BG_NATIVE_SET' not in x
assert "if (typeof VideoWallpaper === 'function')" in x
assert "LIVE_WAVE_FALLBACK_VIDEO" in x
assert "LIVE_NATIVE_WAVE_ACTIVE" in x
assert "sound:false,suppressBgm:true" in x
assert "suppressBgm: sound || !!(props && props.suppressBgm)" in t
# The user's native PCM sounds are still called, independent of the video decoder.
assert 'xmbPlaySfx' in x and "'/xmb-sfx?kind='" not in x # URL built with literal port
assert 'http://127.0.0.1:4444/xmb-sfx?kind=' in x
assert 'PS3_XMB_Background_User.mp4' in x
# Sony's already-collected lastPlayedDate is used; not lastAccessDate.
assert 'function xmbPlayedLabel(item)' in x and 'T.played' in x
assert 'Last played ' not in x or "return 'Last played '" not in x
assert "xmbPlayedLabel(item)" in x
assert "playedLabel:xmbPlayedLabel" in x
# Real PS3-inspired rectangular icons and selected title only.
assert "var w = game ? (chosen ? 278 : 126)" in x
assert "var h = game ? (chosen ? 156 : 72)" in x
assert "resizeMode:'contain'" in x
assert 'var showName=!game || chosen' in x
assert 'var label=showName ?' in x
assert 'xmbRowY(j-k)' in x
assert 'for (var k=low;k<=high;k++)' in x
assert 'for (var k=0;k<=100;k++)' not in x
assert "opacity:current?1:.45" in x
assert "case 6: return xmbGames();" in x
assert 'return folderLink(item.id)' in x
assert "xmbDeactivate('USER_BACK')" in x
assert 'XMB_OVERLAY_ACTIVATED' in x
# Existing one-ELF payload embedding preserved.
media=(R/'src/source/shellui/src/zt_xmb_media.cpp').read_text()
assert 'MEDIA_ONE_ELF_READY' in media and 'zt_xmb_sfx_play' in media
assert 'zt_xmb_media_install();' in (R/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert not re.search(r'fontSize\s*:\s*\d+',x), 'Raw RN font size may break ShellUI'
print('PASS: native animated wave, single optional video fallback, BGM suppression, rectangles, labels, PCM sound and routing')
