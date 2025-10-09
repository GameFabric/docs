# How to Enable Advanced Protection for Game Servers

To enable protection for your game servers:

1. Navigate to your Armada or Vessel
2. Go to `Settings` → `Containers` → `Container Ports`
3. Select the **Protection Protocol** for each port
4. Click the `Save` button

![Screenshot of the Container Ports settings page showing how to select a Protection Protocol for each port.](images/ports.png)

# Managing Protocols

To manage your Protection Protocols:

1. Go to `SteelShield` → `Protocols`

# Mitigations

To view available mitigations:

1. Go to `SteelShield` → `Mitigations`

# Gateway Policies

Gateway Policies control which external IP addresses can reach your service without passing through SteelShield.

This is achieved by sending and receiving such traffic on a different IP address than the main IP used for game communication.

To add a Gateway Policy:

1. Go to `SteelShield` → `GatewayPolicies`
2. Click `Add GatewayPolicy`
3. Add the `Name`, `Display Name` and `Description` for the policy
4. Click `Next`
5. Enter the network CIDR for your backend service
6. Click `Add CIDR`
7. If you have multiple backend IPs, continue to add them in the same manner
8. Click `Create GatewayPolicy`

## When to Use Gateway Policies

Use Gateway Policies when your server communicates with other backend services that you do not want SteelShield to intercept the traffic for.

Ideally this should be configured for all your backend services to prevent attacks on the main game IP from impacting your servers communication with backend services.

# Protection Status

To check your protection status:

1. Go to `Capacity` → `Sites`
2. View the *Protection Status* for each site

## Protection States

The system shows one of three protection states:

- **Unprotected**: No nodes in this site have protection
- **Protected**: All nodes in this site have protection
- **Partially Protected**: Some nodes in this site have protection

::: info
**Partially Protected** may also appear when all your nodes are protected but buffer nodes are not. For regular operations, this means all your capacity is protected.
:::
