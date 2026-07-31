# Integrate

This section covers the code you write: in your game server, in your backend, and in your
tooling.

## In your game server

- [Your game server](/multiplayer-servers/integrate/your-game-server) — the Agones SDK calls
  GameFabric relies on, and how to discover the public address players connect to.
- [Game server life cycle](/multiplayer-servers/integrate/game-server-lifecycle) — the states a
  server moves through, and what your server must do at each transition.
- [Agones compatibility](/multiplayer-servers/integrate/agones-compatibility) — the Agones version
  GameFabric runs and which SDKs work with it.
- [Player count tracking](/multiplayer-servers/integrate/player-count-tracking) — report player
  counts so scaling and dashboards reflect reality.

## Assigning players to servers

Allocation is how a session gets bound to a specific game server. Start with the overview, then
pick the approach that matches your architecture.

- [Server allocation overview](/multiplayer-servers/integrate/server-allocation/overview)
- [Allocating from Armadas](/multiplayer-servers/integrate/server-allocation/allocating-from-armadas)
- [Automatically registering game servers](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers)
- [Manually registering game servers](/multiplayer-servers/integrate/server-allocation/manually-registering-game-servers)

## In your own systems

- [Your infrastructure](/multiplayer-servers/integrate/your-backend) — connect GameFabric to your
  backend services.
- [Terraform provider](/multiplayer-servers/integrate/terraform) — manage GameFabric resources as
  code.

## Where to go next

The [API section](/multiplayer-servers/api/guide) documents the endpoints behind all of this. For
the concepts underneath allocation, see [Allocators](/multiplayer-servers/concepts/allocators) and
[Matchmaking](/multiplayer-servers/concepts/matchmaking).
