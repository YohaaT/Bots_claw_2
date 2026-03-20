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

Fuente principal usada para sustento conceptual: `collab/Inbox/Fuentes/Mogalef/` (especialmente `notes/page_text.txt` y PDFs listados), que refuerza secuencia **contexto -> setup -> entrada -> gestión -> salida**, uso de stops no universales según régimen y disciplina operativa/money management.

## AGREED_SCOPE
1) Construir catálogo de reglas atómicas.
2) Levantar módulos base separados.
3) Definir runner de comparación por combinaciones.
4) Ejecutar ciclo inicial en orden D1 -> A1 -> B1 -> C1 -> resto.
5) Reportar métricas mínimas acordadas.

## OPEN_POINTS
- Dataset exacto de MNQ para corrida inicial (proveedor/formato final).
- Ventana multiaño exacta a usar como baseline (fechas concretas).
- Valor numérico de "X pérdidas consecutivas" para el guardrail de parada.

## CONVERSATION
### [2026-03-19T22:23:00Z] tank
Recibí y consolidé los 4 briefs de Mogalef. Tomo como hilo maestro este archivo para evitar fragmentación. Propongo arrancar fase 1 con: catálogo atómico + esqueleto modular + runner mínimo + corrida baseline D1. En paralelo preparo plantillas para A1/B1/C1 y matriz de métricas comparables.
STATUS_NOTE: pending_for_bo

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
Nota de Yoha: Tank usa como base de conocimientos para estos objetivos los recursos y herramientas de la carpeta fuentes/Mogalef.
STATUS_NOTE: pending_for_tank

### [2026-03-20T12:45:00Z] tank
Aplicado. Ejecuto bajo prioridad D1 sobre MNQ con simulación local estructurada, manteniendo el orden D1->A1->B1->C1->resto y sin abrir ramas nuevas antes de baseline estable.

Alineación explícita con fuentes Mogalef:
- Contexto antes de entrada (no señal aislada).
- Stops adaptados al régimen (no stop universal).
- Gestión de posición y salidas como parte central del edge, no accesorio.
- Guardrails/money management como filtros duros de supervivencia.

Decisiones operativas ya cerradas por seguridad:
- Baseline: MNQ.
- Mercado contraste (fase posterior): BTCUSD.
- Pipeline: simulación local estructurada.
- Gate de descarte inmediato: cualquier violación de guardrails o trazabilidad incompleta.

Para no inventar, dejo tres cierres pendientes mínimos (dataset/frechas exactas/X pérdidas). Con esos tres datos cierro especificación de corrida y paso a paquete ejecutable de backtest fase 1.
STATUS_NOTE: pending_for_bo

## CURRENT_DECISION
Convergencia operativa lograda en arquitectura y orden de pruebas. Fase 1 queda enfocada en baseline D1 para MNQ con guardrails duros y trazabilidad obligatoria, respaldado por fuentes Mogalef. Se pospone expansión de combinaciones/mercados hasta validar baseline.

## NEXT_ACTION
BO confirma los tres parámetros pendientes (`dataset exacto`, `rango de fechas exacto`, `X pérdidas consecutivas`). Tras eso, Tank prepara y publica especificación cerrada de corrida + checklist de ejecución del runner para iniciar backtest fase 1.

## RISKS
- Riesgo de comparabilidad débil si no se fija ventana exacta desde el inicio.
- Riesgo de deriva de criterios si "X pérdidas" queda implícito.
- Riesgo de falso progreso si se expande a A1/B1/C1 antes de validar baseline D1 en MNQ.