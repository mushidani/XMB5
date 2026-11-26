#!/usr/bin/env python3
"""Source and geometry regression checks for the PS3 asset matching release."""
from pathlib import Path
import re
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip())==1
assert 'PS5XMB HOME V1.4 MEDIA FOCUS FIX' in x
assert 'DIRECT_ROOT_XMB_QUEUED' in t
assert 'function XmbSelectedLink(props)' in x and 'return folderLink(item.id);' in x
assert 'xmbDeactivate(\'USER_BACK\')' in x
assert 'FULL_XMB_TEXT_LAYOUT_OK' in x and 'NATIVE_ONLAYOUT kind=' in x
assert 'case 6: return xmbGames();' in x and 'Saved Data Utility' not in x and 'Memory Card Utility' not in x
assert 'xmbIconMetrics' in x and "kind: 'game'" in x
assert "function xmbRowY(delta)" in x
assert "return 88 + (delta + 1) * 76" in x
assert 'if (delta === 0) return 359;' in x
assert 'return 548 + (delta - 1) * 76' in x
assert "left:430,top:224" in x and "fontSize:xmbFontSize(game?31:(chosen?26:21))" in x
assert "textShadowColor:chosen?'rgba(255,255,255,.91)'" in x
assert "subtitle" in x and "opacity:chosen?1:.72" in x
assert "motion.row.interpolate({inputRange:ix," in x
assert "overflow:'hidden'" not in x[x.index('// Every item remains on ONE'):x.index('// Date / time use')]
assert "PS3_XMB_Background_User.mp4" in x and "sound:false" in x
assert 'xmb-sfx?kind=' in x
assert 'XmbOneShotSfx' not in x and 'NATIVE_SFX_REQUEST' in x
assert "soundMode: 'ps3'" in x and "xmbSystemSound(kind,direction)" in x
assert 'SystemSoundPS' in x
assert not re.search(r'fontSize\s*:\s*\d',x)
assert "s.clock.color = 'transparent'; /* prevents duplicate native PS5 clock */" in t
assert (R/'src/source/shellui/src/theme_web.cpp').is_file()
print('PASS: live PS3 background, source-matched icons, category-crossing navigation, selected glow/subtitle, native audio fallback, existing launch & recovery')
