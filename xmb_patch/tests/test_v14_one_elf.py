#!/usr/bin/env python3
"""Verify v1.4 self-install sources, updated PSN, UI assets, and no upload step."""
from pathlib import Path
from PIL import Image
import re, hashlib, json, shutil, subprocess
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
js=(R/'theme/theme.js').read_text()
assert js.count(x.strip())==1
assert 'PS5XMB HOME V1.4 MEDIA FOCUS FIX' in x
assert "'xmb-clock'" in x and 'borderColor' in x and 'xmb_clock_ps3' in x
assert 'GAME_BG_IMAGE_LOADED' in x and '/sce_sys/pic1.png' in x
assert "xmb_cat_" in x and "'contain'" in x
assert "return folderLink(item.id);" in x
assert "xmbDeactivate('USER_BACK')" in x
assert 'XMB_OVERLAY_ACTIVATED' in x
assert 'PS3_XMB_Background_User.mp4' in x and 'NATIVE_SFX_REQUEST' in x # names composed dynamically
media=(R/'src/source/shellui/src/zt_xmb_media.cpp').read_text()
entry=(R/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert 'zt_xmb_media_install();' in entry
assert entry.index('zt_storage_setup();') < entry.index('zt_xmb_media_install();') < entry.index('zt_particles_install();')
assert 'MEDIA_ONE_ELF_READY' in media and 'MEDIA_INSTALLED' in media
assert 'zt_xmb_sfx_play' in media and 'sceAudioOutOpen' in media
assert 'rename(part.c_str(),dest.c_str())' in media
assert 'zt_theme_dir("wallpapers")' in media and 'open(part.c_str()' in media
assert 'zt_xmb_sfx_shutdown();' in (R/'src/source/shellui/src/theme_web.cpp').read_text()
pack=(R/'xmb_patch/embed_media.py').read_text()
assert '.incbin' in pack and 'PS3_XMB_Background_User.mp4' in pack
assert 'PS3_ScrollTaps_SFX.mp4' in pack and 'PS3_ScrollApps_SFX.mp4' in pack
assert 'PS3_ScrollTaps_PCM.s16le' in pack and 'PS3_ScrollApps_PCM.s16le' in pack
build=(R/'BUILD_XMB_HOME_WSL.sh').read_text()
assert 'embed_media.py' in build and 'apply_user_psn.py' in build
assert 'UPLOAD_PS3_ASSETS_WSL.sh' not in build
assert 'PS5XMB_Home_v1_4_ONE_ELF.elf' in build
with Image.open(R/'theme/particles/xmb_cat_psn.png') as im:
    im.load()
    assert im.mode == 'RGBA' and im.size == (384,384)
    a=im.getchannel('A')
    assert a.getextrema()[0] == 0 and a.getextrema()[1] == 255
with Image.open(R/'theme/particles/xmb_clock_ps3.png') as im:
    im.load(); assert im.mode=='RGBA'
if shutil.which('ffprobe'):
    p=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,codec_name','-of','json',str(R/'ps3_assets/PS3_XMB_Background_User.mp4')],text=True)
    s=json.loads(p)['streams'][0]
    assert s['codec_name']=='h264' and s['width']==1920 and s['height']==1080
assert not re.search(r'fontSize\s*:\s*\d+',x)
print('PASS: v1.4 one-ELF auto media install, PSN orb, PS3 clock panel, game backdrop, game launch, recovery')
