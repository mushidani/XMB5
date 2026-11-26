#!/usr/bin/env python3
"""Apply an exported XMB Designer JSON preset to project source for rebuilding.

Usage:
    python3 xmb_patch/apply_xmb_preset.py ~/Downloads/xmb_layout_preset.json

This updates both xmb_patch/xmb_extension.js AND theme/theme.js, preserving
patch_xmb.py's integrity contract. It does not modify the PS5 directly.
"""
from pathlib import Path
import argparse
import json
import re
import shutil
from datetime import datetime

ROOT=Path(__file__).resolve().parents[1]
BEGIN='/* XMB_DESIGNER_BEGIN */'
END='/* XMB_DESIGNER_END */'

def extract(s):
    if s.count(BEGIN)!=1 or s.count(END)!=1:
        raise ValueError('Expected exactly one XMB Designer JSON marker pair')
    a=s.index(BEGIN)+len(BEGIN)
    b=s.index(END,a)
    data=json.loads(s[a:b])
    if not isinstance(data,dict):raise ValueError('Designer config must be a JSON object')
    return data,a,b

def validate(preset,defaults):
    if not isinstance(preset,dict):raise ValueError('Preset must be a JSON object')
    if set(preset)-set(defaults):raise ValueError('Unknown config key(s): '+', '.join(sorted(set(preset)-set(defaults))))
    result=defaults.copy()
    result.update(preset)
    for name,value in result.items():
        default=defaults[name]
        if isinstance(default,bool):
            if not isinstance(value,bool):raise ValueError(name+' needs true/false')
        elif isinstance(default,(int,float)):
            if isinstance(value,bool) or not isinstance(value,(int,float)) or abs(value)>10000:
                raise ValueError(name+' needs a bounded number')
        elif name=='backgroundColor':
            if not isinstance(value,str) or not re.fullmatch(r'#[0-9a-fA-F]{6}',value):
                raise ValueError('backgroundColor must be 6-digit hex')
        elif name=='gameThumbFit':
            if value not in ('contain','cover','stretch'):raise ValueError('gameThumbFit invalid')
        else:raise ValueError('Unsupported config key '+name)
    return result

def apply(preset_path,root=ROOT,backup=True):
    defaults=json.loads((root/'xmb_patch/xmb_designer_default.json').read_text())
    source=json.loads(Path(preset_path).read_text(encoding='utf8'))
    preset=validate(source,defaults)
    filenames=['xmb_patch/xmb_extension.js','theme/theme.js']
    original=[]
    for filename in filenames:
        path=root/filename
        raw=path.read_text(encoding='utf8')
        current,a,b=extract(raw)
        if set(current)!=set(defaults):raise ValueError(filename+': incompatible designer keys')
        altered=raw[:a]+json.dumps(preset,ensure_ascii=False,separators=(',',':'))+raw[b:]
        if filename=='theme/theme.js':
            # Critical: ZhiThemes merged_script() persists only var THEME
            # values, not arbitrary script-body JSON. Update all xmbD_* keys.
            start=altered.find('var THEME = {')
            end=altered.find('};',start)
            if start<0 or end<0:raise ValueError('THEME block missing')
            block=altered[start:end]
            for key,value in preset.items():
                regex=re.compile(r'(^[ \t]*xmbD_'+re.escape(key)+r'[ \t]*:[ \t]*)(-?\d+(?:\.\d+)?|true|false|\x27[^\x27\n]*\x27)',re.M)
                if len(regex.findall(block))!=1:raise ValueError('Missing/duplicate persisted XMB field '+key)
                val=(repr(value) if isinstance(value,str) else str(value).lower() if isinstance(value,bool) else str(value))
                block=regex.sub(lambda match:match.group(1)+val,block,count=1)
            altered=altered[:start]+block+altered[end:]
        original.append((path,raw,altered))
    if original[1][1].count(original[0][1].strip())!=1:
        raise ValueError('theme.js does not contain the canonical XMB extension exactly once; refusing update')
    if backup:
        timestamp=datetime.now().strftime('%Y%m%d_%H%M%S')
        for path,raw,_ in original:
            destination=path.with_name(path.name+'.before_designer_'+timestamp+'.bak')
            shutil.copy2(path,destination)
            print('Backup:',destination)
    for path,raw,altered in original:
        path.write_text(altered,encoding='utf8',newline='\n')
        print('Updated:',path)
    assert (root/'theme/theme.js').read_text().count((root/'xmb_patch/xmb_extension.js').read_text().strip())==1
    print('PASS: XMB preset applied to project source; rebuild with BUILD_XMB_HOME_WSL.sh')

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('preset',type=Path)
    ap.add_argument('--no-backup',action='store_true')
    opts=ap.parse_args()
    apply(opts.preset,backup=not opts.no_backup)
