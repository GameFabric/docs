# Armadas and ArmadaSets

Armadas are how GameFabric runs session-based games. This page defines the objects and how they
relate. To decide whether Armadas or Formations suit your game, start with
[Hosting models](/multiplayer-servers/concepts/hosting-models).

::: info UI naming
Armadas and ArmadaSets appear under **Dynamic Fleets** in the GameFabric UI.
:::

## The object model

```
ArmadaSet ──creates one per region──▶ Armada ──runs N──▶ Game servers
(one spec, many regions)              (one region)       (interchangeable)
```

**A game server** is a single running instance of your container image. In an Armada, game servers
are interchangeable: they have no individual identity you configure, and any of them can serve any
session.

**An Armada** is an auto-scaling pool of game servers in one region. It holds the image, ports,
environment variables, config file and secret references, resource requests, and the scaling
settings that decide how many servers run.

**An ArmadaSet** is a single specification that creates and maintains one Armada per region you
select. Changing the ArmadaSet propagates to every Armada it owns.

## Armada or ArmadaSet?

Use an **ArmadaSet** when the same game version and configuration should run across several
regions. This is the normal case, and it is what you should reach for by default: one edit rolls
out everywhere, and there is no drift between regions.

Use **standalone Armadas** when regions genuinely need different configuration — a different image
during a staged rollout, different resource requests for different hardware, or a region you are
testing something in.

Scaling settings are per region and per region type even inside an ArmadaSet, so needing different
capacity in different regions is not a reason to avoid an ArmadaSet.

## Scaling

Each Armada scales within bounds you set per region type:

| Setting | Meaning |
|---|---|
| Min replicas | The floor. Servers kept running even with no demand. |
| Max replicas | The ceiling. Scaling stops here even if demand continues. |
| Buffer | How many unallocated, ready servers to keep spare. |

Because region types have priorities, an Armada fills your higher-priority capacity — usually bare
metal — before spilling into lower-priority capacity such as cloud.

Only unallocated game servers are scaled down. A server serving a session is never removed by
scaling, which is why calling `Allocate()` at the right moment matters. See
[Scaling](/multiplayer-servers/deploy/scaling) and
[Replicas and buffer size](/multiplayer-servers/deploy/replicas-and-buffer).

## Allocation

An Armada keeps started servers waiting so a session can begin the instant matchmaking completes.
Binding a session to a specific server is called allocation, and it is done by your matchmaker
through the [Allocator](/multiplayer-servers/concepts/allocators).

Per-session information — the map to load, the expected player list — is passed in the allocation
request rather than through command-line arguments, because the server was started before anyone
knew what it would be used for. This is the fundamental trade of the Armada model: instant
availability, at the cost of per-server customization.

## What Armadas do not give you

- **Per-server identity.** Every server in an Armada has the same configuration. If a server needs
  its own name or arguments, you want a [Vessel](/multiplayer-servers/concepts/formations).
- **Per-server visibility.** Armadas report aggregated information about the servers inside them.
  For close inspection during integration, deploy a Vessel instead.

## Revisions

Editing an ArmadaSet creates a revision. The revision history records what changed, when, and who
changed it, and each Armada records the ArmadaSet revision it came from. Use it to confirm which
configuration a running fleet is actually on.

## Where to go next

- [ArmadaSets](/multiplayer-servers/deploy/armadasets) — create one.
- [Scaling](/multiplayer-servers/deploy/scaling) — how the replica count is decided.
- [Allocating from Armadas](/multiplayer-servers/integrate/server-allocation/allocating-from-armadas)
  — connect a matchmaker.
- [Terminating ArmadaSets](/multiplayer-servers/deploy/terminating-armadasets) — remove one.
