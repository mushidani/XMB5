#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v ffmpeg >/dev/null || { echo 'ffmpeg required' >&2; exit 1; }
for effect in ScrollTaps ScrollApps; do
  src="$ROOT/ps3_assets/PS3_${effect}.mp3"
  dst="$ROOT/ps3_assets/PS3_${effect}_SFX.mp4"
  test -s "$src" || { echo "Missing $src" >&2; exit 1; }
  # VideoPS is the existing native player in ShellUI. A near-black tiny video
  # carries this exact user-supplied sound, re-encoded as AAC; no looping.
  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i 'color=c=black:s=320x180:r=30:d=0.36' -i "$src" \
    -map 0:v:0 -map 1:a:0 -t 0.36 -c:v libx264 -preset fast -crf 32 \
    -pix_fmt yuv420p -c:a aac -b:a 160k -af 'apad=whole_dur=0.36' \
    -movflags +faststart "$dst"
  printf 'Prepared %-14s %s bytes\n' "$effect" "$(stat -c '%s' "$dst")"
done
