# Dashboards

GameFabric provides predefined Grafana dashboards for monitoring your infrastructure.
You can find these under "Dashboards" in your Grafana instance.

## BBE Probes from Nodes

This dashboard shows BlackBox Exporter (BBE) probe results from each of your assigned nodes to predefined targets, including major cloud providers (AWS, Azure, GCP) and DNS servers (such as 1.1.1.1 and 8.8.8.8).

### Purpose

Use this dashboard to quickly identify whether game server issues are caused by network connectivity problems to a particular cloud provider rather than bugs in your application code.

### Interpreting the Dashboard

- **Red sections** indicate the timespan during which a probe failed.
- **Short probe failures** are usually nothing to worry about.
- **Prolonged failures** to a single target (for example, a cloud provider your game doesn't use, or a backup DNS server) may have no impact on your game servers.
- If probe failures to **multiple targets persist**, GameFabric automatically sets the status to degraded on [status.gamefabric.com](https://status.gamefabric.com).

### Best Practices

Nodes can occasionally experience network issues—100% reliability is not guaranteed. Game developers should implement their servers to be tolerant of network issues by:

- Retrying failed connections
- Gracefully terminating the game server after multiple connection attempts fail
