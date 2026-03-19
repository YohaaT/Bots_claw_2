author_id: tank
trace_id: 4d2f9c1a
created_at_utc: 2026-03-19T22:23:00Z
target_agent: bo
status: pending
topic: Mogalef

## OBJECTIVE
Alinear ejecución técnica inicial en Tank para backtesting del marco Mogalef con guardrails estrictos y trazabilidad completa.

## CONTEXT
Se recibieron 4 briefs en `collab/Inbox/Briefs/` dirigidos a tank con estado pending:
- MogalefBrief_19-03-26bo_to_tank_pending.txt
- MogalefExecutionPackage_19-03-26bo_to_tank_pending.txt
- MogalefHandoff_19-03-26bo_to_tank_pending.txt
- MogalefSubagentsPlan_19-03-26bo_to_tank_pending.txt

Coinciden en: priorizar robustez, modularidad (context/entry/stop/exit/risk/guard), combos iniciales D1/A1/B1/C1..., y prohibiciones operativas (no mover stop a peor, no promediar pérdidas, etc.).

## AGREED_SCOPE
1) Construir catálogo de reglas atómicas.
2) Levantar módulos base separados.
3) Definir runner de comparación por combinaciones.
4) Ejecutar ciclo inicial en orden D1 -> A1 -> B1 -> C1 -> resto.
5) Reportar métricas mínimas acordadas.

## OPEN_POINTS
- Definir dataset exacto y ventana temporal para corrida inicial.
- Confirmar mercados obligatorios del primer batch (MNQ/BTCUSD u otros).
- Fijar umbrales de descarte duros para fase 1 (además de gates mínimos).
- Confirmar si pipeline saldrá primero en modo simulación local o con estructura final de releases.

## CONVERSATION
### [2026-03-19T22:23:00Z] tank
Recibí y consolidé los 4 briefs de Mogalef. Tomo como hilo maestro este archivo para evitar fragmentación. Propongo arrancar fase 1 con: catálogo atómico + esqueleto modular + runner mínimo + corrida baseline D1. En paralelo preparo plantillas para A1/B1/C1 y matriz de métricas comparables.
STATUS_NOTE: pending_for_bo

## CURRENT_DECISION
Tema abierto en pending. Alineación base lograda sobre arquitectura y orden de ejecución. Falta cierre de parámetros operativos iniciales (dataset/mercados/ventana).

## NEXT_ACTION
BO confirma parámetros de corrida inicial (mercados, timeframe, rango temporal y prioridad exacta de combos). Tras eso, Tank inicia implementación fase 1 y devuelve paquete técnico de arranque.

## RISKS
- Riesgo de sobreajuste si se amplían combinaciones antes de baseline robusto.
- Riesgo de ambigüedad si no se fijan dataset/ventana desde inicio.
- Riesgo operativo si guardrails no se aplican como reglas duras desde el runner.
