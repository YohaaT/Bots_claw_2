#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/ubuntu/.openclaw/workspace/collab"
cd /home/ubuntu/.openclaw/workspace
STAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
LOGDIR="$ROOT/logs"
STATEDIR="$ROOT/state"
SHAREDDIR="$ROOT/Working/shared"
BODIR="$ROOT/Working/bo"
BRIEFSDIR="$ROOT/Inbox/Briefs"
DIRECTDIR="$ROOT/scripts/directivas"
mkdir -p "$LOGDIR" "$SHAREDDIR" "$STATEDIR" "$BODIR"

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

get_version() {
  local f="$1"
  awk -F': *' '/^version:/{print $2; exit}' "$f"
}

check_directives_gate() {
  local files=(
    "$DIRECTDIR/DIRECTIVAS_GENERALES.md"
    "$DIRECTDIR/BO_DRIVE_DIRECTIVES.md"
  )
  local changed=0
  for f in "${files[@]}"; do
    if [[ ! -f "$f" ]]; then
      echo "[$STAMP] ERROR: missing directive file $f" >> "$LOGDIR/check_briefs.log"
      return 1
    fi
    local base current last statefile
    base="$(basename "$f")"
    current="$(get_version "$f")"
    [[ -n "$current" ]] || current=0
    statefile="$STATEDIR/${base}.version"
    last=0
    [[ -f "$statefile" ]] && last="$(cat "$statefile")"
    if [[ "$current" =~ ^[0-9]+$ ]] && [[ "$last" =~ ^[0-9]+$ ]] && (( current > last )); then
      echo "[$STAMP] Directive version advanced for $base: $last -> $current. Re-read required before processing work." >> "$LOGDIR/check_briefs.log"
      echo "$current" > "$statefile"
      changed=1
    elif [[ ! -f "$statefile" ]]; then
      echo "$current" > "$statefile"
      changed=1
      echo "[$STAMP] First directive version registration for $base: $current. Re-read required before processing work." >> "$LOGDIR/check_briefs.log"
    fi
  done
  if (( changed == 1 )); then
    return 1
  fi
  echo "[$STAMP] Directive versions unchanged. Work processing allowed." >> "$LOGDIR/check_briefs.log"
  return 0
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

last_status_note() {
  local thread="$1"
  awk -F'STATUS_NOTE: ' '/STATUS_NOTE: /{val=$2} END{gsub(/^[[:space:]]+|[[:space:]]+$/, "", val); print val}' "$thread"
}

scan_shared_for_bo() {
  local found=0
  shopt -s nullglob
  for thread in "$SHAREDDIR"/*.md; do
    local last_note
    last_note="$(last_status_note "$thread")"
    if [[ "$last_note" == "pending_for_bo" || "$last_note" == "ready_for_review" ]]; then
      found=1
      echo "[$STAMP] Shared thread requires BO attention: $thread (last STATUS_NOTE=$last_note)" >> "$LOGDIR/check_briefs.log"
      cp -f "$thread" "$BODIR/"
    else
      echo "[$STAMP] Shared thread skipped for BO: $thread (last STATUS_NOTE=${last_note:-none})" >> "$LOGDIR/check_briefs.log"
    fi
  done
  shopt -u nullglob
  if (( found == 0 )); then
    echo "[$STAMP] No shared threads currently require BO attention" >> "$LOGDIR/check_briefs.log"
  fi
}

{
  echo "[$STAMP] Checking directive versions before work processing"
  if ! check_directives_gate; then
    echo "[$STAMP] Work processing halted until directives are re-read under the new version state."
    exit 0
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

  echo "[$STAMP] Checking collab/Working/shared for BO pending or review-ready threads"
  scan_shared_for_bo
} >> "$LOGDIR/check_briefs.log" 2>&1
