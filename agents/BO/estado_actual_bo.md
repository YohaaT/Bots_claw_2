# Estado actual BO

Fecha UTC: 2026-03-16 17:37

## WireGuard
### `which wg || echo "wireguard no instalado"`
```text
wireguard no instalado
```

### `systemctl status wg-quick@wg0 2>/dev/null || echo "wg0 no activo"`
```text
wg0 no activo
```

## Procesos OpenClaw / Python / Node
### `ps aux | grep -E "openclaw|python|node" | grep -v grep`
```text
root         970  0.0  0.0  29780 17480 ?        Ss   Mar12   0:00 /usr/bin/python3 /usr/bin/networkd-dispatcher --run-startup-triggers
root        1074  0.0  0.0 107844 19528 ?        Ssl  Mar12   0:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal
ubuntu     96056  0.1  2.4 32964836 590320 ?     Ssl  Mar13   6:52 openclaw-gateway
ubuntu    160542  0.0  0.2 748944 55732 pts/0    Sl+  17:28   0:00 openclaw
ubuntu    160549  1.3  1.1 11530108 283252 pts/0 Sl+  17:28   0:07 openclaw-tui
```

## Unidades systemd OpenClaw
### `systemctl list-units | grep openclaw`
```text
(sin coincidencias; comando devolvió exit code 1)
```

## Resumen rápido
- WireGuard no está instalado en el PATH actual.
- La interfaz `wg0` no está activa.
- OpenClaw Gateway está corriendo como proceso de usuario (`openclaw-gateway`, pid 96056).
- Hay SSH escuchando en `0.0.0.0:22` y `[::]:22`.
- Los puertos OpenClaw detectados están ligados a loopback (`127.0.0.1` / `::1`).
- IP pública observada: `79.72.62.202`.
