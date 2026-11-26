#!/usr/bin/env python3
"""V33: the XMB is drawn by the xmb-web-exact renderer. Static checks (no console, no Node needed):
 - renderer bundle is inlined once in xmb_extension.js and theme.js and carries xmb-web's constants (layout, timings, cadence)
 - every icon/photo asset the menu data references exists as an embeddable PNG, plus the hover pictures and 16 wave frames
 - only FontSizePS-safe text paths remain in the extension (no raw fontSize numbers), key repeat uses the xmb-web cadence
"""
from pathlib import Path
import re, json
R = Path(__file__).resolve().parents[2]
x = (R / 'xmb_patch/xmb_extension.js').read_text(encoding='utf-8')
t = (R / 'theme/theme.js').read_text(encoding='utf-8')
b = (R / 'xmb_patch/xmb_native_bundle.js').read_text(encoding='utf-8').strip()
assert t.count(x.strip()) == 1, 'theme.js must contain the extension exactly once'
assert x.count(b) == 1 and t.count(b) == 1, 'renderer bundle must be inlined exactly once (run xmb_patch/embed_native_bundle.py)'
assert 'var ztXmbNative' in b

# ---- xmb-web constants carried by the bundle (extracted from xmb-web index.html sha256 cbf9ff94...)
expect = {'CAT_X': 566, 'CAT_Y': 289, 'CAT_SPACING': 203, 'CAT_ICON_ACTIVE': 168, 'CAT_ICON_INACTIVE': 117,
          'ITEM_ICON_X': 566, 'ITEM_FOCUS_Y': 515, 'ITEM_SPACING': 80, 'ITEM_ICON_SIZE': 78, 'ITEM_ICON_ACTIVE': 180,
          'ITEM_TEXT_X': 683, 'ITEM_ACTIVE_PAD': 87, 'PARENT_COL_X': 316,
          'CAT_ANIM_MS': 250, 'ITEM_ANIM_MS': 200, 'SUBMENU_ANIM_MS': 250,
          'INPUT_INITIAL_DELAY_MS': 300, 'INPUT_REPEAT_MS': 200, 'INPUT_MIN_REPEAT_MS': 50}
for k, v in expect.items():
    m = re.search(r'\b%s:\s*([0-9.]+)' % k, b)
    assert m and float(m.group(1)) == v, 'bundle constant %s != %s (%s)' % (k, v, m and m.group(1))
assert re.search(r'INPUT_ACCEL_MULT:\s*1\.4\b', b)

# ---- assets
P = R / 'theme/particles'
have = {f.stem for f in P.glob('*.png')}
names = set(re.findall(r'"(?:iconAsset|asset)":"(xmbweb_[a-z0-9_]+)"', x))
assert len(names) >= 50
missing = sorted(n for n in names if n not in have)
assert not missing, 'menu data references missing PNG assets: %s' % missing
for n in ('bg_storemain', 'bg_signup', 'bg_whatsnew', 'bg_photogallery', 'bg_storegame', 'bg_storevideo'):
    assert 'xmbweb_cinfo_' + n in have, 'hover picture missing: ' + n
for i in range(16):
    assert 'xmbweb_wave_frame_%02d' % i in have, 'wave frame %d missing' % i
for n in have:
    assert re.fullmatch(r'[a-z0-9_]+', n), 'bad embed name ' + n

# ---- text safety + cadence + hooks
assert not re.search(r'fontSize\s*:\s*\d', x), 'raw fontSize number in extension'
assert 'XMB_REPEAT_IV = ztXmbNative.repeatIntervals' in x and 'XMB_V26_SONY_FIRST_MS' not in x
assert 'V33_XMBWEB_EXACT_RENDERER_READY' in x and "xmbDeactivate('NO_NATIVE_ANIMATED')" in x
assert 'fontSize:fontSize' in x, 'renderer must snap text to the FontSizePS table via theme fontSize()'
for token in ('full-view', 'full-cat', 'full-item'):
    assert ('"%s"' % token) in b or ("'%s'" % token) in b, 'renderer must report native layout kind ' + token
print('PASS: V33 xmb-web-exact renderer inlined once; constants, assets (%d referenced), hover pictures, 16 wave frames, cadence' % len(names))
