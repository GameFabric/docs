# Howto enable advanced protection for game servers

For each Armada or Vessel go to `Settings`->`Containers`->`Container Ports`

select the **Protection Protocol** you want to use for each port and hit `Save`.

![Ports](images/ports.png)


# Managing Protocols
You can mange your Protection Protections under `SteelShild`->`Protocols`


# Mitigations
your can see all all available Mitigations under `SteelShild`->`Mitigations`


# GatewayPolicies
In order to make sure return traffic from any outgoing connections is not blocked you have to configure your backend services CIDRs insde a GatewayPolicy.

# Protection Status
In the UI under `Capacity`->`Sites` you can see the *Protection Status* for each of you Sites.

There are following possible values:

- **Unprotected**: No node in this site is protected
- **Protected**: Every node in this site is protected
- **Partially Protected**: Some nodes in this site are proteted

::: info
At the moment **Partially Protected** is also show if all of your nodes are protected but the spare nodes are not.
For non maintaince operation this means that all of your capacity is protected.
:::
