---
title: "Authentication Types"
description: "A Token Service can be configured with one of three main authentication methods. Each method determines how the Token Service verifies game client tokens."
---

# Authentication Types

A Token Service can be configured with one of three main authentication methods.
Each method determines how the Token Service verifies game client tokens.

## Custom Keys

With the **Custom Keys** mode, you provide one or more PEM public keys.
The Token Service uses these keys to verify the signature of game client tokens.
This is your most flexible option: It can be used with your own signing infrastructure, e.g. a custom unified login platform for your players.

- **Supported algorithms:** RS256, RS384, RS512, ES256, ES384, ES512.
- **Key format:** PEM (RSA or EC public keys).

::: warning API Only
Defining multiple signature methods is an API-only feature.
:::

### Generated Keys

As a variation to **Custom Keys**, you can select **Generated Keys** to generate an RSA key pair in the browser.
The public key is stored in the Token Service configuration and the private key is given to you once to be used by your game's authentication backend.

- **Algorithm:** RS256.
- **Key format:** PEM.
- **Use case:** When you need a quick setup without external key management.

::: warning
The private key is never seen by GameFabric's backend, it is only shown once and cannot be retrieved later.
Make sure to save it securely.
Do not include it with the game client, it is only meant for signing use by the authentication backend.
:::

## EOS (Epic Online Services)

EOS authentication validates tokens issued by Epic Online Services.
This mode is for games already depending on EOS for player authentication.

To use this authentication method **EOS** must be the only selected platform.
No other platform is available when EOS is active.

::: tip Token Types
Use [**Connect**](https://dev.epicgames.com/docs/epic-online-services/eos-fundamentals/connect-interface) tokens only.
The UI automatically configures EOS for **Connect** token use. **Auth** tokens are not fully supported.
:::

::: warning Specific IDs
The API optionally allows specifying individual deployment/product/sandbox IDs. These IDs will not be displayed in the UI.
:::

## JWKS

JWKS (JSON Web Key Set) authentication uses a remote JWKS endpoint to fetch the public keys needed to verify tokens.
Use this if you have an authentication backend that already has its own JWKS endpoint to provide its public keys dynamically.

- **Protocol:** HTTPS only.
- **Endpoint:** A URL to a JWKS endpoint (e.g., `https://example.com/.well-known/jwks.json`).
- **Use case:** When your tokens are signed by an external identity provider that supports JWKS.

The JWKS endpoint is fetched periodically to refresh the public keys.
The Token Service uses the keys from the JWKS endpoint to verify tokens.
