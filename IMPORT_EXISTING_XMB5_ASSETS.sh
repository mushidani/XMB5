#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
if [[ $# -ne 1 ]]; then echo "Usage: bash IMPORT_EXISTING_XMB5_ASSETS.sh /path/to/previous/XMB5/project" >&2; exit 2; fi
src="$1/xmb_patch/native_assets/fonts/ps3-rodin-regular.ttf"
if [[ ! -s "$src" ]]; then echo "Missing original Rodin Regular asset: $src" >&2; exit 1; fi
mkdir -p xmb_patch/native_assets/fonts
cp -- "$src" xmb_patch/native_assets/fonts/ps3-rodin-regular.ttf
python3 xmb_patch/embed_media.py
