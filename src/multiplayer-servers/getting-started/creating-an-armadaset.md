# Creating an ArmadaSet

In this section, you will learn how to create an ArmadaSet for session-based or match-based game servers.

::: tip Understanding Hosting Models
ArmadaSets are designed for session-based games where a matchmaker allocates game servers on demand. If your game uses persistent servers or server browsers, consider using [Formations and Vessels](/multiplayer-servers/getting-started/running-your-game-server) instead. See the [hosting models guide](/multiplayer-servers/architecture/identifying-your-hosting-model) for more details.
:::

## Prerequisites

Before proceeding, make sure you have the following:

* User credentials to access your GameFabric UI and environment of choice
* A container image that has been [pushed to a branch in the registry](/multiplayer-servers/getting-started/pushing-container-images)
* Basic understanding of [Agones SDK integration](/multiplayer-servers/getting-started/using-the-agones-sdk) for proper game server lifecycle

Log into the GameFabric UI before proceeding.

## Create an ArmadaSet

Choose an [environment](/multiplayer-servers/getting-started/setup-your-environment) for your ArmadaSet, then navigate to the "Armadas" section in the UI and click "Create ArmadaSet" to begin.

### General

Specify a unique name for your ArmadaSet. You can also add a description to help identify its purpose.

<!-- TODO: Add screenshot - GUI_Create_ArmadaSet_General -->

### Regions

The Regions step is where you configure scaling for your ArmadaSet. Unlike Vessels, which run in a single region, ArmadaSets automatically create an Armada in each configured region.

For each Region-Type, configure the following:

| Setting | Description |
|---------|-------------|
| **Min Replicas** | The minimum number of game server replicas to maintain, even when there is no demand. |
| **Max Replicas** | The maximum number of game server replicas that can be scaled up to meet demand. |
| **Buffer** | The number of unallocated (ready) game servers to keep available for incoming allocation requests. |

<!-- TODO: Add screenshot - GUI_Create_ArmadaSet_Regions -->

::: tip Scaling Configuration
For detailed guidance on configuring replicas and buffer size, including examples and best practices, see the [Armada Replicas and Buffer Size](/multiplayer-servers/multiplayer-services/armada-replicas-and-buffer) guide.
:::

### Volumes

Volumes allow you to share data between multiple containers within the same pod. This is an advanced feature that can be skipped for most initial setups.

### Containers

The Containers section defines your game server configuration. This includes the container image, environment variables, ports, commands, ConfigFiles, resources, and sidecars.

The configuration options are identical to those for Vessels. For detailed explanations of each setting, see the [Containers section](/multiplayer-servers/getting-started/running-your-game-server#containers) in the Vessel guide.

Key configuration areas:

* **Image**: Select the container image from your branch
* **Environment variables**: Define static key/value pairs or expose pod metadata
* **Ports**: Configure dynamic or passthrough ports for game traffic
* **Command and arguments**: Override the container's default command if needed
* **ConfigFiles**: Mount configuration files into your container
* **Resources**: Set CPU and memory requests and limits
* **Sidecars**: Add additional containers (e.g., Allocator sidecar)

::: info Allocator Sidecar
For session-based games using the Allocator service, you will typically add an Allocator sidecar container. See the [Server Allocation Overview](/multiplayer-servers/multiplayer-services/server-allocation/overview) for details on when this is required.
:::

### Advanced

The Advanced section contains options for profiling, health checks, and termination grace periods. These settings work the same way as for Vessels.

For detailed explanations, see the [Advanced options section](/multiplayer-servers/getting-started/running-your-game-server#advanced-options) in the Vessel guide.

Key settings:

* **Profiling**: Enable eBPF-based CPU performance profiling
* **Health checks**: Configure thresholds for game server health monitoring
* **Termination grace periods**: Set time limits for graceful shutdown during maintenance, spec changes, or user-initiated terminations

::: warning Health Checks
Health checks are disabled by default for initial testing. For production, enable health checks to ensure unresponsive game servers are automatically detected and cleaned up.
:::

## Visualize and configure

After creating the ArmadaSet, it will appear in the ArmadaSets section of the UI. The ArmadaSet automatically creates an Armada for each configured region.

<!-- TODO: Add screenshot - GUI_ArmadaSet_List -->

Click on an ArmadaSet to view its details, including:

* The Armadas created in each region
* Current replica counts and allocation status
* Configuration details and revision history

You can also view individual Armadas to see aggregated information about the game servers within them.

## Next steps

Now that your ArmadaSet is running, you can:

* **Set up server allocation**: Learn how to allocate game servers from your Armadas in the [Server Allocation Overview](/multiplayer-servers/multiplayer-services/server-allocation/overview) and [Allocating from Armadas](/multiplayer-servers/multiplayer-services/server-allocation/allocating-from-armadas) guides
* **Configure scaling**: Fine-tune your replicas and buffer settings using the [Armada Replicas and Buffer Size](/multiplayer-servers/multiplayer-services/armada-replicas-and-buffer) guide
* **Manage lifecycle**: Learn how to terminate ArmadaSets in the [Terminating ArmadaSets](/multiplayer-servers/getting-started/terminating-armadasets) guide
