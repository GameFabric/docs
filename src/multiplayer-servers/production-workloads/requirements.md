# Requirements and Best Practices

To ensure your players have the best possible experience with GameFabric, we recommend adhering to the following requirements and best practices.

## Requirements

The following are essential for deploying your game server on GameFabric.

* **Linux Build (Required)**: Your game server must be built for a Linux environment to be compatible with GameFabric's containerized infrastructure.
For more details on creating a compatible container, see [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image).

* **Agones SDK Integration**: Integrating the Agones SDK is crucial for your game server to communicate its state with the GameFabric platform. This includes:
    * **Ready State**: Signaling when the server is ready to accept players.
    * **Allocated State**: Signaling when the server is in use with active players. Any other state might get terminated by the system if necessary.
    * **Health Checks**: Periodically pinging to indicate the server is alive and healthy.

See [Using the Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk) for implementation details.

### Lifecycle management

#### Armadas

* After a session ends (e.g. last player leaves), either:
    * Return to `Agones Ready` if the server should be reused for new sessions, or
    * Shutdown if the server is no longer needed
* limit the max game server lifetime to 24h

#### Formations

* **Shutdown hints**: (Required for Formations) see [running your game server](/multiplayer-servers/getting-started/running-your-game-server#termination-grace-periods).
* See [Vessel Shutdown Behavior](/multiplayer-servers/getting-started/terminating-game-servers#vessels).

## Best Practices

Following these best practices will help ensure your game servers run smoothly and efficiently on GameFabric.

* **Log to stdout**: Whenever possible, configure your game server to write logs directly to the standard output (`stdout`) and standard error (`stderr`) streams. This allows for seamless integration with GameFabric's log aggregation and monitoring systems. If your server can only write to a file, use the `gswrapper` tool to tail your log files and forward them to stdout/stderr. See the section below for more details.

## Game Server Wrapper (gswrapper)

The `gswrapper` is a valuable tool for launching your game server executable within the GameFabric environment. It is production-safe and offers several features to simplify integration and improve reliability.

### Key Features

* **Parameter and Configuration Templating**: Dynamically configure your game server's command-line arguments and configuration files with runtime information from Agones, such as IP addresses and ports.
* **Log Tailing**: The wrapper can tail your game server's log files, which is useful if your server writes logs to a file instead of `stdout`.
* **Post-Stop Hooks (Advanced Crash Handling)**: You can configure executables to run after your game server stops. This is useful for tasks like analyzing core dumps for crash reporting or uploading logs for further investigation.

For more information, please refer to the [Game Server Wrapper documentation](/multiplayer-servers/multiplayer-services/game-server-wrapper) and the [gswrapper GitHub repository](https://github.com/GameFabric/gswrapper).
