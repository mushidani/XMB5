#!/usr/bin/env python3
from pathlib import Path
import sys
R=Path(__file__).resolve().parents[1]
media=(R/'xmb_patch/embed_media.py').read_text()
cpp=(R/'src/source/shellui/src/zt_xmb_media.cpp').read_text()
js=(R/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
h=(R/'src/source/shellui/include/zt_xmb_media.hpp').read_text()
for name in ('font_regular','glow_l','glow_m','glow_r'):
 assert f"('{name}'," in media
 assert f'zt_xmb_{name}_start' in cpp and f'zt_xmb_{name}_end' in cpp
assert js.index('zt_particles_install();') < js.index('zt_xmb_defaults_install();')
assert 'void zt_xmb_defaults_install();' in h
assert 'XMB5 FIRST_RUN' in js
assert 'theme_request_full_unload()' in js
for key in ('glow_l.png','glow_m.png','glow_r.png','ps3-rodin-regular.ttf',):
 assert key in media
print('PASS V83.8: one-font/glow embedding + defaults installer, original startup paths preserved')
if '--local-assets' in sys.argv:
 for n in ['fonts/ps3-rodin-regular.ttf','glow/glow_l.png','glow/glow_m.png','glow/glow_r.png']:
  p=R/'xmb_patch/native_assets'/n
  if not p.is_file():raise SystemExit('MISSING: '+str(p))
  print('FOUND:',p,'(',p.stat().st_size,'bytes)')
