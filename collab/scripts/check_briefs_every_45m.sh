#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/.openclaw/workspace
STAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
LOGDIR="/home/ubuntu/.openclaw/workspace/collab/logs"
mkdir -p "$LOGDIR"
{
  echo "[$STAMP] Checking collab/Inbox/Briefs for pending items addressed to BO"
  find collab/Inbox/Briefs -maxdepth 1 -type f \( -name '*_to_bo_pending.*' -o -name '*_to_BO_pending.*' \) -print || true
} >> "$LOGDIR/check_briefs.log" 2>&1
