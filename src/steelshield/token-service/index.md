# Token Service Overview

The Token Service is a public-facing API used for [Proof of Identity](/steelshield/gamefabric/introduction#level-3-proof-of-identity-using-deep-packet-inspection) in SteelShield. It authenticates game clients and issues **SteelShield Tokens** that are used to authorize game traffic.

## How SteelShield Tokens work

Before a game client can connect to a SteelShield-protected server with Proof of Identity enabled, it must first fetch a **SteelShield Token** by authenticating via the game's authentication backend (e.g. a username/password account system).
The backend issues a signed **JSON Web Token (JWT)** to the game client to clearly identify it.
The public key used for the JWT's signature is shared between the game author and GameFabric.

The game client submits the **JWT** to the Token Service for signature verification.
If the verification passes, the response includes a valid **SteelShield Token**.

The returned **SteelShield Token** is then prepended to all network packets sent by the game client to the game server.
SteelShield intercepts this traffic and validates the issued **SteelShield Token**.

Should the **SteelShield Token** be missing, or not match one issued respectively, then the network packet is dropped by the **SteelShield service** and is never received by the **game server**.

With this, large DDoS attacks from botnets or via reflection attacks are stopped before reaching the game server as they do not get through the authentication process to receive a valid **SteelShield Token** which allows their traffic to pass through.

While an attacker can perform the authentication process and then use their **SteelShield Token** in an attack, the **SteelShield Token** would be able to be traced back to that individual's account, and the user banned.

### Validity/Rollover

A **SteelShield Token** is only considered valid for a single connection with a game server and expires after some amount of time.
It needs to be rolled over at an interval in order to ensure that a stolen token can not be used in future DDoS attacks.
Our recommendation is **every 15 minutes** which is also implemented in the [Unreal Engine Plugin](/steelshield/unreal-engine-plugin/introduction).

## Where to go from here

- [Managing Token Services](/steelshield/token-service/managing-token-services): how to create and edit Token Services in the GameFabric UI.
- [Authentication Types](/steelshield/token-service/authentication-types): details about the different authentication methods.
- [Token Service API Reference](/steelshield/token-service/authentication-types): details on how to fetch SteelShield Tokens via the Token Service.
- [GameFabric API Reference](/api/multiplayer-servers/apiserver): the full GameFabric API specification, including the Token Service provisioning endpoints.
