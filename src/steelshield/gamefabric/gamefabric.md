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

Gateway Policies allow traffic from specific IP addresses to reach your service.

## When to Use Gateway Policies

Use Gateway Policies when your server communicates with other backend services. You must add their IP addresses here for communication to work properly.

## How It Works

IP addresses are matched against network ranges. Add these ranges as CIDR notation to your policies.

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
