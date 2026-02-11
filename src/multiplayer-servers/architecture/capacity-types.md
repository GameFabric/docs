# Capacity types

GameFabric supports three types of hosting capacity for running game servers. Each type offers different tradeoffs in terms of control, cost, and management overhead.

## Bare metal

Bare metal capacity consists of physical servers owned and operated by Nitrado. This is the default capacity type for most GameFabric deployments.

Key characteristics:

- **Managed by Nitrado**: Locations and Sites are configured by Nitrado.
- **High performance**: Dedicated physical hardware with no virtualization overhead.
- **Cost-effective**: Often preferred over cloud for cost optimization when capacity is predictable.
- **Integrated billing**: All costs are billed through GameFabric.
- **Density**: Supports up to 150 game servers per node.

Bare metal Locations are not configurable through the GameFabric UI. To request additional bare metal capacity, submit a request via the [GameFabric Help Center](/multiplayer-servers/getting-started/glossary#gamefabric-help-center).

## GameFabric Cloud

GameFabric Cloud enables provisioning and deprovisioning of cloud Locations directly from the GameFabric UI, without requiring a separate cloud provider subscription.

Key characteristics:

- **Self-service provisioning**: Provision and deprovision cloud Locations through the GameFabric UI.
- **Powered by GCP**: Built on Google Cloud Platform's high-performance infrastructure, utilizing a specialized selection of machine types optimized for GameFabric workloads.
- **Integrated billing**: All costs are billed through GameFabric.
- **Density**: Supports up to 100 game servers per node.

To provision GameFabric Cloud capacity, see [GameFabric Cloud](/multiplayer-servers/getting-started/gamefabric-cloud).

::: info
GameFabric Cloud capacity cannot be added at Locations that are already provisioned through Bring Your Own Cloud (BYOC).
:::

## BYOC

BYOC (Bring Your Own Cloud) allows GameFabric to manage resources within a customer's own cloud provider account.
The customer maintains their own cloud subscription and billing relationship with the cloud provider.

Key characteristics:

- **Customer-owned infrastructure**: Resources run in your cloud account.
- **Customer responsibility**: Ensure your cloud account has appropriate quotas and configurations to support the required resources.
- **Setup via Nitrado**: After granting IAM access, Nitrado creates and manages Locations and Sites.
- **Multi-cloud support**: Supports Google Cloud Platform, Amazon Web Services, and Microsoft Azure with full machine type flexibility.
- **Separate billing**: Cloud costs are billed directly by your cloud provider, preserving any negotiated rates or committed-use discounts.
- **Density**: Supports up to 100 game servers per node.

To set up BYOC, see [Configuring your Cloud Provider](/multiplayer-servers/getting-started/cloud-provider-setup).

## Comparison

The following table summarizes the key differences between capacity types:

| Aspect                 | Bare metal      | GameFabric Cloud    | BYOC              |
|------------------------|-----------------|---------------------|-------------------|
| Infrastructure owner   | Nitrado         | Nitrado             | Customer          |
| Cloud providers        | N/A             | GCP                 | GCP, AWS, Azure   |
| Capacity request       | Help Center     | Self-service via UI | Help Center       |
| Billing                | GameFabric      | GameFabric          | Cloud provider    |
| Game servers per node  | Up to 150       | Up to 100           | Up to 100         |
| Customer action required | Request via Help Center | Request via UI | IAM configuration |

## Prioritizing capacity types

Use [Region Types](/multiplayer-servers/getting-started/setup-your-environment#create-a-region) to prioritize how game servers are distributed across different capacity types.
For example, configure bare metal with a higher priority (lower number) than cloud to optimize costs while still enabling burst capacity in the cloud when needed.
