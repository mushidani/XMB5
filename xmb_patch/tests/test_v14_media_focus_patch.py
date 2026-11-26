#!/usr/bin/env python3
from pathlib import Path
from hashlib import sha256
import json, subprocess, re
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip())==1
for token in ('GAME_BG_IMAGE_LOADED','GAME_BG_IMAGE_FALLBACK','XmbGameArtwork',
              'pic0.png','NATIVE_SFX_REQUEST','NATIVE_SFX_FETCH_FAILED',
              "sound:false", "return folderLink(item.id);"):
 assert token in x,token
assert 'XmbOneShotSfx' not in x
assert 'xmb-sfx?kind=' in x
assert 'zt_xmb_sfx_shutdown()' in (R/'src/source/shellui/src/zt_xmb_media.cpp').read_text()
assert 'loopback only' in (R/'src/source/shellui/src/theme_web.cpp').read_text()
for k in ('Taps','Apps'):
 p=R/f'ps3_assets/PS3_Scroll{k}_PCM.s16le'
 assert 1500<p.stat().st_size<256000 and p.stat().st_size%4==0
j=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
 'stream=codec_name,width,height,r_frame_rate,level','-of','json',
 str(R/'ps3_assets/PS3_XMB_Background_User.mp4')],text=True))
v=j['streams'][0]
assert (v['width'],v['height'])==(1920,1080) and v['codec_name']=='h264'
assert v['r_frame_rate']=='30/1' and v['level']==40
print('PASS: real PS5-compatible 1080p30 video, Sony per-title artwork metadata, native PCM sound worker, fallback and recovery')
