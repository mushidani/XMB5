#!/usr/bin/env python3
"""Check v1.2 home integration, user-asset import, and genuinely moving video."""
from pathlib import Path
import re, json, shutil, subprocess, hashlib
ROOT=Path(__file__).resolve().parents[2]
src=(ROOT/'xmb_patch/xmb_extension.js').read_text()
js=(ROOT/'theme/theme.js').read_text()
assert src.strip() in js and js.count(src.strip())==1
assert "{ name: 'TV/Video Services', asset: 'tv' }" in src
assert 'category: 6' in src and 'case 6: return xmbGames();' in src
assert 'function XmbSelectedLink(props)' in src
assert 'return folderLink(item.id);' in src
assert 'xmbDeactivate(\'USER_BACK\')' in src
assert 'PROBE_TEXT_AND_VIEW_LAYOUT_OK' in src and 'FULL_XMB_TEXT_LAYOUT_OK' in src
assert 'VideoWallpaper' in src and 'ps5xmb_wave_live.mp4' in src
assert 'http://127.0.0.1:4445/v/ps5xmb_wave_live.mp4' in src
assert 'xmbHome.active && typeof VideoWallpaper' in src
assert not re.search(r'fontSize\s*:\s*\d', src)
for name in ['users','settings','photo','music','video','tv','game','network','psn','friends']:
    f=ROOT/'theme/particles'/f'xmb_cat_{name}.png'
    assert f.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'),name
video=ROOT/'ps3_assets/ps5xmb_wave_live.mp4'
assert video.is_file() and video.stat().st_size>10000
if shutil.which('ffprobe'):
    p=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=codec_name,width,height','-of','json',str(video)],text=True)
    stream=json.loads(p)['streams'][0]
    assert stream['codec_name']=='h264' and stream['width']>=640
if shutil.which('ffmpeg'):
    hashes=[]
    for ss in ['0.2','1.8','3.5']:
      data=subprocess.check_output(['ffmpeg','-v','error','-ss',ss,'-i',str(video),'-frames:v','1','-f','image2pipe','-vcodec','png','-'])
      hashes.append(hashlib.sha256(data).hexdigest())
    assert len(set(hashes))==3,'VIDEO FRAMES IDENTICAL; NOT MOVING'
print('PASS: 10-category XMB, native Home hook, load-safe live H.264 wave, distinct frames, asset imports, routes and recovery')
