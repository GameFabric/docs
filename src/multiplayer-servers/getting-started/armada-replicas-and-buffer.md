# Armada Configuration: Replicas and Buffer

An Armada can spin up no game server, one game server, thousands of game servers, or anything in between.
The number of game servers running is controlled by the Replicas and Buffer settings, configured per Region Type:

- Minimum Replicas
- Maximum Replicas
- Buffer Size

![Distribution](images/armada/replicas-and-buffer-size.png)

When configured too generously, it can lead to unnecessary costs, as game servers are running idle without players using them.
When configured too conservatively, such as if not enough Ready game servers are provided in time, it can lead to a poor player experience.

## Minimum and Maximum Replicas

Replicas are the number of game servers running in any given state, from Starting to Ready, from Allocated to Unhealthy, Shutdown or Error.

::: info
As a reminder, game servers in state Ready are ready to be Allocated to players, while game servers in state Allocated are already assigned to players,
eventually in an active game session.
:::

No matter the state of the game servers, the **Minimum Replica** setting makes sure there are at least that many game servers running at any given time.
If that is not the case, Agones spins up new game servers.

The **Maximum Replica** setting makes sure no more game server are started when the total number of game serversreaches or exeeds that number.

## Buffer Size

The Buffer Size is the number of game servers that are kept in the Ready state, waiting to get Allocated.

This is important so players can find a game server quickly, without having to wait for a new game server to start up.

Without Buffer Size, the Autoscaler would not replace newly Allocated game servers with Ready game servers.

::: info
The setting must match Buffer Size <= Minimum Replicas <= Maximum Replicas.
This is because the Buffer Size is the Ready-subset of the Minimum Replicas, which counts all game servers in any state.
:::

## Finding the Right Values

Finding the right values for the Minimum Replicas, Maximum Replicas, and Buffer Size is not simple and often an estimation based on experience and historical data.

### Maximum Replicas

When looking from a resource perspective, the Maximum Replicas can be determined by the available resources on the Sites associated to the Region Type, 
divided by the resource required per game server.

Example:
- Two Sites are associated to the Region Type
- Each Site has 64 CPU cores and 128 GB of RAM available for game servers.
- Each game server requires 4 CPU cores and 6 GB of RAM.

That means 128 CPU / 4 CPU = 32 game servers when looking at the CPU, and 256 GB / 6 GB = 42 game servers when looking at the RAM.
The lower value is the limiting factor, so the Maximum Replicas should be set to 32, probably less to handle spikes.

Game servers consume more resources when they are Allocated rather than just idling in Ready, which is not considered in the above calculation, 
which makes it even harder to find the optimal value.

::: warning
The Maximum Replica is not only a consideration of physical resources, but a financial protection. 
Whether through player peaks, due to bugs or DDoS attacks, always choose a limit that is within your budget, especially on cloud.
:::

### Buffer Size

The Buffer Size is the number of Ready game servers. Even when no players are playing, these game servers are running and waiting for players to join.

The recommended default when there is no experience or history to look at is to set the Buffer Size to 10% of the Maximum Replicas.

Once there is some history to look at, the Buffer Size should be adjusted.
Important factors are the time it takes to start a new game server, the time for an average game session, and the average concurrent users (CCU) in that Region Type.

Example:
- Average game server startup time is 30 seconds.
- Average game session lasts 10 minutes.
- Average CCU is 300 players in that Region for a 3on3 game.

This means there are 50 allocated game servers on average.
Around 20% (30s/10m), which makes 10 game servers, must be ready at any given time, so the current player base is able to leave a game session and join a new one without waiting.

As this is only true in theory and there is never an even distribution, small peaks are not an exception but the norm, so it is better to add generous margin.

### Minimum Replicas

Unless there is a specific reason to do otherwise, the Minimum Replicas should be set to the Buffer Size.

## Scaling Down

To gracefully scale down a Region Type, the Minimum Replicas, the Maximum Replicas, and the Buffer Size must be set to zero.
