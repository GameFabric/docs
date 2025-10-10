# Manually Registering Game Servers

This guide describes the steps to take to integrate GameFabric Allocator within your game.
The steps described here are in contrast to the [Allocator Sidecar](automatically-registering-game-servers.md) feature that performs these actions automatically for simple use cases.

::: tip Alternative Approach
For simpler use cases, consider using the [Allocation Sidecar](automatically-registering-game-servers) which automates the registration and allocation process.
:::

## Pre-requisites

In order to integrate with our Allocator, your game needs to meet the following requirements.

1. Be able to send outgoing HTTP requests to the allocator registry.
2. If the game server needs to be notified about allocations, be able to bind a port on which to listen for an HTTP callback.
3. Have integrated the [Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk) for game server lifecycle management.

::: tip API Documentation
For detailed API specifications, see:

- [Allocator API](/api/multiplayer-servers/allocation-allocator) for allocation endpoints
- [Registry API](/api/multiplayer-servers/allocation-registry) for registration endpoints
:::

## Guide

### Authentication

To access both the Allocator service and the Registry service, you need to specify authentication tokens as part of
the `Authorization` header in the requests you send in the following guide.
Note that this is different to the protection of your own allocation callback endpoint.

These tokens are provided by Nitrado.

### Setting up an allocation callback endpoint

An optional, but recommended callback mechanism exists to notify the game server about the allocation.

In addition to ensuring that the game server is still online at the moment of allocation, this callback allows the
transmission of session metadata before players connect, such as game mode, map, or the list of expected players.

To support callbacks, your server needs to listen for incoming HTTP queries on an endpoint of your choosing.
That endpoint must be stopped when the server becomes allocated.
This is what is later referred to as the callback endpoint.

It is heavily recommended to protect this endpoint using bearer token authentication.
The token you use should be unique and unpredictable (ideally UUID v1) for each game server, and sent as part of the register request to
inform the Allocator of which token it should use to allocate this server.

The purpose of this mechanism is both to protect your endpoint against potential attackers that might want to trigger
false allocations to disturb your game servers, and to differentiate game servers that crashed, since a new server might
replace a crashed one with the same IP and port combination.

### Registering

Once your game server is ready, you need to query the Allocator Registry in order to enter the list of allocatable game servers.

#### Knowing the address and port of your server

Since Agones picks a site and potentially dynamic ports as well for your game servers, knowing the address and port to
specify when sending your registration request requires querying the Agones SDK.

Here is an example of how it would be done in Go:

```go
gs, _ = client.GetGameServer(ctx, &sdk.Empty{})
addr := gs.GetStatus().GetAddress()
ports := gs.GetStatus().GetPorts()
```

#### Querying the registration endpoint

Now, your server can make an HTTP POST request to the [/servers/](https://nitrado.gitlab.io/b2b/allocator/allocator/latest/registry.html)
endpoint of the Registry server.

The request body should follow this structure.
Note that only the `address` and `priority` fields are required.
The `attributes` object is useful for filtering later, since you will be able to make requests to allocate servers
that match specific attributes.
You should also fill the `callback` object with the URL to your allocation callback endpoint.

```json
{
  "address": "1.2.3.4:1234",
  "attributes": {
    "environment": "production"
  },
  "callback": {
    "token": "3a1sd321ad5ad5a4d5a24d3sa5d4as",
    "url": "1.2.3.4:3999/allocate"
  },
  "ports": {
    "game": 5000,
    "alloc": 3999
  },
  "priority": 0,
  "region": "eu-west",
  "timeout": 60
}
```

### Keep-Alive

When registering with the registry, your server is kept in the list of available servers for a limited duration only.
Therefore, you need to send keep-alive requests regularly to remain allocatable.

Once your server is registered, you should start some kind of routine that sends a POST request to the `/servers/{addr}/keepalive` URL with the following body:

```json
{
  "timeout": 60
}
```

You should then stop sending those requests once you receive a request on the allocation callback endpoint.

#### Error Cases

##### Keep-Alive: `404 Not Found`

In the event that your Keep-Alive request receives a `404` response, this typically means that the game server was removed from the registry as a result of an allocation.

If you use the callback mechanism, and you have not received a callback, then it is highly likely that the callback failed and the game server was not served to players.
In this scenario you should either:

* Shut down your server and start a new one.
* Register again with your current game server, and start a new keep-alive routine instead of the old one.

If you do not use the callback mechanism, a successful allocation might have happened and players are in the process of connecting to your server.
You should:

* Stop sending Keep-Alive requests
* Start a timer for the expected duration for players to connect
* If no players connected after the timer has ended, treat it like a failed allocation as explained above (i.e. shut down or re-register)

##### Game server stops

If your game server needs to stop for any reason (including crashes), you need to make sure to deregister it from the registry service before your process exits.
