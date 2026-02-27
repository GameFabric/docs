# Sidecar Containers

A sidecar is a container that runs alongside your game server container within the same pod. Sidecars share the pod's network namespace and can access shared storage, enabling them to provide additional functionality without modifying your game server code.

Sidecar containers can be added to [Armadas](/multiplayer-servers/getting-started/glossary#armada), [ArmadaSets](/multiplayer-servers/getting-started/glossary#armadaset), [Formations](/multiplayer-servers/getting-started/glossary#formation), and [Vessels](/multiplayer-servers/getting-started/glossary#vessel).

## Available Sidecars

### Agones SDK Sidecar

The Agones SDK Sidecar (`agones-gameserver-sidecar`) is automatically added to every game server by GameFabric. It runs the REST server that enables your game server to communicate with the [Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk).

This sidecar is an integral part of GameFabric and cannot be configured or removed.

You can view the logs from the Agones SDK Sidecar in:

- **Vessel UI**: Navigate to the **Container Logs** tab and select `agones-gameserver-sidecar`
- **Monitoring stack**: Access logs through Grafana

### Allocation Sidecar

The Allocation Sidecar is provided by GameFabric for automatic integration with the [Allocator](/multiplayer-servers/getting-started/glossary#allocator). It handles:

- **Automatic registration**: Watches for your game server to reach the "Ready" state and registers it with the allocation service
- **Allocation callbacks**: Receives allocation notifications and transitions the game server to the "Allocated" state
- **Cleanup**: Removes the registration when your game server shuts down

Use the Allocation Sidecar when running session-based games with Armadas where players are assigned to servers through matchmaking.

For detailed configuration, see [Automatically Registering Game Servers](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers).

## Custom Sidecars

You can add custom sidecar containers for purposes such as:

- **Monitoring**: Collect and export game server metrics
- **Logging**: Aggregate and forward logs to external systems
- **Debugging**: Run diagnostic tools alongside your game server
- **Game-specific services**: Run additional services specific to your needs

### Adding a Custom Sidecar

1. Navigate to your Formation, Vessel, ArmadaSet, or Armada configuration
2. In the **Sidecars** section, select **Create from scratch**
3. Configure the container image, ports, environment variables, and resource limits
4. Save your changes

For UI guidance, see [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server).

## Best Practices

- **Keep sidecars lightweight**: Sidecars share resources with your game server. Minimize CPU and memory usage.
- **Use appropriate resource limits**: Set CPU and memory limits to prevent sidecars from starving your game server.
- **Handle graceful shutdown**: Ensure your sidecar responds appropriately to termination signals.
- **Consider network ports**: Sidecars share the pod's network namespace. Avoid port conflicts with your game server.
