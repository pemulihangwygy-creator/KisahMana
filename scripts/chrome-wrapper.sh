#!/bin/sh
# Peluncur Chromium untuk Remotion — biner @sparticuz/chromium + lib NSS/NSPR (al2023).
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="$(node "$DIR/resolve-chromium.mjs")"
export LD_LIBRARY_PATH="/tmp/kisahmana-chromium-libs:$LD_LIBRARY_PATH"
exec "$CHROME" --no-sandbox --disable-dev-shm-usage --disable-gpu "$@"
