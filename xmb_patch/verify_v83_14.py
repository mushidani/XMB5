#!/usr/bin/env python3
"""V83.14 Rodin Regular-only font selection and asset pack validation."""
from pathlib import Path
import subprocess, sys
r=Path(__file__).resolve().parents[1]
for path in ('xmb_patch/embed_media.py','src/source/shellui/src/zt_xmb_media.cpp','src/source/shellui/src/homeui_js_inject.cpp','xmb_patch/verify_final_elf.py'):
    s=(r/path).read_text()
    assert 'ps3-rodin-light.ttf' not in s and 'ps3-rodin-bold.ttf' not in s, path
    if path!='src/source/shellui/src/homeui_js_inject.cpp':
        assert 'zt_xmb_font_light' not in s and 'zt_xmb_font_bold' not in s, path
media=(r/'xmb_patch/embed_media.py').read_text()
assert "('font_regular','fonts/ps3-rodin-regular.ttf')" in media
for key in ('glow_l','glow_m','glow_r'):
    assert f"('{key}'," in media
native=(r/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert 'styles[i] = sys_path;' in native
assert 'XMB5 FONT: Rodin Regular for all SST weights' in native
assert 'XMB5 FIRST_RUN' in native and 'theme_request_full_unload()' in native
subprocess.run([sys.executable,str(r/'xmb_patch/verify_v83_13.py')],check=True)
subprocess.run([sys.executable,str(r/'xmb_patch/verify_v83_8.py')],check=True)
print('PASS V83.14 Regular-only assets, 3 glow slices, and native font overrides')
