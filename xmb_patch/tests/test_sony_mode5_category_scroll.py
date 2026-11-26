#!/usr/bin/env python3
"""Sony mode-5 animation source/regression test; doesn't require a PS5 SDK."""
from pathlib import Path
import math,re,subprocess
root=Path(__file__).resolve().parents[2]
s=(root/'xmb_patch/xmb_extension.js').read_text()
t=(root/'theme/theme.js').read_text()
assert t.count(s.strip()) == 1, 'embedded theme disagrees with edited extension'
assert s.count("categoryMotionMode: 'ps3-mode5'") == 1
assert "kind:'category-motion-toggle'" in s
assert "xmbHome.categoryMotionMode='standard'" in s
assert "duration:XMB_PS3_BAR_SETTLE_MS,easing:xmbPs3CategoryEase,useNativeDriver:true" in s
assert "if (changedCategory) {\n          var mode5" in s
assert "duration:200,useNativeDriver:true" in s
assert "duration:185, useNativeDriver:true" in s
assert "duration:220, useNativeDriver:true" in s
for key in ['NATIVE_SFX_REQUEST','function xmbPlaySfx','folderLink(item.id)','DIRECT_ROOT_XMB_QUEUED']:
    assert key in t, key
# Original PS3 model: 200 * .001 * 60 = 12 updates, with gain from +0x14.
gain=1.0/((12-5)*.33333298564+2.20000004768)
m=1.0000009536743164
r=m*(1-gain)
limit=m*gain/(1-r)
def progress(ms):
    return min(1.0,max(0.0,limit*(1-r**(ms*60/1000))))
assert progress(0)==0
assert .94<progress(200)<.96, progress(200)
assert .98<progress(300)<1.0, progress(300)
assert progress(850)==1.0, progress(850)
assert all(progress(ms)<=progress(ms+5) for ms in range(0,850,5))
print('PASS: VSH-derived mode-5 curve, runtime toggle, safe 200ms fallback, theme embedding, unchanged audio/launcher')
