#!/usr/bin/env bash
# Sends the 24 XMB5 month waves (xmbwaves/XMB5_Wave_*.mp4) to the PS5's /user/data/XMB5/xmbwaves/ through the ELF's web server.
# Waves already there with the same size are skipped.        bash UPLOAD_XMB_WAVES.sh [ps5-ip] [folder]
set -euo pipefail
PS5="${1:-192.0.2.1}"
DIR="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/xmbwaves}"
shopt -s nullglob
files=("$DIR"/XMB5_Wave_*.mp4)
[ ${#files[@]} -gt 0 ] || { echo "No XMB5_Wave_*.mp4 in $DIR - copy the 24 videos from the wave kit's out folder there first."; exit 1; }
have="$(curl -fsS --max-time 10 "http://$PS5:4444/xmbwaves")" || { echo "Cannot reach the PS5 at $PS5:4444 - is the XMB ELF loaded?"; exit 1; }
sent=0
for f in "${files[@]}"; do
  n="$(basename "$f")"; sz="$(stat -c %s "$f")"
  if grep -qx "$n $sz" <<<"$have"; then echo "already on the PS5: $n"; continue; fi
  echo "uploading $n ($((sz / 1048576)) MB)..."
  curl -fS --progress-bar -H "Expect:" -H "Content-Type: application/octet-stream" --data-binary "@$f" \
    "http://$PS5:4444/background?kind=xmbwaves&name=$n" >/dev/null
  sent=$((sent + 1))
done
echo "Done: $sent sent, $((${#files[@]} - sent)) were already there. The XMB picks the current month's wave by itself."
