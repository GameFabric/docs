# Resource Management

This guide explains how to configure CPU and memory resources for your game servers on GameFabric. Proper resource configuration ensures optimal game performance while controlling costs.

## Overview

Your game servers run as containers with defined resource constraints. These constraints ensure fair resource sharing across multiple game servers on the same physical hardware while preventing any single server from consuming excessive resources that could impact other games.

## Resource Requests vs Limits

### Resource Requests
Resource **requests** are the minimum guaranteed resources for your game server. Think of this as a reservation - GameFabric ensures this amount is always available for your game server.

### Resource Limits
Resource **limits** are the maximum resources your game server can use. These act as hard caps that prevent your server from using more than the specified amount.

## CPU Resources

### CPU Requests
- **Purpose**: Guarantees minimum CPU time for your game server
- **Units**: Measured in millicores (e.g., `500m` = half a core, `1000m` = one full core)
- **Performance**: Your game server gets this amount of CPU time even when other servers are under heavy load

#### CPU Units Explained
We recommend using millicores (m) for clarity:
- `1000m` = 1 full CPU core
- `500m` = half a CPU core  
- `250m` = quarter of a CPU core

### CPU Limits
CPU limits control the maximum CPU your game server can use. When your server tries to use more CPU than its limit, it gets **throttled** (slowed down) rather than terminated.

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

**Our recommendation**: Only set CPU limits if you have specific requirements and thoroughly understand the performance implications.

### CPU Best Practices
- **Base requests on average usage**: Monitor your game server's typical CPU usage and set requests accordingly
- **Avoid CPU limits**: Unless you have specific requirements, skip CPU limits to prevent throttling issues
- **Use GameFabric monitoring**: Check the "Gameserver Resource usage (Percentiles)" dashboard for usage patterns
- **Target 80-90% node efficiency**: This provides burst capacity while maintaining performance

## Memory Resources

Memory management is simpler but has serious consequences when limits are exceeded.

### Memory Requests
- **Purpose**: Guarantees minimum memory availability for your game server
- **Units**: Measured in megabytes (Mi) or gigabytes (Gi) - e.g., `512Mi`, `2Gi`

**Important**: Setting memory requests too low can cause GameFabric to schedule more game servers on a node than it can actually support. This leads to nodes running at 100% memory capacity, causing unpredictable OOM kills even for servers that haven't exceeded their individual limits.

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

**Example**: If monitoring shows your game uses 300-400m CPU on average, set CPU request to `400m`.

### Step 3: Set Memory Requests and Limits

**Memory Request = Your game's baseline memory usage**
**Memory Limit = Peak memory usage + 10-20% safety margin**

- Monitor memory usage with and without players
- Account for memory growth during gameplay
- Include safety margin to prevent unexpected terminations

**Example**: If your game uses 800Mi baseline and peaks at 1.2Gi with players, set:
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
Shows CPU and memory usage across different percentiles (50th, 95th, 99th) and averages. Use this to:
- Set appropriate CPU requests based on average usage
- Identify memory usage patterns for setting limits
- Spot unusual spikes that might indicate performance issues

#### "Cluster Nodes USE Overview" 
Shows overall node resource utilization. Use this to:
- Monitor overall efficiency (target 80-90% utilization)
- Ensure your configuration isn't over-allocating resources
- Identify when to request additional capacity

### Key Metrics to Watch
- **CPU usage vs requests**: Ensure requests match actual average usage
- **Memory usage trends**: Prevent hitting memory limits
- **Memory usage patterns**: Look for gradual increases that might indicate memory leaks
