# Quickstart

Get your first game server running on GameFabric in minutes.

## Prerequisites

- A GameFabric account with access to an installation
- A game server binary ready for containerization
- A way to build and push Docker container images

## Steps

### 1. Create a Branch

Create a Branch to store your container images.

[Detailed guide: Pushing Container Images](/multiplayer-servers/integration/pushing-container-images)

### 2. Build your container image

Package your game server into a Docker container.

[Detailed guide: Building a Container Image](/multiplayer-servers/integration/building-a-container-image)

### 3. Push your container image

Push the container image to your Branch.

[Detailed guide: Pushing Container Images](/multiplayer-servers/integration/pushing-container-images)

### 4. Create an Environment

Create an Environment to organize your deployments (e.g., development, staging, production).

[Detailed guide: Setup your Environment](/multiplayer-servers/operations/setup-your-environment)

### 5. Create a Region

Define a Region that includes available Locations where your game servers can run.

[Detailed guide: Setup your Environment](/multiplayer-servers/operations/setup-your-environment#create-a-region)

### 6. Create a Vessel

Deploy your game server as a Vessel. For quick testing without Agones SDK integration, disable health checks.

[Detailed guide: Running your Game Server](/multiplayer-servers/operations/running-your-game-server)

::: tip Testing without Agones SDK
When testing without Agones SDK integration, set the health check to "Disabled" in the Advanced section. This allows the game server to run without calling SDK health check methods.
:::

## What's next?

- [Full Setup Guide](/multiplayer-servers/getting-started/full-setup-guide) - Comprehensive production setup checklist
- [Using the Agones SDK](/multiplayer-servers/integration/using-the-agones-sdk) - Integrate proper health checks and lifecycle management
- [Hosting Models](/multiplayer-servers/running-game-servers/identifying-your-hosting-model) - Choose between Armadas and Formations
