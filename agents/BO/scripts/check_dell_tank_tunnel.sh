#!/usr/bin/env bash
set -euo pipefail

HOST="${1:-10.10.0.2}"
PORT="${2:-8090}"
PATH_HEALTH="${3:-/health}"
EXPECTED_NODE="${EXPECTED_NODE:-dell-tank}"
URL="http://${HOST}:${PORT}${PATH_HEALTH}"

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: falta comando requerido: $1" >&2
    exit 2
  }
}

need curl
need grep

TMP_BODY="$(mktemp)"
trap 'rm -f "$TMP_BODY"' EXIT

CURL_FMT='http_code=%{http_code}\ntime_total=%{time_total}\nremote_ip=%{remote_ip}\nsize_download=%{size_download}\n'

if ! META="$(curl -sS --connect-timeout 3 --max-time 8 -o "$TMP_BODY" -w "$CURL_FMT" "$URL")"; then
  echo "STATUS=DOWN"
  echo "TARGET=$URL"
  echo "ERROR=curl_failed"
  exit 1
fi

HTTP_CODE="$(printf '%s\n' "$META" | awk -F= '/^http_code=/{print $2}')"
TIME_TOTAL="$(printf '%s\n' "$META" | awk -F= '/^time_total=/{print $2}')"
REMOTE_IP="$(printf '%s\n' "$META" | awk -F= '/^remote_ip=/{print $2}')"
BODY="$(cat "$TMP_BODY")"

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "STATUS=DEGRADED"
  echo "TARGET=$URL"
  echo "HTTP_CODE=$HTTP_CODE"
  echo "LATENCY_S=$TIME_TOTAL"
  echo "REMOTE_IP=$REMOTE_IP"
  echo "BODY=$BODY"
  exit 1
fi

if ! printf '%s' "$BODY" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"'; then
  echo "STATUS=DEGRADED"
  echo "TARGET=$URL"
  echo "HTTP_CODE=$HTTP_CODE"
  echo "LATENCY_S=$TIME_TOTAL"
  echo "REMOTE_IP=$REMOTE_IP"
  echo "ERROR=health_payload_missing_status_ok"
  echo "BODY=$BODY"
  exit 1
fi

if ! printf '%s' "$BODY" | grep -q "\"node\"[[:space:]]*:[[:space:]]*\"${EXPECTED_NODE}\""; then
  echo "STATUS=DEGRADED"
  echo "TARGET=$URL"
  echo "HTTP_CODE=$HTTP_CODE"
  echo "LATENCY_S=$TIME_TOTAL"
  echo "REMOTE_IP=$REMOTE_IP"
  echo "ERROR=unexpected_node"
  echo "EXPECTED_NODE=$EXPECTED_NODE"
  echo "BODY=$BODY"
  exit 1
fi

echo "STATUS=OK"
echo "TARGET=$URL"
echo "HTTP_CODE=$HTTP_CODE"
echo "LATENCY_S=$TIME_TOTAL"
echo "REMOTE_IP=$REMOTE_IP"
echo "BODY=$BODY"
