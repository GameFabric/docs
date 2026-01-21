# GameFabric Cloud

GameFabric Cloud enables provisioning and deprovisioning of cloud [Locations](glossary#location)
directly from GameFabric, increasing available server capacity.

## Key Features

- **Integrated management**: Manage cloud capacity directly in GameFabric.
- **Automated scaling**: Automatically scale game servers into the newly provisioned cloud Locations.
- **Simplified billing**: There is no need to manage a separate subscription with a cloud provider. All costs are transparently displayed and delivered through the GameFabric billing system.

## Limitations

- **Supported providers**: GameFabric Cloud only supports [Google Cloud Platform](https://cloud.google.com/) (GCP).
- **Resource types**: A curated selection of machine types can be provisioned. Available types are shown in the Locations section of the GameFabric UI.
- **BYOC restrictions**: GameFabric Cloud capacity cannot be added at Locations that are already provisioned through <span class="nbsp">Bring Your Own Cloud</span> (BYOC).

## Introduction

GameFabric Cloud enables provisioning of server capacity at specific, predefined cloud Locations.

As described in [Setup your Environment](./setup-your-environment#create-a-region), [Regions](glossary#region)
should be defined to cover multiple Locations, including inactive cloud Locations.

Provisioning cloud capacity at a specific Location increases the overall capacity in the corresponding Region, allowing game servers to automatically scale into the newly provisioned Location.

## Provision Cloud Location

To provision a cloud Location, navigate to the Locations dashboard. It is located under <span class="nbsp">Capacity » Locations</span> in the GameFabric sidebar.

1. Click the "Request Cloud Location" button:
   
   !["Request Cloud Location" button](images/cloud/request-cloud-location-button.png)
   
   ::: tip
   If the "Request Cloud Location" button is disabled, you lack the necessary permissions. Contact our Customer Success Management team for assistance.
   :::
2. Select a "GCP Location" and "Machine Configuration":
   
   !["Request Cloud Location" dialog](images/cloud/request-cloud-location-dialog.png)
   
   The machine configuration lets you choose from predefined machine types with different CPU and memory configurations.
3. Read the provided disclaimer about implied costs and estimated provisioning time.
   The details may differ from those shown in the screenshot.
4. Confirm the dialog.

Once the cloud Location has been provisioned, the assigned number of [Sites](glossary#site) (usually one) is shown in the Locations dashboard.
Ensure that Regions are updated to include the cloud Location so the newly provisioned capacity can be used seamlessly.

::: tip
The API exposes the status of cloud Locations. The `provisioning/v1beta1` API returns the current status of the requested Location.
The `core/v1` API shows the assigned Sites once the Location has been successfully provisioned.
:::

To avoid unnecessary costs, remember to deprovision unused cloud Locations.

## Deprovision Cloud Location

To deprovision a cloud Location, navigate to the Locations dashboard. It is located under <span class="nbsp">Capacity » Locations</span> in the GameFabric sidebar.

1. [Find the Cloud Location you want to deprovision.](#find-managed-cloud-locations)
2. Click the "Remove Cloud Location" button in the respective row.
   
   !["Remove Cloud Location" button](images/cloud/remove-cloud-location-button.png)
3. Select the deprovisioning type:
   - **Graceful**: Deprovision the Location by cordoning its Sites. This option waits until no more game servers are running before removal. (Recommended)
   - **Forceful**: Immediately deprovision the Location. Any running game servers are forcefully terminated.
   
   !["Remove Cloud Location" dialog](images/cloud/remove-cloud-location-dialog.png)
4. Read the provided disclaimer about the estimated deprovisioning time and other possible consequences.
   The details may differ from those shown in the screenshot.
5. Confirm the dialog.

## Find Managed Cloud Locations

The Locations dashboard shows all Locations, including bare metal and cloud, and regardless of whether they have Sites,
but by default, the overview is filtered to show only Locations with Sites.

To find managed cloud Locations, choose "managed" from the "Filter by Types" dropdown, and eventually de-select other filters:

![Find Managed Cloud Locations](images/cloud/find-managed-cloud-locations.png)

To find only used managed cloud Locations, additionally choose "used" from the "Filter by Sites" dropdown:

![Find My Managed Cloud Locations](images/cloud/find-my-managed-cloud-locations.png)

## Important Configuration

### Configure Regions (required)

The provisioned cloud Location must be part of a Region for the Armadas and Vessels to use it.

It is generally advised to distribute the available Locations across the Regions setup so that newly provisioned Locations are automatically used.

### Configure Region Types and Priority (recommended)

Region Types divide a Region into logical subsets, such as bare metal and cloud.
This enables priority configuration, with bare metal often preferred over cloud for cost optimization.

Lower priority numbers indicate a higher priority (`0` is used first, `1` is used second, and so on).

