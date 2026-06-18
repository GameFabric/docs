# Requirements and best practices

To ensure your players have the best possible experience with GameFabric, we recommend adhering to the following requirements and best practices.

## Requirements

The following are essential for deploying your game server on GameFabric.

### Server requirements

* **Linux Build**: Your game server must be built for a Linux environment (`amd64`) to be compatible with GameFabric's containerized infrastructure.
For more details on creating a compatible container, see [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image).

* **Agones SDK Integration**: Integrating the Agones SDK is crucial for your game server to communicate its state with the GameFabric platform. This includes:
    * **Ready State**: Signaling when the server is ready to accept players.
    * **Allocated State**: Signaling when the server is in use with active players. Any other state might get terminated by the system if necessary.
    * **Health Checks**: Periodically pinging to indicate the server is alive and healthy.

See [Using the Agones SDK](/multiplayer-servers/integration/your-game-server) for implementation details.

### Lifecycle management

#### Armadas

After a session ends (for example, when the last player leaves), the game server should either return to an `Agones Ready` state if it's meant to be reused for new sessions, or shut down if it's no longer needed.

For Armadas, we strongly recommend that you either limit game server lifetime to 24 hours or implement shutdown hints in your game server.

If neither is implemented, a game server can be terminated once it is 24 hours old, including while a match is still running.

#### Formations

For Formations, you must provide shutdown hints as described in [running your game server](/multiplayer-servers/getting-started/running-your-game-server#termination-grace-periods).

Refer to [Vessel Shutdown Behavior](/multiplayer-servers/getting-started/terminating-game-servers#vessels) for additional details.

#### Node maintenance eviction policy

To maintain platform stability and security, lifecycle management guidance is enforced during node maintenance events that require node drain.

When node drain is required, Allocated game servers (both Armada- and Vessel-based) receive shutdown hints and are evicted according to the following behavior:

1. **Less than 24 hours old**: The shutdown hint is set to the exact time when the game server reaches 24 hours of age.
1. **More than 24 hours old**: The shutdown hint is set to current time + 1 hour, giving the game server a 1-hour grace period to exit gracefully.
1. **Eviction procedure**: After the shutdown hint time is reached, the game server is evicted from the node using standard Agones shutdown procedures.

Ready or unallocated game servers are evicted immediately when node drain starts.

This policy does not introduce a general 24-hour lifetime limit for all game servers. Eviction occurs only when GameFabric actively drains a node, for example to apply critical security updates or perform required reboots.

## Best practices

* **Keep your game server image as small as possible**: A small game server image makes everything faster and also saves money in the long run.

* **Log to stdout**: Whenever possible, configure your game server to write logs directly to the standard output (`stdout`) and standard error (`stderr`) streams. This allows for seamless integration with GameFabric's log aggregation and monitoring systems. If your server can only write to a file, use the [Game Server Wrapper](/multiplayer-servers/multiplayer-services/game-server-wrapper) to tail your log files and forward them to stdout/stderr.

* **Handle network issues gracefully**: Full network reliability is not guaranteed; nodes can occasionally experience network issues. Implement retry logic for failed connections and gracefully terminate the game server after multiple connection attempts fail.
