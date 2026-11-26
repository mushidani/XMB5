#!/usr/bin/env python3
"""Confirm exact V83.20.1 renderer rollback and run retained regression tests."""
from pathlib import Path
import hashlib, subprocess, sys
root = Path(__file__).resolve().parents[1]
expected = {
    'xmb_patch/xmb_native_bundle.js': 'fa479403b73202f0ddf9515919c171a8d1e6bcb9005de4d1e08aa9526e06f6ff',
    'xmb_patch/xmb_extension.js': '44ae1f9d30e34d90e63564daccbcfafed0b0b96aa7f51213adb663efc6cb1090',
    'theme/theme.js': '4cb3ffc77045cd060d752a1fa52a8af849bf8ad7771df5085c3e9815c343ab61',
}
for name, digest in expected.items():
    data = (root/name).read_bytes().replace(b'\r\n', b'\n')
    assert hashlib.sha256(data).hexdigest() == digest, f'{name}: differs from rollback baseline'
print('PASS: exact V83.20.1 renderer and host restored', flush=True)
subprocess.run([sys.executable, str(root/'xmb_patch/verify_v83_20.py')], cwd=root, check=True)
subprocess.run(['node', str(root/'xmb_patch/tests/check_home_integration_v34.js')], cwd=root, check=True)
print('PASS V83.22: rollback and retained feature checks')
