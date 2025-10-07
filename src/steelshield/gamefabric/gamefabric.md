# How to enable advanced protection for game servers

For each Armada or Vessel go to `Settings`->`Containers`->`Container Ports`, select the **Protection Protocol** you want to use for each port and press the `Save` button.

![Screenshot of the Container Ports settings page showing how to select a Protection Protocol for each port.](images/ports.png)

# Managing Protocols

You can manage your Protection Protocols under `SteelShield`->`Protocols`.

# Mitigations

You can see all available Mitigations under `SteelShield`->`Mitigations`.

# GatewayPolicies

A GatewayPolicy allows traffic from certain IPs to be passed back to your service.

If your server communicates with other backend services, their IPs must be added here for the communication to function properly.

The IPs are matched against network ranges you add as CIDR to these policies.

# Protection Status

In the UI, under `Capacity`->`Sites` you can see the *Protection Status* for each of your Sites.

The UI displays one of the following states of protection:

- **Unprotected**: No node in this site is protected
- **Protected**: Every node in this site is protected
- **Partially Protected**: Some nodes in this site are protected

::: info
At the moment **Partially Protected** is also shown if all of your nodes are protected but the buffer nodes are not.
For regular operations, this means that all of your capacity is protected.
:::
