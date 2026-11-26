#!/usr/bin/env python3
"""V83.18 source & host-side vertical ghost animation regression suite.
Run from any directory: python3 xmb_patch/verify_v83_18.py
Does not substitute for a real PS5 GPU/build test.
"""
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
b=(root/'xmb_patch/xmb_native_bundle.js').read_text().strip()
e=(root/'xmb_patch/xmb_extension.js').read_text().strip()
t=(root/'theme/theme.js').read_text()
assert e.count(b)==1, 'native renderer not embedded exactly once in extension'
assert t.count(e)==1, 'extension not embedded exactly once in theme source'
for needle in [
 'const scrollGhostMode = cats.map(() => new Animated.Value(0));',
 'const scrollGhostY = cats.map(() => new Animated.Value(0));',
 'const scrollGhostT = cats.map(() => new Animated.Value(0));',
 'const verticalTrail = (mode, y, progress, direction) => {',
 'verticalTrail(scrollGhostMode[st.ci], scrollGhostY[st.ci], scrollGhostT[st.ci], dir);',
 'verticalTrail(f.verticalMode, f.verticalY, f.verticalT, dir);',
 'verticalTrail(f.verticalMode, f.verticalY, f.verticalT, mf.idx - f.idx);',
 'rootVertical: ctl.categories.map((c, i) => ({',
 'ghostYNear: nodes.rootVertical[c].nearY,',
 'ghostYFar: nodes.rootVertical[c].farY,',
 'ghostYNear: f.verticalNodes.nearY,',
 'ghostYFar: f.verticalNodes.farY,',
 'ghostAlphaNear: A.add(nodes.colGhostANear[c], nodes.rootVertical[c].nearA)',
 'Math.round(155 * st.speed)',
 'ghostOnly: true, noGlow: true',
 'Math.round(245 * speed)',
 'const fadeStartMs = Math.max(0, p.settleMs - 150);',
]: assert needle in b, f'missing V83.18 invariant {needle}'
for bad in ['exitMaskX','exitSlide','colWipeX','wipeUndoX']:
 assert bad not in b, 'obsolete wipe/slide path returned: '+bad
for name in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
 subprocess.run(['node','--check',str(root/name)],check=True)
for name in ['check_v8317_ghost_trail.js','check_v8318_vertical_ghost.js','check_v8312_overlap_fade.js']:
 subprocess.run(['node',str(root/'xmb_patch/tests'/name)],check=True)
subprocess.run(['python3',str(root/'xmb_patch/verify_v83_17.py')],check=True)
factory=root/'theme/theme_factory.js'
if factory.exists():
 assert factory.read_text().count(e)==1,'theme_factory.js stale; run the build source-generation step'
print('PASS V83.18 source/host tests: vertical 155ms afterimages, no real-item exit fade, V83.17 horizontal preserved')
