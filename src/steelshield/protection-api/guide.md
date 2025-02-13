# Steelshield Protection API

The Protection API is a key component of the SteelShield system, a specialized anti-DDoS solution tailored for game server traffic.

The API enables both customers and developers to interact with SteelShield's protection mechanisms, providing visibility into the protection status of game server IPs and allowing configuration of protection settings.
It integrates with external data sources such as GoBGP and FastNetMon to ensure real-time updates and accurate status monitoring.

## Purpose

The API lets you manage and monitor the protection of your game servers.
It allows you to toggle protection and view the real-time protection status of your assets.

## Usage

### Requirements

* Credentials to log into the API
* Your Tenant ID

### Authentication and Authorization

As a tenant, you must first login through the `/auth/v1/login` endpoint, using basic authentication to pass the credentials you were given:

```bash
curl -X POST \
  -u "admin:password" \
  https://protapi.example.com/auth/v1/login | jq

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-01-02T15:04:05Z"
}
```

After receiving an access token, it must be included as a bearer token in the `Authorization` header for subsequent requests.
As a tenant, you have access to the following endpoints:

* `GET /api/v3/locations` lets you see the list of available locations. These can be used to filter IPs.
* `GET /api/v3/tenant/<id>/ips` that allows you to list your protectable IPs to view their status.
* `PATCH /api/v3/tenant/<id>/ips` that lets you enable or disable protection for those IPs.

### Listing locations

If you want to filter your protectable IPs by the locations they are accessible from, you need to know the identifiers for those locations.
Fetching those identifiers can be done using this endpoint.

```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  https://protapi.example.com/api/v3/locations | jq

{
  "items": [
    {
        "id": "dd379b85-aa41-4067-b653-9e8e63a2d163",
        "name": "usnyc",
        "description": "New York, United States"
    },
    {
        "id": "7760a7ff-6360-45b6-a629-b80b4f1ae143",
        "name": "usla",
        "description": "Los Angeles, United States"
    }
  ]
}
```

### Listing protectable IPs

This endpoint fetches the status and specification for IPs that belong to you.
You may filter these IPs by network range, and/or by location ID.

```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "networks": ["192.0.2.0/24"],
    "location_id": "123e4567-e89b-12d3-a456-426614174001"
  }' \
  https://protapi.example.com/api/v3/tenants/gamefabric/ips | jq

{
  "items": [
    {
        "address": "192.0.2.1",
        "tenant_id": "123e4567-e89b-12d3-a456-426614174000",
        "protect": true,
        "locations": ["123e4567-e89b-12d3-a456-426614174001"],
        "status": { "protected": true }
    }
  ]
}
```

### Changing the protection for a set of IPs

This is the endpoint you should use to enable or disable protection for your IPs.

```bash
curl -X PATCH \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "cidrs": ["192.0.2.0/24"],
    "protect": true
  }' \
  https://protapi.example.com/api/tenants/gamefabric/ips | jq

{
  "items": [
    {
        "address": "192.0.2.1",
        "tenant_id": "123e4567-e89b-12d3-a456-426614174000",
        "protect": true,
        "locations": ["123e4567-e89b-12d3-a456-426614174001"],
        "status": { "protected": true }
    }
  ]
}
```

## FAQ & Troubleshooting

> Can I use location names instead of location IDs when filtering?

No, that is not supported at the moment.

> How can I update a single IP instead of a whole network?

You can specify the individual IP, followed by a `/32` network mask.
