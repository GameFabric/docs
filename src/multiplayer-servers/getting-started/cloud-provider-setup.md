# Configuring your Cloud Provider

This document describes the steps required to set up your Cloud provider for use with GameFabric. Currently supported
Cloud providers are Google Cloud (GCP), Azure, and Amazon Web Services (AWS).

Public documentation is currently limited to Google Cloud. For setup instructions for other Cloud providers, please
contact your Nitrado Account Manager.

## Google Cloud

### Prerequisites

* You **must** already have an existing Google Cloud organization
* You **must** possess the necessary permissions to manage principals and billing accounts in your organization

If any of those pre-requisites are not met, like if you don't yet have an organization, you must contact Nitrado as the steps will be different from what is described below.

### Creating a Principal

* Visit the [Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager) page
  * Click the _Create Folder_ button and name it _Nitrado_
  * You might have to press **F5** for the folder to become visible
* Select the _Nitrado_ folder
* Click the _Add Principal_ button
* Input `ec-armada-ops@nitrado.net` as the value for _New Principal_

### Allowing project management

The Nitrado principal requires the permissions to manage all resources within the Nitrado folder.
**Everything else within your organization is invisible and inaccessible to Nitrado.**

Assign the following roles to the `ec-armada-ops@nitrado.net` principal:

* Folder Admin
* Owner
* Project Creator

Now follow the same steps in the Organization page, but instead, assign the following role to our Principal:

* Organization Viewer

### Allowing billing management

In order to link your billing account to the projects managed by Nitrado, and to create Billing Reports, the Nitrado principal requires following the steps below:

* Visit the [billing configuration page](https://console.cloud.google.com/billing)
  * Select your billing account
  * Click the _Add Principal_ button
  * Assign the following roles
    * `Billing Account User`
    * `Billing Account Viewer`

### Confirming the setup

After you have completed the steps above, please contact Nitrado to confirm that the setup is complete.
