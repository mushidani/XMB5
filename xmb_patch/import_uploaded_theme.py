#!/usr/bin/env python3
"""Import USER-SUPPLIED PS3 .p3t theme icons using its original simple.xml manifest.

No new Sony assets are obtained. All src files are from a user upload. Only PNG
icons are installed; JPG preview graphics and XML are retained in ps3_assets.
"""
from pathlib import Path
from xml.etree import ElementTree as ET
import shutil, json
from PIL import Image
R=Path(__file__).resolve().parents[1]
S=R/'ps3_assets/theme_source'
D=R/'theme/particles'
xml=S/'simple.xml'
if not xml.exists():raise SystemExit('Missing uploaded theme XML '+str(xml))
# The PS3 theme schema is a direct icon id -> src table, NOT ordered file names.
icons={el.attrib['id']:el.attrib['src'] for el in ET.parse(xml).iter('icon') if 'id' in el.attrib and 'src' in el.attrib}
category={
  'users':'icon_user','settings':'icon_setting','photo':'icon_photo',
  'music':'icon_music','video':'icon_video','tv':'icon_tv',
  'game':'icon_game','network':'icon_network','friends':'icon_friend'
}
# Missing from this particular theme XML: horizontal icon_psn. Preserve the
# user-supplied PSN orb replaces the fallback in the next build step.
items={
  'gamedata':'icon_gamedata', 'savedata':'icon_savedata', 'vmc':'icon_vmc',
  'trophy':'icon_trophy', 'gamefolder':'icon_savedata',
  'network_settings':'icon_network_setting','settings':'icon_system_setting',
  'system_update':'icon_update','theme_settings':'icon_theme_setting',
  'controller_settings':'icon_accessory','browser':'icon_browser',
  'accountmanage':'icon_accountmanage',
  'photo':'icon_photo_default','music':'icon_music_default',
  'video':'icon_video_default','user':'icon_user',
  'friend':'icon_friend','tv':'icon_tv', 'game':'icon_game',
}
D.mkdir(exist_ok=True,parents=True)
report={ 'category':{},'item':{},'external':['psn_user_orb']}
def add(target,mapping,key,id):
    if id not in icons: raise ValueError('Manifest missing '+id)
    fromfile=S/icons[id]
    if not fromfile.is_file():raise FileNotFoundError(fromfile)
    with Image.open(fromfile) as img:
        img.verify()
    with Image.open(fromfile) as img:
        if img.format!='PNG':raise ValueError(fromfile)
    shutil.copyfile(fromfile,D/target)
    mapping[key]=icons[id]
for key,id in category.items():add('xmb_cat_'+key+'.png',report['category'],key,id)
for key,id in items.items():add('xmb_item_'+key+'.png',report['item'],key,id)
(R/'ps3_assets/manifest_import_report.json').write_text(json.dumps(report,indent=2)+'\n')
print('Imported',len(category),'original category icons,',len(items),'original item icons; PSN orb added by apply_user_psn.py')
