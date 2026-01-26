# Quickstart

Get your first game server running on GameFabric in minutes.

::: warning Trial and Testing Only
This quickstart guide is intended for trials and quick evaluations. For production workloads, follow the complete setup guides covering authentication, capacity planning, and proper Agones SDK integration.
:::

## Prerequisites

- Access to your GameFabric installation via the URL provided during onboarding
- A game server binary ready for containerization (see [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image))
- [Docker](https://docs.docker.com/engine/install/) installed to build and push container images

## Steps

### 1. Create a Branch

A [Branch](/multiplayer-servers/getting-started/glossary#branch) stores your container images and organizes them into separate tracks. In a typical setup, you might have one Branch for development builds and another for production.

Create a Branch in the GameFabric UI under **Container Images > Branches**.

[Detailed guide: Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)

### 2. Build your container image

Package your game server into a Docker container. A minimal Dockerfile might look like:

```Dockerfile
FROM ubuntu:22.04

# Create a non-root user with uid 1000 as required by GameFabric
RUN groupadd -g 1000 game && useradd -u 1000 -g 1000 -m game

COPY gameserver /app/gameserver
RUN chown 1000:1000 /app/gameserver

USER 1000
CMD ["/app/gameserver"]
```

Build the image:

```bash
docker build -t gameserver:v1.0.0 .
```

[Detailed guide: Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image)

### 3. Push your container image

Tag and push the container image to your Branch:

```bash
docker tag gameserver:v1.0.0 ${URL}/${BRANCH}/gameserver:v1.0.0
docker push ${URL}/${BRANCH}/gameserver:v1.0.0
```

Replace `${URL}` with your GameFabric registry URL and `${BRANCH}` with your Branch name.

[Detailed guide: Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)

### 4. Create an Environment

An [Environment](/multiplayer-servers/getting-started/glossary#environment) isolates groups of resources, ensuring they don't interfere with each other. This allows you to manage capacity and access control separately for each Environment.

Create an Environment in the GameFabric UI under **Multiplayer Servers > Environments**.

[Detailed guide: Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment)

### 5. Create a Region

A [Region](/multiplayer-servers/getting-started/glossary#region) groups one or more [Locations](/multiplayer-servers/getting-started/glossary#location) where your game servers can run. You can assign priorities to Locations within a Region to control which Locations are filled first.

Create a Region within your Environment in the GameFabric UI.

[Detailed guide: Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment#create-a-region)

### 6. Create a Vessel

Deploy your game server as a Vessel. For quick testing without Agones SDK integration, disable health checks.

[Detailed guide: Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server)

::: tip Testing without Agones SDK
When testing without Agones SDK integration, set the health check to "Disabled" in the Advanced section. This allows the game server to run without calling SDK health check methods.
:::

## What's next?

- [Using the Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk) - Integrate proper health checks and lifecycle management
- [Hosting Models](/multiplayer-servers/hosting-models/identifying-your-hosting-model) - Choose between Armadas and Formations
