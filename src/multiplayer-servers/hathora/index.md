# Hathora Migration Guide

This guide explains how to migrate from Hathora to GameFabric.

::: tip Related Documentation
- [Introduction to GameFabric](/multiplayer-servers/getting-started/introduction)
- [Quickstart Guide](/multiplayer-servers/getting-started/quickstart)
- [Using the Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk)
- [Server Allocation Overview](/multiplayer-servers/multiplayer-services/server-allocation/overview)
- [Glossary](/multiplayer-servers/getting-started/glossary)
:::

[[toc]]

## What GameFabric offers

- Container-native workflow (e.g., Docker) with standard container registry
- Session-based and persistent [hosting models](/multiplayer-servers/architecture/identifying-your-hosting-model)
- Global capacity across 67+ bare metal and cloud [locations](/multiplayer-servers/getting-started/glossary#location)
- Built-in DDoS protection with optional [SteelShield](/steelshield/gamefabric/introduction) upgrade
- Full observability via [Grafana, Prometheus, Loki, and Pyroscope](/multiplayer-servers/monitoring/introduction)
- [API](/multiplayer-servers/api/guide) and [Terraform](/multiplayer-servers/integration/terraform) for infrastructure as code

## Feature mapping

| Hathora Feature | GameFabric Equivalent | Value & Impact |
|-----------------|----------------------|----------------|
| Teams | Roles & Users | Granular control over permissions and access to all resources. |
| API Tokens | [Service Accounts](/multiplayer-servers/authentication/service-accounts#managing-service-accounts) | API access with fine-tuned permission control via roles. |
| Fleet | [Environments](/multiplayer-servers/getting-started/glossary#environment) + [Regions](/multiplayer-servers/getting-started/glossary#region) | Model regions with individual settings while isolating workloads. |
| Build | [Branches](/multiplayer-servers/getting-started/glossary#branch) + Images | Organize images via Branches; push directly as Docker images. |
| Application | [ArmadaSets](/multiplayer-servers/getting-started/glossary#armadaset) | The primary scaling unit for session-based games. |
| Deployment | ArmadaSet [Revision](/multiplayer-servers/getting-started/glossary#revision) | Runtime configuration versioning with rollback support. |
| Process | [Replica](/multiplayer-servers/getting-started/glossary#replica) | Individual game server instance within an ArmadaSet. |
| Room | Game Server / Allocation | Game server instances requested via the [Allocator API](/multiplayer-servers/multiplayer-services/server-allocation/overview). |
| CreateRoom API | [Allocator API](/multiplayer-servers/multiplayer-services/server-allocation/allocating-from-armadas) | Request game servers on demand with region and attribute matching. |
| Telemetry | [Grafana Stack](/multiplayer-servers/monitoring/introduction) | Prometheus metrics, Loki logs, and Pyroscope profiling with long-term retention. |

## Key architectural differences

1. **Container Registry**: GameFabric uses a standard Docker registry. Push images directly using `docker push` instead of uploading tarballs with a Dockerfile. See [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image).

2. **Game Server Lifecycle**: GameFabric uses [Agones](https://agones.dev) for game server orchestration. Integrate your game server with the Agones SDK to signal [lifecycle state](/multiplayer-servers/integration/game-server-lifecycle).

3. **Server Allocation**: GameFabric offers the [Allocator service](/multiplayer-servers/multiplayer-services/server-allocation/overview) for session-based matchmaking, or you can track game servers directly in your backend.

## Migration steps

### Prerequisites

Before starting the migration:

- GameFabric account access (you receive your organization URL during onboarding)
- Your existing game server Docker container
- Familiarity with Docker and container registries
- Understanding of the [Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk) requirements

### Step 1: Create service account

Create a [Service Account](/multiplayer-servers/authentication/service-accounts#managing-service-accounts) for programmatic API access (replaces Hathora API Tokens):

1. Navigate to **Settings > Service Accounts**
2. Create a service account for API access
3. Assign appropriate permissions
4. Store the generated credentials securely

See [Service Accounts](/multiplayer-servers/authentication/service-accounts) for details.

### Step 2: Push container images

GameFabric uses a standard Docker registry workflow.

**Create a Branch** (replaces Hathora Build organization):

1. Navigate to **Container Images > Branches**
2. Create a [Branch](/multiplayer-servers/getting-started/glossary#branch) (e.g., `production`, `development`)

**Push your container image**:

```bash
# Log in to the GameFabric registry
docker login ${REGISTRY_URL}

# Tag your existing image
docker tag your-game-server:v1.0.0 ${REGISTRY_URL}/${BRANCH}/your-game-server:v1.0.0

# Push to GameFabric
docker push ${REGISTRY_URL}/${BRANCH}/your-game-server:v1.0.0
```

GameFabric expects pre-built Docker images rather than tarballs with embedded Dockerfiles.

See [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image) and [Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images) for details.

### Step 3: Configure Environment and Regions

**Create an Environment** (replaces Hathora Application):

1. Navigate to **Multiplayer Servers > Environments**
2. Create an [Environment](/multiplayer-servers/getting-started/glossary#environment) (e.g., `production`, `staging`)

**Create Regions** (replaces Hathora Fleet regional configuration):

1. Within your Environment, create [Regions](/multiplayer-servers/getting-started/glossary#region)
2. Assign [Locations](/multiplayer-servers/getting-started/glossary#location) to each Region with priorities
3. Configure environment variables at the Region level if needed

See [Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment) for details.

### Step 4: Deploy with ArmadaSets

[ArmadaSets](/multiplayer-servers/getting-started/glossary#armadaset) are the GameFabric equivalent of Hathora's session-based deployment model.

**Create an ArmadaSet**:

1. Navigate to your Environment
2. Go to **ArmadaSets > Create ArmadaSet**
3. Configure:
   - **Name**: Identifier for the ArmadaSet
   - **Region**: Select the Region to deploy to
   - **Container Image**: Select Branch, image, and tag
   - **Ports**: Configure game server ports
   - **Resources**: Set CPU and memory limits (see [Resource Management](/multiplayer-servers/multiplayer-services/resource-management))
   - **Scaling**: Configure buffer size for ready game servers

**Scaling Configuration**:

The buffer size determines how many ready game servers are maintained.

See [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server) and [Armada Replicas and Buffer Size](/multiplayer-servers/multiplayer-services/armada-replicas-and-buffer) for details.

### Step 5: Integrate Agones SDK

GameFabric uses Agones for [game server lifecycle](/multiplayer-servers/integration/game-server-lifecycle) management.

**Agones Game Server Lifecycle**:

1. **Ready**: Call `sdk.Ready()` when the game server is fully started and can accept players.

2. **Allocated**: The game server is marked as allocated when assigned to a match. This can happen via:
   - The [Allocator service](/multiplayer-servers/multiplayer-services/server-allocation/overview) (for matchmaking)
   - Direct `sdk.Allocate()` call when the first player connects

3. **Shutdown**: Call `sdk.Shutdown()` when the session ends and all players have disconnected.

**SDK Availability**:

Agones provides SDKs for C++, C# (Unity), Go, Rust, and a REST API for any language.

See [Using the Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk) and the [Agones Client SDK documentation](https://agones.dev/site/docs/guides/client-sdks/) for details.

### Step 6: Server allocation

There are two approaches to request game servers in GameFabric:

#### Option A: GameFabric Allocator (Replaces CreateRoom API)

Use the [Allocator](/multiplayer-servers/multiplayer-services/server-allocation/overview) when:
- Your backend requests game servers on demand (like Hathora's CreateRoom)
- You need to pass unique information to each allocated game server
- You need the ping service for latency-based server selection

The Allocator requires a separate order. It includes:
- **Registry Service**: Game servers register when ready
- **Allocation Service**: Your backend requests game servers by region and attributes

Game servers can register automatically using the [Allocation Sidecar](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers) or [manually](/multiplayer-servers/multiplayer-services/server-allocation/manually-registering-game-servers).

**Allocation Request Example**:

```bash
curl -X POST https://allocator.example.com/allocate \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "europe",
    "attributes": {
      "gameMode": "ranked"
    }
  }'
```

See [Allocating from Armadas](/multiplayer-servers/multiplayer-services/server-allocation/allocating-from-armadas) for details.

#### Option B: Direct Game Server Tracking

Use direct tracking when:
- Your backend already tracks running game servers for matchmaking
- You use a server browser where players select their own server
- Game servers register themselves to an external list

In this case, game servers call `sdk.Allocate()` directly when a player connects or when selected by your matchmaker.

## Configuration

GameFabric supports four methods to pass configuration to your game server.

### Environment variables

Set at [Region](/multiplayer-servers/getting-started/glossary#region) level (shared across all game servers) or [ArmadaSet](/multiplayer-servers/getting-started/glossary#armadaset) level (specific to that ArmadaSet):

- Region-level: Regional backend endpoints, region identifiers
- ArmadaSet-level: Game mode, server type

Values can reference direct values, [Secrets](/multiplayer-servers/getting-started/secrets), config files, or pod fields (game server metadata).

### Config Files

Create configuration files in GameFabric and mount them into your game server container. See [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server) for details.

### Secrets

Store sensitive data securely using [Secrets](/multiplayer-servers/getting-started/secrets). You cannot read secrets after creation. Reference them in environment variables or mounted files.

### Command line arguments

Specify container command and arguments in the ArmadaSet configuration. If you already specify the command in your Dockerfile, GameFabric uses that unless you override it.

If your game server needs runtime values like its public IP or port passed as arguments, use the [Game Server Wrapper](/multiplayer-servers/multiplayer-services/game-server-wrapper) to template these values from Agones.

## Observability

GameFabric provides comprehensive [observability](/multiplayer-servers/monitoring/introduction) through the Grafana stack:

| Component | Purpose |
|-----------|---------|
| Grafana | Dashboards and visualization |
| Prometheus | Metrics collection and storage |
| Loki | Log aggregation |
| Pyroscope | [Continuous profiling](/multiplayer-servers/monitoring/profiling) |

The observability stack includes:
- Pre-built dashboards for game server metrics
- [Player count and distribution](/multiplayer-servers/integration/player-count-tracking) visualization
- Long-term retention policies
- Custom dashboard support

Access observability tools through the GameFabric UI under **Monitoring**.

## Contact and support

For migration assistance and onboarding support:

- **Sales and Onboarding**: Contact your GameFabric account representative
- **Technical Support**: Available through the GameFabric UI Help Center
- **Slack Integration**: Request a dedicated Slack channel for real-time collaboration
- **Status Page**: [status.gamefabric.com](https://status.gamefabric.com)

## Related documentation

- [Introduction to GameFabric](/multiplayer-servers/getting-started/introduction)
- [Quickstart Guide](/multiplayer-servers/getting-started/quickstart)
- [Hosting Models](/multiplayer-servers/architecture/identifying-your-hosting-model)
- [Game Server Lifecycle](/multiplayer-servers/integration/game-server-lifecycle)
- [Using the Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk)
- [Server Allocation Overview](/multiplayer-servers/multiplayer-services/server-allocation/overview)
- [Allocator API Reference](/api/multiplayer-servers/allocation-allocator)
- [GameFabric API Guide](/multiplayer-servers/api/guide)
- [Terraform Provider](/multiplayer-servers/integration/terraform)
- [Glossary](/multiplayer-servers/getting-started/glossary)
