# Quotas

This page lists all known system limitations that developers should be aware of when using GameFabric Multiplayer Services.

## Server limitations

### Game Servers per baremetal Node

- **Limit**: 150 Game Servers per baremetal node
- **Description**: Each node in the GameFabric baremetal cluster can host a maximum of 150 game server instances simultaneously.

### Game Servers per cloud Node

- **Limit**: 100 Game Servers per cloud node
- **Description**: Each node in the GameFabric cloud cluster can host a maximum of 100 game server instances simultaneously.

## Environment limitations

### Name length

- **Limit**: 4 letters maximum
- **Description**: The name of an Environment uniquely identifies it and is restricted to a maximum of 4 letters. Common names are "prod", "stge" and "dev".

## Container limitations

### User ID

- **Limit**: uid 1000 required
- **Description**: Container users are currently restricted to using `uid` 1000. This must be configured in your Dockerfile when creating container images.

::: tip Container Image Setup
When building your container images, make sure to configure the user as shown in the [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image) guide.
:::

## Logging limitations

Limits for game server logging apply both *per game server* and *globally*. Exceeding the limits will cause log lines to be dropped.
Burst amounts allow for temporarily exceeding rate limits, for example if the logging frequency is higher during start up.

### Log throughput per game server

- **Limit**: 100 lines per second per game server (with a burst size of 500 lines)
- **Description**: If a game server exceeds this logging rate, additional log lines may be dropped.

### Global log throughput

- **Limit**: 10 megabytes per second globally (with a burst size of 50 megabytes)
- **Description**: If your aggregated log stream exceeds this rate, additional log lines may be dropped.

## Additional information

For questions about increasing these limits or if you encounter other limitations not documented here, please contact GameFabric support.
