#!/bin/bash
# Browsers refuse to load the game's modules and models from file://, so serve
# the folder on localhost and open it.
cd "$(dirname "$0")/game" || exit 1
PORT=8765
while lsof -i :"$PORT" >/dev/null 2>&1; do PORT=$((PORT + 1)); done
echo "机械星球正在 http://localhost:$PORT 运行，关掉这个窗口即可退出游戏。"
(sleep 1 && open "http://localhost:$PORT") &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
