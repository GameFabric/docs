# Step 5: Set up your environment

**Goal:** create the environment and region your game server will run in.

**Before you start:** you need permission to create environments and regions. If you chose BYOC in
step 1, connect your cloud account first with
[Configuring your cloud provider](/multiplayer-servers/configure/cloud-provider-setup).

Two resources stand between you and a deployment. An **environment** isolates a set of resources,
so production and development never affect each other. A **region** groups the physical locations
a game server can run in, and decides which capacity is used first.

## Create an environment

1. Select **Environments** in the sidebar.
2. Select **Create Environment**.
3. Enter a name of at most four letters, such as `dev`, `stge` or `prod`. The name uniquely
   identifies the environment and cannot be changed. See
   [Quotas](/multiplayer-servers/configure/quotas#name-length) for the exact limits.
4. Enter a display name, and optionally a description.
5. Select **Create Environment**.

Create `dev` for this track. Every resource you create from here on belongs to the environment
selected in the top bar, so check the selector before continuing.

## Create a region

1. With your environment selected, go to **Regions**.
2. Select **Create Region**.
3. Give the region a name and display name that make its purpose obvious, such as `euw` and
   "Europe West". Select **Next**.

You now define the region's **types**. A type is a group of locations with a priority attached.
GameFabric places game servers into the lowest-priority-number type that has capacity, then falls
through to the next.

This is how the capacity decision from step 1 becomes real. For a mixed setup you might define:

| Type name | Priority | Locations |
|---|---|---|
| `metal` | 1 | Bare metal locations in the region |
| `cloud` | 2 | GameFabric Cloud or BYOC locations in the region |

Servers then fill your bare metal capacity first and only spill into cloud when it is full.

For this track, one type with your available locations is enough.

1. Enter a type name and a priority.
2. Select the locations for that type. Locations available to you were provisioned by your Nitrado
   contact, or come from the cloud account you connected.
3. Optionally add environment variables. They are set on every game server deployed into the
   locations of this type, which is useful for telling a server which kind of capacity it is on.
4. Select **Create Region**.

::: info No locations to select?
Your account has no capacity provisioned in that geography yet. Contact your Nitrado representative
for bare metal or GameFabric Cloud, or check your cloud provider connection for BYOC.
:::

For the relationship between regions, locations and sites, see
[Regions, sites and locations](/multiplayer-servers/concepts/regions-sites-and-locations).

## What you should have now

- An environment, selected in the top bar.
- A region in that environment with at least one type and one location.

Next: [Deploy your first game server](/multiplayer-servers/get-started/deploy-your-first-game-server).
