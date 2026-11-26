#!/usr/bin/env python3
"""V83.19: restore V83.17 horizontal-only ghost while keeping native vertical scroll."""
from pathlib import Path
import subprocess, hashlib
root=Path(__file__).resolve().parents[1]
b=(root/'xmb_patch/xmb_native_bundle.js').read_text()
e=(root/'xmb_patch/xmb_extension.js').read_text()
t=(root/'theme/theme.js').read_text()
assert e.count(b.strip())==1, 'native renderer must occur once in extension'
assert t.count(e.strip())==1, 'extension must occur once in theme source'
for marker in (
    'const exitGhostX = cats.map(() => new Animated.Value(0));',
    'const exitGhostT = cats.map(() => new Animated.Value(0));',
    'Math.round(110 * st.speed)',
    'Math.round(155 * st.speed)',
    'direction * 34',
    'ghostAlphaNear: nodes.colGhostANear[c]',
    'ghostAlphaFar: nodes.colGhostAFar[c]',
    'ghostOnly: true, noGlow: true',
    'const fadeStartMs = Math.max(0, p.settleMs - 150);',
    'Math.round(245 * speed)',
):
    assert marker in b, f'missing required horizontal-fade/submenu behavior: {marker}'
for unwanted in (
    'scrollGhostMode', 'scrollGhostY', 'scrollGhostT', 'verticalTrail',
    'verticalGhostNodes', 'rootVertical:', 'ghostYNear:', 'ghostYFar:',
    'f.verticalNodes',
):
    assert unwanted not in b, f'vertical afterimage not fully reverted: {unwanted}'
for filename in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
    subprocess.run(['node','--check',str(root/filename)],check=True)
subprocess.run(['node',str(root/'xmb_patch/tests/check_v8317_ghost_trail.js')],check=True)
subprocess.run(['node',str(root/'xmb_patch/tests/check_v8312_overlap_fade.js')],check=True)
subprocess.run(['python3',str(root/'xmb_patch/verify_v83_17.py')],check=True)
print('PASS V83.19: V83.17 horizontal ghost trail retained, vertical ghost removed, normal vertical scroll unchanged')
