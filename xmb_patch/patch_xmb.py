#!/usr/bin/env python3
"""Verify the v1.0 ZhiThemes native Home integration. Never double-inject.
For changes, edit xmb_extension.js and reapply to theme.js with the same paths.
"""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'theme/theme.js').read_text(encoding='utf-8')
e=(root/'xmb_patch/xmb_extension.js').read_text(encoding='utf-8').strip()
assert s.count(e)==1, 'XMB extension differs from the built theme; refusing to compile stale code'
for token in ['PS5XMB HOME V1.4 MEDIA FOCUS FIX', 'DIRECT_ROOT_XMB_QUEUED', 'diagnosticOnly: false',
              "APP === 'home' && !PLAIN && THEME.xmbHomeOn", 'xmbCapture(type, props)']:
    assert token in s, 'XMB Home hook missing '+token
assert "s.clock.color = 'transparent'; /* prevents duplicate native PS5 clock */" in s
assert 'Direct Home probe' not in s
print('PS5XMB v1.4 full native Home integration verified')
