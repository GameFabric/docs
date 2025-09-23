# Introduction

## Description

SteelShield is a DDoS protection system designed for the specific purpose of protecting game servers from large scale DDoS
attacks. It achieves this by intercepting network traffic on the path to the game server, and identifying whether the
combination of source address, destination address, port and network packet contents match the type of packets which
would normally be expected for that game server.



## Protection Levels

::: info
This describes the situation inside Nitrado's own infrastructure.
:::

### Level 1 - Reactive Rate Limiting
> No integration needed from the Developer<br>
> this is enabled for every gameserver running on our bare metal servers


Reactive Rate Limiting based on packet size and packets per second. Level 1 is always activated for all customers at no additional charge, in available locations.



### Level 2 - Basic Traffic Filtering and Whitelisting
> No integration needed from the developer.

Restrict traffic to specific ports and apply game specific basic filtering to block obvious malicious traffic, ensuring a first layer of protection against DDoS attacks. Level 2 has to be purchased in available locations.

For example: Unreal Engine generic protection

The customer can choose protocols to improve protection ( UDP / TCP).

see [Configure protection in GameFabric](/steelshield/gamefabric/gamefabric) for how to enable this

### Level 3 - Full Proof of Identity using Deep Packet Inspection
Usage of deep packet inspection for real-time network flow analysis, while sFlow data provides insights into traffic patterns over time. With 0% false positive, it allows us only to pass valid traffic.

Best level of protection from SteelShield

> Integration work required by the developer

see [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/using-the-plugin) for how to implement

