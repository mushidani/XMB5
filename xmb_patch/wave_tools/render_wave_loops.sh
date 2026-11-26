#!/usr/bin/env bash
# OPTIONAL (not part of the normal build): re-render the xmb-web wave background for another month.
# xmb-web colours its wave by month (and day / night), so the shipped loops show November. For another month run, e.g. December:
#
#     bash xmb_patch/wave_tools/render_wave_loops.sh ../xmb-web-main 12
#
# Needs: node + playwright (npm i playwright; npx playwright install chromium), python3 + Pillow + numpy, ffmpeg.
# It renders xmb-web's OWN WebGL wave (UI hidden, PAUSED clock so every frame is exactly 1/fps s of page time = xmb-web's real speed),
# one full 106.25 s cycle, and encodes it as H.264 1080p30. About 25 minutes per palette on 2 cores.
# Then run the normal build: bash BUILD_XMB_HOME_WSL.sh
set -euo pipefail
SRC="${1:?usage: render_wave_loops.sh <path to unzipped xmb-web-main> <month 1-12> [capture fps=15] [seconds=109]}"
MONTH="${2:?month 1-12}"
FPS="${3:-15}"; SECS="${4:-109}"      # 106.25 s = one full xmb-web wave cycle, +2.75 s for the seam cross-fade
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
WORK="$(mktemp -d)"
(cd "$SRC" && python3 -m http.server 8765 >/dev/null 2>&1 & echo $! >"$WORK/server.pid")
sleep 1
trap 'kill "$(cat "$WORK/server.pid")" 2>/dev/null || true' EXIT
for PAL in day:14 night:22; do
  NAME="${PAL%%:*}"; HOUR="${PAL##*:}"; OUTNAME="PS5XMB_XMBWEB_Wave_$(tr a-z A-Z <<<"${NAME:0:1}")${NAME:1}.mp4"
  VW=960 VH=540 node "$HERE/capture-wave.js" "$WORK/$NAME" "$SECS" "$FPS" "$((MONTH-1))" "$HOUR"
  python3 -I "$HERE/make-wave-video.py" "$WORK/$NAME" "$ROOT/ps3_assets/$OUTNAME" "$FPS" 30
done
echo "done: ps3_assets/PS5XMB_XMBWEB_Wave_Day.mp4 and _Night.mp4 now show month $MONTH"
