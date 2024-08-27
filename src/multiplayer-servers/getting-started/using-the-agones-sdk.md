# Using the Agones SDK

Agones provides [SDKs for a series of game engines and programming languages](https://agones.dev/site/docs/guides/client-sdks/).

While the SDKs offer an array of advanced functionality, the core lifecycle is straight-forward:

## Game Server Lifecycle

### Health()

The Health() call should be called continuously as part of a regular loop in the game server software.
It functions as a heartbeat signaling if the game server is still running properly. Failing to call
Health() will lead to the game server being forcefully shutdown after a time that is configurable
in the advanced options of Armadas.

The SDKs for [Unreal Engine](https://agones.dev/site/docs/guides/client-sdks/unreal/) and
[Unity](https://agones.dev/site/docs/guides/client-sdks/unity/) automatically call the Health()
endpoint in the background.

### Ready()

Once the game server has fully started up and would be ready to accept players, the game server
has to signal the Ready() call to the SDK once.

By default, the Unreal Engine SDK automatically calls Ready() once the SDK was able to retrieve
information about the GameServer from the hosting environment (see below). While convenient,
we recommend to consider disabling this default behavior (bDisableAutoConnect) and perform this
call explicitly, as the game server might not immediately be able to accept connections.

### GameServer()

This call returns metadata about the game server, including public IP and ports. It also includes
the current state of the game server (such as Ready or Allocated).

This information can be useful to register the game server to an external server list. If a
game server is allocated from an external source, additional data about the allocation
may be transmitted through labels and annotations of the received GameServer object. This
may include the map to load for the session or the list of expected players.

The SDK also offers a way to Watch() for any changes on that data, which may be used to
wait for an allocation to happen.

### Allocate()

This call signals to the hosting environment that the game server is in use and should not
be shut down.

You generally only need to call Allocate() yourself in one of two cases:

#### 1) A notification from an external server allocation mechanism

This is required if you manually register against
[Nitrado's server allocation registry](/multiplayer-servers/multiplayer-services/server-allocation/manually-registering-game-servers.md)
or if you use an existing game hosting SDK such as Amazon GameLift. If you receive a callback
or event from this outside systems on your game server that a game session is about to start,
you have to call Allocate() so that the game session is not interrupted.

Note: Calling Allocate() does not guarantee the server to move into the allocated state. A shutdown
process might already be in progress and happen in parallel. Therefore, it is considered good
practice to watch the game server state until the state switches to Allocated, before returning
the callback or signaling the event that the game session has started.

#### 2) There is no matchmaking mechanism

If your game is based on a server list, then there is likely no mechanism in place that
can allocate the server before the first player connects. In this case, it is only possible
to call Allocate() once the first player connects. However, please note that in a scenario
like this, an empty server might be shut down while the player is picking the server
from the list.

### Shutdown()

When a match has ended or no players are connected to the server anymore, the game serve process
needs to be shutdown.

While it is possible to simply exit the game server process, it is recommended to call
Shutdown() instead. This will cause the hosting environment to properly clean up the
game server and send a termination signal to the process, which can then be used to
shut it down.

