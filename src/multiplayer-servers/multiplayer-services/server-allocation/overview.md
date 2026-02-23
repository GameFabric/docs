# Server Allocation Overview

This page explains what the GameFabric Allocator is, when you need it, and how to choose the right integration approach for your game.

## What is Server Allocation?

Server allocation is the process of assigning a ready-to-use game server to a group of players. In GameFabric, the **Allocator** is an optional service that manages this process for you.

::: warning Allocator Availability
The Allocator is not included by default with GameFabric. It is an add-on service that must be ordered separately.
:::

When you use Armadas, GameFabric automatically maintains a pool of game servers that are running and ready to accept players. The Allocator acts as a broker between your matchmaker (or backend) and this pool of servers. When your matchmaker determines that a group of players should play together, it asks the Allocator for a server. The Allocator picks the best available server, notifies it that players are incoming, and returns the connection details to your matchmaker.

**Why pre-warmed servers?** Starting a game server takes time - loading assets, initializing the game world, and completing startup checks can take seconds to minutes. If servers were created on-demand after matchmaking, players would wait during this startup time. By maintaining a pool of servers that are already running and ready, the Allocator assigns a server instantly after matchmaking completes, eliminating wait time and providing a seamless player experience.

This is different from traditional server hosting where players browse a server list and choose which server to join. For that use case, see [Formations](/multiplayer-servers/architecture/identifying-your-hosting-model#formations).

## When Do You Need the Allocator?

### Use the Allocator when:

- **Your game uses matchmaking** — Players are grouped by a matchmaker (skill-based, casual, ranked) and then assigned to a server
- **Sessions are short-lived** — Matches last minutes to hours, then the server becomes available for the next group
- **Players don't choose their server** — The system decides which server players connect to
- **You need per-match configuration** — Each match requires specific settings (map, mode, player list) passed at allocation time

**Examples:** Battle royales, competitive shooters, MOBAs, party games, quick-play modes

### Skip the Allocator when:

- **Players browse a server list** — Players choose which server to join based on name, player count, or game mode
- **Servers are persistent** — The same server runs for days/weeks with player progression tied to it
- **You manage server lifecycle yourself** — Your backend creates and destroys servers directly via the GameFabric API

**Examples:** Survival games with persistent worlds, MMO servers, community-hosted servers, dedicated clan servers

### Decision Guide

| Your Game Has... | Recommended Approach |
|------------------|---------------------|
| Matchmaker assigns players to matches | Armadas + Allocator |
| Server browser / server list | Formations (Vessels) |
| Both modes (e.g., ranked + community servers) | Armadas + Allocator for ranked, Formations for community |
| Custom backend managing server lifecycle | Armadas or Formations without Allocator |

## How It Works

The allocation flow has five main steps:

```text
┌─────────────┐     ┌───────────┐     ┌─────────────┐     ┌─────────┐
│ Game Server │────▶│ Allocator │◀────│ Matchmaker  │────▶│ Players │
│  (Ready)    │     │  (Pool)   │     │  (Backend)  │     │         │
└─────────────┘     └───────────┘     └─────────────┘     └─────────┘
      │                   │                  │                  │
      │  1. Register      │                  │                  │
      │──────────────────▶│                  │                  │
      │                   │                  │                  │
      │                   │  2. Allocate     │                  │
      │                   │◀─────────────────│                  │
      │                   │                  │                  │
      │  3. Callback      │                  │                  │
      │◀──────────────────│                  │                  │
      │                   │                  │                  │
      │                   │  4. Connection   │                  │
      │                   │     Info         │                  │
      │                   │─────────────────▶│                  │
      │                   │                  │                  │
      │                   │                  │  5. Connect      │
      │◀─────────────────────────────────────────────────────────│
      │                   │                  │                  │
```

1. **Register:** When a game server starts and is ready to accept players, it registers with the Allocator and enters the pool of available servers.

2. **Allocate:** Your matchmaker calls the Allocator's `/allocate` endpoint, optionally specifying a region and custom payload (match settings, expected players, etc.).

3. **Callback:** The Allocator selects a server and sends a callback notification to it, including any payload from the matchmaker.

4. **Connection Info:** The Allocator returns the server's connection details (IP, port) to your matchmaker.

5. **Connect:** Your matchmaker sends the connection info to the players, who connect to the game server.

After the match ends, the game server shuts down, and the Armada automatically starts a new server to replace it in the pool.

## Choosing Your Integration Approach

GameFabric offers two ways to integrate with the Allocator:

### Option 1: Allocation Sidecar (Recommended)

The **Allocation Sidecar** is a container provided by Nitrado that runs alongside your game server. It handles registration, keep-alive, and allocation callbacks automatically.

**Choose this when:**
- You want the simplest integration path
- Your game server uses the Agones SDK for lifecycle management
- You don't need custom registration logic

**Your game server only needs to:**
- Call `agones.Ready()` when ready to accept players
- Watch for the "Allocated" state change
- Read the payload from annotations or a file

See [Automatically Registering Game Servers](automatically-registering-game-servers) for setup instructions.

### Option 2: Manual Integration

With manual integration, your game server code directly communicates with the Allocator's REST API.

**Choose this when:**
- You need full control over the registration process
- You have custom requirements the sidecar doesn't support
- You're integrating with an existing server framework

**Your game server needs to:**
- Register with the Allocator via HTTP
- Send keep-alive requests periodically
- Handle allocation callbacks on an HTTP endpoint
- Deregister when shutting down

See [Manually Registering Game Servers](manually-registering-game-servers) for implementation details.

### Option 3: No Allocator

You can use Armadas without the Allocator if your backend manages server selection directly.

**This is your situation when:**
- You have an existing backend that queries server state
- You want to implement custom server selection logic
- You're migrating from another platform with existing allocation code

**Your backend needs to:**
- Query Armada state via the GameFabric API
- Select servers based on your own criteria
- Communicate directly with game servers

## What's next?

- [Allocating from Armadas](allocating-from-armadas) — API details for the allocation process
- [Automatically Registering Game Servers](automatically-registering-game-servers) — Sidecar setup guide
- [Manually Registering Game Servers](manually-registering-game-servers) — Code-level integration
- [Integration Examples](integration-examples/gamelift) — GameLift and FlexMatch integration patterns
