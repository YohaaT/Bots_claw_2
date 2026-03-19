#!/usr/bin/env python3
import json
import hmac
import hashlib
import logging
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone

ORACLE_VPN_IP = "10.10.0.1"
ALLOWED_ACTIONS = {"BUY", "SELL", "STATUS", "PING"}
HMAC_SECRET = os.environ.get("EXEC_HMAC_SECRET", "HMAC_SECRET_PENDIENTE")
NODE_NAME = os.environ.get("EXEC_NODE_NAME", "dell-tank")

logging.basicConfig(
    filename="/var/log/openclaw/executor.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def sign_receipt(payload: dict) -> str:
    data = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return hmac.new(HMAC_SECRET.encode(), data, hashlib.sha256).hexdigest()


def verify_request_signature(raw: bytes, signature: str) -> bool:
    if not signature:
        return False
    expected = hmac.new(HMAC_SECRET.encode(), raw, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature.strip())


def error_receipt(code: str, message: str, http_status: int = 400):
    base = {
        "status": "error",
        "error_code": code,
        "message": message,
        "ts": utc_now(),
        "node": NODE_NAME,
        "http_status": http_status,
    }
    base["receipt_sig"] = sign_receipt(base)
    return base


def validate_payload(payload):
    if "action" not in payload:
        return False, "Missing action"
    if payload["action"] not in ALLOWED_ACTIONS:
        return False, f"Unknown action: {payload['action']}"
    if payload["action"] in {"BUY", "SELL"}:
        if "asset" not in payload or "volume" not in payload:
            return False, "BUY/SELL require asset and volume"
        if not isinstance(payload["volume"], (int, float)) or payload["volume"] <= 0:
            return False, "Invalid volume"
    return True, "OK"


def execute_action(payload):
    action = payload["action"]
    ts = utc_now()
    logging.info(f"EXEC: {action} | payload={payload}")

    if action == "PING":
        body = {"status": "ok", "ts": ts, "node": NODE_NAME, "action": "PING"}
    elif action == "STATUS":
        body = {
            "status": "ok",
            "ts": ts,
            "exec_plane": "running",
            "node": NODE_NAME,
            "action": "STATUS",
        }
    else:
        receipt_id = hashlib.sha256(f"{ts}|{action}|{payload.get('asset','')}|{payload.get('volume','')}".encode()).hexdigest()[:16]
        body = {
            "status": "stub_executed",
            "action": action,
            "asset": payload["asset"],
            "volume": payload["volume"],
            "ts": ts,
            "node": NODE_NAME,
            "receipt_id": receipt_id,
            "note": "stub — no exchange real todavia",
        }

    body["receipt_sig"] = sign_receipt(body)
    return body


class ExecutionHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        logging.info("HTTP %s", args)

    def _json(self, code: int, payload: dict):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def do_GET(self):
        if self.path == "/health":
            payload = {"status": "ok", "node": NODE_NAME, "ts": utc_now()}
            payload["receipt_sig"] = sign_receipt(payload)
            self._json(200, payload)
            return
        self._json(404, error_receipt("NOT_FOUND", "Endpoint not found", 404))

    def do_POST(self):
        if self.path != "/execute":
            self._json(404, error_receipt("NOT_FOUND", "Endpoint not found", 404))
            return

        client_ip = self.client_address[0]
        if client_ip != ORACLE_VPN_IP and client_ip != "127.0.0.1":
            logging.warning(f"BLOCKED from {client_ip}")
            self._json(403, error_receipt("FORBIDDEN", f"Forbidden from {client_ip}", 403))
            return

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)
        signature = self.headers.get("X-Signature", "")

        if HMAC_SECRET == "HMAC_SECRET_PENDIENTE":
            self._json(503, error_receipt("HMAC_NOT_CONFIGURED", "HMAC secret is not configured", 503))
            return

        if not verify_request_signature(raw, signature):
            logging.warning(f"INVALID_SIG from {client_ip}")
            self._json(401, error_receipt("INVALID_SIGNATURE", "Invalid or missing X-Signature", 401))
            return

        try:
            payload = json.loads(raw)
        except Exception:
            self._json(400, error_receipt("INVALID_JSON", "Invalid JSON", 400))
            return

        valid, reason = validate_payload(payload)
        if not valid:
            logging.warning(f"INVALID: {reason} | {payload}")
            self._json(400, error_receipt("INVALID_PAYLOAD", reason, 400))
            return

        result = execute_action(payload)
        self._json(200, result)


if __name__ == "__main__":
    server = HTTPServer(("10.10.0.2", 8090), ExecutionHandler)
    logging.info("Tank Execution Plane listening on 10.10.0.2:8090")
    server.serve_forever()
