#!/usr/bin/env python3
"""Back-compatible build entry: v1.1 replaces v1.0 waves with silk assets."""
from pathlib import Path
import runpy
R=Path(__file__).resolve().parents[2]
runpy.run_path(str(R/'xmb_patch/tests/check_v11_assets.py'))
script=(R/'theme/theme.js').read_text()
assert 'THEME.hideTabs = true' in script and 'THEME.hideClock = true' in script
assert 'THEME.hideProfile = true' in script
assert "s.clock.color = 'transparent'; /* prevents duplicate native PS5 clock */" in script
assert 'xmb_cat_' in script and 'ps5xmb_user_video_fallback' in script
assert 'PS5XMB HOME V1.4 MEDIA FOCUS FIX' in script
cpp=(R/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert 'theme_value(script, "xmbHomeOn", 0) != 0' in cpp
assert 'g_theme_hides_focus = hide' in cpp
assert 'xmbOptionLabels' in script and 'onTriangleKeyDown' in script
assert 'function folderLink(id)' in script and 'function XmbSelectedLink(props)' in script
print('PASS: v1.1 visual assets, stock header/focus hiding, original native launcher')
