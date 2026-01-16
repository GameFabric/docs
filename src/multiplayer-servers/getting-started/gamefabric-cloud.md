# GameFabric Cloud

GameFabric Cloud lets you provision (and deprovision) cloud locations straight from GameFabric, boosting your server capacity.

## Key Features

- **Integrated management**: Manage your cloud capacity directly in GameFabric.
- **Automated scaling**: Automatically scale your game servers into the newly provisioned <span class="nbsp">Cloud Locations</span>.
- **Simplified billing**: There's no need to manage a separate cloud provider subscription because we handle it all for you in the GameFabric billing system.

## Limitations

- **Supported providers**: Currently, GameFabric Cloud only supports [Google Cloud Platform](https://cloud.google.com/) (GCP).
- **Resource types**: Only certain types of cloud capacity can be provisioned through <span class="nbsp">GameFabric Cloud</span>.
- **BYOC restrictions**: You cannot add cloud capacity at locations that you have added using <span class="nbsp">Bring Your Own Cloud</span> (BYOC).

## Introduction

GameFabric Cloud lets you provision server capacity at specific, predefined Cloud Locations.
As described in [Setup Your Environments (and Regions),](./setup-your-environment#create-a-region) you should have defined Regions that cover multiple Locations,
including inactive Cloud Locations.

Regions are logical groupings of (physical data center) Locations and are assigned to Armadas or Vessels.

When you provision cloud capacity at a specific location, your overall capacity in the corresponding region increases, 
and your game servers can automatically start scaling into the newly provisioned location.

## Provision Cloud Location

To provision a Cloud Location, navigate to the Locations dashboard. It is located under <span class="nbsp">Capacity » Locations</span> in the GameFabric sidebar.

1. Click the Request Cloud Location button.
2. Select a GCP Location.
3. Select a Machine Configuration.
4. Read the provided disclaimer about implied costs and estimated provisioning time.
5. Confirm the dialog.

::: tip
If the Request Cloud Location button is disabled, you lack the necessary permissions. Contact our Customer Success Management team for assistance.
:::

Once the cloud location has been provisioned, you can see the assigned number of sites (usually one) in the Locations dashboard.
Make sure your Regions have been updated to include the Cloud Location so you can seamlessly make use of the new capacity once it has been provisioned.

::: tip
You can follow the status of your Cloud Location via API. The `provisioning/v1beta1` API returns the current status of the requested Location.
The `core/v1` API shows the assigned Sites once the Location has been successfully provisioned.
:::

To avoid unnecessary costs, remember to deprovision any Cloud Locations you no longer need.

## Deprovision Cloud Location

To deprovision a Cloud Location, navigate to the Locations dashboard. You find it under <span class="nbsp">Capacity » Locations</span> in the GameFabric sidebar.

1. Find the Cloud Location you want to deprovision.
2. Click the Remove Cloud Location button in the respective row.
3. Select the deprovisioning type:
   - **Graceful**: Deprovision the Location by cordoning its sites. This option waits until no more game servers are running before removal. (Recommended)
   - **Immediate**: Immediately deprovision the Location. Any running game servers will be forcefully terminated.
4. Read the provided disclaimer about the estimated deprovisioning time and other possible consequences.
5. Confirm the dialog.

## Find Managed Cloud Locations

You can show only managed Cloud Locations in the Locations dashboard by selecting *managed* in the *Filter by Types* dropdown.

## Important Configuration

### Configure Regions (required)

Your provisioned Cloud Location must be part of a Region for your Armadas and Vessels to use it.
Otherwise, your provisioned cloud capacity will not be used.

It is generally advised to distribute most of the available Locations to your Regions setup so that,
in the event that a Location is provisioned, it is automatically used.

### Configure Region Types and Priority (recommended)

Region Types divide a Region into logical subsets, such as bare metal and cloud.
This allows you to set priorities. Bare metal is often preferable to cloud for cost optimization.

Lower priority numbers indicate a higher priority (`0` is used first, `1` is used second, and so on).
