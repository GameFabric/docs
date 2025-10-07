# Introduction

## Description

SteelShield is a DDoS protection system. It protects game servers from large-scale DDoS attacks.

SteelShield intercepts network traffic before it reaches your game server. It checks if packets are legitimate by examining:
- Source address
- Destination address  
- Port
- Packet contents

Only expected traffic is allowed through to your game server.

## Protection Levels

::: info
This describes the situation inside Nitrado's own infrastructure.
:::

### Level 1 - Reactive Rate Limiting

> No integration needed from game developers.

This protection monitors packet size and packets per second. When it detects unusual network activity, it limits traffic to your server.

Level 1 is always enabled for all customers at no additional charge.

### Level 2 - Basic Traffic Filtering and Whitelisting

> No integration needed from game developers.

Level 2 protection includes:
- Traffic restriction to specific ports
- Game-specific filtering to block malicious traffic
- First layer of DDoS protection

Level 2 must be purchased and is available in selected locations.

Example: Unreal Engine 5 Generic Protection is considered Level 2.

See [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric) to enable Level 2 protection.

### Level 3 - Proof of Identity using Deep Packet Inspection

> Integration into the game by the developer is required.

Level 3 features:
- Deep packet inspection for real-time analysis
- sFlow data for traffic pattern insights over time
- 0% false positives - only valid traffic passes through

This is the highest protection level available. It requires deeper game integration but provides advanced capabilities.

See [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin) to implement Level 3 protection using our Unreal Engine Plugin.
