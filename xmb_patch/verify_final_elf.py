#!/usr/bin/env python3
"""Verify the navigation sounds (raw PCM) and the two xmb-web wave loops (H.264) are embedded in the FINAL ELF."""
from pathlib import Path
import sys
R=Path(__file__).resolve().parents[1]
if len(sys.argv)!=2: raise SystemExit('usage: verify_final_elf.py ELF')
elf=Path(sys.argv[1]).read_bytes()
assert elf[:4] == b'\x7fELF','Not an ELF'
for name in ('PS3_snd_cursor.s16le','PS3_snd_category_decide.s16le','PS3_snd_decide.s16le','PS3_snd_cancel.s16le','PS3_snd_system_ok.s16le','PS3_snd_system_ng.s16le',
             'PS5XMB_XMBWEB_Wave_Day.mp4','PS5XMB_XMBWEB_Wave_Night.mp4','PS5XMB_XMBWEB_Wave_Day_Blur.mp4','PS5XMB_XMBWEB_Wave_Night_Blur.mp4'):
    data=(R/'ps3_assets'/name).read_bytes()
    assert len(data)>1024
    offset=elf.find(data)
    if offset<0: raise SystemExit('FINAL ELF missing embedded media: '+name)
    print('Embedded',name,'at',offset,'bytes',len(data))
# V83.8: fail the build if any fresh-install text-glow default wasn't linked.
for relative in (
 'fonts/ps3-rodin-regular.ttf', 'glow/glow_l.png',
 'glow/glow_m.png', 'glow/glow_r.png'):
    source=(R/'xmb_patch/native_assets'/relative)
    if not source.is_file():raise SystemExit('Missing local asset: '+str(source))
    data=source.read_bytes()
    if elf.find(data)<0:raise SystemExit('FINAL ELF missing embedded XMB default: '+relative)
    print('Embedded XMB default',relative,'bytes',len(data))
assert b'PS3_XMB_Background_User.mp4' not in elf, 'Legacy XMB video path still present in final ELF'
assert b'xmbweb_wave_frame_' not in elf, 'Old captured wave frames are still embedded in the final ELF'
print('PASS: 6 sounds, 4 fallback wave videos, 1 Rodin Regular font and 3 original glow PNGs embedded')
