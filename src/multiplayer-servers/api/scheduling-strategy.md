# Scheduling Strategy

The scheduling strategy controls how GameServers are distributed across Kubernetes nodes during allocation.

::: warning API Only
This feature is currently only available via the API. UI support is planned for a future release.
:::

## Overview

When creating or updating a Region, you can configure the `scheduling` field within each Region Type's template to control GameServer placement behavior.

## Options

| Value | Description | Use Case |
|-------|-------------|----------|
| `Packed` | Bin-packs GameServers onto the fewest nodes possible | Cloud/dynamic clusters - optimizes infrastructure costs |
| `Distributed` | Spreads GameServers evenly across all available nodes | Static/on-prem clusters - maximizes fault tolerance |

**Default**: `Packed`

## API Usage

The scheduling strategy is configured per Region Type at:

```
spec.types[].template.scheduling
```

### Example

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

## When to use each strategy

### Packed (default)

- Cloud environments where you pay per node
- Dynamic clusters that scale based on demand
- Environments where cost optimization is a priority

### Distributed

- On-premises or static clusters
- High availability requirements
- Even resource distribution across infrastructure

## Reference

For more details on how scheduling affects GameServer allocation, see the [Agones GameServerAllocation documentation](https://agones.dev/site/docs/reference/gameserverallocation/).
