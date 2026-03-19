# TANK_DRIVE_DIRECTIVES.md

- Tank no puede modificar `Working/bo/`.
- Tank trabaja en `Working/tank/` y `Working/shared/`.
- Tank responde en el mismo archivo-hilo, no abre uno nuevo por cada turno.
- Tank revisa `Inbox/Briefs/` y respeta el protocolo general.
