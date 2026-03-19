# FASE 3 — Instalación WireGuard y generación de claves

Fecha UTC: 2026-03-16 18:41:53 UTC

## apt update + install wireguard

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Obj:1 http://es.archive.ubuntu.com/ubuntu noble InRelease
Des:2 http://es.archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]
Des:3 http://es.archive.ubuntu.com/ubuntu noble-backports InRelease [126 kB]
Obj:4 https://deb.nodesource.com/node_22.x nodistro InRelease
Des:5 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Des:6 http://es.archive.ubuntu.com/ubuntu noble-updates/main amd64 Components [177 kB]
Des:7 http://es.archive.ubuntu.com/ubuntu noble-updates/restricted amd64 Components [212 B]
Des:8 http://es.archive.ubuntu.com/ubuntu noble-updates/universe amd64 Components [386 kB]
Des:9 http://es.archive.ubuntu.com/ubuntu noble-updates/multiverse amd64 Components [940 B]
Des:10 http://es.archive.ubuntu.com/ubuntu noble-backports/main amd64 Components [7.348 B]
Des:11 http://es.archive.ubuntu.com/ubuntu noble-backports/restricted amd64 Components [216 B]
Des:12 http://es.archive.ubuntu.com/ubuntu noble-backports/universe amd64 Components [13,2 kB]
Des:13 http://es.archive.ubuntu.com/ubuntu noble-backports/multiverse amd64 Components [212 B]
Des:14 http://security.ubuntu.com/ubuntu noble-security/main amd64 Packages [1.540 kB]
Des:15 http://security.ubuntu.com/ubuntu noble-security/main Translation-en [246 kB]
Des:16 http://security.ubuntu.com/ubuntu noble-security/main amd64 Components [21,5 kB]
Des:17 http://security.ubuntu.com/ubuntu noble-security/restricted amd64 Packages [2.683 kB]
Des:18 http://security.ubuntu.com/ubuntu noble-security/restricted Translation-en [623 kB]
Des:19 http://security.ubuntu.com/ubuntu noble-security/restricted amd64 Components [212 B]
Des:20 http://security.ubuntu.com/ubuntu noble-security/universe amd64 Packages [976 kB]
Des:21 http://security.ubuntu.com/ubuntu noble-security/universe amd64 Components [74,2 kB]
Des:22 http://security.ubuntu.com/ubuntu noble-security/multiverse amd64 Components [212 B]
Descargados 7.128 kB en 2s (4.489 kB/s)
Leyendo lista de paquetes...
Creando árbol de dependencias...
Leyendo la información de estado...
Se pueden actualizar 7 paquetes. Ejecute «apt list --upgradable» para verlos.

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Leyendo lista de paquetes...
Creando árbol de dependencias...
Leyendo la información de estado...
Se instalarán los siguientes paquetes adicionales:
  wireguard-tools
Se instalarán los siguientes paquetes NUEVOS:
  wireguard wireguard-tools
0 actualizados, 2 nuevos se instalarán, 0 para eliminar y 7 no actualizados.
Se necesita descargar 92,2 kB de archivos.
Se utilizarán 345 kB de espacio de disco adicional después de esta operación.
Des:1 http://es.archive.ubuntu.com/ubuntu noble/main amd64 wireguard-tools amd64 1.0.20210914-1ubuntu4 [89,1 kB]
Des:2 http://es.archive.ubuntu.com/ubuntu noble/universe amd64 wireguard all 1.0.20210914-1ubuntu4 [3.086 B]
debconf: no se pudo inicializar la interfaz: Dialog
debconf: (La interfaz «dialog» no funcionará en un terminal tonto, un búfer de intérprete de órdenes de emacs, o sin una terminal controladora.)
debconf: probando ahora la interfaz: Readline
debconf: no se pudo inicializar la interfaz: Readline
debconf: (Esta interfaz requiere un terminal que la controle.)
debconf: probando ahora la interfaz: Teletype
dpkg-preconfigure: no puedo re-abrir stdin: 
Descargados 92,2 kB en 0s (2.736 kB/s)
Seleccionando el paquete wireguard-tools previamente no seleccionado.
(Leyendo la base de datos ... (Leyendo la base de datos ... 5%(Leyendo la base de datos ... 10%(Leyendo la base de datos ... 15%(Leyendo la base de datos ... 20%(Leyendo la base de datos ... 25%(Leyendo la base de datos ... 30%(Leyendo la base de datos ... 35%(Leyendo la base de datos ... 40%(Leyendo la base de datos ... 45%(Leyendo la base de datos ... 50%(Leyendo la base de datos ... 55%(Leyendo la base de datos ... 60%(Leyendo la base de datos ... 65%(Leyendo la base de datos ... 70%(Leyendo la base de datos ... 75%(Leyendo la base de datos ... 80%(Leyendo la base de datos ... 85%(Leyendo la base de datos ... 90%(Leyendo la base de datos ... 95%(Leyendo la base de datos ... 100%(Leyendo la base de datos ... 94449 ficheros o directorios instalados actualmente.)
Preparando para desempaquetar .../wireguard-tools_1.0.20210914-1ubuntu4_amd64.deb ...
Desempaquetando wireguard-tools (1.0.20210914-1ubuntu4) ...
Seleccionando el paquete wireguard previamente no seleccionado.
Preparando para desempaquetar .../wireguard_1.0.20210914-1ubuntu4_all.deb ...
Desempaquetando wireguard (1.0.20210914-1ubuntu4) ...
Configurando wireguard-tools (1.0.20210914-1ubuntu4) ...
wg-quick.target is a disabled or a static unit, not starting it.
Configurando wireguard (1.0.20210914-1ubuntu4) ...
Procesando disparadores para man-db (2.12.0-4build2) ...
debconf: no se pudo inicializar la interfaz: Dialog
debconf: (La interfaz «dialog» no funcionará en un terminal tonto, un búfer de intérprete de órdenes de emacs, o sin una terminal controladora.)
debconf: probando ahora la interfaz: Readline
debconf: no se pudo inicializar la interfaz: Readline
debconf: (Esta interfaz requiere un terminal que la controle.)
debconf: probando ahora la interfaz: Teletype

Running kernel seems to be up-to-date.

The processor microcode seems to be up-to-date.

Restarting services...

Service restarts being deferred:
 systemctl restart getty@tty1.service
 systemctl restart systemd-logind.service

No containers need to be restarted.

User sessions running outdated binaries:
 ytambo @ user manager service: systemd[1073]

No VM guests are running outdated hypervisor (qemu) binaries on this host.

## generar claves
RzH8gzcCfKfYY2gpanR/+T5nsaQTRwX48JuLDZ0omko=

## clave pública

## verificación archivos

## corrección post-instalación
Lectura de clave pública con sudo: OK
Clave pública: RzH8gzcCfKfYY2gpanR/+T5nsaQTRwX48JuLDZ0omko=
Guardada en /home/ytambo/.openclaw/workspace/tank_wg_pubkey.txt
