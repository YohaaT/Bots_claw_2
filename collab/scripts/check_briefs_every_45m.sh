#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/ubuntu/.openclaw/workspace/collab"
cd /home/ubuntu/.openclaw/workspace
STAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
DATEDIR="$(date -u +"%d-%m-%y")"
LOGDIR="$ROOT/logs"
SHAREDDIR="$ROOT/Working/shared"
BRIEFSDIR="$ROOT/Inbox/Briefs"
DIRECTDIR="$ROOT/Inbox/Directivas"
mkdir -p "$LOGDIR" "$SHAREDDIR"

normalize_topic() {
  local base="$1"
  base="${base%%_*}"
  printf '%s' "$base"
}

trace_id() {
  python3 - <<'PY'
import secrets
print(secrets.token_hex(4))
PY
}

append_or_create_thread() {
  local brief_path="$1"
  local brief_name brief_base topic ddmmyy target thread_path tid
  brief_name="$(basename "$brief_path")"
  brief_base="${brief_name%.*}"
  topic="$(normalize_topic "$brief_base")"
  ddmmyy="$(date -u +"%d-%m-%y")"
  target="tank"
  thread_path="$SHAREDDIR/${topic}_${ddmmyy}bo_to_${target}_pending.md"

  if [[ ! -f "$thread_path" ]]; then
    tid="$(trace_id)"
    cat > "$thread_path" <<EOF
author_id: bo
trace_id: ${tid}
created_at_utc: ${STAMP}
target_agent: ${target}
status: pending
topic: ${topic}

## OBJECTIVE
Review pending brief and coordinate next actions with ${target}.

## CONTEXT
Thread auto-created from brief ingestion cron.

## AGREED_SCOPE
- Pending review.

## OPEN_POINTS
- Awaiting BO review of source brief.
- Awaiting ${target} alignment once brief is processed.

## CONVERSATION

### [${STAMP}] bo
Auto-ingested brief \
source: Inbox/Briefs/${brief_name}

Summary preview:
$(head -n 20 "$brief_path" | sed 's/^/> /')

STATUS_NOTE: pending_for_bo

## CURRENT_DECISION
- Brief captured into shared thread.

## NEXT_ACTION
- BO to review the brief in detail and respond in this same thread.

## RISKS
- Auto-ingest only captures a preview; detailed interpretation still required.
EOF
    echo "[$STAMP] Created thread: $thread_path from $brief_name" >> "$LOGDIR/check_briefs.log"
  else
    if ! grep -Fq "source: Inbox/Briefs/${brief_name}" "$thread_path"; then
      cat >> "$thread_path" <<EOF

### [${STAMP}] bo
Detected additional pending brief \
source: Inbox/Briefs/${brief_name}

Summary preview:
$(head -n 20 "$brief_path" | sed 's/^/> /')

STATUS_NOTE: pending_for_bo
EOF
      echo "[$STAMP] Updated existing thread: $thread_path with $brief_name" >> "$LOGDIR/check_briefs.log"
    else
      echo "[$STAMP] Brief already represented in thread: $brief_name" >> "$LOGDIR/check_briefs.log"
    fi
  fi
}

{
  echo "[$STAMP] Checking collab/Inbox/Directivas for dated directives"
  mapfile -t directives < <(find "$DIRECTDIR" -maxdepth 1 -type f -name "*_${DATEDIR}.md" | sort)
  if [[ ${#directives[@]} -lt 3 ]]; then
    echo "[$STAMP] WARNING: expected dated directives for today (${DATEDIR}) and found ${#directives[@]}"
    find "$DIRECTDIR" -maxdepth 1 -type f | sort
  else
    echo "[$STAMP] Found dated directives for today (${DATEDIR})"
  fi

  echo "[$STAMP] Checking collab/Inbox/Briefs for pending items addressed to BO"
  mapfile -t briefs < <(find "$BRIEFSDIR" -maxdepth 1 -type f \( -name '*_to_bo_pending.*' -o -name '*_to_BO_pending.*' \) | sort)
  if [[ ${#briefs[@]} -eq 0 ]]; then
    echo "[$STAMP] No pending BO briefs found"
  else
    for brief in "${briefs[@]}"; do
      echo "[$STAMP] Processing brief: $brief"
      append_or_create_thread "$brief"
    done
  fi
} >> "$LOGDIR/check_briefs.log" 2>&1
