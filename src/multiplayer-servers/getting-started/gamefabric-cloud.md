# GameFabric Cloud

GameFabric Cloud enables self-service provisioning and deprovisioning of cloud capacity at
specific [Locations](glossary#location) directly from GameFabric, increasing available
server capacity without requiring operator involvement.

## Key features

- **Integrated management**: Request, monitor, and remove cloud capacity directly in GameFabric.
- **Automated scaling**: Game servers automatically scale into newly provisioned Locations, provided the Location is already part of a Region's Types. Adding it to a Region before provisioning is the recommended setup.
- **Simplified billing**: No separate cloud provider subscription required. All costs are transparently displayed and delivered through the GameFabric billing system.

## Limitations

- **Supported providers**: GameFabric Cloud only supports [Google Cloud Platform](https://cloud.google.com/) (GCP).
- **Resource types**: A curated selection of machine types can be provisioned. Available types are shown in the GameFabric UI when creating a Cloud Object.
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

| State            | Meaning                                                           |
|------------------|-------------------------------------------------------------------|
| `Pending`        | The request has been submitted and is queued                      |
| `Provisioning`   | Infrastructure is being created                                   |
| `Provisioned`    | Capacity is live and available for game server scheduling         |
| `Deprovisioning` | Removal is in progress                                            |
| `Error`          | Provisioning failed; the reason is shown on the Cloud Object card |

## Quotas

Access to GameFabric Cloud capacity is governed by quotas. Quotas apply per
Location, and per machine type family, and control how much compute can be provisioned at any
given time.

Cloud Locations themselves come with a predefined set of available machine types and quota
limits. If they do not meet your requirements, you can request a different quota,
different machine types, and in exceptional cases different locations through the 
Help Center or by contacting the Customer Success Management team.

## Required permissions

Managing Cloud Objects requires the following capabilities in the `provisioning` API group:

| Action                       | Required capability |
|------------------------------|---------------------|
| Request a Cloud Object       | `clouds: post`      |
| Downsize or schedule removal | `clouds: patch`     |
| Remove a Cloud Object        | `clouds: delete`    |

If the **Manage Cloud** button is not visible on a Location row, your Role does not include the
necessary capabilities. Contact your account administrator.

## Provision a Cloud Object

Navigate to <span class="nbsp">**Capacity » Locations**</span> and either:

- Click **Request Cloud** in the page header, or
- Find a GameFabric Cloud Location and click **Manage Cloud** in its row.
  **Request Cloud Object**.

![Locations list showing managed Location rows with the "Manage Cloud" button and the "Request Cloud" button in the page header](images/cloud/locations-overview.png)

Both open the same form. Fill in:

- **Cloud Location** — select the GameFabric Cloud Location to provision into.
- **Machine Type** — select a machine type. Each option shows the vCPU and memory configuration.
- **Scaling limit — nodes** — enter the number of nodes to provision.

![Request Cloud Object form showing the location selector, machine type selector, node count input, and pricing terms acknowledgement checkbox](images/cloud/manage-cloud-form.png)

Review the pricing terms and check the acknowledgement checkbox to confirm you accept the
recurring costs before proceeding. Then click **Request Cloud Object**. The drawer shows the
Manage Cloud view for the selected Location once the request is submitted.

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

![Manage Cloud drawer showing a Cloud Object card with its state tag, machine type details, and Decrease capacity and Remove action buttons](images/cloud/manage-cloud-list.png)

If a Cloud Object is in `Error` state, a warning icon appears on the card. Hover over it to read
the reason.

## Downsize a Cloud Object

You can reduce the node count of a `Provisioned` Cloud Object without removing it.

1. Open **Manage Cloud** for the Location.
2. Click **Decrease capacity** on the Cloud Object card.
3. Enter the new node count. It must be lower than the current capacity and at least 1.
4. Accept the pricing terms checkbox.
5. Click **Decrease Capacity**.

![Downsize form showing the node count stepper and pricing terms checkbox](images/cloud/manage-cloud-downsize.png)

::: warning
Node count can only be decreased, not increased. If you need more capacity,
request an additional Cloud Object. Downsizing is blocked while a deprovisioning is scheduled.
:::

## Remove a Cloud Object

To remove a Cloud Object and deprovision the underlying infrastructure:

1. Open **Manage Cloud** for the Location.
2. Click **Remove** on the Cloud Object card.
3. The **Remove Cloud Object** dialog opens. Choose a deprovisioning mode:

   ### Immediate

   Active game sessions using this Cloud Object's capacity are force-stopped immediately, and its
   infrastructure is torn down. Use this when you need to release capacity immediately and have no
   active players using this Cloud Object.

   ### Delayed — cordon & drain

   New game server allocations stop immediately, but the cluster stays alive so running game
   sessions can finish naturally. Set a delay of **1–24 hours**. Once the timer expires,
   infrastructure is force-torn down — even if game servers are still running.

   ::: warning
   Billing continues for the full duration of the countdown. Once a delayed removal is in
   progress it cannot be cancelled. Only **Immediate** removal remains available from that
   point forward.
   :::

   ![Remove Cloud Object dialog showing the Immediate and Delayed deprovisioning options, the delay hours input (with Delayed selected), and the consent checkbox](images/cloud/remove-cloud-dialog.png)

4. Accept the consent checkbox confirming the removal is permanent.
5. Click **Remove Cloud Object**.

The Cloud Object transitions to `Deprovisioning` state. Once complete, it disappears from the
drawer and the Sites associated with this Cloud Object are removed.

## Find managed cloud Locations

The Locations dashboard opens with default filters that exclude unprovisioned and unassigned
Locations.

To find all managed cloud Locations, clear the default filters, then select **gamefabric** from the
**Filter by Types** dropdown:

To narrow to only Locations with active capacity, also select **used** from the **Filter by
Sites** dropdown:

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
