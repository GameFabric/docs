# Using the Agones SDK

Agones provides [SDKs for a series of game engines and programming languages](https://agones.dev/site/docs/guides/client-sdks/).

While the SDKs offer an array of advanced functionality, based on our experience we recommend this [Game Server Lifecycle](/multiplayer-servers/integration/game-server-lifecycle).

## `GameServer()`

This call returns metadata about the game server, including public IP and ports.
It also includes the current state of the game server (such as "Ready" or "Allocated").

This information can be useful to register the game server to an external server list.
If a game server is allocated from an external source, additional data about the allocation
may be transmitted through labels and annotations of the received GameServer object.
This may include the map to load for the session or the list of expected players.

The SDK also offers a way to `Watch()` for any changes on that data, which may be used to
wait for an allocation to happen.
