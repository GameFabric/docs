# Unity on GameFabric

## Introduction

This guide covers how to run a Unity Dedicated Server on GameFabric with Agones lifecycle integration. It applies to any Unity networking SDK (Photon Fusion, Mirror, Netcode for GameObjects, FishNet, etc.).

::: tip Related Documentation

- [Game Server Lifecycle](/multiplayer-servers/integration/game-server-lifecycle)
- [Using the Agones SDK](/multiplayer-servers/integration/your-game-server)
- [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image)

:::

## Agones SDK for Unity

The Agones Unity SDK is available as a Unity Package Manager (UPM) dependency. Add it to your project's `Packages/manifest.json`:

```json
{
  "dependencies": {
    "com.googleforgames.agones": "https://github.com/agones-dev/agones.git?path=/sdks/unity#v1.59.0",
    ...
  }
}
```

::: warning Version pinning
Always pin the Agones SDK to a specific version tag (e.g. `#v1.59.0`). Without a version pin, Unity will pull the latest commit from the main branch, which may introduce breaking changes.
:::

The SDK provides the `AgonesSdk` MonoBehaviour with the following async methods:

| Method | Returns | Purpose |
| ------ | ------- | ------- |
| `Ready()` | `Task<bool>` | Signal that the server is ready to accept players |
| `Allocate()` | `Task<bool>` | Signal that the server is actively serving a game session |
| `Shutdown()` | `Task<bool>` | Signal that the server should be shut down |
| `Health()` | — | Automatic heartbeat (runs in background) |

## Agones Lifecycle in C\#

The Agones SDK automatically calls `Health()` in the background once the `AgonesSdk` component is active. You only need to call `Ready()`, `Allocate()`, and `Shutdown()` explicitly.

A typical lifecycle implementation:

```csharp
using Agones;
using UnityEngine;
using System.Threading.Tasks;

public class GameServerLifecycle : MonoBehaviour
{
    private AgonesSdk _agones;
    private int _playerCount = 0;

    private async void Start()
    {
        if (!Application.isBatchMode) return; // Only run on dedicated server

        _agones = gameObject.AddComponent<AgonesSdk>();

        // ... initialize your networking SDK here ...

        bool ready = await _agones.Ready();
        if (!ready)
        {
            // If Ready() fails, the Agones sidecar is unreachable.
            // The server cannot participate in the fleet lifecycle,
            // so we quit and let the platform restart this instance.
            Application.Quit();
            return;
        }
    }

    // Call this from your networking SDK's player joined callback
    public async Task OnPlayerConnected()
    {
        _playerCount++;

        if (_playerCount == 1)
            // Signal to GameFabric that this server is actively hosting a session.
            // While allocated, the server is protected from being shut down
            // for scaling or maintenance.
            await _agones.Allocate();
    }

    // Call this from your networking SDK's player left callback
    public async Task OnPlayerDisconnected()
    {
        _playerCount--;

        if (_playerCount <= 0)
        {
            // No players remaining — signal to GameFabric that the server
            // is done and can be removed from the fleet.
            await _agones.Shutdown();
            Application.Quit();
        }
    }
}
```

This follows the standard [Game Server Lifecycle](/multiplayer-servers/integration/game-server-lifecycle):

1. **Ready** — after initialization, when the server can accept players
2. **Allocated** — when the first player joins (server is protected from scaling/maintenance)
3. **Shutdown** — when the last player leaves

## Unity Dedicated Server Build

Unity 6 and Unity 2022.3+ support the **Dedicated Server** build target, which produces a headless Linux binary:

1. Install the **Dedicated Server Build Support (Linux)** module via Unity Hub
2. In Unity: **File → Build Profiles → Dedicated Server → Linux**
3. Click **Build**

The output is:
- `server.x86_64` — launcher binary
- `server_Data/` — game assets and compiled scripts
- `UnityPlayer.so` — Unity runtime library

## Container Image

::: warning Container user
GameFabric enforces uid 1000 via the Kubernetes pod security context (`runAsUser: 1000`). Ensure all files are owned by uid 1000. See [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image) for details.
:::

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libglib2.0-0 ca-certificates libssl3 && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir /app && chown 1000:1000 /app
USER 1000
WORKDIR /app

COPY --chown=1000:1000 server.x86_64 .
COPY --chown=1000:1000 UnityPlayer.so .
COPY --chown=1000:1000 server_Data/ ./server_Data/
RUN chmod +x /app/server.x86_64

ENTRYPOINT ["/app/server.x86_64", "-batchmode", "-nographics"]
```

Build and push:

```bash
docker build -t <registry>/my-game-server:<tag> .
docker push <registry>/my-game-server:<tag>
```
