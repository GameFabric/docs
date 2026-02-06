# Troubleshooting

## Degraded state

The **Degraded** state indicates that GameFabric encountered an issue deploying configuration to one or more Sites, or that no Sites exist for the requested capacity.

### What can be Degraded?

Multiple objects in GameFabric can enter a Degraded state:

- Armadas and ArmadaSets
- Formations
- Secrets and ConfigFiles
- Protocols and Gateway Policies

### Common causes

- **No Sites in Region** — All Locations associated with a Region are no longer active or available
  - This is most commonly the result of a cancellation request for the related clusters
  - Check the Sites view: if Sites are missing or in `Terminating` state, this is likely the cause
  - **Action:** Update your ArmadaSet configuration (see [Resolving Degraded Armadas after capacity removal](#resolving-degraded-armadas-after-capacity-removal))

- **Sites unavailable (incident)** — Sites exist but GameFabric cannot connect to them
  - Sites will also show as Degraded in the Sites view
  - This is often temporary and may resolve automatically
  - **Action:** Check the [status page](https://status.gamefabric.com/) for ongoing incidents; no configuration change needed

- **Configuration deployment error** — An issue occurred while deploying configuration to a Site
  - **Action:** Review recent configuration changes or contact support

::: tip
A Degraded state indicates that configuration could not be deployed to one or more Sites. This is often temporary and may resolve automatically when Sites become available again.
:::

## Resolving Degraded Armadas after capacity removal

When all Sites in a Location are removed, Armadas created by ArmadaSets referencing that Location will show as Degraded.

### Why manual cleanup is required

GameFabric preserves your configuration (Min Replicas, Max Replicas, Buffer settings) rather than automatically removing it. This ensures:

- Your settings are retained if you plan to add capacity back later
- No unexpected changes are made to your deployment configuration
- You maintain full control over your ArmadaSet settings

### How to resolve

To clear Degraded Armadas, update each affected ArmadaSet to adjust the replica settings for regions without capacity:

1. Navigate to the affected ArmadaSet
2. Go to **Settings → Regions**
3. Click **"Clear"** on the affected regions
4. Press **Save**
5. Repeat for all affected ArmadaSets across your environments

Once you've adjusted the configuration, the Degraded state no longer appears.

::: info
Before clearing configuration, you may want to note down your current settings (Min/Max Replicas, Buffer) in case you need to restore them later.
:::

## Related

- [Glossary](/multiplayer-servers/getting-started/glossary)
- [Setup your Environment](/multiplayer-servers/getting-started/setup-your-environment)
- [Terminating ArmadaSets](/multiplayer-servers/getting-started/terminating-armadasets)
