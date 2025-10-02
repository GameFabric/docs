# Quotas

This page lists all known system limitations that developers should be aware of when using GameFabric Multiplayer Services.

## Server Limitations

### Game Servers per baremetal Node

- **Limit**: 150 Game Servers per baremetal node
- **Description**: Each node in the GameFabric baremetal cluster can host a maximum of 150 game server instances simultaneously.

### Game Servers per cloud Node

- **Limit**: 100 Game Servers per cloud node
- **Description**: Each node in the GameFabric cloud cluster can host a maximum of 100 game server instances simultaneously.

## Environment Limitations

### Name Length

- **Limit**: 4 letters maximum
- **Description**: The name of an Environment uniquely identifies it and is restricted to a maximum of 4 letters. Common names are "prod", "stge" and "dev".

## Container Limitations

### User ID

- **Limit**: uid 1000 required
- **Description**: Container users are currently restricted to using `uid` 1000. This must be configured in your Dockerfile when creating container images.

## Additional Information

For questions about increasing these limits or if you encounter other limitations not documented here, please contact GameFabric support.
