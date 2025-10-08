# Introduction

## What is SteelShield?

SteelShield protects your game servers from DDoS attacks. It stops malicious traffic before it can reach your servers.

## How SteelShield Works

SteelShield filters network traffic before it reaches your game server. It examines each packet to check:
- Source address
- Destination address  
- Port number
- Packet content

Only legitimate traffic passes through to your game server.

## Protection Levels

::: info
This describes the situation inside Nitrado's own infrastructure.
:::

### Level 1 - Automatic Rate Limiting

> No setup required from developers.

This protection watches packet size and speed. When unusual traffic is detected, it limits the rate of incoming packets.

Level 1 protection is always active for all customers at no extra cost.

### Level 2 - Advanced Traffic Filtering

> No setup required from developers.

Level 2 protection includes:
- Limits traffic to specific ports only
- Game-specific filters that block malicious packets
- Removes known bot traffic
- Blocks corrupt or invalid data
- Protects against TCP SYN flood attacks

Level 2 protection requires a purchase. Available in selected locations only.

**Example**: Unreal Engine 5 Generic Protection is considered Level 2.

To enable Level 2 protection, see [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric).

### Level 3 - Identity Verification with Deep Packet Inspection

> Requires game integration by developers.

Level 3 features:
- Tracks packet flows using secure cryptographic handshakes
- Prevents replay attacks and identifies malicious players
- Can block specific players from connecting
- 0% false positives - only valid traffic passes through

Level 3 provides the highest protection available. It needs deeper game integration but offers the most advanced security.

**For Unreal Engine**: Use our [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin).

**For other game engines**: Contact us for integration help.
