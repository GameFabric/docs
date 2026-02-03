# Armada States

## Overview

Armadas in GameFabric can be in different states depending on their current condition. Understanding these states helps you identify and resolve issues with your game server deployments.

## States

### Running

The Armada is operating normally. Game servers are being scheduled and running as expected according to your configured Min/Max Replicas and Buffer settings.

### Degraded

A **Degraded** Armada indicates that GameFabric cannot fulfill the requested game server capacity. This typically happens when an Armada is configured to use a Region that has no available Sites.

Common causes:
- Sites were removed from a Location, but the ArmadaSet still references that Region
- A Location has been decommissioned
- All Sites in a Region are cordoned or unavailable

::: tip
A Degraded state means "you asked for game servers here, but there's nowhere to place them."
:::

## Resolving Degraded Armadas After Site Removal

When Sites are removed from your setup (e.g., after decommissioning a Location), you may see Degraded Armadas in your Armada overview. This is expected behavior.

### Why doesn't GameFabric clean this up automatically?

GameFabric intentionally preserves your ArmadaSet region configuration (Min Replicas, Max Replicas, Buffer settings). This design choice ensures:

- Your configuration is not lost if you plan to add those Locations back later
- No unexpected changes are made to your deployment configuration
- You maintain full control over your ArmadaSet settings

### How to resolve

To clear Degraded Armadas, you need to update each affected ArmadaSet to remove the decommissioned regions:

1. Navigate to the affected ArmadaSet
2. Go to **Settings → Regions**
3. Click **"Clear"** on the regions that were removed
4. Press **Save**
5. Repeat for all affected ArmadaSets across your environments

Once you've adjusted the region configuration, the Degraded Armadas will no longer appear in your overview.

::: info
Before clearing the configuration, you may want to note down your current settings (Min/Max Replicas, Buffer) in case you need to restore them later when new Sites are provisioned.
:::

## Related

- [Glossary: ArmadaSet](/multiplayer-servers/getting-started/glossary#armadaset)
- [Glossary: Region](/multiplayer-servers/getting-started/glossary#region)
- [Glossary: Site](/multiplayer-servers/getting-started/glossary#site)
- [Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment)
- [Terminating ArmadaSets](/multiplayer-servers/getting-started/terminating-armadasets)
