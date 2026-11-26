#!/usr/bin/env python3
"""Host-side source safety and layout contract for the working v1.0 PS5 fork."""
from pathlib import Path
import re
R = Path(__file__).resolve().parents[2]
ext = (R/'xmb_patch/xmb_extension.js').read_text()
src = (R/'theme/theme.js').read_text()
assert src.count(ext.strip()) == 1, 'embedded theme is out of sync with XMB source'
assert 'PS5XMB HOME V1.2 LIVE WAVE XMB' in src
# Preserve the user-confirmed game and route paths and native stage-gate.
for needle in ("return folderLink(item.id);", "function XmbSelectedLink(props)",
               "'XMB_OVERLAY_ACTIVATED'", "function xmbCapture(type, props)",
               "'full-view'", "'full-cat'", "'full-item'", "'RENDER_THROW'",
               "onTriangleKeyDown", "xmbDeactivate('USER_BACK')",
               "THEME.hideClock = true"):
    assert needle in src, needle
assert "s.clock.color = 'transparent'; /* prevents duplicate native PS5 clock */" in src
# List stays clipped BELOW the category bar and moves only its inner track.
assert "left:448,top:222" in ext
assert "left:484,top:357" in ext
assert "top:84" in ext and "j*78" in ext
assert "overflow:'hidden'" in ext
assert 357+84-78 >= 222+124, 'previous game must not touch the category bar'
assert "motion.row.setValue(itemNow)" in ext, 'different category must reset row position'
assert "motion.panel.setValue(0.25)" in ext
assert "duration:185" in ext and "duration:225" in ext
assert "useNativeDriver:true" in ext
# Only supported FontSizePS table values: go through ZhiThemes fontSize helper.
assert 'function xmbFontSize(' in ext
assert not re.search(r'fontSize\s*:\s*\d', ext), 'raw RN fontSize can crash ShellUI'
# Graphical assets, not firmware-derived shader files.
for item in ('ps5xmb_bg_classic', 'ps5xmb_silk_back','ps5xmb_silk_front',
             'ps5xmb_sparkles', 'ps5xmb_focus_halo', 'xmb_cat_'):
    assert item in ext
assert "'seasonal'" in ext and "'theme-toggle'" in ext
assert "fontSize:xmbFontSize(18)" in ext
assert "var now=new Date()" in ext
assert "visualMode: 'classic'" in ext
print('PASS: 1.1 geometry, native-motion reset, font safety, launch/route/recovery, seasonal mode')
