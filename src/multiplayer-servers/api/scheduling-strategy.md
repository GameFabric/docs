# Scheduling Strategy

The scheduling strategy controls how GameServers are distributed across nodes during allocation.

::: warning API Only
This feature is currently only available via the API.
:::

## Overview

When creating or updating a Region, you can configure the `scheduling` field within each Region Type's template to control GameServer placement behavior. This setting applies to both Armadas and Vessels deployed in the Region.

## Options

| Value         | Description                                           | Use Case                                                |
|---------------|-------------------------------------------------------|---------------------------------------------------------|
| `Packed`      | Bin-packs GameServers onto the fewest nodes possible  | Cloud/dynamic clusters - optimizes infrastructure costs |
| `Distributed` | Spreads GameServers evenly across all available nodes | Static/on-premises clusters - maximizes fault tolerance |

**Default**: `Packed`

## API Usage

The scheduling strategy is configured per Region Type.
In the API payload, set `template.scheduling` on each entry in `spec.types`.
For the full API specification, see the [Region API reference](/api/multiplayer-servers/apiserver#tag/core.v1.Region/operation/createRegion).

The following snippet shows the relevant structure:

```json
{
  "spec": {
    "types": [
      {
        "template": {
          "scheduling": "<Packed|Distributed>"
        }
      }
    ]
  }
}
```

### Full example

The following request creates a Region with the `Packed` scheduling strategy:

```bash
curl -X 'POST' \
     "https://${GAMEFABRIC_URL}/api/core/v1/environments/${ENV}/regions" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -d '{
  "apiVersion": "core/v1",
  "kind": "Region",
  "metadata": {
    "name": "eu-west",
    "environment": "<your-environment>"
  },
  "spec": {
    "displayName": "EU West",
    "description": "European West region",
    "types": [
      {
        "name": "default",
        "locations": ["<your-location>"],
        "template": {
          "scheduling": "Packed"
        }
      }
    ]
  }
}'
```

## Use cases

### Packed (default)

This strategy is most relevant in the following scenarios:

- For cloud environments where you pay per node
- For dynamic clusters that scale based on demand
- When cost optimization is a priority

### Distributed

This strategy is most relevant in the following scenarios:

- For on-premises or static clusters
- When there are high availability requirements
- For even resource distribution across infrastructure

## Reference

- For the full Region API specification, see the [Region API reference](/api/multiplayer-servers/apiserver#tag/core.v1.Region/operation/createRegion).
- For more details on how scheduling affects GameServer allocation, see the [Agones GameServerAllocation documentation](https://agones.dev/site/docs/reference/gameserverallocation/).
