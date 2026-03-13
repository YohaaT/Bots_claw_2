import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OBS_BASE = "/home/ubuntu/.openclaw/observability";
const EVENTS_DIR = path.join(OBS_BASE, "events");

const PUBLIC_STATES = new Set([
  "received",
  "processing",
  "delegated",
  "finalizing",
  "completed",
  "failed"
]);

const WAITING_FOR = new Set([
  "subagent",
  "qa",
  "guard",
  "user",
  "consolidation"
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function dayFile(ts) {
  return path.join(EVENTS_DIR, `${String(ts).slice(0, 10)}.jsonl`);
}

function appendJsonl(filePath, obj) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(obj) + "\n", "utf8");
}

function nowIso() {
  return new Date().toISOString();
}

function randHex(bytes = 8) {
  return crypto.randomBytes(bytes).toString("hex");
}

function shortHash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function sanitizeString(input, maxLen = 140) {
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

function sanitizeAgents(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => sanitizeString(String(x), 40))
    .filter(Boolean)
    .slice(0, 12);
}

function sanitizeWaitingFor(value) {
  if (!value) return null;
  return WAITING_FOR.has(value) ? value : null;
}

function validatePublicState(state) {
  if (!PUBLIC_STATES.has(state)) {
    throw new Error(`Invalid public_state: ${state}`);
  }
  return state;
}

export function createPublicRunIds(agentId = "bo") {
  const ts = Date.now().toString(36);
  const nonce = randHex(6);
  const seed = `${agentId}:${ts}:${nonce}:${process.pid}`;
  const suffix = shortHash(seed);
  return {
    public_trace_id: `ptr_${ts}_${suffix}`,
    public_run_id: `prun_${ts}_${nonce}`
  };
}

export function createPublicObservabilityEmitter(options = {}) {
  const agentId = sanitizeString(options.agentId || "bo", 40) || "bo";
  const ids = options.ids || createPublicRunIds(agentId);
  const startedAt = options.startedAt || nowIso();

  function emit(input) {
    const ts = input.ts || nowIso();
    const publicState = validatePublicState(input.public_state);
    const waitingFor = sanitizeWaitingFor(input.waiting_for);
    const agentsInvoked = sanitizeAgents(input.agents_invoked);
    const activeAgent = input.active_agent ? sanitizeString(input.active_agent, 40) : null;
    const summary = sanitizeString(input.summary || "", 140);

    if (!summary) {
      throw new Error("summary is required");
    }

    const event = {
      ts,
      event_id: `evt_${shortHash(`${ids.public_run_id}:${input.event_type}:${ts}:${randHex(4)}`)}`,
      public_trace_id: ids.public_trace_id,
      public_run_id: ids.public_run_id,
      event_type: sanitizeString(input.event_type || "", 60),
      public_state: publicState,
      agent_id: agentId,
      summary,
      source: "orchestrator",
      visibility: "high"
    };

    if (activeAgent) event.active_agent = activeAgent;
    if (waitingFor) event.waiting_for = waitingFor;
    if (typeof input.elapsed_ms === "number" && Number.isFinite(input.elapsed_ms) && input.elapsed_ms >= 0) {
      event.elapsed_ms = Math.floor(input.elapsed_ms);
    }
    if (input.last_change_ts) event.last_change_ts = input.last_change_ts;
    if (typeof input.delegated === "boolean") event.delegated = input.delegated;
    if (agentsInvoked.length) event.agents_invoked = agentsInvoked;
    if (typeof input.qa_invoked === "boolean") event.qa_invoked = input.qa_invoked;
    if (typeof input.guard_invoked === "boolean") event.guard_invoked = input.guard_invoked;
    if (input.error_code) event.error_code = sanitizeString(input.error_code, 40);
    if (input.error_summary) event.error_summary = sanitizeString(input.error_summary, 140);

    appendJsonl(dayFile(ts), event);
    return event;
  }

  function elapsedMs() {
    const a = new Date(startedAt).getTime();
    const b = Date.now();
    if (Number.isNaN(a)) return 0;
    return Math.max(0, b - a);
  }

  return {
    ids,
    startedAt,
    emit,

    taskReceived(taskSummary) {
      return emit({
        event_type: "task_received",
        public_state: "received",
        summary: `BO recibió la tarea: ${sanitizeString(taskSummary, 110)}`,
        delegated: false,
        qa_invoked: false,
        guard_invoked: false,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    processing(summary = "BO está procesando la tarea") {
      return emit({
        event_type: "bo_routing",
        public_state: "processing",
        summary,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    subagentSpawned(activeAgent, agentsInvoked = []) {
      const merged = Array.from(new Set([activeAgent, ...agentsInvoked].filter(Boolean)));
      return emit({
        event_type: "subagent_spawned",
        public_state: "delegated",
        active_agent: activeAgent,
        waiting_for: "subagent",
        delegated: true,
        agents_invoked: merged,
        summary: `BO delegó trabajo a ${sanitizeString(activeAgent, 40)}`,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    subagentRunning(activeAgent, agentsInvoked = []) {
      const merged = Array.from(new Set([activeAgent, ...agentsInvoked].filter(Boolean)));
      return emit({
        event_type: "subagent_running",
        public_state: "delegated",
        active_agent: activeAgent,
        waiting_for: "subagent",
        delegated: true,
        agents_invoked: merged,
        summary: `Subagente activo: ${sanitizeString(activeAgent, 40)}`,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    subagentCompleted(activeAgent, agentsInvoked = []) {
      const merged = Array.from(new Set([activeAgent, ...agentsInvoked].filter(Boolean)));
      return emit({
        event_type: "subagent_completed",
        public_state: "processing",
        active_agent: activeAgent,
        delegated: true,
        agents_invoked: merged,
        summary: `${sanitizeString(activeAgent, 40)} completó su trabajo`,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    subagentFailed(activeAgent, errorSummary, agentsInvoked = [], errorCode = "subagent_error") {
      const merged = Array.from(new Set([activeAgent, ...agentsInvoked].filter(Boolean)));
      return emit({
        event_type: "subagent_failed",
        public_state: "failed",
        active_agent: activeAgent,
        delegated: true,
        agents_invoked: merged,
        error_code: errorCode,
        error_summary: errorSummary,
        summary: "Falló la tarea delegada",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    qaStarted(agentsInvoked = ["SA-QA"]) {
      return emit({
        event_type: "qa_started",
        public_state: "delegated",
        active_agent: "SA-QA",
        waiting_for: "qa",
        delegated: true,
        agents_invoked: agentsInvoked,
        qa_invoked: true,
        summary: "QA en revisión",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    qaCompleted(agentsInvoked = ["SA-QA"]) {
      return emit({
        event_type: "qa_completed",
        public_state: "processing",
        delegated: true,
        agents_invoked: agentsInvoked,
        qa_invoked: true,
        summary: "QA completado",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    guardStarted(agentsInvoked = ["SA-GUARD"]) {
      return emit({
        event_type: "guard_started",
        public_state: "delegated",
        active_agent: "SA-GUARD",
        waiting_for: "guard",
        delegated: true,
        agents_invoked: agentsInvoked,
        guard_invoked: true,
        summary: "GUARD en revisión",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    guardCompleted(agentsInvoked = ["SA-GUARD"]) {
      return emit({
        event_type: "guard_completed",
        public_state: "processing",
        delegated: true,
        agents_invoked: agentsInvoked,
        guard_invoked: true,
        summary: "GUARD completado",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    finalizing(summary = "BO consolidó el resultado final") {
      return emit({
        event_type: "final_response_ready",
        public_state: "finalizing",
        waiting_for: "consolidation",
        summary,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    completed() {
      return emit({
        event_type: "final_response_sent",
        public_state: "completed",
        summary: "Respuesta final enviada",
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    },

    failed(errorSummary, errorCode = "failed") {
      return emit({
        event_type: "run_failed",
        public_state: "failed",
        summary: "Falló la ejecución",
        error_code: errorCode,
        error_summary: errorSummary,
        elapsed_ms: elapsedMs(),
        last_change_ts: nowIso()
      });
    }
  };
}
