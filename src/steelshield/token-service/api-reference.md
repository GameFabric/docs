# Token Service API Reference

This page describes the API that game clients call to fetch SteelShield Tokens.

## Overview

The Token Service exposes a single REST endpoint that game clients call to obtain a SteelShield token.
The returned token is used to authenticate legitimate game traffic.

### Endpoint

GameFabric provides you with the full URL based on the GameFabric tenant name, the Token Service's configured **Game name** and the selected platform.

Each supported platform can have its own authentication configuration.
See [Authentication Types](/steelshield/token-service/authentication-types) for details, including on what JWT needs to be sent as `gameClientToken`.

## Request

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Platform key as displayed in the Token Service list (see [Accessing Token Services](/steelshield/token-service/managing-token-services#accessing-token-services)). Format as `Bearer <key>`. |
| `Content-Type` | Yes | Always set this to `application/json`. |

### Body

```json
{
  "environment": "prod",
  "authProvider": "eos",
  "gameClientToken": "<JWT>",
  "clientVersion": "1.0.0",
  "userLocalTime": "2024-02-01T09:00:22Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `environment` | string | Yes | An arbitrary identifier for the *game client*'s environment. Not the same as the *Token Service*'s **Environment** configuration. |
| `authProvider` | string | Yes | Identifies the source of the `gameClientToken`. Use `eos` for **EOS**, or your GameFabric tenant name for **Custom Keys**, **Generated Keys**, and **JWKS**. See [authProvider](#authprovider) for details. |
| `gameClientToken` | string | Yes | A JSON Web Token (JWT) identifying the client, as handed out by the authentication provider. For **Custom keys** or **JWKS** authentication, the JWT payload must contain a `ui` field providing the player's ID. |
| `clientVersion` | string | Yes | The version of the game client making the request. |
| `userLocalTime` | string | No | The current timestamp of the system the game client is running on (RFC 3339 format). Used to detect client-side time drift. |

#### authProvider

The `authProvider` value identifies the source of the `gameClientToken`.
The Token Service compares it with the value it was provisioned with, and rejects the request if they do not match.
The correct value depends on the authentication method of your Token Service.
See [Authentication Types](/steelshield/token-service/authentication-types) for details on each method.

- **EOS authentication**: always `eos`, regardless of your tenant name.
- **Custom Keys**, **Generated Keys**, or **JWKS** authentication: your GameFabric tenant name (the first segment of your GameFabric installation URL, e.g. `example` in `https://example.gamefabric.dev`).

GameFabric determines the provisioned value when it creates your Token Service.
You do not configure it in the GameFabric UI; your game client has to send it in every request.
On *Development* Token Services, a mismatch results in a `400` error, while *Production* instances respond with success and a non-functional token instead (see [Error responses](#error-responses)).

You can find the value in the Token Service endpoint URL: it is the segment after `v1` in the path.

The following example shows a request for a Token Service of the tenant `example` that uses **Custom Keys** authentication:

```json
{
  "environment": "prod",
  "authProvider": "example",
  "gameClientToken": "<JWT signed by your authentication backend>",
  "clientVersion": "1.0.0",
  "userLocalTime": "2024-02-01T09:00:22Z"
}
```

## Response

### Success (200 OK)

```json
{
  "Issuer": "SteelshieldTokenService",
  "IssuedAt": 1658409341,
  "Token": "ASW0nTmza9+Wv79PTIXYZ5dkJhjdHb6hBwAAAH1R2WJwVD8h610xXZ6aeVfQx02GackyvZzTSme+U5Frt+bGhw=="
}
```

| Field | Type | Description |
|-------|------|-------------|
| `Issuer` | string | Always `SteelshieldTokenService`. |
| `IssuedAt` | number | Unix timestamp of when the token was issued. |
| `Token` | string | The generated SteelShield token (base64-encoded). |

### Error responses

::: warning
Error codes are only returned on Token Services configured as *Development* instances.
*Production* instances will mask this.
:::

| Status | Description |
|--------|-------------|
| 400 | Bad request. Payload is not properly formatted or has missing or invalid data. |
| 401 | Unauthorized. Platform key is invalid. |
| 403 | Forbidden. The player is blacklisted. |
| 422 | Unprocessable Entity. The payload is well-formed but the game client token is invalid or expired. |
| 500 | Internal Server Error. A server-side error occurred. |
