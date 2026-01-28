# Using the Agones SDK

Agones provides [SDKs for a series of game engines and programming languages](https://agones.dev/site/docs/guides/client-sdks/).

While the SDKs offer an array of advanced functionality, based on our experience we recommend following the [Game Server Lifecycle](/multiplayer-servers/integration/game-server-lifecycle).

## `GameServer()`

This function returns metadata about the game server, including public IP and ports.
It also includes the current state of the game server (such as "Ready" or "Allocated").

This information can be useful to register the game server to an external server list.
If a game server is allocated from an external source, additional data about the allocation
may be transmitted through labels and annotations of the received GameServer object.
This may include the map to load for the session or the list of expected players.

The SDK also offers a way to `Watch()` for any changes on that data, which may be used to
wait for an allocation to happen.

::: info
The IP and Port information may not immediately be available. In that case, poll the endpoint until it is returned.
:::

## Discovering Your Public Address

The public IP and ports that clients use to connect to your game server differ from the IP and ports your server binds to locally.

If your game server needs to advertise its connection information to external services (such as Steam, Epic Online Services, or a custom server browser), you must query the public address from Agones rather than using your local bind address.

### SDK

Use the `GameServer()` function to retrieve the public address and ports:

```go
// Go
gs, err := sdk.GameServer()
if err != nil {
    // handle error
}
address := gs.GetStatus().GetAddress()  // Public IP
ports := gs.GetStatus().GetPorts()      // Slice of {Name, Port} pairs
```

For example, if your server binds locally to port `7777` but GameFabric maps it to public port `12225`, the `ports` slice then contains the public port `12225`.
Use this value when registering with Steam, EOS, or any external server list.

::: warning Poll until data is available
The public IP and port information may take a moment to become available after the game server starts. Poll the `GameServer()` endpoint until the data is returned before advertising to external services.
:::

### REST API

If your game server doesn't use an Agones SDK, you can query the local REST endpoint. The `AGONES_SDK_HTTP_PORT` environment variable is automatically set in your container by Agones:

```http
GET http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver
```

The JSON response includes the public address and ports in the `status` object:

```json
{
    ...
    "status": {
        "state": "Ready",
        "address": "104.18.30.231",
        "ports": [
            {
                "name": "game",
                "port": 12225
            }
        ]
    }
}
```

### Game Server Wrapper

If your game server accepts connection information via command-line arguments or configuration files, you can use the [Game Server Wrapper](/multiplayer-servers/multiplayer-services/game-server-wrapper) to template these values at startup without modifying your game server code.

For example, passing the public port to your server:

```shell
/app/gsw -- /app/gameserver --public-port="{{ .GameServerPort }}"
```

See [Command-line Arguments](/multiplayer-servers/multiplayer-services/game-server-wrapper#command-line-arguments) for available template variables.
