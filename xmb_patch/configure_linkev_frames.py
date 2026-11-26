#!/usr/bin/env python3
"""Set linkev availability flag in both XMB canonical and already-embedded source.
The manifest is hashed, so placeholders/static images cannot masquerade as
actual upstream shader captures. Reentrant, no stale theme/extension mismatch.
"""
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'xmb_patch'))
from render_linkev_frames import valid_manifest
value='true' if valid_manifest() else 'false'
for rel in ('xmb_patch/xmb_extension.js','theme/theme.js'):
 p=ROOT/rel;s=p.read_text()
 pattern=r'var XMB_LINK_EV_AVAILABLE = (?:true|false);'
 n=len(re.findall(pattern,s));assert n==1,(rel,n)
 s=re.sub(pattern,'var XMB_LINK_EV_AVAILABLE = '+value+';',s)
 p.write_text(s)
print('LINK_EV_CAPTURE_AVAILABLE='+value)
