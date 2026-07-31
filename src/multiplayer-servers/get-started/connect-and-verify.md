---
title: "Step 7: Connect and verify"
description: "Find your game server's public address, connect a client, read its logs, and confirm health checks pass."
---

# Step 7: Connect and verify

**Goal:** connect a client to your game server and confirm the platform is managing it correctly.

**Before you start:** you need a Vessel in the RUNNING state from step 6.

A running server is not yet a verified one. Three things need to be true: you can reach it, its
logs show what you expect, and its health checks are passing.

## Find the public address

Open your Vessel and select **Details**. The details page shows the public IP address and the
public ports assigned to the server.

::: warning The public port is not your bind port
Game servers run behind network address translation. If your server binds locally to `7777`,
GameFabric may expose it publicly as `12225`. Always connect to the public port shown here, and
never advertise your local bind port to players or to an external service.
:::

## Read the address from inside the server

Your game server usually needs the public address itself, to register with Steam, Epic Online
Services or your own server browser. Query it from Agones rather than assuming it.

Using the SDK:

```go
gs, err := sdk.GameServer()
if err != nil {
    // handle error
}
address := gs.GetStatus().GetAddress()  // Public IP
ports := gs.GetStatus().GetPorts()      // Slice of {Name, Port} pairs
```

Without an SDK, query the local REST endpoint. Agones sets `AGONES_SDK_HTTP_PORT` in your
container automatically:

```http
GET http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver
```

The `status` object of the response carries `address` and `ports`.

::: warning Poll until the data arrives
The public address and ports take a moment to appear after the server starts. Poll until they are
returned before advertising the server anywhere.
:::

If your server takes connection details as command-line arguments and you cannot change its code,
the [game server wrapper](/multiplayer-servers/configure/game-server-wrapper) templates them in at
startup.

For the full reference, see
[Discovering your public address](/multiplayer-servers/integrate/your-game-server#discovering-your-public-address).

## Read the logs

The Vessel details page includes a log view. Use it to confirm your server started cleanly and
called `Ready()`.

To view logs you need read permission on `vessels/log` in the environment, which the
`default:gameserver-logs` group grants. If the log panel
is empty or refuses access, ask an administrator to add that capability to your group.

Logs from a previous instance are also available, which is how you find out why a server crashed.
See [Game server logs](/multiplayer-servers/operate/game-server-logs).

## Connect a client

Point your game client at the public IP and the public `game` port from the details page.

If the client cannot connect, the most common cause is a server bound to `127.0.0.1` rather than
`0.0.0.0`. Work through
[A client that cannot connect](/multiplayer-servers/operate/debugging#a-client-that-cannot-connect),
which covers that and the rest in order.

## Confirm health checks pass

You enabled health checks in step 6. If your `Health()` calls were not working, the server would be
marked unhealthy and terminated, so a Vessel that stays RUNNING for several minutes is a passing
health check.

Confirm it deliberately: leave the server running and watch the Vessel state. If it restarts on its
own, your `Health()` loop is not running often enough, or has stopped. Fix that now. A server that
does not heartbeat can be evicted at any moment during maintenance.

## Verify allocation, if you use it

If your server calls `Allocate()`, trigger a session and confirm the Vessel state changes to
allocated. While allocated, GameFabric will not shut the server down for scaling or maintenance.

## What you should have now

- A client connected to your game server through its public address.
- Logs showing a clean startup.
- A server that stays healthy without restarting.

Your integration works. Next: [Next steps](/multiplayer-servers/get-started/next-steps).
