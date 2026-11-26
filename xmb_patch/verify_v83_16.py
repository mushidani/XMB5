#!/usr/bin/env python3
"""V83.16 directional alpha wipe source + host regression verifier (no SDK)."""
from pathlib import Path
import subprocess, re
root=Path(__file__).resolve().parents[1]
bundle=(root/'xmb_patch/xmb_native_bundle.js').read_text().strip()
ext=(root/'xmb_patch/xmb_extension.js').read_text().strip()
theme=(root/'theme/theme.js').read_text()
assert ext.count(bundle)==1,'renderer not embedded exactly once in extension'
assert theme.count(ext)==1,'extension not embedded exactly once in theme'
checks=[
    'const exitMaskX = cats.map(() => new Animated.Value(0));',
    'const ms = Math.max(50, Math.round(110 * st.speed));',
    'run(exitAlpha[oldCi], 0, ms, core.ease.linear);',
    'run(exitMaskX[oldCi], direction * sweep, ms, core.ease.smooth);',
    'const sweep = V.W - (V.ITEM_ICON_X - V.ITEM_ICON_ACTIVE / 2);',
    'overflow: "hidden", transform: [{ translateX: p.wipeX }]',
    'transform: [{ translateX: p.wipeUndoX }]',
    'colShift: ctl.categories.map((c, i) => A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i]))',
    'colWipeUndoX: ctl.categories.map((c, i) => A.mul(ctl.exitMaskX[i], -1))',
    'wipeX: nodes.colWipeX[c]',
    'wipeUndoX: nodes.colWipeUndoX[c]',
    'Math.round(245 * speed)',
    'const fadeStartMs = Math.max(0, p.settleMs - 150);',
]
for x in checks:
    assert x in bundle, f'missing expected animation feature: {x}'
assert 'exitSlide' not in bundle, 'V83.15 extra item translation still present'
assert 'rn.Animated.timing(a,{toValue:1,duration:220' in ext, 'Yes/Cancel timing changed'
for name in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
    subprocess.run(['node','--check',str(root/name)],check=True)
for name in ['check_v8316_directional_wipe.js','check_v8312_overlap_fade.js','check_v8311_overlap_fade.js']:
    subprocess.run(['node',str(root/'xmb_patch/tests'/name)],check=True)
factory=root/'theme/theme_factory.js'
if factory.exists():
    assert factory.read_text().count(ext)==1,'generated factory stale; run BUILD_XMB_HOME_WSL.sh'
header=root/'src/source/shellui/include/theme_default_js.hpp'
if header.exists() and factory.exists():
    raw=header.read_text()
    marker='static const char kThemeDefaultJs[] = {'
    assert marker in raw
    values=raw.split(marker,1)[1].split('};',1)[0]
    binary=bytes(int(n)&255 for n in re.findall(r'(?<![\w.])-?\d+(?![\w.])', values))
    assert binary == factory.read_bytes()+b'\x00', 'generated native header stale; run BUILD_XMB_HOME_WSL.sh'
print('PASS V83.16: directional native clip wipe; no exit text slide; source synchronized; unchanged PS3 Mode-5, submenu, Yes/Cancel')
