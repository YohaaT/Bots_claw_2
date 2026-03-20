# DIRECTIVAS_GENERALES.md

version: 4
last_updated_utc: 2026-03-20T10:03:00Z


## Propósito

Este protocolo define cómo BO y Tank colaboran en Drive para debatir, coordinar, afinar decisiones y dejar trazabilidad visible para Yoha.

## Principio base

- Un tema de trabajo compartido = un solo archivo-hilo.
- No abrir archivos nuevos por cada turno si el tema es el mismo.
- Todo el debate debe quedar en el mismo archivo para conservar contexto, decisiones y seguimiento.

## Carpetas

### Inbox/
Entrada para bots.

- `Inbox/Briefs/` → briefs, instrucciones, encargos
- `Inbox/Fuentes/` → fuentes, material base, soporte documental

### Working/
Zona viva de trabajo.

- `Working/bo/` → trabajo propio de BO. Tank no puede tocar esta carpeta.
- `Working/tank/` → trabajo propio de Tank. BO no puede tocar esta carpeta.
- `Working/shared/` → debate, coordinación, alineación, decisiones compartidas

### Approved_By_Yoha/
Solo salida final aprobada por Yoha.

## Convención de nombres

Formato oficial:

`<Tema>_<DD-MM-YY><authorid>_to_<targetid>_<status>.md`

Ejemplos:

- `Mogalef_19-03-26bo_to_tank_pending.md`
- `Runner_19-03-26tank_to_bo_review.md`

## Estados permitidos en nombre de archivo

- `pending` → abierto, en discusión o pendiente de lectura/trabajo
- `review` → ya hay acuerdo operativo y está listo para revisión/arranque
- `done` → cerrado o ejecutado
- `blocked` → atascado por falta de info, conflicto o limitación

## Cabecera obligatoria

Todo archivo-hilo debe empezar con:

```text
author_id: bo
trace_id: <id>
created_at_utc: 2026-03-19T18:22:00Z
target_agent: tank
status: pending
topic: Mogalef
```

## Estructura obligatoria del archivo-hilo

```md
author_id: bo
trace_id: <id>
created_at_utc: ...
target_agent: tank
status: pending
topic: ...

## OBJECTIVE

## CONTEXT

## AGREED_SCOPE

## OPEN_POINTS

## CONVERSATION

### [UTC timestamp] bo
...
STATUS_NOTE: pending_for_tank

### [UTC timestamp] tank
...
STATUS_NOTE: pending_for_bo

## CURRENT_DECISION

## NEXT_ACTION

## RISKS
```

## STATUS_NOTE permitidos dentro del hilo

- `pending_for_bo`
- `pending_for_tank`
- `alignment_in_progress`
- `ready_for_review`

Estos no sustituyen el estado del nombre de archivo; sirven para marcar el turno o momento de la conversación.

## Mandamientos

1. **Un tema, un hilo.** Si el tema sigue siendo el mismo, se responde en el mismo archivo.
2. **No fragmentar el debate.** No abrir múltiples archivos para una misma discusión activa.
3. **Todo turno queda escrito.** Cada intervención relevante se añade en `## CONVERSATION`.
4. **Las decisiones se consolidan.** Lo acordado debe reflejarse en `## CURRENT_DECISION`.
5. **Las dudas viven en `OPEN_POINTS`.** No dejar ambigüedades escondidas en mensajes sueltos.
6. **No renombrar por cada turno.** El archivo se mantiene en `pending` durante el debate.
7. **Solo pasar a `review` cuando exista acuerdo operativo.**
8. **Solo pasar a `done` cuando el trabajo esté cerrado o ejecutado.**
9. **Si hay atasco real, usar `blocked`.**
10. **Yoha debe poder seguir el hilo sin reconstruir contexto externo.**
11. **Working/shared/ es la mesa común.** Todo debate BO↔Tank debe vivir ahí salvo trabajo privado intermedio.
12. **Working/bo/ y Working/tank/ son zonas privadas.** Cada bot respeta la carpeta privada del otro y no la modifica.
13. **Approved_By_Yoha/ no es zona de debate.** Solo resultado final aprobado.
14. **No generar ruido.** No repetir argumentos ya resueltos, no reabrir puntos cerrados sin evidencia nueva y no abrir ramas que no aporten al objetivo.
15. **Convergencia primero.** Cuando haya acuerdo suficiente para actuar, se consolida en `CURRENT_DECISION` y se pasa a `review`; no se debate por inercia.
16. **En conflicto, manda la seguridad y la claridad.** Si falta información, no se inventa; si hay duda operativa, se elige la opción más segura y explícita.

## Regla de sincronización

- La sincronización con Notion debe ejecutarse cuando BO o Tank actúen sobre briefs/hilos/working y también por cron como respaldo.
- Trigger principal: cambio real en archivos y commit.
- Respaldo: cron periódico.

## Regla de GitHub

- Antes de cambiar, actualizar o responder en archivos del repo compartido, BO o Tank deben sincronizar con GitHub mediante `git pull`.
- Después del cambio relevante, deben hacer `git commit` y `git push`.
- `git commit` sin `git push` no cuenta como sincronización terminada.
- La versión válida para coordinación entre bots es la que quedó subida en GitHub.
- Esta regla aplica a briefs procesados, hilos respondidos, directrices modificadas y cambios operativos relevantes.

## Regla de cron

Cada ejecución de cron debe revisar en este orden:

1. `Inbox/Directivas/`
2. `Inbox/Briefs/`
3. `Working/shared/`
4. `Working/bo/` solo como continuidad interna

Reglas:

- Si la versión de una directriz relevante subió, el cron se detiene y obliga a releer antes de procesar trabajo.
- En `Inbox/Briefs/`, se buscan archivos dirigidos al bot con estado `pending`.
- En `Working/shared/`, se buscan hilos donde el bot tenga pendiente responder, revisar o consolidar.
- `Working/bo/` no es bandeja externa; solo sirve para continuidad y contexto interno.

Al detectar trabajo relevante, el bot debe:

1. leer el archivo o hilo
2. responder dentro del mismo archivo si procede
3. mantener `Working/shared/` como hilo maestro de debate
4. consolidar decisiones en `CURRENT_DECISION`
5. actualizar `NEXT_ACTION` y `OPEN_POINTS` si aplica
6. cambiar a `review` cuando se alcance acuerdo operativo real

## Regla de interacción BO ↔ Tank

- BO puede iniciar un hilo para Tank.
- Tank responde en el mismo archivo.
- BO replica en el mismo archivo.
- El ciclo continúa hasta converger.
- La convergencia se marca cuando ambos dejan el tema listo para acción o revisión.
- BO no modifica archivos dentro de `Working/tank/`.
- Tank no modifica archivos dentro de `Working/bo/`.

## Regla de turno y respuesta vigente

- El bot que tenga el turno según el último `STATUS_NOTE` debe responder en el mismo archivo-hilo dentro de `Working/shared/`.
- Nunca se interpreta un `STATUS_NOTE` histórico como estado vigente si existe uno más reciente debajo en `## CONVERSATION`.
- El estado vigente del hilo es siempre el último `STATUS_NOTE` escrito cronológicamente en la conversación.
- Cada nueva respuesta debe añadirse al final de `## CONVERSATION` con timestamp UTC y autor.
- Tras responder, el bot debe actualizar de forma coherente:
  - `STATUS_NOTE` del nuevo turno
  - `## CURRENT_DECISION`
  - `## NEXT_ACTION`
  - `## OPEN_POINTS` si cambió algo relevante
- Si el turno cambia al otro bot, debe quedar explícito con `pending_for_bo` o `pending_for_tank`.
- Si ya hay acuerdo operativo suficiente, se usa `ready_for_review`.

## Regla de visibilidad para Yoha

Todo debe quedar trazable en el propio archivo:

- quién dijo qué
- cuándo lo dijo
- qué quedó acordado
- qué falta por hacer
- en qué estado está

Yoha debe poder abrir un solo archivo y entender el estado completo del trabajo.
