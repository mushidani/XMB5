#!/usr/bin/env python3
"""Verify the V83.21 input/render optimization without the PS5 SDK."""
from pathlib import Path
import subprocess
r=Path(__file__).resolve().parents[1]
b=(r/'xmb_patch/xmb_native_bundle.js').read_text()
e=(r/'xmb_patch/xmb_extension.js').read_text()
t=(r/'theme/theme.js').read_text()
assert e.count(b.strip()) == 1
assert t.count(e.strip()) == 1
for marker in ('syncCursor(ci, sel, depth, idx)', 'ghostPos: ctl.exitGhostPos[c]', 'const MemoColumn = memo(Column', 'Math.round(100 * st.speed)', 'Math.round(245 * speed)', 'const BADGE = { x: 540, w: 112, h: 25 }'):
    assert marker in b, marker
for marker in ('xmbNativeInstance.preMove(xmbHome.category', 'xmbIconPending[src].push(cb)', 'if (v && !alreadyHiding)', 'idleNotify', "ZT_ASSETS+'XMBUI/"):
    assert marker in e, marker
for f in ('xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js'):
    subprocess.run(['node','--check',str(r/f)],check=True)
for f in ('check_v8321_input_perf.js','check_v8317_ghost_trail.js','check_v8312_overlap_fade.js','check_v8320_clock_badge.js','check_home_integration_v34.js'):
    subprocess.run(['node',str(r/'xmb_patch/tests'/f)],cwd=r,check=True)
print('PASS V83.21: responsive input, render work reduction, V83.20 visuals and embedded source checks')
