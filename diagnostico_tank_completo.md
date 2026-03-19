# FASE 1 — Diagnóstico del sistema

Fecha UTC: 2026-03-16 18:41:33 UTC

## systemctl list-units --failed
  UNIT LOAD ACTIVE SUB DESCRIPTION

0 loaded units listed.

## journalctl -xe --no-pager | tail -40
mar 16 18:37:22 old-tank node[10157]: 2026-03-16T18:37:22.621+00:00 [browser/server] Browser control listening on http://127.0.0.1:18791/ (auth=token)
mar 16 18:37:22 old-tank node[10157]: 2026-03-16T18:37:22.789+00:00 [telegram] [default] starting provider (@B_Oraclebot)
mar 16 18:37:22 old-tank node[10157]: 2026-03-16T18:37:22.808+00:00 [telegram] autoSelectFamily=true (default-node22)
mar 16 18:37:22 old-tank node[10157]: 2026-03-16T18:37:22.814+00:00 [telegram] global undici dispatcher autoSelectFamily=true
mar 16 18:37:22 old-tank node[10157]: 2026-03-16T18:37:22.818+00:00 [telegram] dnsResultOrder=ipv4first (default-node22)
mar 16 18:37:30 old-tank node[10157]: 2026-03-16T18:37:30.456+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 2.05s.
mar 16 18:38:06 old-tank node[10157]: 2026-03-16T18:38:06.279+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 4.27s.
mar 16 18:38:41 old-tank node[10157]: 2026-03-16T18:38:41.417+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 7.27s.
mar 16 18:38:51 old-tank node[10157]: 2026-03-16T18:38:51.684+00:00 [reload] config change detected; evaluating reload (meta.lastTouchedAt, agents.defaults.memorySearch)
mar 16 18:38:51 old-tank node[10157]: 2026-03-16T18:38:51.693+00:00 [reload] config change applied (dynamic reads: meta.lastTouchedAt, agents.defaults.memorySearch)
mar 16 18:39:12 old-tank node[10157]: 2026-03-16T18:39:12.571+00:00 [reload] config change detected; evaluating reload (meta.lastTouchedAt, tools.elevated.allowFrom.webchat)
mar 16 18:39:12 old-tank node[10157]: 2026-03-16T18:39:12.578+00:00 [reload] config change applied (dynamic reads: meta.lastTouchedAt, tools.elevated.allowFrom.webchat)
mar 16 18:39:19 old-tank node[10157]: 2026-03-16T18:39:19.502+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 13.52s.
mar 16 18:39:30 old-tank node[10157]: 2026-03-16T18:39:30.924+00:00 [ws] ⇄ res ✓ channels.status 188ms conn=e64dd252…3cf5 id=11829db7…de4e
mar 16 18:40:03 old-tank node[10157]: 2026-03-16T18:40:03.645+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 23.67s.
mar 16 18:40:22 old-tank systemd[1]: Starting sysstat-collect.service - system activity accounting tool...
░░ Subject: A start job for unit sysstat-collect.service has begun execution
░░ Defined-By: systemd
░░ Support: http://www.ubuntu.com/support
░░ 
░░ A start job for unit sysstat-collect.service has begun execution.
░░ 
░░ The job identifier is 11135.
mar 16 18:40:22 old-tank systemd[1]: sysstat-collect.service: Deactivated successfully.
░░ Subject: Unit succeeded
░░ Defined-By: systemd
░░ Support: http://www.ubuntu.com/support
░░ 
░░ The unit sysstat-collect.service has successfully entered the 'dead' state.
mar 16 18:40:22 old-tank systemd[1]: Finished sysstat-collect.service - system activity accounting tool.
░░ Subject: A start job for unit sysstat-collect.service has finished successfully
░░ Defined-By: systemd
░░ Support: http://www.ubuntu.com/support
░░ 
░░ A start job for unit sysstat-collect.service has finished successfully.
░░ 
░░ The job identifier is 11135.
mar 16 18:40:58 old-tank node[10157]: 2026-03-16T18:40:58.175+00:00 [telegram] getUpdates conflict: Call to 'getUpdates' failed! (409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running); retrying in 30s.
mar 16 18:41:07 old-tank node[10157]: 2026-03-16T18:41:07.347+00:00 [ws] ⇄ res ✓ chat.history 60ms conn=06f17828…e18f id=22623489…3dcf
mar 16 18:41:12 old-tank node[10157]: 2026-03-16T18:41:12.758+00:00 [tools] agents.botsito.tools.allow allowlist contains unknown entries (apply_patch). These entries won't match any tool unless the plugin is enabled.

## ip addr show && ip route
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: eno1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether d4:be:d9:31:ac:7e brd ff:ff:ff:ff:ff:ff
    altname enp0s25
    inet 192.168.1.162/24 brd 192.168.1.255 scope global eno1
       valid_lft forever preferred_lft forever
    inet6 fe80::d6be:d9ff:fe31:ac7e/64 scope link 
       valid_lft forever preferred_lft forever
3: wlp3s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 8c:70:5a:38:24:9a brd ff:ff:ff:ff:ff:ff
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 8a:04:00:54:65:70 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
default via 192.168.1.1 dev eno1 proto static 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown 
192.168.1.0/24 dev eno1 proto kernel scope link src 192.168.1.162 

## ss -tlnp
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess                                     
LISTEN 0      4096       127.0.0.1:35359      0.0.0.0:*                                               
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*                                               
LISTEN 0      511        127.0.0.1:18789      0.0.0.0:*    users:(("openclaw-gatewa",pid=10157,fd=22))
LISTEN 0      511        127.0.0.1:18791      0.0.0.0:*    users:(("openclaw-gatewa",pid=10157,fd=25))
LISTEN 0      511        127.0.0.1:18792      0.0.0.0:*    users:(("openclaw-gatewa",pid=10157,fd=28))
LISTEN 0      4096      127.0.0.54:53         0.0.0.0:*                                               
LISTEN 0      4096   127.0.0.53%lo:53         0.0.0.0:*                                               
LISTEN 0      4096            [::]:22            [::]:*                                               
LISTEN 0      511            [::1]:18789         [::]:*    users:(("openclaw-gatewa",pid=10157,fd=23))

## sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere                  
22/tcp (v6)                ALLOW IN    Anywhere (v6)             


## lscpu | grep -E "CPU|Core|Model"
CPU op-mode(s):                          32-bit, 64-bit
CPU(s):                                  8
On-line CPU(s) list:                     0-7
Model name:                              Intel(R) Core(TM) i7-2760QM CPU @ 2.40GHz
CPU family:                              6
Model:                                   42
Core(s) per socket:                      4
CPU(s) scaling MHz:                      75%
CPU max MHz:                             3500,0000
CPU min MHz:                             800,0000
NUMA node0 CPU(s):                       0-7
Vulnerability Mds:                       Mitigation; Clear CPU buffers; SMT vulnerable

## free -h && df -h /
               total        used        free      shared  buff/cache   available
Mem:           3,7Gi       1,2Gi       1,4Gi       1,5Mi       1,4Gi       2,5Gi
Swap:          3,7Gi          0B       3,7Gi
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       292G  9,5G  268G   4% /

## python3 --version
Python 3.12.3

## docker --version
Docker version 28.2.2, build 28.2.2-0ubuntu1~24.04.1
