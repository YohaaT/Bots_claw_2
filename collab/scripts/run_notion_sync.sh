#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/.openclaw/workspace
set -a
source /home/ubuntu/.openclaw/workspace/.env
set +a
/home/ubuntu/.openclaw/workspace/collab/scripts/sync_notion_dashboard.py >> /home/ubuntu/.openclaw/workspace/collab/logs/notion_sync.log 2>&1
