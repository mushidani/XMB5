#!/usr/bin/env python3
"""V83.17 source + host regression checks. PS5 hardware still required."""
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
b=(root/'xmb_patch/xmb_native_bundle.js').read_text().strip()
e=(root/'xmb_patch/xmb_extension.js').read_text().strip()
t=(root/'theme/theme.js').read_text()
assert e.count(b)==1, 'renderer not embedded exactly once in extension'
assert t.count(e)==1, 'extension not embedded exactly once in theme source'
for needle in [
 'const exitGhostX = cats.map(() => new Animated.Value(0));',
 'const exitGhostT = cats.map(() => new Animated.Value(0));',
 'Math.round(110 * st.speed)',
 'Math.round(155 * st.speed)',
 'direction * 34',
 'ghostAlphaNear: nodes.colGhostANear[c]',
 'ghostAlphaFar: nodes.colGhostAFar[c]',
 'ghostOnly: true, noGlow: true',
 'Math.round(245 * speed)',
 'const fadeStartMs = Math.max(0, p.settleMs - 150);',
]:
 assert needle in b, needle
for bad in ['exitMaskX', 'exitSlide', 'colWipeX', 'wipeUndoX']:
 assert bad not in b, 'obsolete wipe/slide: '+bad
assert 'rn.Animated.timing(a,{toValue:1,duration:220' in e, 'dialog timing changed'
for name in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
 subprocess.run(['node','--check',str(root/name)],check=True)
for name in ['check_v8317_ghost_trail.js','check_v8312_overlap_fade.js','check_v8311_overlap_fade.js']:
 subprocess.run(['node',str(root/'xmb_patch/tests'/name)],check=True)
factory=root/'theme/theme_factory.js'
if factory.exists():
 assert factory.read_text().count(e)==1,'factory stale; re-run build to regenerate'
print('PASS V83.17 source checks: native ghost afterimage instead of wipe; previous animation/settings untouched')
