#!/bin/bash
# Build the game and assemble a double-click release folder next to the project.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
OUT="../机械星球-离线版"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R build "$OUT/game"
cp "release/开始游戏.command" "$OUT/"
chmod +x "$OUT/开始游戏.command"
du -sh "$OUT"
