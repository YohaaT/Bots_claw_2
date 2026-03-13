import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createPublicRunIds } from "/home/ubuntu/.openclaw/workspace/agents/BO/observability/public-observability.mjs";

const OBS_BASE = "/home/ubuntu/.openclaw/observability";
const EVENTS_DIR = path.join(OBS_BASE, "events");
const TERMINAL_MARKERS_DIR = path.join(OBS_BASE, "tmp", "terminal-markers");

type HookEvent = {
  type: string;
  action: string;
  timestamp?: Date | string;
  sessionKey?: string;
  context?: Record<string, any>;
};

type PublicEvent = {
  ts: string;
  event_id: string;
  public_trace_id: string;
  public_run_id: string;
  event_type: string;
  public_state: "received" | "processing" | "delegated" | "finalizing" | "completed" | "failed";
  agent_id: string;
  summary: string;
  source: "hook" | "orchestrator" | "derived";
  visibility: "high";
  delegated?: boolean;
  qa_invoked?: boolean;
  guard_invoked?: boolean;
  meta?: Record<string, unknown>;
};

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function appendJsonl(filePath: string, obj: unknown) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(obj) + "\n", "utf8");
}

function todayFile(ts: string) {
  return path.join(EVENTS_DIR, `${ts.slice(0, 10)}.jsonl`);
}

function nowIso(input?: Date | string) {
  if (!input) return new Date().toISOString();
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function sha(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
}

function sanitizeText(input: unknown, maxLen = 140): string {
  let s = typeof input === "string" ? input : "";
  s = s.replace(/\bNO_REPLY\b/g, "");
  s = s.replace(/session[_ -]?id/gi, "");
  s = s.replace(/session[_ -]?key/gi, "");
  s = s.replace(/child[_ -]?result/gi, "");
  s = s.replace(/debug/gi, "");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length > maxLen) s = s.slice(0, maxLen - 3).trimEnd() + "...";
  return s;
}

function inferAgentId(sessionKey?: string): string {
  if (!sessionKey) return "bo";
  const m = sessionKey.match(/^agent:([^:]+):/i);
  return m?.[1]?.toLowerCase() || "bo";
}

function makeEvent(partial: Omit<PublicEvent, "ts" | "event_id">, ts?: string): PublicEvent {
  const timestamp = ts || new Date().toISOString();
  return {
    ts: timestamp,
    event_id: `evt_${sha(`${partial.public_run_id}:${partial.event_type}:${timestamp}:${Math.random()}`)}`,
    ...partial
  };
}

function terminalMarkerPath(agentId: string, sessionKey?: string): string | null {
  if (!sessionKey) return null;
  const safe = sha(`${agentId}:${sessionKey}`);
  return path.join(TERMINAL_MARKERS_DIR, `${safe}.json`);
}

function writeTerminalMarker(agentId: string, sessionKey: string | undefined, payload: Record<string, unknown>) {
  const file = terminalMarkerPath(agentId, sessionKey);
  if (!file) return;
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
}

function consumeTerminalMarker(agentId: string, sessionKey?: string): null | Record<string, unknown> {
  const file = terminalMarkerPath(agentId, sessionKey);
  if (!file || !fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    fs.rmSync(file, { force: true });
    return data;
  } catch {
    return null;
  }
}

const handler = async (event: HookEvent) => {
  ensureDir(EVENTS_DIR);
  ensureDir(TERMINAL_MARKERS_DIR);

  const ts = nowIso(event.timestamp);
  const agentId = inferAgentId(event.sessionKey);

  if (event.type === "message" && event.action === "received") {
    const ids = createPublicRunIds(agentId);
    const inbound = sanitizeText(
      event.context?.content ?? event.context?.bodyForAgent ?? event.context?.body ?? "",
      110
    );
    const summary = inbound ? `BO recibió la tarea: ${inbound}` : "BO recibió una tarea";

    const publicEvent = makeEvent(
      {
        ...ids,
        event_type: "task_received",
        public_state: "received",
        agent_id: agentId,
        summary,
        source: "hook",
        visibility: "high",
        delegated: false,
        qa_invoked: false,
        guard_invoked: false,
        meta: {
          channel: sanitizeText(event.context?.channelId || "", 40),
          direction: "inbound",
          provider_message_id: sanitizeText(event.context?.messageId || "", 80)
        }
      },
      ts
    );

    appendJsonl(todayFile(ts), publicEvent);

    writeTerminalMarker(agentId, event.sessionKey, {
      public_trace_id: publicEvent.public_trace_id,
      public_run_id: publicEvent.public_run_id,
      last_inbound_ts: ts,
      inbound_summary: summary
    });

    return;
  }

  if (event.type === "message" && event.action === "sent") {
    const marker = consumeTerminalMarker(agentId, event.sessionKey);
    if (!marker) return;

    const outbound = sanitizeText(event.context?.content || "", 200);
    if (!outbound) return;
    if (outbound === "NO_REPLY") return;

    const publicEvent = makeEvent(
      {
        public_trace_id: String(marker.public_trace_id || createPublicRunIds(agentId).public_trace_id),
        public_run_id: String(marker.public_run_id || createPublicRunIds(agentId).public_run_id),
        event_type: "final_response_sent",
        public_state: "completed",
        agent_id: agentId,
        summary: "Respuesta final enviada",
        source: "hook",
        visibility: "high",
        delegated: false,
        qa_invoked: false,
        guard_invoked: false,
        meta: {
          channel: sanitizeText(event.context?.channelId || "", 40),
          direction: "outbound"
        }
      },
      ts
    );

    appendJsonl(todayFile(ts), publicEvent);
    return;
  }

  if (event.type === "gateway" && event.action === "startup") {
    const ids = createPublicRunIds(agentId);
    const publicEvent = makeEvent(
      {
        ...ids,
        event_type: "gateway_started",
        public_state: "processing",
        agent_id: agentId,
        summary: "Gateway iniciado",
        source: "hook",
        visibility: "high",
        delegated: false,
        qa_invoked: false,
        guard_invoked: false
      },
      ts
    );
    appendJsonl(todayFile(ts), publicEvent);
    return;
  }

  if (event.type === "agent" && event.action === "bootstrap") {
    const ids = createPublicRunIds(agentId);
    const publicEvent = makeEvent(
      {
        ...ids,
        event_type: "agent_bootstrap",
        public_state: "processing",
        agent_id: agentId,
        summary: "Agente cargado",
        source: "hook",
        visibility: "high",
        delegated: false,
        qa_invoked: false,
        guard_invoked: false
      },
      ts
    );
    appendJsonl(todayFile(ts), publicEvent);
  }
};

export default handler;
