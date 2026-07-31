---
title: "Step 3: Prepare your game server"
description: "Integrate the Agones SDK into your game server and package it as a container image that GameFabric can run."
---

# Step 3: Prepare your game server

**Goal:** integrate the Agones SDK into your game server, then package it as a container image
that runs locally.

**Before you start:** you need a game server binary compiled for `linux/amd64`, Docker installed,
and the ability to change your game server's source code.

This step has two halves. The SDK integration is what lets GameFabric manage your server's life
cycle. The container image is what GameFabric runs.

## Integrate the Agones SDK

GameFabric runs game servers with [Agones](https://agones.dev/site/docs/). Your server talks to
the platform through the Agones SDK, which is available for
[several engines and languages](https://agones.dev/site/docs/guides/client-sdks/), including
Unreal Engine and Unity.

::: info Agones version
GameFabric currently runs Agones 1.58.0. Check that your SDK version is compatible.
:::

Four calls carry almost all of the value. Add them now, not later: without them GameFabric cannot
tell whether your server is alive or in use, and may terminate it during scaling or maintenance.

### `Health()`

Call this continuously from your main loop. It is a heartbeat. If the calls stop, GameFabric
treats the server as frozen and terminates it.

The Unreal Engine and Unity SDKs call `Health()` in the background for you.

### `Ready()`

Call this once, when the server has finished starting and can accept players. Until you do,
GameFabric does not consider the server available.

The Unreal Engine SDK calls `Connect()` automatically when the SDK initializes, which polls your
server and then calls `Ready()`. Consider disabling that (`bDisableAutoConnect`) and calling
`Ready()` explicitly, so you control the moment your server declares itself available.

### `Allocate()`

Call this when a session actually starts, meaning when the first player joins or your matchmaker
tells you a session is beginning. While allocated, GameFabric will not shut the server down for
scaling or maintenance. In every other state it may.

Do not go straight from starting to allocated. A server with no players should not be allocated.

### `Shutdown()`

Call this when the match ends or the last player leaves, instead of simply exiting the process. It
lets GameFabric clean up and signal the process to stop gracefully.

For the full life cycle, including how to react to shutdown hints during maintenance, see
[Game server life cycle](/multiplayer-servers/integrate/game-server-lifecycle).

### Test the integration locally

You do not need to deploy to test the SDK calls. Agones ships a local SDK server that answers SDK
calls and logs them. See the
[Agones local development guide](https://agones.dev/site/docs/guides/client-sdks/local/).

::: tip If you cannot change your game server code
The [game server wrapper](/multiplayer-servers/configure/game-server-wrapper) runs alongside an
unmodified binary and handles some of this for you, including templating connection details into
command-line arguments. It is the right tool for engines or legacy binaries you cannot rebuild.
:::

## Build the container image

Package the binary and everything it needs into a container image.

::: warning The container runs as uid 1000
GameFabric sets `runAsUser: 1000` in the pod security context. The process runs as uid 1000
whatever your Dockerfile's `USER` instruction says, so every file your server needs must be owned
by or readable by uid 1000. Getting this wrong produces permission errors at startup.
:::

A minimal Dockerfile:

```Dockerfile
FROM ubuntu:24.04

RUN apt-get update \
        && apt-get install -y gnupg ca-certificates \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

RUN mkdir /app && chown 1000:1000 /app

USER 1000
COPY --chown=1000:1000 path/to/gameserver /app/
RUN chmod +x /app/gameserver
WORKDIR /app

CMD ["/app/gameserver"]
```

Build it, tagging it with a specific version:

```bash
docker build -t gameserver:v1.0.0 .
```

Then run it locally to confirm it starts:

```bash
docker run gameserver:v1.0.0
```

Keep the image small. Smaller images move faster between the registry and the machines that run
them, which shortens the time from scale-up to a server accepting players.

For a fuller explanation of Dockerfiles and the platform's requirements, see
[Building a container image](/multiplayer-servers/container-images/building-a-container-image).

## What you should have now

- A game server that calls `Health()`, `Ready()`, `Allocate()` and `Shutdown()`.
- A container image tagged `gameserver:v1.0.0` that starts when you run it locally.

Next: [Push your image](/multiplayer-servers/get-started/push-your-image).
