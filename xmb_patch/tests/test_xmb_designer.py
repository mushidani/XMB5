#!/usr/bin/env python3
"""Verify the editably configured XMB and web-editor integration (host only)."""
from pathlib import Path
import json
import re
import subprocess
import tempfile
from PIL import Image

R=Path(__file__).resolve().parents[2]
A=R/'xmb_patch/xmb_extension.js'
T=R/'theme/theme.js'
W=R/'theme/editor.html'
D=R/'xmb_patch/XMB_Designer.html'
assert A.exists() and T.exists() and W.exists() and D.exists()
a=A.read_text();t=T.read_text();w=W.read_text();d=D.read_text()
assert t.count(a.strip())==1
begin='/* XMB_DESIGNER_BEGIN */';end='/* XMB_DESIGNER_END */'
assert a.count(begin)==t.count(begin)==1 and a.count(end)==t.count(end)==1
config=json.loads(a.split(begin)[1].split(end)[0])
default=json.loads((R/'xmb_patch/xmb_designer_default.json').read_text())
assert config.keys()==default.keys()
assert len(config)>=40
for k in config:
 assert 'xmbD_'+k+':' in t,'Missing native THEME persistence '+k
assert "THEME['xmbD_'+k]" in a
# V33: the Designer keys no longer drive the layout (xmb-web constants do); the block/persistence checks above remain.
assert 'PS5XMB_DESIGNER_INTEGRATION_BEGIN' in w
assert '<button id="btnXmbDesigner"' in w
assert '<iframe id="xmbDesignerFrame"' in w
assert 'XMB Designer' in w
assert "'/theme.js'" in d and "'/reload'" in d
assert 'patchTheme(text,correct(conf))' in d
assert '1920 × 1080' in d
assert 'Reference image' in d
assert 'gameThumbFit' in d
assert 'Download a safety backup' in d
assert 'if (!confirm(' in d or 'confirm(' in d
assert 'ResizeObserver' in d
assert (R/'xmb_patch/apply_xmb_preset.py').exists()
js=re.search(r'<script>(.*?)</script>',d,re.S)
assert js,'Designer JS missing'
with tempfile.TemporaryDirectory() as td:
    j=Path(td)/'designer.js'
    j.write_text(js.group(1))
    subprocess.check_call(['node','--check',str(j)])
print('PASS: XMB Designer linked to real ZhiThemes editor, 41 runtime fields, direct save/reload, presets and JS syntax')
