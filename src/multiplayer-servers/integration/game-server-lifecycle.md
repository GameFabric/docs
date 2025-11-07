# Game Server Lifecycle

1. **Start:** Game server process is launched.
2. **Ready:** The server signals `Ready()` after initialization and when it is prepared to accept players.
3. **Allocated:** The server should call `Allocate()` only when the first player has joined. While in this state, the server is guaranteed not to be shut down for maintenance or scaling.
4. **Shutdown or Return to Ready:** Once the last player leaves, call `Shutdown()` (or return to `Ready` for reuse if your design requires it).

**Diagram of Game Server State Transitions:**


![life-cycle-flow.png](/multiplayer-servers/integration/life-cycle-flow.png "Flow")

> **Note:**
> Servers should not be moved directly from `Starting` to `Allocated`.
> Only enter the `Allocated` state when the server is actively serving a game session with players.


## `Health()`

The `Health()` call should be called continuously as part of a regular loop in the game server software.
It functions as a heartbeat signaling if the game server is still running properly.
Failing to call `Health()` leads to the game server being forcefully shutdown after a time that is configurable in the advanced options of Armadas.

The SDKs for [Unreal Engine](https://agones.dev/site/docs/guides/client-sdks/unreal/) and [Unity](https://agones.dev/site/docs/guides/client-sdks/unity/) automatically call the `Health()` endpoint in the background.

## `Ready()`

Once the game server has fully started up and would be ready to accept players, the game server
has to signal the `Ready()` call to the SDK once.

By default, the Unreal Engine SDK automatically calls `Connect()` upon initializing.
`Connect()` polls the game server endpoint until a successful response is received and then calls `Ready()`.
While convenient, we recommend to consider disabling this default behaviour (`bDisableAutoConnect`) and instead
performing this call explicitly (either `Connect()` or `Ready()`), as the game server might not immediately be able to accept connections.

## `Reserve()`

We currently do not recommend using Reserve.

## `Allocate()`

This call signals to the hosting environment that the game server is in use and should not be shut down.
**In any other state, the game server might be terminated at any time for scaling or other operational reasons.**

You generally only need to call `Allocate()` yourself in one of two cases:

### 1) A notification from an external server allocation mechanism

This is required if you manually register against
[Nitrado's server allocation registry](/multiplayer-servers/multiplayer-services/server-allocation/manually-registering-game-servers.md)
or if you use an existing game hosting SDK such as Amazon GameLift. If you receive a callback
or event from these outside systems on your game server that a game session is about to start,
you must call `Allocate()` to prevent the game session from being interrupted.

Note: Calling `Allocate()` does not guarantee the server to move into the allocated state.
A shutdown process might already be in progress and happen in parallel.
Therefore, it is considered good practice to watch the game server state until the state switches to Allocated,
before returning the callback or signaling the event that the game session has started.

### 2) There is no matchmaking mechanism

If your game is based on a server list, then there is likely no mechanism in place that
can allocate the server before the first player connects. In this case, it is only possible
to call `Allocate()` once the first player connects. However, please note that in such a scenario,
an empty server might be shut down while the player is picking the server from the list.

## `Shutdown()`

When a match has ended or no players are connected to the server anymore, the game server process
needs to be shutdown.

While it is possible to simply exit the game server process, it is recommended to call `Shutdown()` instead.
This causes the hosting environment to properly clean up the game server and send a termination signal to the process,
which is then used to shut it down.
