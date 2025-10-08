# Enable Advanced Protection for Game Servers

Follow these steps to protect your game servers:

1. Open your Armada or Vessel
2. Go to `Settings` → `Containers` → `Container Ports`
3. Choose a **Protection Protocol** for each port
4. Click `Save`

![Screenshot of the Container Ports settings page showing how to select a Protection Protocol for each port.](images/ports.png)

# Manage Protection Protocols

To manage your Protection Protocols:

1. Go to `SteelShield` → `Protocols`

# View Mitigations

To see available mitigations:

1. Go to `SteelShield` → `Mitigations`

# Gateway Policies

Gateway Policies control which external IP addresses can reach your service directly. These connections bypass SteelShield protection.

This works by using a different IP address for backend traffic. Your main game IP stays separate from backend services.

To create a Gateway Policy:

1. Go to `SteelShield` → `GatewayPolicies`
2. Click `Add GatewayPolicy`
3. Enter the `Name`, `Display Name`, and `Description`
4. Click `Next`
5. Enter the network CIDR for your backend service
6. Click `Add CIDR`
7. Add more backend IPs if needed (repeat steps 5-6)
8. Click `Create GatewayPolicy`

## When to Use Gateway Policies

Use Gateway Policies when your server needs to communicate with backend services. This allows direct connections without SteelShield filtering.

Configure this for all backend services. This prevents attacks on your main game IP from affecting backend communications.

# Check Protection Status

To view your protection status:

1. Go to `Capacity` → `Sites`
2. Check the *Protection Status* for each site

## Protection States

The system shows one of three protection states:

- **Unprotected**: No nodes in this site have protection
- **Protected**: All nodes in this site have protection  
- **Partially Protected**: Some nodes in this site have protection

::: info
**Partially Protected** can appear when all your nodes are protected but buffer nodes are not. This is normal. Your game capacity is still fully protected.
:::
