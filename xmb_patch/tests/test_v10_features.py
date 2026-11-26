#!/usr/bin/env python3
"""Host-only source contracts, deliberately no PS5 hardware success claims."""
from pathlib import Path
root=Path(__file__).resolve().parents[2]
ext=(root/'xmb_patch/xmb_extension.js').read_text()
theme=(root/'theme/theme.js').read_text()
assert 'PS5XMB HOME V1.0 CLASSIC MOTION XMB' in ext
assert theme.count(ext.strip())==1
# When the user highlights the 8th game, the prior game starts at y=464-68=396,
# safely below the category strip (top 240 + height 125 = 365).
assert 'index - 1' in ext and 'index - 3' not in ext
assert 'top: j * 68' in ext and 'left:448, top:464' in ext
assert 464-68 > 240+125
# Native clock MUST be made transparent, not only the wrapper hidden.
assert "s.clock.color = 'transparent'; /* prevents duplicate native PS5 clock */" in theme
assert "var timeText = ((hr % 12) || 12)" in ext
assert 'new Date().toLocaleString' not in ext
assert "key:'xmb-clock'" in ext
# RN Native Animated only; no CSS animation, browser timer for 60fps, or WebGL.
assert 'var motionState = React.useRef(null)' in ext
assert 'A.timing(motion.cat' in ext and 'A.timing(motion.row' in ext
assert "motion && A && A.View ? A.View : rn.View" in ext
assert 'A.loop(A.sequence' in ext and 'useNativeDriver:true' in ext
assert 'ps5xmb_wave_far.png' in ext and 'ps5xmb_wave_near.png' in ext
# New links come from documented PS5 URI list; existing proven game route stays.
assert "return folderLink(item.id);" in ext
for url in ('pssettings:play?mode=settings&function=network',
            'pssettings:play?mode=settings&function=controller',
            'pssettings:play?mode=settings&function=language',
            'pssettings:play?mode=settings&function=notification',
            'pstc:browse'):
    assert url in ext, url
assert 'XMB_OVERLAY_ACTIVATED' in ext
assert "xmbDeactivate('USER_BACK')" in ext
assert "function XmbSelectedLink(props)" in ext
print('PASS: v1.0 title separation, clock, native motion, optional waves, routes, launch+recovery contracts')
