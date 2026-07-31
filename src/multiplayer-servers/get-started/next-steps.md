---
title: "Step 8: Next steps"
description: "Where to go after your first game server runs: scaling, allocation, monitoring, protection and going live."
---

# Step 8: Next steps

**Goal:** choose what to set up next, based on what your game needs.

**Before you start:** you need a verified game server from step 7.

The track ends here. One server runs, you can reach it, and the platform is managing it correctly.
What follows depends on your game, so pick the branches that apply rather than reading straight
through.

## Scale beyond one server

If you chose **Armadas** in step 1, this is your next step. An **ArmadaSet** creates and manages
Armadas across your regions from a single specification, so you configure one thing instead of one
per region.

- [ArmadaSets](/multiplayer-servers/deploy/armadasets) — create fleets across regions
- [Scaling](/multiplayer-servers/deploy/scaling) — how GameFabric decides how many servers to run
- [Replicas and buffer](/multiplayer-servers/deploy/replicas-and-buffer) — keep started servers
  ready ahead of demand
- [Scale to zero](/multiplayer-servers/deploy/scale-to-zero) — release capacity when a region is
  idle

If you chose **Formations**, group your Vessels into a Formation so they share one configuration.
See [Formations](/multiplayer-servers/deploy/formations).

## Connect your matchmaker

Allocation is how a session gets assigned to a specific server. Start with
[Server allocation overview](/multiplayer-servers/integrate/server-allocation/overview), then
choose an approach:

- [Allocating from Armadas](/multiplayer-servers/integrate/server-allocation/allocating-from-armadas)
  — ask GameFabric for a server from a fleet
- [Automatically registering game servers](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers)
  — use the allocation sidecar
- [Manually registering game servers](/multiplayer-servers/integrate/server-allocation/manually-registering-game-servers)
  — register from your own code

If you use a third-party matchmaker, see
[Matchmaking](/multiplayer-servers/concepts/matchmaking) and the
[integration examples](/multiplayer-servers/integrate/server-allocation/overview).

To route players to the closest region, see
[Ping services](/multiplayer-servers/concepts/ping-services).

## Configure servers properly

The track kept configuration minimal. Real deployments usually need more:

- [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build) — get your next image
  version onto a running deployment, and roll it back if it goes wrong
- [Secrets](/multiplayer-servers/configure/secrets) — credentials your server needs at runtime
- [Resource management](/multiplayer-servers/configure/resource-management) — size CPU and memory
  from real usage
- [Quotas](/multiplayer-servers/configure/quotas) — the platform limits you work within
- [Player count tracking](/multiplayer-servers/integrate/player-count-tracking) — report players
  so scaling and dashboards reflect reality

## Automate your deployments

- [API guide](/multiplayer-servers/api/guide) — drive GameFabric from your own tooling
- [Terraform](/multiplayer-servers/integrate/terraform) — manage GameFabric resources as code
- [Programmatic access](/multiplayer-servers/integrate/programmatic-access) — drive GameFabric
  from your own services and pipelines

Use the service account from step 2 for all of these.

## Watch it in production

- [Monitoring](/multiplayer-servers/operate/monitoring) and
  [Dashboards](/multiplayer-servers/operate/dashboards) — metrics and prebuilt views
- [Game server logs](/multiplayer-servers/operate/game-server-logs)
- [Profiling](/multiplayer-servers/operate/profiling) — find CPU hotspots in live servers
- [Audit logs](/multiplayer-servers/operate/audit-logs) — who changed what

## Protect your servers

SteelShield filters traffic before it reaches your game servers.

- [Protocols](/multiplayer-servers/protect/protocols)
- [Gateway policies](/multiplayer-servers/protect/gateway-policies)

## Before you go live

Read [Production requirements](/multiplayer-servers/operate/production-requirements). It is the
checklist your setup must satisfy before real players arrive, and it is short.

Your Nitrado contact can review your configuration with you ahead of launch.
