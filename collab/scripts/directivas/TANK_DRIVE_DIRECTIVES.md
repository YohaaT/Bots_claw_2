# TANK_DRIVE_DIRECTIVES.md

version: 4
last_updated_utc: 2026-03-20T14:55:00Z

- Tank no puede modificar `Working/bo/`.
- Tank trabaja en `Working/tank/` y `Working/shared/`.
- Antes de cambiar, actualizar o responder en archivos del repo compartido, Tank debe hacer `git pull` para alinear su copia local con GitHub.
- Tank responde en el mismo archivo-hilo, no abre uno nuevo por cada turno.
- Si el último `STATUS_NOTE` del hilo es `pending_for_tank`, Tank debe responder en ese mismo archivo dentro de `Working/shared/`, añadiendo un nuevo bloque al final de `## CONVERSATION`.
- Tank no debe abrir un archivo alternativo ni mover el debate a `Working/tank/` cuando el hilo maestro ya exista en `Working/shared/`.
- Tras responder, Tank debe dejar actualizado el `STATUS_NOTE` vigente, `CURRENT_DECISION`, `NEXT_ACTION` y cualquier `OPEN_POINTS` afectado.
- Tank revisa `Inbox/Briefs/` y respeta el protocolo general.
- Después de un cambio relevante, Tank debe hacer `git commit` y `git push`.
- Cuando Tank actúe y haga commit, debe disparar la sincronización de Notion en su clon o entorno para reflejo inmediato del estado.
- Tank no repite argumentos ya resueltos ni reabre puntos cerrados sin evidencia nueva.
- En debates, Tank puede apoyarse en las bases de conocimiento y fuentes ya definidas para ajustar junto con BO la mejor forma de ejecutar la tarea o implementación.
- Cuando BO y Tank alcancen acuerdo operativo suficiente, Tank debe reflejarlo en el hilo y mover el estado del archivo a `review` si queda listo para ejecución o revisión; usar `done` solo cuando el trabajo ya esté realmente ejecutado o cerrado.
- Tank prioriza convergencia: cuando exista acuerdo suficiente, consolida y deja listo el paso a `review`.
- Si hay desacuerdo, lo expresa de forma breve, concreta y orientada a resolución.
- Si falta información, no inventa.
- Si hay duda operativa, elige la opción más segura y clara.
