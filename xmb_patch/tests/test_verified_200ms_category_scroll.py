#!/usr/bin/env python3
"""Source consistency check for the 200ms horizontal animation-only overlay."""
from pathlib import Path
root=Path(__file__).resolve().parents[2]
x=(root/'xmb_patch/xmb_extension.js').read_text(encoding='utf-8').strip()
t=(root/'theme/theme.js').read_text(encoding='utf-8')
assert t.count(x)==1, 'Theme and XMB extension mismatch; keep both files together'
assert "A.timing(motion.cat, {toValue:catNow, duration:200, useNativeDriver:true}).start();" in x
assert "A.timing(motion.row, {toValue:itemNow, duration:185, useNativeDriver:true}).start();" in x
assert "A.timing(motion.panel, {toValue:1, duration:220, useNativeDriver:true}).start();" in x
assert 'duration:225, useNativeDriver:true}).start()' not in x
assert 'DIRECT_ROOT_XMB_QUEUED' in t
assert 'NATIVE_SFX_REQUEST' in x
assert 'function XmbSelectedLink(props)' in x
print('PASS: 200ms category timing, unchanged row/panel timing, audio, launcher, and one embedded extension')
