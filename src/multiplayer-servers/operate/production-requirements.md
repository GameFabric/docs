---
title: "Production requirements"
description: "The checklist your setup must satisfy before real players arrive, covering your game server, your deployment configuration, protection and operations."
---

# Production requirements

Work through this before real players arrive. Everything here is either a hard requirement, or
something whose absence you will discover at the worst possible moment.

The first two sections are requirements. The rest are checks that catch the mistakes studios
actually make on their first launch.

## Your game server

- **The server is built for Linux `amd64`.** GameFabric's nodes are x86-64 and do not run `arm64`
  images. See
  [Building a container image](/multiplayer-servers/container-images/building-a-container-image).
- **The server calls `Ready()`** when it has finished starting. Until it does, the platform does not
  consider it available.
- **The server calls `Health()` continuously**, including while idle and while loading a map. A
  server that stops heartbeating is treated as frozen and replaced.
- **The server calls `Allocate()` when a session starts**, and only then. Allocated servers are not
  scaled down, and during maintenance they get a grace period rather than being evicted
  immediately. Servers in any other state get neither. See
  [Node maintenance eviction policy](#node-maintenance-eviction-policy).
- **The server calls `Shutdown()`** when the session ends, rather than exiting the process.
- **The server handles shutdown hints.** Observe the hint and exit before the deadline. Without
  this, a server is killed mid-match. See
  [Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers).
- **The server logs to `stdout` and `stderr`.** File-based logs are not collected. If your engine
  only writes to files, use the
  [game server wrapper](/multiplayer-servers/configure/game-server-wrapper) to tail them.
- **The server binds to `0.0.0.0`**, and reads its public address and ports from the Agones SDK
  rather than assuming them.

For implementation detail, see
[Game server lifecycle](/multiplayer-servers/integrate/game-server-lifecycle).

## Your deployment configuration

- **Health checks are enabled.** They are off by default. Calling `Health()` is not enough — the
  toggle in **Advanced & Protection** must also be on, or nothing acts on the heartbeat. See
  [Container configuration](/multiplayer-servers/deploy/container-configuration).
- **CPU and memory requests reflect real usage.** Requests are what the scheduler reserves and what
  you are billed for, not what your server consumes. Size them from observed usage under load, not
  from a guess. Undersized requests cause evictions; oversized requests cost real money. See
  [Resource management](/multiplayer-servers/configure/resource-management).
- **Termination grace periods are long enough** for your server to finish a shutdown, and short
  enough that maintenance is not blocked for hours.
- **Credentials are in secrets**, not in environment variables or baked into the image. See
  [Secrets](/multiplayer-servers/configure/secrets).
- **`autoUpdate` is set deliberately.** With it on, every push to the branch rolls out immediately.
  That is rarely what you want in production. See
  [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build).
- **Image retention policies keep enough history to roll back to.** See
  [Pushing container images](/multiplayer-servers/container-images/pushing-container-images).
- **Armadas either limit game server lifetime to 24 hours or implement shutdown hints.** Without one
  of the two, a server can be terminated at 24 hours old while a match is running. See
  [Node maintenance eviction policy](#node-maintenance-eviction-policy).

## Capacity and scaling

- **Minimum replicas and buffer are sized for your expected demand curve**, not for your load test.
  See [Replicas and buffer](/multiplayer-servers/deploy/replicas-and-buffer).
- **Maximum replicas are high enough to absorb your launch peak**, and your region has the capacity
  to reach them.
- **Region types are ordered so committed capacity fills first.** Bare metal is a fixed cost; cloud
  is charged on use. See [Regions](/multiplayer-servers/configure/regions).
- **You have tested allocation end to end**, from your matchmaker to a player connecting, in the
  environment you are launching with.

## Protection

- **Every player-facing port has a SteelShield protocol assigned**, if SteelShield is part of your
  account. An unprotected port is the one attackers find. See
  [Protocols](/multiplayer-servers/protect/protocols).
- **The mitigation matches your protocol.** A mismatch looks exactly like an outage: clients cannot
  connect and nothing appears in your logs. See
  [Mitigations](/multiplayer-servers/protect/mitigations).

## Operations

- **Someone on your team can reach the monitoring dashboards**, and has looked at them before launch
  day rather than during an incident. See [Monitoring](/multiplayer-servers/operate/monitoring).
- **Someone can read game server logs.** This needs read permission on `vessels/log` or
  `armadas/log` in the environment, which the `default:gameserver-logs` group grants. Confirm it
  now, not while debugging. See
  [Game server logs](/multiplayer-servers/operate/game-server-logs).
- **You know how to roll back.** Confirm the previous image tag still exists on the branch, and that
  whoever is on call knows how to deploy it. See
  [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build).
- **People who have left the studio no longer have access.** See
  [Getting access](/multiplayer-servers/administration/getting-access).
- **You know how to reach support.** Your Nitrado contact can review your configuration with you
  ahead of launch, and is worth using.

## Best practices

- **Keep your game server image as small as possible.** Smaller images move faster between the
  registry and the machines that run them, which shortens the time from scale-up to a server
  accepting players, and saves money over time.
- **Handle network issues gracefully.** Full network reliability is not guaranteed, and nodes can
  experience network issues. Implement retry logic for failed connections, and terminate the game
  server gracefully after repeated failures.
- **Prove your integration on a Vessel first.** A single Vessel gives per-server logs and a direct
  restart button, which makes the feedback loop far shorter than debugging inside a fleet.

## Lifecycle management

After a session ends, for example when the last player leaves, the game server should either return
to the Agones `Ready` state, if it is meant to be reused for new sessions, or shut down if it is no
longer needed.

For Armadas, either limit game server lifetime to 24 hours or implement shutdown hints. If neither
is implemented, a game server can be terminated once it is 24 hours old, including while a match is
still running.

For Formations, you must provide shutdown hints, as described in
[Container configuration](/multiplayer-servers/deploy/container-configuration#termination-grace-periods).
See [Vessel shutdown behavior](/multiplayer-servers/deploy/terminating-game-servers#vessels) for
detail.

### Node maintenance eviction policy

To maintain platform stability and security, lifecycle management guidance is enforced during node
maintenance events that require a node drain.

When a node drain is required, allocated game servers, both Armada- and Vessel-based, receive
shutdown hints and are evicted as follows:

1. **Less than 24 hours old**: the shutdown hint is set to the exact time when the game server
   reaches 24 hours of age.
1. **More than 24 hours old**: the shutdown hint is set to the current time plus one hour, giving
   the game server a one-hour grace period to exit gracefully.
1. **Eviction**: once the shutdown hint time is reached, the game server is evicted from the node
   using standard Agones shutdown procedures.

Ready or unallocated game servers are evicted immediately when the node drain starts.

This policy does not introduce a general 24-hour lifetime limit for all game servers. Eviction
occurs only when GameFabric actively drains a node, for example to apply critical security updates
or perform a required reboot.

## Where to go next

- [Monitoring](/multiplayer-servers/operate/monitoring) — what to watch once you are live.
- [Debugging game server integration](/multiplayer-servers/operate/debugging) — when something is
  wrong.
- [Billing reports](/multiplayer-servers/administration/billing-reports) — what your configuration
  costs.
