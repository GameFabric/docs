# GameFabric Cloud

GameFabric Cloud enables self-service provisioning and deprovisioning of cloud capacity at
specific [Locations](glossary#location) directly from GameFabric, increasing available
server capacity without requiring operator involvement.

## Key features

- **Integrated management**: Request, monitor, and remove cloud capacity directly in GameFabric.
- **Quota-aware provisioning**: Machine types and node counts are filtered to your assigned compute quota, so you can only request what is available to you.
- **Automated scaling**: Game servers automatically scale into newly provisioned Locations, provided the Location is already part of a Region's Types. Adding it to a Region before provisioning is the recommended setup.
- **Simplified billing**: No separate cloud provider subscription required. All costs are transparently displayed and delivered through the GameFabric billing system.

## Limitations

- **Supported providers**: GameFabric Cloud only supports [Google Cloud Platform](https://cloud.google.com/) (GCP).
- **Resource types**: A curated selection of machine types can be provisioned. Available types are shown when creating a Cloud Object and are filtered by your compute quota.
- **BYOC restrictions**: GameFabric Cloud capacity cannot be added at Locations that are already provisioned through <span class="nbsp">Bring Your Own Cloud</span> (BYOC).

## Concepts

### Cloud Object

A **Cloud Object** is a provisioning request for GameFabric-managed compute at a specific
Location. Each Cloud Object has:

- A **machine type** — the hardware configuration (CPU, memory) of each node.
- A **node count** — the maximum number of nodes to provision (the scaling limit).
- A **state** reflecting where it is in its lifecycle (see below).

A Location can have multiple Cloud Objects, each with a different machine type.

### Cloud Object states

| State | Meaning |
|---|---|
| `Pending` | The request has been submitted and is queued |
| `Provisioning` | Infrastructure is being created |
| `Provisioned` | Capacity is live and available for game server scheduling |
| `Deprovisioning` | Removal is in progress |
| `Error` | Provisioning failed; the reason is shown on the Cloud Object card |

### Compute quota

Each eligible Location has a **compute quota** per machine-type family that limits how many CPU
cores can be provisioned. The **Manage Cloud** drawer shows your current usage as a bar (cores
used / limit) broken down by family. When you create a Cloud Object, the form shows a live
preview of how your requested node count affects the remaining quota.

::: info
To increase your quota, contact us through the Help Center link shown in the Manage Cloud drawer.
:::

## Required permissions

Managing Cloud Objects requires the following capabilities in the `provisioning` API group:

| Action | Required capability |
|---|---|
| Request a Cloud Object | `clouds: post` |
| Downsize or schedule removal | `clouds: patch` |
| Remove a Cloud Object | `clouds: delete` |

If the **Manage Cloud** button is not visible on a Location row, your Role does not include the
necessary capabilities. Contact your account administrator.

## Provision a Cloud Object

Navigate to the Locations dashboard under <span class="nbsp">**Capacity » Locations**</span> in
the GameFabric sidebar.

1. Find a GameFabric Cloud Location (marked with a **Managed** tag) and click **Manage Cloud** in
   its row.

   <!-- TODO: Screenshot of the Locations list with a managed Location row, highlighting the "Manage Cloud" button in the actions column -->

2. The **Manage Cloud** drawer opens, showing any existing Cloud Objects for that Location and
   your current compute quota usage. Click **Request Cloud Object**.

   <!-- TODO: Screenshot of the Manage Cloud drawer in list mode, showing quota usage bars and the "Request Cloud Object" button -->

3. Fill in the form:
   - **Cloud Location** — select the GFC Location to provision into. Only Locations with an
     assigned compute quota are shown.
   - **Machine Type** — select a machine type. Options are filtered to families covered by the
     selected Location's quota. Each option shows the vCPU and memory configuration.
   - **Scaling limit — nodes** — enter the number of nodes to provision. The form shows the
     remaining quota and a live preview of the cores your request will consume.

   <!-- TODO: Screenshot of the "Request Cloud Object" create form showing the location selector, machine type selector, and node count input with the quota preview bar -->

4. Accept the pricing terms checkbox.

5. Click **Request Cloud Object**.

Once submitted, the Cloud Object appears in the drawer with state `Pending`, then transitions to
`Provisioning`, and finally `Provisioned` when capacity is live. Sites appear under the Location
once provisioning completes.

::: tip
Ensure your Regions include the cloud Location so that newly provisioned capacity is used by your
Armadas and Vessels automatically. See [Configure regions](#configure-regions-required).
:::

::: tip
The `provisioning/v1beta2` API exposes the full Cloud Object state. The `core/v1` API shows the
assigned Sites once provisioning completes.
:::

## Monitor Cloud Object state

Open **Manage Cloud** on a Location to see all Cloud Objects as cards. Each card shows:

- The Cloud Object name, machine type, and scaling limit.
- A **state tag** reflecting the current lifecycle state.
- CPU and memory of the machine type.
- If a delayed removal is scheduled, the time remaining until force-teardown.

<!-- TODO: Screenshot of the Manage Cloud drawer in list mode showing one or more Cloud Object cards with their state tags, machine type details, and action buttons -->

If a Cloud Object is in `Error` state, a warning icon appears on the card. Hover over it to read
the reason.

## Downsize a Cloud Object

You can reduce the node count of a `Provisioned` Cloud Object without removing it.

1. Open **Manage Cloud** for the Location.
2. Click **Decrease capacity** on the Cloud Object card.
3. Enter the new node count. It must be lower than the current capacity and at least 1.
4. Accept the pricing terms checkbox.
5. Click **Decrease Capacity**.

<!-- TODO: Screenshot of the downsize form showing the node count stepper and the pricing terms checkbox -->

::: warning
Node count can only be decreased from this screen, not increased. If you need more capacity,
request an additional Cloud Object. Downsizing is blocked while a deprovisioning is scheduled.
:::

## Remove a Cloud Object

To remove a Cloud Object and deprovision the underlying infrastructure:

1. Open **Manage Cloud** for the Location.
2. Click **Remove** on the Cloud Object card.

   <!-- TODO: Screenshot of a Cloud Object card with the "Remove" button highlighted -->

3. The **Remove Cloud Object** dialog opens. Choose a deprovisioning mode:

   ### Immediate

   All active game sessions in the Location are force-stopped instantly and infrastructure is
   torn down right away. Use this when you need to release capacity immediately and have no
   active players in the Location.

   ### Delayed — cordon & drain

   New game server allocations stop immediately, but the cluster stays alive so running game
   sessions can finish naturally. Set a delay of **1–24 hours**. Once the timer expires,
   infrastructure is force-torn down — even if game servers are still running.

   ::: warning
   Billing continues for the full duration of the countdown. Once a delayed removal is in
   progress it cannot be cancelled. Only **Immediate** removal remains available from that
   point forward.
   :::

   <!-- TODO: Screenshot of the "Remove Cloud Object" dialog showing both deprovisioning mode options (Immediate and Delayed), the delay hours input (visible when Delayed is selected), and the consent checkbox -->

4. Accept the consent checkbox confirming the removal is permanent.
5. Click **Remove Cloud Object**.

The Cloud Object transitions to `Deprovisioning` state. Once complete, it disappears from the
drawer and the Location's Sites are removed.

## Find managed cloud Locations

The Locations dashboard shows all Locations by default, filtered to those with active Sites.

To find all managed cloud Locations, select **managed** from the **Filter by Types** dropdown:

<!-- TODO: Screenshot of the Locations list with the "Filter by Types" dropdown open and "managed" selected, showing managed Locations in the list -->

To narrow to only Locations with active capacity, also select **used** from the **Filter by
Sites** dropdown:

<!-- TODO: Screenshot of the Locations list filtered by both "managed" type and "used" site state -->

## Important configuration

### Configure regions (required)

A provisioned cloud Location must be included in a Region's Types before Armadas and Vessels can
schedule game servers there.

It is generally advised to distribute available Locations across your Regions so that newly
provisioned Locations are picked up automatically without Region edits.

### Configure region types and priority (recommended)

Region Types divide a Region into logical subsets such as bare metal and cloud. Assign a lower
priority number to bare metal Types to prefer them over cloud for cost optimization — GameFabric
fills the highest-priority type first (`0` before `1`, and so on).

See [Regions, Sites & Locations](/multiplayer-servers/architecture/regions-sites-and-locations)
for full details on Region Types.
