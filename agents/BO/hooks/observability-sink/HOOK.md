---
name: observability-sink
description: "Captura eventos nativos mínimos y los transforma en eventos públicos saneados para la capa de observabilidad V1"
metadata:
  {
    "openclaw": {
      "emoji": "🧭",
      "events": [
        "message:received",
        "message:sent",
        "gateway:startup",
        "agent:bootstrap"
      ]
    }
  }
---

# observability-sink

Hook de workspace para observabilidad V1.

## Qué hace
- Registra eventos públicos saneados en JSONL.
- No expone internals del runtime.
- Nunca guarda session_id, session_key, child results, NO_REPLY ni bloques de debug.

## Qué no hace
- No reconstruye el lifecycle real de subagentes por sí solo.
- No intenta inferir QA/GUARD/delegación sin instrumentación explícita de BO.

## Eventos que puede producir
- `task_received`
- `final_response_sent`
- `gateway_started`
- `agent_bootstrap`

## Ruta esperada de salida
- `/home/ubuntu/.openclaw/observability/events/YYYY-MM-DD.jsonl`

## Requisito operativo
La visibilidad real de `delegated`, `active_agent`, `qa_started`, `guard_started`, `finalizing` y fallos terminales depende de que BO emita eventos públicos explícitos usando el módulo `public-observability.mjs`.
