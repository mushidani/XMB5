#!/usr/bin/env python3
"""Overwrite patch source contracts for accurate PS3 item alignment.
No hardware or SDK claims. Run after import_uploaded_theme.py and embed_media.py.
"""
from pathlib import Path
import json, re, subprocess, shutil
from PIL import Image
R=Path(__file__).resolve().parents[2]
x=(R/'xmb_patch/xmb_extension.js').read_text()
t=(R/'theme/theme.js').read_text()
assert t.count(x.strip())==1
assert "case 6: return xmbGames();" in x
for gone in ('Game Data Utility','Memory Card Utility','Saved Data Utility'):
 assert gone not in x, gone
assert "return result;" in x and "result.slice(0, 100)" not in x
assert "var showName=!game || chosen;" in x
assert "var label=showName ?" in x
assert "cat.asset === 'psn' ? 'PlayStation\\u00ae\\nNetwork' : cat.name" in x
for name in ('Sign Up for PlayStation\\u00aeNetwork','PlayStation\\u00aeStore','Trophy Collection'):
 assert name in x, name
assert "var center = game ? 488 : 392" in x
assert "var w = game ? (chosen ? 278 : 126)" in x
assert "var h = game ? (chosen ? 156 : 72)" in x
assert 'left:center - w/2' in x
assert "resizeMode:'contain'" in x
assert 'game ? 652 : 459' in x
assert "xmbGamesCache" in x and "now - xmbGamesCache.at < 5000" in x
assert "key:'ps3-xmb-user-video'" in x
assert "sound:false,suppressBgm:true" in x
assert "xmbPlaySfx(kind, direction)" in x
assert "xmb-sfx?kind=" in x
assert "return folderLink(item.id);" in x
assert "xmbDeactivate('USER_BACK')" in x
assert "XMB_OVERLAY_ACTIVATED" in x
for nm in ('xmb_item_accountmanage.png','xmb_item_store.png','xmb_cat_psn.png'):
 with Image.open(R/'theme/particles'/nm) as image:
  image.load();assert image.format=='PNG' and image.size[0]>=64 and image.size[1]>=64, nm
assert "'accountmanage':'icon_accountmanage'" in (R/'xmb_patch/import_uploaded_theme.py').read_text()
assert not re.search(r'fontSize\s*:\s*\d+',x)
f=R/'ps3_assets/PS3_XMB_Background_User.mp4'
assert f.is_file() and f.stat().st_size>2_000_000
if shutil.which('ffprobe'):
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,codec_type,width,height,level,r_frame_rate','-of','json',str(f)],text=True))
 streams=[s for s in data['streams'] if s['codec_type']=='video']
 assert len(streams)==1
 v=streams[0]
 assert v['codec_name']=='h264' and (v['width'],v['height'])==(1920,1080)
 assert v['level']==40 and v['r_frame_rate']=='30/1'
print('PASS: Game-only titles, exact vertical centers, item labels, PSN entries, native PCM, media, routes and recovery')
