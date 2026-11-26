#!/usr/bin/env bash
# Send ZhiThemes' real upstream unload command from a computer on the same LAN.
# Does not modify PS5 firmware or application databases.
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: bash RECOVER_STOCK_HOME.sh <PS5-IP>" >&2
  exit 2
fi
if ! [[ "$1" =~ ^[0-9.]+$ ]]; then
  echo 'Expected numerical IPv4 address of your PS5' >&2
  exit 2
fi
curl --connect-timeout 5 --max-time 15 --fail-with-body -X POST "http://${1}:4444/quit"
echo -e '\nRequested ZhiThemes to unload. If the already-rendered Home remains modified, reboot without XMB.'
