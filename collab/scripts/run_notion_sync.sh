#!/usr/bin/env bash
set -euo pipefail

cd /home/ubuntu/.openclaw/workspace
mkdir -p /home/ubuntu/.openclaw/workspace/collab/logs

if [ -f /home/ubuntu/.openclaw/workspace/.env ]; then
  set -a
  source /home/ubuntu/.openclaw/workspace/.env
  set +a
fi

if [ -f /home/ubuntu/.openclaw/.env ]; then
  set -a
  source /home/ubuntu/.openclaw/.env
  set +a
fi

if [ -z "${NOTION_API_KEY:-}" ] && [ -n "${NOTION_KEY:-}" ]; then
  export NOTION_API_KEY="$NOTION_KEY"
fi

/home/ubuntu/.openclaw/workspace/collab/scripts/sync_notion_dashboard.py >> /home/ubuntu/.openclaw/workspace/collab/logs/notion_sync.log 2>&1
