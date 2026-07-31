# Deploy

This section covers running game servers: creating them, scaling them, and shutting them down
cleanly.

What you deploy depends on the [hosting model](/multiplayer-servers/concepts/hosting-models) you
chose. Formations and Vessels are long-lived servers you manage deliberately. ArmadaSets create
fleets that grow and shrink with player demand.

## Persistent servers

- [Vessels](/multiplayer-servers/deploy/vessels) — create and configure a single long-lived game
  server. This is also the clearest way to test a new image, whichever model you use in production.
- [Vessel states](/multiplayer-servers/deploy/vessel-states) — what each state means and what moves
  a Vessel between them.

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
