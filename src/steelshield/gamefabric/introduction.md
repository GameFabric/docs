# Introduction

SteelShield is a DDoS mitigation solution. It protects game servers from large-scale DDoS attacks.

SteelShield intercepts network traffic before it reaches your game server. It checks if packets are legitimate by examining:

- Source address
- Destination address
- Port
- Packet contents

SteelShield allows only expected traffic through to your game server.

## Protection Levels

::: info
This describes the situation inside Nitrado's own infrastructure.
:::

### Level 1 - Reactive Rate Limiting

::: info No integration needed from game developers.
:::

Reactive rate-limiting monitors packet size and traffic rate, triggering limits on server traffic in response to unusual network activity.

Level 1 protection is always enabled for all customers at no additional charge.

### Level 2 - Basic Traffic Filtering and Whitelisting

::: info No integration needed from game developers.
:::

Level 2 protection includes:

- Traffic restriction to specific ports
- Generic Game-specific filtering to block malicious traffic
- Basic filtering to remove known bot traffic
- Traffic with corrupt or invalid payloads
- Standard TCP mitigations for SYN floods

You must purchase Level 2 protection. It is available in selected locations.

Example: Unreal Engine 5 Generic Protection is considered Level 2.

To enable Level 2 protection, see [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric).

### Level 3 - Proof of Identity using Deep Packet Inspection

::: info Integration into the game by the developer is required.
:::

Level 3 features:

- Packet flows tracked via cryptographically signed handshake process
- Replay attacks blocked and malicious players identified
- Ability to block players from connecting to servers
- 0% false positives — only valid traffic passes through

Level 3 is the highest protection level available. It requires deeper game integration but provides advanced capabilities.

To implement Level 3 protection in an Unreal Engine game, use our [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin).

For integration into a different game engine, please contact us.
