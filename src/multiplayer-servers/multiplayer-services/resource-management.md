# Resource Management

This guide explains how to configure CPU and memory resources for your game servers on GameFabric.
Proper resource configuration ensures optimal game performance while controlling costs.

## Overview

Your game servers run as containers with defined resource constraints.
These constraints ensure fair resource sharing across multiple game servers on the same physical hardware while preventing
any single server from consuming excessive resources that could impact other games.

## Resource Requests vs Limits

### Resource Requests

Resource **requests** are the minimum guaranteed resources for your game server.
Think of this as a reservation — GameFabric ensures this amount is always available for your game server.

### Resource Limits

Resource **limits** are the maximum resources your game server can use.
These act as hard caps that prevent your server from using more than the specified amount.

## CPU Resources

### CPU Requests

- **Purpose**: Guarantees minimum CPU time for your game server
- **Units**: Measured in millicores (e.g., `500m` = half a core, `1000m` = one full core)
- **Performance**: Your game server gets this amount of CPU time even when other servers are under heavy load

#### CPU Units Explained

We recommend using millicores (`m`) for clarity:

- `1000m` = 1 full CPU core
- `500m` = half a CPU core  
- `250m` = quarter of a CPU core

#### How Fractional CPU Cores Work

::: info Important concept
Think of CPU cores as "time spent on the CPU" rather than physical cores.
When you request `1200m` (1.2 cores), your game server gets 1.2 CPU-seconds of processing time for every real-world second that passes.
:::

The operating system's scheduler automatically distributes your game server's threads across all available CPU cores on the physical machine, regardless of your CPU request amount.

#### Multithreading and CPU Requests

Game engines (Unreal Engine, Unity, Godot, etc.) create many threads for different systems (rendering, audio, networking, gameplay, etc.).
These threads are automatically distributed across available CPU cores by the operating system scheduler.

### CPU Limits

CPU limits control the maximum CPU your game server can use.
When your server tries to use more CPU than its limit, it gets **throttled** (slowed down) rather than terminated.

#### How CPU Throttling Works

- Your game server continues running but with reduced performance
- This can cause stuttering, lag, or frame rate drops
- Unlike memory limits, CPU limits don't terminate your game server

#### CPU Bursting

If there's unused CPU capacity available, your game server can temporarily use more CPU than its request (up to its limit) without being throttled.

**Example**: Your server has a 500m request and 1000m limit
- Normal operation: Uses 400m CPU ✓
- Sudden activity spike: Can burst to 900m CPU if available ✓  
- Heavy load: Gets throttled if trying to exceed 1000m CPU ⚠️

#### Why We Recommend Avoiding CPU Limits

- **Performance issues**: Throttling can cause noticeable game performance problems
- **Unpredictable behavior**: Throttling depends on overall server load
- **Complexity**: Requires extensive testing to set correctly

::: info Our recommendation
Only set CPU limits if you have specific requirements and thoroughly understand the performance implications.
:::

### CPU Best Practices

- **Base requests on average usage**: Monitor your game server's typical CPU usage and set requests accordingly
- **Avoid CPU limits**: Unless you have specific requirements, skip CPU limits to prevent throttling issues
- **Use GameFabric monitoring**: Check the "Gameserver Resource usage (Percentiles)" dashboard for usage patterns
- **Target 80-90% node efficiency**: This provides burst capacity while maintaining performance

#### Right-Sizing CPU Requests

**You can safely lower CPU requests** if your monitoring shows actual usage is consistently below your current request. This allows GameFabric to pack more game servers onto each physical machine, reducing your costs.

**Example scenario**: 
- Current setting: `2000m` CPU request
- Monitoring shows: Average usage of 400-600m, peaks of 800-1000m
- **Safe optimization**: Lower request to `1000m` or `1200m`
- **Result**: No performance impact, but ~50% cost reduction from better resource utilization

::: info Important
Requests are **minimums**, not **maximums**.
Your game server can use more CPU than requested when available, so lowering requests based on average usage won't hurt performance.
:::

## Memory Resources

Memory management is simpler but has serious consequences when limits are exceeded.

### Memory Requests

- **Purpose**: Guarantees minimum memory availability for your game server
- **Units**: Measured in megabytes (Mi) or gigabytes (Gi) - e.g., `512Mi`, `2Gi`

::: info Important
Setting memory requests too low can cause GameFabric to schedule more game servers on a node than it can actually support.
This leads to nodes running at 100% memory capacity, causing unpredictable OOM kills even for servers that haven't exceeded their individual limits.
:::

### Memory Limits and Game Server Termination

**Critical difference from CPU**: Memory cannot be throttled. When your game server exceeds its memory limit, it gets **immediately terminated**.

#### What Happens When Memory Limit is Exceeded

1. Your game server's memory usage reaches the limit
2. The system triggers an "Out of Memory" (OOM) kill
3. Your game server process is immediately terminated
4. The game session ends abruptly for all players

### Memory Best Practices

- **Set realistic limits**: Base limits on your game's actual memory usage during gameplay
- **Include safety margins**: Set limits 10-20% above normal peak usage to prevent unexpected terminations
- **Monitor closely**: Use GameFabric dashboards to track memory usage trends
- **Consider player count**: Empty servers typically use much less memory than servers with active players

## Configuring Your Game Server Resources

When creating game servers in GameFabric (through the UI or Terraform), you'll set CPU and memory values in the container configuration section. Here's how to determine the right values for your game.

### Step 1: Measure Your Game's Resource Usage

**Before setting any values**, run your game server and monitor its actual resource consumption:

1. Deploy with conservative (higher) initial values
2. Run typical gameplay scenarios
3. Monitor the "Gameserver Resource usage (Percentiles)" dashboard
4. Record average CPU and memory usage during normal operation

### Step 2: Set CPU Requests

**CPU Request = Your game's average CPU usage**

- Use millicores format (e.g., `250m`, `500m`, `1000m`)
- Base on measured average usage, not peak usage
- Start conservative and adjust based on monitoring data

**Example**: If monitoring shows your game server uses 300-400m CPU on average, set CPU request to `400m`.

#### Special Considerations

**Server startup**: Some game servers use more CPU during startup than during normal gameplay. If you're planning to start many servers simultaneously, monitor startup CPU usage separately and consider this in your planning.

**Burst capacity**: Even with lower CPU requests, your game servers can use more CPU when available. This burst capacity helps handle temporary spikes in processing needs without performance degradation.

### Step 3: Set Memory Requests and Limits

**Memory Request = Your game's baseline memory usage**
**Memory Limit = Peak memory usage + 10-20% safety margin**

- Monitor memory usage with and without players
- Account for memory growth during gameplay
- Include safety margin to prevent unexpected terminations

**Example**: If your game server uses 800Mi baseline and peaks at 1.2Gi with players, set:
- Memory Request: `800Mi`
- Memory Limit: `1.4Gi` (1.2Gi + 20% safety margin)

### Step 4: Avoid CPU Limits (Recommended)

Unless you have specific requirements, **do not set CPU limits**. CPU limits can cause performance issues through throttling, which leads to stuttering and lag in real-time games.

### Configuration Strategies by Development Phase

#### Development and Testing

- Start with generous values to avoid interruptions
- Memory limits: 30-50% above observed peak usage
- Focus on functionality over optimization
- Avoid CPU limits entirely

#### Production Launch

- Use conservative values initially to ensure stability
- Memory limits: 20-30% above observed peak usage  
- Plan to optimize downward after collecting real-world data
- Monitor closely for any performance issues

#### Mature Games

- Fine-tune based on historical usage data
- Memory limits: 10-20% above 95th percentile usage
- Consider different configurations for different game modes
- Regularly review and adjust based on game updates

## Monitoring Your Resource Usage

GameFabric provides monitoring dashboards to help you optimize your resource configuration.

### Key Dashboards

#### "Gameserver Resource usage (Percentiles)"

Shows CPU and memory usage across different percentiles (50th, 95th, 99th) and averages.

Use this to:

- Set appropriate CPU requests based on average usage
- Identify memory usage patterns for setting limits
- Spot unusual spikes that might indicate performance issues

#### "Cluster Nodes USE Overview" 

Shows overall node resource utilization.

Use this to:

- Monitor overall efficiency (target 80-90% utilization)
- Ensure your configuration isn't over-allocating resources
- Identify when to request additional capacity

### Key Metrics to Watch

- **CPU usage vs requests**: Ensure requests match actual average usage
- **Memory usage trends**: Prevent hitting memory limits
- **Memory usage patterns**: Look for gradual increases that might indicate memory leaks

## Frequently Asked Questions

### Will lowering my CPU request from 2000m to 1200m make my game server single-threaded?

**No.** CPU requests control the amount of processing time your game server receives, not the number of threads or physical cores it can use.
Game engines create multiple threads for different systems that automatically spread across all available CPU cores regardless of your CPU request setting.

### How does 1.2 CPU cores actually work? Is it 1 full core plus 20% of another?

**No.** Think of "1.2 cores" as "1.2 CPU-seconds of processing time per real second."
The operating system distributes your game server's threads across all available physical cores to provide this total amount of processing time.

**Example**: On an 8-core machine, your 1200m request could use small amounts of time across all 8 cores simultaneously, totaling 1.2 CPU-seconds per real second.

### Can I safely lower CPU requests if my monitoring shows low average usage?

**Yes.** CPU requests are minimums, not maximums.
If your game server averages 600m CPU but you've set 2000m requests, you can safely lower the request to around 800-1000m.
Your game server can still use more CPU when available (assuming no CPU limits are set).

### Will lowering CPU requests affect my game server's performance?

**Usually no.** As long as your new CPU request is close to your actual average usage (not peak usage), performance should be unaffected.
The system still allows your game server to use more CPU when available for handling spikes in activity (provided you haven't set CPU limits).

### What's the difference between CPU requests and CPU limits?

**Requests** are guaranteed minimums — your game server always gets at least this amount of CPU time.
**Limits** are hard maximums that trigger throttling when exceeded.

We recommend setting requests based on average usage and avoiding limits to prevent performance issues.
