#!/usr/bin/env python3
"""Conservative host-side contracts only. NOT a PS5 runtime test."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parents[2]
src=(R/'xmb_patch/xmb_extension.js').read_text()
theme=(R/'theme/theme.js').read_text()
assert theme.count(src.strip())==1,'Theme source and embedded XMB code out of sync'
assert "waveMode: 'native'" in src
assert "waveMode === 'native'" in src and "kind:'wave-toggle'" in src
assert 'PS3_XMB_Background_User.mp4' in src
assert 'xmbPlaySfx(kind, direction)' in src
assert 'return folderLink(item.id);' in src
assert 'XMB_OVERLAY_ACTIVATED' in src
assert "xmbDeactivate('USER_BACK')" in src
assert (R/'xmb_research/capture_linkev_wave.py').is_file()
assert (R/'xmb_research/README_LINKEV_AND_VSH.md').is_file()
assert (R/'BUILD_WITH_LINKEV_WAVE_WSL.sh').is_file()
print('PASS: linkev build-time bridge, original Game launcher, PCM SFX, native fallback and recovery retained')
