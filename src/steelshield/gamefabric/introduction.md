# Introduction

## Description

SteelShield is a DDoS protection system designed for the specific purpose of protecting game servers from large scale DDoS attacks. 

It achieves this by intercepting network traffic on the path to the game server, and identifying whether the combination of source address, destination address, port and network packet contents match the type of packets which would normally be expected for that game server.

## Protection Levels

::: info
This describes the situation inside Nitrado's own infrastructure.
:::

### Level 1 - Reactive Rate Limiting

> No integration is needed from the game developers.

Reactive Rate Limiting is based on packet size and packets per second. It will react to an increase in network activity, limiting the traffic toward a specific host if it suspects a DDoS attack.

Level 1 is always enabled for all customers at no additional charge.

### Level 2 - Basic Traffic Filtering and Whitelisting

> No integration is needed from the game developers.

Level 2 restricts traffic to specific ports and applies game specific basic filtering to block obvious malicious traffic, ensuring a first layer of protection against DDoS attacks. Level 2 has to be purchased in available locations.

An example of Level 2 protection would be our Unreal Engine 5 Generic Protection.


See [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric) to learn how to enable Level 2 protection.

### Level 3 - Proof of Identity using Deep Packet Inspection

> Integration into the game by the developer is needed.

Level 3 uses deep packet inspection for real-time network flow analysis, while sFlow data provides insights into traffic patterns over time.

With 0% false positives, it only lets valid traffic flow through.

This is currently the highest level of protection we offer with SteelShield as it enables advanced capabilities through deeper integration with the game.

See [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin) to learn how to implement Level 3 protection into your game using our Unreal Engine Plugin.
