#!/usr/bin/env python3
"""V83.15: verify that the outgoing column exits as a native fade + direction-aware slide.
This is a source/host-test verifier; it cannot replace PS5 hardware testing.
"""
from pathlib import Path
import subprocess, re
root=Path(__file__).resolve().parents[1]
bundle=(root/'xmb_patch/xmb_native_bundle.js').read_text().strip()
ext=(root/'xmb_patch/xmb_extension.js').read_text().strip()
theme=(root/'theme/theme.js').read_text()
assert ext.count(bundle)==1,'renderer bundle not embedded exactly once in extension'
assert theme.count(ext)==1,'extension not embedded exactly once in theme'
needles=[
 'const exitMode = cats.map(() => new Animated.Value(0));',
 'const exitAlpha = cats.map(() => new Animated.Value(0));',
 'const exitSlide = cats.map(() => new Animated.Value(0));',
 'const ms = Math.max(50, Math.round(110 * st.speed));',
 'direction * (V.CAT_SPACING + 65)',
 'run(exitAlpha[oldCi], 0, ms, core.ease.outCubic);',
 'run(exitSlide[oldCi], direction * (V.CAT_SPACING + 65), ms, core.ease.outCubic);',
 'exitColumn(st.ci, m.ci);',
 'exitColumn(st.ci, n);',
 'A.mul(ctl.exitAlpha[i], ctl.exitMode[i])',
 'A.mul(interp(ctl.catPos, core.COLUMN.alpha(i)), interp(ctl.exitMode[i]',
 'colShift: ctl.categories.map((c, i) => A.add(A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i]), ctl.exitSlide[i]))',
 'shiftX: nodes.colShift[c]',
 'alphaMul: nodes.colAlpha[c]',
 'Math.round(245 * speed)',
 'const fadeStartMs = Math.max(0, p.settleMs - 150);'
]
for needle in needles:
 assert needle in bundle,needle
assert 'rn.Animated.timing(a,{toValue:1,duration:220' in ext,'Yes/Cancel timing unexpectedly changed'
for f in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
 subprocess.run(['node','--check',str(root/f)],check=True)
for f in ['check_v8315_column_exit.js','check_v8312_overlap_fade.js','check_v8311_overlap_fade.js']:
 subprocess.run(['node',str(root/'xmb_patch/tests'/f)],check=True)
factory=root/'theme/theme_factory.js'
if factory.exists():
 content=factory.read_text()
 assert content.count(ext)==1,'generated theme_factory.js is stale'
header=root/'src/source/shellui/include/theme_default_js.hpp'
if header.exists() and factory.exists():
 raw=header.read_text()
 marker='static const char kThemeDefaultJs[] = {'
 assert marker in raw
 nums=raw.split(marker,1)[1].split('};',1)[0]
 binary=bytes(int(n)&255 for n in re.findall(r'(?<![\w.])-?\d+(?![\w.])',nums))
 assert binary==factory.read_bytes()+b'\x00','native theme header stale; run BUILD_XMB_HOME_WSL.sh'
print('PASS: V83.15 110ms side exit; native graph permanent; 150ms submenu overlap; previous HomeUI source preserved')
