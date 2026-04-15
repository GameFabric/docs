# Armada scaling

GameFabric provides several mechanisms to control game server capacity per Region Type, balancing cost and player availability.
Each mechanism addresses a different aspect of scaling, from static configuration to demand-driven automation.

## Replicas and buffer size

Every Armada is configured with three core scaling parameters per Region Type:

- **Minimum Replicas**: the lowest number of game servers running at any time.
- **Maximum Replicas**: the upper bound on game servers that can be started.
- **Buffer Size**: the approximate number of game servers kept in the `Ready` state, waiting to be allocated.

These values determine how quickly players find a game server and how much idle capacity is maintained.
Getting them right depends on game server startup time, session duration, and expected concurrent users.

For detailed guidance, including worked examples and input validation rules, see [Replicas and buffer size](/multiplayer-servers/multiplayer-services/armada-replicas-and-buffer).

## Dynamic buffer (Alpha)

Instead of choosing a fixed buffer size, the Dynamic Buffer option lets GameFabric adjust the buffer automatically based on observed player demand.

When enabled, GameFabric recalculates the buffer at two levels: a baseline per Region Type derived from overall demand trends, and a per-Site local adjustment based on `Ready` and `Allocated` counts, startup time, and allocation patterns.
A slider controls the trade-off between cost efficiency and availability.

Dynamic Buffer requires at least 24 hours of allocation data to stabilize and should be monitored closely after enabling.

For configuration details and slider values, see [Dynamically configuring the buffer size](/multiplayer-servers/multiplayer-services/armada-replicas-and-buffer#dynamically-configuring-the-buffer-size-alpha).

## Scale to Zero (Alpha)

Scale to Zero is a cost-saving feature that scales down lower-priority Region Types when there is no demand, and automatically scales them back up when demand returns.

It works by monitoring utilization across Region Types within a Region.
When the higher-priority Region Type (for example, baremetal) has spare capacity, GameFabric can scale the lower-priority Region Type (for example, cloud) down to zero replicas.
When utilization rises above a configurable threshold, the lower-priority Region Type is scaled back up.

Scale to Zero requires at least two Region Types per Region and is configurable per Armada and Region.

For a full explanation of utilization metrics, panic behavior, and configuration options, see [Scale to Zero](/multiplayer-servers/multiplayer-services/scale-to-zero).
