---
title: "Deploy"
description: "This section covers running game servers: creating them, scaling them, and shutting them down cleanly."
---

# Deploy

This section covers running game servers: creating them, scaling them, and shutting them down
cleanly.

What you deploy depends on the [hosting model](/multiplayer-servers/concepts/hosting-models) you
chose. Formations and Vessels are long-lived servers you manage deliberately. ArmadaSets create
fleets that grow and shrink with player demand.

## Persistent servers

- [Vessels](/multiplayer-servers/deploy/vessels) — create and configure a single long-lived game
  server. This is also the clearest way to test a new image, whichever model you use in production.
- [Formations](/multiplayer-servers/deploy/formations) — group Vessels under one shared
  configuration, so an image change rolls out to all of them at once.
- [Vessel states](/multiplayer-servers/deploy/vessel-states) — what each state means and what moves
  a Vessel between them.

## Configuration shared by everything you deploy

- [Container configuration](/multiplayer-servers/deploy/container-configuration) — image,
  environment variables, ports, mounts, resources, sidecars, health checks and grace periods. The
  same settings apply to Vessels, Formations, Armadas and ArmadaSets.
- [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build) — roll a new image out
  to a running deployment, and roll it back when it goes wrong.

## Dynamic fleets

- [ArmadaSets](/multiplayer-servers/deploy/armadasets) — define a fleet once and have GameFabric
  create Armadas across your regions.

## Scaling

- [Scaling overview](/multiplayer-servers/deploy/scaling) — how GameFabric decides how many servers
  to run.
- [Replicas and buffer size](/multiplayer-servers/deploy/replicas-and-buffer) — keep started
  servers ready ahead of demand.
- [Scale to zero](/multiplayer-servers/deploy/scale-to-zero) — release capacity when a region is
  idle.

## Shutting things down

- [Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers) — shutdown
  hints, grace periods, and how to end sessions without dropping players.
- [Terminating ArmadaSets](/multiplayer-servers/deploy/terminating-armadasets) — remove a fleet.

## Where to go next

To confirm a deployment is behaving, see [Operate](/multiplayer-servers/operate/monitoring). To
connect a matchmaker to your fleet, see
[Server allocation](/multiplayer-servers/integrate/server-allocation/overview).
