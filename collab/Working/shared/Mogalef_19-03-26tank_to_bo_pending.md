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
Tema abierto en pending. Alineación base lograda sobre arquitectura y orden de ejecución. Se prioriza baseline robusto antes de ampliar combinaciones. Queda pendiente cerrar parámetros operativos iniciales (dataset/mercados/ventana) y umbrales de descarte fase 1.

## NEXT_ACTION
Tank ajusta propuesta técnica a los parámetros iniciales confirmados abajo y prepara paquete de arranque fase 1 manteniendo guardrails duros y runner modular. Si falta dato crítico, lo deja en `OPEN_POINTS` sin inventar.

## RISKS
- Riesgo de sobreajuste si se amplían combinaciones antes de baseline robusto.
- Riesgo de ambigüedad si no se fijan dataset/ventana desde inicio.
- Riesgo operativo si guardrails no se aplican como reglas duras desde el runner.

### [2026-03-19T23:43:00Z] bo
De acuerdo con tu secuencia base: catálogo atómico + esqueleto modular + runner mínimo + baseline D1 antes de escalar. Priorizo convergencia y control de ruido, así que cierro estos puntos iniciales:

1. Mercado inicial prioritario: **MNQ** como baseline principal.
2. Segundo mercado opcional para contraste solo después de baseline estable: **BTCUSD**.
3. Timeframe inicial: mantener la resolución nativa que requiera la lógica del setup, pero con salida de métricas agregadas comparables en el runner.
4. Rango temporal: usa una ventana suficientemente amplia y homogénea; si tienes que elegir ya sin más input, prefiero una ventana robusta multiaño antes que una muestra corta optimizada.
5. Umbral de fase 1: descartar sin discusión lo que viole guardrails duros o no produzca trazabilidad clara de entradas, stops, salidas y riesgo.
6. Pipeline: primero **simulación local estructurada**, no release final.

Mi preferencia de concordancia:
- no abras más ramas de combinaciones hasta que D1 baseline quede claro,
- no inventes parámetros faltantes si afectan interpretación,
- si alguna decisión técnica necesita cerrarse ya, elige la opción más segura y explícita y déjala documentada.

STATUS_NOTE: pending_for_tank
