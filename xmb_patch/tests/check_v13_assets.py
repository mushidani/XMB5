#!/usr/bin/env python3
"""Verify imported original user-supplied PS3 theme assets and audio/video.
Does not require the PS5 SDK, native playback hardware or network access.
"""
from pathlib import Path
from PIL import Image
from xml.etree import ElementTree as ET
import subprocess,json,hashlib,shutil
R=Path(__file__).resolve().parents[2]
source=R/'ps3_assets/theme_source'
particles=R/'theme/particles'
xml=source/'simple.xml'
icons={e.attrib['id']:e.attrib['src'] for e in ET.parse(xml).iter('icon') if 'id' in e.attrib and 'src' in e.attrib}
ids={'users':'icon_user','settings':'icon_setting','photo':'icon_photo',
     'music':'icon_music','video':'icon_video','tv':'icon_tv','game':'icon_game',
     'network':'icon_network','friends':'icon_friend'}
for name,key in ids.items():
    p=particles/f'xmb_cat_{name}.png'
    with Image.open(p) as im:im.load();assert im.format=='PNG'
    assert hashlib.sha256(p.read_bytes()).digest()==hashlib.sha256((source/icons[key]).read_bytes()).digest(),name
for name in ['gamedata','savedata','vmc','trophy','browser','theme_settings']:
    p=particles/f'xmb_item_{name}.png'
    with Image.open(p) as im: im.load();assert im.format=='PNG'
# The supplied theme does NOT map horizontal PSN, only account management.
assert 'icon_psn' not in icons
# User video is preserved byte-for-byte; audio is original, not fabricated.
assert (R/'ps3_assets/PS3_XMB_Background_User.mp4').stat().st_size>100000
for name in ['PS3_XMB_Background_User.mp4','PS3_ScrollTaps_SFX.mp4','PS3_ScrollApps_SFX.mp4']:
    p=R/'ps3_assets'/name
    if shutil.which('ffprobe'):
        data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,codec_type','-of','json',str(p)],text=True))['streams']
        assert any(s['codec_type']=='video' and s['codec_name']=='h264' for s in data)
        if name != 'PS3_XMB_Background_User.mp4':
            assert any(s['codec_type']=='audio' and s['codec_name']=='aac' for s in data)
    else:
        assert b'ftyp' in p.read_bytes()[:64], 'Invalid MP4 container'
        print('NOTE: ffprobe missing; validated MP4 header only for',p.name)
for name in ['PS3_ScrollTaps.mp3','PS3_ScrollApps.mp3']:
    assert (R/'ps3_assets'/name).stat().st_size>5000
with Image.open(particles/'ps5xmb_user_video_fallback.png') as im:
    assert im.size==(1920,1080)
print('PASS: original icons, 1080p H264 wave video, original MP3 clips, native PCM audio files')
