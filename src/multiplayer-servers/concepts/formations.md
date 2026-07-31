---
title: "Formations and Vessels"
description: "Formations are how GameFabric runs long-lived game servers that players return to. This page defines the objects and how they relate."
---

# Formations and Vessels

Formations are how GameFabric runs long-lived game servers that players return to. This page
defines the objects and how they relate. To decide whether Formations or Armadas suit your game,
start with [Hosting models](/multiplayer-servers/concepts/hosting-models).

::: info UI naming
Formations and Vessels appear under **Persistent Servers** in the GameFabric UI.
:::

## The object model

```
Formation ──defines shared config for──▶ Vessels ──each is──▶ One game server
(the server type)                        (individual, named)
```

**A Vessel** is one game server with its own identity. It has a name, a region, and configuration
you set deliberately. A Vessel exists until you delete it, and survives restarts, image updates
and migration between bare metal and cloud.

**A Formation** defines a class of Vessel: the image, ports, resource requests, config file and
secret references, and the environment variables they share. Its Vessels inherit all of that, and
can override environment variables and command-line arguments individually — which is how you give
each server a unique world seed, shard ID or server-list name.

**Standalone Vessels** are allowed. A Vessel does not have to belong to a Formation, and a
standalone one lets you set every property directly. This is the right shape for integration work
and debugging, and it is what the
[get started track](/multiplayer-servers/get-started/deploy-your-first-game-server) deploys.

## What is fixed and what is not

| Property | Changeable after creation? |
|---|---|
| Name | No |
| Region | No — clone the Vessel into another region instead |
| Image and tag | Yes |
| Environment variables, arguments | Yes |
| Resources, ports, mounts | Yes |

The region is part of a Vessel's identity because moving a running persistent world between
regions would change what players connect to. Cloning creates an identical Vessel elsewhere under
a new name.

## Scaling is manual, and that is the point

Vessels are not created or removed automatically. Player progression can be tied to a specific
Vessel, so GameFabric never decides on its own that one should disappear.

The consequence is that Formations do not react to demand through the day. Starting a Vessel takes
minutes, especially when scaling into cloud capacity. If you need capacity that follows player
numbers, use [Armadas](/multiplayer-servers/concepts/armadas).

In exchange, there is no idle capacity: you run exactly the servers you decided to run.

## States

A Vessel reports its own state, unlike Armadas which report aggregates. That per-server visibility
is why Vessels are the better tool during integration.

See [Vessel states](/multiplayer-servers/deploy/vessel-states) for the states, what moves a Vessel
between them, and how to read `status.reason`.

A Formation reports the health of its Vessels in aggregate: synced when they are all healthy,
unhealthy when one or more is degraded.

## Suspending a Vessel

A Vessel can be suspended rather than deleted. The game server stops, but the Vessel, its name,
its configuration and its [volume](/multiplayer-servers/configure/volumes) remain. Suspension is
also required before restoring a volume snapshot.

## Where to go next

- [Vessels](/multiplayer-servers/deploy/vessels) — create and configure one.
- [Vessel states](/multiplayer-servers/deploy/vessel-states) — the state reference.
- [Volumes](/multiplayer-servers/configure/volumes) — persistent storage for world data.
- [Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers) — shut one down
  cleanly.
