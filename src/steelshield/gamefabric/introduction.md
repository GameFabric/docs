# Introduction

## Description

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

> No integration needed from game developers.

This protection monitors packet size and packets per second. When it detects unusual network activity, it limits traffic to your server.

Level 1 protection is always enabled for all customers at no additional charge.

### Level 2 - Basic Traffic Filtering and Whitelisting

> No integration needed from game developers.

Level 2 protection includes:
- Traffic restriction to specific ports
- Game-specific filtering to block malicious traffic
- First layer of DDoS protection

You must purchase Level 2 protection. It is available in selected locations.

Example: Unreal Engine 5 Generic Protection is considered Level 2.

To enable Level 2 protection, see [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric).

### Level 3 - Proof of Identity using Deep Packet Inspection

> Integration into the game by the developer is required.

Level 3 features:
- Deep packet inspection for real-time analysis
- sFlow data for traffic pattern insights over time
- 0% false positives - only valid traffic passes through

Level 3 is the highest protection level available. It requires deeper game integration but provides advanced capabilities.

To implement Level 3 protection, use our [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin).
