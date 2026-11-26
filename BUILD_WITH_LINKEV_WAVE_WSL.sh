#!/usr/bin/env bash
# Runs upstream MIT WebGL2 renderer OFFLINE at build time, records its actual
# output, then embeds that video automatically in the existing ONE ELF.
# Not a runtime WebGL2 port to PS5 HomeUI!
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
UPSTREAM="$ROOT/xmb_research/upstream_linkev"
for x in git ffmpeg ffprobe; do command -v "$x" >/dev/null || { echo "Missing $x" >&2; exit 2; }; done
if [[ ! -f "$UPSTREAM/ps3xmbwave/index.html" ]]; then
  if [[ -e "$UPSTREAM" ]]; then echo 'Incomplete upstream directory; remove it or complete the clone' >&2; exit 3; fi
  echo 'Downloading unchanged upstream linkev renderer (MIT)...'
  git clone --depth=1 https://github.com/linkev/PlayStation-3-XMB.git "$UPSTREAM"
fi
[[ -f "$UPSTREAM/LICENSE" ]] || { echo 'Missing upstream MIT LICENSE' >&2; exit 4; }
if [[ ! -x "${PS5_PAYLOAD_SDK:-/opt/ps5-payload-sdk}/bin/prospero-clang" ]]; then
  echo 'Missing PS5 payload SDK. Set PS5_PAYLOAD_SDK correctly.' >&2; exit 4
fi
python3 xmb_research/capture_linkev_wave.py --source "$UPSTREAM" --fps 30 --seconds 8
printf '\nThe exact upstream WebGL canvas was captured as a background VIDEO. This is NOT a native PS5 WebGL renderer.\n'
exec bash BUILD_XMB_HOME_WSL.sh "$@"
