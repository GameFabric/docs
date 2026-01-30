# Armada Replicas and Buffer

An Armada can spin up one game server, thousands of game servers, or anything in between, including no game servers as the special case of [Scaling Down](#scaling-down).
The number of game servers running in each Region Type is determined by the Replicas and Buffer settings:

- Minimum Replicas
- Maximum Replicas
- Buffer Size

When configured too generously, it can lead to unnecessary costs, as game servers are running idle without players using them.
When configured too conservatively, such as if not enough `Ready` game servers are provided in time, it can lead to a poor player experience.

![Distribution](images/armada/replicas-and-buffer-size.png)

## Minimum/Maximum Replicas

Replicas are the number of game servers running in any given state, from `Starting` to `Ready`, from `Allocated` to `Unhealthy`, `Shutdown` or `Error`.

No matter the state of the game servers, the **Minimum Replicas** setting makes sure there are at least that many game servers running at any given time.
If that is not the case, GameFabric spins up new game servers.

The **Maximum Replicas** setting makes sure no more game servers are started when the total number of game servers reaches that number.

## Buffer Size

The Buffer Size is the [approximate](#buffer-size-1) number of game servers that are kept in the `Ready` state, waiting to get `Allocated`.
This is important so players can find a game server quickly, without having to wait for a new game server to start up.

Without Buffer Size, GameFabric would not replace newly `Allocated` game servers with `Ready` game servers.

## Input Validation

When configuring an Armada, the following validation rule applies:

<span class="nbsp">`BufferSize <= MinimumReplicas <= MaximumReplicas`</span> 

whereas <span class="nbsp">`0, 0, 0`</span> is considered <span class="nbsp">[Scaling Down](#scaling-down).</span>

::: info Technical Background
Armadas are Fleets in Agones terminology and have a single Replicas setting.

The Replicas setting is determined by `Allocated` game servers plus Buffer Size, refreshed by default every `30s`, with the Minimum and Maximum Replicas acting as boundaries.

This explains why the Minimum cannot be lower than the Buffer Size; otherwise, it would never be effective.
:::

## Finding the Right Values

Finding the right values for Minimum Replicas, Maximum Replicas, and Buffer Size is non-trivial and relies on historical data, prior experience, and expectations of future demand.

![img.png](images/armada/armada-game-server-states.png)

### Buffer Size

The Buffer Size is the number of `Ready` game servers. Even when no players are playing, these game servers are running and waiting for players to join.

The **recommended default** when there is no experience or history to look at is to set the Buffer Size to 10% of the Maximum Replicas.
Once there is some history to look at, the Buffer Size should be adjusted.

**Important factors to determine the Buffer Size:**

1. **Game server startup time:**
   
   Quicker startup times reduce the need for a large Buffer Size.
2. **Game session duration:**

   Shorter game sessions increase the churn of players leaving and joining new game sessions, increasing the need for a larger Buffer Size.

3. **Concurrent users (CCU):**

   More players increase the number of game servers that are `Allocated` at any given time, increasing the need for a larger Buffer Size.

Every game has different characteristics, so there is no one-size-fits-all recommendation.
Let's approach the problem to find the right value with an example.

<details>
<summary>Buffer Size Example</summary>

::: info Example

The following assumptions are made for a Region Type:

- Average game server startup time is `30s`,
- Average game session lasts `10m`,
- Average CCU is `1500` players,
- Game type in that Region is 3on3 (`6` players).

Intermediate conclusion:

- `250` game servers are `Allocated` (`1500/6`).
- Around 5% (`30s/10m`) or ~`12.5` game servers must be `Ready` at any given time just to accommodate the current player base.

It is safe to assume doubling the calculated Buffer Size to 25 game servers is a good starting point to accommodate decent spikes in player count.
If there is the expectation of steeper spikes, like in the evening or at the weekend, the Buffer Size can be increased further.

For this example, without further information, the recommended Buffer Size could be `25`.

:::

</details>

**What happens if the Buffer Size is set too low?**

Players have to wait for a game server to start up, leading to a poor player experience.

**What happens if the Buffer Size is set too high?**

Game servers are running idle, leading to unnecessary costs.

::: info Recommendation
Frequently revisit and adjust the Minimum Replicas, Maximum Replicas, and Buffer Size settings to avoid unnecessary costs or poor player experience.
:::

### Minimum Replicas

Choosing a value for the Minimum Replicas is mostly driven by the Buffer Size, as the Minimum Replicas must always be at least as high as the Buffer Size.

The **recommended default** is to set the Minimum Replicas to the value of the Buffer Size.

In case of an upcoming Release or Launch, with the expectation of an instant high player count, the Minimum Replicas can be set to a higher value to ensure enough game servers are running initially to accommodate the expected load.
It is vital to review and adjust the value after the initial peak has subsided, to avoid unnecessary costs.

### Maximum Replicas

When looking from a resource perspective, the Maximum Replicas can be estimated by the available resources on the Location associated to the Region Type, divided by the average resource consumption of the game server.
The fact that the resource consumption of game servers varies depending on their state (`Ready` vs `Allocated`) makes it hard to find the optimal value.

**Important factors to determine the Maximum Replicas:**

1. **Available resources:**
   
   The total CPU and Memory available on the Locations associated to the Region Type define the technical limit for the Maximum Replicas.

2. **Game server resource consumption:**

   The CPU and Memory consumption of game servers in different states define how many game servers can be run on the available resources.

Let’s approach the problem to find the right value with an example.

<details>
<summary>Maximum Replicas Example</summary>

::: info

- Two Locations (`2`) are associated to the Region Type
- Each Location has `64` CPU cores and `128Gi` of RAM available for game servers.
- Each `Allocated` game server requires `4` CPU cores and `6Gi` of RAM.
- Each `Ready` game server requires `2` CPU cores and `4Gi` of RAM.

Intermediate conclusion:
- CPU-wise `32` game servers for (`2*64/4`) `Allocated` fit into these Locations,
- Memory-wise `42` game servers (`2*128/6`) for `Allocated`,
- CPU-wise `64` game servers (`2*64/2`) for `Ready`,
- Memory-wise `64` game servers (`2*128/4`) for `Ready`.

The Maximum Replicas is somewhere between 32 and 64, depending on the current or expected ratio between `Allocated` and `Ready` game servers.
This is quite a wide range, so a more conservative approach is recommended.

To be on the safe side, assume a 50/50 split between `Allocated` and `Ready` game servers.

For this example, without further information, the recommended Maximum Replicas could be `48`.

:::

</details>

**What happens if the Maximum Replicas is set too low?**

Resources are wasted. Nodes in these Locations may have available resources, but no new game servers are started because the Maximum Replicas limit has been reached.

**What happens if the Maximum Replicas is set too high?**

The Compute Resource Request setting for the Armada always applies, so the game server has guaranteed resources, or is not scheduled to the Location at all, but more resources can only be obtained when the Location has available resources.
If that is not the case, game server performance can degrade with reduced CPU availability, or OOMKills may occur when memory is overcommitted.

::: warning
The Maximum Replica is not only a consideration of physical resources, but also financial protection.
Whether through player peaks, due to bugs or DDoS attacks, always choose a limit that is within your budget, especially on cloud.
:::

## Scaling Down

To gracefully scale down a Region Type, the Minimum Replicas, the Maximum Replicas, and the Buffer Size can be set to zero.
Game servers that are `Allocated` will continue to run until they are `Shutdown`, but no new game servers will be started.
