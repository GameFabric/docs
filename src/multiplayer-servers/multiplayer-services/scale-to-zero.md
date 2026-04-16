# Scale to Zero

Scale to Zero is a cost-saving feature that allows GameFabric, when enabled, to scale down configured capacity when there is no demand.
This can save infrastructure costs.
When demand returns, GameFabric automatically scales up the capacity to meet it.

::: warning Alpha feature
Scale to Zero is currently in Alpha and should be used with caution, as it can lead to unexpected scaling decisions.
It is recommended to test the feature thoroughly in a staging environment before enabling it in production, and to monitor the scaling decisions frequently.
:::

The feature is disabled by default, and is configurable per [Armada](/multiplayer-servers/getting-started/glossary#armada) and [Region](/multiplayer-servers/getting-started/glossary#region).
It can only scale down capacity when base capacity is available.
Availability of base capacity is ensured by requiring at least two Region Types within the Region, so that the highest priority Region Type can serve as base capacity, allowing GameFabric to determine whether demand is low enough to scale down the lower priority Region Type.

## Recommended Region Types

A Region describes a geographic location, whereas a Region Type splits these locations logically.

The most common Region Types distinguish _baremetal_ from the different _cloud_ capacities, usually prioritized by cost or performance.

The priority allows GameFabric to put game servers on the higher priority Region Type first, and only when there is no capacity left, on the lower priority Region Types.

**Example:**

- Region `US`
    - Region Type `baremetal`
    - Region Type `cloud`
- Region `EU`
    - Region Type `baremetal`
    - Region Type `cloud`

### Alternatives

Other configurations are also possible, such as prioritizing by performance, when only cloud offers the ideal CPUs, or when baremetal experiences connection issues.

## Utilization

Utilization is the percentage of used capacity compared to the total available capacity per Armada Region Type.
When utilization hits a certain configurable threshold, GameFabric scales up the capacity of the lower priority Region Type.
When utilization drops below a certain configurable threshold, GameFabric scales down the capacity of the lower priority Region Type.

The Region Type with the highest priority is never scaled down (state `ScaledUpLocked`).

**Example:**

Listed are two Armadas running in the same Region.

- `Armada 1` / `EU` / `baremetal` is at `90%`, and would scale up `cloud`<sup>1</sup>, while
- `Armada 2` / `EU` / `baremetal` is at `30%`, and would not scale `cloud`<sup>1</sup>.

<table width="100%">
  <thead>
    <tr valign="top">
      <th>Armada</th>
      <th>Region</th>
      <th>Region Type</th>
      <th>Prio</th>
      <th>Metric</th>
      <th colspan="2">Utilization</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">Armada 1</td>
      <td rowspan="4">EU</td>
      <td rowspan="2">baremetal</td>
      <td rowspan="2">0</td>
      <td>Replicas</td>
      <td>90%</td>
      <td rowspan="2">90%</td>
    </tr>
    <tr>
      <td>Resource usage<sup>2</sup></td>
      <td>30%</td>
    </tr>
    <tr>
      <td rowspan="2">cloud</td>
      <td rowspan="2">1</td>
      <td>Replicas</td>
      <td>0%</td>
      <td rowspan="2">0%</td>
    </tr>
    <tr>
      <td>Resource usage<sup>2</sup></td>
      <td>0%</td>
    </tr>
    <tr>
        <td rowspan="4">Armada 2</td>
        <td rowspan="4">EU</td>
        <td rowspan="2">baremetal</td>
        <td rowspan="2">0</td>
        <td>Replicas</td>
        <td>10%</td>
        <td rowspan="2">30%</td>
    </tr>
    <tr>
      <td>Resource usage<sup>2</sup></td>
      <td>30%</td>
    </tr>
    <tr>
        <td rowspan="2">cloud</td>
        <td rowspan="2">1</td>
        <td>Replicas</td>
        <td>0%</td>
        <td rowspan="2">0%</td>
    </tr>
    <tr>
      <td>Resource usage<sup>2</sup></td>
      <td>0%</td>
    </tr>
  </tbody>
</table>

<sup>1)</sup> if configured that way,
<sup>2)</sup> Note that resources are Armada-independent, but they affect each other's utilization.

### Replicas

One metric to calculate the utilization is replicas divided by max replicas. Numbers are collected per Armada Region Type.

The **replicas** represent the desired total number of game servers, including the minimum number of replicas, the buffer size, and the number of servers that have already been `Allocated`.
This number includes all game servers in all states, including but not limited to:
`Starting`, `Ready`, `Unhealthy`, and `Error`.

The **max replicas** are the maximum number of replicas.
It is configurable as part of the Distribution, see **GameFabric > Armada > Scaling** or via API `armada.spec.distribution[].maxReplicas`.

### Resource usage

Another metric to calculate the utilization is the resource usage divided by the resource limits. Numbers are collected per Region Type.

Game servers consume resources, such as CPU, Memory and Pod count.

The **resource usage** is the actual resources consumed by all Armadas, or Vessels, running on a particular Location that belongs to that Region Type.

::: info Scaled to Zero does not mean 0% utilization
One Armada can impact the utilization of another Armada, leading to its scale up even when load for that Armada seems stable.
This can also lead to the false expectation that an Armada Region Type that is scaled to zero must have a 0% utilization.
:::

The **resource limits** are the maximum resources that can be consumed by all Armadas, or Vessels, running on a particular Location that belongs to that Region Type.
The limit is currently configured.

::: warning Node Outage
Since the resource limits are configured, and not calculated, a node outage might lead to inaccurate resource limits,
and thus inaccurate utilization, which can lead to wrong scaling decisions.
:::

### Panicking or no ready replicas

The last metric does not impact the calculated utilization, but can override the scaling decisions.

**Ready replicas** are the number of game servers that are in the `Ready` state, which means they are healthy and available to be allocated to players.
If this number drops to zero, it means that there are no more game servers available. This can either mean game servers are being allocated quickly,
or mean the buffer size is too low, or the game server startup time is too long.

[Dynamic Buffers](./armada-replicas-and-buffer#dynamically-configuring-the-buffer-size) can be used to mitigate this, but a very high and sudden increase
cannot be mitigated.

Another reason for no more ready replicas could be that game servers are unable to _become_ ready. This can be caused by various issues,
such as problems with the game server configuration, issues with the underlying infrastructure, or problems with the game server software itself.

In any case, when there are no `Ready` replicas left for several consecutive checks, and at least the duration of the (configurable) Autoscaler interval,
GameFabric panics and immediately scales up the lower priority Region Type, regardless of the calculated utilization, to quickly provide more capacity.
This state is reported as `ScaleUpPanicked`, whereas regular states are `ScaledUp` and `ScaledToZero`.

::: warning Negative impact of panicking
There is a trade-off when panicking, as a misconfiguration of the game server can find its way into expensive cloud,
even when the misconfiguration and the inability to start the game server has nothing to do with capacity.

There is no way for GameFabric to determine reliably what kind of issue is causing the lack of ready replicas, and so it panics to be on the safe side,
as without Scale to Zero, the lower priority Region Type would already be scaled up.
:::

## Reaction time

The reaction time of Scale to Zero depends on the Autoscaler interval, which sets the desired replicas.
It defaults to `30s` and can be configured per Armada, see **GameFabric > Armada > Advanced** or via API `armada.spec.autoscaler.fixedInterval.seconds`.

The observed replicas are reported back in real-time, but subject to rate-limiting on the cluster and GameFabric side, each usually around `10s`,
leading to another potential delay.

A realistic reaction time for Scale to Zero is <2 minutes.

## Configuration

There are two configuration options for Scale to Zero, which can be set on an Armada/Region-level.
Finding a good configuration is crucial for a good balance between cost-saving and performance, and can be different for each game, or even each Region.

- **Scale Up Utilization**:

  The threshold at which GameFabric scales up the lower priority Region Type. Valid values must be between 1 and 99, but values equal to 95% or higher are
  highly discouraged.

  ::: warning Values >= 95% are highly discouraged
  No one wants to waste resources, but game servers and infrastructure take time to start up.
  When the threshold is too high, it can lead to a very late scale up.

  Additionally and more important, in some situations it might be possible that no more game servers fit into the remaining capacity,
  but the scale up utilization is not yet hit. This leaves the lower Region Type scaled to zero, even though there is demand.
  :::

- **Scale Down Utilization**:

  The threshold at which GameFabric scales down the lower priority Region Type.

It is allowed to set both Scale Up and Scale Down Utilization to the same value, but this can lead to flapping and increased scaling activity.
It is recommended to have at least a 5% gap between the two.

::: info
The UI only allows to set the Scale Up Utilization, and automatically sets the Scale Down Utilization to 5% less.
For this reason the minimum value for Scale Up Utilization is 6%.
:::
