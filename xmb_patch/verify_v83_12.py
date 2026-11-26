#!/usr/bin/env python3
"""Verify V83.12 150 ms fade overlap and renderer source regeneration."""
from pathlib import Path
import subprocess, re
root = Path(__file__).resolve().parents[1]
bundle = (root/'xmb_patch/xmb_native_bundle.js').read_text(encoding='utf-8').strip()
ext = (root/'xmb_patch/xmb_extension.js').read_text(encoding='utf-8').strip()
theme = (root/'theme/theme.js').read_text(encoding='utf-8')
factory_path = root/'theme/theme_factory.js'
assert 'Math.round(245 * speed)' in bundle, 'fade duration changed unexpectedly'
assert 'const fadeStartMs = Math.max(0, p.settleMs - 150);' in bundle, 'overlap mismatch'
assert 'Math.round(fadeStartMs - elapsed)' in bundle
assert 'opacity: ref.current' in bundle
assert 'opacity: A.mul(ref.current, gate)' not in bundle, 'double fade gate has returned'
assert bundle in ext and ext.count(bundle)==1, 'extension must embed latest bundle once'
assert ext in theme and theme.count(ext)==1, 'theme.js must embed extension once'
assert 'rn.Animated.timing(a,{toValue:1,duration:220' in ext, 'Yes/Cancel timing changed'
if factory_path.exists():
    factory = factory_path.read_text(encoding='utf-8')
    assert ext in factory and factory.count(ext)==1, 'factory must embed extension once'
subprocess.run(['node', str(root/'xmb_patch/tests/check_v8312_overlap_fade.js')], check=True)
print('PASS: V83.12 150ms overlap, 245ms fade, current renderer source embedding')
header = root/'src/source/shellui/include/theme_default_js.hpp'
if header.exists() and factory_path.exists():
    raw=header.read_text(encoding='utf-8')
    mark='static const char kThemeDefaultJs[] = {'
    assert mark in raw
    body=raw.split(mark,1)[1].split('};',1)[0]
    binary=bytes(int(n)&255 for n in re.findall(r'(?<![\w.])-?\d+(?![\w.])',body))
    assert binary==factory_path.read_bytes()+b'\0', 'C++ header stale; rebuild first'
    print('PASS: generated C++ header')
else:
    print('INFO: generated C++ header not present; check again after build')
