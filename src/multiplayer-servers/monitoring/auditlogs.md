# Audit Logs

Each GameFabric installation has an own solution for audit logs.

::: info Data availability
Audit logs may be delayed by up to 2 minutes due to collection and processing pipelines.
:::

To access it, click on "Audit Logs".
![Screenshot of the Monitoring sidebar in the GameFabric interface](images/sidebar.png)

## Permissions

To access audit logs, a user must belong to a `group` with a `role` that has the `GET` permission for the `logs` resource.
See the [Editing Permissions](../authentication/editing-permissions.md) guide for more information.
