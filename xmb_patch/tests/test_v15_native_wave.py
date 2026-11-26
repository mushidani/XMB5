#!/usr/bin/env python3
"""Host-side v1.4 native-wave overwrite patch compatibility checks.
Does not claim hardware validation or PS3 shader equivalence.
"""
from pathlib import Path
from PIL import Image
import re
R=Path(__file__).resolve().parents[2]
js=(R/'theme/theme.js').read_text(encoding='utf-8')
source=(R/'xmb_patch/xmb_extension.js').read_text(encoding='utf-8')
assert js.count(source.strip())==1, 'theme.js and xmb_extension.js out of sync'
for name in ('xmb_native_dark_gradient.png','xmb_native_silk_back.png',
             'xmb_native_silk_front.png','xmb_native_silk_edge.png'):
    f=R/'theme/particles'/name
    with Image.open(f) as im:
        im.load()
        assert im.format=='PNG' and im.size==(1920,1080), name
        if 'silk' in name:assert im.getextrema()[3][0] == 0 and im.getextrema()[3][1] >= 100
assert "waveMode: 'native'" in source, 'live native VSH palette is default; video remains a selectable fallback'
assert 'LIVE_NATIVE_WAVE_ACTIVE' in source
assert 'LIVE_WAVE_FALLBACK_VIDEO' in source
assert "kind:'wave-toggle'" in source
assert 'ps3-xmb-user-video' in source
assert "vshSilk+'edge'" in source and "'xmb_native_silk_'" in source
assert 'A.loop && A.sequence && A.timing' in source
assert 'motion.silkA.interpolate' not in source or 'LIVE_NATIVE_WAVE_ACTIVE' in source
assert 'waveSpecs.forEach' in source
# Ensure existing confirmed routes, audio, layout gate and game data remain intact.
for token in ('return folderLink(item.id);','xmbPlaySfx(kind, direction)',
              "'XMB_OVERLAY_ACTIVATED'", "xmbDeactivate('USER_BACK')",
              "case 6: return xmbGames();",'PS3_XMB_Background_User.mp4',
              "sound:false,suppressBgm:true", "fontSize:xmbFontSize"):
    assert token in source,token
assert not re.search(r'fontSize\s*:\s*\d',source)
# All wave animation uses native Animated images only: no frame-rate JS timers,
# image regeneration, file writing, or video playback required for native mode.
part=source[source.index('var nativeWave ='):source.index('// Prefer original title metadata')]
assert 'setInterval' not in part and 'setTimeout' not in part and 'fetch(' not in part
assert 'VideoWallpaper' not in part.split('if (nativeWave)')[1].split('} else {')[0]
print('PASS: v1.4 one-ELF Native Wave assets, input/audio/game paths, fallback, font safety')
