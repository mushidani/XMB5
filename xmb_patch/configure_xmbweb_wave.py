#!/usr/bin/env python3
"""Mark native xmb-web WebGL captures available ONLY after 16 files hash-verify.
`--require` aborts rather than silently using the old fake silk wave.
"""
from pathlib import Path
import argparse,re,sys
from capture_xmbweb_wave import validate_frames

def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--require',action='store_true')
 a=p.parse_args();root=a.root.resolve()
 ok=validate_frames(root/'theme/particles',root/'xmb_research/xmbweb_webgl_wave_manifest.json')
 if a.require and not ok:raise ValueError('Authentic original WebGL frame manifest absent/invalid. Refusing approximation.')
 for r in ('xmb_patch/xmb_extension.js','theme/theme.js'):
  dest=root/r;text=dest.read_text()
  pattern=r'var XMB_XMBWEB_CAPTURE_AVAILABLE = (?:true|false);'
  if len(re.findall(pattern,text))!=1:raise ValueError('Capture flag mismatch in '+r)
  dest.write_text(re.sub(pattern,'var XMB_XMBWEB_CAPTURE_AVAILABLE = '+('true' if ok else 'false')+';',text))
 print('XMBWEB_ORIGINAL_WEBGL_FRAMES_AVAILABLE='+str(ok).lower())

if __name__=='__main__':
 try:main()
 except (ValueError,OSError) as e:print('ERROR:',e,file=sys.stderr);sys.exit(2)
