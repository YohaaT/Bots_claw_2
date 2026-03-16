# Diagnóstico de red Oracle / BO

Fecha UTC: 2026-03-16 17:37

## `ip addr show`
```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000 qdisc mq state UP group default qlen 1000
    link/ether 02:00:17:00:0c:98 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.242/24 metric 100 brd 10.0.0.255 scope global enp0s6
       valid_lft forever preferred_lft forever
    inet6 fe80::17ff:fe00:c98/64 scope link 
       valid_lft forever preferred_lft forever
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:2d:5b:4d:e3 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
```

## `ss -tlnp`
```text
State     Recv-Q    Send-Q       Local Address:Port        Peer Address:Port    Process                                                                         
LISTEN    0         511              127.0.0.1:18792            0.0.0.0:*        users:(("openclaw-gatewa",pid=96056,fd=28))                                    
LISTEN    0         511              127.0.0.1:18791            0.0.0.0:*        users:(("openclaw-gatewa",pid=96056,fd=25))                                    
LISTEN    0         511              127.0.0.1:18789            0.0.0.0:*        users:(("openclaw-gatewa",pid=96056,fd=22))                                    
LISTEN    0         4096               0.0.0.0:111              0.0.0.0:*                                                                                       
LISTEN    0         128                0.0.0.0:22               0.0.0.0:*                                                                                       
LISTEN    0         4096         127.0.0.53%lo:53               0.0.0.0:*                                                                                       
LISTEN    0         4096             127.0.0.1:45437            0.0.0.0:*                                                                                       
LISTEN    0         511                  [::1]:18789               [::]:*        users:(("openclaw-gatewa",pid=96056,fd=23))                                    
LISTEN    0         4096                  [::]:111                 [::]:*                                                                                       
LISTEN    0         128                   [::]:22                  [::]:*                                                                                       
```

## `curl -s https://ifconfig.me`
```text
79.72.62.202
```
