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

:::warning Probe results are not causally consistent with network issues
Failing probes do not necessarily indicate network issues, and network issues may occur even when all probes succeed. Probes only test specific routes from nodes to predefined targets.

The dashboard provides a limited view:

- Only one public, global endpoint is probed per cloud provider. Regional routes may behave differently.
- Probes target specific cloud services (for example, AWS S3), not the entire cloud platform. Other services on the same provider may be unaffected.
:::

### Best Practices

Full network reliability is not guaranteed. Nodes can occasionally experience network issues. To handle these issues, implement the following in your game servers:

- Retry failed connections.
- Gracefully terminate the game server after multiple connection attempts fail.
