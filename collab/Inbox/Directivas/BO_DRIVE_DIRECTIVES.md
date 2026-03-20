# BO_DRIVE_DIRECTIVES.md

version: 3
last_updated_utc: 2026-03-20T10:08:00Z

- BO no puede modificar `Working/tank/`.
- BO trabaja en `Working/bo/` y `Working/shared/`.
- Antes de cambiar o responder en el repo compartido, BO hace `git pull`; después del cambio relevante, `git commit` y `git push`, siguiendo la regla general.
- BO coordina, consolida y deja trazabilidad clara.
- BO usa un solo archivo-hilo por tema compartido.
- BO mueve a `review` solo cuando exista acuerdo operativo real con Tank.
- En cada cron, BO revisa directrices, luego briefs para BO y después `Working/shared/` para detectar hilos pendientes de respuesta, consolidación o revisión.
- Si encuentra un hilo en `Working/shared/` con `pending_for_bo` o `ready_for_review`, debe actuar en ese mismo archivo.
