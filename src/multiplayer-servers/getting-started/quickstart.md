# Quickstart

Get your first game server running on GameFabric in minutes.

::: warning Trial and Testing Only
This quickstart guide is intended for trials and quick evaluations. For production workloads, follow the complete setup guides covering authentication, capacity planning, and proper Agones SDK integration.
:::

## Prerequisites

- A GameFabric account with access to an installation
- A game server binary ready for containerization
- A way to build and push Docker container images

## Steps

### 1. Create a Branch

Create a Branch to store your container images.

[Detailed guide: Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)

### 2. Build your container image

Package your game server into a Docker container.

[Detailed guide: Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image)

### 3. Push your container image

Push the container image to your Branch.

[Detailed guide: Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)

### 4. Create an Environment

Create an Environment to organize your deployments (e.g., development, staging, production).

[Detailed guide: Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment)

### 5. Create a Region

Define a Region that includes available Locations where your game servers can run.

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
