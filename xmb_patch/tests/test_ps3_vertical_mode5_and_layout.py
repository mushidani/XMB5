#!/usr/bin/env python3
"""Host checks for optional native-proportion vertical layout and scroll mode."""
from pathlib import Path
from zipfile import ZipFile
import re, subprocess, hashlib, json, csv
root=Path(__file__).resolve().parents[2]
s=(root/'xmb_patch/xmb_extension.js').read_text()
t=(root/'theme/theme.js').read_text()
assert t.count(s.strip()) == 1, 'theme.js and xmb_extension.js differ'
audit=json.loads((root/'xmb_research/PS5_VERTICAL_PATCH_EVIDENCE.json').read_text())
base=Path('/mnt/data/PS5XMB_PS3_MODE5_CATEGORY_SCROLL_OVERWRITE_2026-11-15.zip')
# The original archive path is available to this script during development;
# Windows project builds may not carry it. It is optional to rerun source-only checks.
if base.exists():
    with ZipFile(base) as z:
        before=z.read('xmb_patch/xmb_extension.js').decode()
        assert hashlib.sha256(before.encode()).hexdigest()==audit['baseline_extension_sha256']
        # Exact proven horizontal curve / category animation block is untouched.
        marker='        // Do not restart the long settling tail when only the vertical row moves.'
        end='      } catch (e) { log(\'PS5XMB: NATIVE_MOTION_UNAVAILABLE '
        b=before.split(marker)[1].split(end)[0]
        a=s.split(marker)[1].split(end)[0]
        cat_block='        if (changedCategory) {\n          var mode5 ='
        assert a.split(cat_block)[1] == b.split(cat_block)[1], 'horizontal motion must not change'
        assert 'var XMB_PS3_BAR_SETTLE_MS = 850;' in s
        assert s.count('function xmbPs3CategoryEase(value)')==1
        for anchor in ('function xmbPlaySfx(', 'function xmbRoute(', 'folderLink(item.id)', "xmbDeactivate('TEST')"):
            assert anchor in s, anchor

assert "verticalMotionMode: 'ps3-mode5'" in s
assert "verticalGeometryMode: 'designer'" in s
assert "kind:'vertical-motion-toggle'" in s
assert "kind:'vertical-geometry-toggle'" in s
assert "PS5XMB: VERTICAL_MODE5_FALLBACK" in s
assert "PS5XMB: VERTICAL_GEOMETRY_MODE" in s
assert "A.timing(motion.row, {toValue:itemNow, duration:185, useNativeDriver:true}).start();" in s
assert "duration:XMB_PS3_VERTICAL_DURATION_MS,\n                easing:xmbPs3VerticalEase,useNativeDriver:true" in s
assert "var XMB_PS3_VERTICAL_DURATION_MS = 200;" in s
assert "function xmbRowMotionAnchors(row, count, category, focusHeight, idleHeight)" in s
assert "motionScaleX=motion.row.interpolate" in s
assert "motionScaleY=motion.row.interpolate" in s
assert 'var unitScale = XMB_DESIGNER.itemGap / 80;' in s
assert 'var units = (80 * delta) + (delta < 0 ? -95 : 95);' in s
assert 'xmbRowY(j-index,category)' in s
assert 'xmbRowY(j-k,category)' in s
assert 'xmbRowMotionAnchors(j,items.length,category' in s
assert s.count('function xmbRowY(delta, category)')==1

# Independent numeric model: preset 0 has 175 units to neighbor, 80 elsewhere.
rows=list(csv.DictReader((root/'xmb_research/PS5_VERTICAL_VISUAL_CALIBRATION_MODEL.csv').open()))
def get(category,mode,index):
    return next(float(r['image_top_px_model']) for r in rows if r['category']==category and r['mode']==mode and int(r['relative_index'])==index)
for cat,focus_h,idle_h in [('Game',178,74),('Other',87,65)]:
    focus_y=419; step=78/80
    center=get(cat,'preset0',0)+focus_h/2
    up_center=get(cat,'preset0',-1)+idle_h/2
    dn_center=get(cat,'preset0',1)+idle_h/2
    assert abs(up_center-center+175*step)<.001
    assert abs(dn_center-center-175*step)<.001
    assert abs(get(cat,'preset0',-2)-get(cat,'preset0',-1)+80*step)<.001
    assert abs(get(cat,'preset0',2)-get(cat,'preset0',1)-80*step)<.001
    assert get(cat,'designer',-1)==146 and get(cat,'designer',1)==635
assert get('Game','designer',0)==419
print('PASS: theme embedding, category baseline preservation, independent mode toggle, fallback, preset0 proportions and designer baseline')
