#!/usr/bin/env python3
"""Source checks for V83.20. Does not require the PS5 SDK."""
from pathlib import Path
import subprocess, shutil, re, zlib
root=Path(__file__).resolve().parents[1]
B=(root/'xmb_patch/xmb_native_bundle.js').read_text()
E=(root/'xmb_patch/xmb_extension.js').read_text()
T=(root/'theme/theme.js').read_text()
H=(root/'src/source/shellui/include/zt_storage.hpp').read_text()
C=(root/'src/source/shellui/src/zt_storage.cpp').read_text()
G=(root/'theme/gen_particles_header.py').read_text()
assert E.count(B.strip())==1, 'renderer is not embedded exactly once'
assert T.count(E.strip())==1, 'extension not embedded exactly once in theme'
assert '#define ZT_PARTICLES ZT_ASSETS "/XMBUI"' in H
assert 'xmb_legacy_particle_matches' in C and 'xmb_same_local_file' in C
assert 'lstat(old.c_str()' in C and 'rmdir(previous.c_str())' in C
assert 'ZT_CUSTOMTILE, ZT_CUSTOMBG, ZT_DIR "/Install"' in C
assert "ZT_ASSETS+'particles/" not in E
assert "ZT_ASSETS+'XMBUI/" in E
assert "ZT_ASSETS + 'particles/" not in T
assert '60000 - (Date.now() % 60000) + 40' in E
assert 'Math.round(100 * st.speed)' in B
assert 'Math.round(245 * speed)' in B
assert 'const BADGE = { x: 540' in B
assert 'legacy_names' in G and 'zlib.crc32(data)' in G
for path in ['xmb_patch/xmb_native_bundle.js','xmb_patch/xmb_extension.js','theme/theme.js']:
    subprocess.run(['node','--check',str(root/path)],check=True)
for test in ['check_v8320_clock_badge.js','check_v8317_ghost_trail.js','check_v8312_overlap_fade.js']:
    subprocess.run(['node',str(root/'xmb_patch/tests'/test)],check=True)
if (root/'theme/particles').is_dir() and (root/'src/source/shellui/include/zt_particle_textures.hpp').is_file():
    h=(root/'src/source/shellui/include/zt_particle_textures.hpp').read_text()
    names=set(re.findall(r'\{"([a-z0-9_]+)", kZtPt_',h))
    assert 'xmbweb_clock_ring' in names and 'xmbweb_glow_l' in names
    assert 'xmbweb_badge_ps5_d' in names and 'd_ps_cross' in names
    assert 'a_crystal' not in names and 'b_bokeh' not in names
    man=re.findall(r'\{"([a-z0-9_]+)", (\d+), (\d+)u\}',h)
    for name,sz,crc in man:
        data=(root/'theme/particles'/(name+'.png')).read_bytes()
        assert len(data)==int(sz) and zlib.crc32(data)==int(crc)
    print('PASS: %d unused stock particle CRC manifest entries' % len(man))
if shutil.which('c++'):
    inc=[root/'src/source/shellui/include']
    if not (inc[0]/'zt_paths.hpp').exists():
        inc.append(root/'native_base/source/shellui/include')
    if any((item/'zt_paths.hpp').exists() for item in inc):
        cmd=['c++','-std=c++20','-DZHITHEMES=1','-fsyntax-only']
        for item in inc: cmd.extend(['-I',str(item)])
        subprocess.run(cmd+[str(root/'src/source/shellui/src/zt_storage.cpp')],check=True)
        print('PASS: native C++ storage syntax (host compiler)')
print('PASS V83.20: source embedding, clock, badge, ghost timing, asset migration, legacy safe cleanup')
