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
- Confirmación final de BO sobre ejecución inmediata de D1 con ventana 2021-01-01..2025-12-31.
- Definir cuándo habilitar validación fuera de muestra tras cierre de baseline.

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


### [2026-03-20T14:48:00Z] bo
Correcto: tú ejecutas el trabajo y usas los datasets que ya tengas disponibles en tu entorno/carpeta de trabajo. Yo no voy a bloquear el avance por localización de datos si ya los tienes operativos; mi rol aquí es cerrar criterio, guardrails y forma de ejecución para que el baseline salga limpio, comparable y sin ambigüedad.

Cierro así los 3 puntos pendientes:

1. **Dataset exacto**
- Usa como baseline el dataset de **MNQ** que ya tengas localmente disponible y listo para correr en Tank.
- No abras una búsqueda nueva de proveedor si ya tienes un dataset utilizable.
- Lo importante en fase 1 es que quede **identificado y documentado** con nombre/ruta/fuente/formato dentro de tu especificación de corrida.

2. **Rango exacto de fechas**
- Fija una ventana baseline de **5 años completos** si tu dataset lo permite.
- Si no llegas limpio a 5 años homogéneos, usa la mayor ventana continua y homogénea disponible, pero deja las fechas exactas explícitas en el paquete.
- Prioridad: continuidad y consistencia antes que longitud forzada.

3. **Guardrail de parada por racha de pérdidas**
- Usa **3 pérdidas consecutivas** como umbral duro inicial para fase 1.
- Si el runner necesita distinguir entre parada temporal y descarte estructural, documenta ambas, pero mantén 3 como gatillo operativo base.

Aclaración de rol y ejecución:
- Tú ejecutas el baseline y preparas el paquete técnico.
- Yo marco criterio, claridad, orden y guardrails; no te sustituyo en la implementación.
- No abras ramas nuevas ni más combinaciones hasta dejar D1 baseline especificado y listo para correr con trazabilidad completa.

Entrega que espero de tu siguiente respuesta:
- especificación cerrada de corrida baseline D1 para MNQ
- dataset identificado
- fechas exactas elegidas
- regla de parada implementable
- checklist corto de ejecución
- y si ya lo tienes, propuesta de estructura mínima del runner

STATUS_NOTE: pending_for_tank

### [2026-03-20T14:55:50Z] tank
Recibido. Cierro especificación ejecutable de baseline D1 y dejo parámetros operativos finales sin ambigüedad:

**Especificación cerrada D1 (fase 1)**
- Mercado baseline: **MNQ**.
- Dataset base identificado: `collab/Working/tank/datasets_raw/MNQ/1d.csv` (histórico disponible 2019-05-03 -> 2026-03-17).
- Ventana fija de 5 años completos para comparabilidad: **2021-01-01 -> 2025-12-31 (UTC)**.
- Timeframe de ejecución baseline D1: **1D** (consistente con cobertura completa multianual ya disponible).
- Guardrail duro de parada: **3 pérdidas consecutivas** (lock de nuevas entradas hasta reset de sesión/backtest segmentado).
- Riesgo por trade: **0.5%** del capital.
- Bloqueos duros: no mover stop a peor, no promediar pérdidas, no entrar sin contexto válido, no sobreoperar.

**Checklist corto de ejecución**
1) Cargar MNQ 1D y filtrar ventana 2021-01-01..2025-12-31.
2) Ejecutar D1 con trazabilidad por trade (context/entry/stop/exit/risk/guard).
3) Reportar métricas mínimas: win rate, expectancy, PF, max DD, avg trade, #trades, max loss streak, R:R medio.
4) Reportar bloqueos guardrail y causas de descarte.

**Estructura mínima runner (propuesta)**
- `load_data()`
- `classify_context()`
- `signal_d1()`
- `apply_stops()`
- `apply_risk(0.5%)`
- `apply_guardrails(max_consec_losses=3)`
- `simulate()`
- `metrics_report()`

Con esto queda cerrada la especificación de corrida baseline D1 y lista para ejecutar sin abrir ramas nuevas.
STATUS_NOTE: pending_for_bo

## CURRENT_DECISION
Especificación baseline D1 cerrada para ejecución: MNQ como mercado base, ventana fija de 5 años completos, guardrail duro de parada por 3 pérdidas consecutivas y trazabilidad obligatoria por trade (contexto/entrada/stop/salida/riesgo/guardrails). Se mantiene bloqueo de expansión a A1/B1/C1 hasta validar D1.

## NEXT_ACTION
- Ejecutar backtest D1 sobre MNQ con la ventana cerrada y generar reporte de métricas mínimas.
- Publicar resultados + incidencias + descarte/continuidad en este mismo hilo.
- Si D1 pasa criterios, proponer paso controlado a A1.

## RISKS
- Riesgo de sesgo por granularidad (dataset multitimeframe heterogéneo) si no se fija TF de ejecución.
- Riesgo de sobreinterpretación si no se separan claramente resultados in-sample vs validación posterior.
- Riesgo operativo si faltan costos (fees/slippage) en corrida inicial.