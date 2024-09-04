# Gateway Policies

Gateway policies provide an additional layer of protection for your game infrastructure by 
redirecting specific outgoing game server traffic to destinations such as your game backend.

If SteelShield is active, it might also block legitimate connection attempts or responses 
due to its lack of awareness of your legitimate outgoing traffic.

Implementing Gateway Policies offers an effective solution to prevent both issues.

## Attack Scenario

Without gateway policies, an attacker can spoof a game host's IP address and send malicious requests to your game backend. 
In response, you or your hosting provider might decide to block the IP address. 
As a result, your game host, including legitimate game server traffic, 
would no longer be able to communicate with your game backend.

By redirecting traffic from your game server through the gateway, 
the traffic originates from gateway IP addresses that are typically unknown to attackers. 
This makes spoofing a game host's IP address largely ineffective.

## Pre-requisites

In order to protect your game server's traffic, your GameFabric installation requires:

- Protection support enabled, usually indicated by the presence of the Protection/SteelShield navigation item.
- Sites that support Gateway Policies.

## Gateway Policy

A Gateway Policy specifies a set of destination CIDRs for which outgoing traffic should be redirected.

![create-gateway-policy.png](images/create-gateway-policy.png)

To manage your various game backends or other services you interact with, 
you can create multiple Gateway Policies and assign them to your ArmadaSet, Armada, Formation, and Vessel.

![select-gateway-policies.png](images/select-gateway-policies.png)

You can assign the Gateway Policies in the Advanced Settings section of your game server configuration in GameFabric.

::: warning
The assignment triggers an immediate rollout with the new policy assignment.
Allocated game servers as always are not affected, so they keep running under the old setup.
:::

## Exceptions

In some cases, especially when there is a large number of new game servers,
the application of the policy to a new game server may be delayed, 
allowing traffic that is meant to be routed through the gateway to leave via the game host.

