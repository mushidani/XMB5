#!/usr/bin/env python3
from pathlib import Path
import hashlib, subprocess, sys, shutil
r=Path(__file__).resolve().parents[1]
def read(p):return (r/p).read_text()
assert hashlib.sha256((r/'xmb_patch/xmb_native_bundle.js').read_bytes()).hexdigest()=='7cca00d830dec97d06442dc3da6c67f8b3d1b2779325aa5bdd496f7821ee96ef', 'Renderer differs from V83.23'
assert '#define ZT_VERSION "1.0-beta"' in read('src/source/shellui/include/zt_brand.hpp')
assert '#define ZT_DIR "/user/data/XMB5"' in read('src/source/shellui/include/zt_paths.hpp')
assert 'void zt_update_start() {}' in read('src/source/shellui/src/zt_update.cpp')
assert 'migrate_old_dir();' not in read('src/source/zhithemes/source/main.cpp')
assert 'htonl(INADDR_LOOPBACK)' in read('src/source/shellui/src/theme_web.cpp')
for p in ['xmb_patch/verify_v83_23.py','xmb_patch/tests/test_v84_theme_migration.py']:
 subprocess.run([sys.executable,str(r/p)],check=True,cwd=r)
if shutil.which('node'):
 for p in ['check_v84_clock_badge.js','check_v8312_overlap_fade.js','check_home_integration_v34.js']:
  subprocess.run(['node',str(r/'xmb_patch/tests'/p)],check=True,cwd=r)
else: print('WARNING: Node unavailable; JS checks not run')
print('PASS V84.0: exact V83.23 renderer, theme conversion, XMB5 namespace, disabled updater.')
