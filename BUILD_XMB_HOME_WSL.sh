#!/usr/bin/env bash
# XMB5 — the PS3 XMB as the PS5 Home (single ELF). Based on ZhiThemes by Zhi (native ShellUI Home engine).
# GNU GPL-3.0-or-later; original ZhiThemes author attribution preserved.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
export PS5_PAYLOAD_SDK="${PS5_PAYLOAD_SDK:-/opt/ps5-payload-sdk}"
if [[ ! -x "$PS5_PAYLOAD_SDK/bin/prospero-clang" ]]; then
 echo "ERROR: PS5 SDK missing at $PS5_PAYLOAD_SDK/bin/prospero-clang" >&2
 exit 1
fi
for tool in python3 cmake ninja; do
 if ! command -v "$tool" >/dev/null 2>&1; then
  echo "ERROR: missing build tool: $tool" >&2
  exit 2
 fi
done
# V34: nothing is rendered or captured at build time any more. The background is xmb-web's own wave, already rendered from its
# WebGL shader into two H.264 loops (ps3_assets/PS5XMB_XMBWEB_Wave_{Day,Night}.mp4) which embed_media.py embeds in the ELF.
# Old wave / category artwork is removed first: every PNG in theme/particles is embedded in the ELF.
python3 xmb_patch/prune_old_assets.py
# the xmb-web-exact renderer (xmb_patch/xmb_native_bundle.js) is inlined into the extension and theme.js.
python3 xmb_patch/embed_native_bundle.py
python3 xmb_patch/patch_xmb.py
python3 xmb_patch/inject_xmb_designer.py
python3 xmb_patch/tests/test_xmb_designer.py
# PCM sounds (the six original PS3 XMB wavs, see xmb_patch/make_ps3_sfx.py) and the two wave loops -> one assembly file with .incbin
python3 xmb_patch/embed_media.py
# xmb-web's own icons (translucent glass render) + hover pictures
python3 xmb_patch/install_xmbnative_assets.py
python3 xmb_patch/tests/test_v34_xmbweb_wave_sound.py

if command -v node >/dev/null 2>&1; then
 node --check theme/theme.js
 node xmb_patch/tests/check_home_integration_v34.js
else
 echo 'WARNING: Node unavailable, skipping native XMB test harness' >&2
fi
# Upstream pipeline: generates theme_default_js.hpp, editor, textures;
# configures OnionHEN libraries and builds the XMB5 payload target.
bash scripts/build_zhithemes.sh "$@"
if [[ ! -s release/XMB5.elf ]]; then
 echo 'ERROR: XMB5 payload was not emitted' >&2
 exit 3
fi
if [[ "$(od -An -tx1 -N4 release/XMB5.elf | tr -d ' \n')" != '7f454c46' ]]; then
 echo 'ERROR: build output is not an ELF' >&2
 exit 4
fi
rm -f release/ZhiThemes.elf release/PS5XMB_Home_v1_4_ONE_ELF.elf   # V79: the old names
python3 xmb_patch/verify_final_elf.py release/XMB5.elf
printf '\nBuilt XMB5: %s\n' "$ROOT/release/XMB5.elf"
