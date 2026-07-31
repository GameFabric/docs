---
title: "Operate"
description: "This section covers running game servers in production: knowing what they are doing, finding out why something broke, and keeping a record of what changed."
---

# Operate

This section covers running game servers in production: knowing what they are doing, finding out
why something broke, and keeping a record of what changed.

If you are preparing for launch, start with
[Production requirements](/multiplayer-servers/operate/production-requirements). It is the
checklist your setup must satisfy before real players arrive.

## Seeing what is happening

- [Monitoring and logs](/multiplayer-servers/operate/monitoring) — the metrics GameFabric collects
  and how to reach them.
- [Dashboards](/multiplayer-servers/operate/dashboards) — prebuilt views of fleet health and
  utilization.
- [Observability tap](/multiplayer-servers/operate/observability-tap) — forward metrics and logs
  into your own observability stack.

## Finding out what went wrong

- [Game server logs](/multiplayer-servers/operate/game-server-logs) — read live logs, and logs from
  a previous instance after a crash.
- [Debugging](/multiplayer-servers/operate/debugging) — inspect a running game server, check its
  environment, and attach a debug sidecar.
- [Profiling](/multiplayer-servers/operate/profiling) — find CPU hotspots in live servers with
  continuous profiling.

## Keeping a record

- [Audit logs](/multiplayer-servers/operate/audit-logs) — who changed what, and when.
- [Audit log exports](/multiplayer-servers/operate/audit-log-exports) — ship those records to your
  own systems.

## Where to go next

For access control and account management, see
[Administration](/multiplayer-servers/administration/getting-access). For scaling behavior you may
be trying to explain, see [Scaling](/multiplayer-servers/deploy/scaling).
