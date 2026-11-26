#!/usr/bin/env python3
"""Host-side verification of original, indexed PS3 VSH 4.93 texture integration.

No VSH ZIP needed during a normal build; the 24 indexed, decoded PNGs ship in
this overwrite patch. This does NOT claim that the PS3 shader runs on PS5.
"""
import json, re
from pathlib import Path
from PIL import Image

R=Path(__file__).resolve().parents[2]
P=R/'theme/particles'
report=json.loads((R/'xmb_research/VSH_QRC_INDEX_REPORT.json').read_text())
assert report['total_files']==159
assert report['dds_month_count']==24
assert report['grid_values_count']==4602
assert report['factor_values_count']==143
names=set()
for f in report['files']:
    if not f['path'].startswith('textures/month_bg/'):
        continue
    name=f['output']
    names.add(name)
    with Image.open(P/name) as im:
        im.load()
        assert im.format=='PNG' and im.mode=='RGBA' and im.size==(64,32),name
    assert f['size']==11040 and f['month'] in range(1,13)
    assert f['path'].split('/')[2] in ('rgb','night')
assert len(names)==24
for n in range(1,13):
    assert f'xmb_vsh_month_{n:02d}_day.png' in names
    assert f'xmb_vsh_month_{n:02d}_night.png' in names
for part in ('back','front','edge'):
    with Image.open(P/f'xmb_vsh_silk_{part}.png') as im:
        assert im.size==(1920,1080) and im.mode=='RGBA'
        assert im.getextrema()[-1][0]==0 and im.getextrema()[-1][1]>=100
js=(R/'xmb_patch/xmb_extension.js').read_text()
theme=(R/'theme/theme.js').read_text()
assert theme.count(js.strip())==1, 'theme/xmb_extension mismatch'
assert "waveMode: 'linkev'" in js and "visualMode: 'classic'" in js
assert "kind:'theme-toggle'" in js and 'Original PS3 Colors' in js
assert "'xmb_vsh_month_'+vshMonthId+'_'+vshDayNight" in js
assert "var ribbons='xmb_vsh_silk_'" in js
assert 'VSH493_ORIGINAL_PALETTE' in js
assert 'localClock.getHours()>=7&&localClock.getHours()<19' in js
assert "'xmb_vsh_month_01_night'" in js and 'ps3-xmb-user-video' not in js
for tok in ['return folderLink(item.id);','xmbPlaySfx(kind, direction)',"xmbDeactivate('USER_BACK')",'WAVE_30_STRIP_NATIVE_DEFORMATION', 'BGM_STOP_REQUESTED']:
    assert tok in js, tok
assert not re.search(r'fontSize\s*:\s*\d',js)
print('PASS: 24 indexed VSH 4.93 DDS palettes, 30 native ribbon strips, no XMB video, launcher and PCM paths')
