# Full setup guide

A comprehensive overview of GameFabric setup for production use. Not every section applies to every deployment - select the steps relevant to your needs.

## Authentication and access

Establish secure access to your GameFabric installation.

- Create service accounts for programmatic access
  - [Authentication](/multiplayer-servers/authentication/authentication)
- Configure groups and assign roles
  - [Editing Permissions](/multiplayer-servers/authentication/editing-permissions)
- Set up third-party OAuth integration
  - [Third-Party OAuth](/multiplayer-servers/authentication/setup-third-party-oauth)

## Hosting model decision

Choose the right hosting model for your game.

- Understand the difference between Armadas and Formations
  - [Hosting Models](/multiplayer-servers/running-game-servers/identifying-your-hosting-model)
- **Armadas**: For match-based games with dynamic scaling and allocation
- **Formations**: For persistent worlds or named server instances

## Capacity setup

Configure where your game servers run.

- Review available capacity types
  - [Capacity Types](/multiplayer-servers/running-game-servers/capacity-types)
- Configure GameFabric Cloud capacity (self-service)
  - [GameFabric Cloud](/multiplayer-servers/running-game-servers/gamefabric-cloud)
- Set up BYOC (Bring Your Own Cloud) if using your own cloud account
  - [Cloud Provider Setup](/multiplayer-servers/running-game-servers/cloud-provider-setup)
- Request bare metal capacity if needed (via Help Center)

## Container development

Build and deploy your game server container.

- Build your container image
  - [Building a Container Image](/multiplayer-servers/integration/building-a-container-image)
- Integrate the Agones SDK for health checks and lifecycle management
  - [Using the Agones SDK](/multiplayer-servers/integration/using-the-agones-sdk)
- Understand the game server lifecycle
  - [Game Server Life Cycle](/multiplayer-servers/integration/game-server-lifecycle)
- Create Branches for your container images
  - [Create a Branch](/multiplayer-servers/integration/pushing-container-images#create-a-branch)
- Push your container images
  - [Pushing Container Images](/multiplayer-servers/integration/pushing-container-images)

## Environment configuration

Set up Environments and Regions for your deployments.

- Create Environments (development, staging, production)
  - [Setup your Environment](/multiplayer-servers/operations/setup-your-environment)
- Create Regions with appropriate Locations
  - [Setup your Environment](/multiplayer-servers/operations/setup-your-environment#create-a-region)
- Configure Region Types for capacity prioritization
  - [Setup your Environment](/multiplayer-servers/operations/setup-your-environment#create-a-region)
- Configure branch policies for image management
  - [Edit a Branch](/multiplayer-servers/operations/edit-a-branch)

## Deployment

Deploy your game servers.

- Deploy Vessels (for Formations) or ArmadaSets (for Armadas)
  - [Running your Game Server](/multiplayer-servers/operations/running-your-game-server)
- Configure health checks and grace periods
  - [Running your Game Server](/multiplayer-servers/operations/running-your-game-server)
- Set up secrets for sensitive configuration
  - [Managing Secrets](/multiplayer-servers/operations/secrets)

## Monitoring

Set up observability for your game servers.

- Configure monitoring dashboards
  - [Monitoring Introduction](/multiplayer-servers/monitoring/introduction)
- Set up audit logging
  - [Audit Logs](/multiplayer-servers/monitoring/auditlogs)

## Integration

Connect your backend systems to GameFabric.

- Integrate your game server with GameFabric
  - [Your Game Server](/multiplayer-servers/integration/your-game-server)
- Connect your backend infrastructure
  - [Your Infrastructure](/multiplayer-servers/integration/your-backend)
- Implement player count tracking
  - [Player Count Tracking](/multiplayer-servers/integration/player-count-tracking)
- Set up server allocation (for Armadas)
  - [Allocating from Armadas](/multiplayer-servers/multiplayer-services/server-allocation/allocating-from-armadas)
